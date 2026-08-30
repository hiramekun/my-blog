import type { Metadata } from 'next';
import { SITES } from './sites';

// サイト共通設定
export const SITE_CONFIG = {
  name: 'ひらめのブログ',
  description: '日々の思考や学びを記録するブログ',
  url: SITES.blog,
  baseUrl: SITES.blog.replace(/\/$/, ''),
  author: 'hiramekun',
  // X のカードを自分のアカウントに紐づける (twitter:creator)
  xCreator: '@hiramekun_eng',
  locale: 'ja_JP',
  image: {
    // width/height は public/profile.png の実サイズと必ず合わせること
    url: '/profile.png',
    width: 460,
    height: 460,
    alt: 'ひらめのブログのプロフィール画像',
  },
} as const;

// メタデータオーバーライド用の型定義
export interface MetadataOptions {
  title?: string;
  description?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  authors?: string[];
  images?: Array<{
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  }>;
}

// デフォルトメタデータ生成関数
export function generateSiteMetadata(options: MetadataOptions = {}): Metadata {
  const {
    title = SITE_CONFIG.name,
    description = SITE_CONFIG.description,
    url = SITE_CONFIG.url,
    type = 'website',
    publishedTime,
    authors,
    images = [SITE_CONFIG.image],
  } = options;

  const fullTitle = title === SITE_CONFIG.name ? title : `${title} | ${SITE_CONFIG.name}`;

  return {
    metadataBase: new URL(SITE_CONFIG.baseUrl),
    title: fullTitle,
    description,
    icons: {
      icon: [
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      shortcut: '/favicon-32x32.png',
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      type,
      ...(publishedTime && { publishedTime }),
      ...(authors && { authors }),
      images,
    },
    twitter: {
      card: 'summary',
      title,
      description,
      creator: SITE_CONFIG.xCreator,
      images: images.map(img => img.url),
    },
  };
}

// 記事ページ用のメタデータ生成
export function generateArticleMetadata(
  title: string,
  description: string,
  slug: string,
  publishedTime?: string
): Metadata {
  return generateSiteMetadata({
    title,
    description,
    url: `${SITE_CONFIG.url}posts/${slug}/`,
    type: 'article',
    publishedTime,
    authors: [SITE_CONFIG.author],
  });
}

// カテゴリページ用のメタデータ生成
export function generateCategoryMetadata(
  categoryName: string,
  slug: string
): Metadata {
  return generateSiteMetadata({
    title: `${categoryName}の記事一覧`,
    description: `${categoryName}に関する記事の一覧ページです。`,
    url: `${SITE_CONFIG.url}category/${slug}/`,
  });
}

// アーカイブページ用のメタデータ生成
export function generateArchiveMetadata(
  year: string,
  month: string
): Metadata {
  return generateSiteMetadata({
    title: `${year}年${parseInt(month)}月の記事一覧`,
    description: `${year}年${parseInt(month)}月に投稿された記事の一覧ページです。`,
    url: `${SITE_CONFIG.url}archive/${year}/${month}/`,
  });
}