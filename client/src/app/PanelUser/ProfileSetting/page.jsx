import { useState } from "react";
import styles from "@/app/PanelUser/ProfileSetting/page.module.css";

export default function ProfileSettings() {
  const [hasData, setHasData] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    zipCode: "",
    address: "",
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    zipCode: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    setUserData(formData);

    setHasData(true);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setFormData(userData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.title}>اطلاعات حساب</h2>
        {hasData && !isEditing && (
          <button onClick={handleEdit} className={styles.editLinkBtn}>
            ویرایش اطلاعات
          </button>
        )}
      </div>

      {!hasData || isEditing ? (
        <form className={styles.form} onSubmit={handleSave}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>نام</label>
              <input
                className={styles.input}
                type="text"
                name="firstName"
                value={formData.firstName}
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
                value={formData.lastName}
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
                value={formData.phone}
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
                name="zipCode"
                value={formData.zipCode}
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
              value={formData.address}
              onChange={handleChange}
              placeholder="آدرس..."
              required
            />
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.primaryButton}>
              ذخیره اطلاعات
            </button>

            {hasData && (
              <button
                type="button"
                onClick={handleCancel}
                className={styles.cancelBtn}
              >
                لغو
              </button>
            )}
          </div>
        </form>
      ) : (
        /* حالت نمایش اطلاعات */
        <div className={styles.infoDisplay}>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span>نام و نام خانوادگی</span>
              <p>
                {userData.firstName} {userData.lastName}
              </p>
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
