"use client";

import Login from "@/app/Login/Login";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const local = localStorage.getItem("admin");

    if (local) {
        router.push("/dashboard");
    } else {
        router.push("/");
    }
  }, []);

  return (
    <div>
      <Login />
    </div>
  );
}
