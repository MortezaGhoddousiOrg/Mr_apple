"use client";

import React, { useState, useEffect } from "react";
import style from "@/app/Login/page.module.css";

import { useRouter } from "next/navigation";
import Code from "@/app/Login/Code/Code";
import { useAuth } from "@/app/Context/Context";

export default function Login() {
  const [passshow, setPsssShow] = useState(false);
  const router = useRouter();
  const [code, setCode] = useState(false);

  // const [login, setLogin] = useState();

// setNotif({
//   id: Date.now(),
//   type: "error",
//   message: "تمام فیلدها الزامی هستند",
// });


  const { sendCode, isLoggedIn, authLoading, setNotif } = useAuth();

 useEffect(() => {
  if (authLoading) return;

  if (isLoggedIn) {
    router.replace("/PanelUser");
  }
}, [isLoggedIn, authLoading, router]);

  const toggleshowpass = () => {
    setPsssShow((prev) => !prev);
  };

  const [loginData, setLoginData] = useState({
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneRegex = /^09\d{9}$/;

    if (!phoneRegex.test(loginData.phone)) {
      return setNotif({ id: Date.now(), message: "شماره موبایل معتبر نیست", type: "error" });
    }

    try {
      const phone = loginData.phone;

      const res = await sendCode(phone);
      console.log(res);
      
      setNotif({ id: Date.now(), message: "کد تایید برای شما ارسال شد", type: "success" });
      setCode(true);

    } catch (err) {
      console.error(err);
      setNotif({
        id: Date.now(),
        message: "خطا در ارسال، لطفا دوباره امتحان کنید",
        type: "error",
      });
    }
  };

  return (
    <div className={style.loginBody}>
      <main className={style.loginContent}>
        <h2 className={style.loginTitle}>به صفحه ورود خوش آمدید</h2>
        <p className={style.loginDescription}>
          برای دسترسی به امکانات ویژه و تجربه شخصی سازی شده، لطفا وارد حساب
          کاربری خود شوبد
        </p>

        {code ? (
          <Code phone={loginData.phone} />
        ) : (
          <form className={style.loginFirst} onSubmit={handleSubmit} noValidate>
            <div className={style.loginInput}>
              <input
                type="text"
                name="phone"
                value={loginData.phone}
                onChange={handleChange}
                required
              />

              <label>شماره تلفن</label>
            </div>

            <button type="submit">ورود</button>
          </form>
        )}
      </main>
    </div>
  );
}
