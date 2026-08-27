"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { api, MEDIA_URL } from "@/app/config";
import Button from "../../Button";
import { useNotification } from "@/app/Context/NotificationContext";

function AddProduct({ onBack, mode = "create", initialData = null }) {
  const { setNotif } = useNotification();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    product_code: "",
    sell_price: "",
    buy_price: "",
    quantity: "",
    discount: "0",
    descriptions: "",
    more_descriptions: "",
    category_id: "",
    status: "active",
  });

  const [rawSellPrice, setRawSellPrice] = useState("");
  const [rawBuyPrice, setRawBuyPrice] = useState("");

  const [features, setFeatures] = useState([]);
  const [newFeatureKey, setNewFeatureKey] = useState("");
  const [newFeatureValue, setNewFeatureValue] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [deletedGalleryImages, setDeletedGalleryImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  // ============================================================
  // 🔥 واریانت‌های محصول (رنگ / مدت زمان / قیمت و موجودی جداگانه)
  // ============================================================
  const emptyVariantForm = {
    color: "",
    duration_months: "",
    warranty_months: "",
    price: "",
    discount: "0",
    quantity: "",
    is_active: true,
  };
  const [variants, setVariants] = useState([]);
  const [variantForm, setVariantForm] = useState(emptyVariantForm);
  const [editingVariantId, setEditingVariantId] = useState(null);
  const [variantLoading, setVariantLoading] = useState(false);
  const [variantError, setVariantError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        name: initialData.name || "",
        product_code: initialData.product_code || "",
        sell_price:
          initialData.sell_price
            ?.toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "",
        buy_price:
          initialData.buy_price
            ?.toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "",
        quantity: initialData.quantity?.toString() || "",
        discount: initialData.discount?.toString() || "0",
        descriptions: initialData.descriptions || "",
        more_descriptions: initialData.more_description || "",
        // ⚠️ فیکس مهم: «category_id» توی سریالایزر write_only است، پس
        // هیچ‌وقت توسط GET برگردانده نمی‌شود. مقدار واقعی از فیلد read-only
        // «category» (که خودِ سریالایزر برمی‌گرداند) خوانده می‌شود.
        category_id:
          (initialData.category?.id ?? initialData.category_id)?.toString() ||
          "",
        status: initialData.status || "active",
      });

      setRawSellPrice(initialData.sell_price?.toString() || "");
      setRawBuyPrice(initialData.buy_price?.toString() || "");

      if (initialData.feature && typeof initialData.feature === "object") {
        const featuresArray = Object.entries(initialData.feature).map(
          ([key, value]) => ({
            key,
            value: String(value),
          })
        );
        setFeatures(featuresArray);
      }

      // ✅ بارگذاری واریانت‌های موجود محصول
      if (initialData.variants && Array.isArray(initialData.variants)) {
        setVariants(initialData.variants);
      }

      if (initialData.images && initialData.images.length > 0) {
        const mainImg = initialData.images.find((img) => img.is_main === true);
        const galleryImgs = initialData.images.filter(
          (img) => img.is_main !== true
        );

        if (mainImg) {
          setMainImage({
            id: mainImg.id,
            preview: `${MEDIA_URL}${mainImg.image}`,
            status: "success",
            isExisting: true,
          });
        }

        if (galleryImgs.length > 0) {
          const existingGalleryImages = galleryImgs.map((img) => ({
            id: img.id,
            preview: `${MEDIA_URL}${img.image}`,
            status: "success",
            isExisting: true,
          }));
          setGalleryImages(existingGalleryImages);
        }
      }
    }
  }, [mode, initialData]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/category/child/");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setErrors((prev) => ({
        ...prev,
        category: "خطا در دریافت دسته‌بندی‌ها",
      }));
    }
  };

  const toEnglishDigits = (str) => {
    if (!str) return "";
    return str.replace(/[۰-۹]/g, (d) =>
      String.fromCharCode(d.charCodeAt(0) - 1728)
    );
  };

  const formatNumberWithCommas = (value) => {
    if (!value) return "";
    const num = toEnglishDigits(value).replace(/,/g, "");
    if (isNaN(num) || num === "") return "";
    return new Intl.NumberFormat("en-US").format(num);
  };

  const handleSellPriceChange = (e) => {
    let input = e.target.value;
    let digits = toEnglishDigits(input.replace(/[^0-9]/g, ""));
    if (digits === "") {
      setRawSellPrice("");
      setFormData((prev) => ({ ...prev, sell_price: "" }));
      return;
    }
    setRawSellPrice(digits);
    setFormData((prev) => ({
      ...prev,
      sell_price: formatNumberWithCommas(digits),
    }));
    if (errors.sell_price) setErrors((prev) => ({ ...prev, sell_price: "" }));
  };

  const handleBuyPriceChange = (e) => {
    let input = e.target.value;
    let digits = toEnglishDigits(input.replace(/[^0-9]/g, ""));
    if (digits === "") {
      setRawBuyPrice("");
      setFormData((prev) => ({ ...prev, buy_price: "" }));
      return;
    }
    setRawBuyPrice(digits);
    setFormData((prev) => ({
      ...prev,
      buy_price: formatNumberWithCommas(digits),
    }));
  };

  const handleDiscountChange = (e) => {
    let input = e.target.value;
    let digits = toEnglishDigits(input.replace(/[^0-9]/g, ""));
    if (digits === "") {
      setFormData((prev) => ({ ...prev, discount: "" }));
      return;
    }
    let num = parseInt(digits, 10);
    if (num > 100) num = 100;
    if (num < 0) num = 0;
    setFormData((prev) => ({ ...prev, discount: num.toString() }));
  };

  const uploadSingleImage = async (file, isMain) => {
    const formDataImg = new FormData();
    formDataImg.append("file", file);
    if (isMain) formDataImg.append("type", "true");
    const response = await api.post(
      "/api/catalog/product/image/upload/",
      formDataImg,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  };

  const handleMainImageUpload = async () => {
    if (!mainImage || !mainImage.file) return;
    setMainImage((prev) => ({ ...prev, status: "uploading" }));
    try {
      const uploaded = await uploadSingleImage(mainImage.file, true);
      setMainImage((prev) => ({
        ...prev,
        id: uploaded.id,
        status: "success",
        isExisting: false,
      }));
      setNotif({
        id: Date.now(),
        message: "تصویر اصلی با موفقیت آپلود شد",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      setMainImage((prev) => ({ ...prev, status: "error" }));
      setNotif({
        id: Date.now(),
        message: "خطا در آپلود تصویر اصلی",
        type: "error",
      });
    }
  };

  const handleGalleryImageUpload = async (index) => {
    const image = galleryImages[index];
    if (!image || !image.file) return;
    setGalleryImages((prev) =>
      prev.map((img, i) =>
        i === index ? { ...img, status: "uploading" } : img
      )
    );
    try {
      const uploaded = await uploadSingleImage(image.file, false);
      setGalleryImages((prev) =>
        prev.map((img, i) =>
          i === index
            ? { ...img, id: uploaded.id, status: "success", isExisting: false }
            : img
        )
      );
      setNotif({
        id: Date.now(),
        message: "تصویر گالری با موفقیت آپلود شد",
        type: "success",
      });
    } catch (error) {
      setGalleryImages((prev) =>
        prev.map((img, i) => (i === index ? { ...img, status: "error" } : img))
      );
      setNotif({
        id: Date.now(),
        message: "خطا در آپلود تصویر گالری",
        type: "error",
      });
    }
  };

  const selectMainImage = (e) => {
    const file = e.target.files[0];
    if (file)
      setMainImage({
        file,
        preview: URL.createObjectURL(file),
        id: null,
        status: "pending",
        isExisting: false,
      });
  };

  const selectGalleryImages = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: null,
      status: "pending",
      isExisting: false,
    }));
    setGalleryImages((prev) => [...prev, ...newImages]);
  };

  const removeMainImage = () => {
    if (mainImage?.preview && !mainImage.isExisting)
      URL.revokeObjectURL(mainImage.preview);
    setMainImage(null);
  };

  const removeGalleryImage = (index) => {
    const img = galleryImages[index];
    if (img.preview && !img.isExisting) URL.revokeObjectURL(img.preview);
    if (img.isExisting && img.id) {
      setDeletedGalleryImages((prev) => [...prev, img.id]);
    }
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    if (newFeatureKey.trim() && newFeatureValue.trim()) {
      setFeatures((prev) => [
        ...prev,
        { key: newFeatureKey, value: newFeatureValue },
      ]);
      setNewFeatureKey("");
      setNewFeatureValue("");
    }
  };

  const removeFeature = (index) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  // ============================================================
  // 🔥 توابع مدیریت واریانت‌ها
  // ============================================================

  const resetVariantForm = () => {
    setVariantForm(emptyVariantForm);
    setEditingVariantId(null);
    setVariantError("");
  };

  const handleVariantPriceChange = (e) => {
    const digits = toEnglishDigits(e.target.value.replace(/[^0-9]/g, ""));
    setVariantForm((prev) => ({
      ...prev,
      price: formatNumberWithCommas(digits),
    }));
  };

  const handleVariantDiscountChange = (e) => {
    let digits = toEnglishDigits(e.target.value.replace(/[^0-9]/g, ""));
    if (digits === "") {
      setVariantForm((prev) => ({ ...prev, discount: "" }));
      return;
    }
    let num = parseInt(digits, 10);
    if (num > 100) num = 100;
    if (num < 0) num = 0;
    setVariantForm((prev) => ({ ...prev, discount: num.toString() }));
  };

  const handleEditVariant = (variant) => {
    setVariantForm({
      color: variant.color || "",
      duration_months: variant.duration_months?.toString() || "",
      warranty_months: variant.warranty_months?.toString() || "",
      price: variant.price
        ? formatNumberWithCommas(variant.price.toString())
        : "",
      discount: variant.discount?.toString() || "0",
      quantity: variant.quantity?.toString() || "",
      is_active: variant.is_active !== false,
    });
    setEditingVariantId(variant.id ?? variant.localId);
  };

  const handleDeleteVariant = async (variant) => {
    const key = variant.id ?? variant.localId;

    if (variant.id) {
      // این واریانت واقعاً در بک‌اند ذخیره شده (فقط در حالت ویرایش ممکن است)
      setVariantLoading(true);
      try {
        await api.delete(`/api/catalog/variant/${variant.id}/`);
        setVariants((prev) => prev.filter((v) => v.id !== variant.id));
        setNotif({
          id: Date.now(),
          message: "واریانت حذف شد",
          type: "success",
        });
      } catch (error) {
        console.error(error);
        setNotif({
          id: Date.now(),
          message: "خطا در حذف واریانت",
          type: "error",
        });
      } finally {
        setVariantLoading(false);
      }
    } else {
      // هنوز ذخیره نشده - فقط از لیست محلی حذف می‌شود (حالت ایجاد محصول جدید)
      setVariants((prev) => prev.filter((v) => v.localId !== variant.localId));
    }

    if (editingVariantId === key) resetVariantForm();
  };

  const handleAddOrUpdateVariant = async () => {
    setVariantError("");

    const rawPrice = toEnglishDigits(variantForm.price).replace(/,/g, "");
    if (!rawPrice || Number(rawPrice) <= 0) {
      setVariantError("قیمت واریانت الزامی است");
      return;
    }
    if (variantForm.quantity === "" || Number(variantForm.quantity) < 0) {
      setVariantError("موجودی واریانت الزامی است");
      return;
    }

    const payload = {
      color: variantForm.color || null,
      duration_months: variantForm.duration_months
        ? parseInt(variantForm.duration_months)
        : null,
      warranty_months: variantForm.warranty_months
        ? parseInt(variantForm.warranty_months)
        : null,
      price: parseInt(rawPrice),
      discount: parseFloat(variantForm.discount) || 0,
      quantity: parseInt(variantForm.quantity),
      is_active: variantForm.is_active,
    };

    // در حالت ویرایش، محصول از قبل id دارد پس می‌شود مستقیم با API کار کرد
    const productId = mode === "edit" ? initialData?.id : null;

    if (productId) {
      setVariantLoading(true);
      try {
        if (editingVariantId) {
          const res = await api.put(
            `/api/catalog/variant/${editingVariantId}/`,
            payload
          );
          setVariants((prev) =>
            prev.map((v) => (v.id === editingVariantId ? res.data.variant : v))
          );
          setNotif({
            id: Date.now(),
            message: "واریانت ویرایش شد",
            type: "success",
          });
        } else {
          const res = await api.post(
            `/api/catalog/product/${productId}/variant/create/`,
            payload
          );
          setVariants((prev) => [...prev, res.data.variant]);
          setNotif({
            id: Date.now(),
            message: "واریانت اضافه شد",
            type: "success",
          });
        }
        resetVariantForm();
      } catch (error) {
        console.error(error);
        setVariantError("خطا در ثبت واریانت");
      } finally {
        setVariantLoading(false);
      }
    } else {
      // حالت ایجاد محصول جدید: هنوز id محصول نداریم، فقط لوکال نگه می‌داریم
      // و بعد از ثبت نهایی محصول (در handleSubmit) به بک‌اند ارسال می‌شود
      if (editingVariantId) {
        setVariants((prev) =>
          prev.map((v) =>
            v.localId === editingVariantId ? { ...v, ...payload } : v
          )
        );
      } else {
        setVariants((prev) => [
          ...prev,
          {
            ...payload,
            localId: `local-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2)}`,
          },
        ]);
      }
      resetVariantForm();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "نام محصول الزامی است";
    if (!formData.product_code.trim())
      newErrors.product_code = "کد محصول الزامی است";
    if (!rawSellPrice && mode === "create")
      newErrors.sell_price = "قیمت فروش الزامی است";
    if (!formData.quantity && formData.quantity !== 0)
      newErrors.quantity = "موجودی الزامی است";
    if (!formData.category_id) newErrors.category_id = "دسته‌بندی الزامی است";
    if (!mainImage?.id && mode === "create")
      newErrors.mainImage = "تصویر اصلی باید آپلود شود";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const image_ids = [];
      const deleted_image_ids = [...deletedGalleryImages];
      let main_image_id = null;

      if (mainImage) {
        if (mainImage.id && !mainImage.isExisting) {
          image_ids.push(mainImage.id);
          main_image_id = mainImage.id;
        } else if (mainImage.id && mainImage.isExisting) {
          main_image_id = mainImage.id;
        } else if (mainImage.file && !mainImage.id) {
          setNotif({
            id: Date.now(),
            message: "لطفاً ابتدا عکس را آپلود کنید",
            type: "error",
          });
          setLoading(false);
          return;
        }
      }

      galleryImages.forEach((img) => {
        if (img.id && !img.isExisting) {
          image_ids.push(img.id);
        }
      });

      const featureObj = {};
      features.forEach((f) => {
        featureObj[f.key] = f.value;
      });

      const productData = {
        name: formData.name,
        product_code: formData.product_code,
        sell_price: parseFloat(rawSellPrice) || 0,
        buy_price: parseFloat(rawBuyPrice) || 0,
        quantity: parseInt(formData.quantity),
        category_id: parseInt(formData.category_id),
        discount: parseFloat(formData.discount) || 0,
        descriptions: formData.descriptions || "",
        // ⚠️ فیکس مهم: کلید بک‌اند «more_description» است (بدون s)، نه
        // «more_descriptions». چون قبلاً کلید اشتباه فرستاده می‌شد،
        // سریالایزر (fields="__all__") آن را کلاً نادیده می‌گرفت و این
        // فیلد هیچ‌وقت واقعاً در دیتابیس ذخیره نمی‌شد - دقیقاً همون چیزی
        // که باعث می‌شد همیشه در ویرایش خالی به نظر برسه.
        more_description: formData.more_descriptions || "",
        status: formData.status,
        feature: featureObj,
      };

      if (image_ids.length > 0) {
        productData.image_ids = image_ids;
      }

      if (deleted_image_ids.length > 0 && mode === "edit") {
        productData.deleted_image_ids = deleted_image_ids;
      }

      if (main_image_id && mode === "edit") {
        productData.main_image_id = main_image_id;
      }

      console.log("📤 Sending product data:", productData);

      if (mode === "edit" && initialData?.id) {
        await api.put(`/api/catalog/product/${initialData.id}/`, productData);
        setNotif({
          id: Date.now(),
          message: "محصول با موفقیت ویرایش شد",
          type: "success",
        });
      } else {
        const createRes = await api.post(
          "/api/catalog/product/create/",
          productData
        );

        // ✅ بعد از ساخت محصول جدید، واریانت‌هایی که لوکال اضافه شده بودند
        // را یکی‌یکی به بک‌اند ارسال می‌کنیم (چون قبلاً id محصول را نداشتیم)
        const newProductId = createRes.data?.product?.id;

        if (newProductId && variants.length > 0) {
          for (const v of variants) {
            try {
              await api.post(
                `/api/catalog/product/${newProductId}/variant/create/`,
                {
                  color: v.color,
                  duration_months: v.duration_months,
                  warranty_months: v.warranty_months || null,
                  price: v.price,
                  discount: v.discount || 0,
                  quantity: v.quantity,
                  is_active: v.is_active,
                }
              );
            } catch (variantErr) {
              console.error("خطا در ثبت واریانت:", variantErr);
            }
          }
        }

        setNotif({
          id: Date.now(),
          message: "محصول با موفقیت اضافه شد",
          type: "success",
        });
      }

      onBack();
    } catch (error) {
      console.error("❌ Submit Error:", error);
      let msg = mode === "edit" ? "خطا در ویرایش محصول" : "خطا در ایجاد محصول";
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

  const StatusBadge = ({ status }) => {
    const config = {
      pending: {
        label: "در انتظار آپلود",
        color: "bg-yellow-100 text-yellow-800",
      },
      uploading: {
        label: "در حال آپلود...",
        color: "bg-blue-100 text-blue-800",
      },
      success: { label: "آپلود شد", color: "bg-green-100 text-green-800" },
      error: { label: "خطا", color: "bg-red-100 text-red-800" },
    };
    const { label, color } = config[status] || config.pending;
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${color}`}>{label}</span>
    );
  };

  if (step === 1) {
    return (
      <section className="p-4 md:p-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
            {mode === "edit" ? "ویرایش محصول" : "افزودن محصول جدید"} - مرحله 1
            از 2
          </h1>
          <Button clickFnc={onBack} text="بازگشت" is_main={false} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleNextStep();
          }}
          className="space-y-8"
        >
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-100">
              اطلاعات پایه
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نام محصول <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900"
                  placeholder="مثال: هدفون سونی"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  کد محصول <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="product_code"
                  value={formData.product_code}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900 font-mono"
                  placeholder="مثال: P001"
                />
                {errors.product_code && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.product_code}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  قیمت فروش (تومان) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="sell_price"
                  value={formData.sell_price}
                  onChange={handleSellPriceChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900 text-left"
                  placeholder="0"
                  dir="ltr"
                />
                {errors.sell_price && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.sell_price}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  قیمت خرید (تومان)
                </label>
                <input
                  type="text"
                  name="buy_price"
                  value={formData.buy_price}
                  onChange={handleBuyPriceChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900 text-left"
                  placeholder="0"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  موجودی <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900"
                  placeholder="0"
                />
                {errors.quantity && (
                  <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تخفیف <span className="text-gray-400 text-xs">(درصد)</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    name="discount"
                    value={formData.discount}
                    onChange={handleDiscountChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900"
                    placeholder="0"
                    dir="ltr"
                  />
                  <span className="text-gray-500 text-sm">%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  دسته‌بندی <span className="text-red-500">*</span>
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900"
                >
                  <option value="">انتخاب کنید...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.parent?.title || "بدون والد"} / {cat.title}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.category_id}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وضعیت محصول <span className="text-red-500">*</span>
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
                <p className="mt-1 text-xs text-gray-400">
                  محصولات فعال در سایت نمایش داده می‌شوند
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                توضیحات محصول
              </label>
              <textarea
                name="descriptions"
                value={formData.descriptions}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none resize-none text-gray-900"
                placeholder="توضیحات کامل محصول..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                توضیحات بیشتر
                <span className="text-gray-400 text-xs mr-1">(اختیاری)</span>
              </label>
              <textarea
                name="more_descriptions"
                value={formData.more_descriptions}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none resize-none text-gray-900"
                placeholder="توضیحات تکمیلی و جزئیات بیشتر محصول..."
              />
              <p className="mt-1 text-xs text-gray-400">
                این بخش برای توضیحات تکمیلی و اطلاعات بیشتر محصول استفاده می‌شود
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-100">
              تصویر اصلی{" "}
              {mode === "create" && <span className="text-red-500">*</span>}
            </h2>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={selectMainImage}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                {mainImage &&
                  mainImage.status !== "success" &&
                  !mainImage.isExisting && (
                    <button
                      type="button"
                      onClick={handleMainImageUpload}
                      disabled={mainImage.status === "uploading"}
                      className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition disabled:opacity-50"
                    >
                      {mainImage.status === "uploading"
                        ? "در حال آپلود..."
                        : "آپلود"}
                    </button>
                  )}
              </div>
              {mainImage && (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="relative w-20 h-20">
                    <Image
                      src={mainImage.preview}
                      alt="پیش‌نمایش اصلی"
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                      unoptimized={true}
                    />
                  </div>
                  <div className="flex-1">
                    <StatusBadge
                      status={
                        mainImage.isExisting ? "success" : mainImage.status
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeMainImage}
                    className="text-red-500 hover:text-red-700"
                  >
                    حذف
                  </button>
                </div>
              )}
              {errors.mainImage && (
                <p className="text-sm text-red-500">{errors.mainImage}</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-100">
              تصاویر گالری
            </h2>
            <div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={selectGalleryImages}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div className="space-y-3">
              {galleryImages.map((img, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <div className="relative w-20 h-20">
                    <Image
                      src={img.preview}
                      alt={`گالری ${index + 1}`}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                      unoptimized={true}
                    />
                  </div>
                  <div className="flex-1">
                    <StatusBadge
                      status={img.isExisting ? "success" : img.status}
                    />
                  </div>
                  {img.status === "pending" && !img.isExisting && (
                    <button
                      type="button"
                      onClick={() => handleGalleryImageUpload(index)}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm transition"
                    >
                      آپلود
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all"
            >
              مرحله بعد: مشخصات فنی
            </button>
            <button
              type="button"
              onClick={onBack}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium transition-all"
            >
              انصراف
            </button>
          </div>
        </form>
      </section>
    );
  }

  return (
    <section className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
          {mode === "edit" ? "ویرایش محصول" : "افزودن محصول جدید"} - مرحله 2 از
          2
        </h1>
        <Button
          clickFnc={() => setStep(1)}
          text="بازگشت به مرحله قبل"
          is_main={false}
        />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-100">
          مشخصات فنی محصول
        </h2>
        {features.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-xl">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                    ویژگی
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                    مقدار
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {features.map((feature, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 text-gray-900">{feature.key}</td>
                    <td className="px-4 py-3 text-gray-900">{feature.value}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان ویژگی
            </label>
            <input
              type="text"
              value={newFeatureKey}
              onChange={(e) => setNewFeatureKey(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900"
              placeholder="مثال: برند"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              مقدار ویژگی
            </label>
            <input
              type="text"
              value={newFeatureValue}
              onChange={(e) => setNewFeatureValue(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900"
              placeholder="مثال: Apple"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={addFeature}
          className="w-full md:w-auto px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium transition"
        >
          + افزودن ویژگی
        </button>

        {/* ============================================================ */}
        {/* 🔥 بخش واریانت‌های محصول */}
        {/* ============================================================ */}
        <div className="pt-6 mt-2 border-t border-gray-100 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">
            واریانت‌های محصول
            <span className="text-gray-400 text-xs font-normal mr-2">
              (رنگ‌های مختلف، مدت زمان اشتراک، هرکدام با قیمت و موجودی جدا)
            </span>
          </h2>

          {mode === "create" && (
            <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
              واریانت‌هایی که اینجا اضافه می‌کنید، بعد از ثبت نهایی محصول
              (کلیک روی «افزودن محصول») در بک‌اند ذخیره می‌شوند.
            </p>
          )}

          {variants.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-xl text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-right text-gray-700">رنگ</th>
                    <th className="px-3 py-2 text-right text-gray-700">
                      مدت (ماه)
                    </th>
                    <th className="px-3 py-2 text-right text-gray-700">
                      گارانتی (ماه)
                    </th>
                    <th className="px-3 py-2 text-right text-gray-700">
                      قیمت
                    </th>
                    <th className="px-3 py-2 text-right text-gray-700">
                      تخفیف
                    </th>
                    <th className="px-3 py-2 text-right text-gray-700">
                      موجودی
                    </th>
                    <th className="px-3 py-2 text-center text-gray-700">
                      فعال
                    </th>
                    <th className="px-3 py-2 text-center text-gray-700">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {variants.map((v) => (
                    <tr key={v.id ?? v.localId}>
                      <td className="px-3 py-2 text-gray-900">
                        {v.color || "—"}
                      </td>
                      <td className="px-3 py-2 text-gray-900">
                        {v.duration_months || "—"}
                      </td>
                      <td className="px-3 py-2 text-gray-900">
                        {v.warranty_months ? `${v.warranty_months} ماه` : "—"}
                      </td>
                      <td className="px-3 py-2 text-gray-900">
                        {formatNumberWithCommas(String(v.price))} تومان
                      </td>
                      <td className="px-3 py-2 text-gray-900">
                        {v.discount ? `${v.discount}%` : "—"}
                      </td>
                      <td className="px-3 py-2 text-gray-900">{v.quantity}</td>
                      <td className="px-3 py-2 text-center">
                        <span
                          className={`inline-block w-2.5 h-2.5 rounded-full ${
                            v.is_active ? "bg-green-500" : "bg-gray-300"
                          }`}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleEditVariant(v)}
                            className="text-blue-500 hover:text-blue-700 text-xs font-medium"
                          >
                            ویرایش
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteVariant(v)}
                            disabled={variantLoading}
                            className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-50"
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رنگ
              </label>
              <input
                type="text"
                value={variantForm.color}
                onChange={(e) =>
                  setVariantForm((prev) => ({ ...prev, color: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900"
                placeholder="مثال: مشکی"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مدت زمان (ماه)
                <span className="text-gray-400 text-xs mr-1">(اشتراک)</span>
              </label>
              <input
                type="number"
                value={variantForm.duration_months}
                onChange={(e) =>
                  setVariantForm((prev) => ({
                    ...prev,
                    duration_months: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900"
                placeholder="مثال: 12"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                گارانتی (ماه)
                <span className="text-gray-400 text-xs mr-1">
                  (اختیاری - برای دستگاه‌های فیزیکی)
                </span>
              </label>
              <input
                type="number"
                value={variantForm.warranty_months}
                onChange={(e) =>
                  setVariantForm((prev) => ({
                    ...prev,
                    warranty_months: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900"
                placeholder="مثال: 18"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                قیمت (تومان) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                dir="ltr"
                value={variantForm.price}
                onChange={handleVariantPriceChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تخفیف <span className="text-gray-400 text-xs">(درصد)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  dir="ltr"
                  value={variantForm.discount}
                  onChange={handleVariantDiscountChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900"
                  placeholder="0"
                />
                <span className="text-gray-500 text-sm">%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                موجودی <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={variantForm.quantity}
                onChange={(e) =>
                  setVariantForm((prev) => ({
                    ...prev,
                    quantity: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900"
                placeholder="0"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={variantForm.is_active}
              onChange={(e) =>
                setVariantForm((prev) => ({
                  ...prev,
                  is_active: e.target.checked,
                }))
              }
              className="rounded border-gray-300"
            />
            فعال (قابل خرید)
          </label>

          {variantError && (
            <p className="text-sm text-red-500">{variantError}</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleAddOrUpdateVariant}
              disabled={variantLoading}
              className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition disabled:opacity-50"
            >
              {variantLoading
                ? "در حال ثبت..."
                : editingVariantId !== null
                  ? "ذخیره تغییرات واریانت"
                  : "+ افزودن واریانت"}
            </button>
            {editingVariantId !== null && (
              <button
                type="button"
                onClick={resetVariantForm}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition"
              >
                انصراف از ویرایش
              </button>
            )}
          </div>
        </div>

        {errors.submit && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-center whitespace-pre-wrap text-sm">
            {errors.submit}
          </div>
        )}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50"
          >
            {loading
              ? "در حال ثبت..."
              : mode === "edit"
                ? "ویرایش محصول"
                : "افزودن محصول"}
          </button>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium transition-all"
          >
            مرحله قبل
          </button>
        </div>
      </div>
    </section>
  );
}

export default AddProduct;