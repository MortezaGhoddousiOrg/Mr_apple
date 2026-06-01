"use client";

import Image from "next/image";
// import Header from "@/app/Components/Header/Header";
import Content from "@/app/Components/Content/Content";
import Dashboard from "@/app/Components/Dashboard/Dashboard";
import InfoSection from "./Components/InfoSection/InfoSection";
import Service from "@/app/Components/Service/Service";
import ServiceSpecial from "@/app/Components/ServiceSpecial/ServiceSpecial";

// import Footer from "./Components/Footer/Footer";

// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import FeaturedProduct from "./Components/FeaturedProducts/FeaturedProducts";

export default function Home() {
  const router = useRouter();

  const [data, setData] = useState([
    {
      id: 1,
      image: "/image-services/apple-iphone-17-pro-max-cover.png",
      title: "آیفون 17 پرو مکس",
      description:
        "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
      price: 1000000000,
    },
    {
      id: 2,
      image: "/image-services/apple-iphone-17-pro-max-cover.png",
      title: "آیفون 17 پرو مکس",
      description:
        "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
      price: 1000000000,
    },
    {
      id: 3,
      image: "/image-services/apple-iphone-17-pro-max-cover.png",
      title: "آیفون 17 پرو مکس",
      description:
        "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
      price: 1000000000,
    },
    {
      id: 4,
      image: "/image-services/apple-iphone-17-pro-max-cover.png",
      title: "آیفون 17 پرو مکس",
      description:
        "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
      price: 1000000000,
    },
    {
      id: 5,
      image: "/image-services/apple-iphone-17-pro-max-cover.png",
      title: "آیفون 17 پرو مکس",
      description:
        "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
      price: 1000000000,
    },
    {
      id: 6,
      image: "/image-services/apple-iphone-17-pro-max-cover.png",
      title: "آیفون 17 پرو مکس",
      description:
        "گوشی قدرتمند اپل مدل iPhone 17 Pro Max با طراحی پریمیوم و عملکرد بسیار سریع.",
      price: 1000000000,
    },
  ]);

   useEffect(() => {
        const axioshome = async () => {
            try {
                const response = await api.get("/api/product/latest/");
                console.log(response.data);
                setData(response.data);
            } catch (err) {
                console.log(err);
            }
        };

        axioshome();
    }, []);

    const title = "آخرین محصولات";
    const titleSpecial = "محصولات ویژه";


    // if (data.length == 0) {
    //   return (
    //     <div>
    //       هیچ محصولی وجود ندارد 
    //     </div>
    //   )
    // }

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
