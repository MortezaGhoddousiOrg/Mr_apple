"use client";
 
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/app/config";
import { useMemo } from "react";
 
const Context = createContext();
 
export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [productbuy, setProductBuy] = useState([]);
  const [notif, setNotif] = useState(null);
  const [dataForm, setDataForm] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    postal_code: "",
    address: "",
  });
 
  const emptyForm = {
    firstname: "",
    lastname: "",
    phone: "",
    postal_code: "",
    address: "",
  };
 
  const [initialData, setInitialData] = useState({});
  const [authLoading, setAuthLoading] = useState(true);
 
  const validateForm = () => {
    if (!dataForm.firstname?.trim()) return "لطفا نام را وارد کنید";
    if (!dataForm.lastname?.trim()) return "لطفا نام خانوادگی را وارد کنید";
    if (!dataForm.phone?.trim()) return "لطفا شماره تلفن را وارد کنید";
    if (!dataForm.postal_code?.trim()) return "لطفا کد پستی را وارد کنید";
    if (!dataForm.address?.trim()) return "لطفا آدرس را وارد کنید";
    return null;
  };
 
  useEffect(() => {
    checkAuth();
  }, []);
 
  const checkAuth = async () => {
    try {
      const res = await api.get("/api/auth/me/");
      setDataForm(res.data);
      setInitialData(res.data);
      setIsLoggedIn(true);
    } catch {
      setIsLoggedIn(false);
    } finally {
      setAuthLoading(false);
    }
  };
 
  // ✅ همیشه PUT میزنه — بک‌اند فیلدهای نبود رو نگه میداره
  const saveOrUpdateUser = async (updatedData) => {
    try {
      const res = await api.put("/api/auth/me/", updatedData);
      setDataForm(res.data.data);
      setInitialData(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };
 
  const sendCode = async (phone) => {
    const res = await api.post("/api/auth/send-code/", { phone });
    return res.data;
  };
 
  // ✅ cart_quantity → quantity (طبق API doc)
  const verifyCode = async (phone, code) => {
    await api.post("/api/auth/verify-code/", { phone, code });
 
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    for (const item of cart) {
      await api.post("/api/orders/cart/add/", {
        product_id: item.product_id,
        quantity: item.cart_quantity,
      });
    }
    localStorage.removeItem("cart");
 
    await checkAuth();
    return true;
  };
 
  const loadCart = async () => {
    try {
      if (isLoggedIn) {
        const res = await api.get("/api/orders/cart/");
        setProductBuy(res?.data?.items || []);
      } else {
        const localCart = localStorage.getItem("cart");
        setProductBuy(localCart ? JSON.parse(localCart) : []);
      }
    } catch (err) {
      console.error("خطا در دریافت سبد خرید:", err);
      setProductBuy([]);
    }
  };
 
  // ✅ cart_quantity → quantity
  const addToCart = async (item) => {
    try {
      if (isLoggedIn) {
        await api.post("/api/orders/cart/add/", {
          product_id: item.id,
          quantity: 1,
        });
        await loadCart();
      } else {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const isAlreadyAdded = localCart.some((p) => p.product_id === item.id);
        if (isAlreadyAdded) return;
 
        const updatedCart = [
          ...localCart,
          { ...item, product_id: item.id, cart_quantity: 1 },
        ];
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setProductBuy(updatedCart);
      }
      return { success: true };
    } catch (err) {
      console.log(err);
    }
  };
 
  // ✅ cart_quantity → quantity
  const syncLocalCartToServer = async () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (!cart.length) return;
 
    for (const item of cart) {
      await api.post("/api/orders/cart/add/", {
        product_id: item.product_id,
        quantity: item.cart_quantity,
      });
    }
    localStorage.removeItem("cart");
    await loadCart();
  };
 
  const removeFromCart = async (productId) => {
    try {
      if (isLoggedIn) {
        await api.post("/api/orders/cart/remove/", { product_id: productId });
        await loadCart();
      } else {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const updatedCart = localCart.filter((item) => item.product_id !== productId);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setProductBuy(updatedCart);
      }
      return { success: true };
    } catch (err) {
      throw err;
    }
  };
 
  const updateQuantity = async (productId, qty) => {
    try {
      const safeQty = Math.max(qty, 1);
 
      if (isLoggedIn) {
        await api.post("/api/orders/cart/update/", {
          product_id: productId,
          quantity: safeQty,
        });
        await loadCart();
      } else {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const updatedCart = localCart.map((item) =>
          item.product_id === productId
            ? { ...item, cart_quantity: safeQty }
            : item
        );
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setProductBuy(updatedCart);
      }
      return { success: true };
    } catch (err) {
      throw err;
    }
  };
 
  useEffect(() => {
    if (authLoading) return;
    if (isLoggedIn) {
      loadCart();
    } else {
      const localCart = localStorage.getItem("cart");
      setProductBuy(localCart ? JSON.parse(localCart) : []);
    }
  }, [isLoggedIn, authLoading]);
 
const logout = () => {
  setIsLoggedIn(false);
  setDataForm(emptyForm);
  setInitialData(emptyForm);

  try {
    const localCart = localStorage.getItem("cart");
    setProductBuy(localCart ? JSON.parse(localCart) : []);
  } catch {
    setProductBuy([]);
  }
};
 
  const value = useMemo(
    () => ({
      isLoggedIn,
      setIsLoggedIn,
      logout,
      productbuy,
      dataForm,
      setDataForm,
      sendCode,
      saveOrUpdateUser,
      verifyCode,
      addToCart,
      removeFromCart,
      updateQuantity,
      loadCart,
      syncLocalCartToServer,
      authLoading,
      notif,
      setNotif,
      validateForm,
    }),
    [isLoggedIn, productbuy, dataForm, notif]
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