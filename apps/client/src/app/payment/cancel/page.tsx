// app/payment/cancel/page.tsx

import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold text-red-600">
          Payment Cancelled
        </h1>

        <p className="mt-4 text-gray-600">
          Your payment was not completed.
        </p>

        <Link
          href="/cart"
          className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-lg"
        >
          Return To Cart
        </Link>
      </div>
    </div>
  );
}