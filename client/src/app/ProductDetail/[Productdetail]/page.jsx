"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import Imagedetail from "@/app/ProductDetail/ImageDetail/Imagedetail";

const fakeProducts = {
  "1": {
    id: "1",
    title: "آیفون 17 پرو مکس",
    shortDescription:
      "گوشی قدرتمند اپل با طراحی پریمیوم، نمایشگر پیشرفته، دوربین حرفه‌ای و عملکرد فوق‌العاده سریع.",
    price: 499999000,
    // guarantee: "گارانتی 18 ماهه",
    colorOptions: [
      {
        label: "سفید",
        value: "white",
        image: "/image-detail/apple-iphone-17-pro-256gb-silver.png",
      },
      {
        label: "نارنجی",
        value: "orange",
        image: "/image-detail/_apple-iphone-17-pro-256gb-cosmic-orange.png",
      },
      {
        label: "آبی تیره",
        value: "darkblue",
        image: "/image-detail/apple-iphone-17-pro-256gb-deep-blue.png",
      },
    ],
    images: [
      "/image-detail/apple-iphone-17-pro-256gb-silver.png",
      "/image-detail/_apple-iphone-17-pro-256gb-cosmic-orange.png",
      "/image-detail/apple-iphone-17-pro-256gb-deep-blue.png",
    ],
    features: [
      { title: "برند", value: "Apple", icon: "brand" },
      { title: "پارت نامبر", value: "ZAA", icon: "tag" },
      { title: "گارانتی", value: "18 ماهه", icon: "shield" },
      { title: "وضعیت", value: "آکبند", icon: "status" },
      { title: "حافظه داخلی", value: "256 گیگابایت", icon: "storage" },
      { title: "حافظه رم", value: "8 گیگابایت", icon: "ram" },
    ],
    shipping:
      "ارسال سفارش در تهران به‌صورت فوری و با پیک اختصاصی انجام می‌شود و معمولاً در همان روز به دست مشتری می‌رسد. برای سایر شهرها، سفارش‌ها از طریق پست پیشتاز یا تیپاکس ارسال می‌شوند که بسته به مقصد بین 2 تا 4 روز کاری زمان خواهد برد. همچنین امکان تحویل حضوری با هماهنگی قبلی از دفتر یا انبار مرکزی فروشگاه نیز فراهم است. تمامی سفارش‌ها با بسته‌بندی ایمن ارسال می‌شوند تا محصول در سلامت کامل به دست شما برسد.",
    specs: [
      {
        section: "بدنه",
        items: [
          { label: "جنس بدنه", value: "تیتانیوم گرید 5" },
          { label: "جنس پشت", value: "شیشه مات مقاوم" },
          { label: "فریم", value: "فلزی مقاوم" },
          { label: "استاندارد مقاومت", value: "IP68" },
        ],
      },
      {
        section: "صفحه نمایش",
        items: [
          { label: "ابعاد", value: "6.9 اینچ" },
          { label: "نوع", value: "LTPO OLED" },
          { label: "رزولوشن", value: "2868×1320" },
          { label: "نرخ نوسازی", value: "120 هرتز" },
        ],
      },
      {
        section: "پردازنده",
        items: [
          { label: "چیپ", value: "A19 Pro" },
          { label: "رم", value: "12 گیگابایت" },
          { label: "پردازنده مرکزی", value: "6 هسته‌ای" },
          { label: "پردازنده گرافیکی", value: "Apple GPU" },
        ],
      },
      {
        section: "دوربین",
        items: [
          { label: "دوربین اصلی", value: "48 مگاپیکسل" },
          { label: "اولترا واید", value: "12 مگاپیکسل" },
          { label: "تله فوتو", value: "12 مگاپیکسل" },
          { label: "فیلم‌برداری", value: "4K HDR" },
        ],
      },
      {
        section: "باتری",
        items: [
          { label: "نوع", value: "لیتیوم یونی" },
          { label: "شارژ سریع", value: "35 وات" },
          { label: "شارژ بی‌سیم", value: "MagSafe" },
          { label: "درگاه", value: "USB Type-C" },
        ],
      },
      {
        section: "ارتباطات",
        items: [
          { label: "شبکه", value: "5G" },
          { label: "Wi‑Fi", value: "Wi‑Fi 7" },
          { label: "بلوتوث", value: "نسخه 5.4" },
          { label: "موقعیت‌یاب", value: "GPS / GLONASS / Galileo" },
        ],
      },
    ],
    rating: 4.8,
    reviewCount: 128,
    comments: [
      { id: 1, name: "علی", text: "کیفیت ساخت فوق‌العاده‌ست." },
      { id: 2, name: "مریم", text: "نمایشگر و سرعت عالیه." },
      { id: 3, name: "رضا", text: "طراحی خیلی جذابه." },
      { id: 4, name: "سارا", text: "باتری خیلی خوب نگه می‌داره." },
      { id: 5, name: "حسین", text: "دوربین عالیه." },
    ],
  },
};

