"use client";

import style from "@/app/CardPage/Card.module.css";
import { useAuth } from "@/app/Context/Context";
import { useRouter } from "next/navigation";

const FALLBACK_IMAGE =
  "/image-infosection/IMG_SEGMENT_20260513_115454.png";

export default function Card({ product = [] }) {
  const router = useRouter();

  const { productbuy, addToCart } = useAuth();

  const activeProducts = product.filter(
    (item) => item.status === "active"
  );

  const isInCart = (id) => {
    return productbuy?.some((p) => p.id === id);
  };

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

  return (
    <div className={style.bodyCard}>
      <section className={style.Card}>
        {activeProducts.map((item) => {
          const added = isInCart(item.id);

          return (
            <div className={style.serviceCard} key={item.id}>
              <div className={style.imageBox}>
                <img
                  className={style.serviceImage}
                  src={item.image || FALLBACK_IMAGE}
                  alt={item.title || "product-image"}
                  onClick={() =>
                    router.push(`/ProductDetail/${item.id}`)
                  }
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
                <p className={style.servicePrice}>
                  {Number(item.price || 0).toLocaleString("fa-IR")} تومان
                </p>

                <button
                  className={`${style.serviceBtn} ${
                    added ? style.serviceBtnGreen : ""
                  }`}
                  onClick={() => addToCart(item)}
                  disabled={added}
                >
                  {added ? (
                    <>
                      به سبد خرید اضافه شد
                      <svg
                        className={style.svg}
                        viewBox="0 0 24 24"
                        fill="white"
                        width="18"
                        height="18"
                      >
                        <path d="M20.656 2.993L10.007 13.642l-3.471-3.471a.995.995 0 0 0-1.403 1.403l4.173 4.173a.994.994 0 0 0 1.403 0l11.355-11.355a.995.995 0 0 0-1.403-1.403z" />
                      </svg>
                    </>
                  ) : (
                    "افزودن به سبد خرید"
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
