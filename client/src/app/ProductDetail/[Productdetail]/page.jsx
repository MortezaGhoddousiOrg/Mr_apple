"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Head from "next/head";
import axios from "axios";
import styles from "./page.module.css";
import Imagedetail from "@/app/ProductDetail/ImageDetail/Imagedetail";
import { useAuth } from "@/app/Context/Context";

const fakeProductFromBackendShape = {
  id: 6,
  name: "ایفون 17 پرو مکس",
  descriptions:
    "آیفون 17 پرو مکس با طراحی مدرن، دوربین پیشرفته، نمایشگر باکیفیت و عملکرد سریع، انتخابی مناسب برای کاربرانی است که به دنبال تجربه‌ای حرفه‌ای و روان در استفاده روزمره و چندرسانه‌ای هستند.",
  sell_price: "500000000",
  discount: "25000000",
  quantity: 5,
  images: [
    { file: "/image-detail/apple-iphone-17-pro-256gb-silver.png", type: true },
    {
      file: "/image-detail/_apple-iphone-17-pro-256gb-cosmic-orange.png",
      type: false,
    },
    {
      file: "/image-detail/apple-iphone-17-pro-256gb-deep-blue.png",
      type: false,
    },
  ],
  feature: [
    { key: "برند", value: "Apple" },
    { key: "مدل", value: "iPhone 17 Pro Max" },
    { key: "پارت نامبر", value: "ZAA" },
    { key: "وضعیت", value: "آکبند" },
    { key: "حافظه داخلی", value: "256 گیگابایت" },
    { key: "رنگ", value: "نقره‌ای" },
  ],
};

const fakePdpContent = {
  highlights: [
    { title: "تیتانیوم سبک", value: "بدنه مقاوم‌تر، وزن کمتر" },
    { title: "دوربین Pro", value: "جزئیات شارپ + Night mode" },
    { title: "نمایشگر Super Retina", value: "روشنایی بالا، رنگ دقیق" },
    { title: "باتری بهتر", value: "استفاده روزانه با خیال راحت" },
  ],
  chips: ["ارسال سریع", "ضمانت اصالت", "۷ روز بازگشت", "پشتیبانی ۲۴/۷"],
  inTheBox: ["کابل USB‑C", "سوزن سیم‌کارت", "دفترچه راهنما"],
};

function toPersianDigits(value) {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[digit]);
}

function formatPriceFa(price) {
  if (price === null || price === undefined || price === "") return "";
  const n = Number(price);
  if (Number.isNaN(n)) return toPersianDigits(String(price));
  return toPersianDigits(n.toLocaleString("en-US"));
}

function calcDiscountedPrice(sellPrice, discount) {
  const price = Number(sellPrice);
  const off = Number(discount);
  if (Number.isNaN(price)) return null;
  if (Number.isNaN(off) || off <= 0) return price;
  return Math.max(0, price - off);
}

function calcDiscountPercent(sellPrice, discount) {
  const price = Number(sellPrice);
  const off = Number(discount);
  if (Number.isNaN(price) || Number.isNaN(off) || price <= 0 || off <= 0)
    return 0;
  return Math.min(95, Math.max(0, Math.round((off / price) * 100)));
}

