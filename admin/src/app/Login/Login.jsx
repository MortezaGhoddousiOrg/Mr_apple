"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { api } from "@/app/config";

export default function Login({ setNotif }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const logoutFromBackend = async () => {
      try {
        await api.get("/api/auth/admin/logout/");
      } catch (err) {
        console.log("Logout error (ignored):", err);
      }
    };
    logoutFromBackend();

    // ✅ پاک کردن کوکی admin_access_token از مرورگر
    document.cookie =
      "admin_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // ✅ پاک کردن localStorage
    localStorage.removeItem("admin");
    localStorage.removeItem("isAuthenticated");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginData.phone.trim() || !loginData.password.trim()) {
      setError("شماره تلفن و گذرواژه الزامی هستند");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const loginResponse = await api.post("/api/auth/admin/login/", {
        username: loginData.phone,
        password: loginData.password,
      });

      if (loginResponse.status === 200) {
        try {
          const meResponse = await api.get("/api/auth/admin/me/");
          const adminData = meResponse.data;

          if (adminData.is_staff === true) {
            localStorage.setItem("admin", loginData.phone);
            localStorage.setItem("isAuthenticated", "true");

            if (setNotif) {
              setNotif({
                id: Date.now(),
                message: "ورود موفق! خوش آمدید",
                type: "success",
              });
            }

            router.push("/dashboard");
          } else {
            setError("شما دسترسی ادمین ندارید");
            document.cookie =
              "admin_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            localStorage.removeItem("admin");
            localStorage.removeItem("isAuthenticated");
          }
        } catch (meErr) {
          console.error("Error fetching admin info:", meErr);
          setError("خطا در تأیید دسترسی ادمین");
          document.cookie =
            "admin_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
      }
    } catch (err) {
      console.error("Login error:", err);

      if (err.response?.status === 400 || err.response?.status === 401) {
        setError("شماره تلفن یا گذرواژه اشتباه است");
      } else if (err.response?.status === 403) {
        setError("شما دسترسی ادمین ندارید");
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.code === "ERR_NETWORK") {
        setError("خطا در ارتباط با سرور. لطفاً اتصال خود را بررسی کنید.");
      } else {
        setError("خطا در ارتباط با سرور");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl shadow-lg mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            پنل مدیریت
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            وارد شوید تا به داشبورد دسترسی پیدا کنید
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                شماره تلفن
              </label>
              <input
                type="text"
                name="phone"
                value={loginData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all outline-none text-gray-900 placeholder:text-gray-400"
                placeholder="شماره تلفن خود را وارد کنید"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                گذرواژه
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all outline-none text-gray-900 placeholder:text-gray-400 pr-4 pl-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m-3.65 10.65L12 15.75m4.5 4.5L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-3"
              >
                <p className="text-red-600 text-sm text-center">{error}</p>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>در حال ورود...</span>
                </div>
              ) : (
                "ورود به پنل مدیریت"
              )}
            </motion.button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              این بخش فقط برای مدیران سیستم قابل دسترسی است
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
