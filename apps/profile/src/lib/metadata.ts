import type { Metadata } from 'next';
import { PROFILE, SITES } from './links';

const TITLE = `${PROFILE.name} — ${PROFILE.role}`;
const DESCRIPTION = `${PROFILE.name} のプロフィールとリンク集。ブログ・技術ノート・GitHub などはここから辿れます。`;

export function generateSiteMetadata(): Metadata {
  return {
    metadataBase: new URL(SITES.profile),
    title: TITLE,
    description: DESCRIPTION,
    icons: {
      // ブログと同じアイコン。実体は packages/theme/icon.svg で、
      // PNG も含めて `npm run icons` が生成する
      icon: [
        { url: '/icon.svg', type: 'image/svg+xml' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png',
      shortcut: '/favicon-32x32.png',
    },
    manifest: '/site.webmanifest',
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: SITES.profile,
      siteName: PROFILE.name,
      locale: 'ja_JP',
      type: 'profile',
      username: PROFILE.name,
      images: [
        {
          url: PROFILE.avatar,
          width: PROFILE.avatarSize,
          height: PROFILE.avatarSize,
          alt: `${PROFILE.name} のプロフィール画像`,
        },
      ],
    },
    twitter: {
      // プロフィール/リンク集なので、正方形のアバターが出る summary が合う。
      // 記事のように大きなバナーを出す用途ではない
      card: 'summary',
      title: TITLE,
      description: DESCRIPTION,
      creator: PROFILE.xCreator,
      images: [PROFILE.avatar],
    },
  };
}
