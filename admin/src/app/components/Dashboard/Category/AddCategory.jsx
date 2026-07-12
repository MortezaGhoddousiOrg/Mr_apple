"use client";

import { useState, useEffect } from "react";
import { api, MEDIA_URL } from "@/app/config"; 
import { useNotification } from "@/app/Context/NotificationContext";

export default function AddCategory({ onBack, refresh, editData }) {
  const { setNotif } = useNotification();
  const [title, setTitle] = useState(editData?.title || "");
  const [type, setType] = useState(editData?.type || "parent");
  const [parentId, setParentId] = useState(editData?.parent?.id || "");
  const [parents, setParents] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchParents = async () => {
      try {
        const res = await api.get("/api/category/parent/");
        setParents(res.data);
      } catch (err) {
        console.error(err);
        setNotif({
          id: Date.now(),
          message: "خطا در دریافت لیست دسته‌بندی‌های اصلی",
          type: "error",
        });
      }
    };
    fetchParents();

    if (editData?.image) {
      setPreview(`${MEDIA_URL}${editData.image}`);
    }
  }, [editData, setNotif]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editData) {
        if (type === "parent") {
          if (image) {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("image", image);
            await api.put(`/api/category/parent/${editData.id}/`, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
          } else {
            await api.put(`/api/category/parent/${editData.id}/`, { title });
          }
        } else {
          if (image) {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("image", image);
            await api.put(`/api/category/child/${editData.id}/`, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
          } else {
            await api.put(`/api/category/child/${editData.id}/`, { title });
          }
        }
        setNotif({
          id: Date.now(),
          message: "دسته‌بندی با موفقیت ویرایش شد",
          type: "success",
        });
      } else {
        if (type === "parent") {
          const formData = new FormData();
          formData.append("title", title);
          if (image) formData.append("image", image);
          await api.post("/api/category/parent/", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          const formData = new FormData();
          formData.append("title", title);
          formData.append("parent_id", parseInt(parentId));
          if (image) formData.append("image", image);
          await api.post("/api/category/child/", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
        setNotif({
          id: Date.now(),
          message: "دسته‌بندی با موفقیت اضافه شد",
          type: "success",
        });
      }

      refresh();
      onBack();
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.message;
      setNotif({
        id: Date.now(),
        message: `خطا در ثبت اطلاعات: ${errorMsg}`,
        type: "error",
      });
    }
    setLoading(false);
  };

  return (
    <section className="max-w-3xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-6 bg-gray-50">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-black">
            {editData ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی جدید"}
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-1 sm:mt-2">
            اطلاعات دسته‌بندی را وارد کنید.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6"
        >
          <div>
            <label className="block mb-1 sm:mb-2 text-sm font-medium text-black">
              نوع دسته‌بندی
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full h-10 sm:h-12 px-3 sm:px-4 rounded-xl border border-gray-300 bg-white text-black outline-none transition-all focus:border-black focus:ring-4 focus:ring-gray-200 text-sm sm:text-base"
              disabled={!!editData}
            >
              <option value="parent">دسته‌بندی اصلی</option>
              <option value="child">دسته‌بندی فرعی</option>
            </select>
          </div>

          {type === "child" && (
            <div>
              <label className="block mb-1 sm:mb-2 text-sm font-medium text-black">
                دسته‌بندی اصلی <span className="text-red-500">*</span>
              </label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full h-10 sm:h-12 px-3 sm:px-4 rounded-xl border border-gray-300 bg-white text-black outline-none transition-all focus:border-black focus:ring-4 focus:ring-gray-200 text-sm sm:text-base"
                required={type === "child" && !editData}
              >
                <option value="">انتخاب کنید</option>
                {parents.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block mb-1 sm:mb-2 text-sm font-medium text-black">
              تصویر دسته‌بندی
              {editData && editData.image && !image && (
                <span className="text-xs text-gray-500 mr-2">
                  (در صورت تمایل تصویر جدید انتخاب کنید)
                </span>
              )}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-4 sm:p-6 hover:border-black transition-all">
              {preview && !image && (
                <div className="mb-3 sm:mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                    تصویر فعلی:
                  </p>
                  <img
                    src={preview}
                    alt="پیش‌نمایش"
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-lg"
                  />
                </div>
              )}

              {image && (
                <div className="mb-3 sm:mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                    تصویر جدید:
                  </p>
                  <img
                    src={preview}
                    alt="پیش‌نمایش جدید"
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-lg"
                  />
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm sm:text-base text-black file:mr-2 sm:file:mr-4 file:px-3 sm:file:px-4 file:py-1.5 sm:file:py-2 file:rounded-lg file:border-0 file:bg-black file:text-white file:cursor-pointer cursor-pointer"
              />
              <p className="mt-1 sm:mt-2 text-xs text-gray-400">
                فرمت‌های مجاز: JPEG, PNG, WebP
              </p>
            </div>
          </div>

          <div>
            <label className="block mb-1 sm:mb-2 text-sm font-medium text-black">
              عنوان دسته‌بندی <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="مثال: آیفون"
              className="w-full h-10 sm:h-12 px-3 sm:px-4 rounded-xl border border-gray-300 bg-white text-black placeholder:text-gray-400 outline-none transition-all focus:border-black focus:ring-4 focus:ring-gray-200 text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-1 h-10 sm:h-12 rounded-xl bg-black text-white font-medium transition-all hover:scale-[1.02] hover:bg-gray-900 disabled:opacity-50 text-sm sm:text-base"
            >
              {loading
                ? "در حال ذخیره..."
                : editData
                  ? "ویرایش دسته‌بندی"
                  : "ثبت دسته‌بندی"}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:flex-1 h-10 sm:h-12 rounded-xl border border-gray-300 bg-white text-black font-medium transition-all hover:bg-gray-100 text-sm sm:text-base"
            >
              بازگشت
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
