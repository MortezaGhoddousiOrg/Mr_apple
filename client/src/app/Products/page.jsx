"use client";
 
import style from "@/app/Products/page.module.css";
import { useState, useEffect, useRef } from "react";
import Service from "../Components/Service/Service";
import { useRouter } from "next/navigation";
import { api } from "../config";
import { MEDIA_URL } from "../config";
 
import Image from "next/image";
 
export default function Products({ setNotif }) {
  const [product, setProduct] = useState([]);
 
  useEffect(() => {
    const axioshome = async () => {
      try {
        const response = await api.get("/api/catalog/product/");
        console.log(response.data);
        setProduct(response.data);
      } catch (err) {
        console.log(err);
      }
    };
 
    axioshome();
  }, []);
 
  const router = useRouter();
 
  const categories = Object.values(
    product.reduce((acc, item) => {
      const parent = item.category?.parent;
 
      if (!parent) return acc;
 
      if (!acc[parent.id]) {
        acc[parent.id] = {
          id: parent.id,
          title: parent.title,
          products: [],
        };
      }
 
      acc[parent.id].products.push(item);
 
      return acc;
    }, {}),
  );
 
  return (
    <div className={style.productBody}>
      <section className={style.heroProducts}>
        <div className={style.heroContent}>
          <h1 className={style.heroTitle}>محصولات </h1>
          <p className={style.heroDescription}>
            مستر اپل دنیایی از جدیدترین و خاص‌ترین محصولات اپل را یکجا برای شما
            فراهم کرده است؛ از آیفون‌های پرچمدار تا اکسسوری‌های حرفه‌ای. تنوع
            بالا، انتخاب راحت، تجربه‌ای متفاوت.
          </p>
 
          <div className={style.heroFeatures}>
            <div className={style.heroFeatureItem}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>طراحی نوآورانه و مدرن</span>
            </div>
 
            <div className={style.heroFeatureItem}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>عملکرد بی‌نظیر و سریع</span>
            </div>
 
            <div className={style.heroFeatureItem}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
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
 
      {product.length === 0 ? (
        <div className={style.box}>
          <h2 className={style.title}>هیچ دسته بندی برای محصولات وجود نداره</h2>
          <p className={style.description}>
            متأسفانه هیچ محصولی برای نمایش وجود ندارد. لطفاً کمی بعد دوباره تلاش
            کنید یا فیلترهای جستجو را تغییر دهید.
          </p>
        </div>
      ) : (
        <div className="ref">
          {categories.map((category) => (
            <Service
              key={category.id}
              title={category.title}
              button="بیشتر"
              setNotif={setNotif}
              onMoreClick={() => router.push(`/Category/${category.title}`)}
              data={category.products.map((item) => ({
                id: item.id,
                image: `${MEDIA_URL}${
                  item.images?.find((img) => img.is_main)?.image ||
                  item.images?.[0]?.image ||
                  ""
                }`,
                title: item.name,
                description: item.descriptions,
                price: item.sell_price,
                category: item.category,
                status: item.status,
              }))}
            />
          ))}
        </div>
      )}
    </div>
  );
}