"use client";

import { useState, useRef, useEffect } from "react";
import style from "@/app/Components/FeaturedProducts/FeaturedProducts.module.css";
import { useRouter } from "next/navigation";
import { api, MEDIA_URL } from "@/app/config";
import Image from "next/image";

export default function FeaturedProduct() {
  const [featuredItems, setFeaturedItems] = useState([]);

  useEffect(() => {
    const axioshome = async () => {
      try {
        const response = await api.get("api/category/parent/");

        setFeaturedItems(response.data);
      } catch (err) {
        console.log("error:", err.response?.data || err.message);
      }
    };
    axioshome();
  }, []);

  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);

  const handlePointerDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
    currentX.current = e.clientX;
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    currentX.current = e.clientX;
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;

    isDragging.current = false;

    const diff = currentX.current - startX.current;
    const threshold = 50;

    if (Math.abs(diff) < threshold) return;

    if (diff > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  };

  const [visible, setVisible] = useState(6);
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const containerRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setVisible(2);
      else if (window.innerWidth < 1024) setVisible(4);
      else setVisible(6);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const actualVisible = Math.min(visible, featuredItems.length);

  const extendedItems = [
    ...featuredItems,
    ...featuredItems.slice(0, actualVisible),
  ];

  const nextSlide = () => {
    setIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (index <= 0) return;
    setIndex((prev) => prev - 1);
  };

  useEffect(() => {
    if (index === featuredItems.length) {
      setTimeout(() => {
        setIsTransitioning(false);
        setIndex(0);
      }, 400);
    }
  }, [index, featuredItems.length]);

  useEffect(() => {
    if (!isTransitioning) {
      requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
    }
  }, [isTransitioning]);

  const cardsWidth = 100 / actualVisible;
  const translateValue = `translateX(${index * cardsWidth}%)`;

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (featuredItems.length == 0) {
    return (
      <div className={style.box}>
        <h2 className={style.title}>دسته بندی پیدا نشد</h2>
        <p className={style.description}>
          متأسفانه هیچ دسته بندی برای نمایش وجود ندارد. لطفاً کمی بعد دوباره
          تلاش کنید
        </p>
      </div>
    );
  }

  return (
    <section
      className={style.dashboardContainer}
      aria-label="Featured categories"
    >
      <div className={style.sliderShell}>
        <button
          className={`${style.navBtn} ${style.prev}`}
          onClick={prevSlide}
          aria-label="Previous"
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

        <div className={style.sliderWrapper}>
          <div className={style.dashboardCards}>
            <div
              ref={containerRef}
              className={style.cardsContainer}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onPointerCancel={handlePointerUp}
              style={{
                transform: translateValue,
                transition: isTransitioning
                  ? "transform 0.4s ease-in-out"
                  : "none",
              }}
            >
              {extendedItems.map((item, i) => (
                <button
                  type="button"
                  key={`${item.id}-${i}`}
                  className={style.cards}
                  style={{ flex: `0 0 ${100 / actualVisible}%` }}
                  onClick={() => router.push(`/Category/${item.title}`)}
                >
                  <span className={style.cardImage}>
                    <Image
                      unoptimized
                      className={style.image}
                      src={`${MEDIA_URL}${item.image}`}
                      alt={item.title}
                      width={140}
                      height={120}
                    />
                  </span>
                  <span className={style.cardTitle}>{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          className={`${style.navBtn} ${style.next}`}
          onClick={nextSlide}
          aria-label="Next"
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
    </section>
  );
}
