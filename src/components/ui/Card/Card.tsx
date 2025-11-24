"use client";

import { useEffect, useRef, useState } from "react";
import { animateShuffleText } from "../../../lib/animation";
import type { Category, Eyecatch } from "../../../types/work";
import styles from "./Card.module.css";

export default function Card({
  title,
  category,
  link,
  eyecatch,
}: {
  title: string;
  category?: Category;
  link: string;
  eyecatch: Eyecatch;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const categoryRef = useRef<HTMLParagraphElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (!titleRef.current || animated) return;

    // Intersection Observerでカード（タイトル）領域のin-viewを監視
    observerRef.current = new window.IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated) {
            animateShuffleText(titleRef, title);
            animateShuffleText(categoryRef, category?.name || "");
            setAnimated(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );

    observerRef.current.observe(titleRef.current);

    return () => {
      if (observerRef.current && titleRef.current) {
        observerRef.current.unobserve(titleRef.current);
      }
      observerRef.current = null;
    };
    // animated依存性を追加し、二重実行抑止
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, category?.name, animated]);

  return (
    <a className={styles.root} href={link}>
      <div className={styles.inner}>
        <figure
          className={`${styles.eyecatch} ${isLoading ? styles.loading : ""}`}
        >
          <img
            src={eyecatch.url}
            width={560}
            height={560}
            alt=""
            decoding="async"
            loading="lazy"
          />
        </figure>
        <div className={styles.text}>
          <p className={styles.category} ref={categoryRef}>
            {category?.name}
          </p>
          <p className={styles.title} ref={titleRef}>
            {title}
          </p>
        </div>
      </div>
    </a>
  );
}
