import ProductList from "@/components/ProductList";
import Image from "next/image";

const Homepage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }>;
}) => {
  const params = await searchParams;
  const category = params?.category ?? "";

  console.log("category:", category);
  console.log("searchParams:", params);

  return (
    <div>
      <div className="relative aspect-[3/1] mb-12">
        <Image src="/featured.png" alt="Featured Product" fill />
      </div>

      <ProductList category={category} params="homepage" />
    </div>
  );
};

export default Homepage;