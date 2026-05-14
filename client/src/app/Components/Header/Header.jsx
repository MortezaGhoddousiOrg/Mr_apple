"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import style from "@/app/Components/Header/Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

    const togglesearch = () => {
      setIsOpen(!isOpen);
    };

    // const handleMenuClick = (key) => {
    //   setActiveMenu((prev) => (prev === key ? null : key));
    // }

  const isActiveLink = (href) => pathname === href;

  return (
    <header className={style.header}>
      <ul className={style.navbars}>
        <li className={style.imgHeader}>
          <Link href="/login">
            <Image
              src="/image-header/user-add.svg"
              width={25}
              height={25}
              alt="search"
            />
          </Link>
          <Image
            src="/image-header/search.svg"
            width={25}
            height={25}
            alt="search"
            // onClick={togglesearch}
          />
        </li>
        <li className={pathname === "/" ? style.active : ""}>
          <Link href="/">خانه</Link>
        </li>

        <li className={pathname === "/Product" ? style.active : ""}>
          <Link href="/Product">محصولات</Link>
        </li>

        <li className={pathname === "/ContactUs" ? style.active : ""}>
          <Link href="/ContactUs">ارتباط با ما</Link>
        </li>

        <li className={pathname === "/AboutUs" ? style.active : ""}>
          <Link href="/AboutUs">درباره ما</Link>
        </li>

        <li>
          <Image
            src="/image-header/apple.svg"
            width={20}
            height={20}
            alt="apple"
          />
        </li>
      </ul>
    </header>
  );
}
