import { getSortedPostsData } from '@/lib/posts';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';

export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <PageLayout>
      {allPostsData.length === 0 ? (
        <div className="md-card p-8 text-center">
          <p className="md-body-large md-on-surface-variant">
            まだ記事がありません。postsフォルダにMarkdownファイルを追加してください。
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {allPostsData.map(({ id, date, title, excerpt, tags }) => (
            <article key={id} className="md-card md-card-interactive p-6">
              <Link href={`/posts/${id}`} className="block">
                <h2 className="md-headline-small md-on-surface mb-2 text-theme-accent-hover leading-tight">
                  {title}
                </h2>
              </Link>

              <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mb-3">
                <time dateTime={date} className="md-label-medium md-on-surface-variant">{date}</time>
                {tags && tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="md-chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {excerpt && (
                <p className="md-body-medium md-on-surface-variant leading-relaxed line-clamp-3">
                  {excerpt}
                </p>
              )}

              <div className="mt-4">
                <Link
                  href={`/posts/${id}`}
                  className="md-text-button relative z-[2] -ml-3"
                >
                  続きを読む →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
