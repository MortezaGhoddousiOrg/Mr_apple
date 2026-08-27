"use client";

import { useRef, useEffect } from "react";

const FONT_SIZES = [
  { label: "خیلی کوچک", px: "12px" },
  { label: "کوچک", px: "14px" },
  { label: "متوسط", px: "16px" },
  { label: "بزرگ", px: "20px" },
  { label: "خیلی بزرگ", px: "26px" },
  { label: "بزرگ‌ترین", px: "34px" },
];

const COLORS = ["#111827", "#ef4444", "#2563eb", "#16a34a", "#d97706", "#7c3aed"];

/**
 * ادیتور متن ساده با قابلیت ضخیم/کج/زیرخط، اندازه فونت و رنگ.
 * خروجی این کامپوننت یک رشته HTML است (value/onChange).
 *
 * توجه ۱: به‌جای document.execCommand (که در بعضی مرورگرها/محیط‌ها اصلاً
 * اثری نداشت) استایل‌دهی به‌صورت دستی با Range/Selection API انجام می‌شود -
 * قابل‌اطمینان‌تر و مستقل از پیاده‌سازی مرورگر.
 *
 * توجه ۲: مقدار اولیه فقط یک‌بار در mount داخل ادیتور گذاشته می‌شود. برای
 * اینکه در حالت ویرایش مقدار درست از همون اول نشون داده بشه، والد باید
 * state اولیه‌ی خودش رو با useState(() => ...) به‌صورت lazy از initialData
 * بسازه (نه با یک useEffect که بعد از mount مقدار رو ست کنه) - وگرنه این
 * ادیتور چون contentEditable است (نه یک input معمولی)، ممکنه تغییرات دیرهنگام
 * والد رو به‌درستی منعکس نکنه.
 */
export default function RichTextEditor({
  value,
  onChange,
  placeholder = "",
  rows = 4,
}) {
  const editorRef = useRef(null);
  const savedRangeRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value || "";
    }
    // فقط در mount - عمداً به value وابسته نیست
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emitChange = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const saveSelection = () => {
  const sel = window.getSelection();

  if (
    !sel ||
    sel.rangeCount === 0 ||
    !editorRef.current ||
    !editorRef.current.contains(sel.anchorNode) ||
    !editorRef.current.contains(sel.focusNode)
  ) {
    return;
  }

  const range = sel.getRangeAt(0);

  if (!range.collapsed) {
    savedRangeRef.current = range.cloneRange();
  }
};

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (sel && savedRangeRef.current) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  };

  // بخش انتخاب‌شده را داخل یک <span> با استایل دلخواه می‌پیچد
  const applyStyle = (styleFn) => {
    restoreSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      return; // چیزی انتخاب نشده - چیزی برای استایل‌دهی نیست
    }

    const range = sel.getRangeAt(0);
    const span = document.createElement("span");
    styleFn(span);

    try {
      range.surroundContents(span);
    } catch {
      const contents = range.extractContents();
      span.appendChild(contents);
      range.insertNode(span);
    }

    sel.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    sel.addRange(newRange);
    savedRangeRef.current = newRange.cloneRange();

    emitChange();
  };

