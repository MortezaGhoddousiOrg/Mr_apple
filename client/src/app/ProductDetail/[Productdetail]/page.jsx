"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Head from "next/head";
import styles from "./page.module.css";
import Imagedetail from "@/app/ProductDetail/ImageDetail/Imagedetail";
import { useAuth } from "@/app/Context/Context";
import { api, MEDIA_URL } from "@/app/config";

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

function calcDiscountedPrice(sellPrice, discountPercent) {
  const price = Number(sellPrice);
  const percent = Number(discountPercent);

  if (isNaN(price)) return null;
  if (isNaN(percent) || percent <= 0) return price;

  const discountAmount = price * (percent / 100);
  const finalPrice = price - discountAmount;

  return Math.max(0, finalPrice);
}

function calcDiscountPercent(discountPercent) {
  const percent = Number(discountPercent);
  if (isNaN(percent) || percent <= 0) return 0;
  return Math.min(95, Math.max(0, Math.round(percent)));
}

// ⚠️ چون بک‌اند برای بعضی محیط‌های هاست، MEDIA_URL را به‌صورت آدرس کامل
// برمی‌گرداند و بعضی وقت‌ها فقط مسیر نسبی، این تابع هر دو حالت را درست
// می‌سازد و از باگ «URL دوبار پیشوند خورده» یا «اسلش جا‌افتاده» جلوگیری می‌کند.
function getMediaUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const base = (MEDIA_URL || "").endsWith("/")
    ? MEDIA_URL.slice(0, -1)
    : MEDIA_URL || "";
  const rel = path.startsWith("/") ? path : `/${path}`;
  return `${base}${rel}`;
}

// نگاشت چند رنگ رایج فارسی به کد رنگ، برای نمایش دایره‌ی رنگ در انتخابگر واریانت.
// اگر رنگی در این لیست نبود، دایره با حالت نوترال (نقطه‌چین) نمایش داده می‌شود
// و نام رنگ همیشه به‌صورت متن هم زیرش نوشته می‌شود تا مبهم نماند.
const COLOR_NAME_MAP = {
  "مشکی": "#111827",
  "سیاه": "#111827",
  "سفید": "#f8fafc",
  "آبی": "#2563eb",
  "سرمه‌ای": "#1e3a8a",
  "قرمز": "#ef4444",
  "سبز": "#16a34a",
  "زرد": "#facc15",
  "طلایی": "#eab308",
  "نقره‌ای": "#9ca3af",
  "خاکستری": "#6b7280",
  "بنفش": "#7c3aed",
  "صورتی": "#ec4899",
  "نارنجی": "#f97316",
  "قهوه‌ای": "#78350f",
  "کرمی": "#fef3c7",
  "یاقوتی": "#9f1239",
};

function colorToHex(name) {
  if (!name) return null;
  return COLOR_NAME_MAP[name.trim()] || null;
}

