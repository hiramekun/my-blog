# My Tech Blog

バックエンドエンジニアの技術ブログです。Go/Java/Scalaでの開発経験を中心に技術的な内容を共有しています。

🌐 **Live Site**: https://hiramekun.github.io/my-blog/

## 技術構成

このブログは以下の技術で構築されています：

### フロントエンド
- **[Next.js 15](https://nextjs.org/)** - Reactフレームワーク（App Router使用）
- **[TypeScript](https://www.typescriptlang.org/)** - 型安全な開発
- **[Tailwind CSS](https://tailwindcss.com/)** - ユーティリティファーストCSSフレームワーク
- **[@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin)** - Markdownコンテンツのスタイリング

### コンテンツ管理
- **[Markdown](https://www.markdownguide.org/)** / **[MDX](https://mdxjs.com/)** - ブログ記事の執筆形式
- **[gray-matter](https://github.com/jonschlinkert/gray-matter)** - フロントマターの解析
- **[marked](https://marked.js.org/)** - 高性能なMarkdownプロセッサー
- **[highlight.js](https://highlightjs.org/)** - コードブロックのシンタックスハイライト

### デプロイメント
- **[GitHub Pages](https://pages.github.com/)** - 静的サイトホスティング
- **[GitHub Actions](https://github.com/features/actions)** - CI/CDパイプライン

## プロジェクト構成

```
my-blog/
├── posts/                    # ブログ記事（Markdown/MDX）
│   ├── first-post.md
│   └── go-performance-tips.md
├── src/
│   ├── app/
│   │   ├── globals.css       # グローバルスタイル・カスタムCSS
│   │   ├── page.tsx          # ホームページ（記事一覧）
│   │   └── posts/
│   │       └── [id]/
│   │           └── page.tsx  # 個別記事ページ
│   ├── components/
│   │   ├── Header.tsx        # ヘッダーコンポーネント
│   │   └── Sidebar.tsx       # サイドバーコンポーネント
│   └── lib/
│       └── posts.ts         # 記事データ処理ユーティリティ
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions設定
└── next.config.ts           # Next.js設定（静的エクスポート用）
```

## 開発環境のセットアップ

### 前提条件
- Node.js 18以上
- npm または yarn

### 手順

1. **リポジトリのクローン**
   ```bash
   git clone <repository-url>
   cd my-blog
   ```

2. **依存関係のインストール**
   ```bash
   npm install
   ```

3. **開発サーバーの起動**
   ```bash
   npm run dev
   ```
   
   [http://localhost:3000](http://localhost:3000) でブログが確認できます。

## ブログ記事の作成方法

### 1. 記事ファイルの作成

`posts/` フォルダに新しいMarkdownファイル（`.md` または `.mdx`）を作成します。

```bash
posts/new-article.md
```

### 2. フロントマターの設定

記事の先頭に以下の形式でメタデータを記述します：

```yaml
---
title: "記事のタイトル"
date: "2025-01-24"
excerpt: "記事の概要（省略可能）"
tags: ["tag1", "tag2"]  # 省略可能
---
```

### 3. コンテンツの執筆

フロントマターの後に、Markdown形式で記事を執筆します：

```markdown
---
title: "Go言語のパフォーマンス最適化"
date: "2025-01-24"
excerpt: "Go言語でのパフォーマンス最適化テクニックを紹介"
tags: ["Go", "パフォーマンス"]
---

# Go言語のパフォーマンス最適化

この記事では...

## セクション1

内容...

```go
// コードサンプル
func example() {
    fmt.Println("Hello, World!")
}
```

### 4. プレビュー

開発サーバーを起動している場合、ファイルを保存すると自動的にブラウザに反映されます。

## 変更の反映とデプロイ

### 自動デプロイ（推奨）

1. **記事をコミット**
   ```bash
   git add posts/new-article.md
   git commit -m "Add new article: Go言語のパフォーマンス最適化"
   ```

2. **GitHubにプッシュ**
   ```bash
   git push origin main
   ```

3. **自動デプロイ**
   - GitHub Actionsが自動的に実行されます
   - 約2-3分後にGitHub Pagesサイトに反映されます

### GitHub Pagesの設定

初回のみ、GitHubリポジトリで以下の設定が必要です：

1. リポジトリの **Settings** → **Pages** に移動
2. **Source** を **GitHub Actions** に設定
3. 自動的に `.github/workflows/deploy.yml` が認識されます

### 手動ビルド

ローカルで静的ファイルを生成する場合：

```bash
npm run build
```

生成されたファイルは `out/` フォルダに出力されます。

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動（要ビルド）
npm run start

# リント実行
npm run lint
```

## デザイン・UI

### ダークテーマデザイン

このブログは**ダークテーマ**を採用した読みやすいデザインになっています：

- **2カラムレイアウト**: メインコンテンツ + 機能的なサイドバー
- **ダークカラーパレット**: ダークグレー背景、明るいテキスト、青系アクセント
- **読みやすいタイポグラフィ**: 適切な行間、見出し階層、高コントラスト文字
- **CSS変数ベース**: 色の一元管理で簡単にテーマ変更可能

### UI コンポーネント

- **ヘッダー**: ブログタイトル、プロフィール画像、説明文
- **サイドバー**: プロフィール、カテゴリ一覧、月別アーカイブ、最近の記事
- **記事カード**: タイトル、日付、タグ、概要、「続きを読む」リンク

### マークダウンレンダリング

- **シンタックスハイライト**: Go/Java/Scala等のコードブロックをカラー表示
- **GitHub Darkテーマ**: 暗い背景に見やすいコードカラーリング
- **見出し階層**: H1〜H3の適切なサイズとスタイリング
- **インラインコード**: 赤文字でコード要素を強調

### レスポンシブ対応

- **デスクトップ**: 2カラム（メイン + サイドバー）
- **タブレット・モバイル**: 1カラム（サイドバーが下に移動）

## カスタマイズ

### テーマカラーの変更

ブログのテーマ色は `src/app/globals.css` の `:root` セクションで一元管理されています：

```css
:root {
  /* ダークテーマカラー変数 */
  --bg-primary: #111827;      /* メイン背景色 */
  --bg-secondary: #1f2937;    /* カード背景色 */
  --text-primary: #f9fafb;    /* メインテキスト色 */
  --text-secondary: #d1d5db;  /* サブテキスト色 */
  --accent-primary: #60a5fa;  /* アクセント色 */
  /* ... その他の色設定 */
}
```

ライトテーマに変更したい場合は、これらの値を明るい色に変更するだけです。

### サイト情報の変更

- **ヘッダー**: `src/components/Header.tsx` でブログタイトルと説明を変更
- **プロフィール**: `src/components/Sidebar.tsx` でプロフィール情報を変更

### スタイルの調整

- **基本スタイリング**: `src/app/globals.css` でCSS変数とマークダウン表示を調整
- **コンポーネントスタイル**: テーマベースのUtilityクラス（`.bg-theme-primary`など）を使用

### MDXコンポーネント

`.mdx` ファイルでは、Reactコンポーネントを使用できます。カスタムコンポーネントは `src/components/` フォルダに作成し、MDXで利用できます。

## トラブルシューティング

### ビルドエラーが発生する場合

1. **フロントマターの形式**を確認してください
2. **日付形式**が `YYYY-MM-DD` になっているか確認してください
3. **パスエイリアス問題**: `@/lib/posts` が解決できない場合
   - `src/lib/posts.ts` が正しい場所にあるか確認
   - `tsconfig.json` の `paths` 設定を確認
4. **依存関係の問題**: `npm run lint` でコードの問題をチェック
5. **Node.js版本問題**: 必要に応じて `rm -rf node_modules package-lock.json && npm install` で再インストール

### GitHub Pagesにデプロイされない場合

1. GitHub Actionsのログを確認してください
2. リポジトリのPages設定が正しいか確認してください
3. `main` ブランチにプッシュしているか確認してください

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。
