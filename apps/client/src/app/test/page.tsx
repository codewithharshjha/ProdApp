import { auth } from "@clerk/nextjs/server";
import React from "react";

const TestPage = async () => {
  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    return (
      <div className="p-4 text-red-600">
        Not signed in or session not available. Sign in on this app first, then refresh this page.
      </div>
    );
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const resProduct = await fetch("http://localhost:8003/test", { headers });
  const dataProduct = await resProduct.json();
  console.log(dataProduct);
  const resOrder = await fetch("http://localhost:8001/test", { headers });
  const dataOrder = await resOrder.json();
  console.log(dataOrder);

  const resPayment = await fetch("http://localhost:8001/test", { headers });
  const dataPayment = await resPayment.json();
  console.log(dataPayment);

  return (
    <div className="p-4 space-y-2">
      <p className="font-medium">Product service:</p>
      <pre className="bg-muted p-2 rounded text-sm">{JSON.stringify(dataProduct, null, 2)}</pre>
      {dataProduct.message === "you are not logged in" && (
        <p className="text-amber-600 text-sm">
          Product-service could not verify your token. Ensure apps/product-service/.env has
          CLERK_SECRET_KEY from the same Clerk app as this client.
        </p>
      )}
    </div>
  );
}

export default TestPage