import { getAllPostIds, getPostData } from '@/lib/posts';
import { generateArticleMetadata } from '@/lib/metadata';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import type { Metadata } from 'next';
import 'highlight.js/styles/github-dark.css';

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
    <div className="min-h-screen bg-theme-primary">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* メインコンテンツ */}
          <main className="flex-1">
            <Link 
              href="/" 
              className="inline-block mb-6 text-theme-accent text-theme-accent-hover text-sm"
            >
              ← ホームに戻る
            </Link>
            
            <article className="bg-theme-secondary border border-theme-primary rounded-lg p-8">
              <header className="mb-8">
                <h1 className="text-2xl font-bold text-theme-primary mb-4 leading-tight">
                  {postData.title}
                </h1>
                <div className="flex items-center text-sm text-theme-tertiary space-x-4">
                  <time dateTime={postData.date}>{postData.date}</time>
                  {postData.tags && postData.tags.length > 0 && (
                    <div className="flex space-x-2">
                      {postData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-theme-tertiary text-theme-secondary px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </header>
              
              <div className="prose prose-xl max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkBreaks]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  skipHtml={false}
                  components={{
                    // カスタムコンポーネントでスタイリングを調整
                    h1: ({children}) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
                    h2: ({children}) => <h2 className="text-xl font-bold mb-3">{children}</h2>,
                    h3: ({children}) => <h3 className="text-lg font-bold mb-2">{children}</h3>,
                    p: ({children}) => <p className="mb-4 leading-relaxed">{children}</p>,
                    strong: ({children}) => <strong className="font-bold text-theme-primary">{children}</strong>,
                    b: ({children}) => <b className="font-bold text-theme-primary">{children}</b>,
                    blockquote: ({children}) => (
                      <blockquote className="border-l-4 border-theme-accent pl-4 italic my-4">
                        {children}
                      </blockquote>
                    ),
                    code: ({children, className}) => {
                      const isInline = !className;
                      return isInline ? (
                        <code className="bg-theme-tertiary px-1 py-0.5 rounded text-sm">
                          {children}
                        </code>
                      ) : (
                        <code className={className}>{children}</code>
                      );
                    },
                    pre: ({children}) => (
                      <pre className="bg-theme-primary border border-theme-primary rounded p-4 overflow-x-auto my-4">
                        {children}
                      </pre>
                    )
                  }}
                >
                  {postData.content}
                </ReactMarkdown>
              </div>
            </article>
          </main>

          {/* サイドバー */}
          <Sidebar />
        </div>
      </div>
    </div>
  );
}