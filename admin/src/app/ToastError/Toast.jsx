
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNotification } from "@/app/Context/NotificationContext";
import styles from "./Toast.module.css";

export default function Toast() {
  const { notif } = useNotification();
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  useEffect(() => {
    if (!notif?.message) return;

    const toast = {
      id: notif.id || Date.now(),
      type: notif.type,
      message: notif.message,
    };

    setToasts((prev) => {
      const updated = [...prev, toast];
      if (updated.length > 3) {
        updated.shift();
      }
      return updated;
    });

    startTimer(toast.id);
  }, [notif]);

  const startTimer = (id) => {
    timers.current[id] = setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const stopTimer = (id) => {
    clearTimeout(timers.current[id]);
  };

  const removeToast = (id) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <div className={styles.container}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 300, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            onMouseEnter={() => stopTimer(toast.id)}
            onMouseLeave={() => {
              stopTimer(toast.id);
              startTimer(toast.id);
            }}
            className={`${styles.toast} ${styles[toast.type]}`}
          >
            <div className={styles.icon}>
              {toast.type === "error" && (
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.2)" />
                  <path
                    d="M12 8V12"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="16" r="1.2" fill="white" />
                </svg>
              )}

              {toast.type === "success" && (
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.2)" />
                  <path
                    d="M8 12L11 15L16 9"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}

              {toast.type === "warning" && (
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 3L22 20H2L12 3Z"
                    fill="rgba(255,255,255,0.2)"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 9V13"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="17" r="1.2" fill="white" />
                </svg>
              )}

              {toast.type === "info" && (
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.2)" />
                  <path
                    d="M12 16V12"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="8" r="1" fill="white" />
                </svg>
              )}
            </div>

            <span>{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
