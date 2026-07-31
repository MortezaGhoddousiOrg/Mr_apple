"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import style from "@/app/Components/Footer/Footer.module.css";
import { api } from "@/app/config";

export default function Footer() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/category/parent/");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const formatCategoryUrl = (title) => {
    return `/Category/${title.trim().replace(/\s+/g, "-")}`;
  };

  return (
    <footer className={style.footer}>
      <div className={style.footerTop}>
        {/* Brand Section */}
        <div className={style.brandSection}>
          <div className={style.brandWrapper}>
            <Image
              src="/image-header/IMG_3321.png"
              width={40}
              height={40}
              alt="apple"
              className={style.brandLogo}
              onClick={() => router.push("/")}
            />
            <h2 className={style.brand}>MR APPLE</h2>
          </div>

          <p className={style.brandText}>
            فروشگاه تخصصی محصولات اپل، عرضه جدیدترین دستگاه‌ها به همراه گوشی‌های
            کارکرده کارشناسی‌شده با ضمانت سلامت.
          </p>

          {/* Socials */}
          <div className={style.socials}>
            <a href="#" className={style.socialLink} aria-label="Instagram">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M7.75 2C4.57 2 2 4.57 2 7.75v8.5C2 19.43 4.57 22 7.75 22h8.5C19.43 22 22 19.43 22 16.25v-8.5C22 4.57 19.43 2 16.25 2h-8.5zm4.25 5.2a4.8 4.8 0 110 9.6 4.8 4.8 0 010-9.6zm0 1.8a3 3 0 100 6 3 3 0 000-6zm5.1-.9a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2z" />
              </svg>
            </a>

            <a href="#" className={style.socialLink} aria-label="Telegram">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9.04 15.53l-.37 5.2c.53 0 .76-.23 1.04-.5l2.5-2.39 5.18 3.79c.95.52 1.62.25 1.86-.88l3.38-15.84h.01c.28-1.3-.47-1.8-1.4-1.45L1.7 10.94c-1.27.5-1.25 1.21-.22 1.53l5.92 1.85L19.02 6.9c.54-.33 1.03-.15.62.18" />
              </svg>
            </a>

            <a href="#" className={style.socialLink} aria-label="YouTube">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21.8 7.2c-.2-.7-.8-1.3-1.5-1.5C18.9 5.2 12 5.2 12 5.2s-6.9 0-8.3.5c-.7.2-1.3.8-1.5 1.5C1.7 8.6 1.7 12 1.7 12s0 3.4.5 4.8c.2.7.8 1.3 1.5 1.5 1.4.5 8.3.5 8.3.5s6.9 0 8.3-.5c.7-.2 1.3-.8 1.5-1.5.5-1.4.5-4.8.5-4.8s0-3.4-.5-4.8zM9.8 15.5v-7l6 3.5-6 3.5z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Column 1 - Products */}
        <div className={style.footerColumn}>
          <h4 className={style.columnTitle}>محصولات مستر اپل</h4>

          <ul className={style.columnList}>
            {loading ? (
              <li className={style.footerItem}>
                <span className={style.link}>در حال بارگذاری...</span>
              </li>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <li key={category.id} className={style.footerItem}>
                  <a
                    href={formatCategoryUrl(category.title)}
                    className={style.link}
                  >
                    {category.title}
                  </a>
                </li>
              ))
            ) : (
              <li className={style.footerItem}>
                <span className={style.link}>دسته‌بندی موجود نیست</span>
              </li>
            )}
          </ul>

          <ul className={style.columnList}>
          </ul>
        </div>

        {/* Column 3 */}
        <div className={style.footerColumn}>
          <h4 className={style.columnTitle}>خدمات فروشگاه</h4>

          <ul className={style.columnList}>
            <li className={style.footerItem}>
              <a href="" className={style.link}>
                مشاوره خرید
              </a>
            </li>

            <li className={style.footerItem}>
              <a href="" className={style.link}>
                پیگیری سفارش
              </a>
            </li>

            <li className={style.footerItem}>
              <a href="" className={style.link}>
                پرداخت اقساطی
              </a>
            </li>

            <li className={style.footerItem}>
              <a href="" className={style.link}>
                گارانتی و خدمات
              </a>
            </li>

            <li className={style.footerItem}>
              <a href="" className={style.link}>
                سوالات متداول
              </a>
            </li>
          </ul>
        </div>

        <div className={style.trustSection}>
          <h4 className={style.columnTitle}>اعتماد شما</h4>

          <div className={style.trustBadges}>
            <a
              referrerPolicy="origin"
              target="_blank"
              href="https://trustseal.enamad.ir/?id=754824&Code=TYI5ctdQ3Yn1Q0pjGjDfRaeEZWmRIZxd"
              className={style.trustLink}
            >
              <img
                referrerPolicy="origin"
                src="https://trustseal.enamad.ir/logo.aspx?id=754824&Code=TYI5ctdQ3Yn1Q0pjGjDfRaeEZWmRIZxd"
                alt="نماد اعتماد الکترونیکی"
                className={style.badgeImage}
                code="TYI5ctdQ3Yn1Q0pjGjDfRaeEZWmRIZxd"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className={style.bottomSection}>
        <p className={style.copyright}>
          کپی‌رایت © 2026 مستر اپل مرجع تخصصی فروش و خدمات محصولات اپل
        </p>

        <div className={style.legalLinks}>
          <a href="">قوانین و مقررات</a>
          <a href="">حریم خصوصی</a>
          <a href="">پشتیبانی</a>
        </div>
      </div>
    </footer>
  );
}