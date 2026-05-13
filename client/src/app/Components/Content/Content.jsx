// "use client"

// import style from "@/app/Components/Content/Content.module.css";
// import Image from "next/image";
// import { useState, useEffect } from "react";

// export default function Content() {
//   const image = [
//     "/image-contact/iphone-parivar.jpg",
//     "/image-contact/IMG_SEGMENT_20260511_144239.png",
//     "/image-contact/iphone-lineup-3.jpg",
//     "/image-contact/iphone-lineup-4.jpg",
//   ];

//   const [index, setIndex] = useState(0);

//   const nextImage = () => {
//     setIndex((prev) => (prev + 1) % image.length);
//   };

//   const prevImage = () => {
//     setIndex((prev) => (prev - 1 + image.length) % image.length);
//   };

//   useEffect(() => {
//     const interval = setInterval(nextImage, 5000);
//     return () => clearInterval(interval);
//   }, []);
//   return (
//     <div>
//       <section className={style.Content}>
//         <div>
//           <h2>MR APPLE</h2>
//         </div>
//         <div className={style.imgContact}>
//           <Image
//             src={image[index]}
//             alt={`Slide ${index + 1}`}
//             width={200}
//             height={500}
//             objectFit="cover"
//           />
//           <button
//             onClick={prevImage}
//             className={`${style.sliderButton} ${style.prev}`}
//           >
//             &#10094;
//           </button>
//           <button
//             onClick={nextImage}
//             className={`${style.sliderButton} ${style.next}`}
//           >
//             &#10095;
//           </button>
//         </div>
//       </section>
//     </div>
//   );
// }


'use client';

import React, { useEffect, useState } from 'react';
import style from '@/app/Components/Content/Content.module.css';

const HERO_VIDEO = '/image-contact/hero.mp4';
const SMALL_HERO_VIDEO = '/image-contact/smallHero.mp4';

export default function Content() {
  const [videoSrc, setVideoSrc] = useState(HERO_VIDEO);

  useEffect(() => {
    const video = () => (window.innerWidth < 760 ? SMALL_HERO_VIDEO : HERO_VIDEO);
    setVideoSrc(video());

    window.addEventListener('resize', video);
    return () => window.removeEventListener('resize', video);
  }, []);

  return (
    <section className={style.contentSection}>
      <div className={style.heroContent}>
        <p className={style.contentTitle}>MR•APPLE</p>

        <div className={style.VideoContainer}>
          <video
            className={style.Video}
            autoPlay
            muted
            playsInline
            preload="auto"
            key={videoSrc}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>
      </div>

      {/* <div className={style.heroCta} id="cta">
        <a href="#highlights" className={style.heroButton}>
          Buy
        </a>
        <p className={style.heroPriceInfo}>From $199/month or $999</p>
      </div> */}
    </section>
  );
}
