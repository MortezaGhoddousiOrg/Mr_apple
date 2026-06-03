"use client";

import { useState, useEffect, useMemo } from "react";
import style from "@/app/Category/[Category]/page.module.css";
import { useParams } from "next/navigation";
import Card from "@/app/CardPage/Card";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CategoryTabFeature from "@/app/CategoryTabFeature/CategoryTabFeature";
import { title } from "framer-motion/client";

export default function Category() {
  const params = useParams();
  const rawCategory = params?.Category;
  const Category = rawCategory ? decodeURIComponent(rawCategory).trim() : "";

  const router = useRouter();

  // const [product, setProduct] = useState([
  //   {
  //     id: "iphone",
  //     image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //     titlefa: "آیفون",
  //     titleEn: "iPhone",
  //     p: "قیمت مناسب برای خرید انواع گوشی‌های آیفون اپل از طریق لینک‌های زیر ممکن شده است. آیفون‌ها با طراحی مدرن، امکانات بی‌نظیر در دوربین و صفحه نمایش با کیفیت عالی، تجربه‌ای متفاوت در دنیای تلفن‌های هوشمند ارائه می‌دهند. قدرت پردازش، امنیت بالا و سیستم‌عامل خاص آیفون، این گوشی‌ها را به گزینه‌ای ایده‌آل برای کاربران حرفه‌ای و عادی تبدیل کرده است.",
  //     item: [
  //       {
  //         id: 101,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 15 پرو",
  //         description:
  //           "دوربین پیشرفته، پردازنده A17 Bionic، نمایشگر ProMotion.",
  //         price: 98000000,
  //       },
  //       {
  //         id: 102,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 15",
  //         description: "دوربین اصلی 48MP، Dynamic Island، رنگ‌های متنوع.",
  //         price: 48000000,
  //       },
  //       {
  //         id: 103,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 14 پرو",
  //         description:
  //           "فناوری ProMotion، Always-On display، سیستم دوربین حرفه‌ای.",
  //         price: 50000000,
  //       },
  //       {
  //         id: 104,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 14",
  //         description: "دوربین دوگانه عالی، عمر باتری طولانی، مقاومت بالا.",
  //         price: 43000000,
  //       },
  //       {
  //         id: 105,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 13 پرو",
  //         description: "دوربین سه گانه، پردازنده A15 Bionic، نمایشگر 120Hz.",
  //         price: 47000000,
  //       },
  //       {
  //         id: 106,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 13",
  //         description: "عملکرد فوق‌العاده، حالت سینمایی در فیلم‌برداری.",
  //         price: 40000000,
  //       },
  //       {
  //         id: 107,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون SE (نسل سوم)",
  //         description: "تراشه A15 Bionic در بدنه کلاسیک، قیمت مناسب.",
  //         price: 25000000,
  //       },
  //       {
  //         id: 108,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 12",
  //         description: "طراحی لبه تخت، پشتیبانی از 5G، صفحه نمایش OLED.",
  //         price: 35000000,
  //       },
  //     ],
  //     categoryTab: [
  //       {
  //         imageTab: "/image-category-iphone/IMG_SEGMENT_20260519_121552.png",
  //         titleTab: "آیفون 17 ",
  //         path: "آیفون 17 ",
  //       },
  //       {
  //         imageTab: "/image-category-iphone/IMG_SEGMENT_20260519_121523.png",
  //         titleTab: "آیفون 16",
  //         path: "آیفون 16",
  //       },
  //       {
  //         imageTab: "/image-category-iphone/IMG_SEGMENT_20260519_121515.png",
  //         titleTab: "آیفون 15",
  //         path: "آیفون 15",
  //       },
  //       {
  //         imageTab: "/image-category-iphone/IMG_SEGMENT_20260519_121515.png",
  //         titleTab: "آیفون 14",
  //         path: "آیفون 14",
  //       },
  //       {
  //         imageTab: "/image-category-iphone/IMG_SEGMENT_20260519_121523.png",
  //         titleTab: "آیفون 13",
  //         path: "آیفون 13",
  //       },
  //     ],
  //   },

  //   {
  //     id: "accessories",
  //     image:
  //       "/image-category/anyland-high-quality-clear-case-iphone-17-magsafe-cover.png",
  //     titlefa: "لوازم جانبی",
  //     titleEn: "Accessories",
  //     p: "جدیدترین مدل‌های آیپد با دسته‌ای از امکانات پیشرفته، طراحی سبک و قابلیت‌های منحصر به فرد، راه حلی عالی برای کار، تحصیل و سرگرمی‌هایتان هستند. آیپدها با صفحه‌نمایش Retina و پردازنده قدرتمند، تجربه‌ای بی‌نظیر در تماشای محتوا و انجام امور روزمره برایتان فراهم می‌کنند.",
  //     item: [
  //       {
  //         id: 201,
  //         image:
  //           "image-category-accessories/anyland-high-quality-clear-case-iphone-17-magsafe-cover.png",
  //         title: "شارژر بی‌سیم MagSafe اپل",
  //         description: "شارژ سریع و آسان با اتصال مغناطیسی.",
  //         price: 35000000,
  //       },
  //       {
  //         id: 202,
  //         image: "/image-category/whoop_peek11.png",
  //         title: "ایرپاد پرو (نسل دوم)",
  //         description: "حذف نویز فعال، صدای فضایی، مقاومت در برابر آب.",
  //         price: 35000000,
  //       },
  //       {
  //         id: 203,
  //         image:
  //           "/image-category/anyland-high-quality-clear-case-iphone-17-magsafe-cover.png",
  //         title: "بند سیلیکونی اپل واچ",
  //         description: "نرم، بادوام و راحت، در رنگ‌های متنوع.",
  //         price: 35000000,
  //       },
  //       {
  //         id: 204,
  //         image:
  //           "/image-category/apple-40w-usb-c-dynamic-power-adapter-with-60w-max-uk-3pin.png",
  //         title: "کابل USB-C به لایتنینگ (1 متر)",
  //         description: "مناسب برای شارژ و همگام‌سازی دستگاه‌های اپل.",
  //         price: 35000000,
  //       },
  //       {
  //         id: 205,
  //         image:
  //           "/image-category/anyland-high-quality-clear-case-iphone-17-magsafe-cover.png",
  //         title: "کاور شفاف آیفون 15 پرو",
  //         description: "محافظت از گوشی بدون پنهان کردن طراحی آن.",
  //         price: 35000000,
  //       },
  //       {
  //         id: 206,
  //         image:
  //           "/image-category/apple-40w-usb-c-dynamic-power-adapter-with-60w-max-uk-3pin.png",
  //         title: "آداپتور برق 20 وات USB-C",
  //         description: "شارژ سریع و بهینه برای آیفون و آیپد.",
  //         price: 35000000,
  //       },
  //       {
  //         id: 207,
  //         image:
  //           "/image-category/anyland-high-quality-clear-case-iphone-17-magsafe-cover.png",
  //         title: "کیبورد مجیک اپل",
  //         description: "تجربه تایپ راحت برای آیپد و مک.",
  //         price: 35000000,
  //       },
  //       {
  //         id: 208,
  //         image: "/image-category/whoop_peek11.png",
  //         title: "ایر تگ اپل",
  //         description: "ردیابی آسان وسایل گمشده با شبکه Find My.",
  //         price: 35000000,
  //       },
  //     ],
  //     categoryTab: [
  //       {
  //         imageTab:
  //           "/image-category-accessories/apple-usb-c-to-lightning-cable-1m-3.png",
  //         titleTab: "کابل شارژ type-c",
  //         path: "کابل شارژ type-c",
  //       },
  //       {
  //         imageTab: "/image-category-accessories/whoop_peek11.png",
  //         titleTab: "بند اپل واچ سیلیکونی",
  //         path: "بند اپل واچ سیلیکونی",
  //       },
  //       {
  //         imageTab:
  //           "/image-category-accessories/apple-40w-usb-c-dynamic-power-adapter-with-60w-max-uk-3pin.png",
  //         titleTab: "آدابتور شارژ",
  //         path: "آدابتور شارژ",
  //       },
  //       {
  //         imageTab:
  //           "/image-category-accessories/apple-usb-c-to-lightning-cable-1m-3.png",
  //         titleTab: "کابل شارژ type-c",
  //         path: "کابل شارژ type-c",
  //       },
  //       {
  //         imageTab:
  //           "/image-category-accessories/anyland-high-quality-clear-case-iphone-17-magsafe-cover.png",
  //         titleTab: "کاور شفاف آیفون ",
  //         path: "کاور شفاف آیفون ",
  //       },
  //       {
  //         imageTab:
  //           "/image-category-accessories/apple-40w-usb-c-dynamic-power-adapter-with-60w-max-uk-3pin.png",
  //         titleTab: "آدابتور شارژ",
  //         path: "آدابتور شارژ",
  //       },
  //     ],
  //   },

  //   {
  //     // id: "used",
  //     image: "/image-category/apple-iphone-15-pro-first-image.png",
  //     titlefa: "کارکرده",
  //     titleEn: "usedProducts",
  //     p: "اپل واچ‌ها با امکانات سلامت، تمرین و ارتباطات، همگام با سبک زندگی فعال و مدرن طراحی شده‌اند. ساعت‌های هوشمند اپل، قابلیت‌های بی‌نظیری در پیگیری فعالیت‌های ورزشی، کنترل سلامت و دریافت نوتیفیکیشن‌ها دارند و تجربه‌ای شخصی و کاربردی را برای کاربر به ارمغان می‌آورند.",
  //     item: [
  //       {
  //         id: 301,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 11 (کارکرده)",
  //         description: "در حد نو، بدون خط و خش، باتری 90%.",
  //         price: 35000000,
  //       },
  //       {
  //         id: 302,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیپد ایر 4 (کارکرده)",
  //         description: "صفحه نمایش سالم، عملکرد عالی، مناسب طراحی.",
  //         price: 35000000,
  //       },
  //       {
  //         id: 303,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "مک‌بوک پرو 13 اینچ (کارکرده)",
  //         description: "پردازنده Core i5، حافظه 256GB SSD، مناسب امور روزمره.",
  //         price: 35000000,
  //       },
  //       {
  //         id: 304,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "ایرپاد نسل 2 (کارکرده)",
  //         description: "صدای با کیفیت، اتصال سریع، کیس شارژ معمولی.",
  //         price: 35000000,
  //       },
  //       {
  //         id: 305,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون XR (کارکرده)",
  //         description: "بدنه کمیاب، باتری سالم، صفحه نمایش LCD.",
  //         price: 35000000,
  //       },
  //       {
  //         id: 306,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "اپل واچ SE (کارکرده)",
  //         description: "سایز 44mm، صفحه نمایش سالم، همراه با بند.",
  //         price: 35000000,
  //       },
  //       {
  //         id: 307,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیپد مینی 5 (کارکرده)",
  //         description: "کوچک و قابل حمل، مناسب مطالعه و وب‌گردی.",
  //         price: 35000000,
  //       },
  //       {
  //         id: 308,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "هوم‌پاد (کارکرده)",
  //         description: "صدای فراگیر، دستیار صوتی Siri.",
  //         price: 35000000,
  //       },
  //     ],
  //     categoryTab: [
  //       {
  //         imageTab: "/image-category/apple-iphone-15-pro-first-image.png",
  //         titleTab: "آیفون 17 مکس ",
  //         path: "iphone-17-max",
  //       },
  //       {
  //         imageTab: "/image-category/apple-iphone-15-pro-first-image.png",
  //         titleTab: "آیفون 17 پرو ",
  //         path: "iphone-17-pro",
  //       },
  //       {
  //         imageTab: "/image-category/apple-iphone-15-pro-first-image.png",
  //         titleTab: "آیفون 17 نرمال ",
  //         path: "iphone-17-normal",
  //       },
  //       {
  //         imageTab: "/image-category/apple-iphone-15-pro-first-image.png",
  //         titleTab: "آیفون 16 مکس ",
  //         path: "iphone-16-max",
  //       },
  //       {
  //         imageTab: "/image-category/apple-iphone-15-pro-first-image.png",
  //         titleTab: "آیفون 16 پرو ",
  //         path: "iphone-16-pro",
  //       },
  //       {
  //         imageTab: "/image-category/apple-iphone-15-pro-first-image.png",
  //         titleTab: "آیفون 16 نرمال ",
  //         path: "iphone-16-normal",
  //       },
  //     ],
  //   },

  //   {
  //     // id: "Ipad",
  //     image: "/image-services/apple-ipad-pro-m4-13-inch-3.png",
  //     titlefa: "آیپد",
  //     titleEn: "iPad",
  //     p: "جدیدترین مدل‌های آیپد با دسته‌ای از امکانات پیشرفته، طراحی سبک و قابلیت‌های منحصر به فرد، راه حلی عالی برای کار، تحصیل و سرگرمی‌هایتان هستند. آیپدها با صفحه‌نمایش Retina و پردازنده قدرتمند، تجربه‌ای بی‌نظیر در تماشای محتوا و انجام امور روزمره برایتان فراهم می‌کنند.",
  //     item: [
  //       {
  //         id: 401,
  //         image: "/image-category/apple-ipad-air-m3-11-inch-8.png",
  //         title: "آیپد پرو 12.9 اینچ (M2)",
  //         description:
  //           "قدرتمندترین آیپد، نمایشگر Liquid Retina XDR، پشتیبانی از Apple Pencil 2.",
  //         price: 35000000,
  //       },
  //       {
  //         id: 402,
  //         image: "/image-category/apple-ipad-11-inch-11th-7.png",
  //         title: "آیپد ایر (M2)",
  //         description: "پردازنده M2، طراحی باریک و سبک، نمایشگر Liquid Retina.",
  //         price: 35000000,
  //       },
  //       {
  //         id: 403,
  //         image: "/image-category/apple-ipad-11-inch-11th-7.png",
  //         title: "آیپد نسل دهم",
  //         description:
  //           "نمایشگر بزرگ 10.9 اینچ، پشتیبانی از Apple Pencil (USB-C).",
  //         price: 35000000,
  //       },
  //       {
  //         id: 404,
  //         image: "/image-category/apple-ipad-11-inch-11th-7.png",
  //         title: "آیپد مینی (نسل ششم)",
  //         description: "کامپکت و قدرتمند، پردازنده A15 Bionic.",
  //         price: 35000000,
  //       },
  //       {
  //         id: 405,
  //         image: "/image-category/apple-ipad-air-m3-11-inch-8.png",
  //         title: "آیپد پرو 11 اینچ (M2)",
  //         description: "سبک و قابل حمل، نمایشگر Liquid Retina، عملکرد عالی.",
  //         price: 35000000,
  //       },
  //       {
  //         id: 406,
  //         image: "/image-category/apple-ipad-air-m3-11-inch-8.png",
  //         title: "آیپد ایر (M1)",
  //         description: "تراشه M1، نمایشگر 10.9 اینچ Liquid Retina.",
  //         price: 35000000,
  //       },
  //       {
  //         id: 407,
  //         image: "/image-category/apple-ipad-11-inch-11th-7.png",
  //         title: "آیپد نسل نهم",
  //         description: "نمایشگر 10.2 اینچ Retina، پردازنده A13 Bionic.",
  //         price: 35000000,
  //       },
  //       {
  //         id: 408,
  //         image: "/image-category/apple-ipad-air-m3-11-inch-8.png",
  //         title: "ترکیب آیپد با کیبورد مجیک",
  //         description: "تبدیل آیپد به یک لپ‌تاپ قدرتمند.",
  //         price: 35000000,
  //       },
  //     ],
  //     categoryTab: [
  //       {
  //         imageTab: "/image-category/apple-iphone-15-pro-first-image.png",
  //         titleTab: "آیفون 17 مکس ",
  //         path: "iphone-17-max",
  //       },
  //       {
  //         imageTab: "/image-category/apple-iphone-15-pro-first-image.png",
  //         titleTab: "آیفون 17 پرو ",
  //         path: "iphone-17-pro",
  //       },
  //       {
  //         imageTab: "/image-category/apple-iphone-15-pro-first-image.png",
  //         titleTab: "آیفون 17 نرمال ",
  //         path: "iphone-17-normal",
  //       },
  //       {
  //         imageTab: "/image-category/apple-iphone-15-pro-first-image.png",
  //         titleTab: "آیفون 16 مکس ",
  //         path: "iphone-16-max",
  //       },
  //       {
  //         imageTab: "/image-category/apple-iphone-15-pro-first-image.png",
  //         titleTab: "آیفون 16 پرو ",
  //         path: "iphone-16-pro",
  //       },
  //       {
  //         imageTab: "/image-category/apple-iphone-15-pro-first-image.png",
  //         titleTab: "آیفون 16 نرمال ",
  //         path: "iphone-16-normal",
  //       },
  //     ],
  //   },
  // ]);

  const [categoryChild, setCategoryClild] = useState([
    {
      id: 1,
      title: "iPhoe17",
      image: "/image-category-iphone/IMG_SEGMENT_20260519_121552.png",
    },
    {
      id: 2,
      title: "iPhoe16",
      image: "/image-category-iphone/IMG_SEGMENT_20260519_121523.png",
    },
    {
      id: 3,
      title: "iPhoe15",
      image: "/image-category-iphone/IMG_SEGMENT_20260519_121515.png",
    },
  ]);

  const [product, setProduct] = useState([
    {
      id: 1,
      images: [{ url: "/image-services/apple-iphone-17-pro-max-cover.png" }],
      category: {
        id: 2,
        parent: { id: 1, title: "Mobile", image: null },
      },
      category_child_id: 2,
      category_parent_id: 1,
      product_code: "IP14",
      name: "iPhone 14",
      buy_price: "1000000",
      sell_price: "1500000",
      descriptions:
        "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
      status: "active",
    },
    {
      id: 2,
      images: [{ url: "/image-services/apple-iphone-17-pro-max-cover.png" }],
      category: {
        id: 2,
        parent: { id: 1, title: "Accessories", image: null },
      },
      category_child_id: 2,
      category_parent_id: 1,
      product_code: "IP14",
      name: "iPhone 14",
      buy_price: "1000000",
      sell_price: "1500000",
      descriptions:
        "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
      status: "active",
    },
    {
      id: 3,
      images: [{ url: "/image-services/apple-iphone-17-pro-max-cover.png" }],
      category: {
        id: 2,
        parent: { id: 1, title: "UsedProducts", image: null },
      },
      category_child_id: 2,
      category_parent_id: 1,
      product_code: "IP14",
      name: "iPhone 14",
      buy_price: "1000000",
      sell_price: "1500000",
      descriptions:
        "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
      status: "active",
    },
    {
      id: 4,
      images: [{ url: "/image-services/apple-iphone-17-pro-max-cover.png" }],
      category: {
        id: 2,
        parent: { id: 1, title: "Ipad", image: null },
      },
      category_child_id: 2,
      category_parent_id: 1,
      product_code: "IP14",
      name: "iPhone 14",
      buy_price: "1000000",
      sell_price: "1500000",
      descriptions:
        "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
      status: "active",
    },
    {
      id: 5,
      images: [{ url: "/image-services/apple-iphone-17-pro-max-cover.png" }],
      category: {
        id: 2,
        parent: { id: 1, title: "Ipad", image: null },
      },
      category_child_id: 2,
      category_parent_id: 1,
      product_code: "IP14",
      name: "iPhone 15",
      buy_price: "1000000",
      sell_price: "1500000",
      descriptions:
        "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
      status: "notactive",
    },
  ]);

  // useEffect(() => {
  //   const axioshome = async () => {
  //     try {
  //       const response = await api.get(`/category/${Category}`);
  //       console.log(response.data);
  //       setProduct(response.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   axioshome();
  // }, []);

  // const filter = product.filter(
  //   (item) => item.category.parent.title === Category,
  // );

  // if (!Category || Category.length === 0 ) {
  //   return (
  //         <div className={style.box}>
  //           <h2 className={style.title}>هیچ دسته بندی برای محصولات وجود نداره</h2>
  //           <p className={style.description}>
  //             متأسفانه هیچ محصولی برای نمایش وجود ندارد. لطفاً کمی بعد دوباره تلاش
  //             کنید یا فیلترهای جستجو را تغییر دهید.
  //           </p>
  //         </div>
  //       );
  // }

  // const filter = product.filter((title) => title.category.parent.title == Category);

  const cardData = product.map((item) => ({
    id: item.id,
    image: item.images?.[0]?.url,
    title: item.name,
    description: item.descriptions,
    price: item.sell_price,
  }));

  const filtered = useMemo(() => {
    if (!Category) return [];
    const cat = String(Category).trim();
    if (!cat) return [];
    return product.filter((item) => item.category?.parent?.title === cat);
  }, [Category, product]);

  // اگر Category خالی بود یا در دیتای ما وجود نداشت (یعنی filtered خالی شد)
  if (
    !Category ||
    String(Category).trim().length === 0 ||
    filtered.length === 0
  ) {
    return (
      <div className={style.box}>
        <h2 className={style.title}>هیچ دسته بندی برای محصولات وجود نداره</h2>
        <p className={style.description}>
          متأسفانه هیچ محصولی برای نمایش وجود ندارد. لطفاً کمی بعد دوباره تلاش
          کنید یا فیلترهای جستجو را تغییر دهید.
        </p>
      </div>
    );
  }

  return (
    <div className={style.categoryBody}>
      {filtered.map((item, index) => (
        <aside className={style.category} key={index}>
          <header className={style.categoryHeader}>
            <div className={style.categoryBox}>
              <h1 className={style.categoryTitle}>
                {item.category.parent.title}
              </h1>
              <p className={style.categoryDescription}>{item.descriptions}</p>

              <div className={style.categoryFeatures}>
                <div className={style.categoryFeatureItem}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>تنوع بالای محصولات</span>
                </div>

                <div className={style.categoryFeatureItem}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>کیفیت اورجینال</span>
                </div>

                <div className={style.categoryFeatureItem}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>انتخاب سریع و مطمئن</span>
                </div>
              </div>
            </div>

            <div className={style.categoryImageContainer}>
              <Image
                className={style.categoryImage}
                src={item.images?.[0]?.url}
                alt="category-image"
                width={400}
                height={400}
              />
            </div>
          </header>
          <CategoryTabFeature
            Tab={categoryChild}
            data={cardData}
            // onClick={() => router.push(`${.cate}`)}
          />
        </aside>
      ))}
    </div>
  );
}
