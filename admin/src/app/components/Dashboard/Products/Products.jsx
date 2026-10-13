"use client";

import { useState, useEffect, Fragment, useRef } from "react";
import Image from "next/image";
import { api, MEDIA_URL } from "@/app/config";
import Button from "../../Button";
import AddProduct from "./AddProduct";
import { useNotification } from "@/app/Context/NotificationContext";

function Products() {
  const { setNotif } = useNotification();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editProductData, setEditProductData] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editLoading, setEditLoading] = useState(false);
  const productsPerPage = 20;

  // ✅ stateهای سرچ
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const searchTimeoutRef = useRef(null);

  const fetchCategories = async () => {
    try {
      const childResponse = await api.get("/api/category/child/");
      const parentResponse = await api.get("/api/category/parent/");
      const allCategories = [...childResponse.data, ...parentResponse.data];
      setCategories(allCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/catalog/product/");
      setProducts(response.data);
      setAllProducts(response.data);
    } catch (err) {
      setError("خطا در دریافت لیست محصولات");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // پاک کردن timeout در cleanup
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // ✅ سرچ با هر حرف (با debounce)
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // ✅ حذف فاصله‌های اضافی
    const trimmedSearch = searchTerm.trim();

    if (!trimmedSearch && !selectedCategory) {
      setIsSearchMode(false);
      setProducts(allProducts);
      setCurrentPage(1);
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch();
    }, 400);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, selectedCategory]);

  const handleSearch = async () => {
    // ✅ حذف فاصله‌های اضافی
    const trimmedSearch = searchTerm.trim();

    if (!trimmedSearch && !selectedCategory) {
      setIsSearchMode(false);
      setProducts(allProducts);
      setCurrentPage(1);
      return;
    }

    setIsSearching(true);
    setIsSearchMode(true);
    try {
      const params = new URLSearchParams();
      if (trimmedSearch) params.append("q", trimmedSearch);
      if (selectedCategory) params.append("category_id", selectedCategory);

      const response = await api.get(
        `/api/catalog/products/search/?${params.toString()}`
      );
      setProducts(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Search error:", error);
      setNotif({
        id: Date.now(),
        message: "خطا در جستجو",
        type: "error",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setIsSearchMode(false);
    setProducts(allProducts);
    setCurrentPage(1);
  };

  const handleAddProduct = () => setShowAddProduct(true);

  const handleBackToList = () => {
    setShowAddProduct(false);
    setEditProductData(null);
    fetchProducts();
  };

  const handleEdit = async (product) => {
    setEditLoading(true);
    try {
      const response = await api.get(`/api/catalog/product/${product.id}/`);
      setEditProductData(response.data);
      setNotif({
        id: Date.now(),
        message: "اطلاعات محصول با موفقیت بارگذاری شد",
        type: "success",
      });
    } catch (err) {
      console.error("Error fetching product for edit:", err);
      setNotif({
        id: Date.now(),
        message: "خطا در دریافت اطلاعات محصول",
        type: "error",
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setEditLoading(true);
    try {
      await api.delete(`/api/catalog/product/${selectedProduct.id}/`);
      setNotif({
        id: Date.now(),
        message: "محصول با موفقیت حذف شد",
        type: "success",
      });
      setShowDeleteModal(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      const errorMsg = err.response?.data?.message || err.message;
      setNotif({
        id: Date.now(),
        message: `خطا در حذف محصول: ${errorMsg}`,
        type: "error",
      });
    } finally {
      setEditLoading(false);
    }
  };

  if (editProductData) {
    return (
      <AddProduct
        mode="edit"
        initialData={editProductData}
        onBack={handleBackToList}
      />
    );
  }

  if (showAddProduct) {
    return <AddProduct mode="create" onBack={handleBackToList} />;
  }

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  const getMainImage = (images) => {
    if (!images || images.length === 0) return null;
    const main = images.find((img) => img.is_main === true);
    if (main) return `${MEDIA_URL}${main.image}`;
    if (images[0]) return `${MEDIA_URL}${images[0].image}`;
    return null;
  };

  const getStatusBadge = (status) => {
    const config = {
      active: { label: "فعال", color: "bg-green-50 text-green-700" },
      inactive: { label: "غیرفعال", color: "bg-red-50 text-red-700" },
      pending: { label: "در انتظار", color: "bg-yellow-50 text-yellow-700" },
    };
    const { label, color } = config[status] || {
      label: status,
      color: "bg-gray-50 text-gray-700",
    };
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${color}`}>
        {label}
      </span>
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fa-IR").format(price);
  };

  const getCategoryDisplay = (product) => {
    if (product.category && typeof product.category === "object") {
      if (product.category.parent) {
        return `${product.category.parent.title} / ${product.category.title}`;
      }
      return product.category.title || "-";
    }

    if (product.category_child_id && categories.length > 0) {
      const category = categories.find(
        (c) => c.id === product.category_child_id
      );
      if (category) {
        if (category.parent) {
          return `${category.parent.title} / ${category.title}`;
        }
        return category.title || "-";
      }
    }

    return "-";
  };

  return (
    <Fragment>
      <section className="p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
            محصولات
            <span className="text-sm font-normal text-gray-500 mr-2">
              ({products.length})
            </span>
          </h1>
          <Button
            clickFnc={handleAddProduct}
            text="افزودن محصول جدید"
            is_main={true}
          />
        </div>

        {/* باکس سرچ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            {/* ورودی جستجو */}
            <div className="relative flex-1">
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="جستجوی محصول بر اساس نام، کد، توضیحات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-11 pl-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900 text-sm transition"
              />
              {isSearching && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <svg
                    className="w-4 h-4 animate-spin text-blue-500"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* انتخاب دسته‌بندی */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900 text-sm bg-white transition md:w-64"
            >
              <option value="">همه دسته‌بندی‌ها</option>
              {categories
                .filter((c) => c.parent)
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.parent?.title
                      ? `${cat.parent.title} / ${cat.title}`
                      : cat.title}
                  </option>
                ))}
            </select>

            {/* دکمه پاک کردن */}
            {(searchTerm || selectedCategory) && (
              <button
                onClick={handleClearSearch}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition flex items-center gap-2 whitespace-nowrap"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                پاک کردن
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-4 text-blue-500 hover:underline"
            >
              تلاش مجدد
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500">
              {isSearchMode
                ? "محصولی با این مشخصات یافت نشد"
                : "هیچ محصولی وجود ندارد"}
            </p>
            {isSearchMode && (
              <button
                onClick={handleClearSearch}
                className="mt-4 text-blue-500 hover:text-blue-700 text-sm font-medium"
              >
                نمایش همه محصولات
              </button>
            )}
          </div>
        ) : (
          <>
            {/* دسکتاپ */}
            <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                      محصول
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                      کد محصول
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                      قیمت
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                      موجودی
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                      وضعیت
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                      دسته‌بندی
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {currentProducts.map((product) => {
                    const imageUrl = getMainImage(product.images);
                    return (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {imageUrl ? (
                              <div className="relative w-10 h-10 flex-shrink-0">
                                <Image
                                  src={imageUrl}
                                  alt={product.name}
                                  width={40}
                                  height={40}
                                  className="rounded-lg object-cover"
                                  unoptimized={true}
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                📷
                              </div>
                            )}
                            <div className="font-medium text-gray-900">
                              {product.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 font-mono">
                            {product.product_code || "—"}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {formatPrice(product.sell_price)} تومان
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-sm ${
                              product.quantity < 5
                                ? "text-orange-500"
                                : "text-gray-700"
                            }`}
                          >
                            {product.quantity === 0
                              ? "ناموجود"
                              : `${product.quantity} عدد`}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(product.status)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {getCategoryDisplay(product)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              disabled={editLoading}
                              className="text-blue-500 hover:text-blue-700 transition p-1"
                              title="ویرایش"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(product)}
                              className="text-red-500 hover:text-red-700 transition p-1"
                              title="حذف"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* موبایل */}
            <div className="lg:hidden space-y-4">
              {currentProducts.map((product) => {
                const imageUrl = getMainImage(product.images);
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm"
                  >
                    <div className="flex gap-3">
                      {imageUrl ? (
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            width={64}
                            height={64}
                            className="rounded-xl object-cover"
                            unoptimized={true}
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-2xl">
                          📷
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-400 font-mono mt-1">
                          کد: {product.product_code || "—"}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {getStatusBadge(product.status)}
                          <span className="text-sm text-gray-700">
                            {formatPrice(product.sell_price)} تومان
                          </span>
                        </div>
                        <div className="mt-2 text-sm">
                          <span className="text-gray-500">موجودی: </span>
                          <span
                            className={`font-medium ${
                              product.quantity === 0
                                ? "text-red-500"
                                : product.quantity < 5
                                  ? "text-orange-500"
                                  : "text-gray-900"
                            }`}
                          >
                            {product.quantity === 0
                              ? "ناموجود"
                              : `${product.quantity} عدد`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 pt-3 border-t border-gray-50">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-xl text-sm font-medium"
                      >
                        ویرایش
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="flex-1 bg-red-50 text-red-600 py-2 rounded-xl text-sm font-medium"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 disabled:opacity-50"
            >
              قبلی
            </button>
            <span className="px-4 py-2 text-gray-700">
              صفحه {currentPage} از {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 disabled:opacity-50"
            >
              بعدی
            </button>
          </div>
        )}

        {products.length > 0 && (
          <div className="text-center text-gray-500 text-sm mt-4">
            نمایش {indexOfFirstProduct + 1} تا{" "}
            {Math.min(indexOfLastProduct, products.length)} از {products.length}{" "}
            محصول
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && selectedProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                🗑️
              </div>
              <h3 className="text-lg font-semibold mb-2">حذف محصول</h3>
              <p className="text-gray-600 mb-6">
                آیا از حذف محصول "{selectedProduct.name}" مطمئن هستید؟
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmDelete}
                  disabled={editLoading}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-medium transition disabled:opacity-50"
                >
                  {editLoading ? "در حال حذف..." : "حذف"}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-medium transition"
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </Fragment>
  );
}

export default Products;