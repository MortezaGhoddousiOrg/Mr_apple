"use client";

import styles from "@/app/ProductBuy/page.module.css";
import { useState } from "react";
import { useAuth } from "@/app/Context/Context";
import { useRouter } from "next/navigation";
import DetailUserBuy from "@/app/DetailUserBuy/DetailUserBuy";

export default function ProductBuy() {
  const { productbuy, setProductBuy } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const increaseQuantity = (id) => {
    if (typeof setProductBuy !== "function") return;

    setProductBuy((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: (item.qty || 1) + 1 } : item,
      ),
    );
  };

  const decreaseQuantity = (id) => {
    if (typeof setProductBuy !== "function") return;

    setProductBuy((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, qty: Math.max((item.qty || 1) - 1, 1) }
            : item,
        )
    );
  };

  const removeItem = (id) => {
    if (typeof setProductBuy !== "function") return;

    setProductBuy((prev) => prev.filter((item) => item.id !== id));
  };

  const formatPrice = (price) => {
    const value =
      typeof price === "number"
        ? price
        : Number(String(price).replace(/,/g, "").trim()) || 0;

    return value.toLocaleString("fa-IR");
  };

  const totalPrice = productbuy?.reduce((sum, item) => {
    const price =
      typeof item.price === "number"
        ? item.price
        : Number(String(item.price).replace(/,/g, "").trim()) || 0;

    return sum + price * (item.qty || 1);
  }, 0);

  const totalCount = productbuy?.reduce(
    (sum, item) => sum + (item.qty || 1),
    0,
  );

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.summaryContainer}>
          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>خلاصه سفارش</h2>
            <div className={styles.summaryRow}>
              <span>تعداد کل کالاها</span>
              <span>{totalCount}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>مبلغ قابل پرداخت</span>
              <span className={styles.finalPrice}>
                {formatPrice(totalPrice)} تومان
              </span>
            </div>
            <button className={styles.checkoutBtn} onClick={() => setOpen(true)}>ادامه فرایند خرید</button>
            <DetailUserBuy
        isOpen={open}
        onClose={() => setOpen(false)}
        onSubmitSuccess={(data) => {
          console.log("اطلاعات فرم:", data);
          // اینجا می‌تونی داده رو به مرحله بعدی ذخیره/ارسال کنی
        }}
      />
          </div>
        </div>

        <div className={styles.listContainer}>
          <div className={styles.header}>
            <h1 className={styles.title}>سبد خرید</h1>
            <p className={styles.subtitle}>
              {productbuy?.length > 0
                ? `${totalCount} کالا در سبد خرید شما`
                : "سبد خرید شما خالی است"}
            </p>
          </div>

          {!productbuy || productbuy.length === 0 ? (
            <div className={styles.emptyBox}>
              <p className={styles.emptyText}>
                هنوز هیچ محصولی به سبد خرید اضافه نشده است.
              </p>
            </div>
          ) : (
            <div className={styles.list}>
              {productbuy.map((item) => {
                const itemPrice =
                  typeof item.price === "number"
                    ? item.price
                    : Number(String(item.price).replace(/,/g, "").trim()) || 0;

                const qty = item.qty || 1;
                const itemTotal = itemPrice * qty;

                return (
                  <div key={item.id} className={styles.card}>
                    <div className={styles.imageBox}>
                      <img
                        src={
                          item.image_url ||
                          item.image ||
                          "/placeholder-image.jpg"
                        }
                        alt={item.title || "product"}
                        className={styles.productImage}
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder-image.jpg";
                        }}
                      />
                    </div>

                    <div className={styles.info}>
                      <h3 className={styles.cardTitle}>
                        {item.title || "بدون عنوان"}
                      </h3>
                      <div className={styles.meta}>
                        <p className={styles.price}>
                          قیمت واحد: <span>{formatPrice(itemPrice)} تومان</span>
                        </p>
                      </div>
                    </div>

                    <div className={styles.controls}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => decreaseQuantity(item.id)}
                        aria-label="کاهش تعداد"
                      >
                        −
                      </button>
                      <span className={styles.qtyCount}>{qty}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => increaseQuantity(item.id)}
                        aria-label="افزایش تعداد"
                      >
                        +
                      </button>
                    </div>

                    <div className={styles.side}>
                      <div className={styles.totalPrice}>
                        {formatPrice(itemTotal)} تومان
                      </div>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeItem(item.id)}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
