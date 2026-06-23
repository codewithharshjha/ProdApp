"use client";

import { useEffect, useState } from "react";
import Categories from "./Categories";
import Filter from "./Filter";
import InfiniteProductGrid from "./InfiniteProductGrid";
import { useProducts } from "@/hooks/useProducts";
import Link from "next/link";
import type { ProductsType } from "@/types";

interface ProductListProps {
  category?: string;
  search?: string;
  params: "homepage" | "products";
}

export default function ProductList({
  category,
  search,
  params,
}: ProductListProps) {
  const { getProducts } = useProducts();

  const [initialProducts, setInitialProducts] = useState<ProductsType>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInitialProducts() {
      try {
        const result = await getProducts(1, 12, category, search);

        setInitialProducts(result.data);
        setTotalPages(result?.pagination?.totalPages);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInitialProducts();
  }, [category, search, getProducts]);

  if (loading) {
    return <div className="py-10 text-center">Loading products...</div>;
  }

  return (
    <div className="w-full">
      <Categories />

      {params === "products" && <Filter />}

      <InfiniteProductGrid
        initialProducts={initialProducts}
        totalPages={totalPages}
        category={category}
        search={search}
      />

      {params === "homepage" && (
        <Link
          href={category ? `/products/?category=${category}` : "/products"}
          className="flex justify-end mt-4 underline text-sm text-gray-500"
        >
          View all products
        </Link>
      )}
    </div>
  );
}