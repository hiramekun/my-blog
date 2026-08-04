import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="md-surface-container-high sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center space-x-4">
          <div className="w-11 h-11 rounded-full overflow-hidden md-surface-container">
            <Image
              src="/my-blog/profile.png"
              alt="ひらめのブログ - プロフィール画像"
              width={44}
              height={44}
              priority
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <Link href="/" className="block">
              <h1 className="md-title-large md-on-surface text-theme-accent-hover">
                ひらめのブログ
              </h1>
            </Link>
            <p className="md-body-small md-on-surface-variant mt-0.5">
              日々の思考や学びを記録するブログ
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}