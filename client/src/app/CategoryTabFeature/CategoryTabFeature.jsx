"use client";

import Image from "next/image";
import style from "@/app/CategoryTabFeature/CategoryTabFeature.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Card from "../CardPage/Card";

export default function CategoryTabFeature({ Tab }) {
  const router = useRouter();

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

  const iphone13 = [
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
  ];

  const [id, setid] = useState();

  // const handleCategory = (id) => {

  // }

  //  const categorys = iphones.filter((title) => title.titleEn == Category);
  // onClick={() => router.push(`/CategoryTab/${item.path}`)}

  const [selectedProducts, setSelectedProducts] = useState(
  iphones[0].iphone17
);

 const handleCategory = (categoryKey) => {
  if (!iphones || iphones.length === 0) {
    console.log("iphones خالی است");
    return;
  }

  const dataSource = iphones[0];
  const products = dataSource[categoryKey];

  console.log("کلید انتخاب‌شده:", categoryKey);
  console.log("مقدار پیدا شده:", products);

  if (Array.isArray(products)) {
    setSelectedProducts(products);
  } else {
    setSelectedProducts([]);
    console.warn("برای این کلید محصولی پیدا نشد");
  }
};

  return (
    <div>
      <div className={style.categoryTab}>
        {Tab.map((item, index) => (
          <div
            key={index}
            className={style.containerTab}
            // onClick={handleCategory(item.id)}
            //  onClick={() => handleCategory(item.titeEn)}
          >
            <div className={style.tab}>
              <Image
                className={style.imageTab}
                src={item.imageTab}
                alt=""
                width={100}
                height={100}
              />
              <p className={style.titleTab}>{item.titleTab}</p>
            </div>
          </div>
        ))}
      </div>
      <Card product={selectedProducts} />
    </div>
  );
}
