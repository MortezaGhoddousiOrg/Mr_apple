"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import style from "@/app/ContactUs/page.module.css";
import { useAuth } from "@/app/Context/Context";
import axios from "axios";

function AccordionBody({ isActive, children }) {
  const ref = useRef(null);
  const { setNotif } = useAuth();

  const maxHeight = isActive
    ? ref.current
      ? ref.current.scrollHeight + "px"
      : "none"
    : "0px";

  return (
    <div
      className={
        isActive
          ? style.questionBodyShow
          : style.questionBody
      }
      style={{
        maxHeight: maxHeight,
      }}
    >
      <div ref={ref} className={style.answerContent}>
        {children}
      </div>
    </div>
  );
}

export default function Contactus() {
  const [active, setActive] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const infoSectionRef = useRef(null);

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleScrollToContactInfo = () => {
    infoSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const { username, phone, subject, message } = formData;
    const phoneRegex = /^09\d{9}$/;

    if (username.trim() === "")
      return setNotif({ message: "نام را وارد کنید", type: "error" });
    if (!phoneRegex.test(phone))
      return setNotif({ message: "شماره موبایل معتبر نیست", type: "error" });
    if (message.trim() === "")
      return setNotif({ message: "پیام خود را وارد کنید", type: "error" });

    const dataFormToSend = { username, phone, subject, message, createdAt: new Date() };

    try {
      await axios.post("/api/user/", dataFormToSend);
      setNotif({ message: "پیام شما با موفقیت ارسال شد", type: "success" });
      setFormData({ username: "", phone: "", subject: "", message: "" });
      setOpenModal(false);
    } catch {
      setNotif({ message: "خطا در ارسال لطفا دوباره امتحان کنید", type: "error" });
    }
  };

  return (
    <div className={style.bodyContact}>
      <section className={style.headerContact}>
        <div className={style.heroContent}>
          <h1 className={style.titleContact}>ارتباط با ما</h1>
          <p className={style.descriptionContact}>
            اگر درباره خرید محصولات اپل، گوشی‌های کارکرده، وضعیت سفارش،
            تعمیرات یا خدمات فروشگاه سوالی دارید، تیم پشتیبانی ما همیشه آماده پاسخگویی به شماست.
          </p>
          <div className={style.heroFeatures}>
            <div className={style.heroFeatureItem}>
              <svg viewBox="0 0 24 24" fill="white" width="18">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span>ضمانت اصالت کالا</span>
            </div>
            <div className={style.heroFeatureItem}>
              <svg viewBox="0 0 24 24" fill="white" width="18">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span>پاسخگویی سریع</span>
            </div>
            <div className={style.heroFeatureItem}>
              <svg viewBox="0 0 24 24" fill="white" width="18">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span>مشاوره تخصصی اپل</span>
            </div>
          </div>
          <div className={style.heroButtons}>
            <button
              type="button"
              className={style.primaryBtn}
              onClick={handleScrollToContactInfo}
            >
              <i className="bx bx-phone-call"></i>
              تماس با ما
            </button>
            <button
              className={style.secondaryBtn}
              onClick={() => setOpenModal(true)}
            >
              <i className="bx bx-message-rounded"></i>
              ارسال پیام
            </button>
          </div>
        </div>
        <div className={style.heroImageContainer}>
          <Image
            src="/image-contact/IMG_SEGMENT_20260531_104249.png"
            alt="Contact us"
            sizes="190vm"
            width={420}
            height={400}
            className={style.heroImg}
          />
        </div>
      </section>

      <section ref={infoSectionRef} className={style.infoContact}>
        <div className={style.contactInfoBox}>
          <div className={style.infoItem}>
            <div className={style.iconBox}>
              <svg viewBox="0 0 24 24">
                <path d="M6.6 10.8c1.5 3 3.6 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.9.6.6 0 1 .4 1 1V21c0 .6-.4 1-1 1C10.1 22 2 13.9 2 3c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.4.2 2.7.6 3.9.1.4 0 .8-.3 1.1l-2.2 2.8z" />
              </svg>
            </div>
            <span>051-12345678</span>
          </div>

          <div className={style.infoItem}>
            <div className={style.iconBox}>
              <svg viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </div>
            <span>support@example.com</span>
          </div>

          <div className={style.infoItem}>
            <div className={style.iconBox}>
              <svg viewBox="0 0 24 24">
                <path d="M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z" />
              </svg>
            </div>
            <span>مشهد - خیابان مثال</span>
          </div>

          <div className={style.infoItem}>
            <div className={style.iconBox}>
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" fill="none" />
                <path d="M12 7v5l3 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
            <span>هر روز از ساعت ۹ الی ۲۲</span>
          </div>
        </div>

        <iframe
          className={style.mapContact}
          src="https://neshan.org/maps/@36.2605,59.6168,14z"
          loading="lazy"
          title="Neshan Map"
        ></iframe>
      </section>

      {openModal && (
        <div
          className={style.modalOverlay}
          onClick={() => setOpenModal(false)}
        >
          <div
            className={style.contactModal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={style.closeModal}
              onClick={() => setOpenModal(false)}
              aria-label="Close modal"
            >
              ×
            </button>
            <h2 className={style.modalTitle}>ارسال پیام</h2>
            <form className={style.modalForm} onSubmit={handleSubmitForm}>
              <div className={style.inputGroup}>
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChangeForm}
                  placeholder=" "
                />
                <label>نام شما</label>
              </div>
              <div className={style.inputGroup}>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChangeForm}
                  placeholder=" "
                />
                <label>شماره موبایل</label>
              </div>
              <div className={style.inputGroup}>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChangeForm}
                >
                  <option value="">انتخاب موضوع</option>
                  <option>مشکل در خرید اینترنتی</option>
                  <option>سوال درباره خدمات</option>
                  <option>مشاوره خرید کالا</option>
                  <option>مشکل در ارسال کالا</option>
                  <option>انتقاد و پیشنهاد</option>
                </select>
                <label>موضوع</label>
              </div>
              <div className={style.inputGroup}>
                <textarea
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChangeForm}
                  placeholder=" "
                ></textarea>
                <label>متن پیام</label>
              </div>
              <button type="submit">ارسال پیام</button>
            </form>
          </div>
        </div>
      )}

      <section className={style.questionSection}>
        <h2>سوالات متداول</h2>
        <div className={style.question}>
          {dataQuestion.map((item, index) => {
            const isActive = active === index;
            return (
              <div key={index} className={style.questionItem}>
                <div className={style.questionHeader} onClick={() => toggleActive(index)}>
                  <span className={isActive ? style.activeTitle : ""}>{item.question}</span>
                  <svg
                    className={`${style.icon} ${isActive ? style.iconOpen : style.iconClosed}`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>

                <AccordionBody isActive={isActive}>
                  {item.answer}
                </AccordionBody>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
