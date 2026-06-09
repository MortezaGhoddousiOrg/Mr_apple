"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/Context/Context";
import styles from "./page.module.css";

export default function Logout() {
  const [showModal, setShowModal] = useState(false);

  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1>خروج از حساب کاربری</h1>

          <p>
            با خروج از حساب، برای دسترسی به اطلاعات سفارش‌ها
            مجدداً باید وارد شوید.
          </p>

          <button
            className={styles.logoutBtn}
            onClick={() => setShowModal(true)}
          >
            خروج از حساب
          </button>
        </div>
      </div>

      {showModal && (
        <div
          className={styles.overlay}
          onClick={() => setShowModal(false)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>تأیید خروج</h3>

            <p>
              آیا از خروج از حساب کاربری مطمئن هستید؟
            </p>

            <div className={styles.actions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowModal(false)}
              >
                انصراف
              </button>

              <button
                className={styles.confirmBtn}
                onClick={handleLogout}
              >
                بله، خارج شو
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}