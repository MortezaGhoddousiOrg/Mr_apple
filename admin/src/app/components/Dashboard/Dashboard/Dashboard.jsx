// "use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function Dashboard() {
    const [stats, setStats] = useState({
        daily: { sales: 0, users: 0, orders: 0 },
        weekly: { sales: 0, users: 0, orders: 0 },
        monthly: { sales: 0, users: 0, orders: 0 },
    });

    const router = useRouter();
    
    useEffect(() => {
        const local = localStorage.getItem("admin");
        if (local) {
            router.push("/dashboard");
        } else {
            router.push("/");
        }
    }, []);


    // Simulate data loading
    useEffect(() => {
        // You can replace this with actual API calls
        setStats({
            daily: { sales: 12500000, users: 45, orders: 128 },
            weekly: { sales: 87600000, users: 312, orders: 856 },
            monthly: { sales: 342000000, users: 1245, orders: 3421 },
        });
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
    };

    const reportCards = [
        {
            title: "گزارش روزانه",
            icon: "☀️",
            color: "from-yellow-400 to-orange-500",
            data: stats.daily,
            borderColor: "border-yellow-200",
        },
        {
            title: "گزارش هفتگی",
            icon: "📊",
            color: "from-blue-400 to-indigo-500",
            data: stats.weekly,
            borderColor: "border-blue-200",
        },
        {
            title: "گزارش ماهانه",
            icon: "📈",
            color: "from-purple-400 to-pink-500",
            data: stats.monthly,
            borderColor: "border-purple-200",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 border-r-4 border-blue-500 pr-4">
                    داشبورد مدیریت
                </h2>
                <p className="text-gray-600 mt-2 pr-8">
                    به پنل مدیریت خوش آمدید. در اینجا می‌توانید آمار و گزارش‌های
                    خود را مشاهده کنید.
                </p>
            </div>

            {/* Statistics Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportCards.map((card, idx) => (
                    <div
                        key={idx}
                        className={`bg-gradient-to-br ${card.color} rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
                    >
                        {/* Card Header */}
                        <div className="px-6 pt-6 pb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-4xl">
                                        {card.icon}
                                    </span>
                                    <h3 className="text-white text-xl font-bold mt-2">
                                        {card.title}
                                    </h3>
                                </div>
                                <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                                    <svg
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Card Body with Stats */}
                        <div className="bg-white/10 backdrop-blur-sm px-6 py-4">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-white/80 text-sm">
                                        فروش کل:
                                    </span>
                                    <span className="text-white font-bold text-lg">
                                        {formatPrice(card.data.sales)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-white/80 text-sm">
                                        کاربران جدید:
                                    </span>
                                    <span className="text-white font-bold text-lg">
                                        {card.data.users.toLocaleString(
                                            "fa-IR",
                                        )}{" "}
                                        نفر
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-white/80 text-sm">
                                        سفارشات:
                                    </span>
                                    <span className="text-white font-bold text-lg">
                                        {card.data.orders.toLocaleString(
                                            "fa-IR",
                                        )}{" "}
                                        عدد
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Card Footer */}
                        <div className="px-6 py-3 bg-black/20">
                            <button className="text-white text-sm hover:text-white/80 transition-colors flex items-center gap-1">
                                مشاهده جزئیات
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
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detailed Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Sales Chart */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">
                            نمودار فروش
                        </h3>
                        <select className="text-sm border rounded-lg px-3 py-1 bg-gray-50">
                            <option>روزانه</option>
                            <option>هفتگی</option>
                            <option>ماهانه</option>
                        </select>
                    </div>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                        <div className="text-center text-gray-400">
                            <svg
                                className="w-16 h-16 mx-auto mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                            <p>نمودار فروش در حال بارگذاری...</p>
                            <p className="text-xs mt-2">
                                (برای نمایش نمودار واقعی، کتابخانه Chart.js را
                                نصب کنید)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                        آخرین فعالیت‌ها
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-800">
                                    سفارش جدید با شماره #12345 ثبت شد
                                </p>
                                <p className="text-xs text-gray-500">
                                    ۲ دقیقه پیش
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-800">
                                    کاربر جدیدی ثبت نام کرد
                                </p>
                                <p className="text-xs text-gray-500">
                                    ۱۵ دقیقه پیش
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-800">
                                    محصول جدید به فروشگاه اضافه شد
                                </p>
                                <p className="text-xs text-gray-500">
                                    ۱ ساعت پیش
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-800">
                                    گزارش ماهانه آماده دانلود است
                                </p>
                                <p className="text-xs text-gray-500">
                                    ۳ ساعت پیش
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                    دسترسی سریع
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="bg-white hover:bg-blue-600 text-gray-700 hover:text-white px-4 py-3 rounded-xl shadow-sm transition-all duration-200 flex flex-col items-center gap-2 group">
                        <span className="text-2xl">👥</span>
                        <span className="text-sm font-medium">
                            مدیریت کاربران
                        </span>
                    </button>
                    <button className="bg-white hover:bg-blue-600 text-gray-700 hover:text-white px-4 py-3 rounded-xl shadow-sm transition-all duration-200 flex flex-col items-center gap-2 group">
                        <span className="text-2xl">📦</span>
                        <span className="text-sm font-medium">
                            مدیریت محصولات
                        </span>
                    </button>
                    <button className="bg-white hover:bg-blue-600 text-gray-700 hover:text-white px-4 py-3 rounded-xl shadow-sm transition-all duration-200 flex flex-col items-center gap-2 group">
                        <span className="text-2xl">🛒</span>
                        <span className="text-sm font-medium">
                            مدیریت سفارشات
                        </span>
                    </button>
                    <button className="bg-white hover:bg-blue-600 text-gray-700 hover:text-white px-4 py-3 rounded-xl shadow-sm transition-all duration-200 flex flex-col items-center gap-2 group">
                        <span className="text-2xl">📊   </span>
                        <span className="text-sm font-medium">گزارشات</span>
                    </button>
                </div>
            </div>

            {/* Progress Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-white rounded-xl shadow p-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                            هدف فروش ماهانه
                        </span>
                        <span className="text-sm font-bold text-gray-800">
                            ۷۵٪
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: "75%" }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        ۳۴۲,۰۰۰,۰۰۰ از ۴۵۶,۰۰۰,۰۰۰ تومان
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow p-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                            رضایت مشتریان
                        </span>
                        <span className="text-sm font-bold text-gray-800">
                            ۸۸٪
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: "88%" }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        بر اساس ۱,۲۴۵ نظر
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow p-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                            نرخ بازگشت مشتریان
                        </span>
                        <span className="text-sm font-bold text-gray-800">
                            ۶۲٪
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: "62%" }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        افزایش ۵٪ نسبت به ماه قبل
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
