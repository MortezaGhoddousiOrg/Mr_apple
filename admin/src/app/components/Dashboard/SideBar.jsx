"use client";
 
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/app/config";
import Dashboard from "./Dashboard/Dashboard";
import Products from "./Products/Products";
import Users from "./Users/Users";
import Orders from "./Orders/Orders";
import Category from "./Category/Category";
 
export default function SideBar({ setRendered }) {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState("داشبورد");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);
 
  const list_items = [
    { name: "داشبورد", icon: "📊" },
    { name: "محصولات", icon: "📦" },
    { name: "کاربران", icon: "👥" },
    { name: "سفارشات", icon: "🛒" },
    { name: "دسته‌بندی‌ها", icon: "🗂️" },
  ];
 
  const user = {
    firstname: "مدیر",
    lastname: "سیستم",
    role: "مدیر ارشد",
  };
 
  const handleClick = (item) => {
    setActiveItem(item);
 
    switch (item) {
      case "داشبورد":
        setRendered(<Dashboard />);
        break;
      case "محصولات":
        setRendered(<Products />);
        break;
      case "کاربران":
        setRendered(<Users />);
        break;
      case "سفارشات":
        setRendered(<Orders />);
        break;
      case "دسته‌بندی‌ها":
        setRendered(<Category />);
        break;
      default:
        setRendered(<Dashboard />);
    }
  };
 
  const handleLogout = async () => {
    setLoading(true);
    try {
      await api.get("/api/auth/admin/logout/");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("admin");
      localStorage.removeItem("isAuthenticated");
 
      document.cookie =
        "admin_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
 
      setLoading(false);
      setShowLogoutModal(false);
 
      router.push("/");
    }
  };
 
  return (
    <>
      <aside className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl z-50 flex flex-col">
        {/* User Profile Section */}
        <div className="flex flex-col items-center py-4 px-4 border-b border-gray-700 flex-shrink-0">
          <div className="relative">
            <Image
              src="/male-avatar-KpudEwK5.webp"
              alt="profile-image"
              width={64}
              height={64}
              className="rounded-full border-4 border-blue-500 object-cover w-16 h-16"
            />
            <div className="absolute bottom-0 left-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
          </div>
          <h3 className="mt-2 text-white font-bold text-base leading-tight text-center">
            {user.firstname} {user.lastname}
          </h3>
          <p className="text-gray-400 text-xs mt-1 px-3 py-1 bg-gray-700 rounded-full text-center">
            {user.role}
          </p>
        </div>
 
        {/* Navigation Menu — scrollable middle area */}
        <nav className="flex-1 overflow-y-auto mt-4 px-3 min-h-0">
          <ul className="space-y-1 pb-2">
            {list_items.map((li, idx) => (
              <li key={idx}>
                <button
                  onClick={() => handleClick(li.name)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 rounded-lg
                    transition-all duration-200 text-right
                    ${
                      activeItem === li.name
                        ? "bg-blue-600 text-white shadow-lg scale-105"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }
                  `}
                >
                  <span className="text-lg">{li.icon}</span>
                  <span className="font-medium text-sm">{li.name}</span>
                  {activeItem === li.name && (
                    <div className="mr-auto w-1 h-5 bg-white rounded-full"></div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
 
        {/* Footer — always visible at bottom, never overlaps nav */}
        <div className="flex-shrink-0 p-4 border-t border-gray-700">
          <button
            onClick={() => setShowLogoutModal(true)}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-700/50 transition-colors duration-200 disabled:opacity-50"
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="text-sm font-medium">خروج از سیستم</span>
          </button>
        </div>
      </aside>
 
      {/* مودال خروج */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
            {/* آیکون */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>
 
            {/* عنوان */}
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              خروج از پنل کاربری
            </h3>
 
            {/* متن */}
            <p className="text-gray-500 mb-6">آیا از خروج خود مطمئن هستید؟</p>
 
            {/* دکمه‌ها */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-xl font-medium transition"
              >
                انصراف
              </button>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-medium transition disabled:opacity-50"
              >
                {loading ? "در حال خروج..." : "خروج"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}