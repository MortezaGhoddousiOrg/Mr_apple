"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import style from "./CategoryTabFeature.module.css";
import Card from "@/app/CardPage/Card";

const FALLBACK_IMAGE = "/image-infosection/IMG_SEGMENT_20260513_115454.png";

function mapProductToCard(item) {
  const mainImageObject = item?.images?.find((img) => img.type === true);
  const displayImage = mainImageObject?.file || FALLBACK_IMAGE;

  return {
    id: item?.id,
    image: displayImage,
    title: item?.name || "",
    description: item?.descriptions || "",
    price: item?.sell_price ?? "0",
    status: item?.status || "notactive",
    category_child_id: item?.category_child_id ?? null,
  };
}

export default function CategoryTabFeature({ Tab = [], products = [] }) {
  const [categoryId, setCategoryId] = useState(() => Tab?.[0]?.id ?? null);
  const [loading] = useState(false);

  useEffect(() => {
    if (Tab?.length && !Tab.some((item) => item.id === categoryId)) {
      setCategoryId(Tab[0].id);
    }
  }, [Tab, categoryId]);

  const handleClick = (id) => {
    if (id === categoryId) return;
    setCategoryId(id);
  };

  const filteredProducts = useMemo(() => {
    if (!categoryId) return [];
    return (products || []).filter(
      (item) => item.category_child_id === categoryId,
    );
  }, [products, categoryId]);

  const cardData = useMemo(() => {
    return filteredProducts.map(mapProductToCard);
  }, [filteredProducts]);

  if (!Tab?.length) {
    return (
      <div className={style.box}>
        <h2 className={style.title}>هیچ تبی وجود ندارد</h2>
        <p className={style.description}>
          برای نمایش محصولات، ابتدا باید تب‌ها (دسته‌های فرزند) تعریف شوند.
        </p>
      </div>
    );
  }

  return (
    <section className={style.wrapper}>
      <div className={style.categoryTab}>
        {Tab.map((item) => {
          const isActive = item.id === categoryId;

          return (
            <div
              key={item.id}
              className={`${style.containerTab} ${
                isActive ? style.activeTab : ""
              }`}
              onClick={() => handleClick(item.id)}
              role="button"
              tabIndex={0}
            >
              <div className={style.tab}>
                <div className={style.imageWrap}>
                  <Image
                    className={style.imageTab}
                    src={item.image || FALLBACK_IMAGE}
                    alt={item.title || "category-tab"}
                    width={92}
                    height={92}
                  />
                </div>
                <p className={style.titleTab}>{item.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {loading && <p className={style.loading}>در حال دریافت محصولات...</p>}

      {!loading && cardData.length === 0 ? (
        <div className={style.box}>
          <h2 className={style.title}>هیچ محصولی برای این دسته وجود ندارد</h2>
          <p className={style.description}>
            لطفاً یک تب دیگر انتخاب کنید یا بعداً دوباره تلاش کنید.
          </p>
        </div>
      ) : (
        <div className={style.cardSection}>
          <Card product={cardData} />
        </div>
      )}
    </section>
  );
}
