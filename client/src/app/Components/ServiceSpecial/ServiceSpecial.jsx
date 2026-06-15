"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "@/app/Components/ServiceSpecial/ServiceSpecial.module.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/Context/Context";
import Image from "next/image";

export default function ServiceSpecial({
  data = [],
  title,
  button,
  onMoreClick,
}) {
  const [index, setIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const gap = 20;

  const router = useRouter();

  const { productbuy, addToCart } = useAuth();

  const Active = data.filter((item) => item.status === "active");

  const isInCart = (id) => {
    return productbuy?.some((p) => p.id === id);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) setVisibleCards(1);
      else if (window.innerWidth < 800) setVisibleCards(2);
      else if (window.innerWidth < 1024) setVisibleCards(3);
      else setVisibleCards(4);
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

    if (touchStartX.current - touchEndX.current > 150) prevSlide();
    if (touchEndX.current - touchStartX.current > 150) nextSlide();
  };

  const translateValue = `translateX(${index * (100 / visibleCards)}%) translateX(${index * gap}px)`;

  if (Active.length === 0) {
    return (
      <div className={styles.box}>
        <h2 className={styles.title}>محصولی پیدا نشد</h2>
        <p className={styles.description}>
          متأسفانه هیچ محصولی تخفیف ویژه ای پیدا نشد !
        </p>
      </div>
    );
  }

  return (
    <div className={styles.servicesBody}>
      <article className={styles.article}>
        <div className={styles.badge}>تخفیف ویژه</div>

        <div className={styles.servicesHeader}>
          <h2 className={styles.iconTitle}>{title}</h2>
        </div>

        <div className={styles.sliderContainer}>
          <button
            className={`${styles.navBtn} ${styles.right}`}
            onClick={prevSlide}
            disabled={index === 0}
          >
            <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
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
                    style={{ flex: `0 0 ${100 / visibleCards}%` }}
                  >
                    <img
                      className={styles.serviceImage}
                      src={item.image}
                      alt={item.title}
                      width={100}
                      height={180}
                      onClick={() =>
                        router.push(`/ProductDetail/${item.id}`)
                      }
                    />

                    <p className={styles.serviceTitle}>{item.title}</p>

                    <h2 className={styles.serviceDescription}>
                      {item.description}
                    </h2>

                    <p className={styles.servicePrice}>
                      {parseInt(item.price)?.toLocaleString("fa-IR")} تومان
                    </p>

                    <button
                      className={`${styles.serviceBtn} ${
                        added ? styles.serviceBtnGreen : ""
                      }`}
                      onClick={() => addToCart(item)}
                      disabled={added}
                    >
                      {added ? "به سبد خرید اضافه شد" : "افزودن به سبد خرید"}
                    </button>
                  </div>
                );
              })}

              <div>
                <div className={styles.serviceCardLast}>
                  <div className={styles.serviceCardLastDiv}>
                    <h2>{title}</h2>
                    <p>برای نمایش بیشتر کلیک کنید</p>
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
            // disabled={index >= Active.length + 1 - visibleCards}
          >
            <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5"></path>
            <path d="m12 19-7-7 7-7"></path>
          </svg>
          </button>
        </div>
      </article>
    </div>
  );
}
