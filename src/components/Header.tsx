import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-bold text-lg">H</span>
          </div>
          <div>
            <Link href="/" className="block">
              <h1 className="text-2xl font-bold text-gray-900 hover:text-gray-700">
                ひらめの技術ブログ
              </h1>
            </Link>
            <p className="text-sm text-gray-600 mt-1">
              バックエンドエンジニアの技術メモ
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}