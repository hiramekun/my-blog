import { getSortedPostsData } from '@/lib/posts';

export default function Sidebar() {
  const allPosts = getSortedPostsData();
  
  // カテゴリを抽出（タグから）
  const categories = new Set(
    allPosts.flatMap(post => post.tags || [])
  );
  
  // 月別アーカイブを作成
  const archives = allPosts.reduce((acc, post) => {
    const date = new Date(post.date);
    const monthKey = `${date.getFullYear()}年${date.getMonth() + 1}月`;
    acc[monthKey] = (acc[monthKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <aside className="w-full lg:w-80 space-y-8">
      {/* プロフィール */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">プロフィール</h3>
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-bold text-xl">H</span>
          </div>
          <div>
            <h4 className="font-bold text-gray-900">hiramekun</h4>
            <p className="text-sm text-gray-600">バックエンドエンジニア</p>
          </div>
        </div>
        <p className="text-sm text-gray-900 leading-relaxed">
          Go/Java/Scalaを中心としたバックエンド開発の経験を共有しています。
        </p>
      </div>

      {/* カテゴリ */}
      {categories.size > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">カテゴリ</h3>
          <ul className="space-y-2">
            {Array.from(categories).map((category) => (
              <li key={category}>
                <span className="text-sm text-gray-900 hover:text-blue-600 cursor-pointer">
                  {category}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* アーカイブ */}
      {Object.keys(archives).length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">アーカイブ</h3>
          <ul className="space-y-2">
            {Object.entries(archives)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([month, count]) => (
                <li key={month} className="flex justify-between">
                  <span className="text-sm text-gray-900 hover:text-blue-600 cursor-pointer">
                    {month}
                  </span>
                  <span className="text-sm text-gray-600">({count})</span>
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* 最近の記事 */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">最近の記事</h3>
        <ul className="space-y-3">
          {allPosts.slice(0, 5).map((post) => (
            <li key={post.id}>
              <a 
                href={`/my-blog/posts/${post.id}/`}
                className="text-sm text-gray-900 hover:text-blue-600 line-clamp-2 leading-relaxed"
              >
                {post.title}
              </a>
              <p className="text-xs text-gray-500 mt-1">{post.date}</p>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}