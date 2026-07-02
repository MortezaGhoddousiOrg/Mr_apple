"use client";

import { useEffect, useState } from "react";
import styles from "@/app/PanelUser/OrderList/page.module.css";
import { api } from "@/app/config";
import { useRouter } from "next/navigation";

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const router = useRouter();
  

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/api/orders/my-orders/");
        setOrders(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrders();
  }, []);

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "در انتظار";

      case "processing":
        return "در حال پردازش";

      case "shipped":
        return "ارسال شده";

      case "delivered":
        return "تحویل داده شده";

      case "cancelled":
        return "لغو شده";

      case "paid":
        return "پرداخت شده";

      case "failed":
        return "ناموفق";

      default:
        return status;
    }
  };

  if (orders.length === 0) {
    return (
      <div className={styles.card}>
        <div className={styles.emptyBox}>
          <h3>📦 هنوز سفارشی ثبت نکرده‌اید.</h3>

          <p>می‌توانید از بین محصولات فروشگاه، سفارش خود را ثبت کنید.</p>

          <button
            className={styles.shopButton}
            onClick={() => router.push("/Products")}
          >
            مشاهده محصولات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>سفارش‌های اخیر</h2>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ردیف</th>
              <th>کد محصول </th>
              <th>نام محصول </th>
              <th>تعداد</th>
              <th>تاریخ</th>
              <th>وضعیت</th>
              <th>مبلغ</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => {
              const item = order.items?.[0];

              if (!item) return null;

              return (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{item.product_code}</td>
                  <td>{item.product_name}</td>
                  <td>{item.quantity}</td>

                  <td>
                    {new Date(order.created_at).toLocaleDateString("fa-IR")}
                  </td>

                  <td>
                    <span
                      className={`${styles.badge} ${styles[order.status] || ""}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </td>

                  <td className={styles.price}>
                    {Number(order.total_amount).toLocaleString()}
                    <span className={styles.unit}> تومان</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
