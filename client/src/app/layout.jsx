import "./globals.css";
import Header from "@/app/Components/Header/Header";
import Footer from "@/app/Components/Footer/Footer";
import { AuthProvider } from "@/app/Context/Context";
import Contentbox from "./ContentBox/Contentbox";
import Toast from "./ToastError/Toast";


export const metadata = {
  title: "Mr apple",
  description: "Mr Apple",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Header />
          <Contentbox />
          <Toast />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
