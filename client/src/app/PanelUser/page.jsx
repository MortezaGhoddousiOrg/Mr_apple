// "use client";
// import { useState } from "react";
// import styles from "./page.module.css";
// // کامپوننت‌هایی که باید بسازید (فایل‌های جداگانه)
// import OrdersList from "@/app/PanelUser/OrderList/page";
// import ProfileSettings from "@/app/PanelUser/ProfileSetting/page";
// // import Addresses from "./components/Addresses";

// export default function PanelUser() {
//   const [activeTab, setActiveTab] = useState("orders");

//   const menuItems = [
//     { id: "orders", title: "سفارش‌های من" },
//     { id: "profile", title: "اطلاعات حساب" },
//     { id: "addresses", title: "آدرس‌ها" },
//   ];

//   const renderContent = () => {
//     switch (activeTab) {
//       case "orders": return <OrdersList />;
//       case "profile": return <ProfileSettings />;
//       case "addresses": return <Addresses />;
//       default: return <OrdersList />;
//     }
//   };

//   return (
//     <section className={styles.panelContainer}>
//       <aside className={styles.sidebar}>
//         <div className={styles.sidebarHeader}>پنل کاربری</div>
//         <nav className={styles.menu}>
//           {menuItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => setActiveTab(item.id)}
//               className={`${styles.menuItem} ${activeTab === item.id ? styles.active : ""}`}
//             >
//               {item.title}
//             </button>
//           ))}
//         </nav>
//       </aside>

//       <main className={styles.content}>
//         {renderContent()}
//       </main>
//     </section>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

// فرض بر این است که این کامپوننت‌ها را دارید
import OrdersList from "@/app/PanelUser/OrderList/page";
import ProfileSettings from "@/app/PanelUser/ProfileSetting/page";

export default function PanelUser() {
  const [activeTab, setActiveTab] = useState("orders");
  const router = useRouter();
  const [panelUser, setPanelUser] = useState();

  useEffect(() => {
    const local = localStorage.getItem("user");
    if (local) {
      setPanelUser(true);
      // router.push("/");
      
    } else {
      setPanelUser(false);
      router.push("/Login");
    }

  }, []);

  // useEffect(() => {
   
  // }, [panelUser]);

  const menuItems = [
    { id: "orders", title: "سفارش‌های من" },
    { id: "profile", title: "اطلاعات حساب" },
    // { id: "addresses", title: "آدرس‌ها" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "orders":
        return <OrdersList />;
      case "profile":
        return <ProfileSettings />;
      // default: return <OrdersList />;
    }
  };

  return (
    <section className={styles.panelWrapper}>
      <div className={styles.panelContainer}>
        {/* سایدبار سمت راست */}
        <aside className={styles.sidebar}>
          <div className={styles.containerProfile}>
            <img src="/image-about/images (3).jfif" alt="profile" />
            <p>username</p>
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

        {/* محتوای اصلی */}
        <main className={styles.content}>{renderContent()}</main>
      </div>
    </section>
  );
}
