// src/i18n/messages/ja.ts
import type { ToolSlug } from "@/config/tools";

export default {
  app: {
    title: "Utilities",
    description: "エンジニア向けの便利ユーティリティ集",
  },
  menu: {
    utilities: "ユーティリティ一覧",
  },
  tools: {
    "password-generator": {
      name: "パスワード生成",
      description: "安全なランダムパスワードを生成します",
      generate: "生成",
      copy: "コピー",
      length: "長さ",
      lowercase: "小文字",
      uppercase: "大文字",
      numbers: "数字",
      symbols: "記号",
    },
    "unix-time": {
      name: "Unix Time 変換",
      description: "Unix Time と日時を相互変換します",
      unix: "Unix Time",
      datetime: "日時",
      milliseconds: "ミリ秒",
      now: "現在時刻",
      utc: "UTC",
      local: "ローカル",
    },
    "json-formatter": {
      name: "JSON 整形",
      description: "JSON を見やすくフォーマットします",
      input: "入力",
      output: "出力",
      format: "整形",
      minify: "圧縮",
      copy: "コピー",
      indent: "インデント",
      error: "JSON の形式が正しくありません",
    },
    "sql-formatter": {
      name: "SQL 整形",
      description: "SQL を見やすくフォーマットします",
      input: "入力",
      output: "出力",
      format: "整形",
      minify: "圧縮",
      copy: "コピー",
      indent: "インデント",
      error: "SQ: の形式が正しくありません",
    },
    "regex-tester": {
      name: "正規表現テスター",
      description: "正規表現をテストできます",
      pattern: "パターン",
      flags: "フラグ",
      testString: "テストする文字列",
      result: "結果",
    },
    "jwt-decoder": {
      name: "JWT デコーダ",
      description: "JWT をデコードします",
      token: "JWT トークン",
      header: "ヘッダ",
      payload: "ペイロード",
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } satisfies Record<ToolSlug, any>,
};
