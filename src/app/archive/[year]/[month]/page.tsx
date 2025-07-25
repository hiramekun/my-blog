import { getAllArchives, getPostsByArchive, getArchiveDisplayName } from '@/lib/posts';
import { generateArchiveMetadata } from '@/lib/metadata';
import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import type { Metadata } from 'next';

type Params = Promise<{ year: string; month: string }>;

export async function generateStaticParams() {
  const archives = getAllArchives();
  return archives.map((archive) => {
    const [year, month] = archive.split('-');
    return {
      year,
      month,
    };
  });
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { year, month } = await params;
  
  return generateArchiveMetadata(year, month);
}

export default async function ArchivePage({ params }: { params: Params }) {
  const { year, month } = await params;
  const displayName = getArchiveDisplayName(year, month);
  const posts = getPostsByArchive(year, month);

  return (
    <div className="min-h-screen bg-theme-primary">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* メインコンテンツ */}
          <main className="flex-1">
            <Link 
              href="/" 
              className="inline-block mb-6 text-theme-accent text-theme-accent-hover text-sm"
            >
              ← ホームに戻る
            </Link>
            
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-theme-primary mb-2">
                アーカイブ: {displayName}
              </h1>
              <p className="text-theme-tertiary">
                {posts.length}件の記事があります
              </p>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-theme-tertiary">この月には記事がありません。</p>
              </div>
            ) : (
              <div className="space-y-8">
                {posts.map((post) => (
                  <article 
                    key={post.id}
                    className="bg-theme-secondary border border-theme-primary rounded-lg p-6"
                  >
                    <h2 className="text-xl font-bold mb-3">
                      <Link 
                        href={`/posts/${post.id}`}
                        className="text-theme-primary text-theme-accent-hover"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    
                    <div className="flex items-center text-sm text-theme-tertiary space-x-4 mb-3">
                      <time dateTime={post.date}>{post.date}</time>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex space-x-2">
                          {post.tags.map((tag) => (
                            <Link
                              key={tag}
                              href={`/category/${encodeURIComponent(tag)}`}
                              className="bg-theme-tertiary text-theme-secondary px-2 py-1 rounded text-xs hover:bg-theme-primary"
                            >
                              {tag}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {post.excerpt && (
                      <p className="text-theme-secondary leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </main>

          {/* サイドバー */}
          <Sidebar />
        </div>
      </div>
    </div>
  );
}