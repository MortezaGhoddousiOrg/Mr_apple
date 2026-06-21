"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/app/Context/Context";
import style from "@/app/Components/Header/Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const { isLoggedIn, productbuy, } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navRef = useRef(null);
  const sliderRef = useRef(null);

  const totalCount =
    productbuy?.reduce((sum, item) => sum + (item.qty || 1), 0) || 0;

  useEffect(() => {
    const nav = navRef.current;
    const slider = sliderRef.current;
    if (!nav || !slider) return;

    const activeItem = nav.querySelector(`[data-active="true"]`);
    if (!activeItem) return;

    const navRect = nav.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();

    const left = itemRect.left - navRect.left;
    const width = itemRect.width;

    slider.style.width = `${width}px`;
    slider.style.transform = `translateX(${left}px)`;
  }, [pathname, isMenuOpen]);

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
      <header className={style.header}>
        <div className={style.navContainer}>
          <div className={style.logo}>
            <Image
              src="/image-header/apple.svg"
              width={20}
              height={20}
              alt="apple"
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

          <div className={style.imgHeader}>
            {isLoggedIn ? (
              <Link href="/PanelUser" className={style.cartWrapper}>
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
              <Link href="/Login">
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

            <Link href="/ProductBuy" className={style.cartWrapper}>
              <Image
                src="/image-header/bag.svg"
                alt="shop"
                width={20}
                height={20}
              />
              <span className={style.cartBadge}>{totalCount}</span>
            </Link>

            <Image
              src="/image-header/search.svg"
              width={20}
              height={20}
              alt="search"
              onClick={toggleSearch}
              style={{ cursor: "pointer" }}
            />
          </div>

          <div className={style.menuIcon} onClick={toggleMenu}>
            <div
              className={`${style.hamburger} ${
                isMenuOpen ? style.hamburgerActive : ""
              }`}
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
