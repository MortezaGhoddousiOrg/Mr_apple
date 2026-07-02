"use client";

import { useState, useEffect } from "react";

export default function Header({ toggleSidebar, isSidebarOpen }) {
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString("fa-IR", {
                hour: "2-digit",
                minute: "2-digit",
            });
            const dateString = now.toLocaleDateString("fa-IR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            });
            setCurrentTime(`${dateString} | ${timeString}`);
        };

        updateTime();
        const interval = setInterval(updateTime, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <header className="fixed top-0 right-0 left-0 h-16 bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg z-50">
            <div className="h-full px-3 sm:px-4 md:px-6 flex justify-between items-center">
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* ✅ دکمه همبرگر - تا 768px */}
                    <button
                        onClick={toggleSidebar}
                        className="md:hidden text-white hover:text-blue-200 transition-colors p-1"
                        aria-label="Toggle sidebar"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isSidebarOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>

                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                            className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-white text-base sm:text-xl md:text-2xl font-bold tracking-tight whitespace-nowrap">
                        پنل مدیریت
                    </h2>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="hidden sm:flex items-center gap-2 text-white/90 text-xs md:text-sm">
                        <svg
                            className="w-3 h-3 md:w-4 md:h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <span className="hidden md:inline">{currentTime}</span>
                        <span className="md:hidden text-xs">
                            {currentTime.split("|")[1] || ""}
                        </span>
                    </div>

                    <button className="relative text-white hover:text-blue-200 transition-colors">
                        <svg
                            className="w-5 h-5 sm:w-6 sm:h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            />
                        </svg>
                        <span className="absolute -top-1 -left-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    </button>
                </div>
            </div>
        </header>
    );
}