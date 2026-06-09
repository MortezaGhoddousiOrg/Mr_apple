"use client";

import Image from "next/image";
import { useState } from "react";
import Dashboard from "./Dashboard/Dashboard";
import Products from "./Products/Products";
import Users from "./Users/Users";
import Orders from "./Orders/Orders";
import Category from "./Category/Category"; // کامپوننت لیست دسته بندی ها

export default function SideBar({ setRendered }) {
  const [activeItem, setActiveItem] = useState("داشبورد");

  const list_items = [
    { name: "داشبورد", icon: "📊" },
    { name: "محصولات", icon: "📦" },
    { name: "کاربران", icon: "👥" },
    { name: "سفارشات", icon: "🛒" },
    { name: "دسته‌بندی‌ها", icon: "🗂️" }, // آیتم جدید
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

  return (
    <aside className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl overflow-y-auto z-50">
      {/* User Profile Section */}
      <div className="flex flex-col items-center py-6 px-4 border-b border-gray-700">
        <div className="relative">
          <Image
            src="/male-avatar-KpudEwK5.webp"
            alt="profile-image"
            width={80}
            height={80}
            className="rounded-full border-4 border-blue-500 object-cover"
          />
          <div className="absolute bottom-0 left-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
        </div>
        <h3 className="mt-3 text-white font-bold text-lg">
          {user.firstname} {user.lastname}
        </h3>
        <p className="text-gray-400 text-sm mt-1 px-3 py-1 bg-gray-700 rounded-full text-center">
          {user.role}
        </p>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-6 px-3">
        <ul className="space-y-2">
          {list_items.map((li, idx) => (
            <li key={idx}>
              <button
                onClick={() => handleClick(li.name)}
                className={`
                                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                                    transition-all duration-200 text-right
                                    ${
                                      activeItem === li.name
                                        ? "bg-blue-600 text-white shadow-lg transform scale-105"
                                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                    }
                                `}
              >
                <span className="text-xl">{li.icon}</span>
                <span className="font-medium">{li.name}</span>
                {activeItem === li.name && (
                  <div className="mr-auto w-1 h-6 bg-white rounded-full"></div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-400 hover:text-red-400 transition-colors duration-200">
          <svg
            className="w-5 h-5"
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
          <span>خروج از سیستم</span>
        </button>
      </div>
    </aside>
  );
}
