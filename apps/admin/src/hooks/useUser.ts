"use client";

import { useCallback, useState } from "react";

export const useGetAllUsers = () => {
  const [loading, setLoading] = useState(false);

  const getAllUsers = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/users/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
   
      if (!res.ok) {
        throw new Error("Failed to fetch user orders");
      }

      return await res.json();
    } catch (error) {
      console.error("Error fetching user orders:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getAllUsers, loading };
};

export default useGetAllUsers;
