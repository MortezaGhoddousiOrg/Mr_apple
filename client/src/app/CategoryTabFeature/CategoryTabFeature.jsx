"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import style from "./CategoryTabFeature.module.css";
import Card from "@/app/CardPage/Card";
import { api } from "../config";
import { MEDIA_URL } from "@/app/config";
import Image from "next/image";

const FALLBACK_IMAGE = "/image-infosection/IMG_SEGMENT_20260513_115454.png";

function mapProductToCard(item) {
  const imagePath =
    item.images?.find((img) => img.is_main)?.image || item.images?.[0]?.image;

  return {
    id: item.id,
    image: imagePath ? `${MEDIA_URL}${imagePath}` : FALLBACK_IMAGE,
    title: item.name,
    description: item.descriptions,
    price: item.sell_price,
    status: item.status,
    category: item.category,
    category_child_id: item.category_child_id,
  };
}

export default function CategoryTabFeature({
  Tab = [],
  products = [],
  setProducts,
  setSelectedCategory,
}) {
  const [categoryId, setCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(4);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 20;

  const containerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 540) setVisible(2);
      else if (window.innerWidth < 900) setVisible(3);
      else setVisible(4);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;

    const distance = touchStartX.current - touchEndX.current;

    if (Math.abs(distance) < 50) return;

    if (distance > 0) {
      prevSlide();
    } else {
      nextSlide();
    }
  };

  const actualVisible = Math.min(visible, Tab.length);
  const needsSlider = Tab.length > actualVisible;

  const extendedTabs = needsSlider
    ? [...Tab, ...Tab.slice(0, actualVisible)]
    : Tab;

  const cardsWidth = 100 / actualVisible;
  const translateValue = `translateX(${index * cardsWidth}%)`;

  const nextSlide = () => {
    if (!needsSlider) return;
    setIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (!needsSlider || index <= 0) return;
    setIndex((prev) => prev - 1);
  };

  useEffect(() => {
    if (!needsSlider) return;
    if (index === Tab.length) {
      setTimeout(() => {
        setIsTransitioning(false);
        setIndex(0);
      }, 400);
    }
  }, [index, Tab.length, needsSlider]);

  useEffect(() => {
    if (!isTransitioning) {
      requestAnimationFrame(() => setIsTransitioning(true));
    }
  }, [isTransitioning]);

  useEffect(() => {
    if (!Tab.length) return;

    setCategoryId(Tab[0].id);
    setIndex(0);
    setCurrentPage(1);
  }, [Tab]);

  useEffect(() => {
    if (!categoryId) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/api/catalog/product/child/${categoryId}/`,
        );
        const validProducts = (response.data || []).filter(
          (item) => item.category !== null,
        );

        setProducts(validProducts);
        setCurrentPage(1);
      } catch (err) {
        console.log(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  const handleClick = (id) => {
    if (id === categoryId) return;

    setCurrentPage(1);
    setCategoryId(id);

    const category = Tab.find((item) => item.id === id);

    if (category) {
      setSelectedCategory(category);
    }
  };

  const cardData = useMemo(() => {
    return products.map(mapProductToCard);
  }, [products]);

  const totalPages = Math.ceil(cardData.length / PRODUCTS_PER_PAGE);

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
      );
    }

    return pages;
  };

  const paginatedProducts = cardData.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );

  if (!Tab?.length) {
    return (
      <div className={style.box}>
        <h2 className={style.title}>محصولی پیدا نشد</h2>
        <p className={style.description}>
          متأسفانه هیچ محصولی برای نمایش وجود ندارد. لطفاً کمی بعد دوباره تلاش
          کنید یا فیلترهای جستجو را تغییر دهید.
        </p>
      </div>
    );
  }

  return (
    <section className={style.wrapper}>
      <div className={style.sliderShell}>
        {needsSlider && (
          <button
            className={`${style.navBtn} ${style.prev}`}
            onClick={prevSlide}
            aria-label="Previous"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        )}

        <div
          className={style.sliderWrapper}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            ref={containerRef}
            className={style.cardsContainer}
            style={{
              transform: translateValue,
              transition: isTransitioning
                ? "transform 0.4s ease-in-out"
                : "none",
            }}
          >
            {extendedTabs.map((item, i) => {
              const imageSrc = item.image
                ? `${MEDIA_URL}${item.image}`
                : FALLBACK_IMAGE;
              return (
                <div
                  key={`${item.id}-${i}`}
                  className={`${style.containerTab} ${item.id === categoryId ? style.activeTab : ""}`}
                  style={{ flex: `0 0 ${cardsWidth}%` }}
                  onClick={() => handleClick(item.id)}
                >
                  <div className={style.tab}>
                    <div className={style.imageWrap}>
                      <Image
                        unoptimized
                        className={style.imageTab}
                        src={imageSrc}
                        alt={item.title || "category-tab"}
                        width={92}
                        height={92}
                      />
                    </div>
                    <p className={style.titleTab}>{item.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {needsSlider && (
          <button
            className={`${style.navBtn} ${style.next}`}
            onClick={nextSlide}
            aria-label="Next"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>

      {loading && <p className={style.loading}>در حال دریافت محصولات...</p>}

      {!loading && cardData.length === 0 ? (
        <div className={style.box}>
          <h2 className={style.title}>
            هیچ محصولی برای این دسته بندی وجود ندارد
          </h2>
          <p className={style.description}>
            لطفاً یک تب دیگر انتخاب کنید یا بعداً دوباره تلاش کنید.
          </p>
        </div>
      ) : (
        <div className={style.cardSection}>
          <Card product={paginatedProducts} />

          {totalPages > 1 && (
            <div className={style.pagination}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                قبلی
              </button>

              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span key={index} className={style.dots}>
                    ...
                  </span>
                ) : (
                  <button
                    key={index}
                    className={currentPage === page ? style.activePage : ""}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                بعدی
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
