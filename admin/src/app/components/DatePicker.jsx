"use client";

import MultiDatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";

import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";

export default function DatePicker({
  value,
  onChange,
  placeholder = "انتخاب تاریخ",
}) {
  let pickerValue = "";

  if (value) {
    try {
      pickerValue = new DateObject({
        date: new Date(value),
        calendar: gregorian,
        locale: gregorian_en,
      }).convert(persian, persian_fa);
    } catch (e) {
      pickerValue = "";
    }
  }

  return (
    <MultiDatePicker
      value={pickerValue}
      calendar={persian}
      locale={persian_fa}
      format="YYYY/MM/DD"
      editable={false}
      calendarPosition="bottom-right"
      placeholder={placeholder}
      inputClass="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900"
      onChange={(date) => {
        if (!date) {
          onChange("");
          return;
        }

        const gregorianDate = date.convert(gregorian, gregorian_en);

        onChange(`${gregorianDate.format("YYYY-MM-DD")}T00:00:00`);
      }}
    />
  );
}
