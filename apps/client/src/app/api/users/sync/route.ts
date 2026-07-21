import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    console.log("Syncing user data with API Gateway...");
    // Get authenticated user id
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get Clerk user details
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const payload = {
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    };
console.log("Payload to send to API Gateway:", payload);
    // Call your API Gateway
    const response = await fetch(
      // `${process.env.API_GATEWAY_URL}/users/sync`,
      "http://localhost:8000/users/sync",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          userId: user.id,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("error syncing user data:", error);

    return NextResponse.json(
      { message: "Internal Server Error from sync" },
      { status: 500 }
    );
  }
}