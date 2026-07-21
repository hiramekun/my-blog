import { getAllCategories, getPostsByCategory } from '@/lib/posts';
import { generateCategoryMetadata } from '@/lib/metadata';
import PageLayout from '@/components/PageLayout';
import PostCard from '@/components/PostCard';
import type { Metadata } from 'next';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    slug: encodeURIComponent(category),
  }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const category = decodeURIComponent(slug);

  return generateCategoryMetadata(category, slug);
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const category = decodeURIComponent(slug);
  const posts = getPostsByCategory(category);

  return (
    <PageLayout showBackLink>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-theme-primary mb-2">
          カテゴリ: {category}
        </h1>
        <p className="text-theme-tertiary">
          {posts.length}件の記事があります
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-theme-tertiary">このカテゴリには記事がありません。</p>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </PageLayout>
  );
}
