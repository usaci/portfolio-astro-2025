"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./LoadingCard.module.css";
export default function Card() {

  const [randomString, setRandomString] = useState("");

  useEffect(() => {
    const getRandomString = (length: number = 15): string => {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };
    setRandomString(getRandomString(15));
  }, [])



  const titleRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.eyecatch}></div>
        <div className={styles.text}>
          <div
            className={styles.category}
            ref={categoryRef}
            dangerouslySetInnerHTML={{ __html: randomString }}
          ></div>
          <div
            className={styles.title}
            ref={titleRef}
            dangerouslySetInnerHTML={{ __html: randomString }}
          ></div>
        </div>
      </div>
    </div>
  );
}
