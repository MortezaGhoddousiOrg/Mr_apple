"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { api, MEDIA_URL } from "@/app/config";
import styles from "./page.module.css";
import moment from "moment-jalaali";

// ⚠️ این آرایه قبلاً به‌صورت کامنت رها شده بود و باعث می‌شد کل صفحه (حتی تب
// «اخبار») با خطای «fakePhones is not defined» کرش کند، چون در پایین همین
// فایل بی‌قید‌وشرط استفاده می‌شد. برگردانده شد تا صفحه سالم لود شود.
const fakePhones = [
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro",
    storage: "256GB",
    display: '6.1" OLED',
    chip: "A17 Pro",
    battery: "3200 mAh",
    camera: "48MP",
    ram: "8GB",
  },
  {
    id: "iphone-15",
    name: "iPhone 15",
    storage: "128GB",
    display: '6.1" OLED',
    chip: "A16",
    battery: "3349 mAh",
    camera: "48MP",
    ram: "6GB",
  },
  {
    id: "iphone-14-pro",
    name: "iPhone 14 Pro",
    storage: "128GB",
    display: '6.1" OLED',
    chip: "A15",
    battery: "3200 mAh",
    camera: "48MP",
    ram: "6GB",
  },
  {
    id: "iphone-13",
    name: "iPhone 13",
    storage: "128GB",
    display: '6.1" OLED',
    chip: "A15",
    battery: "3227 mAh",
    camera: "12MP",
    ram: "4GB",
  },
];

const getValue = (str) => parseInt(str.replace(/[^0-9]/g, "")) || 0;

// ⚠️ چون بک‌اند در بعضی حالت‌های هاست، آدرس عکس را کامل (absolute) برمی‌گرداند
// و بعضی وقت‌ها فقط مسیر نسبی، این تابع هر دو حالت را درست می‌سازد. دقیقاً همین
// ناهماهنگی باعث «دیده نشدن عکس مقاله» روی هاست می‌شد (یا پیشوند دوبار اضافه
// می‌شد، یا اسلش بین دامنه و مسیر جا می‌افتاد).
function getMediaUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const base = (MEDIA_URL || "").endsWith("/")
    ? MEDIA_URL.slice(0, -1)
    : MEDIA_URL || "";
  const rel = path.startsWith("/") ? path : `/${path}`;
  return `${base}${rel}`;
}

// عنوان/توضیحات مقالات حالا از تولبار متن غنی ادمین می‌آیند و ممکن است HTML
// باشند (مثلاً <b>...</b>). برای پیش‌نمایش کارت لیست، فقط متن خام نشان
// می‌دهیم تا با line-clamp وسط یک تگ قطع نشود و ظاهر خراب نشود؛ نمایش کامل
// فرمت‌شده در صفحه‌ی جزئیات مقاله انجام می‌شود.
function stripHtml(html) {
  if (!html) return "";
  return String(html).replace(/<[^>]*>/g, "").trim();
}

const specLabels = {
  battery: "باتری",
  ram: "رم",
  storage: "حافظه",
  camera: "دوربین",
  chip: "تراشه",
  display: "صفحه نمایش",
};

const specRecommendations = {
  battery: {
    label: "باتری",
    advice: (name) =>
      `اگر به عمر باتری بیشتر اهمیت می‌دهید، ${name} گزینه بهتری است.`,
  },
  camera: {
    label: "دوربین",
    advice: (name) =>
      `اگر به کیفیت دوربین اهمیت می‌دهید، ${name} انتخاب مناسبی است.`,
  },
  chip: {
    label: "تراشه",
    advice: (name) =>
      `اگر به قدرت پردازشی نیاز دارید، ${name} عملکرد بهتری دارد.`,
  },
  ram: {
    label: "رم",
    advice: (name) =>
      `اگر به اجرای همزمان برنامه‌ها اهمیت می‌دهید، ${name} با رم بیشتر بهتر است.`,
  },
  storage: {
    label: "حافظه",
    advice: (name) =>
      `اگر به فضای ذخیره‌سازی بیشتری نیاز دارید، ${name} مناسب‌تر است.`,
  },
};

