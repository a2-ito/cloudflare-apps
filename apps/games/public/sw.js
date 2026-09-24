/**
 * インストールとオフラインでの再プレイのための Service Worker。
 *
 * ゲームはどれもブラウザの中だけで動き、ログインもないので、一度開いた
 * ページとアセットは圏外でもそのまま遊べるようにキャッシュする。
 * 画面はネットワーク優先にして、つながるときは常に最新を見せる。
 * API（klondike のスコア送信など）は GET 以外なので触らない。
 */
const CACHE = "games-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith("games-") && k !== CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

/** 内容が URL ごとに固定される、キャッシュ優先で返してよいアセットか */
function isStaticAsset(url) {
  if (url.pathname.startsWith("/_next/static/")) return true;
  // public/ 以下の画像やフォント（トランプの絵札、favicon、アイコンなど）
  return /\.(?:svg|png|jpe?g|gif|webp|ico|woff2?)$/.test(url.pathname);
}

// klondike は配るたびに違うカードが出るので、一度開いた人には 52 枚すべてを
// 先にキャッシュしておく。合わせて 8MB ほどあるため、全員にインストール時に
// 落とさせるのではなく、klondike を開いたときにだけ取りに行く。
const SUITS = ["clubs", "diamonds", "hearts", "spades"];
const RANKS = [
  "ace",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "jack",
  "queen",
  "king",
];
const KLONDIKE_CARDS = SUITS.flatMap((suit) =>
  RANKS.map((rank) => `/klondike/cards/${rank}_of_${suit}.svg`),
);

async function cacheKlondikeCards() {
  const cache = await caches.open(CACHE);
  await Promise.all(
    KLONDIKE_CARDS.map(async (path) => {
      if (await cache.match(path)) return;
      const res = await fetch(path).catch(() => null);
      if (res?.ok) await cache.put(path, res);
    }),
  );
}

function putInCache(request, res) {
  if (res.ok && res.type === "basic") {
    const copy = res.clone();
    caches.open(CACHE).then((cache) => cache.put(request, copy));
  }
  return res;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (isStaticAsset(url)) {
    event.respondWith(
      caches
        .match(request)
        .then(
          (hit) =>
            hit ?? fetch(request).then((res) => putInCache(request, res)),
        ),
    );
    return;
  }

  // 画面遷移はネットワーク優先。圏外のときは前に開いたときの画面を返す
  if (request.mode === "navigate") {
    if (url.pathname === "/klondike" || url.pathname.startsWith("/klondike/")) {
      event.waitUntil(cacheKlondikeCards());
    }
    event.respondWith(
      fetch(request)
        .then((res) => putInCache(request, res))
        .catch(() =>
          caches.match(request).then(
            (hit) =>
              hit ??
              new Response(
                "オフラインです。一度開いたことのあるゲームは圏外でも遊べます。",
                {
                  status: 503,
                  headers: { "Content-Type": "text/plain; charset=utf-8" },
                },
              ),
          ),
        ),
    );
  }
});
