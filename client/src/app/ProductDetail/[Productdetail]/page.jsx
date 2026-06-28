"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import styles from "./page.module.css";
import Imagedetail from "@/app/ProductDetail/ImageDetail/Imagedetail";
import { useAuth } from "@/app/Context/Context";
import { api } from "@/app/config";

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

// ✅ تابع محاسبه قیمت نهایی با تخفیف درصدی
function calcDiscountedPrice(sellPrice, discountPercent) {
  const price = Number(sellPrice);
  const percent = Number(discountPercent);

  if (isNaN(price)) return null;
  if (isNaN(percent) || percent <= 0) return price;

  const discountAmount = price * (percent / 100);
  const finalPrice = price - discountAmount;

  return Math.max(0, finalPrice);
}

// ✅ تابع محاسبه درصد تخفیف برای نمایش
function calcDiscountPercent(discountPercent) {
  const percent = Number(discountPercent);
  if (isNaN(percent) || percent <= 0) return 0;
  return Math.min(95, Math.max(0, Math.round(percent)));
}

export default function Productdetail() {
  const params = useParams();
  const id = params?.Productdetail;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentRate, setCommentRate] = useState(5);

  const { addToCart, productbuy, setNotif } = useAuth();

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        // ✅ اصلاح: حذف /public/ از آدرس
        const response = await api.get(`/api/catalog/product/${id}/`);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("محصول مورد نظر یافت نشد");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // گالری تصاویر
  const galleryImages = useMemo(() => {
    if (!product?.images || !Array.isArray(product.images)) return [];

    const imagesList = product.images
      .filter((img) => img?.image)
      .map((img) => `http://127.0.0.1:4000${img.image}`);

    const mainImage = product.images.find((img) => img.is_main === true);
    if (mainImage) {
      const mainUrl = `http://127.0.0.1:4000${mainImage.image}`;
      const others = imagesList.filter((url) => url !== mainUrl);
      return [mainUrl, ...others];
    }
    return imagesList;
  }, [product]);

  // تبدیل feature از object به array
  const featureArray = useMemo(() => {
    if (!product?.feature) return [];
    if (Array.isArray(product.feature)) return product.feature;
    if (typeof product.feature === "object") {
      return Object.entries(product.feature).map(([key, value]) => ({
        key,
        value,
      }));
    }
    return [];
  }, [product]);

  // ✅ قیمت نهایی بعد از اعمال تخفیف
  const discountedPrice = useMemo(
    () => calcDiscountedPrice(product?.sell_price, product?.discount),
    [product?.sell_price, product?.discount],
  );

  // ✅ بررسی وجود تخفیف
  const hasDiscount = useMemo(() => {
    const percent = Number(product?.discount);
    return !isNaN(percent) && percent > 0;
  }, [product?.discount]);

  // ✅ درصد تخفیف برای نمایش
  const discountPercent = useMemo(
    () => calcDiscountPercent(product?.discount),
    [product?.discount],
  );

  const stockCount = Number(product?.quantity ?? 0);
  const inStock = stockCount > 0;

  const isAdded = productbuy?.some(
    (p) => (p.product_id || p.id) === product?.id,
  );

  const handleAddToCart = async () => {
    if (!product?.id) return;

    if (!inStock) {
      setNotif({
        id: Date.now(),
        message: "این محصول موجود نیست",
        type: "warning",
      });
      return;
    }

    if (isAdded) {
      setNotif({
        id: Date.now(),
        message: "این محصول قبلاً به سبد خرید اضافه شده است",
        type: "warning",
      });
      return;
    }

    try {
      await addToCart({
        id: product.id,
        title: product.name,
        price: discountedPrice ?? product.sell_price,
        image: galleryImages?.[0] || "",
        description: product.descriptions,
      });

      setNotif({
        id: Date.now(),
        message: "محصول با موفقیت به سبد خرید اضافه شد",
        type: "success",
      });
    } catch (err) {
      console.error(err);

      setNotif({
        id: Date.now(),
        message: "خطا در افزودن محصول",
        type: "error",
      });
    }
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    console.log({
      productId: id ? Number(id) : null,
      name: commentName.trim(),
      text: commentText.trim(),
      rate: Number(commentRate),
      createdAt: new Date().toISOString(),
    });
    setCommentName("");
    setCommentText("");
    setCommentRate(5);
  };

  if (loading) {
    return (
      <div className={styles.pageShell}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>در حال بارگذاری محصول...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.pageShell}>
        <div className={styles.errorContainer}>
          <p>{error || "محصول یافت نشد"}</p>
          <Link href="/" className={styles.backLink}>
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    );
  }

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
              <Link href="/Products">محصولات</Link>
              <span>/</span>
              <span>{product?.name}</span>
            </div>

            <div className={styles.kicker}>
              New • {product?.product_code || "2026"}
            </div>
            <h1 className={styles.title}>{product?.name}</h1>

            <p className={styles.description}>{product?.descriptions}</p>

            <div className={styles.chipRow}>
              <span className={styles.chip}>ارسال سریع</span>
              <span className={styles.chip}>ضمانت اصالت</span>
              <span className={styles.chip}>۷ روز بازگشت</span>
              <span className={styles.chip}>پشتیبانی ۲۴/۷</span>
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
          <div className={styles.highlightCard}>
            <div className={styles.highlightTitle}>کیفیت ساخت عالی</div>
            <div className={styles.highlightValue}>مواد اولیه درجه یک</div>
          </div>
          <div className={styles.highlightCard}>
            <div className={styles.highlightTitle}>طراحی ارگونومیک</div>
            <div className={styles.highlightValue}>استفاده راحت و بی‌نقص</div>
          </div>
          <div className={styles.highlightCard}>
            <div className={styles.highlightTitle}>قیمت مناسب</div>
            <div className={styles.highlightValue}>ارزش خرید بالا</div>
          </div>
          <div className={styles.highlightCard}>
            <div className={styles.highlightTitle}>گارانتی معتبر</div>
            <div className={styles.highlightValue}>ضمانت اصالت و سلامت</div>
          </div>
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
          {featureArray.map((item, index) => (
            <div key={`${item?.key}-${index}`} className={styles.featureRow}>
              <span className={styles.featureKey}>{item?.key}</span>
              <span className={styles.featureVal}>{item?.value}</span>
            </div>
          ))}
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
    </div>
  );
}
