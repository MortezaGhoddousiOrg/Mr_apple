"use client";

import { useState, useRef, useEffect } from "react";
import style from "@/app/Components/FeaturedProducts/FeaturedProducts.module.css";
import Image from "next/image";

export default function FeaturedProduct() {
  const [featuredItems, setFeaturedItems] = useState([
    {
      img: "/image-featuredProduct/mac-m5.png",
      title: "مک",
      nav: "/category/iphone",
    },
    {
      img: "/image-featuredProduct/iphone2025.png",
      title: "آیفون",
      nav: "/category/iphone",
    },
    {
      img: "/image-featuredProduct/ipads.png",
      title: "آیپد",
      nav: "/category/ipad",
    },
    {
      img: "/image-featuredProduct/watch2025.png",
      title: "اپل واچ",
      nav: "/category/watch",
    },
    {
      img: "/image-featuredProduct/airpod2025.png",
      title: "ایرپاد",
      nav: "/category/airpods",
    },
    {
      img: "/image-featuredProduct/airpod2025.png",
      title: "ایرپاد",
      nav: "/category/airpods",
    },
    {
      img: "/image-featuredProduct/airpod2025.png",
      title: "ایرپاد",
      nav: "/category/airpods",
    },
    {
      img: "/image-featuredProduct/airpod2025.png",
      title: "ایرپاد",
      nav: "/category/airpods",
    },
    {
      img: "/image-featuredProduct/airpod2025.png",
      title: "ایرپاد",
      nav: "/category/airpods",
    },
    {
      img: "/image-featuredProduct/mac-m5.png",
      title: "مک",
      nav: "/category/iphone",
    },
    // { img: "/image-dashboard/accesori2026.png", title: "لوازم جانبی" },
  ]);

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(6);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisible(2);
      } else if (window.innerWidth < 1024) {
        setVisible(4);
      } else {
        setVisible(6);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (index > featuredItems.length - visible) {
      setIndex(Math.max(featuredItems.length - visible, 0));
    }
  }, [index, visible, featuredItems.length]);

  const nextSlide = () => {
    if (index >= featuredItems.length - visible) return;
    setIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (index <= 0) return;
    setIndex((prev) => prev - 1);
  };

  const handleTouchStart = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
    handleGesture();
  };

  const handleGesture = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      nextSlide();
    }

    if (touchEndX.current - touchStartX.current > 50) {
      prevSlide();
    }
  };

  const cardsWidth = 100 / visible;
  const translateValue = `translateX(${index * cardsWidth}%)`;

  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIndex((prevIndex) => {
        if (prevIndex >= featuredItems.length - visible) {
          return 0;
        }
        return prevIndex + 1;
      });
    }, 3000);
    
  }, [visible, featuredItems.length]);

  return (
    <div className={style.dashboardContainer}>
      <button
        className={`${style.navBtn} ${style.prev}`}
        onClick={prevSlide}
        disabled={index === 0}
        aria-label="اسلاید قبلی"
      >
        &lt;
      </button>
      <h2 className={style.dashboardTitle}>مرجع تخصصی فروش محصولات اپل</h2>
      <div className={style.sliderWrapper}>
        <div
          className={style.dashboardCards}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={style.cardsContainer}
            style={{
              transform: translateValue,
              transition: "transform 0.4s ease-in-out",
            }}
          >
            {featuredItems.map((item, index) => (
              <div
                key={index}
                // onClick={() => navigate(`${item.nav}`)}
                className={style.cards}
                style={{ flex: `0 0 ${100 / visible}%` }}
              >
                <div className={style.cardImage}>
                  <Image
                    src={item.img}
                    alt={item.title}
                    width={125}
                    height={115}
                  />
                </div>
                <p>{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button
        className={`${style.navBtn} ${style.next}`}
        onClick={nextSlide}
        disabled={index >= featuredItems.length - visible}
        aria-label="اسلاید بعدی"
      >
        &gt;
      </button>
    </div>
  );
}
