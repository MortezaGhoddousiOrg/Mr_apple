"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/app/config";
import { useMemo } from "react";

const Context = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [productbuy, setProductBuy] = useState([]);

  // const [addedItems, setAddedItems] = useState([]);

  const [notif, setNotif] = useState({
    message: "",
    type: "",
  });

  // const [phone, setPhone] = useState();
  const [userId, setUserId] = useState();
  const [dataForm, setDataForm] = useState({
    firstName: "dfgdfgdg",
    lastName: "dfgdg",
    phone: "1323212132",
    postalCode: "dfgdgdg",
    address: "dgdgdfgdg",
  });

  const emptyForm = {
    firstName: "",
    lastName: "",
    phone: "",
    postalCode: "",
    address: "",
  };
  const [initialData, setInitialData] = useState({});

  const saveOrUpdateUser = async (updatedData) => {
    try {
      const hasProfile = !!(initialData?.id || initialData?.userId);

      if (!hasProfile) {
        const res = await api.post("/auth/me/", updatedData);
        setDataForm(res.data);
        setInitialData(res.data);
        return "created";
      }

      const changed =
        (initialData.firstName || "") !== (updatedData.firstName || "") ||
        (initialData.lastName || "") !== (updatedData.lastName || "") ||
        (initialData.phone || "") !== (updatedData.phone || "") ||
        (initialData.postalCode || "") !== (updatedData.postalCode || "") ||
        (initialData.address || "") !== (updatedData.address || "");

      if (!changed) return;

      const id = initialData.id ?? initialData.userId;

      const res = await api.put(`/auth/me/${id}`, updatedData);
      setDataForm(res.data);
      setInitialData(res.data);
      return;
    } catch (err) {
      // console.error(err);
    }
  };

  const sendCode = async (phone) => {
    const res = await api.post("/auth/send-code/", { phone });
    return res.data;
  };

  const verifyCode = async (phone, code) => {
    const res = await api.post("/auth/verify-code/", {
      phone,
      code,
    });

    const userData = res.data;

    if (userData?.userId) {
      setUserId(userData.userId);
      localStorage.setItem("userId", userData.userId);
    }

    return userData;
  };

  useEffect(() => {
    if (!userId) return;

    const dataUser = async () => {
      try {
        const res = await api.get("/auth/me/", {
          params: { userId },
        });
        setDataForm(res.data);
        setInitialData(res.data);
      } catch (err) {
        // console.log(err);
      }
    };

    dataUser();
  }, [userId]);

  // خواندن سبد خرید برای مهمان و بعد از لاگین ست کردن با بک اند
  const loadCart = async () => {
    try {
      if (userId) {
        const res = await api.get(`/api/orders/cart/${userId}`);
        setProductBuy(res?.data?.items || []);
      } else {
        const localCart = localStorage.getItem("cart");
        setProductBuy(localCart ? JSON.parse(localCart) : []);
      }
    } catch (err) {
      // console.error("خطا در دریافت سبد خرید:", err);
      setProductBuy([]);
    }
  };

  // افزودن محصول به سبد خرید
  const addToCart = async (item) => {
    try {
      if (userId) {
        await api.post("/api/orders/cart/add", {
          userId,
          productId: item.id,
        });

        await loadCart();
      } else {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

        const isAlreadyAdded = localCart.some((p) => p.id === item.id);
        if (isAlreadyAdded) return;

        const updatedCart = [...localCart, { ...item, qty: 1 }];

        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setProductBuy(updatedCart);
      }

      return { success: true };
    } catch (err) {
      // console.error("خطا در افزودن به سبد خرید:", err);
      throw err;
    }
  };

  // حذف محصول از سبد خرید
  const removeFromCart = async (productId) => {
    try {
      if (userId) {
        await api.delete("/api/orders/cart/remove", {
          data: {
            userId,
            productId,
          },
        });

        await loadCart();
      } else {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const updatedCart = localCart.filter((item) => item.id !== productId);

        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setProductBuy(updatedCart);
      }

      return { success: true };
    } catch (err) {
      // console.error("خطا در حذف از سبد خرید:", err);
      throw err;
    }
  };

  // بروزرسانی تعداد محصول
  const updateQuantity = async (productId, qty) => {
    try {
      const safeQty = Math.max(qty, 1);

      if (userId) {
        await api.put("/api/orders/cart/update-qty", {
          userId,
          productId,
          qty: safeQty,
        });

        await loadCart();
      } else {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

        const updatedCart = localCart.map((item) =>
          item.id === productId ? { ...item, qty: safeQty } : item,
        );

        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setProductBuy(updatedCart);
      }

      return { success: true };
    } catch (err) {
      // console.error("خطا در بروزرسانی تعداد محصول:", err);
      throw err;
    }
  };

  // انتقال سبد مهمان به سرور بعد از لاگین
  const syncLocalCartToServer = async () => {
    if (!userId) return;

    try {
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (!localCart.length) return;

      await api.post("/api/orders/cart/sync", {
        userId,
        items: localCart.map((item) => ({
          productId: item.id,
          qty: item.qty || 1,
        })),
      });

      localStorage.removeItem("cart");
      await loadCart();
    } catch (err) {
      // console.error("خطا در sync سبد خرید local با سرور:", err);
    }
  };

  // وقتی یوسر آیدی تغییر می کند سبد لود بشه
  useEffect(() => {
    loadCart();
  }, [userId]);

  // اگر کاربر لاگین شد سبد خرید رو منتقل کن به بک اند
  useEffect(() => {
    if (userId) {
      syncLocalCartToServer();
    }
  }, [userId]);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("tempPhone");

    setIsLoggedIn(false);
    setUserId(null);
    setDataForm(emptyForm);
    setInitialData(emptyForm);

    // اگر لاگ اوت کرد دوباره برگرده به حالت مهمان
    try {
      const localCart = localStorage.getItem("cart");
      setProductBuy(localCart ? JSON.parse(localCart) : []);
    } catch (err) {
      // console.log(err);
      setProductBuy([]);
    }
  };

  const value = useMemo(
    () => ({
      isLoggedIn,
      setIsLoggedIn,
      logout,

      productbuy,
      // setProductBuy,

      // addedItems,
      // setAddedItems,

      userId,
      setUserId,

      dataForm,
      setDataForm,

      sendCode,
      saveOrUpdateUser,
      verifyCode,
      addToCart,
      removeFromCart,
      updateQuantity,
      loadCart,

      notif,
      setNotif,
    }),
    [isLoggedIn, productbuy, userId, dataForm, notif],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useAuth() {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
