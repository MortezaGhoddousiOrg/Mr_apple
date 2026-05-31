import { useState } from "react";
import styles from "@/app/PanelUser/ProfileSetting/page.module.css";

export default function ProfileSettings() {
  const [hasData, setHasData] = useState(true); 
  const [isEditing, setIsEditing] = useState(false);

  const [userData, setUserData] = useState({
    firstName: "علی",
    lastName: "رضایی",
    phone: "09123456789",
    zipCode: "1234567890",
    address: "تهران، خیابان ولیعصر، کوچه گلستان، پلاک ۵"
  });

  const handleSave = (e) => {
    e.preventDefault();
    setHasData(true);
    setIsEditing(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.title}>اطلاعات حساب</h2>
        {hasData && !isEditing && (
          <button onClick={() => setIsEditing(true)} className={styles.editLinkBtn}>
            ویرایش اطلاعات
          </button>
        )}
      </div>

      {/* منطق نمایش: اگر اطلاعات نداریم یا در حالت ویرایش هستیم، فرم را نشان بده */}
      {!hasData || isEditing ? (
        <form className={styles.form} onSubmit={handleSave}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>نام</label>
              <input className={styles.input} type="text" defaultValue={hasData ? userData.firstName : ""} placeholder="نام" required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>نام خانوادگی</label>
              <input className={styles.input} type="text" defaultValue={hasData ? userData.lastName : ""} placeholder="نام خانوادگی" required />
            </div>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>تلفن</label>
              <input className={styles.input} type="tel" defaultValue={hasData ? userData.phone : ""} placeholder="09xxxxxxxxx" required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>کد پستی</label>
              <input className={styles.input} type="text" defaultValue={hasData ? userData.zipCode : ""} placeholder="کد پستی" required />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>آدرس دقیق</label>
            <textarea className={`${styles.input} ${styles.textarea}`} rows="3" defaultValue={hasData ? userData.address : ""} placeholder="آدرس..." required />
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.primaryButton}>ذخیره اطلاعات</button>
            {hasData && (
              <button type="button" onClick={() => setIsEditing(false)} className={styles.cancelBtn}>لغو</button>
            )}
          </div>
        </form>
      ) : (
        /* حالت نمایش اطلاعات */
        <div className={styles.infoDisplay}>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span>نام و نام خانوادگی</span>
              <p>{userData.firstName} {userData.lastName}</p>
            </div>
            <div className={styles.infoItem}>
              <span>شماره تماس</span>
              <p className={styles.ltrText}>{userData.phone}</p>
            </div>
            <div className={styles.infoItem}>
              <span>کد پستی</span>
              <p className={styles.ltrText}>{userData.zipCode}</p>
            </div>
            <div className={styles.infoItemFull}>
              <span>آدرس دقیق</span>
              <p>{userData.address}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
