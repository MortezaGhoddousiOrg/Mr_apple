"use client";

import style from "@/app/Products/page.module.css";
import { useState, useEffect, useRef } from "react";
import Service from "../Components/Service/Service";
import { useRouter } from "next/navigation";

import Image from "next/image";
// import { useRouter } from "next/navigation";
// import Card from "../CardProduct/Card";
// import axios from "axios";

export default function Products({ setNotif }) {
  const [product, setProduct] = useState([
    {
      id: 1,
      title: "آیفون | iPhone",
      path: "iPhone",
      item: [
        {
          id: 1,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 17 پرو مکس",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 1000000000,
        },
        {
          id: 2,
          image: "/image-category/apple-iphone-15-pro-first-image.png",
          title: "آیفون 17 پرو مکس",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 1000000000,
        },
        {
          id: 3,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 17 پرو مکس",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 1000000000,
        },
        {
          id: 4,
          image: "/image-category/apple-iphone-15-pro-first-image.png",
          title: "آیفون 17 پرو مکس",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 1000000000,
        },
        {
          id: 5,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 17 پرو مکس",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 1000000000,
        },
        {
          id: 6,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 17 پرو مکس",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 1000000000,
        },
      ],
    },

    {
      id: 2,
      title: "لوازم جانبی | Accessories",
      path: "Accessories",
      item: [
        {
          id: 7,
          image: "/image-category/anyland-high-quality-clear-case-iphone-17-magsafe-cover.png",
          title: "آیفون 17 پرو مکس",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 1000000000,
        },
        {
          id: 8,
          image: "/image-category/apple-40w-usb-c-dynamic-power-adapter-with-60w-max-uk-3pin.png",
          title: "آیفون 17 پرو مکس",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 1000000000,
        },
        {
          id: 9,
          image: "/image-category/whoop_peek11.png",
          title: "آیفون 17 پرو مکس",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 1000000000,
        },
        {
          id: 10,
          image: "/image-category/apple-usb-c-to-lightning-cable-1m-3.png",
          title: "آیفون 17 پرو مکس",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 1000000000,
        },
        {
          id: 11,
          image: "/image-category/apple-40w-usb-c-dynamic-power-adapter-with-60w-max-uk-3pin.png",
          title: "آیفون 17 پرو مکس",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 1000000000,
        },
        {
          id: 12,
          image: "/image-category/anyland-high-quality-clear-case-iphone-17-magsafe-cover.png",
          title: "آیفون 17 پرو مکس",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 1000000000,
        },
      ],
    },

    {
      id: 3,
      title: "کارکرده | Used",
      path: "usedProducts",
      item: [
        {
          id: 13,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 17 پرو مکس",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 1000000000,
        },
        {
          id: 14,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 17 پرو مکس",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 1000000000,
        },
        {
          id: 15,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 17 پرو مکس",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 1000000000,
        },
        {
          id: 16,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 17 پرو مکس",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 1000000000,
        },
        {
          id: 17,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 17 پرو مکس",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 1000000000,
        },
        {
          id: 18,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 17 پرو مکس",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 1000000000,
        },
      ],
    },

    {
      id: 4,
      title: "آیپد | iPad",
      path: "iPad",
      item: [
        {
          id: 19,
          image: "/image-category/apple-ipad-11-inch-11th-7.png",
          title: "آیفون 17 پرو مکس",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 1000000000,
        },
        {
          id: 20,
          image: "/image-category/apple-ipad-air-m3-11-inch-8.png",
          title: "آیفون 17 پرو مکس",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 1000000000,
        },
        {
          id: 21,
          image: "/image-category/apple-ipad-11-inch-11th-7.png",
          title: "آیفون 17 پرو مکس",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 1000000000,
        },
        {
          id: 22,
          image: "/image-category/apple-ipad-air-m3-11-inch-8.png",
          title: "آیفون 17 پرو مکس",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 1000000000,
        },
        {
          id: 23,
          image: "/image-category/apple-ipad-air-m3-11-inch-8.png",
          title: "آیفون 17 پرو مکس",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 1000000000,
        },
        {
          id: 24,
          image: "/image-category/apple-ipad-11-inch-11th-7.png",
          title: "آیفون 17 پرو مکس",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 1000000000,
        },
      ],
    },
  ]);


 useEffect(() => {
    const axioshome = async () => {
      try {
        const response = await api.get("/api/product/");
        console.log(response.data);
        setProduct(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    axioshome();
  }, []);


  const router = useRouter();

  return (
    <div className={style.productBody}>
      <section className={style.heroProducts}>
        <div className={style.heroContent}>
          <h1 className={style.heroTitle}>محصولات </h1>
          <p className={style.heroDescription}>
            مستر اپل دنیایی از جدیدترین و خاص‌ترین محصولات اپل را یکجا برای شما فراهم کرده است؛
            از آیفون‌های پرچمدار تا اکسسوری‌های حرفه‌ای. تنوع بالا، انتخاب راحت، تجربه‌ای متفاوت.
          </p>

          <div className={style.heroFeatures}>
            <div className={style.heroFeatureItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>طراحی نوآورانه و مدرن</span>
            </div>

            <div className={style.heroFeatureItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>عملکرد بی‌نظیر و سریع</span>
            </div>

            <div className={style.heroFeatureItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>کیفیت ساخت سطح بالا</span>
            </div>
          </div>

        </div>

        <div className={style.heroImageContainer}>
          <Image
            src="/image-product/highlights_design_startframe__dvaw74n1gkq6_medium_2x.jpg"
            alt="Product Hero Image"
            fill
            className={style.heroImage}
          />
        </div>
      </section>

      <div className="ref">
        {product.map((item) => (
          <Service
            key={item.id}
            data={item.item}
            title={item.title}
            button="بیشتر"
            onMoreClick={() => router.push(`/Category/${item.path}`)}
            setNotif={setNotif}
          />
        ))}
      </div>
    </div>
  );
}
