"use client"

import Image from "next/image";
import Header from "@/app/Components/Header/Header";
import Content from "@/app/Components/Content/Content";
import Dashboard from "@/app/Components/Dashboard/Dashboard";
import InfoSection from "./Components/InfoSection/InfoSection";
import Service from "@/app/Components/Service/Service";

import Footer from "./Components/Footer/Footer";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import FeaturedProduct from "./Components/FeaturedProducts/FeaturedProducts";

export default function Home() {
  const Router = useRouter();

  // const [category1Products, setCategory1Products] = useState([]);
  // const [category2Products, setCategory2Products] = useState([]);
  // const [category3Products, setCategory3Products] = useState([]);
  // const [category4Products, setCategory4Products] = useState([]);

  // useEffect(() => {
  //   const fetchHome = async () => {
  //     try {
  //       const res = await axios.get(
  //         "http://localhost:5000/api/products/limit6",
  //       );

  //       const data = res.data;

  //       const sorted = [...data].sort((a, b) => (a.rn ?? 0) - (b.rn ?? 0));

  //       setCategory1Products(
  //         sorted.filter((x) => x.category_id === 1).slice(0, 6),
  //       );
  //       setCategory2Products(
  //         sorted.filter((x) => x.category_id === 2).slice(0, 6),
  //       );
  //       setCategory3Products(
  //         sorted.filter((x) => x.category_id === 3).slice(0, 6),
  //       );
  //       setCategory4Products(
  //         sorted.filter((x) => x.category_id === 4).slice(0, 6),
  //       );
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   fetchHome();
  // }, []);

  // const homepage = [
  //   {
  //     id: 1,
  //     title: "آیفون | iPhone",
  //     img: "/image-services/mobile.svg",
  //     path: "/category/iphone",
  //     data: category1Products,
  //   },
  //   {
  //     id: 2,
  //     title: "ساعت | Watch",
  //     img: "/image-services/watch-square.svg",
  //     path: "/category/watch",
  //     data: category2Products,
  //   },
  //   {
  //     id: 3,
  //     title: "آیپد | iPad",
  //     img: "/image-services/tablet.svg",
  //     path: "/category/ipad",
  //     data: category3Products,
  //   },
  //   {
  //     id: 4,
  //     title: "ایرپاد | AirPods",
  //     img: "/image-services/airpod.svg",
  //     path: "/category/airpods",
  //     data: category4Products,
  //   },
  // ];

  const [data, setDeta] = useState([
    {
      image: '/image-services/apple-iphone-17-pro-max-cover.png',
      title: "آیفون 17 پرو مکس",
      description: "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
      price: 1000000000
    },
    {
      image: '/image-services/apple-iphone-17-pro-max-cover.png',
      title: "آیفون 17 پرو مکس",
      description: "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
      price: 1000000000
    },
    {
      image: '/image-services/apple-iphone-17-pro-max-cover.png',
      title: "آیفون 17 پرو مکس",
      description: "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
      price: 1000000000
    },
    {
      image: '/image-services/apple-iphone-17-pro-max-cover.png',
      title: "آیفون 17 پرو مکس",
      description: "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
      price: 1000000000
    },
    {
      image: '/image-services/apple-iphone-17-pro-max-cover.png',                                                                                                                                                                                       
      title: "آیفون 17 پرو مکس",
      description: "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
      price: 1000000000
    },
    {
      image: '/image-services/apple-iphone-17-pro-max-cover.png',
      title: "آیفون 17 پرو مکس",
      description: "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
      price: 1000000000
    },

  ])

  const title = "محصولات";

  return (
    <div>
      <Content />
      <FeaturedProduct />
      <Dashboard />
      <InfoSection />
      <Service
        data={data}
        title={title}
        // img={img}
        button="بیشتر"
        // onMoreClick={() => Router("/product")}
      />
    </div>
  );
}
