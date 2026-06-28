
"use client";
 
import { useEffect, useState } from "react";
import { useAuth } from "@/app/Context/Context";
import styles from "@/app/ProductBuy/DetailUserBuy/DetailUserBuy.module.css";
import { api } from "@/app/config";
import { useRouter } from "next/navigation";
import Code from "@/app/Login/Code/Code";
 
export default function CheckoutFormPopup({
  isOpen,
  onClose,
  onSubmitSuccess,
}) {
  const router = useRouter();
 
  const {
    dataForm,
    setDataForm,
    saveOrUpdateUser,
    setNotif,
    validateForm,
    isLoggedIn,
    sendCode,
  } = useAuth();
 
  const [code, setCode] = useState(false);
 
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
 
  // ثبت سفارش و رفتن به درگاه
  const submitOrder = async (formData) => {
    await saveOrUpdateUser(formData);
    const res = await api.get("/api/orders/create/");
    router.push(res.data.payment_url);
    setNotif({ id: Date.now(), message: "سفارش با موفقیت ثبت شد", type: "success" });
    onSubmitSuccess?.();
    onClose?.();
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (!isLoggedIn) {
      try {
        localStorage.setItem("pendingCheckoutForm", JSON.stringify(dataForm));
        await sendCode(dataForm.phone);
        setNotif({ id: Date.now(), message: "کد تایید برای شما ارسال شد", type: "success" });
        setCode(true);
      } catch (err) {
        console.error(err);
        setNotif({ id: Date.now(), message: "خطا در ارسال، لطفا دوباره امتحان کنید", type: "error" });
      }
    } else {
      const error = validateForm();
      if (error) {
        setNotif({ id: Date.now(), message: error, type: "error" });
        return;
      }
 
      try {
        await submitOrder(dataForm);
      } catch (err) {
        console.log(err);
        setNotif({ id: Date.now(), message: "خطا در ثبت سفارش", type: "error" });
      }
    }
  };
 
  // بعد از verify کد — مستقیم سفارش ثبت کن
  const handleLoginSuccess = async () => {
    try {
      const saved = localStorage.getItem("pendingCheckoutForm");
      const formData = saved ? JSON.parse(saved) : dataForm;
      localStorage.removeItem("pendingCheckoutForm");
 
      setDataForm(formData);
      await submitOrder(formData);
    } catch (err) {
      console.log(err);
      // اگه خطا خورد فرم رو نشون بده
      setCode(false);
      setNotif({ id: Date.now(), message: "خطا در ثبت سفارش، لطفا دوباره تلاش کنید", type: "error" });
    }
  };
 
  return (
    <div
      className={styles.backdrop}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      {code ? (
        <Code phone={dataForm.phone} onSuccess={handleLoginSuccess} />
      ) : (
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
                  name="firstname"
                  value={dataForm.firstname || ""}
                  onChange={handleChange}
                />
                <label className={styles.label}>نام</label>
              </div>
 
              <div className={styles.container}>
                <input
                  className={styles.input}
                  type="text"
                  name="lastname"
                  value={dataForm.lastname || ""}
                  onChange={handleChange}
                />
                <label className={styles.label}>نام خانوادگی</label>
              </div>
 
              <div className={styles.container}>
                <input
                  className={styles.input}
                  type="tel"
                  name="phone"
                  value={dataForm.phone || ""}
                  onChange={handleChange}
                />
                <label className={styles.label}>تلفن</label>
              </div>
 
              <div className={styles.container}>
                <input
                  className={styles.input}
                  type="text"
                  name="postal_code"
                  value={dataForm.postal_code || ""}
                  onChange={handleChange}
                />
                <label className={styles.label}>کد پستی</label>
              </div>
            </div>
 
            <div className={styles.containerTextarea}>
              <textarea
                className={styles.textarea}
                name="address"
                value={dataForm.address || ""}
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
      )}
    </div>
  );
}