// ============================================================
// 🎨 آیکون‌های کوچک SVG - جایگزین ایموجی برای ظاهر حرفه‌ای‌تر
// ============================================================
const Icon = {
  news: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h12v12H4z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 8h4v10a2 2 0 0 1-2 2H6"
      />
      <path strokeLinecap="round" d="M7 8h6M7 11h6M7 14h3" />
    </svg>
  ),
  tutorial: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3l9 5-9 5-9-5 9-5z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 10.5V16c0 1.5 3 3 7 3s7-1.5 7-3v-5.5"
      />
    </svg>
  ),
  compare: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7l-4 5 4 5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7l4 5-4 5" />
      <path strokeLinecap="round" d="M12 5v14" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path strokeLinecap="round" d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
    </svg>
  ),
  empty: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 7h16M4 7l1.5 12a2 2 0 0 0 2 1.8h9a2 2 0 0 0 2-1.8L20 7M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"
      />
    </svg>
  ),
  battery: (
    <svg viewBox="0 0 24 24">
      <rect x="2" y="7" width="18" height="10" rx="2" />
      <path d="M22 10v4" />
    </svg>
  ),
  ram: (
    <svg viewBox="0 0 24 24">
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="M8 6V3M12 6V3M16 6V3M8 21v-3M12 21v-3M16 21v-3" />
    </svg>
  ),
  storage: (
    <svg viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="6" rx="1.5" />
      <rect x="3" y="14" width="18" height="6" rx="1.5" />
      <circle cx="7" cy="7" r="0.6" fill="currentColor" />
      <circle cx="7" cy="17" r="0.6" fill="currentColor" />
    </svg>
  ),
  camera: (
    <svg viewBox="0 0 24 24">
      <path d="M4 8h3l2-2h6l2 2h3v11H4z" />
      <circle cx="12" cy="13" r="3.2" />
    </svg>
  ),
  chip: (
    <svg viewBox="0 0 24 24">
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <path d="M9 2v3M12 2v3M15 2v3M9 19v3M12 19v3M15 19v3M2 9h3M2 12h3M2 15h3M19 9h3M19 12h3M19 15h3" />
    </svg>
  ),
};

