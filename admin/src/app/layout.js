import "./globals.css";
import { NotificationProvider } from "@/app/Context/NotificationContext";
import Toast from "@/app/ToastError/Toast";

export const metadata = {
  title: "پنل مدیریت | مستر اپل",
  description: "پنل مدیریت فروشگاه مستر اپل",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className={`h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <NotificationProvider>
          {/* فقط در موبایل padding-top اضافه میشه */}
          <div className="pt-[70px] md:pt-0">
            {children}
          </div>
          <Toast />
        </NotificationProvider>
      </body>
    </html>
  );
}