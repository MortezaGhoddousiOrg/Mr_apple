"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { api, MEDIA_URL } from "@/app/config";
import styles from "./page.module.css";

export default function ArticleDetail() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id;
  const type = searchParams.get("type") || "news";

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const endpoint =
          type === "news"
            ? `/education/news/${id}/`
            : `/education/tutorials/${id}/`;
        const response = await api.get(endpoint);
        setArticle(response.data);
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("خطا در دریافت اطلاعات مقاله");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id, type]);

  const formatDate = (date) => {
    if (!date) return "---";
    try {
      const parts = date.split('T')[0].split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const day = parseInt(parts[2]);
        const jYear = year - 621;
        return `${jYear}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
      }
      return date;
    } catch {
      return date;
    }
  };

  const getTypeLabel = (type) => {
    return type === "news" ? "خبر" : "آموزش";
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-gray-500 text-lg">در حال بارگذاری...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-red-500 text-lg">{error || "مقاله یافت نشد"}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* دکمه بازگشت */}
        <button
          onClick={() => router.back()}
          className={styles.backButton}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12H3M15 6l6 6-6 6"
            />
          </svg>
          بازگشت
        </button>

        {/* کارت مقاله */}
        <div className={styles.articleCard}>
          {/* تصویر */}
          {article.image && (
            <div className={styles.imageWrapper}>
              <img
                src={`${MEDIA_URL}${article.image}`}
                alt={article.title}
              />
            </div>
          )}

          {/* محتوا */}
          <div className={styles.content}>
            {/* برچسب نوع */}
            <span
              className={`${styles.typeBadge} ${
                article.type === "news" ? styles.news : styles.tutorial
              }`}
            >
              {getTypeLabel(article.type)}
            </span>

            {/* عنوان */}
            <h1 className={styles.title}>
              {article.title}
            </h1>

            {/* تاریخ */}
            <div className={styles.dateWrapper}>
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{formatDate(article.publish_date)}</span>
            </div>

            {/* توضیحات */}
            <div className={styles.description}>
              {article.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}