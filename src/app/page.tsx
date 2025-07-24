import { getSortedPostsData } from '@/lib/posts';
import Link from 'next/link';

export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            My Tech Blog
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            バックエンドエンジニアの技術ブログ
          </p>
        </header>

        <main>
          {allPostsData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                まだ記事がありません。postsフォルダにMarkdownファイルを追加してください。
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {allPostsData.map(({ id, date, title, excerpt }) => (
                <article key={id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <Link href={`/posts/${id}`} className="block">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400">
                      {title}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      {date}
                    </p>
                    {excerpt && (
                      <p className="text-gray-600 dark:text-gray-300">
                        {excerpt}
                      </p>
                    )}
                  </Link>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
