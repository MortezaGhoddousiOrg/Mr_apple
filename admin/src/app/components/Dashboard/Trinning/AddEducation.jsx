"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { api, MEDIA_URL } from "@/app/config";
import { useNotification } from "@/app/Context/NotificationContext";
import DatePicker from "@/app/components/DatePicker";

export default function AddEducation({
  mode = "create",
  initialData = null,
  onBack,
}) {
  const { setNotif } = useNotification();
  const isEdit = mode === "edit";

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    publish_date: "",
    type: initialData?.type || "news",
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        publish_date: initialData.publish_date || initialData.date || "",
        type: initialData.type || "news",
      });

      if (initialData.image) {
        setImage({
          id: initialData.image_id ?? null,
          imagePath: initialData.image,
          preview: `${MEDIA_URL}${initialData.image}`,
          status: "success",
          isExisting: true,
        });
      }
    }
  }, [isEdit, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      publish_date: date,
    }));

    if (errors.publish_date) {
      setErrors((prev) => ({
        ...prev,
        publish_date: "",
      }));
    }
  };

  const uploadImage = async (file) => {
    const formDataImg = new FormData();
    formDataImg.append("file", file);
    const response = await api.post(
      "/education/admin/upload-image/",
      formDataImg,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data.data;
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage({
      file,
      preview: URL.createObjectURL(file),
      id: null,
      imagePath: null,
      status: "pending",
      isExisting: false,
    });
  };

  const handleImageUpload = async () => {
    if (!image || !image.file) return;
    setImage((prev) => ({ ...prev, status: "uploading" }));
    try {
      const uploaded = await uploadImage(image.file);
      setImage((prev) => ({
        ...prev,
        id: uploaded.id,
        imagePath: uploaded.image,
        status: "success",
        isExisting: false,
      }));
      setNotif({
        id: Date.now(),
        message: "تصویر با موفقیت آپلود شد",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      setImage((prev) => ({ ...prev, status: "error" }));
      setNotif({
        id: Date.now(),
        message: "خطا در آپلود تصویر",
        type: "error",
      });
    }
  };

  const removeImage = () => {
    if (image?.preview && !image.isExisting) {
      URL.revokeObjectURL(image.preview);
    }
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "عنوان الزامی است";
    if (!formData.description.trim())
      newErrors.description = "توضیحات الزامی است";
    if (!formData.publish_date.trim())
      newErrors.publish_date = "تاریخ الزامی است";

    if (!image?.id && mode === "create") {
      newErrors.image = "تصویر باید آپلود شود";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const articleData = {
        title: formData.title,
        description: formData.description,
        publish_date: formData.publish_date,
        image_id: image.id,
      };

      if (isEdit && initialData?.id) {
        const endpoint =
          initialData.type === "news"
            ? `/education/admin/news/${initialData.id}/`
            : `/education/admin/tutorials/${initialData.id}/`;

        await api.put(endpoint, articleData);

        setNotif({
          id: Date.now(),
          message: "مقاله با موفقیت ویرایش شد",
          type: "success",
        });
      } else {
        const endpoint =
          formData.type === "news"
            ? "/education/admin/news/"
            : "/education/admin/tutorials/";

        await api.post(endpoint, articleData);

        setNotif({
          id: Date.now(),
          message: "مقاله با موفقیت ایجاد شد",
          type: "success",
        });
      }

      onBack();
    } catch (error) {
      console.error("Error saving article:", error);
      let msg = "خطا در ذخیره مقاله";
      if (error.response?.data) {
        if (typeof error.response.data === "object") {
          msg = Object.entries(error.response.data)
            .map(([k, v]) => `${k}: ${v}`)
            .join("\n");
        } else {
          msg = error.response.data;
        }
      }
      setNotif({
        id: Date.now(),
        message: msg,
        type: "error",
      });
      setErrors((prev) => ({ ...prev, submit: msg }));
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
          {isEdit ? "ویرایش مقاله" : "افزودن مقاله جدید"}
        </h1>
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium transition-all"
        >
          بازگشت
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          {/* نوع مقاله */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع مقاله <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              disabled={isEdit}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="news">خبر</option>
              <option value="tutorial">آموزش</option>
            </select>
          </div>

          {/* عنوان */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-xl border ${
                errors.title ? "border-red-500" : "border-gray-200"
              } focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900`}
              placeholder="عنوان مقاله را وارد کنید"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* توضیحات */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              توضیحات <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className={`w-full px-4 py-2.5 rounded-xl border ${
                errors.description ? "border-red-500" : "border-gray-200"
              } focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none resize-none text-gray-900`}
              placeholder="متن مقاله را وارد کنید..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* تاریخ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تاریخ انتشار <span className="text-red-500">*</span>
            </label>
            <DatePicker
              value={formData.publish_date}
              onChange={handleDateChange}
              placeholder="انتخاب تاریخ"
            />
            {errors.publish_date && (
              <p className="mt-1 text-sm text-red-500">{errors.publish_date}</p>
            )}
          </div>

          {/* تصویر - مثل AddProduct */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-100">
              تصویر مقاله{" "}
              {mode === "create" && <span className="text-red-500">*</span>}
            </h2>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                {image && image.status !== "success" && !image.isExisting && (
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    disabled={image.status === "uploading"}
                    className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition disabled:opacity-50"
                  >
                    {image.status === "uploading" ? "در حال آپلود..." : "آپلود"}
                  </button>
                )}
              </div>
              {image && (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="relative w-20 h-20">
                    <Image
                      src={image.preview}
                      alt="پیش‌نمایش"
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                      unoptimized={true}
                    />
                  </div>
                  <div className="flex-1">
                    <StatusBadge
                      status={image.isExisting ? "success" : image.status}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="text-red-500 hover:text-red-700"
                  >
                    حذف
                  </button>
                </div>
              )}
              {errors.image && (
                <p className="text-sm text-red-500">{errors.image}</p>
              )}
            </div>
          </div>

          {errors.submit && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-center whitespace-pre-wrap text-sm">
              {errors.submit}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50"
            >
              {loading
                ? "در حال ذخیره..."
                : isEdit
                  ? "ویرایش مقاله"
                  : "افزودن مقاله"}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium transition-all"
            >
              انصراف
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}