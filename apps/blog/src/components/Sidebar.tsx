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
    <aside className="w-full lg:w-80 space-y-6">
      {/* プロフィール */}
      <div className="md-card p-6">
        <h3 className="md-title-medium md-on-surface mb-4">プロフィール</h3>
        <div className="flex items-center gap-3 mb-4">
          <div className="md-surface-container-high h-16 w-16 overflow-hidden rounded-full">
            <Image
              src="/profile.png"
              alt="hiramekun プロフィール画像"
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h4 className="md-title-small md-on-surface">hiramekun</h4>
            <p className="md-body-small md-on-surface-variant">ソフトウェアエンジニア</p>
          </div>
        </div>
        <p className="md-body-medium md-on-surface-variant leading-relaxed">
          技術、教育、社会問題など、日々考えていることを書いています。
        </p>
      </div>

      {/* アーカイブ */}
      {Object.keys(archives).length > 0 && (
        <div className="md-card p-6">
          <h3 className="md-title-medium md-on-surface mb-3">アーカイブ</h3>
          <ul className="space-y-1">
            {Object.entries(archives)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([key, count]) => {
                // "YYYY-MM" キーから年・月を取り出す
                const [year, month] = key.split('-');

                return (
                  <li key={key}>
                    <a
                      href={`/archive/${year}/${month}/`}
                      className="md-list-link md-body-medium flex justify-between"
                    >
                      <span>{formatYearMonth(year, month)}</span>
                      <span className="md-outline-text">({count})</span>
                    </a>
                  </li>
                );
              })}
          </ul>
        </div>
      )}

      {/* 最近の記事 */}
      <div className="md-card p-6">
        <h3 className="md-title-medium md-on-surface mb-3">最近の記事</h3>
        <ul className="space-y-1">
          {allPosts.slice(0, 5).map((post) => (
            <li key={post.id}>
              <a href={`/posts/${post.id}/`} className="md-list-link">
                <span className="md-body-medium line-clamp-2 leading-relaxed">{post.title}</span>
                <span className="md-label-medium md-outline-text block mt-1">{post.date}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
