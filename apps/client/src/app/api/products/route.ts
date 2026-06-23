import { auth } from "@clerk/nextjs/server";

const PRODUCT_SERVICE_URL =
  process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL ?? "http://localhost:8000";

export async function GET(req: Request) {
    const { getToken } = await auth();   
    const token = await getToken()

  const { searchParams } = new URL(req.url);

  const res = await fetch(
    `${PRODUCT_SERVICE_URL}/products?${searchParams}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  const data = await res.json();

  return Response.json(data);
}