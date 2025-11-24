/*** 
 * デバウンス関数
 * @param func 実行する関数
 * @param delay デバウンスの遅延時間
 * @returns デバウンスされた関数
 */
export const debounce = (func: (args: any[]) => void, delay: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(args), delay);
  };
};