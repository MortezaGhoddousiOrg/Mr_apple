"use client";

import Image from "next/image";
// import Header from "@/app/Components/Header/Header";
import Content from "@/app/Components/Content/Content";
import Dashboard from "@/app/Components/Dashboard/Dashboard";
import InfoSection from "./Components/InfoSection/InfoSection";
import Service from "@/app/Components/Service/Service";
import ServiceSpecial from "@/app/Components/ServiceSpecial/ServiceSpecial";
import { api } from "./config";
import { MEDIA_URL } from "@/app/config";
// import Footer from "./Components/Footer/Footer";
// import style from "@/"
// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import FeaturedProduct from "./Components/FeaturedProducts/FeaturedProducts";

export default function Home() {
  const router = useRouter();

  // const [data, setData] = useState([
  //   {
  //     id: 1,
  //     image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //     title: "آیفون 17 پرو مکس",
  //     description:
  //       "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //     price: 1000000000,
  //   },
  //   {
  //     id: 2,
  //     image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //     title: "آیفون 17 پرو مکس",
  //     description:
  //       "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //     price: 1000000000,
  //   },
  //   {
  //     id: 3,
  //     image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //     title: "آیفون 17 پرو مکس",
  //     description:
  //       "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //     price: 1000000000,
  //   },
  //   {
  //     id: 4,
  //     image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //     title: "آیفون 17 پرو مکس",
  //     description:
  //       "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //     price: 1000000000,
  //   },
  //   {
  //     id: 5,
  //     image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //     title: "آیفون 17 پرو مکس",
  //     description:
  //       "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //     price: 1000000000,
  //   },
  //   {
  //     id: 6,
  //     image: "/image-services/apple-iphone-17-pro-max-cover.png",
  //     title: "آیفون 17 پرو مکس",
  //     description:
  //       "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
  //     price: 1000000000,
  //   },
  // ]);

  const [product, setProduct] = useState([
    // {
    //   id: 1,
    //   images: [{ url: "/image-services/apple-iphone-17-pro-max-cover.png" }],
    //   category: {
    //     id: 2,
    //     parent: { id: 1, title: "Mobile", image: null },
    //   },
    //   category_child_id: 2,
    //   category_parent_id: 1,
    //   product_code: "IP14",
    //   name: "iPhone 14",
    //   buy_price: "1000000",
    //   sell_price: "1500000",
    //   descriptions:
    //     "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
    //   status: "active",
    // },
    // {
    //   id: 2,
    //   images: [{ url: "/image-services/apple-iphone-17-pro-max-cover.png" }],
    //   category: {
    //     id: 2,
    //     parent: { id: 1, title: "Accessories", image: null },
    //   },
    //   category_child_id: 2,
    //   category_parent_id: 1,
    //   product_code: "IP14",
    //   name: "iPhone 14",
    //   buy_price: "1000000",
    //   sell_price: "1500000",
    //   descriptions:
    //     "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
    //   status: "active",
    // },
    // {
    //   id: 3,
    //   images: [{ url: "/image-services/apple-iphone-17-pro-max-cover.png" }],
    //   category: {
    //     id: 2,
    //     parent: { id: 1, title: "UsedProducts", image: null },
    //   },
    //   category_child_id: 2,
    //   category_parent_id: 1,
    //   product_code: "IP14",
    //   name: "iPhone 14",
    //   buy_price: "1000000",
    //   sell_price: "1500000",
    //   descriptions:
    //     "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
    //   status: "active",
    // },
    // {
    //   id: 4,
    //   images: [{ url: "/image-services/apple-iphone-17-pro-max-cover.png" }],
    //   category: {
    //     id: 2,
    //     parent: { id: 1, title: "Ipad", image: null },
    //   },
    //   category_child_id: 2,
    //   category_parent_id: 1,
    //   product_code: "IP14",
    //   name: "iPhone 14",
    //   buy_price: "1000000",
    //   sell_price: "1500000",
    //   descriptions:
    //     "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
    //   status: "active",
    // },
    // {
    //   id: 5,
    //   images: [{ url: "/image-services/apple-iphone-17-pro-max-cover.png" }],
    //   category: {
    //     id: 2,
    //     parent: { id: 1, title: "Ipad", image: null },
    //   },
    //   category_child_id: 2,
    //   category_parent_id: 1,
    //   product_code: "IP14",
    //   name: "iPhone 15",
    //   buy_price: "1000000",
    //   sell_price: "1500000",
    //   descriptions:
    //     "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
    //   status: "notactive",
    // },
  ]);

  useEffect(() => {
    const axioshome = async () => {
      try {
        const response = await api.get("/api/catalog/product/home");
        console.log("دیتا", response.data);
        setProduct(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    axioshome();
  }, []);

  const title = "آخرین محصولات";
  const titleSpecial = "محصولات ویژه";

  const data = product.map((item) => ({
    id: item.id,
    image: `${MEDIA_URL}${
      item.images?.find((img) => img.is_main)?.image || ""
    }`,
    title: item.name,
    category: item.category,
    description: item.descriptions,
    price: item.sell_price,
    status: item.status,

    
  }));

  return (
    <div>
      <Content />
      <FeaturedProduct />
      <Dashboard />

      <ServiceSpecial
        data={data}
        title={titleSpecial}
        button="بیشتر"
        onMoreClick={() => router.push("/Products")}
      />
      <InfoSection />
      <Service
        data={data}
        title={title}
        button="بیشتر"
        onMoreClick={() => router.push("/Products")}
      />
    </div>
  );
}
