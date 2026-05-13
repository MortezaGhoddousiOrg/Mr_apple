"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "@/app/Components/Service/Service.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Service({
  data = [],
  title,
  button,
  img,
  onMoreClick,
  setNotif,
}) {
  const [index, setIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const gap = 20;

  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
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

  const handleAddToCart = () => {
    const user = localStorage.getItem("user");

    if (!user) {
      setNotif?.({
        message: "لطفا اول وارد حساب کاربری خود شوید",
        type: "error",
      });
    } else {
      setNotif?.({
        message: "با موفقیت به سبد خرید اضافه شد",
        type: "success",
      });
    }
  };

  return (
    <div className={styles.servicesBody}>
      <div className={styles.servicesHeader}>
        <Image
          src={img}
          className={styles.iconImage}
          width={20}
          height={20}
          alt="icon"
        />
        {/* <img className={styles.iconImage} src={img} alt="icon" /> */}
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
                {/* <Image
                  className={styles.serviceImage}
                  src={item.image}
                  alt={item.title}
                  width={100}
                  height={180}
                 
                /> */}
                <img
                  src={item.image}
                  alt={item.title}
                  onClick={() =>
                    router.push(`/product/${item.id}/${item.category_id}`)
                  }
                />
                <p className={styles.serviceTitle}>{item.title}</p>
                <h2 className={styles.serviceDescription}>
                  {item.description}
                </h2>
                <p className={styles.servicePrice}>
                  {parseInt(item.price)?.toLocaleString("fa-IR")} تومان
                </p>
                <button className={styles.serviceBtn} onClick={handleAddToCart}>
                  افزودن به سبد خرید
                </button>
              </div>
            ))}

            <div>
              <div className={styles.serviceCardLast}>
                <div className={styles.serviceCardLastDiv}>
                  <h2>{title}</h2>
                  <p className={styles.serviceCardLastP}>
                    برای نمایش بیشتر کلیک کنید
                  </p>
                </div>
                {button && (
                  <button className={styles.serviceCardLastButton}>
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
