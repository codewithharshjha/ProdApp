// app/payment/success/page.tsx
"use client";
import Link from "next/link";
import { useEffect } from "react";
interface Props {
  searchParams: Promise<{
    session_id?: string;
  }>;
}

export default async function PaymentSuccessPage({
  searchParams,
}: Props) {
  const { session_id } = await searchParams;


//   useEffect(() => {
//   if (!session_id) return;

//   fetch(`/api/payments/verify?session_id=${session_id}`);
// }, [session_id]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <div className="text-6xl mb-4">🎉</div>

        <h1 className="text-2xl font-bold text-gray-900">
          Payment Successful
        </h1>

        <p className="text-gray-600 mt-2">
          Your payment has been received successfully.
        </p>

        {session_id && (
          <div className="mt-4 p-3 bg-gray-100 rounded text-sm break-all">
            {session_id}
          </div>
        )}

        <p className="text-sm text-gray-500 mt-4">
          Your order is being processed.
        </p>

        <Link
          href="/orders"
          className="inline-block mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-6 py-3 rounded-lg"
        >
          View Orders
        </Link>
      </div>
    </div>
  );
}