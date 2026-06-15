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
          {children}
          <Toast />
        </NotificationProvider>
      </body>
    </html>
  );
}
