
export const animateShuffleText = (textRef: React.RefObject<HTMLHeadingElement> | React.RefObject<HTMLDivElement> | React.RefObject<HTMLParagraphElement | null>, targetText: string) => { 
    const element = textRef.current as HTMLElement | null;
    if (!element) return;

    const originalText = element.textContent ?? "";
    const duration = 600;

    // 文字列をシャッフル
    const shuffle = (str: string) => {
      return str.split('').sort(() => Math.random() - 0.5).join('');
    };

    // シャッフル文字列を表示
    element.textContent = shuffle(targetText);

    // 指定時間後に本来の文字列に戻す
    setTimeout(() => {
      element.textContent = targetText;
    }, duration);
} 