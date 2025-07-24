import { getAllPostIds, getPostData } from '@/lib/posts';
import { marked } from 'marked';
import markedFootnote from 'marked-footnote';
import hljs from 'highlight.js';
import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
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
  
  return {
    title: `${postData.title} | ひらめのブログ`,
    description: postData.excerpt || "バックエンドエンジニアの技術メモ",
    openGraph: {
      title: postData.title,
      description: postData.excerpt || "バックエンドエンジニアの技術メモ",
      url: `https://hiramekun.github.io/my-blog/posts/${id}/`,
      siteName: "ひらめのブログ",
      locale: "ja_JP",
      type: "article",
      publishedTime: postData.date,
      authors: ["hiramekun"],
      images: [
        {
          url: "/my-blog/profile.png",
          width: 512,
          height: 512,
          alt: "ひらめのブログのプロフィール画像",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: postData.title,
      description: postData.excerpt || "バックエンドエンジニアの技術メモ",
      images: ["/my-blog/profile.png"],
    },
  };
}

export default async function Post({ params }: { params: Params }) {
  const { id } = await params;
  const postData = getPostData(id);
  
  // Configure marked with GitHub Flavored Markdown and footnotes
  marked.use({
    gfm: true,
    breaks: true,
    pedantic: false
  });
  
  marked.use(markedFootnote());
  
  // Parse markdown and then apply syntax highlighting
  let contentHtml = marked.parse(postData.content) as string;
  
  // Additional post-processing for better bold text recognition
  // Handle cases where ** is not separated by spaces
  contentHtml = contentHtml.replace(
    /([^\s])\*\*([^*]+?)\*\*([^\s])/g,
    '$1<strong>$2</strong>$3'
  );
  contentHtml = contentHtml.replace(
    /\*\*([^*]+?)\*\*/g,
    '<strong>$1</strong>'
  );
  
  // Apply syntax highlighting to code blocks
  contentHtml = contentHtml.replace(
    /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
    (match, lang, code) => {
      try {
        const highlightedCode = hljs.highlight(code, { language: lang }).value;
        return `<pre><code class="language-${lang}">${highlightedCode}</code></pre>`;
      } catch {
        return match;
      }
    }
  ).replace(
    /<pre><code>([\s\S]*?)<\/code><\/pre>/g,
    (match, code) => {
      try {
        const highlightedCode = hljs.highlightAuto(code).value;
        return `<pre><code>${highlightedCode}</code></pre>`;
      } catch {
        return match;
      }
    }
  );

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
              
              <div 
                className="prose prose-xl max-w-none"
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