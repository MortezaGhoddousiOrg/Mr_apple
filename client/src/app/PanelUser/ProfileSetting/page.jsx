"use client";

import { useState } from "react";
import styles from "@/app/PanelUser/ProfileSetting/page.module.css";
import { useAuth } from "@/app/Context/Context";

export default function ProfileSettings() {

  const [isEditing, setIsEditing] = useState(false);

  const { dataForm, setDataForm, saveOrUpdateUser, initialData } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      await saveOrUpdateUser(dataForm);

      setIsEditing(false);
    } catch (err) {
      console.error(err);
      // setNotif
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (initialData) {
      setDataForm(initialData);
    }
    setIsEditing(false);
  };

  if (!dataForm) {
    return <div className={styles.card}>در حال بارگذاری...</div>;
  }

    return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.title}>اطلاعات حساب</h2>
        
        {!isEditing && (
          <button onClick={handleEdit} className={styles.editLinkBtn}>
            ویرایش اطلاعات
          </button>
        )}
      </div>

      {isEditing ? (
        <form className={styles.form} onSubmit={handleSave}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>نام</label>
              <input
                className={styles.input}
                type="text"
                name="firstName"
                value={dataForm.firstName || ""}
                onChange={handleChange}
                placeholder="نام"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>نام خانوادگی</label>
              <input
                className={styles.input}
                type="text"
                name="lastName"
                value={dataForm.lastName || ""}
                onChange={handleChange}
                placeholder="نام خانوادگی"
                required
              />
            </div>
          </div>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>تلفن</label>
              <input
                className={styles.input}
                type="tel"
                name="phone"
                value={dataForm.phone || ""}
                onChange={handleChange}
                placeholder="09xxxxxxxxx"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>کد پستی</label>
              <input
                className={styles.input}
                type="text"
                name="postalCode"
                value={dataForm.postalCode || ""}
                onChange={handleChange}
                placeholder="کد پستی"
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>آدرس دقیق</label>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              rows="3"
              name="address"
              value={dataForm.address || ""}
              onChange={handleChange}
              placeholder="آدرس..."
              required
            />
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.primaryButton}>
              ذخیره اطلاعات
            </button>

            {/* ✅ ninja: دکمه لغو همیشه نمایش داده شود اگر در حال ادیت هستیم */}
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelBtn}
            >
              لغو
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.infoDisplay}>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span>نام و نام خانوادگی</span>
              <p>
                {dataForm.firstName} {dataForm.lastName}
              </p>
            </div>

            <div className={styles.infoItem}>
              <span>شماره تماس</span>
              <p className={styles.ltrText}>{dataForm.phone}</p>
            </div>

            <div className={styles.infoItem}>
              <span>کد پستی</span>
              <p className={styles.ltrText}>{dataForm.postalCode}</p>
            </div>

            <div className={styles.infoItemFull}>
              <span>آدرس دقیق</span>
              <p className={styles.ltrText}>{dataForm.address}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
