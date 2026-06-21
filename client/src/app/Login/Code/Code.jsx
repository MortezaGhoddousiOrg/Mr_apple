  // "use client";

  // import React, { useRef, useEffect, useState } from "react";
  // import style from "@/app/Login/Code/Code.module.css";
  // import { useAuth } from "@/app/Context/Context";
  // import { useRouter } from "next/navigation";

  // export default function Code({ phone }) {
  //   const { verifyCode, setNotif } = useAuth();

  //   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  //   const inputsRef = useRef([]);
  //   const router = useRouter();

  //   useEffect(() => {
  //     inputsRef.current[0]?.focus();
  //   }, []);

  //   const handleChange = (value, index) => {
  //     if (!/^\d?$/.test(value)) return;

  //     const newOtp = [...otp];
  //     newOtp[index] = value;
  //     setOtp(newOtp);

  //     if (value && index < 5) {
  //       inputsRef.current[index + 1]?.focus();
  //     }

  //     if (newOtp.every((digit) => digit !== "")) {
  //       handleSubmit(newOtp.join(""));
  //     }
  //   };

  //   const handleKeyDown = (e, index) => {
  //     if (e.key === "Backspace" && !otp[index] && index > 0) {
  //       inputsRef.current[index - 1]?.focus();
  //     }

  //     if (e.key === "ArrowLeft" && index > 0) {
  //       inputsRef.current[index - 1]?.focus();
  //     }

  //     if (e.key === "ArrowRight" && index < 5) {
  //       inputsRef.current[index + 1]?.focus();
  //     }
  //   };

  //   const handlePaste = (e) => {
  //     e.preventDefault();

  //     const pastedData = e.clipboardData
  //       .getData("text")
  //       .replace(/\D/g, "")
  //       .slice(0, 6);

  //     if (!pastedData) return;

  //     const newOtp = ["", "", "", "", "", ""];

  //     pastedData.split("").forEach((digit, index) => {
  //       newOtp[index] = digit;
  //     });

  //     setOtp(newOtp);

  //     const lastIndex = Math.min(pastedData.length - 1, 5);
  //     inputsRef.current[lastIndex]?.focus();

  //     if (newOtp.every((digit) => digit !== "")) {
  //       handleSubmit(newOtp.join(""));
  //     }
  //   };

  //   const handleSubmit = async (code) => {
  //   try {
  //     await verifyCode(phone, code);

  //     setNotif({
  //       id: Date.now(),
  //       message: "ورود موفق، خوش آمدید",
  //       type: "success",
  //     });

  //     router.push("/");
  //   } catch (error) {
  //     setNotif({
  //       id: Date.now(),
  //       message: "ورود ناموفق، لطفا دوباره امتحان کنید",
  //       type: "error",
  //     });
  //     setOtp(["", "", "", "", "", ""]);
  //     setTimeout(() => inputsRef.current[0]?.focus(), 0);
  //   }
  // };

  //   return (
  //     <div className={style.bodyCode}>
  //       <div className={style.boxContainer}>
  //         <h2>کد تایید را وارد کنید</h2>

  //         <div className={style.boxCodeContainer}>
  //           {otp.map((digit, index) => (
  //             <input
  //               key={index}
  //               className={style.boxCodeInput}
  //               type="text"
  //               inputMode="numeric"
  //               pattern="[0-9]*"
  //               autoComplete={index === 0 ? "one-time-code" : "off"}
  //               maxLength={1}
  //               value={digit}
  //               ref={(el) => (inputsRef.current[index] = el)}
  //               onChange={(e) => handleChange(e.target.value, index)}
  //               onKeyDown={(e) => handleKeyDown(e, index)}
  //               onPaste={handlePaste}
  //             />
  //           ))}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  "use client";
 
import React, { useRef, useEffect, useState } from "react";
import style from "@/app/Login/Code/Code.module.css";
import { useAuth } from "@/app/Context/Context";
import { useRouter } from "next/navigation";
 
export default function Code({ phone, onSuccess }) {
  const { verifyCode, setNotif } = useAuth();
 
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const router = useRouter();
 
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);
 
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
    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };
 
  const handlePaste = (e) => {
    e.preventDefault();
 
    const pastedData = e.clipboardData
      .getData("text")
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
 
  const handleSubmit = async (code) => {
    try {
      await verifyCode(phone, code);
 
      setNotif({
        id: Date.now(),
        message: "ورود موفق، خوش آمدید",
        type: "success",
      });
 
      // اگه از CheckoutFormPopup اومده، onSuccess رو صدا بزن
      // وگرنه برو خانه
      if (onSuccess) {
        await onSuccess();
      } else {
        router.push("/");
      }
    } catch (error) {
      setNotif({
        id: Date.now(),
        message: "ورود ناموفق، لطفا دوباره امتحان کنید",
        type: "error",
      });
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => inputsRef.current[0]?.focus(), 0);
    }
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
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
            />
          ))}
        </div>
      </div>
    </div>
  );
}