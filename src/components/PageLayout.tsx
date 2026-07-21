import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

interface PageLayoutProps {
  children: React.ReactNode;
  // trueの場合、メインコンテンツ上部に「← ホームに戻る」リンクを表示する
  showBackLink?: boolean;
}

// 全ページ共通のレイアウト（背景・ヘッダー・2カラム構成・サイドバー）
export default function PageLayout({ children, showBackLink = false }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-theme-primary">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* メインコンテンツ */}
          <main className="flex-1">
            {showBackLink && (
              <Link
                href="/"
                className="inline-block mb-6 text-theme-accent text-theme-accent-hover text-sm"
              >
                ← ホームに戻る
              </Link>
            )}
            {children}
          </main>

          {/* サイドバー */}
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
