"use client"

import { useState, useEffect } from "react";
import style from "@/app/ToastError/Toast.module.css";

export default function Toase({ notif }) {
  const [toast, setToast] = useState([]);

  useEffect(() => {
    showToast(notif.message, notif.type);
  }, [notif]);

  const showToast = (text, type = "error") => {
    const id = Date.now();
    const newToast = { id, text, type, removing: false };

    setToast((prev) => {
      let updated = [...prev, newToast];
      if (updated.length > 3) {
        updated.shift();
      }
      return updated;
    });

    setTimeout(() => {
      setToast((prev) =>
        prev.map((t) => (t.id == id ? { ...t, removing: true } : t)),
      );
      setTimeout(() => {
        setToast((prev) => {
          return prev.filter((t) => t.id != id);
        });
      }, 300);
    }, 5000);
  };

  return (
    <div className={style.toastBody}>
      <div className={style.toastContainer}>
        {toast.map((toast) => (
          <div
            key={toast.id}
            // onMouseEnter={() => handleMouseEnter(toast.id)}
            // onMouseLeave={() => { startToastTimer(toast.id) }}
            className={`${style.toast} ${style[toast.type]} ${
              toast.removing ? style.removing : ""
            }`}
          >
            {toast.type === "error" && <i className="bx bx-error-alt"></i>}
            {toast.type === "success" && <i className="bx bxs-badge-check"></i>}
            <span>{toast.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
