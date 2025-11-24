"use client";
import { useState } from "react";
import useSWR from "swr";
import type { Category, Work } from "../../../types/work";
import Card from "../../ui/Card/Card";
import LoadingCard from "../../ui/Card/LoadingCard";
import styles from "./WorkList.module.css";
export default function WorkList({
  workData,
  limit,
  categoryData,
}: {
  workData: Work[];
  limit: number;
  categoryData: Category[];
}) {
  const [activeCategory, setActiveCategory] = useState("");
  const [currentWorks, setCurrentWorks] = useState<Work[]>(workData);
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const getApiUrl = (activeCategory: string) => {
    const isPublic = import.meta.env.IS_PUBLIC === "true" ? "true" : "false";

    return activeCategory
      ? `/api/works?category=${activeCategory}&isPublic=${isPublic}`
      : `/api/works?isPublic=${isPublic}`;
  };

  const fetcher = async (url: string): Promise<Work[]> => {
    await sleep(800);
    try {
      // await sleep(5000);
      const response = await fetch(url);
      const data = await response.json();
      setCurrentWorks(data);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const {
    data: works,
    error,
    isLoading,
    mutate,
  } = useSWR(getApiUrl(activeCategory), fetcher, {
    fallbackData: currentWorks,
    revalidateOnFocus: false,
    revalidateIfStale: true,
    errorRetryCount: 3,
    dedupingInterval: 2000,
  });

  const toggleCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const renderingSkeleton = Array.from({ length: 5 }, (_, index) => {
    return (
      <li key={index.toString()}>
        <LoadingCard />
      </li>
    );
  });

  return (
    <>
      <div className={styles.toggleList} role="tablist">
        <button
          role="tab"
          type="button"
          id="all"
          className={`${styles.toggleButton} ${activeCategory === "" ? styles.active : ""}`}
          onClick={() => toggleCategory("")}
        >
          すべて
        </button>
        {categoryData
          ? categoryData.map((category) => (
            <button
              role="tab"
              type="button"
              id={category.id}
              key={category.id}
              className={`${styles.toggleButton} ${activeCategory === category.id ? styles.active : ""}`}
              onClick={() => toggleCategory(category.id)}
            >
              {category.name}
            </button>
          ))
          : null}
      </div>
      <ul className={styles.list} aria-busy={isLoading} role="tabpanel" aria-labelledby={activeCategory === "" ? "all" : activeCategory}>
        {isLoading ? (
          renderingSkeleton
        ) : works && works.length > 0 ? (
          works.map((work, index) => {
            return (
              <li key={work.id}>
                <Card
                  title={work.title}
                  link={`/works/${work.id}`}
                  eyecatch={work.eyecatch}
                  category={work.category}
                />
              </li>
            );
          })
        ) : (
          <li className={styles.noWorks}>実績がありません。</li>
        )}
        {/* {works && works.length > 0 ? (
          works.map((work, index) => {
            return <li key={index}>{renderingSkeleton}</li>;
          })
        ) : (
          <li>実績がありません。</li>
        )} */}
      </ul>
    </>
  );
}
