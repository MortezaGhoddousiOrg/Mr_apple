"use client";

import { useState, useRef, useEffect } from "react";
import style from "@/app/Components/FeaturedProducts/FeaturedProducts.module.css";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function FeaturedProduct() {
  const [featuredItems, setFeaturedItems] = useState([
    {
      id: 1,
      title: "Mobile",
      image: "/image-featuredProduct/iphone2025.png",
    },
    {
      id: 2,
      title: "Accessories",
      image:
        "/image-category-accessories/apple-40w-usb-c-dynamic-power-adapter-with-60w-max-uk-3pin.png",
    },
    {
      id: 3,
      title: "ipad",
      image: "/image-featuredProduct/ipads.png",
    },
    {
      id: 4,
      title: "usedProducts",
      image: "/image-featuredProduct/iphone2025.png",
    },
    {
      id: 5,
      title: "Mobile",
      image: "/image-featuredProduct/iphone2025.png",
    },
    {
      id: 6,
      title: "Accessories",
      image:
        "/image-category-accessories/apple-40w-usb-c-dynamic-power-adapter-with-60w-max-uk-3pin.png",
    },
    {
      id: 7,
      title: "ipad",
      image: "/image-featuredProduct/ipads.png",
    },
    {
      id: 8,
      title: "usedProducts",
      image: "/image-featuredProduct/iphone2025.png",
    },
  ]);

  // useEffect(() => {
  //   const axioshome = async () => {
  //     try {
  //       const response = await api.get("/category/parent");
  //       console.log(response.data);
  //       setFeaturedItems(response.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   axioshome();
  // }, []);


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

  const extendedItems = [...featuredItems, ...featuredItems.slice(0, visible)];

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

  const cardsWidth = 100 / visible;
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
        <h2 className={style.title}>هیچ دسته بندی برای محصولات وجود نداره</h2>
        <p className={style.description}>
          متأسفانه هیچ محصولی برای نمایش وجود ندارد. لطفاً کمی بعد دوباره تلاش
          کنید یا فیلترهای جستجو را تغییر دهید.
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
                  style={{ flex: `0 0 ${100 / visible}%` }}
                  onClick={() => router.push(`/Category/${item.title}`)}
                >
                  <span className={style.cardImage}>
                    <Image
                      className={style.image}
                      src={item.image}
                      alt={item.title}
                      width={140}
                      height={120}
                      priority={i < visible}
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
