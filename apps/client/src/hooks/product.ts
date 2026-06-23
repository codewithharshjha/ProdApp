import type { PaginatedProductsResponse } from "@/types";
import { auth } from "@clerk/nextjs/server";

const PRODUCT_SERVICE_URL =
  process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL ?? "http://localhost:8000";

// export const getProducts = async (
//   page = 1,
//   limit = 12,
//   category?: string,
//   search?: string
// ): Promise<PaginatedProductsResponse> => {

//   const { getToken } = await auth();
//   const token = await getToken();
// console.log("token", token);  
//   try {
//     const params = new URLSearchParams({
//       page: String(page),
//       limit: String(limit),
//       category: category ?? "",
//       search: search ?? "",
//     });

//     const res = await fetch(`${PRODUCT_SERVICE_URL}/products?${params}`, {
//       cache: "no-store",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!res.ok)
//       return { data: [], pagination: { page, limit, total: 0, totalPages: 0 } };

//     return res.json();
//   } catch {
//     return { data: [], pagination: { page, limit, total: 0, totalPages: 0 } };
//   }
// };