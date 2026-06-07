import Image from "next/image";
import Button from "../../Button";
import { useState, Fragment } from "react";
import AddProduct from "./AddProduct";

function Products() {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 20;

    const handleAddProduct = () => {
        setShowAddProduct(true);
    };

    const handleBackToList = () => {
        setShowAddProduct(false);
    };

    const handleEdit = (product) => {
        console.log("Edit product:", product);
    };

    const handleDelete = (product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        console.log("Delete product:", selectedProduct);
        setShowDeleteModal(false);
        setSelectedProduct(null);
    };

    const products = [
        {
            id: 0,
            name: "لپ تاپ ایسوس ROG",
            code: "PRD-001",
            price: "45,500,000",
            quantity: 15,
            description:
                "لپ تاپ گیمینگ با پردازنده اینتل نسل 13 و کارت گرافیک RTX 4060",
            status: "active",
            created_at: "2024-01-15",
            updated_at: "2024-03-20",
            image: null,
        },
        {
            id: 1,
            name: "کیبورد مکانیکال لاجیتک",
            code: "PRD-002",
            price: "3,200,000",
            quantity: 8,
            description: "کیبورد مکانیکال با سوئیچ آبی و نور RGB",
            status: "active",
            created_at: "2024-02-10",
            updated_at: "2024-03-18",
            image: null,
        },
        {
            id: 2,
            name: "موس گیمینگ ریزر",
            code: "PRD-003",
            price: "1,800,000",
            quantity: 0,
            description: "موس بی سیم با 8 دکمه قابل برنامه ریزی",
            status: "inactive",
            created_at: "2024-01-20",
            updated_at: "2024-03-15",
            image: null,
        },
        {
            id: 3,
            name: "مانیتور سامسونگ 27 اینچ",
            code: "PRD-004",
            price: "12,900,000",
            quantity: 23,
            description: "مانیتور منحنی 165Hz با رزولوشن 2K",
            status: "active",
            created_at: "2024-03-01",
            updated_at: "2024-03-19",
            image: null,
        },
        {
            id: 4,
            name: "هارد اکسترنال وسترن دیجیتال",
            code: "PRD-005",
            price: "2,500,000",
            quantity: 5,
            description: "هارد 1 ترابایتی USB 3.0",
            status: "pending",
            created_at: "2024-03-10",
            updated_at: "2024-03-22",
            image: null,
        },
        {
            id: 5,
            name: "هدفون سونی WH-1000XM5",
            code: "PRD-006",
            price: "14,800,000",
            quantity: 12,
            description: "هدفون حذف نویز فعال با کیفیت صدای بالا",
            status: "active",
            created_at: "2024-03-05",
            updated_at: "2024-03-21",
            image: null,
        },
    ];

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(
        indexOfFirstProduct,
        indexOfLastProduct,
    );
    const totalPages = Math.ceil(products.length / productsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
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

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { label: "فعال", color: "bg-green-100 text-green-800" },
            inactive: { label: "غیرفعال", color: "bg-red-100 text-red-800" },
            pending: {
                label: "در انتظار",
                color: "bg-yellow-100 text-yellow-800",
            },
        };

        const config = statusConfig[status] || {
            label: status,
            color: "bg-gray-100 text-gray-800",
        };

        return (
            <span
                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.color}`}
            >
                {config.label}
            </span>
        );
    };

    const getQuantityBadge = (quantity) => {
        if (quantity === 0) {
            return (
                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    موجود نیست
                </span>
            );
        } else if (quantity < 5) {
            return (
                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    موجودی کم ({quantity})
                </span>
            );
        } else {
            return (
                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    موجود ({quantity})
                </span>
            );
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("fa-IR").format(price.replace(/,/g, ""));
    };

    // Show AddProduct component when showAddProduct is true
    if (showAddProduct) {
        return <AddProduct onBack={handleBackToList} />;
    }

    // Show Products list when showAddProduct is false
    return (
        <Fragment>
            <section className="p-4 md:p-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        لیست محصولات
                    </h1>
                    <Button
                        clickFnc={handleAddProduct}
                        text={"افزودن محصول جدید"}
                        is_main={true}
                    />
                </div>

                {/* Desktop Table View - Hidden on mobile */}
                <div className="hidden lg:block overflow-x-auto shadow-lg rounded-lg bg-white">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-100 border-b-2 border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                                    محصول
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                                    کد محصول
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                                    قیمت
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                                    موجودی
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                                    وضعیت
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                                    تاریخ ثبت
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                                    تاریخ بروزرسانی
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                                    عملیات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentProducts.map((product, index) => (
                                <tr
                                    key={product.id}
                                    className={`hover:bg-gray-50 transition-colors duration-200 ${
                                        index % 2 === 0
                                            ? "bg-white"
                                            : "bg-gray-50"
                                    }`}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0">
                                                <Image
                                                    src={
                                                        product.image
                                                            ? product.image
                                                            : "/product-placeholder.webp"
                                                    }
                                                    alt="product"
                                                    width={40}
                                                    height={40}
                                                    className="rounded-lg object-cover border border-gray-200"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {product.name}
                                                </div>
                                                <div className="text-sm text-gray-500 line-clamp-1">
                                                    {product.description}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 font-mono">
                                            {product.code}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 font-bold">
                                            {formatPrice(product.price)} تومان
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getQuantityBadge(product.quantity)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(product.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600">
                                            {product.created_at
                                                ? new Date(
                                                      product.created_at,
                                                  ).toLocaleDateString("fa-IR")
                                                : "---"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600">
                                            {product.updated_at
                                                ? new Date(
                                                      product.updated_at,
                                                  ).toLocaleDateString("fa-IR")
                                                : "---"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    handleEdit(product)
                                                }
                                                className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(product)
                                                }
                                                className="text-red-600 hover:text-red-900 transition-colors duration-200"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
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

                {/* Mobile Card View - Visible only on mobile/tablet */}
                <div className="lg:hidden space-y-4">
                    {currentProducts.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                        >
                            {/* Card Header */}
                            <div className="p-4 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0">
                                        <Image
                                            src={
                                                product.image
                                                    ? product.image
                                                    : "/product-placeholder.webp"
                                            }
                                            alt="product"
                                            width={50}
                                            height={50}
                                            className="rounded-lg object-cover border border-gray-200"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 text-lg">
                                            {product.name}
                                        </h3>
                                        <div className="mt-1 flex gap-2">
                                            {getStatusBadge(product.status)}
                                            {getQuantityBadge(product.quantity)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <span className="text-gray-600 text-sm font-medium">
                                        کد محصول:
                                    </span>
                                    <span className="text-gray-900 text-sm font-mono">
                                        {product.code}
                                    </span>
                                </div>

                                <div className="flex justify-between items-start">
                                    <span className="text-gray-600 text-sm font-medium">
                                        قیمت:
                                    </span>
                                    <span className="text-gray-900 text-sm font-bold">
                                        {formatPrice(product.price)} تومان
                                    </span>
                                </div>

                                <div className="flex justify-between items-start">
                                    <span className="text-gray-600 text-sm font-medium">
                                        موجودی:
                                    </span>
                                    <span className="text-gray-900 text-sm">
                                        {product.quantity === 0
                                            ? "ناموجود"
                                            : `${product.quantity} عدد`}
                                    </span>
                                </div>

                                <div className="flex justify-between items-start">
                                    <span className="text-gray-600 text-sm font-medium">
                                        توضیحات:
                                    </span>
                                    <span className="text-gray-900 text-sm text-left break-all max-w-[60%]">
                                        {product.description}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm font-medium">
                                        تاریخ ثبت:
                                    </span>
                                    <span className="text-gray-900 text-sm">
                                        {product.created_at
                                            ? new Date(
                                                  product.created_at,
                                              ).toLocaleDateString("fa-IR")
                                            : "---"}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm font-medium">
                                        تاریخ بروزرسانی:
                                    </span>
                                    <span className="text-gray-900 text-sm">
                                        {product.updated_at
                                            ? new Date(
                                                  product.updated_at,
                                              ).toLocaleDateString("fa-IR")
                                            : "---"}
                                    </span>
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="p-4 bg-gray-50 flex gap-3">
                                <button
                                    onClick={() => handleEdit(product)}
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
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
                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                        />
                                    </svg>
                                    ویرایش
                                </button>
                                <button
                                    onClick={() => handleDelete(product)}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
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
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                    حذف
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                currentPage === 1
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            <svg
                                className="w-5 h-5 inline-block ml-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            قبلی
                        </button>

                        <div className="flex gap-2">
                            {Array.from(
                                { length: totalPages },
                                (_, i) => i + 1,
                            ).map((number) => (
                                <button
                                    key={number}
                                    onClick={() => paginate(number)}
                                    className={`w-10 h-10 rounded-lg font-medium transition-colors duration-200 ${
                                        currentPage === number
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                                >
                                    {number}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                currentPage === totalPages
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            بعدی
                            <svg
                                className="w-5 h-5 inline-block mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Info Text */}
                {products.length > 0 && (
                    <div className="text-center text-gray-600 text-sm mt-4">
                        نمایش {indexOfFirstProduct + 1} تا{" "}
                        {Math.min(indexOfLastProduct, products.length)} از{" "}
                        {products.length} محصول
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                            <div className="p-6">
                                <div className="flex justify-center mb-4">
                                    <div className="bg-red-100 rounded-full p-3">
                                        <svg
                                            className="w-8 h-8 text-red-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                                    حذف محصول
                                </h3>
                                <p className="text-gray-600 text-center mb-6">
                                    آیا از حذف محصول "{selectedProduct?.name}"
                                    مطمئن هستید؟
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() =>
                                            setShowDeleteModal(false)
                                        }
                                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition"
                                    >
                                        انصراف
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
                                    >
                                        حذف
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </Fragment>
    );
}

export default Products;
