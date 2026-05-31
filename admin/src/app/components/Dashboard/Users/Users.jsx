import Image from "next/image";
import Button from "../../Button";
import { useState, Fragment } from "react";
import AddUser from "./AddUser";

function Users() {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddUser, setShowAddUser] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 20;

    const handleAddUser = () => {
        setShowAddUser(true);
    };

    const handleBackToList = () => {
        setShowAddUser(false);
    };

    const handleEdit = (user) => {
        console.log("Edit user:", user);
    };

    const handleDelete = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        console.log("Delete user:", selectedUser);
        setShowDeleteModal(false);
        setSelectedUser(null);
    };

    const users = [
        {
            id: 0,
            firstname: "Morteza",
            lastname: "Ghoddousi",
            phone: "09150471581",
            email: "morteza_ghoddousi@yahoo.com",
            status: "active",
            created_at: "2024-01-15",
            updated_at: "2024-03-20",
            image: null,
        },
        {
            id: 1,
            firstname: "AmirAli",
            lastname: "Davoudi",
            phone: "09303612548",
            email: "amiralidavoudi@gmail.com",
            status: "active",
            created_at: "2024-02-10",
            updated_at: "2024-03-18",
            image: null,
        },
        {
            id: 2,
            firstname: "Ali",
            lastname: "Taghizadeh",
            phone: "09399304835",
            email: "alitaghizadeh@gmail.com",
            status: "active",
            created_at: "2024-01-20",
            updated_at: "2024-03-15",
            image: null,
        },
        {
            id: 3,
            firstname: "Mahdieh",
            lastname: "Safa",
            phone: "09055181359",
            email: "mahdieh.mollasafa@gmail.com",
            status: "active",
            created_at: "2024-03-01",
            updated_at: "2024-03-19",
            image: null,
        },
    ];

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { label: "فعال", color: "bg-green-100 text-green-800" },
            inactive: { label: "غیرفعال", color: "bg-red-100 text-red-800" },
            pending: {
                label: "در انتظار",
                color: "bg-yellow-100 text-yellow-800",
            },
        };

        const config = statusConfig[status] || {
            label: status,
            color: "bg-gray-100 text-gray-800",
        };

        return (
            <span
                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.color}`}
            >
                {config.label}
            </span>
        );
    };

    // Show AddUser component when showAddUser is true
    if (showAddUser) {
        return <AddUser onBack={handleBackToList} />;
    }

    // Show Users list when showAddUser is false
    return (
        <Fragment>
            <section className="p-4 md:p-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        لیست کاربران
                    </h1>
                    <Button
                        clickFnc={handleAddUser}
                        text={"افزودن کاربر جدید"}
                        is_main={true}
                    />
                </div>

                {/* Desktop Table View - Hidden on mobile */}
                <div className="hidden lg:block overflow-x-auto shadow-lg rounded-lg bg-white">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-100 border-b-2 border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                                    نام و نام خانوادگی
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                                    تلفن همراه
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                                    ایمیل
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                                    وضعیت
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                                    تاریخ ثبت نام
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                                    تاریخ به روز رسانی
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                                    عملیات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentUsers.map((user, index) => (
                                <tr
                                    key={user.id}
                                    className={`hover:bg-gray-50 transition-colors duration-200 ${
                                        index % 2 === 0
                                            ? "bg-white"
                                            : "bg-gray-50"
                                    }`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0">
                                                <Image
                                                    src={
                                                        user.image
                                                            ? user.image
                                                            : "/male-avatar-KpudEwK5.webp"
                                                    }
                                                    alt="user-profile"
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full object-cover border-2 border-gray-200"
                                                />
                                            </div>
                                            <div className="font-medium text-gray-900">
                                                {user.firstname} {user.lastname}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 font-medium">
                                            {user.phone}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(user.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600">
                                            {user.created_at
                                                ? new Date(
                                                      user.created_at,
                                                  ).toLocaleDateString("fa-IR")
                                                : "---"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600">
                                            {user.updated_at
                                                ? new Date(
                                                      user.updated_at,
                                                  ).toLocaleDateString("fa-IR")
                                                : "---"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
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
                                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(user)
                                                }
                                                className="text-red-600 hover:text-red-900 transition-colors duration-200"
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

                {/* Mobile Card View - Visible only on mobile/tablet */}
                <div className="lg:hidden space-y-4">
                    {currentUsers.map((user) => (
                        <div
                            key={user.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                        >
                            {/* Card Header with Image and Name */}
                            <div className="p-4 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0">
                                        <Image
                                            src={
                                                user.image
                                                    ? user.image
                                                    : "/male-avatar-KpudEwK5.webp"
                                            }
                                            alt="user-profile"
                                            width={50}
                                            height={50}
                                            className="rounded-full object-cover border-2 border-gray-200"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 text-lg">
                                            {user.firstname} {user.lastname}
                                        </h3>
                                        <div className="mt-1">
                                            {getStatusBadge(user.status)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card Body with User Details */}
                            <div className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <span className="text-gray-600 text-sm font-medium">
                                        تلفن همراه:
                                    </span>
                                    <span className="text-gray-900 text-sm ltr text-left">
                                        {user.phone}
                                    </span>
                                </div>

                                <div className="flex justify-between items-start">
                                    <span className="text-gray-600 text-sm font-medium">
                                        ایمیل:
                                    </span>
                                    <span className="text-gray-900 text-sm text-left break-all max-w-[60%] ltr">
                                        {user.email}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm font-medium">
                                        تاریخ ثبت نام:
                                    </span>
                                    <span className="text-gray-900 text-sm">
                                        {user.created_at
                                            ? new Date(
                                                  user.created_at,
                                              ).toLocaleDateString("fa-IR")
                                            : "---"}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm font-medium">
                                        تاریخ به روز رسانی:
                                    </span>
                                    <span className="text-gray-900 text-sm">
                                        {user.updated_at
                                            ? new Date(
                                                  user.updated_at,
                                              ).toLocaleDateString("fa-IR")
                                            : "---"}
                                    </span>
                                </div>
                            </div>

                            {/* Card Footer with Action Buttons */}
                            <div className="p-4 bg-gray-50 flex gap-3">
                                <button
                                    onClick={() => handleEdit(user)}
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                        />
                                    </svg>
                                    ویرایش
                                </button>
                                <button
                                    onClick={() => handleDelete(user)}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <svg
                                        className="w-4 h-4"
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
                                    حذف
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Component */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                currentPage === 1
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            <svg
                                className="w-5 h-5 inline-block ml-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            قبلی
                        </button>

                        <div className="flex gap-2">
                            {Array.from(
                                { length: totalPages },
                                (_, i) => i + 1,
                            ).map((number) => (
                                <button
                                    key={number}
                                    onClick={() => paginate(number)}
                                    className={`w-10 h-10 rounded-lg font-medium transition-colors duration-200 ${
                                        currentPage === number
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                                >
                                    {number}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                currentPage === totalPages
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            بعدی
                            <svg
                                className="w-5 h-5 inline-block mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Info text showing current page and total items */}
                {users.length > 0 && (
                    <div className="text-center text-gray-600 text-sm mt-4">
                        نمایش {indexOfFirstUser + 1} تا{" "}
                        {Math.min(indexOfLastUser, users.length)} از{" "}
                        {users.length} کاربر
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                            <div className="p-6">
                                <div className="flex justify-center mb-4">
                                    <div className="bg-red-100 rounded-full p-3">
                                        <svg
                                            className="w-8 h-8 text-red-600"
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
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                                    حذف کاربر
                                </h3>
                                <p className="text-gray-600 text-center mb-6">
                                    آیا از حذف کاربر "{selectedUser?.firstname}{" "}
                                    {selectedUser?.lastname}" مطمئن هستید؟
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() =>
                                            setShowDeleteModal(false)
                                        }
                                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition"
                                    >
                                        انصراف
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
                                    >
                                        حذف
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </Fragment>
    );
}

export default Users;
