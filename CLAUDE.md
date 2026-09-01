# CLAUDE.md

This file provides Claude Code project configuration and guidance.

## 概要

`hiramekun.dev` 配下の 2 サイトを持つモノレポ。Cloudflare Pages でホストし、
インフラは `infra/` の Terraform で管理する。

| ホスト | ワークスペース | Pages プロジェクト | dev |
|---|---|---|---|
| hiramekun.dev（プロフィール / リンク集） | `apps/profile` | `hiramekun-dev` | `localhost:3001` |
| blog.hiramekun.dev（ブログ） | `apps/blog` | `hiramekun-blog` | `localhost:3000` |

`notes.hiramekun.dev` は別リポジトリ（[tech-notes](https://github.com/hiramekun/tech-notes)）。

## Commands

### Development
- `npm run dev:blog` - ブログの開発サーバー（http://localhost:3000/）
- `npm run dev:profile` - プロフィールの開発サーバー（http://localhost:3001/）
- `npm run build` - 2 サイトとも静的出力を生成（`apps/*/out`）
- `npm run lint` / `npm run typecheck` - 2 サイト + Pages Functions

> **Note**: `basePath` は使っていないので、どちらもルート（`/`）で配信される。
> GitHub Pages 時代の `/my-blog` プレフィックスは廃止済み。

### UI変更後の表示確認
UIやリファクタリングの変更後は、`verify-site` skill でローカルの表示崩れを目視確認する。
`packages/theme/globals.css` を触ったときは 2 サイトとも確認すること。

### Deployment
`main` への push を **Cloudflare Pages の Git 連携**が見て自動デプロイする。
GitHub Actions はデプロイしない。

- `.github/workflows/ci.yml` - lint / typecheck / 2 サイトのビルド / terraform validate
- `.github/workflows/smoke-test.yml` - 公開後の死活監視（毎日 07:00 JST + 手動）

初期設定は [docs/setup-cloudflare.md](docs/setup-cloudflare.md)。

## Architecture

**静的サイト 2 つ** - Next.js 15 + TypeScript + Cloudflare Pages

### モノレポの約束
- npm workspaces。`package-lock.json` は**リポジトリ直下にしかない**
- Cloudflare Pages の root directory はリポジトリ直下のまま。
  `apps/<name>` に変えると lockfile もワークスペース依存も解決できずビルドが落ちる
- ビルドは `npm run build -w @hiramekun/<name>`、公開ディレクトリは `apps/<name>/out`

### ブログのコンテンツ
- **記事**: リポジトリ直下の `posts/` の Markdown/MDX（Obsidian の vault をそのまま使う）
- **読み込み**: `apps/blog/src/lib/posts.ts`。cwd が `apps/blog` なので 2 階層上を見る
- **Frontmatter**: `title`, `date`, `excerpt`, `tags`

### プロフィールのコンテンツ
- 載せるリンクは `apps/profile/src/lib/links.ts` の `LINKS` に集約。ここだけ触れば増やせる
- 自分のサイト（Blog / Tech Notes）も外部サービスも**同じカードで並べる**。区別しない
- **他社サービスへのリンクにロゴは使わない**。サービス名のテキストで出す。
  ロゴは商標で利用条件がサービスごとに違い、載せられるものと載せられないものが
  混在すると不揃いになるため。経緯は [docs/third-party-logos.md](docs/third-party-logos.md)

### 静的生成の設定
- `output: "export"` - 静的 HTML を生成
- `trailingSlash: true`
- `images: { unoptimized: true }` - static export のため

### ページ構成（ブログ）
- **Home** (`apps/blog/src/app/page.tsx`): 記事一覧（2カラム）
- **Articles** (`apps/blog/src/app/posts/[id]/page.tsx`)
- **Archive** (`apps/blog/src/app/archive/[year]/[month]/page.tsx`)
- **Header/Sidebar** (`apps/blog/src/components/`): 共通コンポーネント

### デザインシステム
- **トークン**: `packages/theme/theme.css`。**tech-notes と同じ値**を使う
  （ソースカラー `#B8E36B` / SchemeTonalSpot）。向こうを更新したらこちらにも反映する
- **コンポーネント**: `packages/theme/globals.css`。語彙も tech-notes に合わせる
  （`md-button--text` / `md-chip--outlined` / `md-card--interactive` など）
- **ブログ固有**: `apps/blog/src/app/globals.css`（記事本文 `.prose`）
- 取り込み順は `@import "tailwindcss"` → `@import "@hiramekun/theme/globals.css"`
- クラスは `@layer base` / `@layer components` に入れる。**レイヤーの外に書かないこと**。
  外に書くと Tailwind のユーティリティ（utilities レイヤー）より強くなり、
  `hidden` や `flex` を併記しても効かなくなる
- **ライト／ダーク**: `prefers-color-scheme` で切り替わる。片方だけ見て終わらせない
- フォントは webfont を読まず `--md-sys-typescale-plain-font` のスタックに任せる
- **Markdown**: `react-markdown` + `rehype-highlight`（XSS 安全）
- **レスポンシブ**: 2カラム（デスクトップ）↔ 1カラム（モバイル）
- **シンタックスハイライト**: highlight.js のテーマ CSS は読まず `--note-code-*` を使う
  （ライト／ダークの両方で読めるようにするため）

### アイコン
- **マスターは `packages/theme/icon.svg`**（ヒラメ + 閃きの光線）。**2 サイト共通**で使う
- favicon / apple-touch-icon / maskable / OGP は `npm run icons` で生成する。
  **生成物もコミットする**（CI では走らせない）。`rsvg-convert` が要る:
  `brew install librsvg`
- maskable だけ一段小さい。ヒラメは横長なので、Android が円や雫に切り抜いたとき
  尾と光線が欠けないよう中央 80% に収めている
- ヘッダーの記名は `apps/blog/src/components/BrandMark.tsx`。ライト／ダークで色を
  変えるためインライン SVG で持つ。**マスターと同じ形なので、片方を直したら両方直す**
- **`profile.png` は「人」、アイコンは「サイト」**。プロフィール欄のアバターと
  ヘッダーの記名は役割が違うので混ぜない。profile のリンクカードにも入れない
  （自分のサイトだけロゴ付きになると外部サービスと不揃いになる。
  [docs/third-party-logos.md](docs/third-party-logos.md) と同じ判断）
- OGP はブログだけ 1200x630 のダーク 1 枚（ソースは `apps/blog/assets/og-default.svg`、
  `summary_large_image`）。プロフィールは人のページなので `summary` + アバターのまま

### 記事の処理フロー
1. `posts/` の Markdown を `gray-matter` でパース
2. `react-markdown` で安全にレンダリング（XSS 対策）
3. GFM + `rehype-highlight` でシンタックスハイライト
4. 日付降順でソート

### メタデータ管理
- ブログ: `apps/blog/src/lib/metadata.ts`（OpenGraph / Twitter Card を一元化）
- プロフィール: `apps/profile/src/lib/metadata.ts`
- サイト間の URL は `apps/blog/src/lib/sites.ts` / `apps/profile/src/lib/links.ts`

## Pages Functions

`functions/_middleware.ts` を **2 つの Pages プロジェクトで共有**する。
差分は Terraform が渡す環境変数（`CANONICAL_HOST` / `PAGES_HOST`）だけ。

本番の `<project>.pages.dev` だけを正規ホストへ 301 で送り返し、
`<hash>.<project>.pages.dev` のプレビューは素通しする。

## Terraform

`infra/` に 2 つの Pages プロジェクト・DNS レコード・カスタムドメインを持つ。
state は R2（バケット `my-blog-tfstate`）。認証情報は `mise.local.toml`（gitignore 済み）。

```bash
terraform -chdir=infra init -backend-config=backend.hcl
terraform -chdir=infra plan
```

`terraform.tfvars` に書くのは `account_id` と `zone_id` だけ。
ホスト名やプロジェクト名は `infra/variables.tf` の default にある。

## TypeScript Config
- **Path Aliases**: `@/*` → 各アプリの `./src/*`
- **Important**: ユーティリティは各アプリの `src/` 配下に置く

## Security & Performance
- **XSS 対策**: `dangerouslySetInnerHTML` は使わない
- **npm audit**: 0 vulnerabilities を維持（`overrides` で postcss を固定している）
- **画像**: Next.js Image コンポーネント

## Common Issues
- **記事が出ない**: frontmatter の `date` が `YYYY-MM-DD` か確認
- **画像パス**: 静的ファイルは各アプリの `public/` に置く。プレフィックスは不要
- **Pages のビルドが落ちる**: root directory がリポジトリ直下のままか確認
- **環境変数が反映されない**: Pages の env は**デプロイ時**に確定する。apply 後に再デプロイする
