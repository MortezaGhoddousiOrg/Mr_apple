"use client";

import { useState, useEffect, Fragment } from "react";
import { api } from "@/app/config";
import { useNotification } from "@/app/Context/NotificationContext";

function Orders() {
  const { setNotif } = useNotification();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const ordersPerPage = 20;

  // گرفتن لیست سفارشات از endpoint ادمین
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/orders/admin/");
      setOrders(response.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setNotif({
        id: Date.now(),
        message: "خطا در دریافت لیست سفارشات",
        type: "error",
      });
      setError("خطا در دریافت لیست سفارشات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  // پیجینیشن
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  // فرمت قیمت
  const formatPrice = (price) => {
    return new Intl.NumberFormat("fa-IR").format(price);
  };

  // فرمت تاریخ
  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // وضعیت سفارش (فارسی)
  const getStatusBadge = (status, type = "order") => {
    const config = {
      order: {
        pending: { label: "در انتظار", color: "bg-yellow-50 text-yellow-700" },
        paid: { label: "پرداخت شده", color: "bg-green-50 text-green-700" },
        processing: {
          label: "در حال پردازش",
          color: "bg-blue-50 text-blue-700",
        },
        shipped: { label: "ارسال شده", color: "bg-purple-50 text-purple-700" },
        delivered: {
          label: "تحویل داده شده",
          color: "bg-green-50 text-green-700",
        },
        cancelled: { label: "لغو شده", color: "bg-red-50 text-red-700" },
      },
      product: {
        pending: { label: "در انتظار", color: "bg-yellow-50 text-yellow-700" },
        preparing: {
          label: "در حال آماده‌سازی",
          color: "bg-blue-50 text-blue-700",
        },
        ready: { label: "آماده ارسال", color: "bg-purple-50 text-purple-700" },
        shipped: { label: "ارسال شده", color: "bg-indigo-50 text-indigo-700" },
        delivered: {
          label: "تحویل داده شده",
          color: "bg-green-50 text-green-700",
        },
      },
      payment: {
        pending: {
          label: "در انتظار پرداخت",
          color: "bg-yellow-50 text-yellow-700",
        },
        paid: { label: "پرداخت شده", color: "bg-green-50 text-green-700" },
        failed: { label: "ناموفق", color: "bg-red-50 text-red-700" },
        refunded: { label: "بازگشت وجه", color: "bg-gray-50 text-gray-700" },
      },
    };
    const typeConfig = config[type] || config.order;
    const { label, color } = typeConfig[status] || {
      label: status,
      color: "bg-gray-50 text-gray-700",
    };
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${color}`}>
        {label}
      </span>
    );
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
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-6xl">📦</div>
        <p className="text-gray-500">{error}</p>
        <button
          onClick={fetchOrders}
          className="mt-4 text-blue-500 hover:text-blue-600 text-sm"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-6xl">📦</div>
        <h2 className="text-xl font-semibold text-gray-700">
          سفارشی وجود ندارد
        </h2>
        <p className="text-gray-400 text-sm">هنوز هیچ سفارشی ثبت نشده است</p>
      </div>
    );
  }

  return (
    <Fragment>
      <section className="p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
            سفارشات
            <span className="text-sm font-normal text-gray-500 mr-2">
              ({orders.length})
            </span>
          </h1>
        </div>

        {/* دسکتاپ */}
        <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                  شماره سفارش
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                  نام کاربر
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                  مبلغ کل
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                  وضعیت
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                  تاریخ ثبت
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                  تعداد اقلام
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-mono text-sm text-gray-900">
                      {order.order_number}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.user?.firstname} {order.user?.lastname}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {formatPrice(order.total_amount)} تومان
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {getStatusBadge(order.status, "order")}
                      {getStatusBadge(order.payment_status, "payment")}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.total_quantity} قلم
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => viewOrderDetails(order)}
                      className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                    >
                      مشاهده جزییات
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* موبایل */}
        <div className="lg:hidden space-y-4">
          {currentOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="font-mono text-sm font-medium text-gray-900">
                  {order.order_number}
                </div>
                <div className="flex flex-wrap gap-1">
                  {getStatusBadge(order.status, "order")}
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">نام کاربر:</span>
                  <span className="text-gray-900">
                    {order.user?.firstname} {order.user?.lastname}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">مبلغ کل:</span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(order.total_amount)} تومان
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">تاریخ ثبت:</span>
                  <span className="text-gray-600">
                    {formatDate(order.created_at)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">تعداد اقلام:</span>
                  <span className="text-gray-600">
                    {order.total_quantity} قلم
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50">
                <button
                  onClick={() => viewOrderDetails(order)}
                  className="w-full text-blue-500 hover:text-blue-600 text-sm font-medium py-1"
                >
                  مشاهده جزییات سفارش
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

        {/* Info text */}
        {orders.length > 0 && (
          <div className="text-center text-gray-500 text-sm mt-4">
            نمایش {indexOfFirstOrder + 1} تا{" "}
            {Math.min(indexOfLastOrder, orders.length)} از {orders.length} سفارش
          </div>
        )}
      </section>

      {/* مودال جزییات سفارش */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                جزییات سفارش {selectedOrder.order_number}
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* اطلاعات کاربر */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  اطلاعات کاربر
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">نام:</span>{" "}
                    {selectedOrder.user?.firstname}{" "}
                    {selectedOrder.user?.lastname}
                  </div>
                  <div>
                    <span className="text-gray-500">تلفن:</span>{" "}
                    {selectedOrder.user?.phone}
                  </div>
                  <div>
                    <span className="text-gray-500">ایمیل:</span>{" "}
                    {selectedOrder.user?.email || "—"}
                  </div>
                </div>
              </div>

              {/* وضعیت‌ها */}
              <div className="flex flex-wrap gap-3">
                <div>
                  <span className="text-gray-500 text-sm">وضعیت سفارش:</span>{" "}
                  {getStatusBadge(selectedOrder.status, "order")}
                </div>
                <div>
                  <span className="text-gray-500 text-sm">وضعیت پرداخت:</span>{" "}
                  {getStatusBadge(selectedOrder.payment_status, "payment")}
                </div>
                <div>
                  <span className="text-gray-500 text-sm">وضعیت محصولات:</span>{" "}
                  {getStatusBadge(selectedOrder.product_status, "product")}
                </div>
              </div>

              {/* لیست محصولات */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  محصولات سفارش
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-right">محصول</th>
                        <th className="px-4 py-2 text-center">تعداد</th>
                        <th className="px-4 py-2 text-left">قیمت واحد</th>
                        <th className="px-4 py-2 text-left">قیمت کل</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedOrder.items?.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3">
                            <div>
                              <div className="font-medium">
                                {item.product_name}
                              </div>
                              <div className="text-xs text-gray-400">
                                {item.product_code}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-left">
                            {formatPrice(item.price)} تومان
                          </td>
                          <td className="px-4 py-3 text-left">
                            {formatPrice(item.total_price)} تومان
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td
                          colSpan="3"
                          className="px-4 py-3 text-left font-semibold"
                        >
                          مجموع:
                        </td>
                        <td className="px-4 py-3 text-left font-bold">
                          {formatPrice(selectedOrder.total_amount)} تومان
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* آدرس و توضیحات */}
              {selectedOrder.shipping_address?.address && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    آدرس ارسال
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.shipping_address.address}
                  </p>
                  {selectedOrder.shipping_address.postal_code && (
                    <p className="text-sm text-gray-500 mt-1">
                      کد پستی: {selectedOrder.shipping_address.postal_code}
                    </p>
                  )}
                </div>
              )}
              {selectedOrder.notes && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">توضیحات</h3>
                  <p className="text-sm text-gray-600">{selectedOrder.notes}</p>
                </div>
              )}

              {/* تاریخ‌ها */}
              <div className="text-xs text-gray-400 border-t pt-4">
                <div>تاریخ ثبت: {formatDate(selectedOrder.created_at)}</div>
                {selectedOrder.paid_at && (
                  <div>تاریخ پرداخت: {formatDate(selectedOrder.paid_at)}</div>
                )}
                {selectedOrder.shipped_at && (
                  <div>تاریخ ارسال: {formatDate(selectedOrder.shipped_at)}</div>
                )}
                {selectedOrder.delivered_at && (
                  <div>
                    تاریخ تحویل: {formatDate(selectedOrder.delivered_at)}
                  </div>
                )}
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-xl font-medium transition"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default Orders;
