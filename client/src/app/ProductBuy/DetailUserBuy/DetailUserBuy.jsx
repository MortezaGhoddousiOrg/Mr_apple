"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/Context/Context";
import styles from "@/app/ProductBuy/DetailUserBuy/DetailUserBuy.module.css";

export default function CheckoutFormPopup({
  isOpen,
  onClose,
  onSubmitSuccess,
}) {
  // const [form, setForm] = useState({
  //   firstName: "",
  //   lastName: "",
  //   phone: "",
  //   postalCode: "",
  //   address: "",
  // });

  const { dataForm, setDataForm, saveOrUpdateUser } = useAuth();

  useEffect(() => {
    if (isOpen && dataForm?.phone) {
      const cleanPhone = dataForm.phone.replace(/\D/g, "");

      if (cleanPhone !== dataForm.phone) {
        setDataForm((prev) => ({ ...prev, phone: cleanPhone }));
      }
    }
  }, [isOpen, dataForm?.phone, setDataForm]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    if (isOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
    // فقط تابع کانتکست را صدا می‌زنیم و تمام!
    await saveOrUpdateUser(dataForm); 
    
    onSubmitSuccess?.(); // اطلاع به کامپوننت پدر برای رفتن به استپ بعد
    onClose?.();
  } catch (err) {
    alert("خطا در ثبت اطلاعات");
  }
  };



  return (
    <div
      className={styles.backdrop}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className={styles.modal} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <h2 className={styles.title}>اطلاعات ارسال سفارش</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.info}>
          <div className={styles.container}>
            <input
              className={styles.input}
              type="text"
              name="firstName"
              value={dataForm.firstName}
              onChange={handleChange}
              required
            />
            <label className={styles.label}>نام</label>
          </div>

          <div className={styles.container}>
            <input
              className={styles.input}
              type="text"
              name="lastName"
              value={dataForm.lastName}
              onChange={handleChange}
              required
            />
            <label className={styles.label}>نام خانوادگی</label>
          </div>

          <div className={styles.container}>
            <input
              className={styles.input}
              type="tel"
              name="phone"
              value={dataForm.phone}
              onChange={handleChange}
              required
            />
            <label className={styles.label}>تلفن</label>
          </div>

          <div className={styles.container}>
            <input
              className={styles.input}
              type="text"
              name="postalCode"
              value={dataForm.postalCode}
              onChange={handleChange}
              required
            />
            <label className={styles.label}>کد پستی</label>
          </div>
          </div>

          <div className={styles.containerTextarea}>
            <textarea
              className={styles.textarea}
              name="address"
              value={dataForm.address}
              onChange={handleChange}
              rows={4}
              required
            />
            <label className={styles.label}>آدرس</label>
          </div>
          

          <button type="submit" className={styles.submitBtn}>
            ثبت و ادامه
          </button>
        </form>
      </div>
    </div>
  );
}
