"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./Imagedetail.module.css";

export default function Imagedetail({
  images = [],
  discountPercent = 0,
}) {
  const gallery = useMemo(
    () => (Array.isArray(images) ? images.filter(Boolean) : []),
    [images],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSelectedIndex(0);
  }, [gallery.length]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      } else if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, gallery.length]);

  if (!gallery.length) {
    return (
      <div className={styles.emptyBox}>
        <span>تصویری برای نمایش وجود ندارد</span>
      </div>
    );
  }

  const currentImage = gallery[selectedIndex];

  const goNext = (e) => {
    if (e) e.stopPropagation();
    setSelectedIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  const goPrev = (e) => {
    if (e) e.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const openLightbox = () => setIsOpen(true);
  const closeLightbox = () => setIsOpen(false);

  return (
    <>
      <div className={styles.galleryShell}>
        <div className={styles.mainCard}>
          {discountPercent > 0 && (
            <div className={styles.discountBadge}>{discountPercent}٪</div>
          )}

          <img
            src={currentImage}
            alt="product"
            className={styles.mainImage}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable={false}
            onClick={openLightbox}
          />
        </div>

        {gallery.length > 1 && (
          <div className={styles.thumbRow}>
            {gallery.map((img, index) => (
              <button
                key={`${img}-${index}`}
                type="button"
                className={`${styles.thumbBtn} ${
                  selectedIndex === index ? styles.thumbBtnActive : ""
                }`}
                onClick={() => setSelectedIndex(index)}
                aria-label={`تصویر ${index + 1}`}
              >
                <img
                  src={img}
                  alt={`thumbnail-${index + 1}`}
                  className={styles.thumbImage}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {isOpen && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button
            type="button"
            className={`${styles.lightboxBtn} ${styles.closeBtn}`}
            onClick={closeLightbox}
            aria-label="بستن"
          >
            ×
          </button>

          {gallery.length > 1 && (
            <>
              <button
                type="button"
                className={`${styles.lightboxBtn} ${styles.prevBtn}`}
                onClick={goPrev}
                aria-label="تصویر قبلی"
              >
                ‹
              </button>

              <button
                type="button"
                className={`${styles.lightboxBtn} ${styles.nextBtn}`}
                onClick={goNext}
                aria-label="تصویر بعدی"
              >
                ›
              </button>
            </>
          )}

          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage}
              alt="fullscreen-product"
              className={styles.lightboxImage}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              draggable={false}
            />
          </div>
        </div>
      )}
    </>
  );
}
