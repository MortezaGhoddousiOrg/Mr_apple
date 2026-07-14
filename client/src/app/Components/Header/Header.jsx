"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/app/Context/Context";
import { useRouter } from "next/navigation";
import style from "@/app/Components/Header/Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const { isLoggedIn, productbuy } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();
  

  const navRef = useRef(null);
  const sliderRef = useRef(null);

  const imgNavRef = useRef(null);
  const imgSliderRef = useRef(null);

  const mobileNavRef = useRef(null);
  const mobileSliderRef = useRef(null);

  const totalCount =
    productbuy?.reduce((sum, item) => sum + (item.qty || 1), 0) || 0;

  // افکت منوی اصلی (افقی) با استفاده از ResizeObserver برای حل باگ جابجایی حباب
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

  // افکت منوی موبایل (عمودی)
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

  // افکت بخش آیکون‌ها (پروفایل و سبد خرید) با استفاده از ResizeObserver
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
  ];

  return (
    <>
      {/* بک‌دراپ برای بسته شدن منو با کلیک خارج از آن */}
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
              const isActive =
                link.path === "/Products"
                  ? pathname.startsWith("/Products") ||
                    pathname.startsWith("/Category")
                  : pathname === link.path;
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
              const isActive =
                link.path === "/Products"
                  ? pathname.startsWith("/Products") ||
                    pathname.startsWith("/Category")
                  : pathname === link.path;
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 17l5-5-5-5" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H3" />
                </svg>
              </Link>
            )}

            <Link
              href="/ProductBuy"
              className={style.cartWrapper}
              data-active={pathname === "/ProductBuy" ? "true" : "false"}
            >
              <Image src="/image-header/bag.svg" alt="shop" width={20} height={20} />
              <span className={style.cartBadge}>{totalCount}</span>
            </Link>

            <div className={style.searchIcon} onClick={toggleSearch}>
              <Image src="/image-header/search.svg" width={20} height={20} alt="search" />
            </div>
          </div>

          <div className={style.menuIcon} onClick={toggleMenu}>
            <div className={`${style.hamburger} ${isMenuOpen ? style.hamburgerActive : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </header>

      {isSearchOpen && (
        <div className={style.searchOverlay} onClick={toggleSearch}>
          <div className={style.searchDropdown} onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              placeholder="جستجوی محصولات..."
              className={style.searchInput}
              autoFocus
            />
            <div className={style.recentSearch}>
              <p className={style.recentTitle}>جستجوهای اخیر</p>
              <ul>
                <li>iphone 15</li>
                <li>macbook</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}