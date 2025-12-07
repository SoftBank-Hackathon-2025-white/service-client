# 🌊 Lambda the Sea

<div align="center">

**Serverless Lambdaを透明な海のように可視化するObservabilityプラットフォーム**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**言語 / Language:** [🇯🇵 日本語](README.md) | [🇰🇷 한국어](README.ko.md) | [🇺🇸 English](README.en.md)

</div>

---

## 📝 プロジェクト概要

**Lambda the Sea**は、ECSベースのServerlessモデルで様々な言語を実行でき、Lambdaが提供しなかったステップバイステップの実行フロー可視化を通じてWhitebox Executionを提供するObservabilityプラットフォームです。

### 🎯 ハッカソンテーマ

従来のServerless環境では不透明だった実行プロセスを「透明な海」のように可視化し、開発者がLambda関数の動作を直感的に理解できるようにすることを目指しました。

---

## ✨ 主な機能

### 1. 🔍 Whitebox Execution

- ステップバイステップの実行フロー可視化
- リアルタイム実行状態モニタリング
- 詳細なログとトレース情報

### 2. 🚀 Multi-Language Support

- ECSベースのServerlessモデル
- 様々なプログラミング言語に対応
- 柔軟な実行環境

### 3. 📊 プロジェクト管理

- プロジェクト一覧と詳細情報
- 実行履歴の追跡
- ステータスベースのフィルタリング

### 4. 🎨 直感的なUI/UX

- モダンで使いやすいインターフェース
- リアルタイムメトリクス表示
- ダークモード対応

---

## 🛠️ 技術スタック

### フロントエンド

- **React 19** - 最新のReactフレームワーク
- **TypeScript** - 型安全な開発
- **Vite** - 高速なビルドツール
- **Styled Components** - CSS-in-JS
- **React Router v7** - ルーティング

### 状態管理 & データフェッチング

- **Zustand** - 軽量な状態管理
- **TanStack Query** - サーバー状態管理
- **Axios** - HTTPクライアント
- **Immer** - イミュータブル状態更新

### UI/UX

- **ECharts** - データビジュアライゼーション
- **Framer Motion** - 滑らかなアニメーション
- **Lucide React** - アイコンライブラリ

### 開発ツール

- **MSW (Mock Service Worker)** - API モッキング
- **ESLint** - コード品質
- **Prettier** - コードフォーマット

---

## 🚀 クイックスタート

### 前提条件

- Node.js 18以上
- pnpm（推奨）または npm

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd service-client

# 依存パッケージをインストール
pnpm install

# 環境変数の設定
cp .env.example .env
# .envファイルを編集してMSWのon/offを設定

# 開発サーバーを起動
pnpm dev
```

### 環境変数の設定

`.env`ファイルで以下の設定が可能です：

| 変数名              | 説明                                                                                     | デフォルト値            |
| ------------------- | ---------------------------------------------------------------------------------------- | ----------------------- |
| `VITE_ENABLE_MSW`   | MSWモックを有効化するか<br/>`true`: モックAPI使用<br/>`false`: 実際のバックエンドAPI使用 | `true`                  |
| `VITE_API_BASE_URL` | バックエンドAPIのベースURL<br/>（MSW無効時に使用）                                       | `http://localhost:8000` |

**例: MSWを無効にして実際のバックエンドを使用する場合**

```env
VITE_ENABLE_MSW=false
VITE_API_BASE_URL=http://localhost:8000
```

### アクセス

ブラウザで `http://localhost:5173` にアクセスしてください。

---

## 📦 プロジェクト構成

```
service-client/
├── src/
│   ├── api/               # API通信
│   │   ├── _client.ts    # Axios クライアント
│   │   ├── execution.ts  # 実行関連API
│   │   ├── monitoring.ts # モニタリングAPI
│   │   └── project.ts    # プロジェクト管理API
│   ├── components/        # Reactコンポーネント
│   │   ├── common/       # 共通コンポーネント
│   │   ├── pages/        # ページコンポーネント
│   │   ├── pipeline/     # パイプライン実行ステップ
│   │   └── whiteboard/   # データ可視化
│   ├── constants/        # 定数定義
│   ├── mocks/            # MSW モック
│   ├── types/            # TypeScript型定義
│   ├── utils/            # ユーティリティ関数
│   └── theme/            # テーマ設定
├── public/               # 静的ファイル
└── index.html           # エントリーポイント
```

---

## 🧪 開発モード

### MSW（Mock Service Worker）

バックエンドなしでフロントエンド開発ができるよう、MSWでAPIをモックしています。

**プロジェクト実行シミュレーション:**

- リアルタイムログストリーミング
- ステータス遷移の可視化
- メトリクス収集とモニタリング

---

## 📱 主な画面

### 1. ランディングページ (`/`)

プロジェクトの紹介と主な機能を表示します。

### 2. プロジェクトリスト (`/projects`)

- プロジェクト一覧表示
- ステータスフィルタリング
- 検索機能
- 新規プロジェクト作成

### 3. プロジェクト詳細 (`/projects/:id`)

- 実行履歴
- 詳細メトリクス
- ログビューアー
- 実行管理

### 4. Whiteboard (`/whiteboard`)

- システムメトリクスの可視化
- リアルタイムモニタリング
- パフォーマンス分析

---

## 🎯 今後の拡張計画

- [ ] より詳細な実行フロー分析機能
- [ ] マルチリージョン対応
- [ ] コスト最適化提案機能
- [ ] チーム協業機能

---

## 👥 チーム

**Lambda the Sea Team**

- Software Engineer × 5名

---

## 🙏 謝辞

このプロジェクトはハッカソンのために開発されました。
Serverless開発をより透明で、理解しやすいものにすることを目指しています。

---

<div align="center">

**Made with ❤️ and 🌊**

</div>
