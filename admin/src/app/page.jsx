"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Login from "@/app/Login/Login";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (admin) {
      router.push("/dashboard");
    }
  }, []);

  return <Login />;
}