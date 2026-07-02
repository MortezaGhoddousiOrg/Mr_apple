"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "@/app/Components/Service/Service.module.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/Context/Context";
import Image from "next/image";

export default function Service({ data = [], title, button, onMoreClick }) {
  const [index, setIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const gap = 20;

  const { addToCart, productbuy, setNotif } = useAuth();

  const Active = React.useMemo(
    () => data.filter((item) => item.status === "active" && item.category !== null && item.category !== undefined),
    [data],
  );

  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setVisibleCards(1);
      } else if (window.innerWidth < 900) {
        setVisibleCards(2);
      } else if (window.innerWidth < 1200) {
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
    if (index > Active.length - visibleCards) {
      setIndex(Math.max(Active.length - visibleCards, 0));
    }
  }, [visibleCards, Active.length]);

 const nextSlide = () => {
    if (index >= Active.length + 1 - visibleCards) return;
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

    if (touchStartX.current - touchEndX.current > 50) prevSlide();
    if (touchEndX.current - touchStartX.current > 50) nextSlide();
  };

  const translateValue = `translateX(${index * (100 / visibleCards)}%) translateX(${index * gap}px)`;

  const isInCart = (id) => productbuy?.some((p) => (p.product_id || p.id) === id);

  const handleAddToCart = async (item) => {
    if (isInCart(item.id)) {
      setNotif({ id: Date.now(), message: "این محصول قبلاً به سبد خرید اضافه شده است", type: "warning" });
      return;
    }
    try {
      await addToCart(item);
      setNotif({ id: Date.now(), message: "محصول با موفقیت به سبد خرید اضافه شد", type: "success" });
    } catch {
      setNotif({ id: Date.now(), message: "خطا در افزودن محصول", type: "error" });
    }
  };

  if (Active.length === 0) {
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
          className={`${styles.navBtn} ${styles.navBtnRight}`}
          onClick={prevSlide}
          disabled={index === 0}
          aria-label="قبلی"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
          </svg>
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
            {Active.map((item) => {
              const added = isInCart(item.id);
              return (
                <div
                  className={styles.serviceCard}
                  key={item.id}
                  style={{ flex: `0 0 calc(${100 / visibleCards}% - ${gap * (visibleCards - 1) / visibleCards}px)` }}
                >
                  <Image
                    unoptimized
                    className={styles.serviceImage}
                    src={item.image}
                    alt={item.title}
                    width={100}
                    height={180}
                    onClick={() => router.push(`/ProductDetail/${item.id}`)}
                  />
                  <p className={styles.serviceTitle}>{item.title}</p>
                  <h2 className={styles.serviceDescription}>{item.description}</h2>
                  <p className={styles.servicePrice}>
                    {parseInt(item.price)?.toLocaleString("fa-IR")} تومان
                  </p>
                  <button
                    className={`${styles.serviceBtn} ${added ? styles.serviceBtnGreen : ""}`}
                    onClick={() => handleAddToCart(item)}
                  >
                    {added ? (
                      <>
                        به سبد خرید اضافه شد
                        <svg className={styles.svg} viewBox="0 0 24 24" fill="white" width="16" height="16">
                          <path d="M20.656 2.993L10.007 13.642l-3.471-3.471a.995.995 0 0 0-1.403 1.403l4.173 4.173a.994.994 0 0 0 1.403 0l11.355-11.355a.995.995 0 0 0-1.403-1.403z" />
                        </svg>
                      </>
                    ) : (
                      "افزودن به سبد خرید"
                    )}
                  </button>
                </div>
              );
            })}

            <div
              className={styles.serviceCardLast}
              style={{ flex: `0 0 calc(${100 / visibleCards}% - ${gap * (visibleCards - 1) / visibleCards}px)` }}
            >
              <div className={styles.serviceCardLastDiv}>
                <h2>{title}</h2>
                <p>برای نمایش بیشتر کلیک کنید</p>
              </div>
              {button && (
                <button className={styles.serviceCardLastButton} onClick={onMoreClick}>
                  {button}
                </button>
              )}
            </div>
          </div>
        </div>

        <button
          className={`${styles.navBtn} ${styles.navBtnLeft}`}
          onClick={nextSlide}
          disabled={index >= Active.length + 1 - visibleCards}
          aria-label="بعدی"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}