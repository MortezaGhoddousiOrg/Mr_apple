"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Dashboard/Header";
import SideBar from "../components/Dashboard/SideBar";
import Dashboard from "../components/Dashboard/Dashboard/Dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const [rendered, setRendered] = useState(<Dashboard />);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (!admin) {
      router.push("/");
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <SideBar
        setRendered={setRendered}
        isSidebarOpen={isSidebarOpen}
        closeSidebar={closeSidebar}
      />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <main
        className={`
        pt-16 transition-all duration-300 ease-in-out relative z-10
        ${isSidebarOpen ? "mr-72" : "mr-0"}
        md:mr-72
      `}
      >
        <div className="p-3 sm:p-4 md:p-6">{rendered}</div>
      </main>
    </div>
  );
}
