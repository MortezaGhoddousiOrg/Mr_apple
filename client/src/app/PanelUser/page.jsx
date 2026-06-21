"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useAuth } from "../Context/Context";

import OrdersList from "@/app/PanelUser/OrderList/page";
import ProfileSettings from "@/app/PanelUser/ProfileSetting/page";
import Logout from "@/app/PanelUser/Logout/page";

export default function PanelUser() {
  const [activeTab, setActiveTab] = useState("orders");
  const router = useRouter();
  const { isLoggedIn, authLoading, dataForm } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, authLoading, router]);

  const menuItems = [
    { id: "orders", title: "سفارش‌های من" },
    { id: "profile", title: "اطلاعات حساب" },
    { id: "logout", title: "خروج" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "orders":
        return <OrdersList />;
      case "profile":
        return <ProfileSettings />;
      case "logout":
        return <Logout />;
    }
  };

  return (
    <section className={styles.panelWrapper}>
      <div className={styles.panelContainer}>
        <aside className={styles.sidebar}>
          <div className={styles.containerProfile}>
            <img src="/image-about/images (3).jfif" alt="profile" />
            {dataForm.firstname && dataForm.lastname !== "" ? (
              <p>
                {dataForm.firstname} {dataForm.lastname}
              </p>
            ) : (
              <p>username</p>
            )}
          </div>
          <div className={styles.sidebarHeader}>
            <h1 className={styles.sidebarTitle}>پنل کاربری</h1>
            <p className={styles.sidebarSubtitle}>مدیریت حساب و سفارش‌ها</p>
          </div>

          <nav className={styles.menu}>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`${styles.menuItem} ${activeTab === item.id ? styles.menuItemActive : ""}`}
              >
                <span className={styles.menuItemBullet}></span>
                <span>{item.title}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className={styles.content}>{renderContent()}</main>
      </div>
    </section>
  );
}
