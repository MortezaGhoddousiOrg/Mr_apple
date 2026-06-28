"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./page.module.css";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const paymentStatus = searchParams.get("status");

    if (paymentStatus === "true") {
      setStatus("success");
    } else {
      setStatus("failed");
    }

    setLoading(false);
  }, [searchParams]);

  useEffect(() => {
    if (status === "success" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (status === "success" && countdown === 0) {
      router.push("/PanelUser");
    }
  }, [status, countdown, router]);

  const handleRetry = () => {
    router.push("/ProductBuy");
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>در حال بررسی...</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.successIcon}>
            <svg
              className={styles.iconSvg}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className={styles.title}>پرداخت موفق</h1>
          <p className={styles.message}>سفارش شما با موفقیت ثبت شد.</p>

          <div className={styles.countdown}>
            انتقال به پنل کاربری در {countdown} ثانیه
          </div>

          <button
            onClick={() => router.push("/PanelUser")}
            className={styles.button}
          >
            رفتن به پنل کاربری
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.errorIcon}>
          <svg
            className={styles.iconSvg}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className={styles.title}>پرداخت ناموفق</h1>
        <p className={styles.message}>متأسفانه پرداخت شما با مشکل مواجه شد.</p>

        <button onClick={handleRetry} className={styles.button}>
          تلاش مجدد
        </button>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className={styles.loadingContainer}>...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
