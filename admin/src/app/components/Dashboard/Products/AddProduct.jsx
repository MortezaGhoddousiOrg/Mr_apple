"use client";

import { useState, useEffect } from "react";
import { api } from "@/app/config";
import Button from "../../Button";

function AddProduct({ onBack }) {
  // مرحله 1: اطلاعات پایه
  const [step, setStep] = useState(1); // 1: info, 2: features
  const [formData, setFormData] = useState({
    name: "",
    sell_price: "",
    buy_price: "",
    quantity: "",
    discount: "0",
    descriptions: "",
    category_id: "",
  });

  // مرحله 2: مشخصات فنی
  const [features, setFeatures] = useState([]);
  const [newFeatureKey, setNewFeatureKey] = useState("");
  const [newFeatureValue, setNewFeatureValue] = useState("");

  // تصاویر
  const [mainImage, setMainImage] = useState(null); // { file, preview, id, status }
  const [galleryImages, setGalleryImages] = useState([]); // [{ file, preview, id, status }]
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  // گرفتن لیست دسته‌بندی‌ها
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/category/child/");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setErrors((prev) => ({
        ...prev,
        category: "خطا در دریافت دسته‌بندی‌ها",
      }));
    }
  };

  // آپلود یک تصویر
  const uploadSingleImage = async (file, isMain) => {
    const formDataImg = new FormData();
    formDataImg.append("file", file);
    if (isMain) formDataImg.append("type", "true");

    const response = await api.post("/api/product/image/upload/", formDataImg, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  };

  // آپلود تصویر اصلی
  const handleMainImageUpload = async () => {
    if (!mainImage || !mainImage.file) return;

    setMainImage((prev) => ({ ...prev, status: "uploading" }));
    try {
      const uploaded = await uploadSingleImage(mainImage.file, true);
      setMainImage((prev) => ({ ...prev, id: uploaded.id, status: "success" }));
    } catch (error) {
      console.error("Error uploading main image:", error);
      setMainImage((prev) => ({ ...prev, status: "error" }));
    }
  };

  // آپلود یک تصویر گالری
  const handleGalleryImageUpload = async (index) => {
    const image = galleryImages[index];
    if (!image || !image.file) return;

    setGalleryImages((prev) =>
      prev.map((img, i) =>
        i === index ? { ...img, status: "uploading" } : img,
      ),
    );

    try {
      const uploaded = await uploadSingleImage(image.file, false);
      setGalleryImages((prev) =>
        prev.map((img, i) =>
          i === index ? { ...img, id: uploaded.id, status: "success" } : img,
        ),
      );
    } catch (error) {
      console.error("Error uploading gallery image:", error);
      setGalleryImages((prev) =>
        prev.map((img, i) => (i === index ? { ...img, status: "error" } : img)),
      );
    }
  };

  // انتخاب تصویر اصلی
  const selectMainImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage({
        file,
        preview: URL.createObjectURL(file),
        id: null,
        status: "pending",
      });
    }
  };

  // انتخاب تصاویر گالری
  const selectGalleryImages = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: null,
      status: "pending",
    }));
    setGalleryImages((prev) => [...prev, ...newImages]);
  };

  // حذف تصویر اصلی
  const removeMainImage = () => {
    if (mainImage?.preview) URL.revokeObjectURL(mainImage.preview);
    setMainImage(null);
  };

  // حذف تصویر گالری
  const removeGalleryImage = (index) => {
    URL.revokeObjectURL(galleryImages[index].preview);
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  // اضافه کردن مشخصات فنی
  const addFeature = () => {
    if (newFeatureKey.trim() && newFeatureValue.trim()) {
      setFeatures((prev) => [
        ...prev,
        { key: newFeatureKey, value: newFeatureValue },
      ]);
      setNewFeatureKey("");
      setNewFeatureValue("");
    }
  };

  const removeFeature = (index) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "نام محصول الزامی است";
    if (!formData.sell_price) newErrors.sell_price = "قیمت فروش الزامی است";
    if (!formData.quantity && formData.quantity !== 0)
      newErrors.quantity = "موجودی الزامی است";
    if (!formData.category_id) newErrors.category_id = "دسته‌بندی الزامی است";

    // بررسی آپلود تصاویر
    if (!mainImage?.id) newErrors.mainImage = "تصویر اصلی باید آپلود شود";
    const hasUnuploadedGallery = galleryImages.some((img) => !img.id);
    if (hasUnuploadedGallery)
      newErrors.gallery = "همه تصاویر گالری باید آپلود شوند";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // جمع‌آوری image_ids
      const image_ids = [];
      if (mainImage?.id) image_ids.push(mainImage.id);
      galleryImages.forEach((img) => {
        if (img.id) image_ids.push(img.id);
      });

      // تبدیل features به object
      const featureObj = {};
      features.forEach((f) => {
        featureObj[f.key] = f.value;
      });

      const productData = {
        name: formData.name,
        sell_price: parseFloat(formData.sell_price),
        buy_price: parseFloat(formData.buy_price) || 0,
        quantity: parseInt(formData.quantity),
        category_id: parseInt(formData.category_id),
        discount: parseFloat(formData.discount) || 0,
        descriptions: formData.descriptions,
        feature: featureObj,
        image_ids: image_ids,
      };

      await api.post("/api/product/create/", productData);
      onBack();
    } catch (error) {
      console.error("Error creating product:", error);
      setErrors((prev) => ({ ...prev, submit: "خطا در ایجاد محصول" }));
    } finally {
      setLoading(false);
    }
  };

  // وضعیت آپلود
  const StatusBadge = ({ status }) => {
    const config = {
      pending: {
        label: "در انتظار آپلود",
        color: "bg-yellow-100 text-yellow-800",
      },
      uploading: {
        label: "در حال آپلود...",
        color: "bg-blue-100 text-blue-800",
      },
      success: { label: "آپلود شد", color: "bg-green-100 text-green-800" },
      error: { label: "خطا", color: "bg-red-100 text-red-800" },
    };
    const { label, color } = config[status] || config.pending;
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${color}`}>{label}</span>
    );
  };

  // مرحله 1: اطلاعات پایه و تصاویر
  if (step === 1) {
    return (
      <section className="p-4 md:p-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
            افزودن محصول جدید - مرحله 1 از 2
          </h1>
          <Button clickFnc={onBack} text="بازگشت" is_main={false} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleNextStep();
          }}
          className="space-y-8"
        >
          {/* اطلاعات پایه */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-100">
              اطلاعات پایه
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نام محصول <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-900"
                  placeholder="مثال: هدفون سونی WH-1000XM5"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  دسته‌بندی <span className="text-red-500">*</span>
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-900"
                >
                  <option value="">انتخاب کنید...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.parent?.title || "بدون والد"} / {cat.title}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.category_id}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  قیمت فروش (تومان) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="sell_price"
                  value={formData.sell_price}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-900"
                  placeholder="0"
                />
                {errors.sell_price && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.sell_price}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  قیمت خرید (تومان)
                </label>
                <input
                  type="number"
                  name="buy_price"
                  value={formData.buy_price}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-900"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  موجودی <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-900"
                  placeholder="0"
                />
                {errors.quantity && (
                  <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تخفیف (تومان)
                </label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-900"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                توضیحات محصول
              </label>
              <textarea
                name="descriptions"
                value={formData.descriptions}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none resize-none text-gray-900"
                placeholder="توضیحات کامل محصول..."
              />
            </div>
          </div>

          {/* تصویر اصلی */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-100">
              تصویر اصلی
            </h2>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={selectMainImage}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                {mainImage && (
                  <button
                    type="button"
                    onClick={handleMainImageUpload}
                    disabled={mainImage.status === "uploading"}
                    className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition disabled:opacity-50"
                  >
                    آپلود
                  </button>
                )}
              </div>

              {mainImage && (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <img
                    src={mainImage.preview}
                    alt="پیش‌نمایش اصلی"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <StatusBadge status={mainImage.status} />
                  </div>
                  <button
                    type="button"
                    onClick={removeMainImage}
                    className="text-red-500 hover:text-red-700"
                  >
                    حذف
                  </button>
                </div>
              )}
              {errors.mainImage && (
                <p className="text-sm text-red-500">{errors.mainImage}</p>
              )}
            </div>
          </div>

          {/* تصاویر گالری */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-100">
              تصاویر گالری
            </h2>

            <div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={selectGalleryImages}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="space-y-3">
              {galleryImages.map((img, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <img
                    src={img.preview}
                    alt={`گالری ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <StatusBadge status={img.status} />
                  </div>
                  {img.status === "pending" && (
                    <button
                      type="button"
                      onClick={() => handleGalleryImageUpload(index)}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm transition"
                    >
                      آپلود
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>
            {errors.gallery && (
              <p className="text-sm text-red-500">{errors.gallery}</p>
            )}
          </div>

          {/* دکمه مرحله بعد */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all"
            >
              مرحله بعد: مشخصات فنی
            </button>
            <button
              type="button"
              onClick={onBack}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium transition-all"
            >
              انصراف
            </button>
          </div>
        </form>
      </section>
    );
  }

  // مرحله 2: مشخصات فنی
  return (
    <section className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
          افزودن محصول جدید - مرحله 2 از 2
        </h1>
        <Button
          clickFnc={() => setStep(1)}
          text="بازگشت به مرحله قبل"
          is_main={false}
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-100">
          مشخصات فنی محصول
        </h2>

        {/* جدول مشخصات اضافه شده */}
        {features.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-xl">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                    ویژگی
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                    مقدار
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {features.map((feature, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-gray-900">{feature.key}</td>
                    <td className="px-4 py-3 text-gray-900">{feature.value}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* فرم اضافه کردن مشخصه جدید */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان ویژگی
            </label>
            <input
              type="text"
              value={newFeatureKey}
              onChange={(e) => setNewFeatureKey(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900"
              placeholder="مثال: برند"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              مقدار ویژگی
            </label>
            <input
              type="text"
              value={newFeatureValue}
              onChange={(e) => setNewFeatureValue(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900"
              placeholder="مثال: Apple"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={addFeature}
          className="w-full md:w-auto px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium transition"
        >
          + افزودن ویژگی
        </button>

        {/* دکمه نهایی */}
        {errors.submit && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-center">
            {errors.submit}
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50"
          >
            {loading ? "در حال ثبت..." : "افزودن محصول"}
          </button>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium transition-all"
          >
            مرحله قبل
          </button>
        </div>
      </div>
    </section>
  );
}

export default AddProduct;
