"use client";

import { useCallback } from "react";

export function useProducts() {
  const getProducts = useCallback(
    async (
      page = 1,
      limit = 12,
      category?: string,
      search?: string
    ) => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        category: category ?? "",
        search: search ?? "",
      });

      const res = await fetch(`/api/products?${params}`);

      if (!res.ok) throw new Error("Failed to fetch products");

      return res.json();
    },
    []
  );

  return { getProducts };
}
// export function getSingleProduct() {
//   const singleProduct = useCallback(
//     async (
//      id?: string
//     ) => {
      

//       const res = await fetch(`/api/products?${id}`);

//       if (!res.ok) throw new Error("Failed to fetch products");

//       return res.json();
//     },
//     []
//   );

//   return { singleProduct };
// } 
     