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
      <div className="bg-theme-secondary p-6 rounded-lg border border-theme-primary">
        <h3 className="text-lg font-bold text-theme-primary mb-4">プロフィール</h3>
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-theme-tertiary">
            <img 
              src="/my-blog/profile.png" 
              alt="hiramekun profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-bold text-theme-primary">hiramekun</h4>
            <p className="text-sm text-theme-tertiary">バックエンドエンジニア</p>
          </div>
        </div>
        <p className="text-sm text-theme-secondary leading-relaxed">
          技術、教育、社会問題など、日々考えていることを書いています。
        </p>
      </div>

      {/* カテゴリ */}
      {categories.size > 0 && (
        <div className="bg-theme-secondary p-6 rounded-lg border border-theme-primary">
          <h3 className="text-lg font-bold text-theme-primary mb-4">カテゴリ</h3>
          <ul className="space-y-2">
            {Array.from(categories).map((category) => (
              <li key={category}>
                <a 
                  href={`/my-blog/category/${encodeURIComponent(category)}/`}
                  className="text-sm text-theme-secondary text-theme-accent-hover hover:underline"
                >
                  {category}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* アーカイブ */}
      {Object.keys(archives).length > 0 && (
        <div className="bg-theme-secondary p-6 rounded-lg border border-theme-primary">
          <h3 className="text-lg font-bold text-theme-primary mb-4">アーカイブ</h3>
          <ul className="space-y-2">
            {Object.entries(archives)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([month, count]) => {
                // "2025年6月" から "2025" と "06" を抽出
                const match = month.match(/(\d{4})年(\d+)月/);
                if (!match) return null;
                const [, year, monthNum] = match;
                const paddedMonth = monthNum.padStart(2, '0');
                
                return (
                  <li key={month} className="flex justify-between">
                    <a 
                      href={`/my-blog/archive/${year}/${paddedMonth}/`}
                      className="text-sm text-theme-secondary text-theme-accent-hover hover:underline"
                    >
                      {month}
                    </a>
                    <span className="text-sm text-theme-tertiary">({count})</span>
                  </li>
                );
              })}
          </ul>
        </div>
      )}

      {/* 最近の記事 */}
      <div className="bg-theme-secondary p-6 rounded-lg border border-theme-primary">
        <h3 className="text-lg font-bold text-theme-primary mb-4">最近の記事</h3>
        <ul className="space-y-3">
          {allPosts.slice(0, 5).map((post) => (
            <li key={post.id}>
              <a 
                href={`/my-blog/posts/${post.id}/`}
                className="text-sm text-theme-secondary text-theme-accent-hover line-clamp-2 leading-relaxed"
              >
                {post.title}
              </a>
              <p className="text-xs text-theme-tertiary mt-1">{post.date}</p>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}