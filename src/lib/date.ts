/**
 * 日付を「20XX年X月」の形式に変換する関数
 * @param {string | Date} date - 変換したい日付（Dateオブジェクトまたは日付文字列）
 * @returns {string} 「20XX年X月」の形式で返す
 */
export function formatYearMonth(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const year = d.getFullYear();
  const month = d.getMonth() + 1; // 月は0始まりなので+1
  return `${year}年${month}月`;
}
