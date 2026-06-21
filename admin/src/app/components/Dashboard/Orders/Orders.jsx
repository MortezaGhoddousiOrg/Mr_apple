"use client";
 
import { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/app/config";
import { useNotification } from "@/app/Context/NotificationContext";
 
const STATUS_CONFIG = {
  pending: { label: "در انتظار", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  paid: { label: "پرداخت شده", color: "bg-green-50 text-green-700 border-green-200" },
  processing: { label: "در حال پردازش", color: "bg-blue-50 text-blue-700 border-blue-200" },
  shipped: { label: "ارسال شده", color: "bg-purple-50 text-purple-700 border-purple-200" },
  delivered: { label: "تحویل داده شده", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  cancelled: { label: "لغو شده", color: "bg-red-50 text-red-700 border-red-200" },
};
 
const STATUS_OPTIONS = [
  { value: "pending", label: "در انتظار" },
  { value: "processing", label: "در حال پردازش" },
  { value: "shipped", label: "ارسال شده" },
  { value: "delivered", label: "تحویل داده شده" },
  { value: "cancelled", label: "لغو شده" },
];
 
function Orders() {
  const { setNotif } = useNotification();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [updating, setUpdating] = useState(false);
  const ordersPerPage = 20;
 
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const response = await api.get("/api/auth/admin/me/");
        if (response.data.is_staff === true) {
          setCheckingAuth(false);
          fetchOrders();
        } else {
          setNotif({ id: Date.now(), message: "شما دسترسی ادمین ندارید", type: "error" });
          router.push("/");
        }
      } catch (error) {
        setNotif({ id: Date.now(), message: "خطا در بررسی دسترسی ادمین", type: "error" });
        router.push("/");
      }
    };
    checkAdminAccess();
  }, []);
 
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/orders/admin/");
      setOrders(response.data);
    } catch (err) {
      setNotif({ id: Date.now(), message: "خطا در دریافت لیست سفارشات", type: "error" });
      setError("خطا در دریافت لیست سفارشات");
    } finally {
      setLoading(false);
    }
  };
 
  const openStatusModal = (order, currentStatus) => {
    setUpdatingOrder(order);
    setSelectedStatus(currentStatus);
    setShowStatusModal(true);
  };
 
  const handleStatusChange = async () => {
    if (!updatingOrder) return;
    setUpdating(true);
    try {
      await api.put(`/api/orders/admin/${updatingOrder.id}/`, { status: selectedStatus });
      setNotif({ id: Date.now(), message: "وضعیت سفارش با موفقیت تغییر کرد", type: "success" });
      fetchOrders();
      setShowStatusModal(false);
      setUpdatingOrder(null);
    } catch (err) {
      setNotif({ id: Date.now(), message: "خطا در تغییر وضعیت سفارش", type: "error" });
    } finally {
      setUpdating(false);
    }
  };
 
  const formatPrice = (price) => new Intl.NumberFormat("fa-IR").format(price);
 
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
 
  // بج وضعیت — قابل کلیک با آیکون ویرایش
  const StatusBadge = ({ order }) => {
    const config = STATUS_CONFIG[order.status] || { label: order.status, color: "bg-gray-50 text-gray-700 border-gray-200" };
    return (
      <button
        onClick={() => openStatusModal(order, order.status)}
        title="کلیک کنید تا وضعیت را تغییر دهید"
        className={`
          inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border
          whitespace-nowrap transition-all duration-150
          hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer
          ${config.color}
        `}
      >
        {config.label}
        <svg className="w-3 h-3 opacity-60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>
    );
  };
 
  // دکمه مشاهده جزییات
  const DetailButton = ({ order, mobile = false }) => (
    <button
      onClick={() => { setSelectedOrder(order); setShowDetailModal(true); }}
      className={`
        inline-flex items-center gap-1.5 text-sm font-medium
        text-blue-600 hover:text-blue-800
        border border-blue-200 hover:border-blue-400
        bg-blue-50 hover:bg-blue-100
        px-3 py-1.5 rounded-lg
        transition-all duration-150 hover:shadow-sm active:scale-95
        ${mobile ? "w-full justify-center mt-3 pt-3 border-t-0 border border-blue-200" : ""}
      `}
    >
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      مشاهده جزییات
    </button>
  );
 
  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(orders.length / ordersPerPage);
 
  if (checkingAuth) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="text-gray-500 text-sm">در حال بررسی دسترسی...</p>
      </div>
    );
  }
 
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
        <button onClick={fetchOrders} className="mt-4 text-blue-500 hover:text-blue-600 text-sm">
          تلاش مجدد
        </button>
      </div>
    );
  }
 
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-6xl">📦</div>
        <h2 className="text-xl font-semibold text-gray-700">سفارشی وجود ندارد</h2>
        <p className="text-gray-400 text-sm">هنوز هیچ سفارشی ثبت نشده است</p>
      </div>
    );
  }
 
  return (
    <Fragment>
      <section className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
            سفارشات{" "}
            <span className="text-sm font-normal text-gray-500 mr-2">({orders.length})</span>
          </h1>
        </div>
 
        {/* راهنما */}
        <div className="mb-4 flex flex-wrap gap-3 text-xs text-gray-400">
          <span className="inline-flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M16.732 3.732a2.5 2.5 0 013.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            روی وضعیت کلیک کنید تا تغییر دهید
          </span>
          <span className="inline-flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            روی مشاهده جزییات کلیک کنید
          </span>
        </div>
 
        {/* دسکتاپ */}
        <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">شماره سفارش</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">نام کاربر</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">مبلغ کل</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">تعداد</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">وضعیت</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">تاریخ ثبت</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-mono text-sm text-gray-900">{order.order_number}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.user?.firstname} {order.user?.lastname}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 text-sm">
                    {formatPrice(order.total_amount)} تومان
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.total_quantity} عدد</td>
                  <td className="px-6 py-4">
                    <StatusBadge order={order} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(order.created_at)}</td>
                  <td className="px-6 py-4">
                    <DetailButton order={order} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
 
        {/* موبایل و تبلت */}
        <div className="lg:hidden space-y-3">
          {currentOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              {/* ردیف اول: شماره + وضعیت */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="font-mono text-sm font-medium text-gray-900 truncate">
                  {order.order_number}
                </div>
                {/* وضعیت — در یک خط می‌ماند */}
                <div className="flex-shrink-0">
                  <StatusBadge order={order} />
                </div>
              </div>
 
              {/* اطلاعات */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">کاربر</p>
                  <p className="text-gray-900 font-medium truncate">
                    {order.user?.firstname} {order.user?.lastname}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">مبلغ کل</p>
                  <p className="text-gray-900 font-medium">{formatPrice(order.total_amount)} ت</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">تعداد محصول</p>
                  <p className="text-gray-600">{order.total_quantity} عدد</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">تاریخ ثبت</p>
                  <p className="text-gray-600 text-xs">{formatDate(order.created_at)}</p>
                </div>
              </div>
 
              {/* دکمه جزییات */}
              <div className="mt-3 pt-3 border-t border-gray-50">
                <DetailButton order={order} mobile />
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
              className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 disabled:opacity-50 hover:bg-gray-200 transition"
            >
              قبلی
            </button>
            <span className="px-4 py-2 text-gray-700">
              صفحه {currentPage} از {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 disabled:opacity-50 hover:bg-gray-200 transition"
            >
              بعدی
            </button>
          </div>
        )}
      </section>
 
      {/* مودال جزییات سفارش */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                جزییات سفارش {selectedOrder.order_number}
              </h2>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* اطلاعات کاربر */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">اطلاعات کاربر</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">نام:</span>{" "}
                    <span className="text-gray-900">{selectedOrder.user?.firstname} {selectedOrder.user?.lastname}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">تلفن:</span>{" "}
                    <span className="text-gray-900">{selectedOrder.user?.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">ایمیل:</span>{" "}
                    <span className="text-gray-900">{selectedOrder.user?.email || "—"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500"> آدرس:</span>{" "}
                    <span className="text-gray-900">{selectedOrder.user?.address || "—"}</span>
                  </div>
                </div>
              </div>
 
              {/* محصولات */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">محصولات سفارش</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-right text-gray-700">محصول</th>
                        <th className="px-4 py-2 text-center text-gray-700">تعداد</th>
                        <th className="px-4 py-2 text-left text-gray-700">قیمت واحد</th>
                        <th className="px-4 py-2 text-left text-gray-700">قیمت کل</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedOrder.items?.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{item.product_name}</div>
                            <div className="text-xs text-gray-500">{item.product_code}</div>
                          </td>
                          <td className="px-4 py-3 text-center text-gray-900">{item.quantity}</td>
                          <td className="px-4 py-3 text-left text-gray-900">{formatPrice(item.price)} تومان</td>
                          <td className="px-4 py-3 text-left text-gray-900">{formatPrice(item.total_price)} تومان</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan="3" className="px-4 py-3 text-left font-semibold text-gray-900">مجموع:</td>
                        <td className="px-4 py-3 text-left font-bold text-gray-900">{formatPrice(selectedOrder.total_amount)} تومان</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
 
              {/* آدرس */}
              {selectedOrder.shipping_address?.address && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">آدرس ارسال</h3>
                  <p className="text-sm text-gray-900">{selectedOrder.shipping_address.address}</p>
                  {selectedOrder.shipping_address.postal_code && (
                    <p className="text-sm text-gray-700 mt-1">کد پستی: {selectedOrder.shipping_address.postal_code}</p>
                  )}
                </div>
              )}
 
              {/* تاریخ‌ها */}
              <div className="text-xs border-t pt-4">
                <div className="text-gray-700">تاریخ ثبت: {formatDate(selectedOrder.created_at)}</div>
                {selectedOrder.paid_at && (
                  <div className="text-gray-700 mt-1">تاریخ پرداخت: {formatDate(selectedOrder.paid_at)}</div>
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
 
      {/* مودال تغییر وضعیت */}
      {showStatusModal && updatingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">تغییر وضعیت سفارش</h3>
            <p className="text-gray-500 text-sm mb-5">سفارش شماره: <span className="font-mono text-gray-700">{updatingOrder.order_number}</span></p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت جدید</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleStatusChange}
                disabled={updating}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-xl font-medium transition disabled:opacity-50"
              >
                {updating ? "در حال ذخیره..." : "تایید و تغییر"}
              </button>
              <button
                onClick={() => { setShowStatusModal(false); setUpdatingOrder(null); }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-xl font-medium transition"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}
 
export default Orders;