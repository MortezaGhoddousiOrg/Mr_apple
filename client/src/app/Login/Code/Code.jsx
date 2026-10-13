"use client";

import React, { useRef, useEffect, useState } from "react";
import style from "@/app/Login/Code/Code.module.css";
import { useAuth } from "@/app/Context/Context";
import { useRouter } from "next/navigation";

export default function Code({ phone, onSuccess, onEditPhone }) {
  const { verifyCode, setNotif } = useAuth();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputsRef = useRef([]);
  const submittingRef = useRef(false);
  const router = useRouter();

  const convertToEnglishNumber = (value) => {
    return value
      .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
      .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
  };

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleEditPhone = () => {
    if (onEditPhone) {
      onEditPhone();
    } else {
      router.back();
    }
  };

  const handleSubmit = async (code) => {
    if (submittingRef.current || code.length !== 6) return;

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      await verifyCode(phone, code);

      setNotif({
        id: Date.now(),
        message: "ورود موفق، خوش آمدید",
        type: "success",
      });

      if (onSuccess) {
        await onSuccess();
      } else {
        router.push("/");
      }
    } catch (error) {
      if (error.response?.data?.error === "کد اشتباه است") {
        setNotif({
          id: Date.now(),
          message: "کد تایید اشتباه است",
          type: "error",
        });
      } else {
        setNotif({
          id: Date.now(),
          message: "ورود ناموفق، لطفا دوباره امتحان کنید",
          type: "error",
        });
      }

      setOtp(["", "", "", "", "", ""]);
      submittingRef.current = false;
      setIsSubmitting(false);

      setTimeout(() => inputsRef.current[0]?.focus(), 0);
    }
  };

  const handleChange = (value, index) => {
    value = convertToEnglishNumber(value);

    if (!/^\d?$/.test(value) || isSubmitting) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      handleSubmit(newOtp.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (isSubmitting) return;

    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const pastedData = convertToEnglishNumber(
      e.clipboardData.getData("text")
    )
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedData) return;

    const newOtp = ["", "", "", "", "", ""];

    pastedData.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);

    const lastIndex = Math.min(pastedData.length - 1, 5);
    inputsRef.current[lastIndex]?.focus();

    if (newOtp.every((digit) => digit !== "")) {
      handleSubmit(newOtp.join(""));
    }
  };

  return (
    <div className={style.bodyCode} dir="rtl">
      <section className={style.boxContainer}>
        <div className={style.iconWrap} aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={style.phoneIcon}
          >
            <rect
              x="6.5"
              y="2.5"
              width="11"
              height="19"
              rx="2.5"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M10 5.5h4M11 18.5h2"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className={style.headingGroup}>
          <h2>کد تأیید را وارد کنید</h2>
          <p className={style.description}>
            کد ارسال‌شده به شماره موبایل زیر را وارد کنید.
          </p>
        </div>

        
<div className={style.phoneRow}>
  <span className={style.phoneNumber} dir="ltr">
    {phone}
  </span>

  <button
    type="button"
    className={style.editPhoneButton}
    onClick={onEditPhone}
    disabled={isSubmitting}
  >
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20h9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="m16.5 3.5 4 4L8 20l-5 1 1-5L16.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
    ویرایش شماره
  </button>
</div>


        <div
          className={style.boxCodeContainer}
          dir="ltr"
          aria-label="کد شش رقمی تأیید"
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              className={style.boxCodeInput}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              aria-label={`رقم ${index + 1} کد تأیید`}
              maxLength={1}
              value={digit}
              disabled={isSubmitting}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
            />
          ))}
        </div>

        <p className={style.helperText}>
          برای تأیید، هر ۶ رقم کد را وارد کنید.
        </p>

        {isSubmitting && (
          <p className={style.loadingText} role="status">
            در حال بررسی کد...
          </p>
        )}
      </section>
    </div>
  );
}
