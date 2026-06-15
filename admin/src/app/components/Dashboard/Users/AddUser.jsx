"use client";

import { useState, useEffect } from "react";
import { api } from "@/app/config";
import { useNotification } from "@/app/Context/NotificationContext";

function AddUser({ onBack, mode = "create", initialData = null }) {
  const { setNotif } = useNotification();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    postal_code: "",
    address: "",
    role: "customer",
    status: "active",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        firstname: initialData.firstname || "",
        lastname: initialData.lastname || "",
        phone: initialData.phone || "",
        postal_code: initialData.postal_code || "",
        address: initialData.address || "",
        role: initialData.role || "customer",
        status: initialData.status || "active",
      });
    }
  }, [mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstname.trim()) newErrors.firstname = "نام الزامی است";
    if (!formData.lastname.trim())
      newErrors.lastname = "نام خانوادگی الزامی است";
    if (!formData.phone.trim()) newErrors.phone = "شماره تلفن الزامی است";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const userData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        phone: formData.phone,
        role: formData.role,
      };

      // اضافه کردن فیلدهای اختیاری (اگه پر شده بودن)
      if (formData.postal_code) userData.postal_code = formData.postal_code;
      if (formData.address) userData.address = formData.address;
      if (mode === "edit") userData.status = formData.status;

      if (mode === "edit" && initialData?.id) {
        await api.put(`/api/accounts/user/${initialData.id}`, userData);
        setNotif({
          id: Date.now(),
          message: "کاربر با موفقیت ویرایش شد",
          type: "success",
        });
      } else {
        await api.post("/api/accounts/user", userData);
        setNotif({
          id: Date.now(),
          message: "کاربر با موفقیت اضافه شد",
          type: "success",
        });
      }

      onBack();
    } catch (error) {
      console.error("Error saving user:", error);
      let msg = mode === "edit" ? "خطا در ویرایش کاربر" : "خطا در ایجاد کاربر";
      if (error.response?.data) {
        if (typeof error.response.data === "object") {
          msg = Object.entries(error.response.data)
            .map(([k, v]) => `${k}: ${v}`)
            .join("\n");
        } else {
          msg = error.response.data;
        }
      }
      setNotif({
        id: Date.now(),
        message: msg,
        type: "error",
      });
      setErrors((prev) => ({ ...prev, submit: msg }));
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    {
      id: "firstname",
      name: "firstname",
      type: "text",
      label: "نام",
      placeholder: "نام خود را وارد کنید",
      required: true,
    },
    {
      id: "lastname",
      name: "lastname",
      type: "text",
      label: "نام خانوادگی",
      placeholder: "نام خانوادگی خود را وارد کنید",
      required: true,
    },
    {
      id: "phone",
      name: "phone",
      type: "tel",
      label: "تلفن همراه",
      placeholder: "09123456789",
      required: true,
    },
    {
      id: "postal_code",
      name: "postal_code",
      type: "text",
      label: "کد پستی",
      placeholder: "کد پستی (اختیاری)",
      required: false,
    },
    {
      id: "address",
      name: "address",
      type: "text",
      label: "آدرس",
      placeholder: "آدرس کامل (اختیاری)",
      required: false,
    },
  ];

  return (
    <section className="p-4 md:p-6 max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
          {mode === "edit" ? "ویرایش کاربر" : "افزودن کاربر جدید"}
        </h1>
        <button
          onClick={onBack}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition"
        >
          بازگشت
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* نام و نام خانوادگی */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {inputFields.slice(0, 2).map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label} <span className="text-red-500">*</span>
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900 transition"
                  placeholder={field.placeholder}
                />
                {errors[field.name] && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* تلفن و کد پستی */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {inputFields.slice(2, 4).map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900 transition"
                  placeholder={field.placeholder}
                />
                {errors[field.name] && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* آدرس (اختیاری) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              آدرس
              <span className="text-gray-400 text-xs mr-1">(اختیاری)</span>
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900 transition resize-none"
              placeholder="آدرس کامل (شهر، خیابان، پلاک، ...)"
            />
          </div>

          {/* نقش کاربری */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نقش کاربری
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900"
            >
              <option value="customer">مشتری</option>
              <option value="admin">مدیر</option>
              <option value="normal">کاربر عادی</option>
            </select>
          </div>

          {/* وضعیت (فقط در ویرایش) */}
          {mode === "edit" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                وضعیت
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900"
              >
                <option value="active">فعال</option>
                <option value="inactive">غیرفعال</option>
                <option value="pending">در انتظار</option>
              </select>
            </div>
          )}

          {errors.submit && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-center text-sm whitespace-pre-wrap">
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 rounded-xl transition-all disabled:opacity-50"
          >
            {loading
              ? "در حال ذخیره..."
              : mode === "edit"
                ? "ویرایش کاربر"
                : "افزودن کاربر"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AddUser;
