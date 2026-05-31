"use client";

import Image from "next/image";
import style from "@/app/CategoryTabFeature/CategoryTabFeature.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Card from "../CardPage/Card";
import axios from "axios";
import { api } from "../config";

export default function CategoryTabFeature({ Tab }) {
  const router = useRouter();

  // const [iphones] = useState([
  //   {
  //     id: "iphones",
  //     image: "",
  //     titlefa: "آیفون ۱۷",
  //     titleEn: "iphone 17",
  //     description:
  //       "اپل واچ‌ها با امکانات سلامت، تمرین و ارتباطات، همگام با سبک زندگی فعال و مدرن طراحی شده‌اند. ساعت‌های هوشمند اپل، قابلیت‌های بی‌نظیری در پیگیری فعالیت‌های ورزشی، کنترل سلامت و دریافت نوتیفیکیشن‌ها دارند و تجربه‌ای شخصی و کاربردی را برای کاربر به ارمغان می‌آورند.",
  //     iphone17: [
  //       {
  //         id: 1,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 17 پرو",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 98000000,
  //       },
  //       {
  //         id: 2,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 17",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 48000000,
  //       },
  //       {
  //         id: 3,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 17 پرو",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 50000000,
  //       },
  //       {
  //         id: 4,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 17",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 43000000,
  //       },
  //       {
  //         id: 5,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفو17 پرو",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 47000000,
  //       },
  //       {
  //         id: 6,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 17",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 40000000,
  //       },
  //       {
  //         id: 7,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 17 (نسل سوم)",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 25000000,
  //       },
  //       {
  //         id: 8,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 17",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 35000000,
  //       },
  //     ],

  //     iphone16: [
  //       {
  //         id: 1,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 16 پرو",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 98000000,
  //       },
  //       {
  //         id: 2,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 16",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 48000000,
  //       },
  //       {
  //         id: 3,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 16 پرو",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 50000000,
  //       },
  //       {
  //         id: 4,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 16",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 43000000,
  //       },
  //       {
  //         id: 5,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 16 پرو",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 47000000,
  //       },
  //       {
  //         id: 6,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 16",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 40000000,
  //       },
  //       {
  //         id: 7,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 16 (نسل سوم)",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 25000000,
  //       },
  //       {
  //         id: 8,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 16",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 35000000,
  //       },
  //     ],

  //     iphone15: [
  //       {
  //         id: 1,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 15 پرو",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 98000000,
  //       },
  //       {
  //         id: 2,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 15",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 48000000,
  //       },
  //       {
  //         id: 3,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 15 پرو",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 50000000,
  //       },
  //       {
  //         id: 4,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 15",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 43000000,
  //       },
  //       {
  //         id: 5,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 15 پرو",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 47000000,
  //       },
  //       {
  //         id: 6,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 15",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 40000000,
  //       },
  //       {
  //         id: 7,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 15 (نسل سوم)",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 25000000,
  //       },
  //       {
  //         id: 8,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 15",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 35000000,
  //       },
  //     ],

  //     iphone14: [
  //       {
  //         id: 1,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 14 پرو",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 98000000,
  //       },
  //       {
  //         id: 2,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 14",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 48000000,
  //       },
  //       {
  //         id: 3,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 14 پرو",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 50000000,
  //       },
  //       {
  //         id: 4,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 14",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 43000000,
  //       },
  //       {
  //         id: 5,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفو14 پرو",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 47000000,
  //       },
  //       {
  //         id: 6,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 14",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 40000000,
  //       },
  //       {
  //         id: 7,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 14 (نسل سوم)",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 25000000,
  //       },
  //       {
  //         id: 8,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 14",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 35000000,
  //       },
  //     ],

  //     iphone13: [
  //       {
  //         id: 1,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 13 پرو",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 98000000,
  //       },
  //       {
  //         id: 2,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 13",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 48000000,
  //       },
  //       {
  //         id: 3,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 13 پرو",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 50000000,
  //       },
  //       {
  //         id: 4,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 13",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 43000000,
  //       },
  //       {
  //         id: 5,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 13 پرو",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 47000000,
  //       },
  //       {
  //         id: 6,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 13",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 40000000,
  //       },
  //       {
  //         id: 7,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 13 (نسل سوم)",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 25000000,
  //       },
  //       {
  //         id: 8,
  //         image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //         title: "آیفون 13",
  //         description:
  //           "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //         price: 35000000,
  //       },
  //     ],
  //   },
  // ]);

  // const iphone13 = [
  //   {
  //     id: 1,
  //     image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //     title: "آیفون 13 پرو",
  //     description:
  //       "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //     price: 98000000,
  //   },
  //   {
  //     id: 2,
  //     image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //     title: "آیفون 13",
  //     description:
  //       "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //     price: 48000000,
  //   },
  //   {
  //     id: 3,
  //     image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //     title: "آیفون 13 پرو",
  //     description:
  //       "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //     price: 50000000,
  //   },
  //   {
  //     id: 4,
  //     image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //     title: "آیفون 13",
  //     description:
  //       "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //     price: 43000000,
  //   },
  //   {
  //     id: 5,
  //     image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //     title: "آیفون 13 پرو",
  //     description:
  //       "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //     price: 47000000,
  //   },
  //   {
  //     id: 6,
  //     image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //     title: "آیفون 13",
  //     description:
  //       "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //     price: 40000000,
  //   },
  //   {
  //     id: 7,
  //     image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //     title: "آیفون 13 (نسل سوم)",
  //     description:
  //       "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //     price: 25000000,
  //   },
  //   {
  //     id: 8,
  //     image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //     title: "آیفون 13",
  //     description:
  //       "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //     price: 35000000,
  //   },
  // ];

  const [productChild, setProductChild] = useState([
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
    },
    {
      id: 2,
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
    },
    {
      id: 3,
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
    },
    {
      id: 4,
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
    },
    {
      id: 5,
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
    },
  ]);

  const [id, setid] = useState();


  const [categoryId, setCategoryId] = useState(1);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const axiosProduct = async (id) => {
      try {
        const response = await api.get("/api/product", {
          params: { category_child_id: id },
        });

        setProducts(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    axiosProduct(categoryId);
  }, [categoryId]);

  const handleClick = (id) => {
    if (id === categoryId) return;
    setCategoryId(id);
  };


  // if (products.length === 0) {
  //   return (
  //     <div className={style.box}>
  //       <h2 className={style.title}>هیچ دسته بندی برای محصولات وجود نداره</h2>
  //       <p className={style.description}>
  //         متأسفانه هیچ محصولی برای نمایش وجود ندارد. لطفاً کمی بعد دوباره تلاش
  //         کنید یا فیلترهای جستجو را تغییر دهید.
  //       </p>
  //     </div>
  //   );
  // }

  const cardData = productChild.map((item) => ({
  id: item.id,
  image: item.images?.[0]?.url,
  title: item.name,
  description: item.descriptions,
  price: item.sell_price,
}));

  return (
    <div>
      <div className={style.categoryTab}>
        {Tab.map((item) => (
          <div
            key={item.id}
            className={style.containerTab}
            onClick={() => handleClick(item.id)}
          >
            <div className={style.tab}>
              <Image
                className={style.imageTab}
                src={item.image}
                alt={item.title}
                width={100}
                height={100}
              />
              <p className={style.titleTab}>{item.title}</p>
            </div>
          </div>
        ))}
      </div>

      <Card product={cardData} />
    </div>
  );
}
