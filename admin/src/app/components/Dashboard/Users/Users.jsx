"use client";

import { useState, useEffect, Fragment } from "react";
import Image from "next/image";
import { api } from "@/app/config";
import Button from "../../Button";
import AddUser from "./AddUser";
import { useNotification } from "@/app/Context/NotificationContext";

function Users() {
  const { setNotif } = useNotification();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editUserData, setEditUserData] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editLoading, setEditLoading] = useState(false);
  const usersPerPage = 20;

  // گرفتن لیست کاربران
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/accounts/user");
      setUsers(response.data);
    } catch (err) {
      setError("خطا در دریافت لیست کاربران");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => setShowAddUser(true);
  const handleBackToList = () => {
    setShowAddUser(false);
    setEditUserData(null);
    fetchUsers();
  };

  const handleEdit = async (user) => {
    setEditLoading(true);
    try {
      const response = await api.get(`/api/accounts/user/${user.id}`);
      setEditUserData(response.data);
      setNotif({
        id: Date.now(),
        message: "اطلاعات کاربر با موفقیت بارگذاری شد",
        type: "success",
      });
    } catch (err) {
      console.error("Error fetching user for edit:", err);
      setNotif({
        id: Date.now(),
        message: "خطا در دریافت اطلاعات کاربر",
        type: "error",
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setEditLoading(true);
    try {
      await api.delete(`/api/accounts/user/${selectedUser.id}`);
      setNotif({
        id: Date.now(),
        message: "کاربر با موفقیت حذف شد",
        type: "success",
      });
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      const errorMsg = err.response?.data?.message || err.message;
      setNotif({
        id: Date.now(),
        message: `خطا در حذف کاربر: ${errorMsg}`,
        type: "error",
      });
    } finally {
      setEditLoading(false);
    }
  };

  if (editUserData) {
    return (
      <AddUser
        mode="edit"
        initialData={editUserData}
        onBack={handleBackToList}
      />
    );
  }

  if (showAddUser) return <AddUser mode="create" onBack={handleBackToList} />;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const getStatusBadge = (status) => {
    const config = {
      active: { label: "فعال", color: "bg-green-50 text-green-700" },
      inactive: { label: "غیرفعال", color: "bg-red-50 text-red-700" },
      pending: { label: "در انتظار", color: "bg-yellow-50 text-yellow-700" },
    };
    const { label, color } = config[status] || {
      label: status,
      color: "bg-gray-50 text-gray-700",
    };
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${color}`}>
        {label}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const config = {
      admin: { label: "مدیر", color: "bg-purple-50 text-purple-700" },
      customer: { label: "مشتری", color: "bg-blue-50 text-blue-700" },
      normal: { label: "کاربر عادی", color: "bg-gray-50 text-gray-700" },
    };
    const { label, color } = config[role] || {
      label: role,
      color: "bg-gray-50 text-gray-700",
    };
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${color}`}>
        {label}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return "---";
    return new Date(date).toLocaleDateString("fa-IR");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchUsers}
          className="mt-4 text-blue-500 hover:underline"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <Fragment>
      <section className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
            کاربران
            <span className="text-sm font-normal text-gray-500 mr-2">
              ({users.length})
            </span>
          </h1>
          <Button
            clickFnc={handleAddUser}
            text="افزودن کاربر جدید"
            is_main={true}
          />
        </div>

        {/* دسکتاپ */}
        <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                  نام و نام خانوادگی
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                  تلفن همراه
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                  ایمیل
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                  نقش
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                  وضعیت
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                  تاریخ ثبت نام
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 flex-shrink-0">
                        <Image
                          src="/male-avatar-KpudEwK5.webp"
                          alt="avatar"
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div className="font-medium text-gray-900">
                        {user.firstname || "—"} {user.lastname || ""}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dir-ltr">
                    {user.phone || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dir-ltr">
                    {user.email || "—"}
                  </td>
                  <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                  <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        disabled={editLoading}
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
                        onClick={() => handleDelete(user)}
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

        {/* موبایل */}
        <div className="lg:hidden space-y-4">
          {currentUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src="/male-avatar-KpudEwK5.webp"
                    alt="avatar"
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {user.firstname || "—"} {user.lastname || ""}
                  </h3>
                  <p className="text-sm text-gray-500 dir-ltr">
                    {user.phone || "—"}
                  </p>
                </div>
                <div className="flex gap-1">
                  {getRoleBadge(user.role)}
                  {getStatusBadge(user.status)}
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm text-gray-500 break-all dir-ltr">
                  {user.email || "—"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  تاریخ ثبت: {formatDate(user.created_at)}
                </p>
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-50">
                <button
                  onClick={() => handleEdit(user)}
                  className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-xl text-sm font-medium"
                >
                  ویرایش
                </button>
                <button
                  onClick={() => handleDelete(user)}
                  className="flex-1 bg-red-50 text-red-600 py-2 rounded-xl text-sm font-medium"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* پیجینیشن */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 disabled:opacity-50"
            >
              قبلی
            </button>
            <span className="px-4 py-2 text-gray-700">
              صفحه {currentPage} از {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 disabled:opacity-50"
            >
              بعدی
            </button>
          </div>
        )}

        {users.length > 0 && (
          <div className="text-center text-gray-500 text-sm mt-4">
            نمایش {indexOfFirstUser + 1} تا{" "}
            {Math.min(indexOfLastUser, users.length)} از {users.length} کاربر
          </div>
        )}

        {/* مودال حذف */}
        {showDeleteModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                🗑️
              </div>
              <h3 className="text-lg font-semibold mb-2">حذف کاربر</h3>
              <p className="text-gray-600 mb-6">
                آیا از حذف کاربر "{selectedUser.firstname || ""}{" "}
                {selectedUser.lastname || ""}" مطمئن هستید؟
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmDelete}
                  disabled={editLoading}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-medium transition disabled:opacity-50"
                >
                  {editLoading ? "در حال حذف..." : "حذف"}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-medium transition"
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </Fragment>
  );
}

export default Users;
