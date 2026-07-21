// 日付関連のユーティリティ

// frontmatterのdateがYAMLでDate型としてパースされる場合があるため、
// YYYY-MM-DD形式の文字列に正規化する
export function normalizeDate(value: unknown): unknown {
  if (value instanceof Date) {
    return value.toISOString().split('T')[0];
  }
  return value;
}

// 日付文字列から "YYYY-MM" 形式の年月キーを生成する
export function toYearMonthKey(date: string): string {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// 年・月から日本語の表示名を生成する（例: "2025年6月"）
export function formatYearMonth(year: string | number, month: string | number): string {
  return `${year}年${parseInt(String(month), 10)}月`;
}
