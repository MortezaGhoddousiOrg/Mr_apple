"use client";

import styles from "./infoSection.module.css";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const infoSectionsData = [
  {
    id: 1,
    title: "طراحی یکپارچه آلومینیومی",
    description: "آماده اجرای پروژه‌های سنگین و پردازش‌های حرفه‌ای.",
    imageSrc: "/image-infosection/IMG_SEGMENT_20260513_144204.png",
    buyLink: "/ProductDetail/1",
    moreLink: "/Category/iPad",
  },
  {
    id: 2,
    title: "هماهنگ با زندگی مدرن",
    description:
      "طراحی هوشمند و عملکرد پایدار برای کار، سرگرمی و ارتباطات روزانه.",
    imageSrc: "/image-infosection/IMG_SEGMENT_20260513_144209.png",
    buyLink: "/ProductDetail/1",
    moreLink: "/Category/iPhone",
  },
];

export default function InfoSections() {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.grid}>
        {infoSectionsData.map((item, index) => (
          <motion.div
            key={item.id}
            className={styles.card}
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className={styles.content}>
              <h2 className={styles.title}>{item.title}</h2>
              <p className={styles.desc}>{item.description}</p>

              <div
                className={`${styles.actions} ${
                  index === 1 ? styles.secondActions : ""
                }`}
              >
                <button
                  className={`btnGlass ${styles.buyBtn}`}
                  onClick={() => handleNavigation(item.buyLink)}
                >
                  خرید
                </button>

                <button
                  className={`btnGlass ${styles.moreBtn}`}
                  onClick={() => handleNavigation(item.moreLink)}
                >
                  مشاهده بیشتر
                </button>
              </div>
            </div>

            <div
              className={`${styles.imageBox} ${
                index === 1 ? styles.secondImageBox : ""
              }`}
            >
              <Image
                src={item.imageSrc}
                alt={item.title}
                fill
                className={styles.image}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
