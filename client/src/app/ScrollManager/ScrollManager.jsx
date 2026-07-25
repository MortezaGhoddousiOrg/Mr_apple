"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollManager() {
  const pathname = usePathname();

  useEffect(() => {
    const saveScroll = () => {
      sessionStorage.setItem(
        `scroll-${pathname}`,
        window.scrollY.toString()
      );
    };

    window.addEventListener("scroll", saveScroll);

    return () => {
      saveScroll();
      window.removeEventListener("scroll", saveScroll);
    };
  }, [pathname]);

  useEffect(() => {
    const navigationEntries =
      performance.getEntriesByType("navigation");

    const navigationType =
      navigationEntries.length > 0
        ? navigationEntries[0].type
        : "navigate";

    if (navigationType === "back_forward") {
      const savedScroll = sessionStorage.getItem(`scroll-${pathname}`);

      if (savedScroll) {
        requestAnimationFrame(() => {
          window.scrollTo({
            top: Number(savedScroll),
            behavior: "instant",
          });
        });

        return;
      }
    }

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}