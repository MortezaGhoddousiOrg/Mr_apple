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

  const verifyCode = async (phone, code) => {
    try {
      // 1) تایید ورود کاربر
      await api.post("/api/auth/verify-code/", {
        phone,
        code,
      });

      // 2) اول کاربر را لاگین کن
      // حتی اگر انتقال سبد مشکل داشت، ورود خراب نشود
      await checkAuth();

      // 3) انتقال سبد مهمان به حساب کاربر
      await syncLocalCartToServer();

      return true;
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
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

  const addToCart = async (item) => {
    try {
      const productId = item?.id ?? item?.product_id;
      const variantId = item?.variant_id ?? item?.variantId ?? null;

      if (!productId) {
        throw new Error("شناسه محصول وجود ندارد");
      }

      if (isLoggedIn) {
        const payload = {
          product_id: productId,
          variant_id: variantId,
          quantity: 1,
        };

        await api.post("/api/orders/cart/add/", payload);

        await loadCart();
      } else {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

        // محصول + واریانت باید با هم بررسی شوند
        const existingItem = localCart.find(
          (p) =>
            p.product_id === productId && (p.variant_id ?? null) === variantId,
        );

        if (existingItem) {
          return {
            success: false,
            alreadyAdded: true,
          };
        }

        const stock = Number(item.quantity ?? 0);

        const newItem = {
          // اطلاعات اصلی
          id: productId,
          product_id: productId,

          // واریانت
          variant_id: variantId,

          // اطلاعات محصول
          name: item.name ?? item.title ?? "",
          title: item.title ?? item.name ?? "",
          description: item.description ?? "",
          more_description: item.more_description ?? "",

          // اطلاعات ظاهری
          image: item.image ?? "",

          // قیمت
          price: Number(item.price ?? 0),
          original_price: Number(item.original_price ?? item.price ?? 0),
          discount_percent: Number(item.discount_percent ?? item.discount ?? 0),

          // مشخصات محصول
          brand: item.brand ?? "",
          category: item.category ?? "",
          color: item.color ?? "",
          condition: item.condition ?? "",
          sku: item.sku ?? "",

          // گارانتی
          warranty: item.warranty ?? "",
          warranty_months: item.warranty_months ?? null,
          duration_months: item.duration_months ?? null,

          // موجودی
          quantity: stock,

          // تعداد خرید
          cart_quantity: 1,
        };

        const updatedCart = [...localCart, newItem];

        localStorage.setItem("cart", JSON.stringify(updatedCart));

        setProductBuy(updatedCart);
      }

      return {
        success: true,
        alreadyAdded: false,
      };
    } catch (err) {
      console.error("ADD TO CART ERROR:", err);
      throw err;
    }
  };

  const syncLocalCartToServer = async () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (!cart.length) {
      await loadCart();
      return;
    }

    const failedItems = [];

    for (const item of cart) {
      try {
        await api.post("/api/orders/cart/add/", {
          product_id: item.product_id,
          variant_id: item.variant_id ?? null,
          quantity: item.cart_quantity,
        });
      } catch (err) {
        console.error(
          "محصول منتقل نشد:",
          item.product_id,
          item.variant_id,
          err.response?.data,
        );

        failedItems.push(item);
      }
    }

    if (failedItems.length) {
      localStorage.setItem("cart", JSON.stringify(failedItems));
    } else {
      localStorage.removeItem("cart");
    }

    await loadCart();
  };

  const removeFromCart = async (productId, variantId = null) => {
    try {
      if (isLoggedIn) {
        await api.post("/api/orders/cart/remove/", {
          product_id: productId,
          variant_id: variantId,
        });

        await loadCart();
      } else {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

        const updatedCart = localCart.filter(
          (item) =>
            !(
              item.product_id === productId &&
              (item.variant_id ?? null) === variantId
            ),
        );

        localStorage.setItem("cart", JSON.stringify(updatedCart));

        setProductBuy(updatedCart);
      }

      return { success: true };
    } catch (err) {
      console.error("REMOVE CART ERROR:", err);
      throw err;
    }
  };

  const updateQuantity = async (productId, qty, variantId = null) => {
    try {
      const safeQty = Math.max(Number(qty) || 1, 1);

      if (isLoggedIn) {
        await api.post("/api/orders/cart/update/", {
          product_id: productId,
          variant_id: variantId,
          quantity: safeQty,
        });

        await loadCart();
      } else {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

        const updatedCart = localCart.map((item) => {
          const sameProduct = item.product_id === productId;

          const sameVariant = (item.variant_id ?? null) === variantId;

          if (!sameProduct || !sameVariant) {
            return item;
          }

          const stock = Number(item.quantity ?? 0);

          // اگر موجودی مشخص شده باشد
          const finalQty = stock > 0 ? Math.min(safeQty, stock) : safeQty;

          return {
            ...item,
            cart_quantity: finalQty,
          };
        });

        localStorage.setItem("cart", JSON.stringify(updatedCart));

        setProductBuy(updatedCart);
      }

      return { success: true };
    } catch (err) {
      console.error("UPDATE CART ERROR:", err);
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
    [isLoggedIn, productbuy, dataForm, notif],
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
