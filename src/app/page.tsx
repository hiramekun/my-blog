import { getSortedPostsData } from '@/lib/posts';
import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="min-h-screen bg-theme-primary">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* メインコンテンツ */}
          <main className="flex-1">
            {allPostsData.length === 0 ? (
              <div className="bg-theme-secondary p-8 rounded-lg border border-theme-primary text-center">
                <p className="text-theme-secondary">
                  まだ記事がありません。postsフォルダにMarkdownファイルを追加してください。
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {allPostsData.map(({ id, date, title, excerpt, tags }) => (
                  <article key={id} className="bg-theme-secondary border border-theme-primary rounded-lg p-6 hover-bg-theme-hover transition-colors">
                    <Link href={`/posts/${id}`} className="block">
                      <h2 className="text-xl font-bold text-theme-primary mb-2 text-theme-accent-hover leading-tight">
                        {title}
                      </h2>
                    </Link>
                    
                    <div className="flex items-center text-sm text-theme-tertiary mb-3 space-x-4">
                      <time dateTime={date}>{date}</time>
                      {tags && tags.length > 0 && (
                        <div className="flex space-x-2">
                          {tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="bg-theme-tertiary text-theme-secondary px-2 py-1 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {excerpt && (
                      <p className="text-theme-secondary leading-relaxed line-clamp-3">
                        {excerpt}
                      </p>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-theme-primary">
                      <Link 
                        href={`/posts/${id}`}
                        className="text-theme-accent text-sm text-theme-accent-hover font-medium"
                      >
                        続きを読む →
                      </Link>
                    </div>
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
