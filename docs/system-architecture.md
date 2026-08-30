# システム構成

![hiramekun.dev のシステム構成図](./system-architecture.svg)

## 図の読み方

1. 記事はリポジトリ直下の `posts/*.md` に置きます。このディレクトリは Obsidian の vault でもあり、ブログのビルドはモノレポの2階層上にある記事を読み込みます。
2. 1つの GitHub リポジトリに、プロフィール、ブログ、共通テーマ、Pages Functions、Terraform をまとめています。`main` が本番ブランチです。
3. GitHub Actions の CI は push と pull request で lint、型検査、2サイトの静的ビルド、Terraform の検証を行います。デプロイ自体は行いません。
4. `main` への push を Cloudflare Pages の Git 連携が検知し、`@hiramekun/profile` と `@hiramekun/blog` を別々の Pages プロジェクトとしてビルドします。どちらも Next.js の `output: "export"` による静的出力です。
5. `functions/_middleware.ts` は2つの Pages プロジェクトで共有します。本番の `<project>.pages.dev` だけを正規ホストへ 301 リダイレクトし、カスタムドメインと `<hash>.<project>.pages.dev` の PR preview はそのまま通します。
6. Cloudflare DNS の proxied CNAME と Pages custom domain により、プロフィールを `hiramekun.dev`、ブログを `blog.hiramekun.dev` で配信します。
7. GitHub Actions の smoke test は毎日 07:00 JST に公開中の2サイトと代表記事を確認します。
8. Terraform は2つの Pages プロジェクト、GitHub 連携、ビルド設定、環境変数、DNS、カスタムドメインを管理します。state は Cloudflare R2 の S3 互換 API に保存します。

## 線の意味

- 実線: 執筆またはブラウザからの実行時リクエスト
- 破線: GitHub Actions、Pages の Git 連携、ビルド、監視
- 点線: Terraform と R2 による管理経路

## 実装上の境界

- GitHub Actions は品質確認と公開後の死活監視を担当し、デプロイは Cloudflare Pages の Git 連携が担当します。
- Pages Functions は正規ホストへのリダイレクトだけを担当し、アプリケーション API やデータベースは持ちません。
- R2 は Terraform state の保存先であり、ブログ記事やプロフィールの実行時データストアではありません。
- `notes.hiramekun.dev` は別リポジトリのため、この図のデプロイ対象には含めていません。

## アイコンの出典

2026-08-31 に各一次配布元を確認し、SVG の中へ埋め込みました。外部 URL が切れても図自体は表示できます。

- Obsidian: [Obsidian Brand Guidelines](https://obsidian.md/brand) の公式グラデーション SVG
- GitHub: [GitHub Brand Toolkit](https://brand.github.com/foundations/logo) の Invertocat
- Next.js: [Vercel の Next.js Brand Assets](https://vercel.com/geist/brands#next.js)
- Cloudflare Pages / Workers / DNS / R2 / Terraform: [Cloudflare 公式ドキュメントの product icons](https://github.com/cloudflare/cloudflare-docs/tree/production/src/icons)
- Terraform の名称とロゴの利用条件: [HashiCorp Trademark Policy](https://www.hashicorp.com/en/trademark-policy)

各製品名・ロゴは各権利者に帰属し、この図は本プロジェクトが各社から承認・推奨されていることを示すものではありません。
