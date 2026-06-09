"use client";

import { useState, useEffect, Fragment } from "react";
import { api } from "@/app/config";
import Button from "../../Button";
import AddProduct from "./AddProduct";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingForm, setEditingForm] = useState({});
  const productsPerPage = 20;

  // گرفتن لیست محصولات
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/product/");
      setProducts(response.data);
    } catch (err) {
      setError("خطا در دریافت لیست محصولات");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = () => setShowAddProduct(true);
  const handleBackToList = () => {
    setShowAddProduct(false);
    fetchProducts(); // رفرش لیست بعد از اضافه شدن محصول
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditingForm({
      name: product.name,
      sell_price: product.sell_price,
      quantity: product.quantity,
      status: product.status,
    });
    setShowEditModal(true);
  };

  const handleUpdateProduct = async () => {
    try {
      await api.put(`/api/product/${selectedProduct.id}/`, {
        name: editingForm.name,
        sell_price: parseFloat(editingForm.sell_price),
        quantity: parseInt(editingForm.quantity),
        status: editingForm.status,
      });
      setShowEditModal(false);
      fetchProducts(); // رفرش لیست
    } catch (err) {
      console.error("Error updating product:", err);
      alert("خطا در بروزرسانی محصول");
    }
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.patch(`/api/product/${selectedProduct.id}/`, {
        status: "deleted",
      });
      setShowDeleteModal(false);
      setSelectedProduct(null);
      fetchProducts(); // رفرش لیست
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("خطا در حذف محصول");
    }
  };

  // پیجینیشن
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  // گرفتن تصویر اصلی
  const getMainImage = (images) => {
    const main = images?.find((img) => img.is_main === true);
    if (main) return `http://127.0.0.1:4000${main.image}`;
    if (images?.[0]) return `http://127.0.0.1:4000${images[0].image}`;
    return "/product-placeholder.webp";
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

  if (showAddProduct) return <AddProduct onBack={handleBackToList} />;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchProducts}
          className="mt-4 text-blue-500 hover:underline"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <Fragment>
      <section className="p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
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

        {/* نمای دسکتاپ */}
        <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                  محصول
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
              {currentProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={getMainImage(product.images)}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                        onError={(e) => {
                          e.target.src = "/product-placeholder.webp";
                        }}
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">
                          {product.product_code}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {formatPrice(product.sell_price)} تومان
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-sm ${product.quantity < 5 ? "text-orange-500" : "text-gray-700"}`}
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
                    {product.category?.parent?.title || ""}{" "}
                    {product.category?.parent?.title &&
                      product.category?.title &&
                      "/"}{" "}
                    {product.category?.title || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
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
              ))}
            </tbody>
          </table>
        </div>
        {/* نمای موبایل */}
        <div className="lg:hidden space-y-4">
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm"
            >
              <div className="flex gap-3">
                <img
                  src={getMainImage(product.images)}
                  alt={product.name}
                  className="w-16 h-16 rounded-xl object-cover bg-gray-100"
                  onError={(e) => {
                    e.target.src = "/product-placeholder.webp";
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-mono">
                    {product.product_code}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {getStatusBadge(product.status)}
                    <span className="text-sm text-gray-700">
                      {formatPrice(product.sell_price)} تومان
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
          ))}
        </div>

        {/* پیجینیشن */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 disabled:opacity-50 transition"
            >
              قبلی
            </button>
            <span className="px-4 py-2 text-gray-700">
              صفحه {currentPage} از {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 disabled:opacity-50 transition"
            >
              بعدی
            </button>
          </div>
        )}

        {/* مودال ویرایش */}
        {showEditModal && selectedProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h2 className="text-xl font-semibold mb-4">ویرایش محصول</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  value={editingForm.name}
                  onChange={(e) =>
                    setEditingForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder="نام محصول"
                />
                <input
                  type="number"
                  value={editingForm.sell_price}
                  onChange={(e) =>
                    setEditingForm((prev) => ({
                      ...prev,
                      sell_price: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder="قیمت"
                />
                <input
                  type="number"
                  value={editingForm.quantity}
                  onChange={(e) =>
                    setEditingForm((prev) => ({
                      ...prev,
                      quantity: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder="موجودی"
                />
                <select
                  value={editingForm.status}
                  onChange={(e) =>
                    setEditingForm((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                >
                  <option value="active">فعال</option>
                  <option value="inactive">غیرفعال</option>
                  <option value="pending">در انتظار</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleUpdateProduct}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-xl font-medium transition"
                >
                  ذخیره
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-medium transition"
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        )}

        {/* مودال حذف */}
        {showDeleteModal && selectedProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-600"
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
              </div>
              <h3 className="text-lg font-semibold mb-2">حذف محصول</h3>
              <p className="text-gray-600 mb-6">
                آیا از حذف محصول "{selectedProduct.name}" مطمئن هستید؟
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-medium transition"
                >
                  حذف
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
