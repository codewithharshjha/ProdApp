"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { ProductsType } from "@/types";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "./ProductCard";
import { Loader2 } from "lucide-react";

interface InfiniteProductGridProps {
  initialProducts: ProductsType;
  totalPages: number;
  category?: string;
  search?: string;
}

export default function InfiniteProductGrid({
  initialProducts,
  totalPages,
  category,
  search,
}: InfiniteProductGridProps) {
  const { getProducts } = useProducts();

  const [products, setProducts] = useState<ProductsType>(initialProducts ?? []);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(totalPages > 1);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<(() => void) | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const nextPage = page + 1;

      const result = await getProducts(nextPage, 12, category, search);

      setProducts((prev) => [...prev, ...result.data]);
      setPage(nextPage);
      setHasMore(nextPage < result.pagination.totalPages);
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, category, search, getProducts]);

  loadMoreRef.current = loadMore;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMoreRef.current?.();
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setProducts(initialProducts ?? []);
    setPage(1);
    setHasMore(totalPages > 1);
  }, [initialProducts, totalPages]);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div ref={sentinelRef} className="h-4" />

      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <p className="text-center text-sm text-gray-400 py-8">
          You&apos;ve seen all products
        </p>
      )}
    </div>
  );
}