export default function Training() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("اخبار");
  const tabs = ["اخبار", "آموزش", "مقایسه"];
  const tabIcons = {
    اخبار: Icon.news,
    آموزش: Icon.tutorial,
    مقایسه: Icon.compare,
  };
  const specIcons = {
    battery: Icon.battery,
    ram: Icon.ram,
    storage: Icon.storage,
    camera: Icon.camera,
    chip: Icon.chip,
    display: Icon.tutorial,
  };

  const [news, setNews] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ عکس‌هایی که لود نشدند اینجا نگه‌داری می‌شوند تا به‌جای آیکون شکسته‌ی
  // مرورگر، جای‌گزین 📷 نشان داده شود
  const [brokenImages, setBrokenImages] = useState(new Set());

  const [phoneAId, setPhoneAId] = useState("iphone-15-pro");
  const [phoneBId, setPhoneBId] = useState("iphone-15");

  const phoneA = fakePhones.find((p) => p.id === phoneAId);
  const phoneB = fakePhones.find((p) => p.id === phoneBId);

  const specsToCompare = ["battery", "ram", "storage", "camera", "chip"];

  const betterThanB = specsToCompare.filter(
    (key) => getValue(phoneA[key]) > getValue(phoneB[key])
  );
  const betterThanA = specsToCompare.filter(
    (key) => getValue(phoneB[key]) > getValue(phoneA[key])
  );
  const equalSpecs = specsToCompare.filter(
    (key) => getValue(phoneA[key]) === getValue(phoneB[key])
  );

  const getRecommendations = () => {
    let recommendations = [];

    if (betterThanB.length > 0) {
      const specs = betterThanB.map((key) => specLabels[key]).join("، ");
      const mainSpec = betterThanB[0];
      const advice =
        specRecommendations[mainSpec]?.advice(phoneA.name) ||
        `${phoneA.name} در ${specs} برتری دارد و برای کاربران حرفه‌ای مناسب‌تر است.`;
      recommendations.push({
        phone: phoneA.name,
        advice: advice,
        specs: specs,
      });
    }

    if (betterThanA.length > 0) {
      const specs = betterThanA.map((key) => specLabels[key]).join("، ");
      const mainSpec = betterThanA[0];
      const advice =
        specRecommendations[mainSpec]?.advice(phoneB.name) ||
        `${phoneB.name} در ${specs} برتری دارد و برای کاربران اقتصادی مناسب‌تر است.`;
      recommendations.push({
        phone: phoneB.name,
        advice: advice,
        specs: specs,
      });
    }

    return recommendations;
  };

  const getComparisonText = () => {
    let parts = [];

    if (betterThanB.length > 0) {
      const specs = betterThanB.map((key) => specLabels[key] || key).join("، ");
      parts.push(`📱 ${phoneA.name} در ${specs} برتری دارد`);
    }

    if (betterThanA.length > 0) {
      const specs = betterThanA.map((key) => specLabels[key] || key).join("، ");
      parts.push(`📱 ${phoneB.name} در ${specs} برتری دارد`);
    }

    if (equalSpecs.length > 0) {
      const specs = equalSpecs.map((key) => specLabels[key] || key).join("، ");
      parts.push(`⚖️ در ${specs} هر دو برابر هستند`);
    }

    if (parts.length === 0) {
      return "✅ این دو مدل کاملاً مشابه هستند و تفاوت قابل توجهی ندارند.";
    }

    return parts.join(" | ");
  };

  const recommendations = getRecommendations();

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const [newsRes, tutorialsRes] = await Promise.all([
          api.get("/education/news/"),
          api.get("/education/tutorials/"),
        ]);
        setNews(newsRes.data);
        setTutorials(tutorialsRes.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // تبدیل تاریخ به شمسی
  const formatDate = (date) => {
    if (!date) return "---";
    try {
      const jDate = moment(date);
      if (jDate.isValid()) {
        return jDate.format("jYYYY/jMM/jDD");
      }
      return date;
    } catch {
      return date;
    }
  };

  // دریافت لیست بر اساس تب فعال
  const getItems = () => {
    if (activeTab === "اخبار") return news;
    if (activeTab === "آموزش") return tutorials;
    return [];
  };

  const items = getItems();

  // فیلتر بر اساس جستجو (روی متن خام، بدون تگ‌های HTML)
  const filteredItems = items.filter(
    (item) =>
      stripHtml(item.title)?.includes(searchTerm) ||
      stripHtml(item.description)?.includes(searchTerm)
  );

  // رفتن به صفحه جزئیات
  const handleCardClick = (id, type) => {
    router.push(`/Training/${id}?type=${type}`);
  };

  const contentTitle = activeTab === "اخبار" ? "آخرین اخبار" : "آموزش‌های تخصصی";

  return (
    <div className={styles.page}>
      <header className={styles.trainingHeader}>
        <div className={styles.trainingContent}>
          <h1 className={styles.trainingTitle}>آموزش و اخبار</h1>
          <p className={styles.trainingDescription}>
            دنیای تکنولوژی اپل در دستان شما. از آخرین اخبار تا آموزش‌های تخصصی
            محصولات برای تجربه بهتر کاربری.
          </p>

          <div className={styles.trainingFeatures}>
            <div className={styles.trainingFeatureItem}>
              <svg viewBox="0 0 24 24">
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              <span>تیم متخصص محصولات اپل</span>
            </div>

            <div className={styles.trainingFeatureItem}>
              <svg viewBox="0 0 24 24">
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              <span>پشتیبانی سریع و تخصصی</span>
            </div>
          </div>
        </div>

        <div className={styles.trainingImageWrapper}>
          <Image
            src="/image-training/hero_startframe__fd0s9s949fu6_medium_2x.jpg"
            alt="Training"
            width={1331}
            sizes="130vm"
            height={600}
            className={styles.trainingImage}
            priority
          />
        </div>
      </header>

      <section className={styles.mainLayout}>
        <aside className={styles.sidebar}>
          <span className={styles.sidebarEyebrow}>مرور محتوا</span>

          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>{Icon.search}</span>
            <input
              className={styles.searchBar}
              type="text"
              placeholder="جستجو در مقاله‌ها..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <nav className={styles.categories}>
            {tabs.map((tab) => {
              const count =
                tab === "اخبار"
                  ? news.length
                  : tab === "آموزش"
                    ? tutorials.length
                    : null;
              return (
                <button
                  key={tab}
                  className={`${styles.catBtn} ${activeTab === tab ? styles.active : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  <span className={styles.catBtnIcon}>{tabIcons[tab]}</span>
                  <span>{tab}</span>
                  {count !== null && (
                    <span className={styles.catBtnCount}>{count}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {activeTab === "مقایسه" && (
            <div className={styles.sidebarCompareTools}>
              <h4 className={styles.toolTitle}>انتخاب مدل‌ها</h4>
              <div className={styles.compareSelectWrapper}>
                <select
                  className={styles.compareSelect}
                  value={phoneAId}
                  onChange={(e) => setPhoneAId(e.target.value)}
                >
                  {fakePhones.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <span className={styles.compareVsBadgeSidebar}>در مقابل</span>
              <div className={styles.compareSelectWrapper}>
                <select
                  className={styles.compareSelect}
                  value={phoneBId}
                  onChange={(e) => setPhoneBId(e.target.value)}
                >
                  {fakePhones.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </aside>

        <main className={styles.contentArea}>
          {(activeTab === "اخبار" || activeTab === "آموزش") && (
            <>
              <div className={styles.contentHeadRow}>
                <h2 className={styles.contentHeadTitle}>{contentTitle}</h2>
                {!loading && (
                  <span className={styles.contentHeadCount}>
                    {filteredItems.length} مورد
                  </span>
                )}
              </div>

              <div className={styles.cardGrid}>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className={styles.skeletonCard}>
                      <div className={styles.skeletonImage} />
                      <div className={styles.skeletonLine} />
                      <div className={`${styles.skeletonLine} ${styles.short}`} />
                    </div>
                  ))
                ) : filteredItems.length === 0 ? (
                  <div className={styles.emptyState}>
                    <span className={styles.emptyStateIcon}>{Icon.empty}</span>
                    <span className={styles.emptyStateTitle}>
                      {searchTerm ? "نتیجه‌ای یافت نشد" : "هیچ مقاله‌ای وجود ندارد"}
                    </span>
                    <span className={styles.emptyStateSubtitle}>
                      {searchTerm
                        ? "عبارت دیگری را امتحان کنید یا جستجو را پاک کنید."
                        : "به‌زودی مقاله‌های جدید اینجا نمایش داده می‌شوند."}
                    </span>
                  </div>
                ) : (
                  filteredItems.map((item) => {
                    const imageUrl = getMediaUrl(item.image);
                    const imageFailed = brokenImages.has(item.id);
                    const badgeType = item.type === "news" ? "news" : "tutorial";
                    return (
                      <div
                        key={item.id}
                        className={styles.articleCard}
                        onClick={() => handleCardClick(item.id, item.type)}
                      >
                        <div className={styles.cardImageWrapper}>
                          {imageUrl && !imageFailed ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={imageUrl}
                              alt={stripHtml(item.title)}
                              className={styles.cardImage}
                              onError={() =>
                                setBrokenImages((prev) =>
                                  new Set(prev).add(item.id)
                                )
                              }
                            />
                          ) : (
                            <div className={styles.cardImageFallback}>📷</div>
                          )}
                          <span
                            className={`${styles.cardBadge} ${styles[badgeType]}`}
                          >
                            {item.type === "news" ? "خبر" : "آموزش"}
                          </span>
                        </div>

                        <div className={styles.cardBody}>
                          <h3 className={styles.cardTitle}>
                            {stripHtml(item.title)}
                          </h3>
                          <p className={styles.cardDescription}>
                            {stripHtml(item.description)}
                          </p>

                          <div className={styles.cardFooter}>
                            <span className={styles.cardDate}>
                              {Icon.calendar}
                              {formatDate(item.publish_date)}
                            </span>
                            <span className={styles.cardArrow}>{Icon.arrow}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}

          {/* {activeTab === "مقایسه" && (
            <>
              <div className={styles.contentHeadRow}>
                <h2 className={styles.contentHeadTitle}>مقایسه مدل‌ها</h2>
              </div>

              <div className={styles.compareWrapper}>
                <div className={styles.compareColumn}>
                  <h2 className={styles.compareTitle}>{phoneA?.name}</h2>
                  <ul className={styles.specList}>
                    {specsToCompare.map((key) => {
                      const isWinner =
                        getValue(phoneA[key]) > getValue(phoneB[key]);
                      return (
                        <li
                          key={key}
                          className={`${styles.specRow} ${isWinner ? styles.winner : ""}`}
                        >
                          <span className={styles.specLabel}>
                            {specIcons[key]}
                            {specLabels[key] || key.toUpperCase()}
                          </span>
                          <div className={styles.specValueWrapper}>
                            <span className={styles.specValue}>
                              {phoneA[key]}
                            </span>
                            {isWinner && (
                              <span className={styles.specAdvantage}>✓</span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <span className={styles.compareVsBadge}>VS</span>

                <div className={styles.compareColumn}>
                  <h2 className={styles.compareTitle}>{phoneB?.name}</h2>
                  <ul className={styles.specList}>
                    {specsToCompare.map((key) => {
                      const isWinner =
                        getValue(phoneB[key]) > getValue(phoneA[key]);
                      return (
                        <li
                          key={key}
                          className={`${styles.specRow} ${isWinner ? styles.winner : ""}`}
                        >
                          <span className={styles.specLabel}>
                            {specIcons[key]}
                            {specLabels[key] || key.toUpperCase()}
                          </span>
                          <div className={styles.specValueWrapper}>
                            <span className={styles.specValue}>
                              {phoneB[key]}
                            </span>
                            {isWinner && (
                              <span className={styles.specAdvantage}>✓</span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <div className={styles.conclusion}>
                <h3>📊 نتیجه‌گیری مقایسه</h3>

                <div className={styles.comparisonResult}>
                  <p className={styles.comparisonSummary}>
                    {getComparisonText()}
                  </p>

                  {recommendations.length > 0 ? (
                    <div className={styles.recommendations}>
                      <h4>💡 پیشنهاد خرید</h4>
                      <ul>
                        {recommendations.map((rec, index) => (
                          <li key={index}>{rec.advice}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className={styles.recommendations}>
                      <p>
                        ✅ هر دو مدل تقریباً مشابه هستند و انتخاب بین آنها
                        سلیقه‌ای است.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )} */}
        </main>
      </section>
    </div>
  );
}