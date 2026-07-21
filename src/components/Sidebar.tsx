import { getSortedPostsData } from '@/lib/posts';
import { toYearMonthKey, formatYearMonth } from '@/lib/date';
import Image from 'next/image';

export default function Sidebar() {
  const allPosts = getSortedPostsData();

  // 月別アーカイブを "YYYY-MM" キーで集計する
  const archives = allPosts.reduce((acc, post) => {
    const key = toYearMonthKey(post.date);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <aside className="w-full lg:w-80 space-y-8">
      {/* プロフィール */}
      <div className="bg-theme-secondary p-6 rounded-lg border border-theme-primary">
        <h3 className="text-lg font-bold text-theme-primary mb-4">プロフィール</h3>
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-theme-tertiary">
            <Image 
              src="/my-blog/profile.png" 
              alt="hiramekun プロフィール画像" 
              width={64}
              height={64}
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


      {/* アーカイブ */}
      {Object.keys(archives).length > 0 && (
        <div className="bg-theme-secondary p-6 rounded-lg border border-theme-primary">
          <h3 className="text-lg font-bold text-theme-primary mb-4">アーカイブ</h3>
          <ul className="space-y-2">
            {Object.entries(archives)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([key, count]) => {
                // "YYYY-MM" キーから年・月を取り出す
                const [year, month] = key.split('-');

                return (
                  <li key={key} className="flex justify-between">
                    <a
                      href={`/my-blog/archive/${year}/${month}/`}
                      className="text-sm text-theme-secondary text-theme-accent-hover hover:underline"
                    >
                      {formatYearMonth(year, month)}
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