// ヘッダーの記名に使うアイコン（ヒラメ + 閃きの光線）。
// 形のマスターは packages/theme/icon.svg。片方を直したらもう片方も直す。
//
// img ではなくインライン SVG で持つのは、ライト/ダークで色を変えるため。
// 色はテーマトークンから取るので、テーマを更新すればここも追従する。
export default function BrandMark({ className }: { className?: string }) {
  return (
    // 上下左右に少し余白を持たせて、.brand-mark の 40px 枠に収める
    <svg viewBox="-10 -10 120 120" className={className} aria-hidden="true" focusable="false">
      <g
        fill="none"
        stroke="var(--md-sys-color-primary)"
        strokeWidth="7"
        strokeLinecap="round"
      >
        <path d="M9 22 L19 32" />
        <path d="M30 8 L34 21" />
        <path d="M2 47 L15 46" />
      </g>
      <path fill="var(--md-sys-color-on-surface)" d="M66 60 L97 32 Q89 60 97 88 Z" />
      <ellipse fill="var(--md-sys-color-on-surface)" cx="42" cy="60" rx="30" ry="22" />
      {/* 目はヘッダーの地の色で抜く */}
      <circle fill="var(--md-sys-color-surface-container-high)" cx="28" cy="52" r="5" />
      <circle fill="var(--md-sys-color-surface-container-high)" cx="43" cy="48" r="5" />
    </svg>
  );
}
