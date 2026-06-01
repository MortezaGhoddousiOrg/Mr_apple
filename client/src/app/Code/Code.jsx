"use client";

import React, { useRef } from "react";
import style from "@/app/Code/Code.module.css";
import { useAuth } from "@/app/Context/Context";
import { useRouter } from "next/navigation";

export default function Code({ phone }) {
  console.log(phone);
  const { setIsLoggedIn } = useAuth();
  

  const [otp, setOtp] = React.useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const router = useRouter();

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

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
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    // console.log("OTP Code Submitted:", code);

    // const savedPhone = localStorage.getItem("tempPhone");

    // const userData = {
    //   phone: savedPhone,
    //   isLoggedIn: true,
    //   loginTime: new Date().toISOString(),
    // };

    // localStorage.setItem("user", JSON.stringify(userData));
    // localStorage.removeItem("tempPhone");

    localStorage.setItem("user", JSON.stringify(phone));
      setIsLoggedIn(true);


    router.push("/");
  };

  return (
    <div className={style.bodyCode}>
      <div className={style.boxContainer}>
        <h2>کد تایید را وارد کنید</h2>

        <div className={style.boxCodeContainer}>
          {otp.map((digit, index) => (
            <input
              key={index}
              className={style.boxCodeInput}
              type="text"
              maxLength="1"
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
