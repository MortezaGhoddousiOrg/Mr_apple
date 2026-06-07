import { useState } from "react";

function AddUser({ onBack }) {
    const [data, setData] = useState({
        firstname: "",
        lastname: "",
        phone: "",
        email: "",
        role: "normal",
    });

    const [focused, setFocused] = useState({
        firstname: false,
        lastname: false,
        phone: false,
        email: false,
        role: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    const handleFocus = (field) => {
        setFocused({ ...focused, [field]: true });
    };

    const handleBlur = (field, value) => {
        if (!value) {
            setFocused({ ...focused, [field]: false });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(data);
        // Add your API call here
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
            id: "email",
            name: "email",
            type: "email",
            label: "ایمیل",
            placeholder: "example@gmail.com",
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
    ];

    return (
        <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 sm:px-8 sm:py-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl sm:text-3xl font-bold text-white">
                                افزودن کاربر جدید
                            </h2>
                            <button
                                onClick={() => onBack()}
                                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                                بازگشت
                            </button>
                        </div>
                        <p className="text-blue-100 mt-2 text-sm">
                            اطلاعات کاربر جدید را وارد کنید
                        </p>
                    </div>

                    {/* Form Section */}
                    <form
                        onSubmit={handleSubmit}
                        className="p-6 sm:p-8 space-y-6"
                    >
                        {/* Name Fields Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {inputFields.slice(0, 2).map((field) => (
                                <div key={field.id} className="relative">
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        id={field.id}
                                        value={data[field.name]}
                                        onChange={handleChange}
                                        onFocus={() => handleFocus(field.name)}
                                        onBlur={(e) =>
                                            handleBlur(
                                                field.name,
                                                e.target.value,
                                            )
                                        }
                                        className={`
                                            w-full px-4 pt-5 pb-2 text-gray-900 border-2 rounded-lg
                                            outline-none transition-all duration-200 peer
                                            ${
                                                focused[field.name] ||
                                                data[field.name]
                                                    ? "border-blue-500"
                                                    : "border-gray-300 hover:border-gray-400"
                                            }
                                            focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                                        `}
                                        required={field.required}
                                    />
                                    <label
                                        htmlFor={field.id}
                                        className={`
                                            absolute right-3 transition-all duration-200 cursor-text
                                            ${
                                                focused[field.name] ||
                                                data[field.name]
                                                    ? "text-xs text-blue-600 -top-2 bg-white px-1"
                                                    : "text-gray-500 top-1/2 -translate-y-1/2"
                                            }
                                        `}
                                    >
                                        {field.label}
                                    </label>
                                </div>
                            ))}
                        </div>

                        {/* Email and Phone Fields Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {inputFields.slice(2, 4).map((field) => (
                                <div key={field.id} className="relative">
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        id={field.id}
                                        value={data[field.name]}
                                        onChange={handleChange}
                                        onFocus={() => handleFocus(field.name)}
                                        onBlur={(e) =>
                                            handleBlur(
                                                field.name,
                                                e.target.value,
                                            )
                                        }
                                        className={`
                                            w-full px-4 pt-5 pb-2 text-gray-900 border-2 rounded-lg
                                            outline-none transition-all duration-200 peer
                                            ${
                                                focused[field.name] ||
                                                data[field.name]
                                                    ? "border-blue-500"
                                                    : "border-gray-300 hover:border-gray-400"
                                            }
                                            focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                                        `}
                                        required={field.required}
                                    />
                                    <label
                                        htmlFor={field.id}
                                        className={`
                                            absolute right-3 transition-all duration-200 cursor-text
                                            ${
                                                focused[field.name] ||
                                                data[field.name]
                                                    ? "text-xs text-blue-600 -top-2 bg-white px-1"
                                                    : "text-gray-500 top-1/2 -translate-y-1/2"
                                            }
                                        `}
                                    >
                                        {field.label}
                                    </label>
                                </div>
                            ))}
                        </div>

                        {/* Role Select Field with Animation */}
                        <div className="relative">
                            <select
                                name="role"
                                id="role"
                                value={data.role}
                                onChange={handleChange}
                                onFocus={() => handleFocus("role")}
                                onBlur={(e) =>
                                    handleBlur("role", e.target.value)
                                }
                                className={`
                                    w-full px-4 pt-5 pb-2 text-gray-900 border-2 rounded-lg
                                    outline-none transition-all duration-200 appearance-none
                                    cursor-pointer bg-white
                                    ${
                                        focused.role || data.role
                                            ? "border-blue-500"
                                            : "border-gray-300 hover:border-gray-400"
                                    }
                                    focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                                `}
                            >
                                <option value="normal">کاربر عادی</option>
                                <option value="admin">مدیر</option>
                            </select>
                            <label
                                htmlFor="role"
                                className={`
                                    absolute right-3 transition-all duration-200 cursor-text
                                    ${
                                        focused.role || data.role
                                            ? "text-xs text-blue-600 -top-2 bg-white px-1"
                                            : "text-gray-500 top-1/2 -translate-y-1/2"
                                    }
                                `}
                            >
                                نقش کاربری
                            </label>
                            {/* Custom dropdown arrow */}
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg
                                    className="w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                افزودن کاربر
                            </button>
                        </div>

                        {/* Form Info */}
                        <div className="text-center text-sm text-gray-500 mt-4">
                            <span className="inline-flex items-center gap-1">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                تمامی فیلدهای الزامی با ستاره (*) مشخص شده‌اند
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default AddUser;
