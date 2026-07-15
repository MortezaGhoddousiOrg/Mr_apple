"use client";

import style from "@/app/CardPage/Card.module.css";
import { useAuth } from "@/app/Context/Context";
import { useRouter } from "next/navigation";
import Image from "next/image";

const FALLBACK_IMAGE = "/image-infosection/IMG_SEGMENT_20260513_115454.png";

export default function Card({ product = [] }) {
  const router = useRouter();
  console.log(product);
  
  const { productbuy, addToCart, setNotif } = useAuth();

  const activeProducts = product.filter(
    (item) => item.status === "active" && item.category,
  );

  const isInCart = (id) => {
    return productbuy?.some((p) => (p.product_id || p.id) === id);
  };

  const handleAddToCart = async (item) => {
    if (isInCart(item.id)) {
      setNotif({
        id: Date.now(),
        message: "این محصول قبلاً به سبد خرید اضافه شده است",
        type: "warning",
      });

      return;
    }

    try {
      await addToCart(item);

      setNotif({
        id: Date.now(),
        message: "محصول با موفقیت به سبد خرید اضافه شد",
        type: "success",
      });
    } catch (err) {
      setNotif({
        id: Date.now(),
        message: "خطا در افزودن محصول",
        type: "error",
      });
    }
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

          const hasDiscount = Number(item.discount) > 0;

          const finalPrice = hasDiscount
            ? Number(item.price) * (1 - Number(item.discount) / 100)
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
                  src={item.image}
                  alt={item.title || "product-image"}
                  width={300}
                  height={300}
                  onClick={() => router.push(`/ProductDetail/${item.id}`)}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
              </div>

              <div className={style.content}>
                <p className={style.serviceTitle}>{item.title}</p>

                <h2 className={style.serviceDescription}>
                  {item.description || "توضیحاتی برای این محصول ثبت نشده است."}
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
                  className={`${style.serviceBtn} ${
                    added ? style.serviceBtnGreen : ""
                  }`}
                  onClick={() => handleAddToCart(item)}
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
