import Link from 'next/link';
import type { PostData } from '@/lib/posts';

interface PostCardProps {
  post: PostData;
}

// アーカイブ・カテゴリ一覧で使う記事カード
export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="md-card p-4 sm:p-6">
      <h2 className="md-headline-small mb-3">
        <Link href={`/posts/${post.id}`} className="md-on-surface md-link-text">
          {post.title}
        </Link>
      </h2>

      <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mb-3">
        <time dateTime={post.date} className="md-label-medium md-on-surface-variant">
          {post.date}
        </time>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/category/${encodeURIComponent(tag)}`}
                className="md-chip md-chip--outlined md-chip--small"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </div>

      {post.excerpt && (
        <p className="md-body-medium md-on-surface-variant leading-relaxed">{post.excerpt}</p>
      )}
    </article>
  );
}
