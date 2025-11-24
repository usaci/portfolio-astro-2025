"use client";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import styles from "./Drawer.module.css";

/**
 * フォーカストラップを実行する関数
 * @param isOpen - ドロワーが開いているかどうか
 * @param drawerRef - ドロワーの refObject
 * @returns {void}
 */
const useAriaModalTrap = (isOpen: boolean, drawerRef: RefObject<HTMLDivElement>) => {
  useEffect(() => {
    // スクロール固定
    if (isOpen) {
      // document.body.style.overflow = "hidden";
      // フォーカストラップ
      const drawer = drawerRef.current;
      if (drawer) {
        const focusableElements = drawer.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length) {
          (focusableElements[0] as HTMLElement).focus();
        }
        const handleFocus = (e: FocusEvent) => {
          if (!drawer.contains(e.target as Node)) {
            e.stopPropagation();
            (focusableElements[0] as HTMLElement).focus();
          }
        };
        document.addEventListener("focus", handleFocus, true);
        // クリーンアップ
        return () => {
          document.removeEventListener("focus", handleFocus, true);
        };
      }
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen, drawerRef]);
}

export default function Drawer() {
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  /**
   * メニューを開閉する関数
   * @returns {void}
   */
  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Escapeキーで閉じる
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // 領域外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // 背面要素を操作できなくする
  useAriaModalTrap(isOpen, drawerRef as React.RefObject<HTMLDivElement>);

  return (
    <>
      <button
        className={styles.trigger}
        aria-expanded={isOpen ? "true" : "false"}
        type="button"
        aria-controls="drawer"
        onClick={toggleMenu}
      >
        <span className={styles.iconWrap}>
          <span className={styles.icon}></span>
        </span>
        <span className={styles.text}>Menu</span>
      </button>
      <div
        className={styles.drawer}
        id="drawer"
        aria-hidden={!isOpen}
        ref={drawerRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        inert={!isOpen}
      >
        <div className={styles.wrap}>
          <div className={styles.head}>
            <p className={styles.logo}>Takuya Fujikawa</p>
            <button
              className={styles.trigger}
              aria-expanded={isOpen ? "true" : "false"}
              type="button"
              aria-controls="drawer"
              onClick={toggleMenu}
            >
              <span className={styles.iconWrap}>
                <span className={styles.icon}></span>
              </span>
              <span className={styles.text}>Close</span>
            </button>
          </div>
          <div className={styles.inner}>
            <ul className={styles.list}>
              <li>
                <a href="/">Works</a>
              </li>
              <li>
                <a href="/profile">Profile</a>
              </li>
            </ul>
            <p className={styles.barcode} aria-hidden="true">TakuyaFujikawa</p>
          </div>
        </div>
      </div>
      {/* ドロワーが開いている時だけバックドロップを追加 */}
      {isOpen && (
        <div
          className={styles.drawerBackdrop}
          aria-hidden="true"
          tabIndex={-1}
        />
      )}
    </>
  );
}