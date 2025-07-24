import { getAllPostIds, getPostData } from '@/lib/posts';
import { remark } from 'remark';
import html from 'remark-html';
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
                  prose-headings:text-gray-900 prose-headings:font-bold
                  prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-base
                  prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                  prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                  prose-pre:bg-gray-900 prose-pre:text-gray-100
                  prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic
                  prose-ul:text-gray-700 prose-ol:text-gray-700
                  prose-li:text-gray-700 prose-li:leading-relaxed"
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