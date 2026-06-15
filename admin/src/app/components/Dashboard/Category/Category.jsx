"use client";

import { useState, useEffect } from "react";
import { api } from "@/app/config";
import AddCategory from "./AddCategory";
import { useNotification } from "@/app/Context/NotificationContext";

export default function Category() {
  const { setNotif } = useNotification();
  const [parents, setParents] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [activeTab, setActiveTab] = useState("parent"); // "parent" or "child"

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const parentRes = await api.get("/api/category/parent/");
      const childRes = await api.get("/api/category/child/");
      setParents(parentRes.data);
      setChildren(childRes.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setNotif({
        id: Date.now(),
        message: "خطا در دریافت دسته‌بندی‌ها",
        type: "error",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteParent = async (id) => {
    if (!confirm("آیا از حذف دسته‌بندی اصلی مطمئن هستید؟")) return;
    try {
      await api.delete(`/api/category/parent/${id}/`);
      setNotif({
        id: Date.now(),
        message: "دسته‌بندی اصلی با موفقیت حذف شد",
        type: "success",
      });
      fetchCategories();
    } catch (err) {
      console.error(err);
      setNotif({
        id: Date.now(),
        message: "خطا در حذف دسته‌بندی اصلی",
        type: "error",
      });
    }
  };

  const handleDeleteChild = async (id) => {
    if (!confirm("آیا از حذف دسته‌بندی فرعی مطمئن هستید؟")) return;
    try {
      await api.delete(`/api/category/child/${id}/`);
      setNotif({
        id: Date.now(),
        message: "دسته‌بندی فرعی با موفقیت حذف شد",
        type: "success",
      });
      fetchCategories();
    } catch (err) {
      console.error(err);
      setNotif({
        id: Date.now(),
        message: "خطا در حذف دسته‌بندی فرعی",
        type: "error",
      });
    }
  };

  const handleEditParent = (category) => {
    setEditCategory({ ...category, type: "parent" });
  };

  const handleEditChild = (category) => {
    setEditCategory({ ...category, type: "child" });
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
    <section className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
          دسته‌بندی‌ها
        </h1>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-black text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-all shadow-md text-sm font-medium"
        >
          + افزودن دسته‌بندی جدید
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("parent")}
          className={`px-6 py-3 text-sm font-medium rounded-t-xl transition-all ${
            activeTab === "parent"
              ? "bg-white text-black border-b-2 border-black shadow-sm"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          دسته‌بندی اصلی
          <span className="mr-2 text-xs text-gray-400">({parents.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("child")}
          className={`px-6 py-3 text-sm font-medium rounded-t-xl transition-all ${
            activeTab === "child"
              ? "bg-white text-black border-b-2 border-black shadow-sm"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          دسته‌بندی فرعی
          <span className="mr-2 text-xs text-gray-400">
            ({children.length})
          </span>
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Parent Categories Tab */}
          {activeTab === "parent" && (
            <div className="space-y-4">
              {parents.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                  <div className="text-6xl mb-4">📁</div>
                  <p className="text-gray-500">دسته‌بندی اصلی وجود ندارد</p>
                  <button
                    onClick={() => setShowAdd(true)}
                    className="mt-4 text-blue-500 hover:text-blue-600 text-sm"
                  >
                    + افزودن دسته‌بندی جدید
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                          تصویر
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                          عنوان
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                          شناسه
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                          عملیات
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {parents.map((p) => (
                        <tr
                          key={p.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            {p.image ? (
                              <img
                                src={`http://127.0.0.1:4000${p.image}`}
                                alt={p.title}
                                className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                📁
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {p.title}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                            {p.id}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleEditParent(p)}
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
                                onClick={() => handleDeleteParent(p.id)}
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
              )}
            </div>
          )}

          {/* Child Categories Tab */}
          {activeTab === "child" && (
            <div className="space-y-4">
              {children.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                  <div className="text-6xl mb-4">📂</div>
                  <p className="text-gray-500">دسته‌بندی فرعی وجود ندارد</p>
                  <button
                    onClick={() => setShowAdd(true)}
                    className="mt-4 text-blue-500 hover:text-blue-600 text-sm"
                  >
                    + افزودن دسته‌بندی جدید
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                          تصویر
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                          عنوان
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                          دسته‌بندی اصلی
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                          شناسه
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                          عملیات
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {children.map((c) => (
                        <tr
                          key={c.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            {c.image ? (
                              <img
                                src={`http://127.0.0.1:4000${c.image}`}
                                alt={c.title}
                                className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                📂
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {c.title}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                              {c.parent?.title || "نامشخص"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                            {c.id}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleEditChild(c)}
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
                                onClick={() => handleDeleteChild(c.id)}
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
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
