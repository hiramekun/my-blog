import { getAllPostIds, getPostData } from '@/lib/posts';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

type Params = Promise<{ id: string }>;

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths.map((path) => ({
    id: path.params.id,
  }));
}

export default async function Post({ params }: { params: Params }) {
  const { id } = await params;
  const postData = getPostData(id);
  
  const processedContent = await remark()
    .use(remarkGfm)
    .use(html)
    .process(postData.content);
  const contentHtml = processedContent.toString();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* メインコンテンツ */}
          <main className="flex-1">
            <Link 
              href="/" 
              className="inline-block mb-6 text-blue-600 hover:text-blue-800 text-sm"
            >
              ← ホームに戻る
            </Link>
            
            <article className="bg-white border border-gray-200 rounded-lg p-8">
              <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                  {postData.title}
                </h1>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <time dateTime={postData.date}>{postData.date}</time>
                  {postData.tags && postData.tags.length > 0 && (
                    <div className="flex space-x-2">
                      {postData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </header>
              
              <div 
                className="prose prose-gray max-w-none
                  prose-headings:text-gray-900 prose-headings:font-bold prose-headings:leading-tight
                  prose-h1:text-2xl prose-h1:mb-6 prose-h1:mt-8
                  prose-h2:text-xl prose-h2:mb-4 prose-h2:mt-6 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2
                  prose-h3:text-lg prose-h3:mb-3 prose-h3:mt-5
                  prose-p:text-gray-800 prose-p:leading-relaxed prose-p:text-base prose-p:mb-4
                  prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-900 prose-strong:font-semibold
                  prose-code:bg-gray-100 prose-code:text-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
                  prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
                  prose-pre:code:bg-transparent prose-pre:code:text-gray-100 prose-pre:code:p-0
                  prose-blockquote:border-l-4 prose-blockquote:border-blue-200 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700
                  prose-ul:text-gray-800 prose-ol:text-gray-800 prose-ul:mb-4 prose-ol:mb-4
                  prose-li:text-gray-800 prose-li:leading-relaxed prose-li:mb-1
                  prose-table:border-collapse prose-table:border prose-table:border-gray-300
                  prose-th:border prose-th:border-gray-300 prose-th:bg-gray-50 prose-th:p-2 prose-th:text-left prose-th:font-semibold
                  prose-td:border prose-td:border-gray-300 prose-td:p-2"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            </article>
          </main>

          {/* サイドバー */}
          <Sidebar />
        </div>
      </div>
    </div>
  );
}