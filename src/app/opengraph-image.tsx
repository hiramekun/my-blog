import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const dynamic = 'force-static';

export const alt = 'ひらめのブログ';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0d1117',
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        {/* 背景グラデーション */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
          }}
        />
        
        {/* メインコンテンツ */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px',
            zIndex: 1,
          }}
        >
          {/* プロフィール画像エリア（円形背景） */}
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '60px',
              backgroundColor: '#21262d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '40px',
              border: '4px solid #30363d',
            }}
          >
            <div
              style={{
                fontSize: '48px',
                color: '#58a6ff',
                fontWeight: 'bold',
              }}
            >
              H
            </div>
          </div>
          
          {/* タイトル */}
          <div
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: '#f0f6fc',
              textAlign: 'center',
              marginBottom: '20px',
              lineHeight: 1.2,
            }}
          >
            ひらめのブログ
          </div>
          
          {/* 説明 */}
          <div
            style={{
              fontSize: '32px',
              color: '#8b949e',
              textAlign: 'center',
              maxWidth: '800px',
              lineHeight: 1.4,
            }}
          >
            バックエンドエンジニアの技術メモ
          </div>
          
          {/* URL表示 */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
              fontSize: '24px',
              color: '#58a6ff',
            }}
          >
            hiramekun.github.io/my-blog
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}