const clearFormatting = () => {
  restoreSelection();

  const sel = window.getSelection();

  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
    return;
  }

  const range = sel.getRangeAt(0);

  // یک marker برای محدوده انتخاب‌شده ایجاد می‌کنیم
  const startMarker = document.createElement("span");
  const endMarker = document.createElement("span");

  startMarker.dataset.formatMarker = "start";
  endMarker.dataset.formatMarker = "end";

  // انتهای selection را اول علامت‌گذاری می‌کنیم
  const endRange = range.cloneRange();
  endRange.collapse(false);
  endRange.insertNode(endMarker);

  // ابتدای selection را علامت‌گذاری می‌کنیم
  const startRange = range.cloneRange();
  startRange.collapse(true);
  startRange.insertNode(startMarker);

  // حالا DOM واقعی بین دو marker را پیدا می‌کنیم
  const clearRange = document.createRange();
  clearRange.setStartAfter(startMarker);
  clearRange.setEndBefore(endMarker);

  // تمام spanهایی که در محدوده انتخاب هستند
  const walker = document.createTreeWalker(
    editorRef.current,
    NodeFilter.SHOW_ELEMENT
  );

  const elements = [];

  let node;

  while ((node = walker.nextNode())) {
    if (
      node.tagName === "SPAN" &&
      node !== startMarker &&
      node !== endMarker &&
      clearRange.intersectsNode(node)
    ) {
      elements.push(node);
    }
  }

  // Spanها را یکی‌یکی unwrap می‌کنیم
  elements.forEach((span) => {
    const parent = span.parentNode;

    if (!parent) return;

    while (span.firstChild) {
      parent.insertBefore(span.firstChild, span);
    }

    parent.removeChild(span);
  });

  // markerها را حذف می‌کنیم
  const newRange = document.createRange();

  newRange.setStartAfter(startMarker);
  newRange.setEndBefore(endMarker);

  startMarker.remove();
  endMarker.remove();

  // تغییر را به والد اطلاع می‌دهیم
  emitChange();

  // selection را دوباره روی متن قرار می‌دهیم
  sel.removeAllRanges();

  try {
    sel.addRange(newRange);
    savedRangeRef.current = newRange.cloneRange();
  } catch {
    savedRangeRef.current = null;
  }
};

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition">
      <div className="flex flex-wrap items-center gap-1.5 bg-gray-50 border-b border-gray-200 px-2 py-1.5">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => applyStyle((el) => (el.style.fontWeight = "bold"))}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-200 transition"
          title="ضخیم (اول متن رو انتخاب کن)"
        >
          B
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => applyStyle((el) => (el.style.fontStyle = "italic"))}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-sm italic text-gray-700 hover:bg-gray-200 transition"
          title="کج (اول متن رو انتخاب کن)"
        >
          I
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() =>
            applyStyle((el) => (el.style.textDecoration = "underline"))
          }
          className="w-8 h-8 flex items-center justify-center rounded-lg text-sm underline text-gray-700 hover:bg-gray-200 transition"
          title="زیرخط (اول متن رو انتخاب کن)"
        >
          U
        </button>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        <select
          onMouseDown={saveSelection}
          onChange={(e) => {
            if (e.target.value)
              applyStyle((el) => (el.style.fontSize = e.target.value));
            e.target.value = "";
          }}
          defaultValue=""
          className="h-8 px-2 rounded-lg border border-gray-200 bg-white text-xs text-gray-700 outline-none cursor-pointer"
          title="اندازه فونت (اول متن رو انتخاب کن)"
        >
          <option value="" disabled>
            اندازه فونت
          </option>
          {FONT_SIZES.map((f) => (
            <option key={f.px} value={f.px}>
              {f.label}
            </option>
          ))}
        </select>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        <div className="flex items-center gap-1">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onMouseDown={saveSelection}
              onClick={() => applyStyle((el) => (el.style.color = c))}
              className="w-5 h-5 rounded-full border border-gray-200"
              style={{ backgroundColor: c }}
              title="رنگ متن (اول متن رو انتخاب کن)"
            />
          ))}
          <input
            type="color"
            onMouseDown={saveSelection}
            onChange={(e) =>
              applyStyle((el) => (el.style.color = e.target.value))
            }
            className="w-6 h-6 rounded-lg border border-gray-200 cursor-pointer p-0"
            title="رنگ دلخواه (اول متن رو انتخاب کن)"
          />
        </div>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={clearFormatting}
          className="h-8 px-2 rounded-lg text-xs text-gray-500 hover:bg-gray-200 transition"
          title="پاک کردن استایل (اول متن رو انتخاب کن)"
        >
          پاک کردن استایل
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={emitChange}
        onBlur={emitChange}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        dir="rtl"
        data-placeholder={placeholder}
        className="w-full px-4 py-2.5 outline-none text-gray-900 leading-8 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
        style={{ minHeight: `${Math.max(rows, 1) * 28}px` }}
      />
      <p className="px-4 pb-2 text-[11px] text-gray-400">
        برای بولد/رنگ/سایز، اول بخشی از متن رو انتخاب کن، بعد روی دکمه بزن.
      </p>
    </div>
  );
}