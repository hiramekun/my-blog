import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-theme-secondary border-b border-theme-primary">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-theme-tertiary">
            <Image 
              src="/my-blog/profile.png" 
              alt="ひらめのブログ - プロフィール画像" 
              width={48}
              height={48}
              priority
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <Link href="/" className="block">
              <h1 className="text-2xl font-bold text-theme-primary text-theme-accent-hover">
                ひらめのブログ
              </h1>
            </Link>
            <p className="text-sm text-theme-tertiary mt-1">
              日々の思考や学びを記録するブログ
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}