"use client";

import React, { useState, useEffect } from "react";
import style from "@/app/Login/page.module.css";

import { useRouter } from "next/navigation";
import Code from "@/app/Login/Code/Code";
import { useAuth } from "@/app/Context/Context";

export default function Login({ setNotif }) {
  const [passshow, setPsssShow] = useState(false);
  const router = useRouter();
  const [code, setCode] = useState(false);

  const [login, setLogin] = useState();

  const { sendCode } = useAuth();

  useEffect(() => {
    const local = localStorage.getItem("user");
    if (local) {
      setLogin(true);
      router.push("/PanelUser");
    } else {
      setLogin(false);
    }
  }, []);

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
      // return setNotif({ message: "شماره موبایل معتبر نیست", type: "error" });
    }

    try {
      const phone = loginData.phone;

      // await sendCode(phone);

      // setNotif({ message: "کد تایید برای شما ارسال شد", type: "success" });
      setCode(true);
      localStorage.setItem("user", phone);

    } catch (err) {
      console.error(err);
      // setNotif({
      //   message: "خطا در ارسال، لطفا دوباره امتحان کنید",
      //   type: "error",
      // });
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
