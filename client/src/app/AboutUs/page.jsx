"use client";

import { useState } from "react";
import Image from "next/image";
import style from "@/app/AboutUs/page.module.css";

export default function Aboutus() {
  const [dataFake, setDataFake] = useState([
    {
      img: "/image-about/images (3).jfif",
      name: "مریم نادری",
      job: "مدیر پشتیبانی مشتریان",
      description:
        "مسئول تعامل با مشتریان و تضمین رضایت آن‌ها در تمامی مراحل خرید. با دقت و صمیمیت پاسخ‌گوی هر سوال شماست.",
    },
    {
      img: "/image-about/images (3).jfif",
      name: "آرمان رضایی",
      job: "مدیر فنی و فناوری اطلاعات",
      description:
        "نظارت بر عملکرد فنی وب‌سایت، بروزرسانی‌ها و امنیت زیرساخت‌ها. عاشق کدنویسی تمیز و تجربه‌ی کاربری سریع.",
    },
    {
      img: "/image-about/images (3).jfif",
      name: "نیلوفر موسوی",
      job: "طراح تجربه کاربری (UX/UI)",
      description:
        "مسئول طراحی مینیمال و هماهنگ با فلسفه‌ی اپل برای بخش‌های مختلف سایت. تمرکز بر سادگی و زیبایی تعامل کاربر.",
    },
    {
      img: "/image-about/images (3).jfif",
      name: "محمد شریفی",
      job: " متخصص محصولات اپل (Product Expert)",
      description:
        "پاسخ‌گوی جزئیات تخصصی محصولات مانند مک‌بوک، آیفون و آی‌پد. راهنمای انتخاب هوشمندانه‌ی شما.",
    },
    {
      img: "/image-about/images (3).jfif",
      name: "سحر احمدی",
      job: "مدیر ارتباطات و محتوا",
      description:
        "مسئول تولید محتوا، اطلاع‌رسانی و هماهنگی کمپین‌های تبلیغاتی. لحن برند را با حس اپلی و حرفه‌ای حفظ می‌کند.",
    },
    {
      img: "/image-about/images (3).jfif",
      name: "کامران ابوطالبی",
      job: "مدیر واحد سفارشات و لجستیک",
      description:
        "تضمین آماده‌سازی سریع، بسته‌بندی استاندارد و تحویل به‌موقع سفارش‌ها. دقت و زمان‌بندی نقطه قوت اوست.",
    },
  ]);

  return (
    <div className={style.aboutBody}>
      <header className={style.aboutHeader}>
        <div className={style.heroContent}>
          <h1 className={style.aboutTitle}>درباره ما</h1>

          <p className={style.aboutDescription}>
            ما در AppleHub تلاش می‌کنیم تجربه‌ای متفاوت از خرید محصولات اپل برای
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
            src="/image-about/IMG_SEGMENT_20260521_145912.png"
            alt="About us"
            width={420}
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
