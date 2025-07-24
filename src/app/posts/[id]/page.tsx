import { getAllPostIds, getPostData } from '@/lib/posts';
import { marked } from 'marked';
import hljs from 'highlight.js';
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
  
  // Configure marked with GitHub Flavored Markdown
  marked.use({
    gfm: true,
    breaks: true
  });
  
  // Parse markdown and then apply syntax highlighting
  let contentHtml = marked.parse(postData.content) as string;
  
  // Apply syntax highlighting to code blocks
  contentHtml = contentHtml.replace(
    /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
    (match, lang, code) => {
      try {
        const highlightedCode = hljs.highlight(code, { language: lang }).value;
        return `<pre><code class="language-${lang}">${highlightedCode}</code></pre>`;
      } catch (err) {
        return match;
      }
    }
  ).replace(
    /<pre><code>([\s\S]*?)<\/code><\/pre>/g,
    (match, code) => {
      try {
        const highlightedCode = hljs.highlightAuto(code).value;
        return `<pre><code>${highlightedCode}</code></pre>`;
      } catch (err) {
        return match;
      }
    }
  );

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
                className="prose prose-lg max-w-none"
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