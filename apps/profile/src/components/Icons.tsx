// カード右端の「外部サイトへ出る」印。
//
// 他社サービスへのリンクにロゴは使わず、サービス名のテキストで出しているので、
// ここにあるのはこの矢印だけ。理由は docs/third-party-logos.md を参照。
export function ArrowUpRight({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 16 16 8M9 8h7v7" />
    </svg>
  );
}
