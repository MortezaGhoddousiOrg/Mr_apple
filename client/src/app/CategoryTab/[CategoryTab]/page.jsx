"use client";

import style from "@/app/CategoryTab/[CategoryTab]/page.module.css";
import { useParams } from "next/navigation";
import { useState } from "react";
import Card from "@/app/CardPage/Card";

export default function CategoryTab() {
  const [iphones] = useState([
    {
      id: "iphones",
      image: "",
      titlefa: "آیفون ۱۷",
      titleEn: "iphone 17",
      description:
        "اپل واچ‌ها با امکانات سلامت، تمرین و ارتباطات، همگام با سبک زندگی فعال و مدرن طراحی شده‌اند. ساعت‌های هوشمند اپل، قابلیت‌های بی‌نظیری در پیگیری فعالیت‌های ورزشی، کنترل سلامت و دریافت نوتیفیکیشن‌ها دارند و تجربه‌ای شخصی و کاربردی را برای کاربر به ارمغان می‌آورند.",
      iphone17: [
        {
          id: 1,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 17 پرو",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 98000000,
        },
        {
          id: 2,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 17",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 48000000,
        },
        {
          id: 3,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 17 پرو",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 50000000,
        },
        {
          id: 4,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 17",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 43000000,
        },
        {
          id: 5,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفو17 پرو",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 47000000,
        },
        {
          id: 6,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 17",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 40000000,
        },
        {
          id: 7,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 17 (نسل سوم)",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 25000000,
        },
        {
          id: 8,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 17",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 35000000,
        },
      ],

      iphone16: [
        {
          id: 1,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 16 پرو",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 98000000,
        },
        {
          id: 2,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 16",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 48000000,
        },
        {
          id: 3,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 16 پرو",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 50000000,
        },
        {
          id: 4,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 16",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 43000000,
        },
        {
          id: 5,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 16 پرو",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 47000000,
        },
        {
          id: 6,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 16",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 40000000,
        },
        {
          id: 7,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 16 (نسل سوم)",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 25000000,
        },
        {
          id: 8,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 16",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 35000000,
        },
      ],

      iphone15: [
        {
          id: 1,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 15 پرو",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 98000000,
        },
        {
          id: 2,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 15",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 48000000,
        },
        {
          id: 3,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 15 پرو",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 50000000,
        },
        {
          id: 4,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 15",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 43000000,
        },
        {
          id: 5,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 15 پرو",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 47000000,
        },
        {
          id: 6,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 15",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 40000000,
        },
        {
          id: 7,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 15 (نسل سوم)",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 25000000,
        },
        {
          id: 8,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 15",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 35000000,
        },
      ],

      iphone14: [
        {
          id: 1,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 14 پرو",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 98000000,
        },
        {
          id: 2,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 14",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 48000000,
        },
        {
          id: 3,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 14 پرو",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 50000000,
        },
        {
          id: 4,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 14",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 43000000,
        },
        {
          id: 5,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفو14 پرو",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 47000000,
        },
        {
          id: 6,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 14",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 40000000,
        },
        {
          id: 7,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 14 (نسل سوم)",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 25000000,
        },
        {
          id: 8,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 14",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 35000000,
        },
      ],

      iphone13: [
        {
          id: 1,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 13 پرو",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 98000000,
        },
        {
          id: 2,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 13",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 48000000,
        },
        {
          id: 3,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 13 پرو",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 50000000,
        },
        {
          id: 4,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 13",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 43000000,
        },
        {
          id: 5,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 13 پرو",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 47000000,
        },
        {
          id: 6,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 13",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 40000000,
        },
        {
          id: 7,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 13 (نسل سوم)",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 25000000,
        },
        {
          id: 8,
          image: "/image-services/apple-iphone-17-pro-max-cover.png",
          title: "آیفون 13",
          description:
            "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
          price: 35000000,
        },
      ],
    },

    
  ]);

  const { CategoryTab } = useParams();
  console.log(CategoryTab);

  return (
    <div>
      {/* <h1 className={style.h1}>salam</h1> */}

      {iphones.map((item, index) => (
        <div key={index}>
          <header>
            <div>
              <h1>
                {item.titlefa} | {item.titleEn}
              </h1>
              <p>{item.description}</p>
            </div>
          </header>

          <Card product={item.iphone17} />
        </div>
      ))}
    </div>
  );
}
