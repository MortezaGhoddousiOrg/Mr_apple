"use client";

import { useState, useEffect } from "react";
import { api } from "@/app/config";
import AddCategory from "./AddCategory";

export default function Category() {
  const [parents, setParents] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const parentRes = await api.get("/category/parent/");
      const childRes = await api.get("/category/child/");
      setParents(parentRes.data);
      setChildren(childRes.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteParent = async (id) => {
    if (!confirm("آیا از حذف دسته‌بندی اصلی مطمئن هستید؟")) return;
    try {
      await api.delete(`/category/parent/${id}/`);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("خطا در حذف دسته‌بندی");
    }
  };

  const handleDeleteChild = async (id) => {
    if (!confirm("آیا از حذف دسته‌بندی فرعی مطمئن هستید؟")) return;
    try {
      await api.delete(`/category/child/${id}/`);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("خطا در حذف دسته‌بندی");
    }
  };

  if (showAdd || editCategory) {
    return (
      <AddCategory
        onBack={() => {
          setShowAdd(false);
          setEditCategory(null);
        }}
        refresh={fetchCategories}
        editData={editCategory}
      />
    );
  }

  return (
    <section className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">دسته‌بندی‌ها</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-900 transition-colors shadow-md"
        >
          افزودن دسته‌بندی جدید
        </button>
      </div>

      {loading ? (
        <p className="text-gray-900">در حال بارگذاری...</p>
      ) : (
        <div className="space-y-8">
          {/* Parent Categories */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              دسته‌بندی اصلی
            </h2>
            <ul className="space-y-3">
              {parents.map((p) => (
                <li
                  key={p.id}
                  className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    {p.image && (
                      <img
                        src={`http://127.0.0.1:4000${p.image}`}
                        alt={p.title}
                        className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                      />
                    )}
                    <span className="text-gray-900 font-medium">{p.title}</span>
                  </div>
                  <div className="flex gap-3">
                    {/* Refined Edit Icon */}
                    <button
                      onClick={() => setEditCategory({ ...p, type: "parent" })}
                      className="text-gray-700 hover:text-black transition-colors p-2 rounded-full hover:bg-gray-100"
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
                          d="M15.232 5.232l3.536 3.536M9 13.5V21h7.5L21 12.5 9 13.5z"
                        />
                      </svg>
                    </button>
                    {/* Delete Icon */}
                    <button
                      onClick={() => handleDeleteParent(p.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Child Categories */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              دسته‌بندی فرعی
            </h2>
            <ul className="space-y-3">
              {children.map((c) => (
                <li
                  key={c.id}
                  className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div>
                    <span className="font-medium text-gray-900">{c.title}</span>{" "}
                    -{" "}
                    <span className="text-gray-600">
                      زیرمجموعه {c.parent.title}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    {/* Refined Edit Icon */}
                    <button
                      onClick={() => setEditCategory({ ...p, type: "parent" })}
                      className="text-black-700 hover:text-black transition-colors p-2 rounded-full hover:bg-gray-100"
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
                          d="M15.232 5.232l3.536 3.536M16.5 4.5l3 3L7 20H4v-3L16.5 4.5z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteChild(c.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
