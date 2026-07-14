"use client";

import styles from "@/app/ProductBuy/page.module.css";
import { useState } from "react";
import { useAuth } from "@/app/Context/Context";
import DetailUserBuy from "@/app/ProductBuy/DetailUserBuy/DetailUserBuy";
import Image from "next/image";
import { MEDIA_URL } from "../config";

export default function ProductBuy() {
  const { productbuy, updateQuantity, removeFromCart, setNotif } = useAuth();
  const [open, setOpen] = useState(false);

  const increaseQuantity = async (id, currentQty, stock) => {
    if (currentQty >= stock) {
      setNotif({
        id: Date.now(),
        message: "موجودی این محصول به پایان رسیده است",
        type: "warning",
      });

      return;
    }

    try {
      await updateQuantity(id, currentQty + 1);

      setNotif({
        id: Date.now(),
        message: "تعداد محصول افزایش یافت",
        type: "success",
      });
    } catch (err) {
      setNotif({
        id: Date.now(),
        message: "خطا در افزایش تعداد",
        type: "error",
      });
    }
  };

  const decreaseQuantity = async (id, currentQty) => {
    if (currentQty <= 1) {
      setNotif({
        id: Date.now(),
        message: "حداقل تعداد یک عدد است",
        type: "warning",
      });

      return;
    }

    try {
      await updateQuantity(id, currentQty - 1);

      setNotif({
        id: Date.now(),
        message: "تعداد محصول کاهش یافت",
        type: "success",
      });
    } catch (err) {
      setNotif({
        id: Date.now(),
        message: err.response?.data?.error || "خطا در کاهش تعداد",
        type: "error",
      });
    }
  };

  const handleRemoveCart = async (productId) => {
    try {
      await removeFromCart(productId);

      setNotif({
        id: Date.now(),
        message: "محصول از سبد خرید حذف شد",
        type: "success",
      });
    } catch {
      setNotif({
        id: Date.now(),
        message: "خطا در حذف محصول",
        type: "error",
      });
    }
  };

  const handleCheckout = () => {
    if (!productbuy || productbuy.length === 0) {
      setNotif({
        id: Date.now(),
        message: "شما هنوز هیچ کالایی را انتخاب نکرده‌اید",
        type: "warning",
      });
      return;
    }

    setOpen(true);
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

    return sum + price * (item.cart_quantity || 1);
  }, 0);

  const totalCount =
    productbuy?.reduce((sum, item) => sum + (item.cart_quantity || 1), 0) || 0;
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
            <button className={styles.checkoutBtn} onClick={handleCheckout}>
              ادامه فرایند خرید
            </button>
            <DetailUserBuy
              isOpen={open}
              onClose={() => setOpen(false)}
              onSubmitSuccess={(data) => {}}
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

                const qty = item.cart_quantity || 1;
                const itemTotal = itemPrice * qty;

                return (
                  <div key={item.product_id} className={styles.card}>
                    <div className={styles.imageBox}>
                      <Image
                        unoptimized
                        src={
                          item.image?.startsWith("http")
                            ? item.image
                            : `${MEDIA_URL}${item.image}`
                        }
                        alt={item.name || item.title}
                        width={30}
                        height={30}
                        className={styles.productImage}
                      />
                    </div>

                    <div className={styles.info}>
                      <h3 className={styles.cardTitle}>{item.name}</h3>
                      <div className={styles.meta}>
                        <p className={styles.price}>
                          قیمت واحد: <span>{formatPrice(itemPrice)} تومان</span>
                        </p>
                      </div>
                    </div>

                    <div className={styles.controls}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => decreaseQuantity(item.product_id, qty)}
                        aria-label="کاهش تعداد"
                      >
                        −
                      </button>
                      <span className={styles.qtyCount}>{qty}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() =>
                          increaseQuantity(item.product_id, qty, item.quantity)
                        }
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
                        onClick={() => handleRemoveCart(item.product_id)}
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
