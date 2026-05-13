"use client"

import { useState } from "react";
import style from "@/app/ContactUs/page.module.css";
import axios from "axios";

export default function Contactus({ setNotif }) {
  const [active, setActive] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [dataQuestion, setDataQuestion] = useState([
    {
      question: " آیا محصولات اپل موجود در سایت اصل و اورجینال هستند؟",
      answer:
        " بله، تمامی محصولات موجود در فروشگاه ما اورجینال و دارای شماره سریال معتبر اپل (Apple Serial Number) هستند و می‌توانید صحت آن را در سایت رسمی اپل بررسی کنید",
    },

    {
      question: "آیا محصولات گارانتی دارند؟",
      answer:
        " بله، بسته به نوع محصول، دارای گارانتی معتبر شرکتی (مثلاً: حامی، آواژنگ، مدیا همراه و…) یا گارانتی رسمی بین‌المللی اپل هستند. مدت گارانتی در بخش مشخصات هر محصول درج شده است.",
    },

    {
      question: "ارسال سفارش چند روز طول می‌کشد؟",
      answer:
        "سفارش‌های تهران معمولاً تا ۲۴ ساعت کاری و سفارش‌های شهرستان‌ها در۲ تا ۴ روز کاری ارسال می‌شوند. ارسال با بسته‌بندی امن و بیمه بار انجام می‌شود.",
    },
  ]);

  const toggleActive = (index) => {
    if (active === index) {
      setActive(null);
    } else {
      setActive(index);
    }
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
      return setNotif({ message: "نام را وارد کنید", typr: "error" });
    if (!phoneRegex.test(phone))
      return setNotif({ message: "شماره موبایل معتبر نیست", type: "error" });
    if (message.trim() === "")
      return setNotif({ message: "پیام خود را وارد کنید", type: "error" });

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

      console.log("message successfuly:", response.data);
      setNotif({ message: "پیام شما با موفقیت ارسال شد", type: "success" });
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
        <div>
          <h1 className={style.titleContact}>ارتباط با ما </h1>
          <p className={style.descriptionContact}>
            از اینکه با ما در ارتباط هستید سپاسگزاریم. لطفا جهت ارتباط با ما از
            طریق یکی از روش‌های زیر با ما تماس بگیرید یا از طریق فرم تماس پیغام
            خود را برای ما بفرستید.
          </p>
        </div>
        <img src="/image-about/iphone2025-baner.png" alt="" />
      </section>

      <section className={style.infoContact}>
        <ul>
          <li>
            <i className="bx bx-phone"></i>
            <h3>شماره تماس :</h3>
            <p>051-12345678</p>
          </li>
          <li>
            <i className="bx bx-phone"></i>
            <h3>شماره تماس :</h3>
            <p>051-12345678</p>
          </li>
          <li>
            <i className="bx bx-current-location"></i>
            <h3>آدرس :</h3>
            <p>مشهد - میدان راهنمایی - راهنمایی ۹ </p>
          </li>
          <li>
            <i className="bx bx-time-five"></i>
            <h3>ساعات کاری :</h3>
            <p>
              شنبه تا چهار شنبه از ساعت ۹ الی ۲۲
              <br />
              پنجشنبه از ساعت ۹ الی ۲۰
            </p>
          </li>
        </ul>

        <iframe
          className={style.mapContact}
          title="neshan-map"
          loading="lazy"
          src="https://nshn.ire"
        ></iframe>
      </section>

      <section className={style.contactFormSection}>
        <h2>ارسال پیام به ما </h2>

        <form className={style.contactForm} onSubmit={handleSubmitForm} noValidate>
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

          <button type="submit">ارسال پیام</button>
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
                {active == index ? (
                  <i className="bx bx-minus"></i>
                ) : (
                  <i className="bx bx-plus"></i>
                )}
              </div>

              {/* <div
                className={
                  active === index ? {questionBodyShow} : {questionBody}
                }
              >
                {item.answer} */}
              {/* </div> */}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
