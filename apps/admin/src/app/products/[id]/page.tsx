import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Tag, DollarSign, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import EditProductForm from "./EditProductForm";
import { getProduct } from "@/hooks/use-mobile";
const PRODUCT_SERVICE_URL =
  process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL ?? "http://localhost:8003";

// async function getProduct(id: string) {
//   const res = await fetch(`${PRODUCT_SERVICE_URL}/products/${id}`, {
//     cache: "no-store",
//   });
//   if (!res.ok) return null;
//   return res.json();
// }

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) return notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/products"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All Products
        </Link>
      </div>

      {/* Product Summary */}
      <div className="bg-secondary/50 rounded-xl p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground mt-1">{product.shortDescription}</p>
          </div>
          <Badge variant="outline" className="text-lg px-3 py-1 shrink-0">
            ${product.price}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {product.category && (
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              {product.category}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            {product.sizes?.length ?? 0} sizes
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" />
            ID: <code className="text-xs bg-muted px-1 rounded">{product.id}</code>
          </span>
        </div>

        {/* Color swatches */}
        {product.colors?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color: string) => (
              <div key={color} className="flex items-center gap-1.5 text-xs">
                <span
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: color }}
                />
                {color}
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Edit Form */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Edit Product</h2>
        <EditProductForm product={product} />
      </div>
    </div>
  );
}
