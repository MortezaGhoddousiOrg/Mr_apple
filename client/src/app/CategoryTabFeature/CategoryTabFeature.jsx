"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import style from "./CategoryTabFeature.module.css";
import Card from "@/app/CardPage/Card";
import { api } from "../config";

const FALLBACK_IMAGE = "/image-infosection/IMG_SEGMENT_20260513_115454.png";

function mapProductToCard(item) {
  const mainImageObject =
    item.images?.find((img) => img.is_main) ||
    item.images?.[0];

  const displayImage = mainImageObject
    ? `http://localhost:4000${mainImageObject.image}`
    : FALLBACK_IMAGE;

  return {
    id: item.id,
    image: displayImage,
    title: item.name,
    description: item.descriptions,
    price: item.sell_price,
    status: item.status,
    category_child_id: item.category_child_id,
  };
}


export default function CategoryTabFeature({
  Tab = [],
  products = [],
  setProducts,
}) {
  // const [categoryId, setCategoryId] = useState(() => Tab?.[0]?.id ?? null);
  const [categoryId, setCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);

useEffect(() => {
  if (!Tab.length) return;

  setCategoryId(Tab[0].id);
}, [Tab]);

useEffect(() => {
  if (!categoryId) return;

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/api/catalog/product/child/${categoryId}/`
      );

      console.log("products =", response.data);

      setProducts(response.data || []);
    } catch (err) {
      console.log(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, [categoryId]);

useEffect(() => {
  console.log("Tab =", Tab);
  console.log("categoryId =", categoryId);
}, [Tab, categoryId]);

// const handleClick = async (id) => {
//   if (id === categoryId) return;
//    console.log("clicked id =", id);

//   try {
//     setLoading(true);

//     const response = await api.get(
//       `/api/category/category-child/${id}/detail/`
//     );

//     setProducts(response.data.products || []);
//     console.log("products =", response.data.products);

//     setCategoryId(id);
//   } catch (err) {
//     console.log(err);
//   } finally {
//     setLoading(false);
//   }
// };

const handleClick = (id) => {
  if (id === categoryId) return;

  setCategoryId(id);
};  

  // const filteredProducts = useMemo(() => {
  //   if (!categoryId) return [];
  //   return (products || []).filter(
  //     (item) => item.category_child_id === categoryId,
  //   );
  // }, [products, categoryId]);

const cardData = useMemo(() => {
  return products.map(mapProductToCard);
}, [products]);

  if (!Tab?.length) {
    return (
      <div className={style.box}>
        <h2 className={style.title}>محصولی پیدا نشد</h2>
        <p className={style.description}>
          متأسفانه هیچ محصولی برای نمایش وجود ندارد. لطفاً کمی بعد دوباره تلاش
          کنید یا فیلترهای جستجو را تغییر دهید.
        </p>
      </div>
    );
  }

  return (
    <section className={style.wrapper}>
      <div className={style.categoryTab}>
        {Tab.map((item) => {
          const isActive = item.id === categoryId;

          return (
            <div
              key={item.id}
              className={`${style.containerTab} ${
                isActive ? style.activeTab : ""
              }`}
              onClick={() => handleClick(item.id)}
              role="button"
              tabIndex={0}
            >
              <div className={style.tab}>
                <div className={style.imageWrap}>
                  <img
                    className={style.imageTab}
                    src={`http://localhost:4000${item.image}` || FALLBACK_IMAGE}
                    alt={item.title || "category-tab"}
                    width={92}
                    height={92}
                  />
                </div>
                <p className={style.titleTab}>{item.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {loading && <p className={style.loading}>در حال دریافت محصولات...</p>}

      {!loading && cardData.length === 0 ? (
        <div className={style.box}>
          <h2 className={style.title}>هیچ محصولی برای این دسته وجود ندارد</h2>
          <p className={style.description}>
            لطفاً یک تب دیگر انتخاب کنید یا بعداً دوباره تلاش کنید.
          </p>
        </div>
      ) : (
        <div className={style.cardSection}>
          <Card product={cardData} />
        </div>
      )}
    </section>
  );
}
