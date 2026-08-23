import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const PAYMENT_SERVICE_URL =
  process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL ?? "http://localhost:8000";
console.log("PAYMENT_SERVICE_URL", PAYMENT_SERVICE_URL);
export async function POST(req: NextRequest) {
  try {
    const { getToken, userId } = await auth();
    const token = await getToken();

    const body = await (req as any).json();
console.log("body from client", body);
    const res = await fetch(`${PAYMENT_SERVICE_URL}/payments/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-user-id": userId || "",
      },
     
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: "Order creation failed" },
        { status: 500 }
      );
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Checkout error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}