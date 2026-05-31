import "./page.module.css";
import { useState, useEffect, useRef } from "react";
import Card from "../CardProduct/Card";
import axios from "axios";

export default function Products({ setNotif }) {
  const [productsAll, setProductsAll] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("همه");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;
  const productRef = useRef(null);

  useEffect(() => {
    productRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProductsAll(res.data);
        const uniqueCategories = [
          "همه",
          ...new Set(res.data.map((p) => p.category)),
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProducts();
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  let currentProducts = [];
  let filteredProductsByCategory = [];

  if (selectedCategory === "همه") {
    filteredProductsByCategory = productsAll;
  } else {
    filteredProductsByCategory = productsAll.filter(
      (p) => p.category === selectedCategory,
    );
  }

  currentProducts = filteredProductsByCategory.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  const totalPages = Math.ceil(
    filteredProductsByCategory.length / productsPerPage,
  );

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="product-body">
      <header className="product-header">
        <div>
          <h1>محصولات</h1>
          <p>
            اپل همواره ترکیبی از طراحی دقیق، عملکرد قدرتمند و تجربه‌ای یکپارچه
            را ارائه کرده است. در این صفحه، جدیدترین و محبوب‌ترین محصولات اپل را
            در کنار هم می‌بینید تا سریع‌تر انتخاب کنید. از گوشی‌های هوشمند تا
            لپ‌تاپ‌ها و گجت‌های کاربردی، هر محصول برای نیازهای روزمره و حرفه‌ای
            شما ساخته شده است. با خیال راحت مقایسه کنید و بهترین گزینه را پیدا
            کنید.
          </p>
        </div>
        <img src="/image-product/13progold-1.png" alt="" />
      </header>
      <div className="ref" ref={productRef}>
        <Card product={currentProducts} setNotif={setNotif} />
      </div>

      <div className="product-page">
        <button
          className="product-prev"
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          قبلی
        </button>
        <span>
          صفحه {currentPage} از {totalPages}
        </span>
        <button
          className="product-next"
          onClick={nextPage}
          disabled={currentPage === totalPages}
        >
          بعدی
        </button>
      </div>
    </div>
  );
}
