# Exam-Lab

Next.js + Cloudflare Workers + D1 を使った
**資格試験向けの問題管理・学習支援アプリ**です。

- 試験（資格）・試験日程を管理
- 問題を試験・日程単位で登録
- Google 認証（許可ユーザのみ利用可）
- 管理者向け UI を中心に設計

---

## ✨ 主な機能

### 🔐 認証

- Google 認証
- 事前に許可されたユーザのみログイン可能
- middleware によるページガード

### 📝 問題管理

- 問題の登録 / 編集 / 削除
- 問題一覧・問題詳細表示
- 試験（資格）・試験日程と紐づけ

### 🗂 試験・日程管理

- 試験一覧管理（例：基本情報技術者試験）
- 試験日程（回次）管理（例：2025年 春期）
- 試験 → 日程 → 問題 の階層構造

### 🎨 UI

- Next.js App Router
- ダークモード対応
- 管理画面向けシンプル UI
- favicon / app icon 対応

---

## 🏗 技術スタック

| 分類           | 技術                   |
| -------------- | ---------------------- |
| フロントエンド | Next.js (App Router)   |
| 実行環境       | Cloudflare Workers     |
| DB             | Cloudflare D1 (SQLite) |
| ORM            | Drizzle ORM            |
| 認証           | Google OAuth           |
| デプロイ       | Cloudflare Pages       |
| スタイル       | Tailwind CSS           |
