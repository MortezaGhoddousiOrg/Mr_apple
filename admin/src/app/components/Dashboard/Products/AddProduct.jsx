import { useState } from "react";
import Button from "../../Button";

function AddProduct({ onBack }) {
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        price: "",
        quantity: "",
        description: "",
        status: "active",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "نام محصول الزامی است";
        }

        if (!formData.code.trim()) {
            newErrors.code = "کد محصول الزامی است";
        }

        if (!formData.price) {
            newErrors.price = "قیمت محصول الزامی است";
        } else if (isNaN(parseFloat(formData.price.replace(/,/g, "")))) {
            newErrors.price = "قیمت باید عددی باشد";
        }

        if (!formData.quantity && formData.quantity !== 0) {
            newErrors.quantity = "موجودی محصول الزامی است";
        } else if (isNaN(parseInt(formData.quantity))) {
            newErrors.quantity = "موجودی باید عددی باشد";
        } else if (parseInt(formData.quantity) < 0) {
            newErrors.quantity = "موجودی نمی تواند منفی باشد";
        }

        if (!formData.description.trim()) {
            newErrors.description = "توضیحات محصول الزامی است";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Format price before submission
            const formattedPrice = formData.price.replace(/,/g, "");
            const productData = {
                ...formData,
                price: formattedPrice,
                quantity: parseInt(formData.quantity),
                created_at: new Date().toISOString().split("T")[0],
                updated_at: new Date().toISOString().split("T")[0],
                image: null,
            };
            console.log("New product:", productData);
            // Here you would typically send the data to your API
            // After successful submission, go back to products list
            onBack();
        }
    };

    const handleCancel = () => {
        onBack();
    };

    // Format price with commas
    const handlePriceChange = (e) => {
        let value = e.target.value.replace(/,/g, "");
        if (value && !isNaN(value)) {
            value = parseInt(value).toLocaleString("fa-IR");
        }
        setFormData((prev) => ({
            ...prev,
            price: value,
        }));
    };

    // Handle quantity change (only numbers)
    const handleQuantityChange = (e) => {
        let value = e.target.value;
        if (value === "" || /^\d+$/.test(value)) {
            setFormData((prev) => ({
                ...prev,
                quantity: value,
            }));
        }
    };

    return (
        <section className="p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        افزودن محصول جدید
                    </h1>
                    <Button
                        clickFnc={handleCancel}
                        text={"بازگشت به لیست"}
                        is_main={false}
                    />
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Product Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                نام محصول{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                    errors.name
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:border-blue-500"
                                }`}
                                placeholder="مثال: لپ تاپ ایسوس ROG"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Product Code and Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label
                                    htmlFor="code"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    کد محصول{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="code"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-mono ${
                                        errors.code
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:border-blue-500"
                                    }`}
                                    placeholder="مثال: PRD-001"
                                />
                                {errors.code && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.code}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="price"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    قیمت (تومان){" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handlePriceChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-left ${
                                        errors.price
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:border-blue-500"
                                    }`}
                                    placeholder="مثال: 45,500,000"
                                />
                                {errors.price && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.price}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Quantity and Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label
                                    htmlFor="quantity"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    موجودی (تعداد){" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="quantity"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleQuantityChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                        errors.quantity
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:border-blue-500"
                                    }`}
                                    placeholder="مثال: 15"
                                />
                                {errors.quantity && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.quantity}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="status"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    وضعیت محصول
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                >
                                    <option value="active">فعال</option>
                                    <option value="inactive">غیرفعال</option>
                                    <option value="pending">در انتظار</option>
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                توضیحات محصول{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                    errors.description
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:border-blue-500"
                                }`}
                                placeholder="توضیحات کامل محصول را وارد کنید..."
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Form Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200"
                            >
                                افزودن محصول
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2.5 rounded-lg font-medium transition-colors duration-200"
                            >
                                انصراف
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default AddProduct;
