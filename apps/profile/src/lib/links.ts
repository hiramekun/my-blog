// このページはリンク集そのものなので、載せる情報はすべてここに集約する。
// 増やしたいリンクはこのファイルだけ触れば済む。

export const SITES = {
  profile: 'https://hiramekun.dev/',
  blog: 'https://blog.hiramekun.dev/',
  notes: 'https://notes.hiramekun.dev/',
} as const;

export const PROFILE = {
  name: 'hiramekun',
  role: 'ソフトウェアエンジニア',
  bio: '技術、教育、社会問題など、日々考えていることを書いています。',
  avatar: '/profile.png',
  // OGP に渡す avatar の実寸。public/profile.png の実サイズと必ず合わせること
  avatarSize: 460,
  // X のカードを自分のアカウントに紐づける (twitter:creator)
  xCreator: '@hiramekun_eng',
} as const;

export interface LinkItem {
  title: string;
  description: string;
  href: string;
}

// 自分のサイトも外部サービスのアカウントも同じ扱いで並べる。
//
// 各社のロゴは載せず、サービス名だけを出す。ロゴは商標で利用条件が
// サービスごとに違い、条件を満たせるものと満たせないものが混在すると
// 見た目が不揃いになるため。経緯は docs/third-party-logos.md を参照。
export const LINKS: LinkItem[] = [
  {
    title: 'Blog',
    description: '教育・キャリア・AI について考えたことを、腰を据えて長めの文章にまとめる場所',
    href: SITES.blog,
  },
  {
    title: 'Tech Notes',
    description: 'Claude で調べた技術トピックを 1 枚ずつのカードにまとめた、暗記もできるノート集',
    href: SITES.notes,
  },
  {
    title: 'GitHub',
    description: '個人開発のプログラムを集めている場所',
    href: 'https://github.com/hiramekun',
  },
  {
    title: 'X',
    description: '日々のつぶやき',
    href: 'https://x.com/hiramekun_eng',
  },
  {
    title: 'はてなブログ',
    description: '技術書やツールのメモから買って良かったものまで、日々のことを幅広く',
    href: 'https://hiramekun.hatenablog.com/',
  },
  {
    title: 'AtCoder',
    description: '主に学生の頃に精を出していた競技プログラミングの記録',
    href: 'https://atcoder.jp/users/hiramekun',
  },
];
