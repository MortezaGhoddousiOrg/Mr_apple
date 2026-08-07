"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/app/config";

export default function Header({ toggleSidebar, isSidebarOpen }) {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/category/child/");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const dateString = now.toLocaleDateString("fa-IR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setCurrentTime(`${dateString} | ${timeString}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // جستجو با هر حرف
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchTerm || selectedCategory) {
        handleSearch();
      } else {
        setShowSearchResults(false);
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchTerm, selectedCategory]);

  // بستن نتایج با کلیک خارج
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async () => {
    if (!searchTerm && !selectedCategory) {
      setShowSearchResults(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("q", searchTerm);
      if (selectedCategory) params.append("category_id", selectedCategory);

      const response = await api.get(
        `/api/catalog/products/search/?${params.toString()}`,
      );
      setSearchResults(response.data);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (productId) => {
    setShowSearchResults(false);
    setSearchTerm("");
    setSelectedCategory("");
    setSearchResults([]);
    router.push("/dashboard");
    window.dispatchEvent(
      new CustomEvent("searchProduct", { detail: { productId } }),
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    // ⚠️ z-[60] به‌جای z-50: چون این هدر position:fixed داره و یک stacking context
    // جدید می‌سازه، باید از هر عنصر دیگه‌ای (مثل ساید‌بار) بالاتر باشه وگرنه
    // باکس نتایج جستجوی داخلش (با اینکه خودش هم z بالایی داره) ممکنه پشت
    // ساید‌بار بره. اگه جایی توی پروژه از z-index بالاتر از ۶۰ استفاده شده،
    // همینجا هم عدد رو بالاتر ببر.
    <header className="fixed top-0 right-0 left-0 h-16 bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg shadow-blue-900/20 z-[60]">
      <div className="h-full px-3 sm:px-4 md:px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleSidebar}
            className="md:hidden text-white hover:text-blue-200 active:scale-95 transition-all p-1.5 rounded-lg hover:bg-white/10"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isSidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-white text-base sm:text-xl md:text-2xl font-bold tracking-tight whitespace-nowrap">
            پنل مدیریت
          </h2>
        </div>

        {/* باکس سرچ */}
        <div
          ref={searchRef}
          className="hidden md:flex items-center gap-2 flex-1 max-w-xl mx-4 relative"
        >
          <div className="relative flex-1">
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="جستجوی محصول..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pr-9 pl-4 py-1.5 rounded-lg bg-white/95 border border-transparent focus:border-white focus:ring-2 focus:ring-white/40 focus:outline-none text-gray-800 text-sm placeholder-gray-400 transition"
            />
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl ring-1 ring-black/5 max-h-80 overflow-y-auto z-[70]">
                {searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleResultClick(product.id)}
                      className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                    >
                      <div className="font-medium text-gray-800 text-sm">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        کد: {product.product_code || "—"} | قیمت:{" "}
                        {new Intl.NumberFormat("fa-IR").format(
                          product.sell_price,
                        )}{" "}
                        تومان
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-4 text-center text-gray-400 text-sm">
                    محصولی یافت نشد
                  </div>
                )}
              </div>
            )}
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-white/95 border border-transparent focus:border-white focus:ring-2 focus:ring-white/40 focus:outline-none text-gray-800 text-sm transition"
          >
            <option value="">همه دسته‌ها</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.parent?.title
                  ? `${cat.parent.title} / ${cat.title}`
                  : cat.title}
              </option>
            ))}
          </select>

          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-4 py-1.5 bg-white text-blue-600 rounded-lg hover:bg-blue-50 active:scale-95 transition font-medium text-sm disabled:opacity-50 whitespace-nowrap flex items-center gap-1.5"
          >
            {isSearching && (
              <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            جستجو
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 text-white/90 text-xs md:text-sm">
            <svg
              className="w-3 h-3 md:w-4 md:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="hidden md:inline">{currentTime}</span>
            <span className="md:hidden text-xs">
              {currentTime.split("|")[1] || ""}
            </span>
          </div>

          <button className="relative text-white hover:text-blue-200 transition-colors p-1.5 rounded-lg hover:bg-white/10">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-blue-600 animate-pulse"></span>
          </button>
        </div>
      </div>

      {/* سرچ موبایل */}
      <div className="md:hidden px-3 pb-2.5 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div ref={searchRef} className="relative flex gap-2">
          <div className="relative flex-1">
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="جستجوی محصول..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pr-9 pl-3 py-1.5 rounded-lg bg-white/95 border border-transparent focus:border-white focus:ring-2 focus:ring-white/40 focus:outline-none text-gray-800 text-sm placeholder-gray-400 transition"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2 py-1.5 rounded-lg bg-white/95 border border-transparent focus:border-white focus:outline-none text-gray-800 text-sm max-w-[100px]"
          >
            <option value="">همه</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
          </select>
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-3 py-1.5 bg-white text-blue-600 rounded-lg hover:bg-blue-50 active:scale-95 transition font-medium text-sm disabled:opacity-50"
          >
            {isSearching ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            ) : (
              "🔍"
            )}
          </button>

          {/* نتایج سرچ موبایل */}
          {showSearchResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl ring-1 ring-black/5 max-h-60 overflow-y-auto z-[70]">
              {searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleResultClick(product.id)}
                    className="px-3 py-2.5 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                  >
                    <div className="font-medium text-gray-800 text-sm">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {new Intl.NumberFormat("fa-IR").format(
                        product.sell_price,
                      )}{" "}
                      تومان
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-gray-400 text-sm">
                  محصولی یافت نشد
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}