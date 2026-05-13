'use client';

import style from "@/app/Components/Footer/Footer.module.css";

export default function Footer() {
  return (
    <footer className={style.footer}>
      <div className={style.footerContainet}>
        <div className={style.footerColumn}>
          <h4 className={style.columnTitle}>خرید و یادگیری</h4>
          <ul className={style.columnList}>
            <li><a href="" className={style.link}>آیفون</a></li>
            <li><a href="" className={style.link}>آیپد</a></li>
            <li><a href="" className={style.link}>مک</a></li>
            <li><a href="" className={style.link}>واچ</a></li>
          </ul>
        </div>

        <div className={style.footerColumn}>
          <h4 className={style.columnTitle}>خدمات</h4>
          <ul className={style.columnList}>
            <li><a href="" className={style.link}>اپل موزیک</a></li>
            <li><a href="" className={style.link}>اپل تی‌وی+</a></li>
            <li><a href="" className={style.link}>آی‌کلود</a></li>
          </ul>
        </div>

        <div className={style.footerColumn}>
          <h4 className={style.columnTitle}>فروشگاه اپل</h4>
          <ul className={style.columnList}>
            <li><a href="" className={style.link}>یافتن فروشگاه</a></li>
            <li><a href="" className={style.link}>جی‌نیوس بار</a></li>
            <li><a href="" className={style.link}>امروز در اپل</a></li>
          </ul>
        </div>

        <div className={style.footerColumn}>
          <h4 className={style.columnTitle}>درباره اپل</h4>
          <ul className={style.columnList}>
            <li><a href="" className={style.link}>اتاق خبر</a></li>
            <li><a href="" className={style.link}>مدیریت اپل</a></li>
            <li><a href="" className={style.link}>فرصت‌های شغلی</a></li>
          </ul>
        </div>
      </div>

    </footer>
  );
}
