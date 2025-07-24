import { ImageResponse } from 'next/og';
import { getPostData } from '@/lib/posts';

export const runtime = 'edge';

export const alt = 'ひらめのブログ';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

type Params = Promise<{ id: string }>;

export default async function Image({ params }: { params: Params }) {
  const { id } = await params;
  const postData = getPostData(id);

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
            padding: '60px',
            zIndex: 1,
          }}
        >
          {/* 小さなプロフィール画像エリア */}
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '40px',
              backgroundColor: '#21262d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '30px',
              border: '3px solid #30363d',
            }}
          >
            <div
              style={{
                fontSize: '32px',
                color: '#58a6ff',
                fontWeight: 'bold',
              }}
            >
              H
            </div>
          </div>
          
          {/* ブログ名 */}
          <div
            style={{
              fontSize: '28px',
              color: '#8b949e',
              marginBottom: '20px',
            }}
          >
            ひらめのブログ
          </div>
          
          {/* 記事タイトル */}
          <div
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#f0f6fc',
              textAlign: 'center',
              marginBottom: '20px',
              lineHeight: 1.2,
              maxWidth: '1000px',
            }}
          >
            {postData.title}
          </div>
          
          {/* 記事の説明 */}
          {postData.excerpt && (
            <div
              style={{
                fontSize: '24px',
                color: '#8b949e',
                textAlign: 'center',
                maxWidth: '900px',
                lineHeight: 1.4,
              }}
            >
              {postData.excerpt}
            </div>
          )}
          
          {/* 日付とURL */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              display: 'flex',
              justifyContent: 'space-between',
              width: '90%',
            }}
          >
            <div
              style={{
                fontSize: '20px',
                color: '#58a6ff',
              }}
            >
              {postData.date}
            </div>
            <div
              style={{
                fontSize: '20px',
                color: '#58a6ff',
              }}
            >
              hiramekun.github.io/my-blog
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}