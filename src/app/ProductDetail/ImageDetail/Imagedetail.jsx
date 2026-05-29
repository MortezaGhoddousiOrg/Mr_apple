"use client"

import React, { useEffect, useState } from "react";
import style from "@/app/ProductDetail/ImageDetail/Imagedetail.module.css";


export default function Imagedetail({ images = [] }) {
  const validImages = Array.isArray(images) ? images.filter(Boolean) : [];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    setCurrentImageIndex((prev) =>
      validImages.length ? Math.min(prev, validImages.length - 1) : 0
    );
  }, [validImages.length]);

  const openFullScreen = (index = 0) => {
    if (!validImages.length) return;
    setCurrentImageIndex(index);
    setIsFullScreen(true);
  };

  const closeFullScreen = () => setIsFullScreen(false);

  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? validImages.length - 1 : prev - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === validImages.length - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
    if (!isFullScreen) return;

    const onKeyDown = (e) => {
      if (e.key === "ArrowLeft") goToPreviousImage();
      if (e.key === "ArrowRight") goToNextImage();
      if (e.key === "Escape") closeFullScreen();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isFullScreen, validImages.length]);

  if (!validImages.length) return <div>عکسی برای نمایش وجود ندارد.</div>;

  const currentImage = validImages[currentImageIndex];

  return (
    <div className={style.productGalleryContainer}>
      <img
        src={currentImage}
        alt={`Product image ${currentImageIndex + 1}`}
        className={style.mainImageDisplay}
        onClick={() => openFullScreen(currentImageIndex)}
        draggable={false}
      />

      <div className={style.thumbnailContainer}>
        {validImages.map((img, index) => (
          <img
            key={`${img}-${index}`}
            src={img}
            alt={`Thumbnail ${index + 1}`}
            className={`${style.thumbnail} ${index === currentImageIndex ? style.active : ""}`}
            onClick={() => setCurrentImageIndex(index)}
            draggable={false}
          />
        ))}
      </div>

      {isFullScreen && (
        <div
          className={style.fullscreenOverlay}
          onClick={closeFullScreen}
        >
          <button
            className={style.closeFullscreenButton}
            onClick={(e) => {
              e.stopPropagation();
              closeFullScreen();
            }}
          >
            ×
          </button>

          <div className={style.fullscreenControls}>
            <button
              className={style.prevBtn}
              onClick={(e) => {
                e.stopPropagation();
                goToPreviousImage();
              }}
              aria-label="Previous image"
            >
              ‹
            </button>

            <img
              src={currentImage}
              alt={`Fullscreen image ${currentImageIndex + 1}`}
              className={style.fullscreenImage}
              onClick={(e) => e.stopPropagation()}
              draggable={false}
            />

            <button
              className={style.nextBtn}
              onClick={(e) => {
                e.stopPropagation();
                goToNextImage();
              }}
              aria-label="Next image"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}