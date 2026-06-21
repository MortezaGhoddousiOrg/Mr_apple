// "use client";

// import { createContext, useContext, useEffect, useState } from "react";
// import { api } from "@/app/config";
// import { useMemo } from "react";

// const Context = createContext();

// export function AuthProvider({ children }) {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const [productbuy, setProductBuy] = useState([]);

//   const [notif, setNotif] = useState(null);

//   // const [userId, setUserId] = useState();
//   const [dataForm, setDataForm] = useState({
//     firstname: "",
//     lastname: "",
//     phone: "",
//     postal_code: "",
//     address: "",
//   });

//   const emptyForm = {
//     firstname: "",
//     lastname: "",
//     phone: "",
//     postal_code: "",
//     address: "",
//   };
//   const [initialData, setInitialData] = useState({});
//   const [authLoading, setAuthLoading] = useState(true);

//   const validateForm = () => {
//     if (!dataForm.firstname?.trim()) {
//       return "لطفا نام را وارد کنید";
//     }

//     if (!dataForm.lastname?.trim()) {
//       return "لطفا نام خانوادگی را وارد کنید";
//     }

//     if (!dataForm.phone?.trim()) {
//       return "لطفا شماره تلفن را وارد کنید";
//     }

//     if (!dataForm.postal_code?.trim()) {
//       return "لطفا کد پستی را وارد کنید";
//     }

//     if (!dataForm.address?.trim()) {
//       return "لطفا آدرس را وارد کنید";
//     }

