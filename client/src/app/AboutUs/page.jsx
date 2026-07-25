"use client";

import { useState } from "react";
import Image from "next/image";
import style from "@/app/AboutUs/page.module.css";

export default function Aboutus() {
  const [dataFake, setDataFake] = useState([
  {
    img: "/image-about/images (3).jfif",
    name: "پژمان گرگانی",
    job: "مدیریت",
    description:
      "هدایت و برنامه‌ریزی مجموعه، توسعه خدمات و ایجاد تجربه‌ای مطمئن برای مشتریان از مهم‌ترین مسئولیت‌های اوست. تمرکز اصلی او بر رشد مستر اپل و حفظ کیفیت خدمات است.",
  },
  {
    img: "/image-about/images (3).jfif",
    name: "امیر نودهی",
    job: "مدیریت",
    description:
      "مسئول هماهنگی تیم‌ها، مدیریت فرآیندهای داخلی و نظارت بر اجرای پروژه‌ها. تلاش می‌کند تمامی بخش‌ها با بالاترین کیفیت و در زمان مناسب فعالیت کنند.",
  },
  {
    img: "/image-about/images (3).jfif",
    name: "احسان رستم نژاد",
    job: "مدیر فروش و تکنسین نرم افزار",
    description:
      "مدیریت فرآیند فروش، ارائه مشاوره تخصصی به مشتریان و رفع مشکلات نرم‌افزاری محصولات اپل از وظایف اوست. هدف او ارائه بهترین تجربه خرید و خدمات پس از فروش است.",
  },
  {
    img: "/image-about/images (3).jfif",
    name: "علیرضا موسی زاده",
    job: "متخصص محصولات اپل",
    description:
      "با شناخت کامل از محصولات اپل، کاربران را در انتخاب مناسب‌ترین دستگاه متناسب با نیاز و بودجه‌شان راهنمایی می‌کند و پاسخگوی سوالات تخصصی آن‌هاست.",
  },
  {
    img: "/image-about/images (3).jfif",
    name: "مبین شاهی",
    job: "متخصص محصولات اپل",
    description:
      "بررسی مشخصات فنی، مقایسه محصولات و ارائه اطلاعات دقیق درباره اکوسیستم اپل از تخصص‌های اوست تا مشتریان با اطمینان بیشتری تصمیم‌گیری کنند.",
  },
]);

  return (
    <div className={style.aboutBody}>
      <header className={style.aboutHeader}>
        <div className={style.heroContent}>
          <h1 className={style.aboutTitle}>درباره ما</h1>

          <p className={style.aboutDescription}>
            ما در مستر اپل تلاش می‌کنیم تجربه‌ای متفاوت از خرید محصولات اپل برای
            کاربران ایرانی فراهم کنیم؛ تجربه‌ای مینیمال، مطمئن و الهام‌گرفته از
            فلسفه طراحی اپل.
          </p>

          <div className={style.heroFeatures}>
            <div className={style.heroFeatureItem}>
              <svg viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span>تیم متخصص محصولات اپل</span>
            </div>

            <div className={style.heroFeatureItem}>
              <svg viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span>پشتیبانی سریع و تخصصی</span>
            </div>
          </div>
        </div>

        <div className={style.heroImageWrapper}>
          <Image
            src="/image-about/hero_iphone_17_pro__bknyzxfk2agi_small_2x.jpg"
            sizes="101vm"
            alt="About us"
            width={600}
            height={400}
            className={style.heroImage}
          />
        </div>
      </header>

      <section className={style.aboutStore}>
        <h2>داستان ما </h2>
        <p>
          در سال‌های اخیر، هدف ما تنها فروش محصولات اپل نبوده؛ بلکه ساختم
          تجربه‌ای متفاوت از خرید — تجربه‌ای مینیمال، مطمئن و الهام‌گرفته از
          فلسفه‌ی طراحی اپل. تیم AppleHub با ترکیبی از متخصصان تکنولوژی، طراحان
          و علاقه‌مندان به محصولات اپل، مأموریتی دارد: ایجاد پلی میان کاربر
          ایرانی و دنیای پریمیوم فناوری اپل. تلاش می‌کنیم هر تماس، هر سفارش و هر
          گفت‌وگو، همان حس کیفیت و دقتی را داشته باشد که از برند اپل انتظار
          می‌رود.
        </p>
      </section>

      <section className={style.aboutMember}>
        <div className={style.memberHeading}>
          <h2>آشنا شدن با ما </h2>
          <p>همکاران ما در مجموعه‌ی مستر اپل</p>
        </div>

        <div className={style.memberCard}>
          {dataFake.map((item, index) => (
            <div key={index} className={style.memberInfo}>
              <img src={item.img} alt={item.name} />
              <h2>{item.name}</h2>
              <h3>{item.job}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
