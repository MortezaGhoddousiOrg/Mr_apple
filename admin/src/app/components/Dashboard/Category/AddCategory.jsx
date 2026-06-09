"use client";

import { useState, useEffect } from "react";
import { api } from "@/app/config";

export default function AddCategory({ onBack, refresh, editData }) {
  const [title, setTitle] = useState(editData?.title || "");
  const [type, setType] = useState(editData?.type || "parent");
  const [parentId, setParentId] = useState(editData?.parent?.id || "");
  const [parents, setParents] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchParents = async () => {
      try {
        const res = await api.get("/category/parent/");
        setParents(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchParents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editData) {
        // ویرایش
        if (type === "parent") {
          const formData = new FormData();
          formData.append("title", title);
          if (image) formData.append("image", image);
          await api.put(`/category/parent/${editData.id}/`, formData);
        } else {
          await api.put(`/category/child/${editData.id}/`, { title });
        }
      } else {
        // افزودن جدید
        if (type === "parent") {
          const formData = new FormData();
          formData.append("title", title);
          if (image) formData.append("image", image);
          await api.post("/category/parent/", formData);
        } else {
          await api.post("/category/child/", { title, parent_id: parentId });
        }
      }

      refresh();
      onBack();
    } catch (err) {
      console.error(err);
      alert("خطا در ثبت اطلاعات");
    }
    setLoading(false);
  };

  return (
    <section className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-8 py-6 bg-gray-50">
          <h1 className="text-3xl font-semibold text-black">
            {editData ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی جدید"}
          </h1>

          <p className="text-gray-500 mt-2">اطلاعات دسته‌بندی را وارد کنید.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Type */}
          <div>
            <label className="block mb-2 text-sm font-medium text-black">
              نوع دسته‌بندی
            </label>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="
              w-full
              h-12
              px-4
              rounded-xl
              border
              border-gray-300
              bg-white
              text-black
              outline-none
              transition-all
              focus:border-black
              focus:ring-4
              focus:ring-gray-200
            "
            >
              <option value="parent">دسته‌بندی اصلی</option>
              <option value="child">دسته‌بندی فرعی</option>
            </select>
          </div>

          {/* Parent Select */}
          {type === "child" && (
            <div>
              <label className="block mb-2 text-sm font-medium text-black">
                دسته‌بندی اصلی
              </label>

              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="
                w-full
                h-12
                px-4
                rounded-xl
                border
                border-gray-300
                bg-white
                text-black
                outline-none
                transition-all
                focus:border-black
                focus:ring-4
                focus:ring-gray-200
              "
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

          {/* Image Upload */}
          {type === "parent" && (
            <div>
              <label className="block mb-2 text-sm font-medium text-black">
                تصویر دسته‌بندی
              </label>

              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-black transition-all">
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="
                  block
                  w-full
                  text-black
                  file:mr-4
                  file:px-4
                  file:py-2
                  file:rounded-lg
                  file:border-0
                  file:bg-black
                  file:text-white
                  file:cursor-pointer
                  cursor-pointer
                "
                />

                {image && (
                  <p className="mt-3 text-sm text-gray-600">{image.name}</p>
                )}
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block mb-2 text-sm font-medium text-black">
              عنوان دسته‌بندی
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="مثال: آیفون"
              className="
              w-full
              h-12
              px-4
              rounded-xl
              border
              border-gray-300
              bg-white
              text-black
              placeholder:text-gray-400
              outline-none
              transition-all
              focus:border-black
              focus:ring-4
              focus:ring-gray-200
            "
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="
              flex-1
              h-12
              rounded-xl
              bg-black
              text-white
              font-medium
              transition-all
              hover:scale-[1.02]
              hover:bg-gray-900
              disabled:opacity-50
            "
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
              className="
              flex-1
              h-12
              rounded-xl
              border
              border-gray-300
              bg-white
              text-black
              font-medium
              transition-all
              hover:bg-gray-100
            "
            >
              بازگشت
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
