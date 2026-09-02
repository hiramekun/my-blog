import { getAllPostIds, getPostData } from '@/lib/posts';
import { generateArticleMetadata } from '@/lib/metadata';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import PageLayout from '@/components/PageLayout';
import ShareButtons from '@/components/ShareButtons';
import type { Metadata } from 'next';

type Params = Promise<{ id: string }>;

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths.map((path) => ({
    id: path.params.id,
  }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const postData = getPostData(id);

  return generateArticleMetadata(
    postData.title,
    postData.excerpt || "日々の思考や学びを記録するブログ",
    id,
    postData.date
  );
}

export default async function Post({ params }: { params: Params }) {
  const { id } = await params;
  const postData = getPostData(id);

  return (
    <PageLayout showBackLink>
      <article className="md-card p-4 sm:p-8">
        <header className="mb-8">
          <h1 className="md-headline-large md-on-surface mb-4">{postData.title}</h1>
          <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
            <time dateTime={postData.date} className="md-label-medium md-on-surface-variant">
              {postData.date}
            </time>
            {postData.tags && postData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {postData.tags.map((tag) => (
                  <span key={tag} className="md-chip md-chip--outlined md-chip--small">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/*
          本文の見た目は globals.css の .prose が持つ（tech-notes の .card-content と同じ組み方）。
          要素ごとに className を渡すとレイヤーの都合でそちらが勝ってしまうので、ここでは渡さない。
        */}
        <div className="prose max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
            skipHtml={false}
          >
            {postData.content}
          </ReactMarkdown>
        </div>

        <footer className="mt-10 pt-6 md-outline-variant-border border-t">
          <ShareButtons title={postData.title} path={`/posts/${id}/`} />
        </footer>
      </article>
    </PageLayout>
  );
}
