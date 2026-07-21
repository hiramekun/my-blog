import { getAllArchives, getPostsByArchive, getArchiveDisplayName } from '@/lib/posts';
import { generateArchiveMetadata } from '@/lib/metadata';
import PageLayout from '@/components/PageLayout';
import PostCard from '@/components/PostCard';
import type { Metadata } from 'next';

type Params = Promise<{ year: string; month: string }>;

export async function generateStaticParams() {
  const archives = getAllArchives();
  return archives.map((archive) => {
    const [year, month] = archive.split('-');
    return {
      year,
      month,
    };
  });
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { year, month } = await params;

  return generateArchiveMetadata(year, month);
}

export default async function ArchivePage({ params }: { params: Params }) {
  const { year, month } = await params;
  const displayName = getArchiveDisplayName(year, month);
  const posts = getPostsByArchive(year, month);

  return (
    <PageLayout showBackLink>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-theme-primary mb-2">
          アーカイブ: {displayName}
        </h1>
        <p className="text-theme-tertiary">
          {posts.length}件の記事があります
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-theme-tertiary">この月には記事がありません。</p>
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
