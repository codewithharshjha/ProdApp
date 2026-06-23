import { auth } from "@clerk/nextjs/server";

const PRODUCT_SERVICE_URL =
  process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL ?? "http://localhost:8000";


  
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { userId, getToken } = await auth();
  const token = await getToken();

  console.log("Fetching product with id:", id, "userId:", userId, "token:", token);

  const res = await fetch(`${PRODUCT_SERVICE_URL}/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-user-id": userId || "",
    },
    cache: "no-store",
    // Include userId in the request body
  });
  const data = await res.json();
  console.log("Response status from product service:", data) ;

  return Response.json(data, { status: res.status });
}
