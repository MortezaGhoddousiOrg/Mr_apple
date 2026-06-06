"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./Login.css";
import { motion } from "framer-motion";

export default function Login({ setNotif }) {
  const router = useRouter();

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
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

    if (!loginData.username.trim() || !loginData.password.trim()) {
      // return setNotif({
      //   message: "نام کاربری و گذرواژه الزامی هستند",
      //   type: "error",
      // });
      alert("نام کاربری و گذرواژه الزامی هستند");
    }

    if (loginData.username == "admin" && loginData.password == "123") {
      router.push("/dashboard");
      localStorage.setItem("admin", loginData.username);
    } else {
      alert("تام کاربری و گذرواژه اشتباه است ");
    } 

    // setNotif({
    //   message: "ورود شما موفقیت‌آمیز بود (اما هنوز لاگین تأیید نشده)",
    //   type: "success",
    // });

    setLoginData({ username: "", password: "" });

    // router.push("/code");
  };

  return (
    <div className="login-body">
      <main className="login-content">
        <h2 className="login-title">به صفحه ورود خوش آمدید </h2>

        <p className="login-description">
          لطفاً برای دسترسی به پنل مدیریتی مستر اپل ، وارد حساب کاربری خود شوید.
        </p>

        <form className="login-first" onSubmit={handleSubmit} noValidate>
          <div className="login-input">
            <input
              type="text"
              name="username"
              value={loginData.username}
              onChange={handleChange}
              required
            />
            <label>نام کاربری</label>
          </div>

          <div className="login-input">
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              required
            />
            <label>گذرواژه</label>
          </div>

          {/* <button type="submit">ورود</button> */}
          <motion.button
            whileHover={{ scale: 1.1 }} // وقتی ماوس روی آن می‌رود
            whileTap={{ scale: 0.9 }} // وقتی کلیک می‌شود
            initial={{ opacity: 0, y: 20 }} // حالت شروع (نامرئی و کمی پایین‌تر)
            animate={{ opacity: 1, y: 0 }} // حالت نهایی (مرئی و در جای اصلی)
            className="bg-blue-500 text-white p-2 rounded"
            type="submit"
          >
            کلیک کن!
          </motion.button>
        </form>
      </main>
    </div>
  );
}
