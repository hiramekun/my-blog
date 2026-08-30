import Image from 'next/image';
import { LINKS, PROFILE } from '@/lib/links';
import { ArrowUpRight } from '@/components/Icons';

export default function Home() {
  return (
    <div className="md-surface min-h-screen">
      <main className="mx-auto w-full max-w-2xl px-5 py-16 sm:py-24">
        {/* プロフィール */}
        <section className="flex flex-col items-center text-center">
          <div className="h-24 w-24 overflow-hidden rounded-full md-surface-container-high">
            <Image
              src={PROFILE.avatar}
              alt={`${PROFILE.name} のプロフィール画像`}
              width={96}
              height={96}
              priority
              className="h-full w-full object-cover"
            />
          </div>

          <h1 className="md-headline-medium md-on-surface mt-6">{PROFILE.name}</h1>
          <p className="md-label-large md-primary-text mt-2">{PROFILE.role}</p>
          <p className="md-body-large md-on-surface-variant mt-4 max-w-md leading-relaxed text-balance">
            {PROFILE.bio}
          </p>
        </section>

        {/* リンク集。自分のサイトも外部サービスも同じカードで並べる */}
        <section className="mt-14">
          <h2 className="md-title-small md-on-surface-variant mb-4 tracking-wide uppercase">
            Links
          </h2>

          <ul className="space-y-3">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  rel="me noreferrer"
                  target="_blank"
                  className="md-card md-card--interactive flex items-start gap-4 p-5"
                >
                  <span className="min-w-0 flex-1">
                    <span className="md-title-medium md-on-surface block">{link.title}</span>
                    <span className="md-body-medium md-on-surface-variant mt-1 block leading-relaxed">
                      {link.description}
                    </span>
                  </span>

                  <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 md-on-surface-variant" />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <footer className="md-body-small md-on-surface-variant mt-20 text-center">
          © {new Date().getFullYear()} {PROFILE.name}
        </footer>
      </main>
    </div>
  );
}
