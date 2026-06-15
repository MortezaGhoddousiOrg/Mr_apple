"use client";

import styles from "@/app/ProductBuy/page.module.css";
import { useState } from "react";
import { useAuth } from "@/app/Context/Context";
import DetailUserBuy from "@/app/ProductBuy/DetailUserBuy/DetailUserBuy";

export default function ProductBuy() {
  const { productbuy, updateQuantity, removeFromCart, setNotif } = useAuth();
  const [open, setOpen] = useState(false);

  const increaseQuantity = async (id, currentQty) => {
    try {
      await updateQuantity(id, (currentQty || 1) + 1);
      setNotif({ id: Date.now(), message: "با موفقیت به سبد خرید اضافه شد", type: "success" });
    } catch (err) {
      setNotif({ id: Date.now(), message: "محصول اضافه نشد ، لطفا دوباره امتحان کنید ", type: "error" });
    }
  };


  const decreaseQuantity = async (id, currentQty) => {
    try {
      await updateQuantity(id, Math.max((currentQty || 1) - 1, 1));
    } catch (err) {
      console.log(err);
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

  //   const removeFromCart = async (productId) => {
  //   if (userId) {
  //     try {
  //       const res = await api.post("/cart/remove", {
  //         userId,
  //         productId
  //       });
  //       console.log(res);

  //       setProductBuy((prev) => prev.filter((item) => item.id !== productId));
  //       // setAddedItems((prev) => prev.filter((id) => id !== productId));

  //       return { success: true };
  //     } catch (err) {
  //       console.log(err);
  //       return;
  //     }
  //   } else {
  //     setProductBuy((prev) => prev.filter((item) => item.id !== productId));
  //     // setAddedItems((prev) => prev.filter((id) => id !== productId));
  //     return { success: true };
  //   }
  // };

  // const removeItem = (id) => {
  //   setProductBuy((prev) => prev.filter((item) => item.id !== id));
  // };

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
            <button
              className={styles.checkoutBtn}
              onClick={handleCheckout}
            >
              ادامه فرایند خرید
            </button>
            <DetailUserBuy
              isOpen={open}
              onClose={() => setOpen(false)}
              onSubmitSuccess={(data) => {
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
                        src={item.image}
                        alt={item.title}
                        className={styles.productImage}
                      />
                    </div>

                    <div className={styles.info}>
                      <h3 className={styles.cardTitle}>{item.title}</h3>
                      <div className={styles.meta}>
                        <p className={styles.price}>
                          قیمت واحد: <span>{formatPrice(itemPrice)} تومان</span>
                        </p>
                      </div>
                    </div>

                    <div className={styles.controls}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => decreaseQuantity(item.id, qty)}
                        aria-label="کاهش تعداد"
                      >
                        −
                      </button>
                      <span className={styles.qtyCount}>{qty}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => increaseQuantity(item.id, qty)}
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
                        onClick={() => removeFromCart(item.id)}
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