function getFeatureIcon(icon) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (icon) {
    case "brand":
      return (
        <svg {...common}>
          <path d="M4 7h16" />
          <path d="M7 7v10" />
          <path d="M17 7v10" />
        </svg>
      );
    case "tag":
      return (
        <svg {...common}>
          <path d="M20 12l-8 8-8-8V4h8l8 8z" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3l7 4v5c0 5-3.5 7.7-7 9-3.5-1.3-7-4-7-9V7l7-4z" />
        </svg>
      );
    case "status":
      return (
        <svg {...common}>
          <path d="M20 6L9 17l-5-5" />
        </svg>
      );
    case "storage":
      return (
        <svg {...common}>
          <rect x="4" y="6" width="16" height="12" rx="2" />
        </svg>
      );
    case "ram":
      return (
        <svg {...common}>
          <rect x="5" y="7" width="14" height="10" rx="2" />
        </svg>
      );
    default:
      return null;
  }
}

function toPersianDigits(value) {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[digit]);
}

function formatPriceFa(price) {
  if (price === null || price === undefined) return "";
  const englishFormatted = Number(price).toLocaleString("en-US");
  return toPersianDigits(englishFormatted);
}

export default function Productdetail() {
  const { Productdetail } = useParams();
  const specsRef = useRef(null);

  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [rating, setRating] = useState(5);
  const [commentText, setCommentText] = useState("");

  const [commentIndex, setCommentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [visible, setVisible] = useState(3);

  useEffect(() => {
    const data = fakeProducts[String(Productdetail)] || fakeProducts["1"];
    setProduct({ ...data, id: Productdetail });
    setSelectedColor(0);
  }, [Productdetail]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setVisible(1);
      } else {
        setVisible(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!product) return;

    const interval = setInterval(() => {
      setCommentIndex((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, [product]);

  useEffect(() => {
    if (!product) return;

    if (commentIndex === product.comments.length) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCommentIndex(0);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [commentIndex, product]);

  useEffect(() => {
    if (!isTransitioning) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
    }
  }, [isTransitioning]);

  const scrollToSpecs = () => {
    specsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getSpecIcon = (section) => {
    const title = section?.toLowerCase?.() || "";

    if (title.includes("بدنه")) {
      return (
        <svg viewBox="0 0 24 24" fill="none" className={styles.specSvgIcon}>
          <rect x="7" y="2.5" width="10" height="19" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="18" r="1" fill="currentColor" />
        </svg>
      );
    }

    if (title.includes("نمایشگر") || title.includes("صفحه")) {
      return (
        <svg viewBox="0 0 24 24" fill="none" className={styles.specSvgIcon}>
          <rect x="3" y="5" width="18" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M9 20h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    }

    if (title.includes("پردازنده") || title.includes("چیپ")) {
      return (
        <svg viewBox="0 0 24 24" fill="none" className={styles.specSvgIcon}>
          <rect x="7" y="7" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M9 1v4M15 1v4M9 19v4M15 19v4M19 9h4M19 15h4M1 9h4M1 15h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    }

    if (title.includes("دوربین")) {
      return (
        <svg viewBox="0 0 24 24" fill="none" className={styles.specSvgIcon}>
          <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h2l1.2-1.5h4.6L15.5 6h2A2.5 2.5 0 0 1 20 8.5v7A2.5 2.5 0 0 1 17.5 18h-11A2.5 2.5 0 0 1 4 15.5v-7Z" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    }

    if (title.includes("باتری")) {
      return (
        <svg viewBox="0 0 24 24" fill="none" className={styles.specSvgIcon}>
          <rect x="4" y="7" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M18 10h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M8 10.5l2-2v2h2l-2 2v-2H8Z" fill="currentColor" />
        </svg>
      );
    }

    if (title.includes("حافظه") || title.includes("رم") || title.includes("storage")) {
      return (
        <svg viewBox="0 0 24 24" fill="none" className={styles.specSvgIcon}>
          <rect x="5" y="6" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M9 10h6M9 14h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    }

    if (title.includes("ارتباطات")) {
      return (
        <svg viewBox="0 0 24 24" fill="none" className={styles.specSvgIcon}>
          <path
            d="M17 10h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2M15 10V6a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v4M12 14h.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 14c1.5-1.5 1.5-3.5 0-5M2 17c3-3 3-6 0-9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    }

    return (
      <svg viewBox="0 0 24 24" fill="none" className={styles.specSvgIcon}>
        <path d="M12 8v4l2.5 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  };

  const currentColorImage = useMemo(() => {
    if (!product?.colorOptions?.length) return product?.images?.[0] || "";
    return product.colorOptions[selectedColor]?.image || product.images?.[0] || "";
  }, [product, selectedColor]);

  const galleryImages = useMemo(() => {
    if (!product) return [];
    const baseImages = product.images || [];
    if (!currentColorImage) return baseImages;

    const filtered = baseImages.filter((img) => img !== currentColorImage);
    return [currentColorImage, ...filtered];
  }, [product, currentColorImage]);

  if (!product) {
    return <div className={styles.pageShell}>در حال بارگذاری...</div>;
  }

  const extendedComments =
    visible === 1
      ? [...product.comments, product.comments[0]]
      : [...product.comments, ...product.comments.slice(0, visible)];

  const translate = `translateX(-${commentIndex * (100 / visible)}%)`;

  const nextComment = () => {
    setCommentIndex((prev) => prev + 1);
  };

  const prevComment = () => {
    if (commentIndex === 0) {
      setIsTransitioning(false);
      setCommentIndex(product.comments.length - 1);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsTransitioning(true));
      });
      return;
    }
    setCommentIndex((prev) => prev - 1);
  };

  return (
    <div className={styles.pageShell}>
      <section className={styles.heroSection}>
        <div className={styles.heroGrid}>
          <div className={styles.infoSide}>
            <div className={styles.breadcrumb}>
              <Link href="/">خانه</Link>
              <span>/</span>
              <Link href="/products">محصولات</Link>
              <span>/</span>
              <span>{product.title}</span>
            </div>

            <h1 className={styles.title}>{product.title}</h1>
            <p className={styles.description}>{product.shortDescription}</p>

            <div className={styles.colorRow}>
              <span className={styles.colorLabel}>انتخاب رنگ:</span>

              <div className={styles.colorList}>
                {product.colorOptions?.map((color, i) => (
                  <button
                    key={color.value || i}
                    onClick={() => setSelectedColor(i)}
                    className={
                      selectedColor === i
                        ? styles.colorPillActive
                        : styles.colorPill
                    }
                    type="button"
                  >
                    {color.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.purchaseCard}>
              <div className={styles.priceBox}>
                <span>قیمت</span>
                <strong>{formatPriceFa(product.price)} تومان</strong>
              </div>

              <div className={styles.actionRow}>
                <button className={styles.primaryBtn}>افزودن به سبد خرید</button>
                <button
                  className={styles.secondaryBtn}
                  onClick={scrollToSpecs}
                >
                  مشاهده مشخصات فنی
                </button>
              </div>

              <div className={styles.guarantee}>{product.guarantee}</div>
            </div>
          </div>

          <div className={styles.imageSide}>
            <div className={styles.mainImageFrame}>
              <Imagedetail images={galleryImages} />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <h2 className={styles.sectionTitle}>ویژگی‌ها</h2>
        <div className={styles.featureGrid}>
          {product.features.map((f, i) => (
            <div key={i} className={styles.featureCard}>
              <div className={styles.featureIcon}>{getFeatureIcon(f.icon)}</div>
              <div className={styles.featureContent}>
                <span className={styles.featureTitle}>{f.title}</span>
                <span className={styles.featureValue}>{f.value}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <h2 className={styles.sectionTitle}>نحوه ارسال محصولات</h2>

        <div className={styles.shippingGrid}>
          <div className={styles.shippingCard}>
            <div className={styles.shippingIcon}>
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="1" y="7" width="15" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <path d="M16 10h3l3 3v4h-6z" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="6" cy="18" r="1.8" fill="currentColor" />
                <circle cx="18" cy="18" r="1.8" fill="currentColor" />
              </svg>
            </div>

            <h4 className={styles.shippingTitle}>ارسال و تحویل</h4>

            <p className={styles.shippingText}>
              سفارش‌ها در شهر مشهد از طریق پیک در سریع‌ترین زمان ممکن ارسال می‌شوند.
              برای سایر شهرها، مرسوله از طریق پست پیشتاز ارسال شده و معمولاً طی
              ۲ تا ۳ روز کاری به دست شما خواهد رسید.
            </p>
          </div>

          <div className={styles.shippingCard}>
            <div className={styles.shippingIcon}>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 3l7 3v6c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.8" />
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>

            <h4 className={styles.shippingTitle}>ضمانت و اصالت کالا</h4>

            <p className={styles.shippingText}>
              تمامی محصولات با ضمانت اصالت و سلامت فیزیکی ارائه می‌شوند.
              در صورت وجود هرگونه مشکل، امکان بازگشت کالا طبق شرایط فروشگاه
              و پشتیبانی کامل برای شما فراهم است.
            </p>
          </div>

          <div className={styles.shippingCard}>
            <div className={styles.shippingIcon}>
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 10l9-6 9 6v9a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h4 className={styles.shippingTitle}>تحویل حضوری</h4>

            <p className={styles.shippingText}>
              در صورت تمایل می‌توانید سفارش خود را به‌صورت حضوری از فروشگاه
              در شهر مشهد تحویل بگیرید. پس از ثبت سفارش، زمان تحویل با شما هماهنگ خواهد شد.
            </p>
          </div>
        </div>
      </section>

      <section ref={specsRef} className={styles.sectionBlock}>
        <div className={styles.specsHeader}>
          <h2 className={styles.sectionTitle}>مشخصات فنی</h2>
        </div>

        <div className={`${styles.appleInfoGrid} ${showAllSpecs ? styles.showAll : ""}`}>
          {product.specs.map((group, i) => (
            <div key={i} className={styles.specInfoBlock}>
              <div className={styles.specBlockHeader}>
                <span className={styles.specBlockIcon}>
                  {getSpecIcon(group.section)}
                </span>
                <h3 className={styles.specBlockTitle}>{group.section}</h3>
              </div>

              <div className={styles.specBlockContent}>
                {group.items.map((item, j) => (
                  <div key={j} className={styles.specInfoRow}>
                    <span className={styles.specInfoLabel}>{item.label}</span>
                    <span className={styles.specInfoValue}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.specsFadeContainer}>
          <button
            className={styles.appleMoreBtn}
            onClick={() => setShowAllSpecs(!showAllSpecs)}
          >
            {showAllSpecs ? (
              <>
                <span>بستن جزئیات</span>
                <i className="bi bi-chevron-up"></i>
              </>
            ) : (
              <>
                <span>مشاهده همه جزئیات</span>
                <i className="bi bi-chevron-down"></i>
              </>
            )}
          </button>
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <h2 className={styles.sectionTitle}>ثبت نظر</h2>

        <div className={styles.reviewTop}>
          <div className={styles.ratingBox}>
            <strong>{toPersianDigits(product.rating)} از ۵</strong>
            <span>{toPersianDigits(product.reviewCount)} نظر ثبت شده</span>
          </div>

          <form
            className={styles.commentForm}
            onSubmit={(e) => e.preventDefault()}
          >
            <textarea
              placeholder="نظر خود را بنویسید..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />

            <div className={styles.commentFormFooter}>
              <div className={styles.starPicker}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={
                      rating >= star
                        ? styles.starPickActive
                        : styles.starPick
                    }
                  >
                    ★
                  </button>
                ))}
              </div>

              <button className={styles.primaryBtn}>ارسال نظر</button>
            </div>
          </form>
        </div>

        {/* <div className={styles.commentsCarousel}>
          <button
            className={`${styles.carouselBtn} ${styles.carouselPrev}`}
            onClick={prevComment}
          >
            ›
          </button>

          <div className={styles.commentsViewport}>
            <div
              className={styles.commentsTrack}
              style={{
                transform: translate,
                transition: isTransitioning
                  ? "transform 0.6s cubic-bezier(.65,.05,.36,1)"
                  : "none",
              }}
            >
              {extendedComments.map((c, i) => {
                const activeIndex =
                  visible === 1 ? commentIndex : commentIndex + 1;

                return (
                  <div
                    key={`${c.id}-${i}`}
                    className={`${styles.commentCardSmall} ${i === activeIndex ? styles.commentCardActive : ""}`}
                  >
                    <div className={styles.commentInner}>
                      <p>{c.text}</p>
                      <strong>{c.name}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            className={`${styles.carouselBtn} ${styles.carouselNext}`}
            onClick={nextComment}
          >
            ‹
          </button>
        </div> */}
      </section>
    </div>
  );
}
