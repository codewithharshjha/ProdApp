import { auth ,getAuth } from "@clerk/nextjs/server";
import { NextResponse  } from "next/server";
import { Request } from "express";

const USER_SERVICE_URL =
  process.env.NEXT_PUBLIC_USER_SERVICE_URL ?? "http://localhost:8000";
console.log("USER_SERVICE_URL", USER_SERVICE_URL);
export async function GET(req: Request) {
  try {
    const { getToken } = await auth();
    const token = await getToken();
     const authuser = getAuth(req);

  const userId = authuser?.userId;


    const res = await fetch(`${USER_SERVICE_URL}/users/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-user-id": userId || "",
      },
     
     
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: "Order creation failed" },
        { status: 500 }
      );
    }

    const data = await res.json();
console.log("data from order service", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Checkout error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}