export default function Productdetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(fakeProductFromBackendShape);
  const [loading, setLoading] = useState(false);

  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentRate, setCommentRate] = useState(5);

  const { addToCart, productbuy } = useAuth();

  // useEffect(() => {
  //   if (!id) return;
  //   let alive = true;
  //
  //   const fetchProduct = async () => {
  //     try {
  //       setLoading(true);
  //       const res = await axios.get(`/api/product/${id}/`);
  //       const backendProduct = res?.data?.data || res?.data;
  //       if (!alive) return;
  //       setProduct(backendProduct || fakeProductFromBackendShape);
  //     } catch (error) {
  //       if (!alive) return;
  //       console.error("خطا در دریافت محصول:", error);
  //       setProduct(fakeProductFromBackendShape);
  //     } finally {
  //       if (alive) setLoading(false);
  //     }
  //   };
  //
  //   fetchProduct();
  //   return () => {
  //     alive = false;
  //   };
  // }, [id]);

  const galleryImages = useMemo(() => {
    const imgs = Array.isArray(product?.images) ? product.images : [];
    const validFiles = imgs
      .filter((item) => item?.file)
      .map((item) => item.file);

    const mainImage = imgs.find((item) => item?.type === true)?.file;
    if (mainImage) {
      const rest = validFiles.filter((file) => file !== mainImage);
      return [mainImage, ...rest];
    }
    return validFiles;
  }, [product]);

  const discountedPrice = useMemo(
    () => calcDiscountedPrice(product?.sell_price, product?.discount),
    [product?.sell_price, product?.discount],
  );

  const hasDiscount = useMemo(() => {
    const off = Number(product?.discount);
    return !Number.isNaN(off) && off > 0;
  }, [product?.discount]);

  const discountPercent = useMemo(
    () => calcDiscountPercent(product?.sell_price, product?.discount),
    [product?.sell_price, product?.discount],
  );

  const stockCount = Number(product?.quantity ?? 0);
  const inStock = stockCount > 0;

  const isAdded = productbuy?.some((p) => p.id === product?.id);

  const handleAddToCart = async () => {
    if (!product?.id) return;
    if (!inStock) return;
    if (isAdded) return;

    try {
      await addToCart({
        id: product.id,
        title: product.name,
        price: discountedPrice ?? product?.sell_price,
        image: galleryImages?.[0] || product?.images?.[0]?.file || "",
        description: product.descriptions,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();

    const payload = {
      productId: id ? Number(id) : null,
      name: commentName.trim(),
      text: commentText.trim(),
      rate: Number(commentRate),
      createdAt: new Date().toISOString(),
    };

    // console.log("NEW_COMMENT:", payload);

    setCommentName("");
    setCommentText("");
    setCommentRate(5);
  };

  return (
    <div className={styles.pageShell}>
      <Head>
        {galleryImages?.[0] && (
          <link rel="preload" as="image" href={galleryImages[0]} />
        )}
      </Head>

      <section className={styles.heroSection}>
        <div className={styles.heroGrid}>
          <div className={styles.infoSide}>
            <div className={styles.breadcrumb}>
              <Link href="/">خانه</Link>
              <span>/</span>
              <Link href="/products">محصولات</Link>
              <span>/</span>
              <span>{product?.name}</span>
            </div>

            <div className={styles.kicker}>New • 2026</div>
            <h1 className={styles.title}>{product?.name}</h1>

            <p className={styles.description}>{product?.descriptions}</p>

            <div className={styles.chipRow}>
              {fakePdpContent.chips.map((c) => (
                <span key={c} className={styles.chip}>
                  {c}
                </span>
              ))}
            </div>

            <div className={styles.purchaseCard}>
              <div className={styles.priceBox}>
                <span>قیمت</span>

                {hasDiscount ? (
                  <div className={styles.priceColumn}>
                    <strong>{formatPriceFa(discountedPrice)} تومان</strong>
                    <span className={styles.oldPrice}>
                      {formatPriceFa(product?.sell_price)} تومان
                    </span>
                  </div>
                ) : (
                  <strong>{formatPriceFa(product?.sell_price)} تومان</strong>
                )}
              </div>

              <div className={styles.metaRow}>
                <div className={styles.stockLine}>
                  <span className={styles.dot} data-ok={inStock ? "1" : "0"} />
                  <span>
                    {inStock ? "" : "ناموجود"} • موجودی:{" "}
                    {toPersianDigits(stockCount)}
                  </span>
                </div>

                {hasDiscount && (
                  <div className={styles.discountPill}>
                    {toPersianDigits(discountPercent)}٪ تخفیف
                  </div>
                )}
              </div>

              <div className={styles.actionRow}>
                <button
                  className={`${styles.primaryBtn} ${isAdded ? styles.primaryBtnGreen : ""}`}
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!inStock}
                >
                  {!inStock ? (
                    "ناموجود"
                  ) : isAdded ? (
                    <>
                      به سبد خرید اضافه شد
                      <svg
                        className={styles.tickIcon}
                        viewBox="0 0 24 24"
                        fill="white"
                        aria-hidden="true"
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
          </div>

          <div className={styles.imageSide}>
            <div className={styles.imageWrapper}>
              <Imagedetail
                images={galleryImages}
                discountPercent={discountPercent}
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <div className={styles.sectionHeadRow}>
          <h2 className={styles.sectionTitle}>نکات برجسته</h2>
          <p className={styles.sectionSubtitle}>چند نکته کلیدی و مهم</p>
        </div>

        <div className={styles.highlightGrid}>
          {fakePdpContent.highlights.map((h) => (
            <div key={h.title} className={styles.highlightCard}>
              <div className={styles.highlightTitle}>{h.title}</div>
              <div className={styles.highlightValue}>{h.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={`${styles.sectionBlock} ${styles.featureSection}`}>
        <div className={styles.sectionHeadRow}>
          <h2 className={styles.sectionTitle}>ویژگی‌ها</h2>
          <p className={styles.sectionSubtitle}>
            اطلاعات ثبت‌شده برای این محصول
          </p>
        </div>

        <div className={styles.featureList}>
          {(Array.isArray(product?.feature) ? product.feature : []).map(
            (item, index) => (
              <div key={`${item?.key}-${index}`} className={styles.featureRow}>
                <span className={styles.featureKey}>{item?.key}</span>
                <span className={styles.featureVal}>{item?.value}</span>
              </div>
            ),
          )}
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <div className={styles.sectionHeadRow}>
          <h2 className={styles.sectionTitle}>نظرات کاربران</h2>
          <p className={styles.sectionSubtitle}>نظر خودتان را ثبت کنید</p>
        </div>

        <form className={styles.commentForm} onSubmit={handleSubmitComment}>
          <div className={styles.commentGrid}>
            <div className={styles.field}>
              <label className={styles.label}>نام و نام خانوادگی</label>
              <input
                className={styles.input}
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>امتیاز</label>

              <div
                className={styles.stars}
                role="radiogroup"
                aria-label="امتیاز"
              >
                {[5, 4, 3, 2, 1].map((n) => {
                  const active = n <= Number(commentRate);
                  return (
                    <button
                      key={n}
                      type="button"
                      className={`${styles.starBtn} ${active ? styles.starActive : ""}`}
                      onClick={() => setCommentRate(n)}
                      aria-label={`امتیاز ${n}`}
                      aria-pressed={Number(commentRate) === n}
                    >
                      ★
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label}>متن نظر</label>
              <textarea
                className={styles.textarea}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="نظرتون درباره این محصول چیه؟"
                rows={4}
              />
            </div>
          </div>

          <div className={styles.commentActions}>
            <button className={styles.primaryBtn} type="submit">
              ثبت نظر
            </button>
          </div>
        </form>
      </section>

      {/* <section className={styles.sectionBlock}>
          <div className={styles.sectionHeadRow}>
            <h2 className={styles.sectionTitle}>محتویات جعبه</h2>
            <p className={styles.sectionSubtitle}>نمایشی (فیک) برای UI</p>
          </div>

          <div className={styles.boxGrid}>
            {fakePdpContent.inTheBox.map((x) => (
              <div key={x} className={styles.boxItem}>
                <span className={styles.boxBullet} />
                <span>{x}</span>
              </div>
            ))}
          </div>
        </section> */}
    </div>
  );
}
