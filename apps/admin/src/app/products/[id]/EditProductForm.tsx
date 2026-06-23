"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import type { Product } from "../columns";

const categories = [
  "T-shirts", "Shoes", "Accessories", "Bags",
  "Dresses", "Jackets", "Gloves",
] as const;

const colors = [
  "blue", "green", "red", "yellow", "purple",
  "orange", "pink", "brown", "gray", "black", "white",
] as const;

const sizes = [
  "xs", "s", "m", "l", "xl", "xxl",
  "34", "35", "36", "37", "38", "39", "40",
  "41", "42", "43", "44", "45", "46", "47", "48",
] as const;

const formSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  shortDescription: z.string().min(1).max(500),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().positive("Price must be positive"),
  category: z.string().optional(),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  images: z.record(z.string(), z.string()).default({}),
});

type FormValues = z.infer<typeof formSchema>;

const PRODUCT_SERVICE_URL =
  process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL ?? "http://localhost:8003";

interface EditProductFormProps {
  product: Product & { category?: string };
}

export default function EditProductForm({ product }: EditProductFormProps) {
  const { getToken } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name,
      shortDescription: product.shortDescription,
      description: product.description,
      price: product.price,
      category: product.category ?? "",
      sizes: product.sizes ?? [],
      colors: product.colors ?? [],
      images: product.images ?? {},
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated. Please log in on the client app first.");

      const res = await fetch(`${PRODUCT_SERVICE_URL}/products/${product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `Update failed: ${res.status}`);
      }

      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async () => {
    if (!confirm("Are you sure you want to delete this product? This cannot be undone.")) return;
    setIsDeleting(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated.");

      const res = await fetch(`${PRODUCT_SERVICE_URL}/products/${product.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok && res.status !== 204) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `Delete failed: ${res.status}`);
      }

      router.push("/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsDeleting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md">
            Product updated successfully!
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Short Description */}
        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl><Textarea rows={4} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sizes */}
        <FormField
          control={form.control}
          name="sizes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sizes</FormLabel>
              <FormControl>
                <div className="grid grid-cols-6 gap-2">
                  {sizes.map((size) => (
                    <div key={size} className="flex items-center gap-1.5">
                      <Checkbox
                        id={`size-${size}`}
                        checked={field.value?.includes(size)}
                        onCheckedChange={(checked) => {
                          const current = field.value ?? [];
                          field.onChange(
                            checked ? [...current, size] : current.filter((v) => v !== size)
                          );
                        }}
                      />
                      <label htmlFor={`size-${size}`} className="text-xs cursor-pointer">
                        {size}
                      </label>
                    </div>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Colors + Images */}
        <FormField
          control={form.control}
          name="colors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Colors</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map((color) => (
                      <div key={color} className="flex items-center gap-1.5">
                        <Checkbox
                          id={`color-${color}`}
                          checked={field.value?.includes(color)}
                          onCheckedChange={(checked) => {
                            const current = field.value ?? [];
                            const next = checked
                              ? [...current, color]
                              : current.filter((v) => v !== color);
                            field.onChange(next);
                            if (!checked) {
                              const imgs = form.getValues("images");
                              const { [color]: _, ...rest } = imgs;
                              form.setValue("images", rest);
                            }
                          }}
                        />
                        <label
                          htmlFor={`color-${color}`}
                          className="text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <span
                            className="w-3 h-3 rounded-full border"
                            style={{ backgroundColor: color }}
                          />
                          {color}
                        </label>
                      </div>
                    ))}
                  </div>

                  {field.value && field.value.length > 0 && (
                    <div className="space-y-2 mt-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Image URLs per color:
                      </p>
                      {field.value.map((color) => (
                        <div key={color} className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full border shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-sm w-16 shrink-0">{color}</span>
                          <Input
                            type="url"
                            placeholder="https://..."
                            defaultValue={form.getValues("images")?.[color] ?? ""}
                            onChange={(e) => {
                              const current = form.getValues("images") ?? {};
                              form.setValue("images", {
                                ...current,
                                [color]: e.target.value,
                              });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isDeleting ? "Deleting..." : "Delete Product"}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
