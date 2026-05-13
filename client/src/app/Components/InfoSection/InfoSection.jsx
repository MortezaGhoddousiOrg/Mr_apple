"use client";

import styles from "./infoSection.module.css";
import Image from "next/image";
import { motion } from "framer-motion";

const infoSectionsData = [
  {
    id: 1,
    title: " طراحی یکپارچه آلومینیومی ",
    description:
      "آماده اجرای پروژه‌های سنگین و پردازش‌های حرفه‌ای.",
    imageSrc: "/image-infosection/IMG_SEGMENT_20260513_144204.png",
  },
  {
    id: 2,
    title: "هماهنگ با زندگی مدرن",
    description:
      "طراحی هوشمند و عملکرد پایدار برای کار، سرگرمی و ارتباطات روزانه.",
    imageSrc: "/image-infosection/IMG_SEGMENT_20260513_144209.png",
  },
  // {
  //   id: 3,
  //   title: "زیبایی در نهایت سادگی",
  //   description:
  //     "ترکیب نور، متریال و فضای خالی برای خلق یک ظاهر premium.",
  //   imageSrc: "/image-infosection/macbookfourteeninsch.jpg",
  // },
  // {
  //   id: 4,
  //   title: "قدرتی فراتر از انتظار",
  //   description:
  //     "تراشه جدید عملکرد فوق‌العاده‌ای در پردازش و گیمینگ ارائه می‌دهد.",
  //   imageSrc: "/image-infosection/macbookfourteeninsch.jpg",
  // },
];

export default function InfoSections() {

  return (
    <section className={styles.wrapper}>

      <div className={styles.grid}>

        {infoSectionsData.map((item) => (

          <motion.div
            key={item.id}
            className={styles.card}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >

            <div className={styles.content}>

              <h2 className={styles.title}>
                {item.title}
              </h2>

              <p className={styles.desc}>
                {item.description}
              </p>

              <div className={styles.actions}>

                <button className={styles.buyBtn}>
                  خرید
                </button>

                <button className={styles.moreBtn}>
                  مشاهده بیشتر
                </button>

              </div>

            </div>

            <div className={styles.imageBox}>
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
