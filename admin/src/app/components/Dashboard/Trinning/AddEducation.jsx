"use client";

import { useState } from "react";
import Image from "next/image";
import { api, MEDIA_URL } from "@/app/config";
import { useNotification } from "@/app/Context/NotificationContext";
import DatePicker from "@/app/components/DatePicker";
import RichTextEditor from "@/app/components/Richtexteditor";

// ⚠️ همان راه‌حل مشترک باگ عکس: هم آدرس کامل و هم مسیر نسبی را درست می‌سازد
function getMediaUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const base = (MEDIA_URL || "").endsWith("/")
    ? MEDIA_URL.slice(0, -1)
    : MEDIA_URL || "";
  const rel = path.startsWith("/") ? path : `/${path}`;
  return `${base}${rel}`;
}

export default function AddEducation({
  mode = "create",
  initialData = null,
  onBack,
}) {
  const { setNotif } = useNotification();
  const isEdit = mode === "edit";

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ⚠️ همه‌ی state های زیر عمداً با lazy initializer (تابع داخل useState)
  // مستقیم از initialData ساخته می‌شن، نه با یک useEffect که بعد از mount
  // مقدار رو ست کنه. چون AddEducation هر بار که وارد حالت ویرایش می‌شی از
  // نو mount میشه (توسط Education.jsx)، این مقدار همیشه از همون رندر اول
  // درسته - و برخلاف افکت، برای RichTextEditor (که contentEditable است، نه
  // input معمولی) قابل‌اعتماده.
  const [formData, setFormData] = useState(() => ({
    title: (isEdit && initialData?.title) || "",
    description: (isEdit && initialData?.description) || "",
    publish_date:
      (isEdit && (initialData?.publish_date || initialData?.date)) || "",
    type: initialData?.type || "news",
  }));

  const [image, setImage] = useState(() => {
    if (isEdit && initialData?.image) {
      return {
        // ⚠️ image_id در بک‌اند write_only است و توسط GET برگردانده
        // نمی‌شود؛ پس اینجا همیشه null است مگر عکس تازه آپلود بشه.
        id: null,
        imagePath: initialData.image,
        preview: getMediaUrl(initialData.image),
        status: "success",
        isExisting: true,
      };
    }
    return null;
  });

  // ============================================================
  // 🔥 تصاویر گالری (بعد از تصویر اصلی نمایش داده می‌شوند)
  // با endpoint جدید و مستقل از news_id، دقیقاً مثل تصویر اصلی آپلود می‌شوند
  // ============================================================
  const [galleryImages, setGalleryImages] = useState(() => {
    if (isEdit && Array.isArray(initialData?.gallery)) {
      return initialData.gallery.map((g) => ({
        id: g.id,
        imagePath: g.image,
        preview: getMediaUrl(g.image),
        status: "success",
        isExisting: true,
      }));
    }
    return [];
  });

  // ============================================================
  // 🔥 برچسب‌های سئو
  // ============================================================
  const [tags, setTags] = useState(() =>
    isEdit && Array.isArray(initialData?.tags) ? initialData.tags : []
  );
  const [tagInput, setTagInput] = useState("");

  const stripHtml = (html) => (html || "").replace(/<[^>]*>/g, "").trim();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));

    // اگر در حالت ایجاد، نوع مقاله از خبر به آموزش تغییر کرد، گالری معنا ندارد
    if (name === "type" && value !== "news" && !isEdit) {
      setGalleryImages([]);
    }
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      publish_date: date,
    }));

    if (errors.publish_date) {
      setErrors((prev) => ({
        ...prev,
        publish_date: "",
      }));
    }
  };

  const uploadImage = async (file) => {
    const formDataImg = new FormData();
    formDataImg.append("file", file);
    const response = await api.post(
      "/education/admin/upload-image/",
      formDataImg,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data.data;
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage({
      file,
      preview: URL.createObjectURL(file),
      id: null,
      imagePath: null,
      status: "pending",
      isExisting: false,
    });
  };

  const handleImageUpload = async () => {
    if (!image || !image.file) return;
    setImage((prev) => ({ ...prev, status: "uploading" }));
    try {
      const uploaded = await uploadImage(image.file);
      setImage((prev) => ({
        ...prev,
        id: uploaded.id,
        imagePath: uploaded.image,
        status: "success",
        isExisting: false,
      }));
      setNotif({
        id: Date.now(),
        message: "تصویر با موفقیت آپلود شد",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      setImage((prev) => ({ ...prev, status: "error" }));
      setNotif({
        id: Date.now(),
        message: "خطا در آپلود تصویر",
        type: "error",
      });
    }
  };

  const removeImage = () => {
    if (image?.preview && !image.isExisting) {
      URL.revokeObjectURL(image.preview);
    }
    setImage(null);
  };

  // ============================================================
  // 🔥 توابع مدیریت گالری - دقیقاً مثل تصویر اصلی، مستقل از وجود مقاله
  // (نیازمند endpoint های جدید بک‌اند: آپلود و حذف مستقل از news_id)
  // ============================================================

  const uploadGalleryImage = async (file) => {
    const formDataImg = new FormData();
    formDataImg.append("file", file);
    const response = await api.post(
      "/education/admin/news-gallery/upload/",
      formDataImg,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data.data;
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

  const handleGalleryImageUpload = async (index) => {
    const img = galleryImages[index];
    if (!img || !img.file) return;

    setGalleryImages((prev) =>
      prev.map((it, i) => (i === index ? { ...it, status: "uploading" } : it))
    );
    try {
      const uploaded = await uploadGalleryImage(img.file);
      setGalleryImages((prev) =>
        prev.map((it, i) =>
          i === index
            ? {
                ...it,
                id: uploaded.id,
                imagePath: uploaded.image,
                status: "success",
                isExisting: false,
              }
            : it
        )
      );
      setNotif({
        id: Date.now(),
        message: "تصویر گالری آپلود شد",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      setGalleryImages((prev) =>
        prev.map((it, i) => (i === index ? { ...it, status: "error" } : it))
      );
      setNotif({
        id: Date.now(),
        message: "خطا در آپلود تصویر گالری",
        type: "error",
      });
    }
  };

  const removeGalleryImage = async (index) => {
    const img = galleryImages[index];

    if (img.id) {
      // این عکس قبلاً روی سرور ذخیره شده - واقعاً حذفش می‌کنیم
      try {
        await api.delete(`/education/admin/news-gallery/${img.id}/`);
        setNotif({
          id: Date.now(),
          message: "تصویر گالری حذف شد",
          type: "success",
        });
      } catch (error) {
        console.error(error);
        setNotif({
          id: Date.now(),
          message: "خطا در حذف تصویر گالری",
          type: "error",
        });
        return;
      }
    }

    if (img.preview && !img.isExisting) URL.revokeObjectURL(img.preview);
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ============================================================
  // 🔥 توابع مدیریت برچسب‌ها (تگ‌های سئو)
  // ============================================================

  const addTag = () => {
    const t = tagInput.trim().replace(/^#/, "");
    if (t && !tags.includes(t)) {
      setTags((prev) => [...prev, t]);
    }
    setTagInput("");
  };

  const removeTag = (tag) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!stripHtml(formData.title)) newErrors.title = "عنوان الزامی است";
    if (!stripHtml(formData.description))
      newErrors.description = "توضیحات الزامی است";
    if (!formData.publish_date.trim())
      newErrors.publish_date = "تاریخ الزامی است";

    if (!image?.id && mode === "create") {
      newErrors.image = "تصویر باید آپلود شود";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // آی‌دی گالری‌هایی که آپلود شده‌اند (چه قبلاً موجود بوده‌اند چه همین حالا)
      const galleryIds = galleryImages.filter((g) => g.id).map((g) => g.id);

      const articleData = {
        title: formData.title,
        description: formData.description,
        publish_date: formData.publish_date,
        tags: tags,
      };

      // ⚠️ نکته مهم: image_id در بک‌اند write_only و غیر nullable است، و
      // چون GET هیچ‌وقت image_id را برنمی‌گرداند، در حالت ویرایش (بدون
      // آپلود عکس تازه) این مقدار همیشه null می‌ماند. اگر null را صراحتاً
      // بفرستیم، کل درخواست ویرایش با خطای اعتبارسنجی رد می‌شود. پس فقط
      // وقتی واقعاً id معتبر داریم (عکس تازه آپلود شده) آن را می‌فرستیم؛
      // در غیر این صورت اصلاً این کلید را نمی‌فرستیم تا عکس فعلی دست‌نخورده بماند.
      if (image?.id) {
        articleData.image_id = image.id;
      }

      // ⚠️ نیازمند پشتیبانی سریالایزر News از gallery_ids برای اتصال عکس‌های
      // گالری‌ای که مستقل از مقاله آپلود شدند (جزئیات در پاسخ متنی)
      if (formData.type === "news" || initialData?.type === "news") {
        articleData.gallery_ids = galleryIds;
      }

      if (isEdit && initialData?.id) {
        const endpoint =
          initialData.type === "news"
            ? `/education/admin/news/${initialData.id}/`
            : `/education/admin/tutorials/${initialData.id}/`;

        await api.put(endpoint, articleData);

        setNotif({
          id: Date.now(),
          message: "مقاله با موفقیت ویرایش شد",
          type: "success",
        });
      } else {
        const endpoint =
          formData.type === "news"
            ? "/education/admin/news/"
            : "/education/admin/tutorials/";

        await api.post(endpoint, articleData);

        setNotif({
          id: Date.now(),
          message: "مقاله با موفقیت ایجاد شد",
          type: "success",
        });
      }

      onBack();
    } catch (error) {
      console.error("Error saving article:", error);
      let msg = "خطا در ذخیره مقاله";
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

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
          {isEdit ? "ویرایش مقاله" : "افزودن مقاله جدید"}
        </h1>
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium transition-all"
        >
          بازگشت
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          {/* نوع مقاله */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع مقاله <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              disabled={isEdit}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="news">خبر</option>
              <option value="tutorial">آموزش</option>
            </select>
          </div>

          {/* عنوان - با ابزار متن غنی + پیش‌نمایش زنده */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              value={formData.title}
              onChange={(html) => {
                setFormData((prev) => ({ ...prev, title: html }));
                if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
              }}
              placeholder="عنوان مقاله را وارد کنید"
              rows={1}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
            {stripHtml(formData.title) && (
              <div className="mt-2">
                <span className="text-xs text-gray-400 block mb-1">
                  پیش‌نمایش:
                </span>
                <div
                  className="px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-lg font-bold text-gray-900"
                  dangerouslySetInnerHTML={{ __html: formData.title }}
                />
              </div>
            )}
          </div>

          {/* توضیحات - با ابزار متن غنی + پیش‌نمایش زنده */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              توضیحات <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              value={formData.description}
              onChange={(html) => {
                setFormData((prev) => ({ ...prev, description: html }));
                if (errors.description)
                  setErrors((prev) => ({ ...prev, description: "" }));
              }}
              placeholder="متن مقاله را وارد کنید..."
              rows={6}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
            {stripHtml(formData.description) && (
              <div className="mt-2">
                <span className="text-xs text-gray-400 block mb-1">
                  پیش‌نمایش:
                </span>
                <div
                  className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-800 leading-8"
                  dangerouslySetInnerHTML={{ __html: formData.description }}
                />
              </div>
            )}
          </div>

          {/* تاریخ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تاریخ انتشار <span className="text-red-500">*</span>
            </label>
            <DatePicker
              value={formData.publish_date}
              onChange={handleDateChange}
              placeholder="انتخاب تاریخ"
            />
            {errors.publish_date && (
              <p className="mt-1 text-sm text-red-500">{errors.publish_date}</p>
            )}
          </div>

          {/* برچسب‌های سئو */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              برچسب‌ها (هشتگ‌های سئو)
              <span className="text-gray-400 text-xs mr-1">
                (اختیاری - برای بهبود سئو مقاله)
              </span>
            </label>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-400 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900"
                placeholder="یک کلمه بنویس و Enter بزن..."
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition"
              >
                افزودن
              </button>
            </div>
          </div>

          {/* تصویر اصلی */}
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
                    onChange={handleImageSelect}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                {image && image.status !== "success" && !image.isExisting && (
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    disabled={image.status === "uploading"}
                    className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition disabled:opacity-50"
                  >
                    {image.status === "uploading" ? "در حال آپلود..." : "آپلود"}
                  </button>
                )}
              </div>
              {image && (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="relative w-20 h-20">
                    <Image
                      src={image.preview}
                      alt="پیش‌نمایش"
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                      unoptimized={true}
                    />
                  </div>
                  <div className="flex-1">
                    <StatusBadge
                      status={image.isExisting ? "success" : image.status}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="text-red-500 hover:text-red-700"
                  >
                    حذف
                  </button>
                </div>
              )}
              {errors.image && (
                <p className="text-sm text-red-500">{errors.image}</p>
              )}
            </div>
          </div>

          {/* تصاویر گالری - فقط برای خبر (طبق بک‌اند فعلی)، آپلود مستقیم مثل عکس اصلی */}
          {(formData.type === "news" || initialData?.type === "news") && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-100">
                تصاویر گالری
                <span className="text-gray-400 text-xs font-normal mr-2">
                  (بعد از تصویر اصلی نمایش داده می‌شوند)
                </span>
              </h2>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={selectGalleryImages}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />

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
          )}

          {formData.type === "tutorial" && (
            <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
              گالری تصاویر برای «آموزش‌ها» هنوز در بک‌اند پیاده‌سازی نشده
              است.
            </p>
          )}

          {errors.submit && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-center whitespace-pre-wrap text-sm">
              {errors.submit}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50"
            >
              {loading
                ? "در حال ذخیره..."
                : isEdit
                  ? "ویرایش مقاله"
                  : "افزودن مقاله"}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium transition-all"
            >
              انصراف
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}