import "./page.module.css";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoggedIn } from "../Context/logincontext";
import axios from "axios";

export default function Login({ setNotif }) {
  const [passshow, setPsssShow] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn } = useLoggedIn();

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

    if (!phoneRegex.test(loginData.phone))
      return setNotif({ message: "شماره موبایل معتبر نیست", type: "error" });

    // const dataToSend = {
    //   phone,
    //   createdAt: new Date(),
    // };

    try {
      const phone = loginData.phone;
      const userData = {
        phone: phone,
        loginTime: new Date().toISOString(),
      };

      localStorage.setItem("user", phone);

      console.log("User saved to LocalStorage:", userData);

      setNotif({ message: "کد تایید برای شما ارسال شد", type: "success" });

      setLoginData({
        phone: "",
      });
        const userlocal = localStorage.getItem("user");

        if (userlocal) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }

      navigate("/code");
    } catch (err) {
      console.error("Login error:", err);
      setNotif({
        message: "خطا در ارسال، لطفا دوباره امتحان کنید",
        type: "error",
      });
    }
  };

  return (
    <div className="login-body">
      <main className="login-content">
        <h2 className="login-title">به صفحه ورود خوش آمدید</h2>
        <p className="login-description">
          برای دسترسی به امکانات ویژه و تجربه شخصی سازی شده، لطفا وارد حساب
          کاربری خود شوبد
        </p>

        <form className="login-first" onSubmit={handleSubmit} noValidate>
          <div className="login-input">
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
      </main>
    </div>
  );
}
