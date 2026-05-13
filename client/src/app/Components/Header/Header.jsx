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

  const handleMenuClick = (key) => {
    setActiveMenu((prev) => (prev === key ? null : key));
  };

  const menus = [
    {
      key: "iphone",
      label: "آیفون",
      items: [
        "آیفون 17",
        "آیفون 17 پرو",
        "آیفون 17 پرو مکس",
        "آیفون 16",
        "آیفون 16 پرو",
        "آیفون 16 پرو مکس",
        "آیفون 16 پرو مکس",
        "آیفون 16 پرو مکس",
        "آیفون 16 پرو مکس",
        "آیفون 16 پرو مکس",
        "آیفون 16 پرو مکس",
        "آیفون 16 پرو مکس",
        "آیفون 16 پرو مکس",
        "آیفون 16 پرو مکس",
        "آیفون 16 پرو مکس",
      ],
    },
    {
      key: "ipad",
      label: "آیپد",
      items: [
        "آیپد پرو",
        "آیپد ایر",
        "آیپد پرو 13 اینچ",
        "آیپد پرو 14 اینچ",
        "آیپد پرو 14 اینچ",
        "آیپد پرو 14 اینچ",
        "آیپد پرو 14 اینچ",
        "آیپد پرو 14 اینچ",
        "آیپد پرو 14 اینچ",
        "آیپد پرو 14 اینچ",
        "آیپد پرو 14 اینچ",
      ],
    },
    {
      key: "watch",
      label: "اپل واچ",
      items: [
        "اپل واچ سری 11",
        "اپل واچ اولترا",
        "اپل واچ SE",
        "اپل واچ سری 10",
        "اپل واچ سری 10",
        "اپل واچ سری 10",
        "اپل واچ سری 10",
        "اپل واچ سری 10",
        "اپل واچ سری 10",
        "اپل واچ سری 10",
        "اپل واچ سری 10",
        "اپل واچ سری 10",
      ],
    },
    {
      key: "airpod",
      label: "ایرپاد",
      items: ["ایرپاد پرو نسل 3", 
        "ایرپاد نسل 2", 
        "ایرپاد نسل 2", 
        "ایرپاد نسل 2", 
        "ایرپاد نسل 2", 
        "ایرپاد نسل 2", 
        "ایرپاد نسل 2", 
        "ایرپاد نسل 2", 
        "ایرپاد نسل 2", 
        "ایرپاد نسل 2", 
        "ایرپاد نسل 2", 
        "ایرپاد مکس", 
        "ایرپاد 4",
      ],
    },
  ];

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
            onClick={togglesearch}
          />
        </li>
        <li className={pathname === "/" ? style.active : ""}>
          <Link href="/">خانه</Link>
        </li>

        <li className={pathname === "/product" ? style.active : ""}>
          <Link href="/Product">محصولات</Link>
        </li>

        <li className={pathname === "/contact" ? style.active : ""}>
          <Link href="/ContactUs">ارتباط با ما</Link>
        </li>

        <li className={pathname === "/about" ? style.active : ""}>
          <Link href="/AboutUs">درباره ما</Link>
        </li>

        <nav className={style.menuContainer}>
          <ul className={style.headerMenu}>
            {menus.map((menu) => (
              <li
                key={menu.key}
                onClick={() => handleMenuClick(menu.key)}
                className={style.headerMenuItem}
              >
                {menu.label}

                {activeMenu === menu.key && (
                  <div className={style.menu}>
                    <ul className={style.containerMenuopen}>
                      {menu.items.map((item, index) => (
                        <li key={index} className={style.menuopen}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
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
