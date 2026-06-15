"use client";

import { useEffect, useMemo, useState } from "react";
import style from "@/app/Category/[Category]/page.module.css";
import { useParams } from "next/navigation";
import Image from "next/image";
import { api } from "@/app/config";
// import axios from "axios";
import CategoryTabFeature from "@/app/CategoryTabFeature/CategoryTabFeature";

export default function Category() {
  const params = useParams();
  const rawCategory = params?.Category;
  const CategoryName = rawCategory
    ? decodeURIComponent(rawCategory).trim()
    : "";

  const [categoryChild, setCategoryChild] = useState([
    // {
    //   id: 1,
    //   title: "iPhone 17",
    //   image: "/image-category-iphone/IMG_SEGMENT_20260519_121552.png",
    // },
    // {
    //   id: 2,
    //   title: "iPhone 16",
    //   image: "/image-category-iphone/IMG_SEGMENT_20260519_121523.png",
    // },
    // {
    //   id: 3,
    //   title: "iPhone 15",
    //   image: "/image-category-iphone/IMG_SEGMENT_20260519_121515.png",
    // },
  ]);

  const [product, setProduct] = useState([
    // {
    //   id: 1,
    //   images: [
    //     {
    //       file: "/image-detail/apple-iphone-17-pro-256gb-silver.png",
    //       type: true,
    //     },
    //     {
    //       file: "/image-detail/_apple-iphone-17-pro-256gb-cosmic-orange.png",
    //       type: false,
    //     },
    //     {
    //       file: "/image-detail/apple-iphone-17-pro-256gb-deep-blue.png",
    //       type: false,
    //     },
    //   ],
    //   category: {
    //     id: 101,
    //     parent: { id: 1, title: "Mobile", image: null },
    //   },
    //   category_child_id: 1,
    //   category_parent_id: 1,
    //   product_code: "IP17-PM-001",
    //   name: "iPhone 17 Pro Max",
    //   buy_price: "1000000",
    //   sell_price: "1500000",
    //   descriptions:
    //     "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم، نمایشگر پیشرفته و عملکرد بسیار سریع.",
    //   status: "active",
    // },
    // {
    //   id: 2,
    //   images: [
    //     {
    //       file: "/image-detail/apple-iphone-17-pro-256gb-silver.png",
    //       type: true,
    //     },
    //     {
    //       file: "/image-detail/_apple-iphone-17-pro-256gb-cosmic-orange.png",
    //       type: false,
    //     },
    //     {
    //       file: "/image-detail/apple-iphone-17-pro-256gb-deep-blue.png",
    //       type: false,
    //     },
    //   ],
    //   category: {
    //     id: 102,
    //     parent: { id: 1, title: "Mobile", image: null },
    //   },
    //   category_child_id: 1,
    //   category_parent_id: 1,
    //   product_code: "IP17-001",
    //   name: "iPhone 17",
    //   buy_price: "1100000",
    //   sell_price: "1600000",
    //   descriptions:
    //     "مدل iPhone 17 با طراحی جدید، کیفیت ساخت بالا، نمایشگر شفاف و قدرت پردازشی عالی.",
    //   status: "active",
    // },
    // {
    //   id: 3,
    //   images: [
    //     {
    //       file: "/image-detail/apple-iphone-17-pro-256gb-silver.png",
    //       type: true,
    //     },
    //     {
    //       file: "/image-detail/_apple-iphone-17-pro-256gb-cosmic-orange.png",
    //       type: false,
    //     },
    //   ],
    //   category: {
    //     id: 103,
    //     parent: { id: 1, title: "Mobile", image: null },
    //   },
    //   category_child_id: 2,
    //   category_parent_id: 1,
    //   product_code: "IP16-001",
    //   name: "iPhone 16",
    //   buy_price: "1000000",
    //   sell_price: "1450000",
    //   descriptions:
    //     "iPhone 16 با طراحی مدرن، کیفیت ساخت بالا و امکانات مناسب برای استفاده روزمره و حرفه‌ای.",
    //   status: "active",
    // },
    // {
    //   id: 4,
    //   images: [
    //     {
    //       file: "/image-detail/apple-iphone-17-pro-256gb-silver.png",
    //       type: true,
    //     },
    //     {
    //       file: "/image-detail/apple-iphone-17-pro-256gb-deep-blue.png",
    //       type: false,
    //     },
    //   ],
    //   category: {
    //     id: 104,
    //     parent: { id: 1, title: "Mobile", image: null },
    //   },
    //   category_child_id: 2,
    //   category_parent_id: 1,
    //   product_code: "IP16-PRO-001",
    //   name: "iPhone 16 Pro",
    //   buy_price: "1200000",
    //   sell_price: "1750000",
    //   descriptions:
    //     "نسخه Pro از iPhone 16 با دوربین بهتر، سخت‌افزار قوی‌تر و تجربه کاربری روان‌تر.",
    //   status: "active",
    // },
    // {
    //   id: 5,
    //   images: [
    //     {
    //       file: "/image-detail/apple-iphone-17-pro-256gb-silver.png",
    //       type: true,
    //     },
    //     {
    //       file: "/image-detail/_apple-iphone-17-pro-256gb-cosmic-orange.png",
    //       type: false,
    //     },
    //   ],
    //   category: {
    //     id: 105,
    //     parent: { id: 1, title: "Mobile", image: null },
    //   },
    //   category_child_id: 3,
    //   category_parent_id: 1,
    //   product_code: "IP15-001",
    //   name: "iPhone 15",
    //   buy_price: "900000",
    //   sell_price: "1350000",
    //   descriptions:
    //     "مدل iPhone 15 با کیفیت ساخت عالی، طراحی جذاب و قیمت مناسب‌تر نسبت به نسل‌های جدید.",
    //   status: "active",
    // },
    // {
    //   id: 6,
    //   images: [
    //     {
    //       file: "/image-detail/apple-iphone-17-pro-256gb-silver.png",
    //       type: true,
    //     },
    //     {
    //       file: "/image-detail/apple-iphone-17-pro-256gb-deep-blue.png",
    //       type: false,
    //     },
    //   ],
    //   category: {
    //     id: 106,
    //     parent: { id: 1, title: "Mobile", image: null },
    //   },
    //   category_child_id: 3,
    //   category_parent_id: 1,
    //   product_code: "IP15-OLD-001",
    //   name: "iPhone 15 Used",
    //   buy_price: "700000",
    //   sell_price: "1100000",
    //   descriptions:
    //     "مدل کارکرده iPhone 15 با وضعیت مناسب و قیمت اقتصادی برای خرید به‌صرفه.",
    //   status: "notactive",
    // },
  ]);

  // useEffect(() => {
  //   async function fetchCategoryData() {
  //     try {
  //       const response = await axios.get(`/api/catalog/category/${CategoryName}`);
  //       setCategoryChild(response.data.category_children || []);
  //       setProduct(response.data.products || []);
  //     } catch (error) {
  //       console.log("خطا در دریافت اطلاعات دسته‌بندی:", error);
  //     }
  //   }

  //   if (CategoryName) {
  //     fetchCategoryData();
  //   }
  // }, [CategoryName]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await api.get("/api/category/child/");

        const filteredChildren = response.data.filter(
          (item) =>
            item.parent?.title?.toLowerCase() === CategoryName.toLowerCase(),
        );

        setCategoryChild(filteredChildren);

        if (filteredChildren.length > 0) {
          const firstChild = filteredChildren[0];

          const productResponse = await api.get(
            `/api/catalog/product/child/${firstChild.id}/`,
          );

          setProduct(productResponse.data || []);
        } else {
          setProduct([]);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (CategoryName) {
      fetchCategory();
    }
  }, [CategoryName]);

  // const filtered = useMemo(() => {
  //   if (!CategoryName) return [];
  //   const cat = String(CategoryName).trim();
  //   if (!cat) return [];

  //   return product.filter((item) => item.category?.parent?.title === cat);
  // }, [CategoryName, product]);

  const filtered = useMemo(() => {
    if (!CategoryName) return [];

    return product.filter(
      (item) => item.category?.parent?.title?.trim() === CategoryName.trim(),
    );
  }, [CategoryName, product]);

  const heroData = product?.[0];

  //   useEffect(() => {
  //   const fetchCategoryChildren = async () => {
  //     try {
  //       const response = await api.get("/api/category/child/");

  //       const children = response.data.filter(
  //         (item) =>
  //           item.parent?.title?.trim() ===
  //           CategoryName.trim()
  //       );

  //       setCategoryChild(children);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   if (CategoryName) {
  //     fetchCategoryChildren();
  //   }
  // }, [CategoryName]);

  if (!CategoryName || String(CategoryName).trim().length === 0) {
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
    <div className={style.categoryBody}>
      <aside className={style.category}>
        <header className={style.categoryHeader}>
          <div className={style.heroGlowOne}></div>
          <div className={style.heroGlowTwo}></div>

          <div className={style.categoryBox}>
            <span className={style.categoryEyebrow}>Premium Collection</span>

            <h1 className={style.categoryTitle}>
              {heroData?.category?.parent?.title}
            </h1>

            <p className={style.categoryDescription}>
              {heroData?.descriptions}
            </p>

            <div className={style.categoryFeatures}>
              <div className={style.categoryFeatureItem}>
                <span className={style.featureIcon}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>تنوع بالای محصولات</span>
              </div>

              <div className={style.categoryFeatureItem}>
                <span className={style.featureIcon}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>کیفیت اورجینال</span>
              </div>

              <div className={style.categoryFeatureItem}>
                <span className={style.featureIcon}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>انتخاب سریع و مطمئن</span>
              </div>
            </div>
          </div>

          <div className={style.categoryImageContainer}>
            <div className={style.imageOrb}></div>
            <Image
              className={style.categoryImage}
              src="/image-category/IMG_SEGMENT_20260531_104249.png"
              alt="category-image"
              width={900}
              height={900}
              priority
            />
          </div>
        </header>

        <section className={style.tabSection}>
          <CategoryTabFeature
            Tab={categoryChild}
            products={product}
            setProducts={setProduct}
          />
        </section>
      </aside>
    </div>
  );
}
