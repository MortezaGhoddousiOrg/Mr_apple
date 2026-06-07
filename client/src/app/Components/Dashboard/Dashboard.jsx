"use client";

import style from "@/app/Components/Dashboard/Dashboard.module.css";

export default function Dashboard() {
  const cards = [
    {
      value: "بدنه تیتانیوم",
      label: "طراحی مقاوم و سبک",
      id: "titanium-body",
      img: "/image-dashboard/titanium.png",
    },
    {
      value: "A19 Pro",
      label: "تراشه دوگانه سریع‌تر",
      id: "a19-pro-chip",
      img: "/image-dashboard/chip.png",
    },
    {
      value: "48 مگاپیکسل",
      label: "سیستم دوربین پیشرفته",
      id: "advanced-camera",
      img: "/image-dashboard/camera.png",
    },
  ];

  const scrollToSection = (id) => {
    if (typeof document === "undefined") return;

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };

  return (
    <section className={style.dashboardSection}>
      <div className={style.dashboarContainer}>
        <h1 className={style.dashboarTitle}>iPhone 17 Pro</h1>

        <p className={style.dashboarDescription}>
          با طراحی بی‌نظیر و بدنه‌ای از جنس تیتانیوم درجه یک، تراشه قدرتمند
          دوگانه A19 Pro
        </p>
      </div>

      <div className={style.dashboarCard}>
        {cards.map((item, index) => (
          <div
            className={style.card}
            key={index}
            onClick={() => scrollToSection(item.id)}
          >
            <div
              className={style.cardBg}
              style={{ backgroundImage: `url(${item.img})` }}
            ></div>

            <div className={style.cardOverlay}></div>

            <div className={style.cardContent}>
              <p className={style.cardValue}>{item.value}</p>
              <p className={style.cardLabel}>{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
