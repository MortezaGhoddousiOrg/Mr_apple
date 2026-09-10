"use client";

import style from "@/app/CardPage/Card.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";

const FALLBACK_IMAGE = "/image-infosection/IMG_SEGMENT_20260513_115454.png";

export default function Card({ product = [] }) {
  const router = useRouter();

  const activeProducts = product.filter(
    (item) => item.status === "active" && item.category,
  );

  if (activeProducts.length === 0) {
    return (
      <div className={style.box}>
        <h2 className={style.title}>محصولی پیدا نشد</h2>
        <p className={style.description}>
          متأسفانه هیچ محصولی برای نمایش وجود ندارد.
        </p>
      </div>
    );
  }

  const handleViewProduct = (id) => {
    router.push(`/ProductDetail/${id}`);
  };

  return (
    <div className={style.bodyCard}>
      <section className={style.Card}>
        {activeProducts.map((item) => {
          const hasDiscount = Number(item.discount) > 0;

          const finalPrice = hasDiscount
            ? Number(item.price) *
              (1 - Number(item.discount) / 100)
            : Number(item.price);

          return (
            <div className={style.serviceCard} key={item.id}>
              {hasDiscount && (
                <div className={style.discountBadge}>
                  {Number(item.discount)}٪ تخفیف
                </div>
              )}

              <div className={style.imageBox}>
                <Image
                  unoptimized
                  className={style.serviceImage}
                  src={item.image || FALLBACK_IMAGE}
                  alt={item.title || "product-image"}
                  width={300}
                  height={300}
                  onClick={() => handleViewProduct(item.id)}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
              </div>

              <div className={style.content}>
                <p className={style.serviceTitle}>
                  {item.title}
                </p>

                <h2 className={style.serviceDescription}>
                  {item.description ||
                    "توضیحاتی برای این محصول ثبت نشده است."}
                </h2>
              </div>

              <div className={style.footerCard}>
                <div className={style.servicePrice}>
                  {hasDiscount && (
                    <span className={style.oldPrice}>
                      {Number(item.price).toLocaleString("fa-IR")} تومان
                    </span>
                  )}

                  <span className={style.newPrice}>
                    {finalPrice.toLocaleString("fa-IR")} تومان
                  </span>
                </div>

                <button
                  type="button"
                  className={style.serviceBtn}
                  onClick={() => handleViewProduct(item.id)}
                >
                  مشاهده محصول
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}