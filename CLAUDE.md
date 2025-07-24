# CLAUDE.md

このファイルはClaude Code用のプロジェクト設定です。

## コマンド

### 開発
- `npm run dev` - 開発サーバー起動
- `npm run build` - 静的サイト生成（`out/`に出力）
- `npm run lint` - ESLintチェック

### デプロイ
GitHub Actionsで自動デプロイ（`.github/workflows/deploy.yml`）。`main`ブランチへのpushで自動実行。

## アーキテクチャ

**静的ブログサイト** - Next.js 15 + TypeScript + GitHub Pages

### ブログコンテンツ
- **記事**: `posts/`ディレクトリのMarkdown/MDXファイル
- **処理**: `src/lib/posts.ts`で記事読み込み・解析
- **フロントマター**: `title`, `date`, `excerpt`, `tags`

### 静的生成設定
- `output: "export"` - 静的HTML生成
- `trailingSlash: true` - GitHub Pages用
- `basePath: "/my-blog"` - サブパス対応
- `images: { unoptimized: true }` - 静的エクスポート用

### ページ構造
- **ホーム** (`src/app/page.tsx`): 記事一覧（2カラムレイアウト）
- **記事** (`src/app/posts/[id]/page.tsx`): 個別記事ページ
- **アーカイブ** (`src/app/archive/[year]/[month]/page.tsx`): 月別記事一覧
- **Header/Sidebar** (`src/components/`): 共通コンポーネント

### デザインシステム
- **ダークテーマ**: GitHubダークカラーパレット（`src/app/globals.css`）
- **CSS変数**: テーマ色の一元管理
- **Markdownレンダリング**: `marked.js` + `highlight.js` + 脚注サポート
- **レスポンシブ**: 2カラム（デスクトップ）↔ 1カラム（モバイル）

### 記事処理
1. `posts/`のMarkdownファイルを`gray-matter`で解析
2. `marked.js`でHTML変換（GitHub Flavored Markdown + 脚注）
3. `highlight.js`でシンタックスハイライト適用
4. 日付順ソート（新しい順）

## TypeScript設定
- **パスエイリアス**: `@/*` → `./src/*`
- **重要**: ユーティリティは`src/`内に配置（`src/lib/posts.ts`）

## GitHub Pages
- **ライブURL**: https://hiramekun.github.io/my-blog/
- **デプロイ**: GitHub Actionsで`out/`ディレクトリをデプロイ
- **設定**: Pages設定を「GitHub Actions」に設定

## よくある問題
- **ビルドエラー**: `src/`内にファイルがあるか確認
- **記事が表示されない**: フロントマターの日付形式を確認（`YYYY-MM-DD`）
- **画像パス**: 静的ファイルは`public/`に配置、`/my-blog/`プレフィックス必要