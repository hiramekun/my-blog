import Link from 'next/link';
import BrandMark from '@/components/BrandMark';
import { SITES } from '@/lib/sites';

export default function Header() {
  return (
    <header className="md-surface-container-high sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="brand -ml-1">
            {/* 丸い塗りは要らないので、.brand-mark の背景だけ落とす */}
            <BrandMark className="brand-mark bg-transparent" />
            <span>
              <strong className="md-title-medium md-on-surface block">ひらめのブログ</strong>
              <small className="md-label-medium md-on-surface-variant hidden sm:block">
                日々の思考や学びを記録するブログ
              </small>
            </span>
          </Link>

          {/* hiramekun.dev 配下の他サイトへの導線 */}
          <nav className="flex items-center gap-1 shrink-0">
            <a href={SITES.profile} className="md-button md-button--text">
              About
            </a>
            {/* 狭い画面では 2 つ並べるとタイトルが折り返すので Notes を落とす */}
            <a href={SITES.notes} className="md-button md-button--text hidden sm:inline-flex">
              Notes
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
