"use client"

import { useState } from "react";
import style from "@/app/AboutUs/page.module.css";

export default function Aboutus() {
  const [dataFake, setDataFake] = useState([
    {
      img: "/image-about/iphone2025-baner.png",
      name: "مریم نادری",
      job: "مدیر پشتیبانی مشتریان",
      description:
        "مسئول تعامل با مشتریان و تضمین رضایت آن‌ها در تمامی مراحل خرید. با دقت و صمیمیت پاسخ‌گوی هر سوال شماست.",
    },

    {
      img: "/image-about/iphone2025-baner.png",
      name: "آرمان رضایی",
      job: "مدیر فنی و فناوری اطلاعات",
      description:
        "نظارت بر عملکرد فنی وب‌سایت، بروزرسانی‌ها و امنیت زیرساخت‌ها. عاشق کدنویسی تمیز و تجربه‌ی کاربری سریع.",
    },

    {
      img: "/image-about/iphone2025-baner.png",
      name: "نیلوفر موسوی",
      job: "طراح تجربه کاربری (UX/UI)",
      description:
        "مسئول طراحی مینیمال و هماهنگ با فلسفه‌ی اپل برای بخش‌های مختلف سایت. تمرکز بر سادگی و زیبایی تعامل کاربر.",
    },
    {
      img: "/image-about/iphone2025-baner.png",
      name: "محمد شریفی",
      job: " متخصص محصولات اپل (Product Expert)",
      description:
        "پاسخ‌گوی جزئیات تخصصی محصولات مانند مک‌بوک، آیفون و آی‌پد. راهنمای انتخاب هوشمندانه‌ی شما.",
    },
    {
      img: "/image-about/iphone2025-baner.png",
      name: "سحر احمدی",
      job: "مدیر ارتباطات و محتوا",
      description:
        "مسئول تولید محتوا، اطلاع‌رسانی و هماهنگی کمپین‌های تبلیغاتی. لحن برند را با حس اپلی و حرفه‌ای حفظ می‌کند.",
    },
    {
      img: "/image-about/iphone2025-baner.png",
      name: "کامران ابوطالبی",
      job: "مدیر واحد سفارشات و لجستیک",
      description:
        "تضمین آماده‌سازی سریع، بسته‌بندی استاندارد و تحویل به‌موقع سفارش‌ها. دقت و زمان‌بندی نقطه قوت اوست.",
    },
  ]);
  return (
    <div className={style.aboutBody}>
      <header className={style.aboutHeader}>
        <div>
          <h1>درباره ما</h1>
          <p>
            ما در مجموعه‌ی AppleHub همیشه آماده شنیدن صدای شما هستیم. اگر پرسشی،
            پیشنهادی یا درخواستی دارید، تیم پشتیبانی ما در کنار شماست تا بهترین
            تجربه را از محصولات اپل برایتان رقم بزند.
          </p>
        </div>
        <img src="/image-about/iphone2025-baner.png" alt="" />
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
          <p>همکاران ما در مجموعه‌ی فلان </p>
        </div>

        <div className={style.memberCard}>
          {dataFake.map((item, index) => (
            <div key={index} className={style.memberInfo}>
              <img src={item.img} alt="" />
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
