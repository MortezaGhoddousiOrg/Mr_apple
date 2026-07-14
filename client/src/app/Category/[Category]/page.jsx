"use client";

import { useEffect, useState } from "react";
import style from "@/app/Category/[Category]/page.module.css";
import { useParams } from "next/navigation";
import Image from "next/image";
import { api } from "@/app/config";
import CategoryTabFeature from "@/app/CategoryTabFeature/CategoryTabFeature";
import { useAuth } from "@/app/Context/Context";

export default function Category() {
  const params = useParams();
  const rawCategory = params?.Category;
  const CategoryName = rawCategory
    ? decodeURIComponent(rawCategory).trim()
    : "";

  const [categoryChild, setCategoryChild] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { setNotif } = useAuth();

  const [product, setProduct] = useState([]);

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

          setSelectedCategory(firstChild);

          const productResponse = await api.get(
            `/api/catalog/product/child/${firstChild.id}/`,
          );

          const validProducts = (productResponse.data || []).filter(
            (item) => item.status === "active" && item.category !== null,
          );

          setProduct(validProducts);
        } else {
          setProduct([]);
        }
      } catch (err) {
        setNotif({
          id: Date.now(),
          message: "حطا در دریافت اطلاعات",
          type: "error",
        });
      }
    };

    if (CategoryName) {
      fetchCategory();
    }
  }, [CategoryName]);

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
              {selectedCategory?.parent?.title || "دسته بندی خالی است "}
            </h1>

            <p className={style.categoryDescription}>
              {selectedCategory?.descriptions ||
                "برای این دسته بندی محصولی وجود ندارد"}
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
            setSelectedCategory={setSelectedCategory}
          />
        </section>
      </aside>
    </div>
  );
}
