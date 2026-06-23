import { Product, columns } from "./columns";
import { DataTable } from "./data-table";
import ProductPageActions from "./ProductPageActions";
import { getAllProducts } from "@/hooks/use-mobile";

const data = await getAllProducts() || [];
const ProductsPage = async () => {
  
  return (
    <div>
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md flex items-center justify-between">
        <h1 className="font-semibold">All Products</h1>
        <ProductPageActions />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default ProductsPage;
