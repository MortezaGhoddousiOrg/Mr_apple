"use client";

import { useState, useEffect } from "react";
import { api, MEDIA_URL } from "@/app/config";
import AddCategory from "./AddCategory";
import { useNotification } from "@/app/Context/NotificationContext";

export default function Category() {
  const { setNotif } = useNotification();
  const [parents, setParents] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [activeTab, setActiveTab] = useState("parent");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      if (deleteTarget.type === "parent") {
        await api.delete(`/api/category/parent/${deleteTarget.id}/`);
      } else {
        await api.delete(`/api/category/child/${deleteTarget.id}/`);
      }

      setNotif({
        id: Date.now(),
        message: `${deleteTarget.type === "parent" ? "دسته‌بندی اصلی" : "دسته‌بندی فرعی"} با موفقیت حذف شد`,
        type: "success",
      });

      setShowDeleteModal(false);
      setDeleteTarget(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      setNotif({
        id: Date.now(),
        message: `خطا در حذف ${deleteTarget.type === "parent" ? "دسته‌بندی اصلی" : "دسته‌بندی فرعی"}`,
        type: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeleteModal = (id, type, title) => {
    setDeleteTarget({ id, type, title });
    setShowDeleteModal(true);
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

      <div className="flex gap-2 border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab("parent")}
          className={`px-4 sm:px-6 py-3 text-sm font-medium rounded-t-xl transition-all whitespace-nowrap ${
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
          className={`px-4 sm:px-6 py-3 text-sm font-medium rounded-t-xl transition-all whitespace-nowrap ${
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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
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
                <>
                  <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
                                  src={`${MEDIA_URL}${p.image}`}
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
                                  onClick={() =>
                                    openDeleteModal(p.id, "parent", p.title)
                                  }
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

                  <div className="lg:hidden space-y-3">
                    {parents.map((p) => (
                      <div
                        key={p.id}
                        className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          {p.image ? (
                            <img
                              src={`${MEDIA_URL}${p.image}`}
                              alt={p.title}
                              className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl text-gray-400">
                              📁
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {p.title}
                            </h3>
                            <p className="text-xs text-gray-400 font-mono">
                              شناسه: {p.id}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-3 border-t border-gray-50">
                          <button
                            onClick={() => handleEditParent(p)}
                            className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-xl text-sm font-medium"
                          >
                            ویرایش
                          </button>
                          <button
                            onClick={() =>
                              openDeleteModal(p.id, "parent", p.title)
                            }
                            className="flex-1 bg-red-50 text-red-600 py-2 rounded-xl text-sm font-medium"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

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
                <>
                  <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
                                  src={`${MEDIA_URL}${c.image}`}
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
                                  onClick={() =>
                                    openDeleteModal(c.id, "child", c.title)
                                  }
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

                  <div className="lg:hidden space-y-3">
                    {children.map((c) => (
                      <div
                        key={c.id}
                        className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          {c.image ? (
                            <img
                              src={`${MEDIA_URL}${c.image}`}
                              alt={c.title}
                              className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl text-gray-400">
                              📂
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {c.title}
                            </h3>
                            <p className="text-xs text-gray-400">
                              {c.parent?.title || "بدون والد"} • شناسه: {c.id}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-3 border-t border-gray-50">
                          <button
                            onClick={() => handleEditChild(c)}
                            className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-xl text-sm font-medium"
                          >
                            ویرایش
                          </button>
                          <button
                            onClick={() =>
                              openDeleteModal(c.id, "child", c.title)
                            }
                            className="flex-1 bg-red-50 text-red-600 py-2 rounded-xl text-sm font-medium"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}

      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-red-500"
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
            <h3 className="text-lg font-semibold mb-2">حذف دسته‌بندی</h3>
            <p className="text-gray-600 mb-6">
              آیا از حذف دسته‌بندی "{deleteTarget.title}" مطمئن هستید؟
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteTarget(null);
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-medium transition"
              >
                انصراف
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    در حال حذف...
                  </>
                ) : (
                  "حذف"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
