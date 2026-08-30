/**
 * <project>.pages.dev で来たリクエストを、正規のホスト名へ 301 で送り返す。
 *
 * Cloudflare Pages には本番の <project>.pages.dev を無効化する設定が無い。
 * 放っておくと同じサイトが 2 つのホストで配信され、検索エンジンから見て
 * 重複コンテンツになる。ルート直下の _middleware は静的アセットを含む
 * すべてのリクエストを通るので、ここで 1 つに寄せる。
 *
 * 弾くのは本番の pages.dev ホスト「だけ」に絞ってある。
 * <hash>.<project>.pages.dev のプレビューは素通しし、PR の確認に使えるようにする。
 *
 * このファイルは 2 つの Pages プロジェクト(プロフィールとブログ)で共有する。
 * 差分は Terraform が渡す環境変数だけ。
 */
interface Env {
  /** 正規のホスト名 (例: blog.hiramekun.dev) */
  CANONICAL_HOST?: string;
  /** 本番の pages.dev ホスト (例: hiramekun-blog.pages.dev) */
  PAGES_HOST?: string;
}

export const onRequest: PagesFunction<Env> = (context) => {
  const { CANONICAL_HOST, PAGES_HOST } = context.env;

  // 未設定なら素通しする。wrangler pages dev で localhost を叩くときのため
  if (!CANONICAL_HOST || !PAGES_HOST) return context.next();

  const url = new URL(context.request.url);
  if (url.hostname !== PAGES_HOST) return context.next();

  url.protocol = "https:";
  url.hostname = CANONICAL_HOST;
  url.port = "";
  return Response.redirect(url.toString(), 301);
};
