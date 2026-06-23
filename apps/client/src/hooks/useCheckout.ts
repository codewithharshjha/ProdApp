"use client";

import { useState } from "react";

export function useCheckout() {
  const [loading, setLoading] = useState(false);

  const checkout = async (payload: any) => {
    try {
      setLoading(true);

      const res = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // userID: localStorage.getItem("userId") || "",
          
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Checkout failed");
      }

      return await res.json();
    } catch (error) {
      console.error("Checkout error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { checkout, loading };
}