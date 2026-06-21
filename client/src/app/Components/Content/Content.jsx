"use client";

import React, { useEffect, useState } from "react";
import style from "@/app/Components/Content/Content.module.css";

const HERO_VIDEO = "/image-content/hero.mp4";
const SMALL_HERO_VIDEO = "/image-content/smallHero.mp4";

export default function Content() {
  const [videoSrc, setVideoSrc] = useState(HERO_VIDEO);

  useEffect(() => {
    const video = () =>
      window.innerWidth < 760 ? SMALL_HERO_VIDEO : HERO_VIDEO;
    setVideoSrc(video());

    window.addEventListener("resize", video);
    return () => window.removeEventListener("resize", video);
  }, []);

  return (
    <section className={style.contentSection}>
      <div className={style.heroContent}>
        <p className={style.contentTitle}>MR APPLE</p>

        <div className={style.VideoContainer}>
          <video
            className={style.Video}
            autoPlay
            muted
            // loop
            playsInline
            preload="auto"
            key={videoSrc}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}
