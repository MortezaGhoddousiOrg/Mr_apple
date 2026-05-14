"use client";

import { useState } from "react";
import style from "@/app/ContactUs/page.module.css";
import Image from "next/image";
import axios from "axios";

export default function Contactus({ setNotif }) {
  const [active, setActive] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [dataQuestion] = useState([
    {
      question: "آیا محصولات اپل موجود در سایت اصل و اورجینال هستند؟",
      answer:
        "بله، تمامی محصولات موجود در فروشگاه ما اورجینال و دارای شماره سریال معتبر اپل هستند و می‌توانید صحت آن را در سایت رسمی اپل بررسی کنید.",
    },

    {
      question: "آیا محصولات گارانتی دارند؟",
      answer:
        "بله، بسته به نوع محصول دارای گارانتی معتبر شرکتی یا گارانتی رسمی بین‌المللی اپل هستند.",
    },

    {
      question: "ارسال سفارش چند روز طول می‌کشد؟",
      answer:
        "سفارش‌های تهران معمولاً تا ۲۴ ساعت کاری و سفارش‌های شهرستان‌ها بین ۲ تا ۴ روز کاری ارسال می‌شوند.",
    },
  ]);

  const toggleActive = (index) => {
    setActive(active === index ? null : index);
  };

  const handleChangeForm = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const { username, phone, subject, message } = formData;

    const phoneRegex = /^09\d{9}$/;

    if (username.trim() === "")
      return setNotif({
        message: "نام را وارد کنید",
        type: "error",
      });

    if (!phoneRegex.test(phone))
      return setNotif({
        message: "شماره موبایل معتبر نیست",
        type: "error",
      });

    if (message.trim() === "")
      return setNotif({
        message: "پیام خود را وارد کنید",
        type: "error",
      });

    const dataFormToSend = {
      username,
      phone,
      subject,
      message,
      createdAt: new Date(),
    };

    try {
      const response = await axios.post("/api/user/", dataFormToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("message successfully:", response.data);

      setNotif({
        message: "پیام شما با موفقیت ارسال شد",
        type: "success",
      });

      setFormData({
        username: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.log(err);

      setNotif({
        message: "خطا در ارسال لطفا دوباره امتحان کنید",
        type: "error",
      });
    }
  };

  return (
    <div className={style.bodyContact}>

      <section className={style.headerContact}>
        <div className={style.heroContent}>
          <span className={style.contactBadge}>
            <i className="bx bx-headphone"></i>
            پشتیبانی سریع • پاسخگویی ۲۴ ساعته
          </span>

          <h1 className={style.titleContact}>ارتباط با ما</h1>

          <p className={style.descriptionContact}>
            اگر درباره خرید محصولات اپل، گوشی‌های کارکرده، وضعیت سفارش،
            تعمیرات یا خدمات فروشگاه سوالی دارید، تیم پشتیبانی ما همیشه آماده
            پاسخگویی به شماست.
          </p>


          <div className={style.heroFeatures}>
            <div className={style.heroFeatureItem}>
              <i className="bx bx-check-shield"></i>
              <span>ضمانت اصالت کالا</span>
            </div>

            <div className={style.heroFeatureItem}>
              <i className="bx bx-time-five"></i>
              <span>پاسخگویی سریع</span>
            </div>

            <div className={style.heroFeatureItem}>
              <i className="bx bx-support"></i>
              <span>مشاوره تخصصی اپل</span>
            </div>
          </div>


          <div className={style.heroButtons}>
            <a href="tel:05112345678" className={style.primaryBtn}>
              <i className="bx bx-phone-call"></i>
              تماس با ما
            </a>

            <a href="#contact-form" className={style.secondaryBtn}>
              <i className="bx bx-message-rounded"></i>
              ارسال پیام
            </a>
          </div>

          <div className={style.heroLine}></div>
        </div>


        <div className={style.floatingIcon1}>
          <i className="bx bxl-apple"></i>
        </div>

        <div className={style.floatingIcon2}>
          <i className="bx bx-headphone"></i>
        </div>

        <div className={style.floatingIcon3}>
          <i className="bx bx-mobile-alt"></i>
        </div>

        {/* image */}

        <div className={style.heroImageWrapper}>
          {/* <Image
            src="/image-about/iphone2025-baner.png"
            alt="iphone"
            width={500}
            height={500}
            priority
            className={style.heroImage}
          /> */}
        </div>
      </section>


      <section className={style.infoContact}>
        <ul>
          <li>
            <div className={style.infoIcon}>
              <i className="bx bx-phone"></i>
            </div>

            <div>
              <h3>شماره تماس</h3>
              <p>051-12345678</p>
            </div>
          </li>

          <li>
            <div className={style.infoIcon}>
              <i className="bx bx-mobile"></i>
            </div>

            <div>
              <h3>پشتیبانی</h3>
              <p>09123456789</p>
            </div>
          </li>

          <li>
            <div className={style.infoIcon}>
              <i className="bx bx-current-location"></i>
            </div>

            <div>
              <h3>آدرس فروشگاه</h3>
              <p>مشهد - میدان راهنمایی - راهنمایی ۹</p>
            </div>
          </li>

          <li>
            <div className={style.infoIcon}>
              <i className="bx bx-time-five"></i>
            </div>

            <div>
              <h3>ساعات کاری</h3>
              <p>
                شنبه تا چهارشنبه ۹ الی ۲۲
                <br />
                پنجشنبه ۹ الی ۲۰
              </p>
            </div>
          </li>
        </ul>

        <iframe
          className={style.mapContact}
          title="neshan-map"
          loading="lazy"
          src="https://nshn.ir"
        ></iframe>
      </section>


      <section className={style.contactFormSection} id="contact-form">
        <h2>ارسال پیام به ما</h2>

        <form
          className={style.contactForm}
          onSubmit={handleSubmitForm}
          noValidate
        >
          <div className={style.formInputFirst}>
            <div>
              <label>نام شما :</label>

              <input
                type="text"
                onChange={handleChangeForm}
                value={formData.username}
                name="username"
                required
              />
            </div>

            <div>
              <label>شماره موبایل :</label>

              <input
                type="tel"
                name="phone"
                onChange={handleChangeForm}
                value={formData.phone}
                required
              />
            </div>
          </div>

          <select
            className={style.contactFormSelect}
            onChange={handleChangeForm}
            value={formData.subject}
            name="subject"
          >
            <option>انتخاب موضوع</option>
            <option>مشکل در خرید اینترنتی</option>
            <option>سوال درباره خدمات</option>
            <option>مشاوره خرید کالا</option>
            <option>مشکل در ارسال کالا</option>
            <option>انتقاد و پیشنهاد</option>
          </select>

          <div className={style.formInput}>
            <label>متن پیام :</label>

            <textarea
              name="message"
              onChange={handleChangeForm}
              value={formData.message}
              required
            ></textarea>
          </div>

          <button type="submit">
            <i className="bx bx-send"></i>
            ارسال پیام
          </button>
        </form>
      </section>


      <section className={style.questionSection}>
        <h2>سوالات متداول</h2>

        <div className={style.question}>
          {dataQuestion.map((item, index) => (
            <div key={index} className={style.questionItem}>
              <div
                className={style.questionHeader}
                onClick={() => toggleActive(index)}
              >
                {item.question}

                {active === index ? (
                  <i className="bx bx-minus"></i>
                ) : (
                  <i className="bx bx-plus"></i>
                )}
              </div>

              <div
                className={
                  active === index
                    ? style.questionBodyShow
                    : style.questionBody
                }
              >
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
