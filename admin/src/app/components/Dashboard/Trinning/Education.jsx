"use client";

import { useState, useEffect, Fragment } from "react";
import Image from "next/image";
import { api, MEDIA_URL } from "@/app/config";
import { useNotification } from "@/app/Context/NotificationContext";
import AddEducation from "./AddEducation";

export default function Education() {
  const { setNotif } = useNotification();
  const [activeTab, setActiveTab] = useState("news");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddArticle, setShowAddArticle] = useState(false);
  const [editArticleData, setEditArticleData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, [activeTab]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const endpoint =
        activeTab === "news" ? "/education/news/" : "/education/tutorials/";
      const response = await api.get(endpoint);
      setArticles(response.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setNotif({
        id: Date.now(),
        message: "خطا در دریافت لیست مقالات",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddArticle = () => {
    setEditArticleData(null);
    setShowAddArticle(true);
  };

  const handleBackToList = () => {
    setShowAddArticle(false);
    setEditArticleData(null);
    fetchArticles();
  };

  const handleEdit = (article) => {
    setEditArticleData({
      ...article,
      type: activeTab,
      publish_date: article.publish_date || article.date,
    });
    setShowAddArticle(true);
  };

  const handleDelete = (article) => {
    setSelectedArticle(article);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedArticle) return;
    setDeleteLoading(true);
    try {
      const endpoint =
        activeTab === "news"
          ? `/education/admin/news/${selectedArticle.id}/`
          : `/education/admin/tutorials/${selectedArticle.id}/`;

      await api.delete(endpoint);

      setNotif({
        id: Date.now(),
        message: "مقاله با موفقیت حذف شد",
        type: "success",
      });

      setShowDeleteModal(false);
      setSelectedArticle(null);
      fetchArticles();
    } catch (error) {
      console.error("Error deleting article:", error);
      setNotif({
        id: Date.now(),
        message: "خطا در حذف مقاله",
        type: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  if (showAddArticle) {
    return (
      <AddEducation
        mode={editArticleData ? "edit" : "create"}
        initialData={editArticleData}
        onBack={handleBackToList}
      />
    );
  }

  const filteredArticles = articles.filter(
    (item) =>
      item.title?.includes(searchTerm) ||
      item.description?.includes(searchTerm),
  );

  const getTypeLabel = (type) => {
    return type === "news" ? "خبر" : "آموزش";
  };

  const getTypeColor = (type) => {
    return type === "news"
      ? "bg-blue-100 text-blue-800"
      : "bg-purple-100 text-purple-800";
  };

  // ✅ اصلاح: فقط تاریخ رو نمایش بده (بدون ساعت)
  const formatDate = (date) => {
    if (!date) return "---";
    // اگر تاریخ شامل T بود (فرمت ISO)، فقط قسمت تاریخ رو بگیر
    if (date.includes('T')) {
      const parts = date.split('T');
      return parts[0] || "---";
    }
    return date;
  };

  return (
    <Fragment>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
              مدیریت مقالات
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              مدیریت اخبار و آموزش‌های سایت
            </p>
          </div>
          <button
            onClick={handleAddArticle}
            className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all flex items-center gap-2"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            افزودن مقاله جدید
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("news")}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === "news"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            اخبار
          </button>
          <button
            onClick={() => setActiveTab("tutorial")}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === "tutorial"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            آموزش‌ها
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="جستجوی مقالات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900"
          />
        </div>

        {/* Articles List */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            در حال بارگذاری...
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {searchTerm ? "نتیجه‌ای یافت نشد" : "هیچ مقاله‌ای وجود ندارد"}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-700">
                      تصویر
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-700">
                      عنوان
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 hidden md:table-cell">
                      توضیحات
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 hidden lg:table-cell">
                      تاریخ
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-700">
                      نوع
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredArticles.map((article) => (
                    <tr
                      key={article.id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                          {article.image ? (
                            <Image
                              src={`${MEDIA_URL}${article.image}`}
                              alt={article.title}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                              unoptimized={true}
                            />
                          ) : (
                            <svg
                              className="w-8 h-8 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 line-clamp-2">
                          {article.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                          {article.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="text-sm text-gray-600">
                          {formatDate(article.publish_date)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium ${getTypeColor(article.type)}`}
                        >
                          {getTypeLabel(article.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(article)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                            title="ویرایش"
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(article)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                            title="حذف"
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
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 text-sm text-gray-500">
          نمایش {filteredArticles.length} از {articles.length} مقاله
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && selectedArticle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
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

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              حذف مقاله
            </h3>

            <p className="text-gray-500 mb-6">
              آیا از حذف مقاله "{selectedArticle.title}" مطمئن هستید؟
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-xl font-medium transition"
              >
                انصراف
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-medium transition disabled:opacity-50"
              >
                {deleteLoading ? "در حال حذف..." : "حذف"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}