//     return null;
//   };

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   const checkAuth = async () => {
//     try {
//       const res = await api.get("/api/auth/me/");

//       setDataForm(res.data);
//       setInitialData(res.data);
//       setIsLoggedIn(true);
//     } catch {
//       setIsLoggedIn(false);
//     } finally {
//       setAuthLoading(false);
//     }
//   };

//   const saveOrUpdateUser = async (updatedData) => {
//     try {
//       const hasProfile = !!(initialData?.id || initialData?.userId);

//       if (!hasProfile) {
//         const res = await api.get("/api/auth/me/", updatedData);
//         setDataForm(res.data.data);
//         setInitialData(res.data.data);
//         return "created";
//       }

//       const changed =
//         (initialData.firstname || "نام") !== (updatedData.firstname || "نام") ||
//         (initialData.lastname || "") !== (updatedData.lastname || "") ||
//         (initialData.phone || "") !== (updatedData.phone || "") ||
//         (initialData.postal_code || "") !== (updatedData.postal_code || "") ||
//         (initialData.address || "") !== (updatedData.address || "");

//       if (!changed) return;

//       const res = await api.put(`/api/auth/me/`, updatedData);

//       setDataForm(res.data.data);
//       setInitialData(res.data.data);
//       return;
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const sendCode = async (phone) => {
//     const res = await api.post("/api/auth/send-code/", { phone });
//     console.log(res.data);

//     return res.data;
//   };

//   // const verifyCode = async (phone, code) => {
//   //   await api.post("/api/auth/verify-code/", {
//   //     phone,
//   //     code,
//   //   });

//   //   await checkAuth();
//   //   return true;
//   // };

//   const verifyCode = async (phone, code) => {
//   await api.post("/api/auth/verify-code/", { phone, code });

//   const cart = JSON.parse(localStorage.getItem("cart") || "[]");
//   for (const item of cart) {
//     await api.post("/api/orders/cart/add/", {
//       product_id: item.product_id,
//       cart_quantity: item.cart_quantity,
//     });
//   }
//   localStorage.removeItem("cart");

//   await checkAuth();
//   return true;
// };

//   // خواندن سبد خرید برای مهمان و بعد از لاگین ست کردن با بک اند
//   const loadCart = async () => {
//     try {
//       if (isLoggedIn) {
//         const res = await api.get("/api/orders/cart/");
//         // console.log(res.data);

//         setProductBuy(res?.data?.items || []);
//       } else {
//         const localCart = localStorage.getItem("cart");
//         setProductBuy(localCart ? JSON.parse(localCart) : []);
//       }
//     } catch (err) {
//       console.error("خطا در دریافت سبد خرید:", err);
//       setProductBuy([]);
//     }
//   };

//   // افزودن محصول به سبد خرید
//   const addToCart = async (item) => {
//     try {
//       if (isLoggedIn) {
//         await api.post("/api/orders/cart/add/", {
//           product_id: item.id,
//           cart_quantity: 1,
//         });

//         await loadCart();
//       } else {
//         const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

//         const isAlreadyAdded = localCart.some((p) => p.product_id === item.id);
//         if (isAlreadyAdded) return;

//         const updatedCart = [
//           ...localCart,
//           {
//             ...item,
//             product_id: item.id,
//             cart_quantity: 1,
//           },
//         ];

//         localStorage.setItem("cart", JSON.stringify(updatedCart));
//         setProductBuy(updatedCart);
//       }

//       return { success: true };
//     } catch (err) {
//       console.log(err);
//     }
//   };

// const syncLocalCartToServer = async () => {
//   const cart = JSON.parse(localStorage.getItem("cart") || "[]");

//   if (!cart.length) return;

//   for (const item of cart) {
//     await api.post("/api/orders/cart/add/", {
//       product_id: item.product_id,
//       cart_quantity: item.cart_quantity,
//     });
//   }

//   localStorage.removeItem("cart");
//   await loadCart();
// };

//   // حذف محصول از سبد خرید
//   const removeFromCart = async (productId) => {
//     try {
//       if (isLoggedIn) {
//         await api.post("/api/orders/cart/remove/", {
//           product_id: productId,
//         });

//         await loadCart();
//       } else {
//         const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
//         const updatedCart = localCart.filter(
//           (item) => item.product_id !== productId,
//         );

//         localStorage.setItem("cart", JSON.stringify(updatedCart));
//         setProductBuy(updatedCart);
//       }

//       return { success: true };
//     } catch (err) {
//       // console.error("خطا در حذف از سبد خرید:", err);
//       throw err;
//     }
//   };

//   // بروزرسانی تعداد محصول
//   const updateQuantity = async (productId, qty) => {
//     try {
//       const safeQty = Math.max(qty, 1);

//       if (isLoggedIn) {
//         await api.post("/api/orders/cart/update/", {
//           product_id: productId,
//           quantity: safeQty,
//         });

//         await loadCart();
//       } else {
//         const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

//         const updatedCart = localCart.map((item) =>
//           item.product_id === productId
//             ? {
//                 ...item,
//                 cart_quantity: safeQty,
//               }
//             : item,
//         );

//         localStorage.setItem("cart", JSON.stringify(updatedCart));
//         setProductBuy(updatedCart);
//       }

//       return { success: true };
//     } catch (err) {
//       // console.error("خطا در بروزرسانی تعداد محصول:", err);
//       throw err;
//     }
//   };

//   // انتقال سبد مهمان به سرور بعد از لاگین
//   // const syncLocalCartToServer = async () => {
//   //   try {
//   //     const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
//   //     if (!localCart.length) return;

//   //     console.log(localCart);

//   //     await Promise.all(
//   //       localCart.map((item) =>
//   //         api.post("/api/orders/cart/add/", {
//   //           product_id: item.product_id,
//   //           cart_quantity: item.cart_quantity,
//   //         }),
//   //       ),
//   //     );

//   //     localStorage.removeItem("cart");
//   //     await loadCart();
//   //   } catch (err) {
//   //     console.log(err);
//   //   }
//   // };

// //   const syncLocalCartToServer = async () => {
// //   const cart = JSON.parse(localStorage.getItem("cart")) || [];

// //   if (cart.length === 0) return;

// //   for (const item of cart) {
// //     await addToCart(item.product_id, item.quantity);
// //   }

// //   localStorage.removeItem("cart");
// // };

  

//   // وقتی یوسر آیدی تغییر می کند سبد لود بشه
//   // useEffect(() => {
//   //   if (isLoggedIn) {
//   //     syncLocalCartToServer();
//   //   } else {
//   //     loadCart();
//   //   }
//   // }, [isLoggedIn]);
// useEffect(() => {
//   if (authLoading) return;

//   if (isLoggedIn) {
//     loadCart(); // از سرور
//   } else {
//     const localCart = localStorage.getItem("cart");
//     setProductBuy(localCart ? JSON.parse(localCart) : []);
//   }
// }, [isLoggedIn, authLoading]);

//   const logout = () => {
//     setIsLoggedIn(false);
//     setDataForm(emptyForm);
//     setInitialData(emptyForm);

//     // اگر لاگ اوت کرد دوباره برگرده به حالت مهمان
//     try {
//       const localCart = localStorage.getItem("cart");
//       setProductBuy(localCart ? JSON.parse(localCart) : []);
//     } catch (err) {
//       // console.log(err);
//       setProductBuy([]);
//     }
//   };

//   const value = useMemo(
//     () => ({
//       isLoggedIn,
//       setIsLoggedIn,
//       logout,

//       productbuy,

//       dataForm,
//       setDataForm,

//       sendCode,
//       saveOrUpdateUser,
//       verifyCode,
//       addToCart,
//       removeFromCart,
//       updateQuantity,
//       loadCart,
//       syncLocalCartToServer,

//       authLoading,

//       notif,
//       setNotif,
//       validateForm,
//     }),
//     [isLoggedIn, productbuy, dataForm, notif],
//   );

//   return <Context.Provider value={value}>{children}</Context.Provider>;
// }

// export function useAuth() {
//   const context = useContext(Context);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// }



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
 
  // ✅ logout به سرور هم میزنه
  const logout = async () => {
    try {
      await api.post("/api/auth/logout/");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggedIn(false);
      setDataForm(emptyForm);
      setInitialData(emptyForm);
      try {
        const localCart = localStorage.getItem("cart");
        setProductBuy(localCart ? JSON.parse(localCart) : []);
      } catch {
        setProductBuy([]);
      }
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