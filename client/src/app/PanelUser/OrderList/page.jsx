import styles from "@/app/PanelUser/OrderList/page.module.css";

export default function OrdersList() {
  const orders = [
    { id: "ORD-1024", date: "1403/11/02", status: "delivered", label: "تحویل شده", total: "1,250,000" },
    { id: "ORD-1025", date: "1403/11/08", status: "processing", label: "در حال ارسال ", total: "890,000" },
    { id: "ORD-1026", date: "1403/11/10", status: "cancelled", label: "لغو شده", total: "420,000" },
  ];

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>سفارش‌های اخیر</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>کد سفارش</th>
              <th>تاریخ</th>
              <th>وضعیت</th>
              <th>مبلغ</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.date}</td>
                <td>
                  {/* اضافه کردن کلاس پویا بر اساس وضعیت */}
                  <span className={`${styles.badge} ${styles[order.status]}`}>
                    {order.label}
                  </span>
                </td>
                <td className={styles.price}>{order.total} <span className={styles.unit}>تومان</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
