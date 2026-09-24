/**
 * PWA 用のアイコン PNG を生成する。
 *
 * 画像ライブラリを足さずに済ませたいので、4 倍の解像度で単純に塗ってから
 * 縮小して滑らかにし、zlib で PNG を書き出している。
 * デザインを変えたら `node scripts/gen-icons.mjs` で作り直す。
 * 描画と PNG 出力は apps/tabilog/scripts/gen-icons.mjs と同じもので、図柄だけ違う。
 */
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const OUT_DIR = join(process.cwd(), "public", "icons");

const BG = [47, 111, 219, 255]; // トップページの --accent
const PAD = [255, 255, 255, 255];
const MARK = [47, 111, 219, 255];
const SS = 4; // スーパーサンプリング倍率

/* ── 画素バッファ ───────────────────────────────────────────── */

function createCanvas(size) {
  return { size, data: new Uint8Array(size * size * 4) };
}

function setPixel(canvas, x, y, color) {
  if (x < 0 || y < 0 || x >= canvas.size || y >= canvas.size) return;
  const i = (y * canvas.size + x) * 4;
  canvas.data[i] = color[0];
  canvas.data[i + 1] = color[1];
  canvas.data[i + 2] = color[2];
  canvas.data[i + 3] = color[3];
}

/** 角丸の内側かどうか。r=0 なら普通の矩形 */
function insideRoundRect(x, y, x0, y0, x1, y1, r) {
  if (x < x0 || y < y0 || x > x1 || y > y1) return false;
  if (r <= 0) return true;
  const cx = x < x0 + r ? x0 + r : x > x1 - r ? x1 - r : x;
  const cy = y < y0 + r ? y0 + r : y > y1 - r ? y1 - r : y;
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
}

function fillRoundRect(canvas, x0, y0, x1, y1, r, color) {
  for (let y = Math.floor(y0); y <= Math.ceil(y1); y++) {
    for (let x = Math.floor(x0); x <= Math.ceil(x1); x++) {
      if (insideRoundRect(x + 0.5, y + 0.5, x0, y0, x1, y1, r))
        setPixel(canvas, x, y, color);
    }
  }
}

/** 4x4 の平均を取って縮小する（縁を滑らかにするため） */
function downsample(canvas, factor) {
  const size = canvas.size / factor;
  const out = createCanvas(size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      for (let dy = 0; dy < factor; dy++) {
        for (let dx = 0; dx < factor; dx++) {
          const i = ((y * factor + dy) * canvas.size + (x * factor + dx)) * 4;
          r += canvas.data[i];
          g += canvas.data[i + 1];
          b += canvas.data[i + 2];
          a += canvas.data[i + 3];
        }
      }
      const n = factor * factor;
      setPixel(out, x, y, [
        Math.round(r / n),
        Math.round(g / n),
        Math.round(b / n),
        Math.round(a / n),
      ]);
    }
  }
  return out;
}

/* ── アイコンの図柄 ─────────────────────────────────────────── */

function fillCircle(canvas, cx, cy, r, color) {
  for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++) {
    for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
      if ((x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2 <= r * r)
        setPixel(canvas, x, y, color);
    }
  }
}

/**
 * ゲームパッドを描く。
 * maskable は端が切り落とされるため、地の色を全面に敷いて図柄を内側に寄せる。
 */
function drawIcon(size, { maskable }) {
  const canvas = createCanvas(size);
  const bgRadius = maskable ? 0 : size * 0.22;
  fillRoundRect(canvas, 0, 0, size - 1, size - 1, bgRadius, BG);

  // 図柄を置く正方形（maskable は安全領域に収める）
  const scale = maskable ? 0.6 : 0.72;
  const box = size * scale;
  const ox = (size - box) / 2;
  const oy = (size - box) / 2;
  const u = (v) => box * v;

  // 本体と左右のグリップ
  fillRoundRect(
    canvas,
    ox + u(0.04),
    oy + u(0.26),
    ox + u(0.96),
    oy + u(0.66),
    u(0.2),
    PAD,
  );
  fillCircle(canvas, ox + u(0.2), oy + u(0.62), u(0.16), PAD);
  fillCircle(canvas, ox + u(0.8), oy + u(0.62), u(0.16), PAD);

  // 十字キー
  fillRoundRect(
    canvas,
    ox + u(0.14),
    oy + u(0.42),
    ox + u(0.38),
    oy + u(0.5),
    u(0.02),
    MARK,
  );
  fillRoundRect(
    canvas,
    ox + u(0.22),
    oy + u(0.34),
    ox + u(0.3),
    oy + u(0.58),
    u(0.02),
    MARK,
  );

  // ボタン
  fillCircle(canvas, ox + u(0.72), oy + u(0.4), u(0.05), MARK);
  fillCircle(canvas, ox + u(0.8), oy + u(0.52), u(0.05), MARK);

  return canvas;
}

/* ── PNG 出力 ──────────────────────────────────────────────── */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, "ascii");
  const body = Buffer.concat([typeBytes, data]);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

function encodePng(canvas) {
  const { size, data } = canvas;
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  // 10..12 は圧縮方式・フィルタ方式・インターレースで、いずれも 0

  // 各行の先頭にフィルタ種別のバイトを置く（0 = フィルタなし）
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    const rowStart = y * (size * 4 + 1);
    raw[rowStart] = 0;
    Buffer.from(data.buffer, y * size * 4, size * 4).copy(raw, rowStart + 1);
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function write(name, size, opts = {}) {
  const canvas = downsample(
    drawIcon(size * SS, { maskable: false, ...opts }),
    SS,
  );
  const file = join(OUT_DIR, name);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, encodePng(canvas));
  console.log(`${name} (${size}x${size})`);
}

write("icon-192.png", 192);
write("icon-512.png", 512);
write("icon-maskable-512.png", 512, { maskable: true });
// iOS のホーム画面用。角丸は OS 側が付けるので四角いまま出す
write("apple-touch-icon.png", 180, { maskable: true });
write("favicon-32.png", 32);
