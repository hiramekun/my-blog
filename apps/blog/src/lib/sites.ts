// hiramekun.dev 配下で運用している 3 つのサイト。
// トップ(プロフィール)から blog / notes を辿れるようにしてあり、
// 各サイトのヘッダーからも相互に行き来できるようにしている。
export const SITES = {
  profile: 'https://hiramekun.dev/',
  blog: 'https://blog.hiramekun.dev/',
  notes: 'https://notes.hiramekun.dev/',
} as const;
