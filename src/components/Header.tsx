import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-theme-secondary border-b border-theme-primary">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-theme-tertiary">
            <img 
              src="/my-blog/profile.png" 
              alt="hiramekun profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <Link href="/" className="block">
              <h1 className="text-2xl font-bold text-theme-primary text-theme-accent-hover">
                ひらめの技術ブログ
              </h1>
            </Link>
            <p className="text-sm text-theme-tertiary mt-1">
              バックエンドエンジニアの技術メモ
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}