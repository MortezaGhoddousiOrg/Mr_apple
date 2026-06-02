"use client";

import { createContext, useContext, useEffect, useState } from "react";

const Context = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [productbuy, setProductBuy] = useState([]);

  const [addedItems, setAddedItems] = useState([]);

  const [notif, setNotif] = useState({
    message: "",
    type: "",
  });

  const [phone, setPhone] = useState();
  const [userId, setUserId] = useState();
  const [dataForm, setDataForm] = useState();

  useEffect(() => {
    if (!phone) return;

    const phoneUser = async () => {
      try {
        const res = await api.post("/me", { phone });
        setUserId(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    phoneUser();
  }, [phone]);

  useEffect(() => {
    if (!userId) return;

    const dataUser = async () => {
      try {
        const res = await api.post("/me", { userId });
        setDataForm(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    dataUser();
  }, [userId]);



  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart");
      if (stored) setProductBuy(JSON.parse(stored));
    } catch (err) {
      console.log(err);
      setProductBuy([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(productbuy));
    } catch (err) {
      console.log(err);
    }
  }, [productbuy]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  return (
    <Context.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        logout,
        setProductBuy,
        productbuy,
        addedItems,
        setAddedItems,
        notif,
        setNotif,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useAuth() {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
