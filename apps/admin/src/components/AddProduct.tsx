"use client";

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import Image from "next/image";
import { upload } from "@imagekit/next";
import { ImagePlus, X } from "lucide-react";
const categories = [
  "T-shirts",
  "Shoes",
  "Accessories",
  "Bags",
  "Dresses",
  "Jackets",
  "Gloves",
] as const;

const colors = [
  "blue",
  "green",
  "red",
  "yellow",
  "purple",
  "orange",
  "pink",
  "brown",
  "gray",
  "black",
  "white",
] as const;

const sizes = [
  "xs", "s", "m", "l", "xl", "xxl",
  "34", "35", "36", "37", "38", "39", "40",
  "41", "42", "43", "44", "45", "46", "47", "48",
] as const;

const formSchema = z.object({
  name: z.string().min(1, { message: "Product name is required!" }),
  shortDescription: z
    .string()
    .min(1, { message: "Short description is required!" })
    .max(500),
  description: z.string().min(1, { message: "Description is required!" }),
  price: z.coerce.number().positive({ message: "Price must be a positive number!" }),
  category: z.enum(categories),
  sizes: z.array(z.enum(sizes)),
  colors: z.array(z.enum(colors)),
  images: z.record(z.string(), z.string()),
});

type FormValues = z.infer<typeof formSchema>;

interface AddProductProps {
  onSuccess?: () => void;
}

const PRODUCT_SERVICE_URL =
  process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL ?? "http://localhost:8003";

const AddProduct = ({ onSuccess }: AddProductProps) => {
  const { getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingColors, setUploadingColors] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sizes: [],
      colors: [],
      images: {},
    },
  });

  const uploadImage = async (color: string, file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file to upload.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Images must be 10 MB or smaller.");
      return;
    }

    setError(null);
    setUploadingColors((current) => [...current, color]);
    setUploadProgress((current) => ({ ...current, [color]: 0 }));

    try {
      const authResponse = await fetch("/api/imagekit-auth", {
        cache: "no-store",
      });
      if (!authResponse.ok) {
        const body = await authResponse.json().catch(() => null);
        throw new Error(
          body?.error ?? `ImageKit authentication failed (${authResponse.status}).`
        );
      }
      const { token, expire, signature, publicKey } = await authResponse.json();
      const result = await upload({
        file,
        fileName: file.name,
        folder: "/products",
        token,
        expire,
        signature,
        publicKey,
        onProgress: (event) => {
          setUploadProgress((current) => ({
            ...current,
            [color]: Math.round((event.loaded / event.total) * 100),
          }));
        },
      });

      if (!result.url) {
        throw new Error("ImageKit uploaded the file without returning a URL.");
      }
      form.setValue(
        `images.${color}`,
        result.url,
        { shouldDirty: true, shouldValidate: true }
      );
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Image upload failed. Please try again."
      );
    } finally {
      setUploadingColors((current) => current.filter((value) => value !== color));
    }
  };

  const removeImage = (color: string) => {
    const { [color]: removedImage, ...images } = form.getValues("images");
    void removedImage;
    form.setValue("images", images, { shouldDirty: true, shouldValidate: true });
    setUploadProgress((current) => {
      const { [color]: removedProgress, ...progress } = current;
      void removedProgress;
      return progress;
    });
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error(
          "Not authenticated. Please log in on the client app first."
        );
      }
      const res = await fetch(`${PRODUCT_SERVICE_URL}/products/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `Request failed: ${res.status}`);
      }

      form.reset();
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SheetContent>
      <ScrollArea className="h-screen">
        <SheetHeader>
          <SheetTitle className="mb-4">Add Product</SheetTitle>
          <SheetDescription asChild>
            <Form {...form}>
              <form
                className="space-y-8"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                {error && (
                  <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                    {error}
                  </p>
                )}

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the name of the product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a brief description (max 500 chars).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the full description of the product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the price of the product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Select the category of the product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sizes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sizes</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-3 gap-4 my-2">
                          {sizes.map((size) => (
                            <div className="flex items-center gap-2" key={size}>
                              <Checkbox
                                id={`size-${size}`}
                                checked={field.value?.includes(size)}
                                onCheckedChange={(checked) => {
                                  const current = field.value ?? [];
                                  field.onChange(
                                    checked
                                      ? [...current, size]
                                      : current.filter((v) => v !== size)
                                  );
                                }}
                              />
                              <label
                                htmlFor={`size-${size}`}
                                className="text-xs"
                              >
                                {size}
                              </label>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Select the available sizes.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="colors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Colors</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4 my-2">
                            {colors.map((color) => (
                              <div
                                className="flex items-center gap-2"
                                key={color}
                              >
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
                                  className="text-xs flex items-center gap-2"
                                >
                                  <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: color }}
                                  />
                                  {color}
                                </label>
                              </div>
                            ))}
                          </div>

                          {field.value && field.value.length > 0 && (
                            <div className="mt-4 space-y-3">
                              <p className="text-sm font-medium">
                                Product images by color
                              </p>
                              {field.value.map((color) => (
                                <div className="space-y-2" key={color}>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="h-3 w-3 rounded-full shrink-0"
                                      style={{ backgroundColor: color }}
                                    />
                                    <span className="text-sm capitalize">{color}</span>
                                  </div>
                                  {form.watch(`images.${color}`) ? (
                                    <div className="flex items-center gap-3 rounded-md border p-2">
                                      <Image
                                        src={form.watch(`images.${color}`)!}
                                        alt={`${color} product`}
                                        width={64}
                                        height={64}
                                        unoptimized
                                        className="h-16 w-16 rounded object-cover"
                                      />
                                      <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                                        Uploaded to ImageKit
                                      </span>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        aria-label={`Remove ${color} image`}
                                        onClick={() => removeImage(color)}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed px-3 py-3 text-sm text-muted-foreground hover:bg-muted/50">
                                      <ImagePlus className="h-4 w-4" />
                                      <span>
                                        {uploadingColors.includes(color)
                                          ? `Uploading ${uploadProgress[color] ?? 0}%`
                                          : "Choose an image"}
                                      </span>
                                      <Input
                                        type="file"
                                        accept="image/*"
                                        className="sr-only"
                                        disabled={uploadingColors.includes(color)}
                                        onChange={(event) => {
                                          const file = event.target.files?.[0];
                                          if (file) void uploadImage(color, file);
                                          event.target.value = "";
                                        }}
                                      />
                                    </label>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Select available colors and add image URLs.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Creating..." : "Create Product"}
                </Button>
              </form>
            </Form>
          </SheetDescription>
        </SheetHeader>
      </ScrollArea>
    </SheetContent>
  );
};

export default AddProduct;
