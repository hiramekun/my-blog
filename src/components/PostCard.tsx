import Link from 'next/link';
import type { PostData } from '@/lib/posts';

interface PostCardProps {
  post: PostData;
}

// アーカイブ・カテゴリ一覧で使う記事カード
export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-theme-secondary border border-theme-primary rounded-lg p-6">
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
  );
}
