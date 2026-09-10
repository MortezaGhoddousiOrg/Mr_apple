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
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const increaseQuantity = async (id, currentQty, stock, variantId) => {
    if (currentQty >= stock) {
      setNotif({
        id: Date.now(),
        message: "موجودی این محصول به پایان رسیده است",
        type: "warning",
      });

      return;
    }

    try {
      await updateQuantity(id, currentQty + 1, variantId);

      setNotif({
        id: Date.now(),
        message: "تعداد محصول افزایش یافت",
        type: "success",
      });
    } catch {
      setNotif({
        id: Date.now(),
        message: "خطا در افزایش تعداد",
        type: "error",
      });
    }
  };

  const decreaseQuantity = async (id, currentQty, variantId) => {
    if (currentQty <= 1) {
      setNotif({
        id: Date.now(),
        message: "حداقل تعداد یک عدد است",
        type: "warning",
      });

      return;
    }

    try {
      await updateQuantity(id, currentQty - 1, variantId);

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

  const handleRemoveCart = async (productId, variantId) => {
    try {
      await removeFromCart(productId, variantId);

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

  const toNumber = (val) => {
    if (typeof val === "number") return val;
    return (
      Number(
        String(val ?? "")
          .replace(/,/g, "")
          .trim(),
      ) || 0
    );
  };

  const formatPrice = (price) => toNumber(price).toLocaleString("fa-IR");

  const getPriceInfo = (item) => {
    const originalPrice = toNumber(item.original_price);
    const finalPrice = toNumber(item.price);
    const discountPercent = toNumber(item.discount_percent);

    const hasDiscount =
      originalPrice > 0 && finalPrice > 0 && originalPrice > finalPrice;

    const percentOff = hasDiscount
      ? discountPercent > 0
        ? discountPercent
        : Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
      : 0;

    return {
      originalPrice: originalPrice > 0 ? originalPrice : finalPrice,
      finalPrice: finalPrice > 0 ? finalPrice : originalPrice,
      hasDiscount,
      percentOff,
    };
  };

  const getDetailRows = (item) =>
    [
      {
        label: "دسته‌بندی",
        value: item.category,
      },
      {
        label: "برند",
        value: item.brand,
      },
      {
        label: "کد محصول",
        value: item.sku,
      },
      {
        label: "رنگ",
        value: item.color,
      },
      {
        label: "مدت اشتراک",
        value:
          item.duration_months != null ? `${item.duration_months} ماهه` : null,
      },
      {
        label: "وضعیت",
        value:
          item.condition === "new"
            ? "نو"
            : item.condition === "used"
              ? "کارکرده"
              : item.condition,
      },
      {
        label: "گارانتی",
        value: item.warranty === "no_warranty" ? "بدون گارانتی" : item.warranty,
      },
      {
        label: "مدت گارانتی",
        value:
          item.warranty_months != null ? `${item.warranty_months} ماه` : null,
      },
    ].filter(
      (item) =>
        item.value !== null && item.value !== undefined && item.value !== "",
    );

  const totalPrice = productbuy?.reduce((sum, item) => {
    const { finalPrice } = getPriceInfo(item);
    return sum + finalPrice * (item.cart_quantity || 1);
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
                const qty = item.cart_quantity || 1;
                const { originalPrice, finalPrice, hasDiscount, percentOff } =
                  getPriceInfo(item);
                const itemTotal = finalPrice * qty;
                const cardId = `${item.product_id}-${item.variant_id ?? "no-variant"}`;
                const isExpanded = expandedId === cardId;
                const detailRows = getDetailRows(item);

                return (
                  <div key={cardId} className={styles.cardWrapper}>
                    <div className={styles.card}>
                      <div className={styles.imageBox}>
                        {hasDiscount && (
                          <span className={styles.discountBadge}>
                            {percentOff}%-
                          </span>
                        )}
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
                          <div className={styles.priceBlock}>
                            <p className={styles.price}>
                              قیمت واحد:{" "}
                              <span>{formatPrice(originalPrice)} تومان</span>
                            </p>

                            {hasDiscount && (
                              <>
                                <p className={styles.price}>
                                  قیمت با تخفیف:{" "}
                                  <span className={styles.discountedText}>
                                    {formatPrice(finalPrice)} تومان
                                  </span>
                                </p>

                                <span className={styles.oldPrice}>
                                  {percentOff}% تخفیف
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          className={styles.moreBtn}
                          onClick={() => toggleExpand(cardId)}
                          aria-expanded={isExpanded}
                        >
                          {isExpanded ? "بستن" : "بیشتر"}
                          <span
                            className={`${styles.moreArrow} ${
                              isExpanded ? styles.moreArrowOpen : ""
                            }`}
                          >
                            ▾
                          </span>
                        </button>
                      </div>

                      <div className={styles.controls}>
                        <button
                          className={styles.qtyBtn}
                          onClick={() =>
                            decreaseQuantity(
                              item.product_id,
                              qty,
                              item.variant_id,
                            )
                          }
                          aria-label="کاهش تعداد"
                        >
                          −
                        </button>
                        <span className={styles.qtyCount}>{qty}</span>
                        <button
                          className={styles.qtyBtn}
                          onClick={() =>
                            increaseQuantity(
                              item.product_id,
                              qty,
                              item.quantity,
                              item.variant_id,
                            )
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
                          onClick={() =>
                            handleRemoveCart(item.product_id, item.variant_id)
                          }
                        >
                          حذف
                        </button>
                      </div>
                    </div>

                    <div
                      className={`${styles.detailsPanel} ${
                        isExpanded ? styles.detailsPanelOpen : ""
                      }`}
                    >
                      <div className={styles.detailsInner}>
                        {item.description && (
                          <p className={styles.description}>
                            {item.description}
                          </p>
                        )}

                        {detailRows.length > 0 ? (
                          <div className={styles.detailsTable}>
                            {detailRows.map((row) => (
                              <div key={row.label} className={styles.detailRow}>
                                <span className={styles.detailLabel}>
                                  {row.label}
                                </span>
                                <span className={styles.detailValue}>
                                  {row.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          !item.description && (
                            <p className={styles.noDetails}>
                              جزئیات بیشتری برای این محصول ثبت نشده است.
                            </p>
                          )
                        )}
                      </div>
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
