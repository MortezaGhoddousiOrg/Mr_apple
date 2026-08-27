"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import style from "@/app/Category/[Category]/page.module.css";
import { useParams } from "next/navigation";
import Image from "next/image";
import { api } from "@/app/config";
import CategoryTabFeature from "@/app/CategoryTabFeature/CategoryTabFeature";
import { useAuth } from "@/app/Context/Context";

// قیمت نهایی (با احتساب تخفیف) - برای مرتب‌سازی درست بر اساس همون قیمتی
// که کاربر واقعاً می‌بینه، نه قیمت خام قبل از تخفیف
function getEffectivePrice(p) {
  const price = Number(p?.sell_price);
  const discount = Number(p?.discount);
  if (Number.isNaN(price)) return 0;
  if (Number.isNaN(discount) || discount <= 0) return price;
  return price - price * (discount / 100);
}

// آیا این محصول (از طریق واریانت‌هاش) گارانتی داره؟
// معیار: حداقل یک واریانت فعال با warranty_months بزرگ‌تر از صفر
function hasWarranty(p) {
  if (!Array.isArray(p?.variants)) return false;
  return p.variants.some(
    (v) => v?.is_active !== false && Number(v?.warranty_months) > 0
  );
}

const PRICE_OPTIONS = [
  { value: "default", label: "پیش‌فرض" },
  { value: "cheap", label: "ارزان‌ترین" },
  { value: "expensive", label: "گران‌ترین" },
];

const WARRANTY_OPTIONS = [
  { value: "all", label: "همه محصولات" },
  { value: "warranty", label: "فقط دارای گارانتی" },
];

// دراپ‌داون سفارشی کوچیک - همون ظاهر قرص‌مانند با فلش که توی طرح خواسته شده
function FilterDropdown({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = options.find((o) => o.value === value);

  return (
    <div className={style.filterDropdown} ref={wrapperRef}>
      <button
        type="button"
        className={`${style.filterDropdownBtn} ${open ? style.filterDropdownBtnOpen : ""}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <svg
          className={`${style.filterChevron} ${open ? style.filterChevronOpen : ""}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
        <span className={style.filterDropdownValue}>
          {current?.label || label}
        </span>
        <span className={style.filterDropdownLabel}>{label}</span>
      </button>

      {open && (
        <ul className={style.filterDropdownList}>
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                className={`${style.filterDropdownOption} ${
                  opt.value === value ? style.filterDropdownOptionActive : ""
                }`}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Category() {
  const params = useParams();
  const rawCategory = params?.Category;
  const CategoryName = rawCategory
    ? decodeURIComponent(rawCategory).trim()
    : "";

  const [categoryChild, setCategoryChild] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { setNotif } = useAuth();

  const [product, setProduct] = useState([]);

  // ============================================================
  // 🔥 فیلتر محصولات (قیمت / گارانتی) - کاملاً فرانت، روی همون
  // لیستی که از بک‌اند اومده اعمال می‌شه
  // ============================================================
  const [priceFilter, setPriceFilter] = useState("default");
  const [warrantyFilter, setWarrantyFilter] = useState("all");

  const filteredProduct = useMemo(() => {
    let list = [...product];

    if (warrantyFilter === "warranty") {
      list = list.filter(hasWarranty);
    }

    if (priceFilter === "cheap") {
      list.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
    } else if (priceFilter === "expensive") {
      list.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
    }

    return list;
  }, [product, priceFilter, warrantyFilter]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await api.get("/api/category/child/");

        const filteredChildren = response.data.filter(
          (item) =>
            item.parent?.title?.toLowerCase() === CategoryName.toLowerCase(),
        );

        setCategoryChild(filteredChildren);

        if (filteredChildren.length > 0) {
          const firstChild = filteredChildren[0];

          setSelectedCategory(firstChild);

          const productResponse = await api.get(
            `/api/catalog/product/child/${firstChild.id}/`,
          );

          const validProducts = (productResponse.data || []).filter(
            (item) => item.status === "active" && item.category !== null,
          );

          setProduct(validProducts);
        } else {
          setProduct([]);
        }
      } catch (err) {
        setNotif({
          id: Date.now(),
          message: "حطا در دریافت اطلاعات",
          type: "error",
        });
      }
    };

    if (CategoryName) {
      fetchCategory();
    }
  }, [CategoryName]);

  if (!CategoryName || String(CategoryName).trim().length === 0) {
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
      <aside className={style.category}>
        <header className={style.categoryHeader}>
          <div className={style.heroGlowOne}></div>
          <div className={style.heroGlowTwo}></div>

          <div className={style.categoryBox}>
            <span className={style.categoryEyebrow}>Premium Collection</span>

            <h1 className={style.categoryTitle}>
              {selectedCategory?.parent?.title || "دسته بندی خالی است "}
            </h1>

            <p className={style.categoryDescription}>
              {selectedCategory?.descriptions ||
                "برای این دسته بندی محصولی وجود ندارد"}
            </p>

            <div className={style.categoryFeatures}>
              <div className={style.categoryFeatureItem}>
                <span className={style.featureIcon}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>تنوع بالای محصولات</span>
              </div>

              <div className={style.categoryFeatureItem}>
                <span className={style.featureIcon}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>کیفیت اورجینال</span>
              </div>

              <div className={style.categoryFeatureItem}>
                <span className={style.featureIcon}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>انتخاب سریع و مطمئن</span>
              </div>
            </div>
          </div>

          <div className={style.categoryImageContainer}>
            <div className={style.imageOrb}></div>
            <Image
              className={style.categoryImage}
              src="/image-category/IMG_SEGMENT_20260531_104249.png"
              alt="category-image"
              width={900}
              height={900}
              priority
            />
          </div>
        </header>

        <section className={style.tabSection}>
          {/* 🔥 فیلتر محصولات - قیمت و گارانتی */}
          <div className={style.filterBar}>
            <FilterDropdown
              label="قیمت"
              value={priceFilter}
              options={PRICE_OPTIONS}
              onChange={setPriceFilter}
            />
            <FilterDropdown
              label="گارانتی"
              value={warrantyFilter}
              options={WARRANTY_OPTIONS}
              onChange={setWarrantyFilter}
            />
          </div>

          <CategoryTabFeature
            Tab={categoryChild}
            products={filteredProduct}
            setProducts={setProduct}
            setSelectedCategory={setSelectedCategory}
          />
        </section>
      </aside>
    </div>
  );
}