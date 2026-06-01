"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "@/app/Components/Service/Service.module.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/Context/Context";
import Image from "next/image";

export default function Service({
  data = [],
  title,
  button,
  onMoreClick,
  setNotif,
}) {
  const [index, setIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const gap = 20;

  const { addedItems, setAddedItems } = useAuth();

  const { setProductBuy } = useAuth();

  const router = useRouter();
 useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setVisibleCards(1);
      } else if (window.innerWidth < 800) {
        setVisibleCards(2);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(3);
      } else {
        setVisibleCards(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  useEffect(() => {
    if (index > data.length - visibleCards) {
      setIndex(Math.max(data.length - visibleCards, 0));
    }
  }, [visibleCards, data.length]);

  const nextSlide = () => {
    if (index >= data.length + 1 - visibleCards) return;
    setIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (index <= 0) return;
    setIndex((prev) => prev - 1);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleTouchtrue();
  };

  const handleTouchtrue = () => {
    if (touchStartX.current - touchEndX.current > 150) {
      prevSlide();
    }

    if (touchEndX.current - touchStartX.current > 150) {
      nextSlide();
    }
  };

  const translateValue = `translateX(${index * (100 / visibleCards)}%) translateX(${index * gap}px)`;

  // const [addedItems, setAddedItems] = useState([]);

  const handleAddToCart = (item) => {
    setProductBuy((prev) => {
      const product = prev.find((p) => p.id === item.id);

      if (product) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, pro: p.pro + 1 } : p,
        );
      }

      return [...prev, { ...item, pro: 1 }];
    });
    setAddedItems((prev) =>
      prev.includes(item.id) ? prev : [...prev, item.id],
    );
  };

  if (data.length === 0) {
    return (
      <div className={styles.box}>
        <h2 className={styles.title}>محصولی پیدا نشد</h2>
        <p className={styles.description}>
          متأسفانه هیچ محصولی برای نمایش وجود ندارد. لطفاً کمی بعد دوباره تلاش
          کنید یا فیلترهای جستجو را تغییر دهید.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.servicesBody}>
      <div className={styles.servicesHeader}>
        <h2 className={styles.iconTitle}>{title}</h2>
      </div>

      <div className={styles.sliderContainer}>
        <button
          className={`${styles.navBtn} ${styles.right}`}
          onClick={prevSlide}
          disabled={index === 0}
        >
          ❮
        </button>

        <div
          className={styles.servicesSlider}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={styles.servicesAll}
            style={{
              transform: translateValue,
              transition: "transform 0.4s ease-in-out",
            }}
          >
            {data.map((item) => (
              <div
                className={styles.serviceCard}
                key={item.id}
                style={{ flex: `0 0 ${100 / visibleCards}%` }}
              >
                <Image
                  className={styles.serviceImage}
                  src={item.image}
                  alt={item.title}
                  width={100}
                  height={180}
                  onClick={() => router.push(`/ProductDetail/${item.id}`)}
                />
                <p className={styles.serviceTitle}>{item.title}</p>
                <h2 className={styles.serviceDescription}>
                  {item.description}
                </h2>
                <p className={styles.servicePrice}>
                  {parseInt(item.price)?.toLocaleString("fa-IR")} تومان
                </p>
                <button
                  className={`${styles.serviceBtn} ${addedItems.includes(item.id) ? styles.serviceBtnGreen : ""}`}
                  onClick={() => handleAddToCart(item)}
                  disabled={addedItems.includes(item.id)}
                >
                  {addedItems.includes(item.id) ? (
                    <>
                      به سبد خرید اضافه شد
                      <svg
                        className={styles.svg}
                        viewBox="0 0 24 24"
                        fill="white"
                        width="18"
                        height="18"
                        style={{ marginLeft: "8px" }}
                      >
                        <path d="M20.656 2.993L10.007 13.642l-3.471-3.471a.995.995 0 0 0-1.403 1.403l4.173 4.173a.994.994 0 0 0 1.403 0l11.355-11.355a.995.995 0 0 0-1.403-1.403z" />
                      </svg>
                    </>
                  ) : (
                    "افزودن به سبد خرید"
                  )}
                </button>
              </div>
            ))}

            <div>
              <div className={styles.serviceCardLast}>
                <div className={styles.serviceCardLastDiv}>
                  <h2>{title}</h2>
                  <p>
                    برای نمایش بیشتر کلیک کنید
                  </p>
                </div>
                {button && (
                  <button
                    className={styles.serviceCardLastButton}
                    onClick={onMoreClick}
                  >
                    {button}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          className={`${styles.navBtn} ${styles.left}`}
          onClick={nextSlide}
          disabled={index >= data.length + 1 - visibleCards}
        >
          ❯
        </button>
      </div>
    </div>
  );
}

