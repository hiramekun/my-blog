'use client';

import { useEffect, useState } from 'react';
import { SITE_CONFIG } from '@/lib/metadata';

/**
 * 記事のシェア導線（X / はてなブックマーク）。
 *
 * 各サービスの公式ボタン（スクリプト埋め込み）は使わない。
 * 出てくるのは各社の色とロゴを持った四角いボタンで、単色の M3 に混ぜると浮くうえ、
 * ロゴの利用条件はサービスごとに違う（docs/third-party-logos.md）。
 * ここではテキストのチップに揃えて、リンク先だけ各サービスに向ける。
 */
interface ShareButtonsProps {
  /** 記事タイトル。X の投稿本文に載せる */
  title: string;
  /** サイトルートからのパス（例: /posts/foo/） */
  path: string;
}

// はてなのブックマーク数 API は CORS ヘッダを返さないので fetch では読めない。
// callback を付けると `cb(12)` を text/javascript で返すので、JSONP で取る。
const HATENA_COUNT_ENDPOINT = 'https://bookmark.hatenaapis.com/count/entry';

// 同じページに複数置いてもコールバック名がぶつからないようにする
let callbackSeq = 0;

function useHatenaCount(url: string): number | null {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const name = `__hatenaBookmarkCount${callbackSeq++}`;
    const globals = window as unknown as Record<string, unknown>;
    let cancelled = false;

    globals[name] = (value: unknown) => {
      delete globals[name];
      if (!cancelled && typeof value === 'number') setCount(value);
    };

    // 取れなければ件数を出さないだけ。ボタン自体はそのまま使える
    const script = document.createElement('script');
    script.src = `${HATENA_COUNT_ENDPOINT}?url=${encodeURIComponent(url)}&callback=${name}`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      cancelled = true;
      script.remove();
    };
  }, [url]);

  return count;
}

export default function ShareButtons({ title, path }: ShareButtonsProps) {
  // シェア先には常に本番の URL を渡す。localhost を共有しても意味がないため
  const url = `${SITE_CONFIG.baseUrl}${path}`;
  const count = useHatenaCount(url);

  const xUrl = `https://x.com/intent/post?text=${encodeURIComponent(
    `${title} ${SITE_CONFIG.xCreator}`
  )}&url=${encodeURIComponent(url)}`;
  // ?url= 形式ならエスケープを自分で組み立てなくてよい。コメント一覧とブックマーク追加の両方がある
  const hatenaUrl = `https://b.hatena.ne.jp/entry?url=${encodeURIComponent(url)}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a href={xUrl} target="_blank" rel="noopener noreferrer" className="md-chip md-chip--outlined">
        X でシェア
      </a>
      <a
        href={hatenaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="md-chip md-chip--outlined"
      >
        はてなブックマーク
        {count !== null && <span className="share-count">{count}</span>}
      </a>
    </div>
  );
}
