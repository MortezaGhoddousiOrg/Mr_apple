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
      value={{ isLoggedIn, setIsLoggedIn, logout, setProductBuy, productbuy, addedItems, setAddedItems, notif, setNotif }}
    >
      {children}
    </Context.Provider>
  );
}

export function useAuth() {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
