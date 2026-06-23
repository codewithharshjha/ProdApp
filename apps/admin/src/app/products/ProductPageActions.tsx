"use client";

import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddProduct from "@/components/AddProduct";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ProductPageActions = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Add Product
        </Button>
      </SheetTrigger>
      <AddProduct
        onSuccess={() => {
          setOpen(false);
          router.refresh();
        }}
      />
    </Sheet>
  );
};

export default ProductPageActions;
