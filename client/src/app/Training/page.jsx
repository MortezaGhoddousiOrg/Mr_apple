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

export default function Training() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("اخبار");
  const tabs = ["اخبار", "آموزش", "مقایسه"];

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
          <input
            className={styles.searchBar}
            type="text"
            placeholder="جستجو..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <nav className={styles.categories}>
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`${styles.catBtn} ${activeTab === tab ? styles.active : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>

          {activeTab === "مقایسه" && (
            <div className={styles.sidebarCompareTools}>
              <h4 className={styles.toolTitle}>انتخاب مدل‌ها</h4>
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
          )}
        </aside>

        <main className={styles.contentArea}>
          {(activeTab === "اخبار" || activeTab === "آموزش") && (
            <div className={styles.newsGrid}>
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  در حال بارگذاری...
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? "نتیجه‌ای یافت نشد" : "هیچ مقاله‌ای وجود ندارد"}
                </div>
              ) : (
                filteredItems.map((item) => {
                  const imageUrl = getMediaUrl(item.image);
                  const imageFailed = brokenImages.has(item.id);
                  return (
                    <div
                      key={item.id}
                      className={styles.newsCard}
                      onClick={() => handleCardClick(item.id, item.type)}
                    >
                      <div className={styles.newsContent}>
                        <h3 className={styles.newsTitle}>
                          {stripHtml(item.title)}
                        </h3>
                        <p className={styles.newsDescription}>
                          {stripHtml(item.description)}
                        </p>
                        <span className={styles.newsDate}>
                          {formatDate(item.publish_date)}
                        </span>
                      </div>
                      <div className={styles.newsImageWrapper}>
                        {imageUrl && !imageFailed ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={imageUrl}
                            alt={stripHtml(item.title)}
                            className={styles.newsImage}
                            onError={() =>
                              setBrokenImages((prev) =>
                                new Set(prev).add(item.id)
                              )
                            }
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                            📷
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === "مقایسه" && (
            <>
              <div className={styles.compareWrapper}>
                {[phoneA, phoneB].map((phone, idx) => (
                  <div key={idx} className={styles.compareColumn}>
                    <h2 className={styles.compareTitle}>{phone?.name}</h2>
                    <ul className={styles.specList}>
                      {["battery", "ram", "storage", "camera", "chip"].map(
                        (key) => (
                          <li key={key} className={styles.specRow}>
                            <span className={styles.specLabel}>
                              {specLabels[key] || key.toUpperCase()}
                            </span>
                            <div className={styles.specValueWrapper}>
                              <span className={styles.specValue}>
                                {phone[key]}
                              </span>
                              {(
                                idx === 0
                                  ? getValue(phoneA[key]) >
                                    getValue(phoneB[key])
                                  : getValue(phoneB[key]) >
                                    getValue(phoneA[key])
                              ) ? (
                                <span className={styles.specAdvantage}>✓</span>
                              ) : (
                                <span className={styles.specNeutral} />
                              )}
                            </div>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                ))}
              </div>

              <div className={styles.conclusion}>
                <h3>📊 نتیجه‌گیری مقایسه:</h3>

                <div className={styles.comparisonResult}>
                  <p className={styles.comparisonSummary}>
                    {getComparisonText()}
                  </p>

                  {recommendations.length > 0 && (
                    <div className={styles.recommendations}>
                      <h4>💡 پیشنهاد خرید:</h4>
                      <ul>
                        {recommendations.map((rec, index) => (
                          <li key={index}>{rec.advice}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {recommendations.length === 0 && (
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
          )}
        </main>
      </section>
    </div>
  );
}