"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/app/Context/Context";
import { useRouter } from "next/navigation";
import style from "@/app/Components/Header/Header.module.css";
import { api } from "@/app/config";
import { MEDIA_URL } from "@/app/config";

const PLACEHOLDER_IMG =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='55' height='55' viewBox='0 0 55 55'%3E%3Crect width='55' height='55' fill='%23f0f0f0'/%3E%3Cpath d='M18 36l6-8 5 6 6-9 8 11H18z' fill='%23d9d9d9'/%3E%3Ccircle cx='22' cy='20' r='4' fill='%23d9d9d9'/%3E%3C/svg%3E";

const getImageUrl = (path) => {
  if (!path) return PLACEHOLDER_IMG;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const base = MEDIA_URL.replace(/\/+$/, "");
  const cleanPath = path.replace(/^\/+/, "");
  return `${base}/${cleanPath}`;
};

export default function Header() {
  const pathname = decodeURIComponent(usePathname());
  const { isLoggedIn, productbuy } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    products: [],
    categories: [],
  });

  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("search_history")) || [];

    setSearchHistory(history);
  }, []);

  const saveSearchHistory = (keyword) => {
    if (!keyword.trim()) return;

    let history = JSON.parse(localStorage.getItem("search_history")) || [];

    // اگر قبلاً وجود داشته حذفش کن
    history = history.filter((item) => item !== keyword);

    // اول لیست قرار بگیره
    history.unshift(keyword);

    // فقط 7 مورد نگه دار
    history = history.slice(0, 7);

    localStorage.setItem("search_history", JSON.stringify(history));

    setSearchHistory(history);
  };

  const router = useRouter();

  const navRef = useRef(null);
  const sliderRef = useRef(null);

  const imgNavRef = useRef(null);
  const imgSliderRef = useRef(null);

  const mobileNavRef = useRef(null);
  const mobileSliderRef = useRef(null);

  const totalCount =
    productbuy?.reduce((sum, item) => sum + (item.qty || 1), 0) || 0;

  const getInitialProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/catalog/products/", {
        params: {
          limit: 3,
        },
      });

      const list = Array.isArray(res.data) ? res.data : res.data?.results || [];

      setResults({
        products: list.slice(0, 3),
        categories: [],
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (value) => {
    if (!value.trim()) {
      getInitialProducts();
      return;
    }

    try {
      setLoading(true);

      const res = await api.get("/api/catalog/products/search/", {
        params: {
          q: value,
        },
      });

      const mappedProducts = res.data.map((item) => ({
        ...item,

        image:
          item.images.find((img) => img.is_main)?.image ||
          item.images[0]?.image ||
          "",

        title: item.name,
        description: item.descriptions,
        price: item.sell_price,
      }));

      setResults({
        products: mappedProducts,
        categories: [],
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSearchOpen && !search.trim()) {
      getInitialProducts();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!search.trim()) return;

    const timer = setTimeout(() => {
      searchProducts(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const nav = navRef.current;
    const slider = sliderRef.current;
    if (!nav || !slider) return;

    const updateSlider = () => {
      const activeItem = nav.querySelector(`[data-active="true"]`);
      if (!activeItem) {
        slider.style.width = "0px";
        return;
      }

      const navRect = nav.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();

      slider.style.width = `${itemRect.width}px`;
      slider.style.transform = `translateX(${itemRect.left - navRect.left}px)`;
    };

    updateSlider();

    const resizeObserver = new ResizeObserver(() => {
      updateSlider();
    });
    resizeObserver.observe(nav);

    return () => resizeObserver.disconnect();
  }, [pathname, isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const timeout = setTimeout(() => {
      const nav = mobileNavRef.current;
      const slider = mobileSliderRef.current;
      if (!nav || !slider) return;

      const activeItem = nav.querySelector(`[data-active="true"]`);
      if (!activeItem) {
        slider.style.height = "0px";
        slider.style.opacity = "0";
        return;
      }

      slider.style.height = `${activeItem.offsetHeight}px`;
      slider.style.opacity = "1";
      slider.style.transform = `translateY(${activeItem.offsetTop}px)`;
    }, 50);

    return () => clearTimeout(timeout);
  }, [pathname, isMenuOpen]);

  useEffect(() => {
    const nav = imgNavRef.current;
    const slider = imgSliderRef.current;
    if (!nav || !slider) return;

    const updateImgSlider = () => {
      const activeItem = nav.querySelector(`[data-active="true"]`);
      if (!activeItem) {
        slider.style.width = "0px";
        return;
      }

      const navRect = nav.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();

      slider.style.width = `${itemRect.width}px`;
      slider.style.transform = `translateX(${itemRect.left - navRect.left}px)`;
    };

    updateImgSlider();

    const resizeObserver = new ResizeObserver(() => {
      updateImgSlider();
    });
    resizeObserver.observe(nav);

    return () => resizeObserver.disconnect();
  }, [pathname, isLoggedIn]);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setIsSearchOpen(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: "خانه", path: "/" },
    { name: "محصولات", path: "/Products" },
    { name: "ارتباط با ما", path: "/ContactUs" },
    { name: "درباره ما", path: "/AboutUs" },
    { name: "آموزش", path: "/Training" },
    { name: "خدمات نرم افزار", path: "/Category/خدمات نرم افزار" },
  ];

  return (
    <>
      <div
        className={`${style.backdrop} ${isMenuOpen ? style.show : ""}`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      <header className={style.header}>
        <div className={style.navContainer}>
          <div className={style.logo}>
            <Image
              src="/image-header/apple.svg"
              width={25}
              height={25}
              alt="apple"
              onClick={() => router.push("/")}
            />
          </div>

          <nav
            ref={navRef}
            className={`${style.navLinks} ${isMenuOpen ? style.open : ""}`}
          >
            <div ref={sliderRef} className={style.glassSlider} />

            {navLinks.map((link) => {
              let isActive = false;

              if (link.path === "/Products") {
                isActive =
                  pathname.startsWith("/Products") ||
                  (pathname.startsWith("/Category") &&
                    pathname !== "/Category/خدمات نرم افزار");
              } else if (link.path === "/Category/خدمات نرم افزار") {
                isActive = pathname === "/Category/خدمات نرم افزار";
              } else {
                isActive = pathname === link.path;
              }

              return (
                <li
                  key={link.path}
                  data-active={isActive ? "true" : "false"}
                  className={isActive ? style.active : ""}
                >
                  <Link href={link.path} onClick={() => setIsMenuOpen(false)}>
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </nav>

          <nav
            ref={mobileNavRef}
            className={`${style.mobileNav} ${isMenuOpen ? style.mobileNavOpen : ""}`}
          >
            <div ref={mobileSliderRef} className={style.mobileGlassSlider} />

            {navLinks.map((link) => {
              let isActive = false;

              if (link.path === "/Products") {
                isActive =
                  pathname.startsWith("/Products") ||
                  (pathname.startsWith("/Category") &&
                    pathname !== "/Category/خدمات نرم افزار");
              } else if (link.path === "/Category/خدمات نرم افزار") {
                isActive = pathname === "/Category/خدمات نرم افزار";
              } else {
                isActive = pathname === link.path;
              }
              return (
                <li
                  key={link.path}
                  data-active={isActive ? "true" : "false"}
                  className={`${style.mobileNavItem} ${isActive ? style.mobileNavItemActive : ""}`}
                >
                  <Link href={link.path} onClick={() => setIsMenuOpen(false)}>
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </nav>

          <div className={style.imgHeader} ref={imgNavRef}>
            <div ref={imgSliderRef} className={style.imgGlassSlider} />

            {isLoggedIn ? (
              <Link
                href="/PanelUser"
                className={style.cartWrapper}
                data-active={pathname === "/PanelUser" ? "true" : "false"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.8"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="9" r="3" />
                  <path d="M6.5 18c1.5-2.5 3.5-3.5 5.5-3.5s4 1 5.5 3.5" />
                </svg>
              </Link>
            ) : (
              <Link
                href="/Login"
                data-active={pathname === "/Login" ? "true" : "false"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#ffffff"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 17l5-5-5-5"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12H3"
                  />
                </svg>
              </Link>
            )}

            <Link
              href="/ProductBuy"
              className={style.cartWrapper}
              data-active={pathname === "/ProductBuy" ? "true" : "false"}
            >
              <Image
                src="/image-header/bag.svg"
                alt="shop"
                width={20}
                height={20}
              />
              <span className={style.cartBadge}>{totalCount}</span>
            </Link>

            <div className={style.searchIcon} onClick={toggleSearch}>
              <Image
                src="/image-header/search.svg"
                width={20}
                height={20}
                alt="search"
              />
            </div>
          </div>

          <div className={style.menuIcon} onClick={toggleMenu}>
            <div
              className={`${style.hamburger} ${isMenuOpen ? style.hamburgerActive : ""}`}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </header>

      {isSearchOpen && (
        <div className={style.searchOverlay} onClick={toggleSearch}>
          <div
            className={style.searchDropdown}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="جستجوی محصولات..."
              className={style.searchInput}
              autoFocus
            />

            {search === "" && searchHistory.length > 0 && (
              <div className={style.historyBox}>
                <p className={style.historyTitle}>جستجوهای اخیر</p>

                {searchHistory.map((item, index) => (
                  <button
                    key={index}
                    className={style.historyItem}
                    onClick={() => setSearch(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}

            <div className={style.searchResults}>
              {loading && <div className={style.loading}>در حال جستجو...</div>}

              {!loading && results.products.length === 0 && search !== "" && (
                <p className={style.noResult}>نتیجه‌ای پیدا نشد</p>
              )}

              {!loading &&
                results.products.map((product) => {
                  return (
                    <Link
                      key={product.id}
                      href={`/ProductDetail/${product.id}`}
                      className={style.searchItem}
                      onClick={() => {
                        saveSearchHistory(product.name);

                        setIsSearchOpen(false);
                        setSearch("");
                      }}
                    >
                      <Image
                        unoptimized
                        src={`${MEDIA_URL}${product.image}`}
                        width={55}
                        height={55}
                        alt={product.title}
                      />

                      <div>
                        <p>{product.name}</p>

                        <span>{product.category?.title}</span>

                        <strong>
                          {Number(product.sell_price).toLocaleString()} تومان
                        </strong>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