export default function Productdetail() {
  const params = useParams();
  const id = params?.Productdetail;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentRate, setCommentRate] = useState(5);

  // ============================================================
  // 🔥 انتخاب واریانت (رنگ / مدت زمان اشتراک)
  // ============================================================
  const [selectedVariantId, setSelectedVariantId] = useState(null);

  const { addToCart, productbuy, setNotif } = useAuth();

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
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

  // وقتی محصول تغییر کرد (بارگذاری اولیه یا محصول جدید)، اولین واریانت فعال
  // را به‌صورت پیش‌فرض انتخاب کن
  useEffect(() => {
    if (product?.variants && Array.isArray(product.variants)) {
      const firstActive = product.variants.find((v) => v?.is_active !== false);
      setSelectedVariantId(firstActive ? firstActive.id : null);
    } else {
      setSelectedVariantId(null);
    }
  }, [product]);

  const galleryImages = useMemo(() => {
    if (!product?.images || !Array.isArray(product.images)) return [];

    const imagesList = product.images
      .filter((img) => img?.image)
      .map((img) => getMediaUrl(img.image));

    const mainImage = product.images.find((img) => img.is_main === true);
    if (mainImage) {
      const mainUrl = getMediaUrl(mainImage.image);
      const others = imagesList.filter((url) => url !== mainUrl);
      return [mainUrl, ...others];
    }
    return imagesList;
  }, [product]);

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

  // ============================================================
  // 🔥 واریانت‌های فعال + تشخیص اینکه محصول رنگ دارد یا مدت‌زمان اشتراک
  // ============================================================
  const activeVariants = useMemo(() => {
    if (!product?.variants || !Array.isArray(product.variants)) return [];
    return product.variants.filter((v) => v?.is_active !== false);
  }, [product]);

  const hasColorOptions = useMemo(
    () =>
      activeVariants.some((v) => v?.color && String(v.color).trim() !== ""),
    [activeVariants]
  );

  const hasDurationOptions = useMemo(
    () =>
      activeVariants.some(
        (v) =>
          v?.duration_months !== null &&
          v?.duration_months !== undefined &&
          v?.duration_months !== ""
      ),
    [activeVariants]
  );

  const hasVariants =
    activeVariants.length > 0 && (hasColorOptions || hasDurationOptions);

  const selectedVariant = useMemo(
    () => activeVariants.find((v) => v.id === selectedVariantId) || null,
    [activeVariants, selectedVariantId]
  );

  // اگر واریانتی انتخاب شده، قیمت/موجودی/تخفیف از خود واریانت خوانده می‌شود،
  // در غیر این صورت (محصول بدون واریانت) دقیقاً مثل قبل از خود محصول خوانده می‌شود
  const effectiveSellPrice = selectedVariant
    ? selectedVariant.price
    : product?.sell_price;

  // ⚠️ فیلد discount روی واریانت فعلاً در بک‌اند (ProductVariant) وجود ندارد.
  // تا وقتی این فیلد به مدل/سریالایزر اضافه نشود، این مقدار همیشه 0 خواهد بود
  // و تخفیف فقط برای محصولات بدون واریانت اعمال می‌شود.
  const effectiveDiscount = selectedVariant
    ? selectedVariant.discount ?? 0
    : product?.discount;

  const effectiveQuantity = selectedVariant
    ? selectedVariant.quantity
    : product?.quantity;

  const discountedPrice = useMemo(
    () => calcDiscountedPrice(effectiveSellPrice, effectiveDiscount),
    [effectiveSellPrice, effectiveDiscount]
  );

  const hasDiscount = useMemo(() => {
    const percent = Number(effectiveDiscount);
    return !isNaN(percent) && percent > 0;
  }, [effectiveDiscount]);

  const discountPercent = useMemo(
    () => calcDiscountPercent(effectiveDiscount),
    [effectiveDiscount]
  );

  const stockCount = Number(effectiveQuantity ?? 0);
  const inStock = stockCount > 0;

  const isAdded = productbuy?.some(
    (p) =>
      (p.product_id || p.id) === product?.id &&
      (p.variant_id ?? p.variantId ?? null) === (selectedVariant?.id ?? null)
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
      // ⚠️ توجه: باید مطمئن شوی تابع addToCart در Context، فیلد variantId را
      // هم به‌عنوان variant_id به endpoint سبد خرید (/api/orders/cart/add/)
      // ارسال می‌کند، وگرنه محصول بدون واریانت به سبد اضافه خواهد شد.
      await addToCart({
        id: product.id,
        variantId: selectedVariant?.id || null,
        title: product.name,
        price: discountedPrice ?? effectiveSellPrice,
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

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
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

              {hasVariants && (
                <div className={styles.variantSection}>
                  {hasColorOptions && (
                    <div className={styles.variantGroup}>
                      <span className={styles.variantLabel}>رنگ</span>
                      <div className={styles.variantOptions}>
                        {activeVariants
                          .filter(
                            (v) => v.color && String(v.color).trim() !== ""
                          )
                          .map((v) => {
                            const hex = colorToHex(v.color);
                            const isActive = v.id === selectedVariantId;
                            const isOut = Number(v.quantity) <= 0;
                            return (
                              <button
                                key={v.id}
                                type="button"
                                className={`${styles.colorSwatchBtn} ${
                                  isActive ? styles.active : ""
                                } ${isOut ? styles.variantDisabled : ""}`}
                                onClick={() =>
                                  !isOut && setSelectedVariantId(v.id)
                                }
                                disabled={isOut}
                                title={v.color}
                              >
                                <span
                                  className={styles.colorSwatchCircle}
                                  style={{
                                    background: hex || "#e5e7eb",
                                    borderStyle: hex ? "solid" : "dashed",
                                  }}
                                />
                                <span className={styles.colorSwatchName}>
                                  {v.color}
                                </span>
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {hasDurationOptions && (
                    <div className={styles.variantGroup}>
                      <span className={styles.variantLabel}>مدت زمان</span>
                      <div className={styles.variantOptions}>
                        {activeVariants
                          .filter(
                            (v) =>
                              v.duration_months !== null &&
                              v.duration_months !== undefined &&
                              v.duration_months !== ""
                          )
                          .map((v) => {
                            const isActive = v.id === selectedVariantId;
                            const isOut = Number(v.quantity) <= 0;
                            return (
                              <button
                                key={v.id}
                                type="button"
                                className={`${styles.durationPill} ${
                                  isActive ? styles.active : ""
                                } ${isOut ? styles.variantDisabled : ""}`}
                                onClick={() =>
                                  !isOut && setSelectedVariantId(v.id)
                                }
                                disabled={isOut}
                              >
                                {toPersianDigits(v.duration_months)} ماهه
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className={styles.priceBox}>
                <span>قیمت</span>

                {hasDiscount ? (
                  <div className={styles.priceColumn}>
                    <strong>{formatPriceFa(discountedPrice)} تومان</strong>
                    <span className={styles.oldPrice}>
                      {formatPriceFa(effectiveSellPrice)} تومان
                    </span>
                  </div>
                ) : (
                  <strong>{formatPriceFa(effectiveSellPrice)} تومان</strong>
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

              {/* ✅ توضیحات بیشتر */}
              {product?.more_description && (
                <div className={styles.moreDescriptionBox}>
                  <div
                    className={styles.moreDescriptionContent}
                    onClick={toggleDescription}
                  >
                    <div className={styles.moreDescriptionHeader}>
                      <svg
                        className={styles.moreDescriptionIcon}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path d="M12 8v4" />
                        <path d="M12 16h.01" />
                      </svg>
                      <span className={styles.moreDescriptionTitle}>
                        توضیحات بیشتر
                      </span>
                      <svg
                        className={`${styles.moreDescriptionChevron} ${showFullDescription ? styles.chevronOpen : ""}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                    <div
                      className={`${styles.moreDescriptionText} ${!showFullDescription ? styles.collapsed : ""}`}
                    >
                      {product.more_description}
                    </div>
                  </div>
                </div>
              )}
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

      <section className={`${styles.sectionBlock} ${styles.featureSection}`}>
        <div className={styles.sectionHeadRow}>
          <h2 className={styles.sectionTitle}>ویژگی‌ها</h2>
          <p className={styles.sectionSubtitle}>
            اطلاعات ثبت‌شده برای این محصول
          </p>
        </div>
        <div className={styles.featureList}>
          {featureArray.length > 0 ? (
            featureArray.map((item, index) => (
              <div key={`${item?.key}-${index}`} className={styles.featureRow}>
                <span className={styles.featureKey}>{item?.key}</span>
                <span className={styles.featureVal}>{item?.value}</span>
              </div>
            ))
          ) : (
            <div className={styles.emptyFeature}>
              <p>ویژگی‌ای برای این محصول ثبت نشده است</p>
            </div>
          )}
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
                placeholder="نام خود را وارد کنید"
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