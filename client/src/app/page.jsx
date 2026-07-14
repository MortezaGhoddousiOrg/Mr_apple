"use client";

import Content from "@/app/Components/Content/Content";
import Dashboard from "@/app/Components/Dashboard/Dashboard";
import InfoSection from "./Components/InfoSection/InfoSection";
import Service from "@/app/Components/Service/Service";
import ServiceSpecial from "@/app/Components/ServiceSpecial/ServiceSpecial";
import { api } from "./config";
import { MEDIA_URL } from "@/app/config";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import FeaturedProduct from "./Components/FeaturedProducts/FeaturedProducts";

export default function Home() {
  const router = useRouter();

  const [product, setProduct] = useState([]);
  const [productspecial, setProductSpecial] = useState([]);

  useEffect(() => {
    const axioshome = async () => {
      try {
        const response = await api.get("/api/catalog/product/home");
        setProduct(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    axioshome();
  }, []);



  useEffect(() => {
    const axiosspecial = async () => {
      try {
        const response = await api.get("/api/catalog/product/");
        setProductSpecial(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    axiosspecial();
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
    discount: item.discount,
  }));

  const specialProducts = productspecial
  .filter((item) => Number(item.discount) > 0)
  .slice(0, 6)
  .map((item) => ({
    id: item.id,
    image: `${MEDIA_URL}${
      item.images?.find((img) => img.is_main)?.image ||
      item.images?.[0]?.image ||
      ""
    }`,
    title: item.name,
    category: item.category,
    description: item.descriptions,
    price: item.sell_price,
    status: item.status,
    discount: Number(item.discount),
  }));

  return (
    <div>
      <Content />
      <FeaturedProduct />
      <Dashboard />

      <ServiceSpecial
        data={specialProducts}
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
