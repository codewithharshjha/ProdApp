"use client";

import { useEffect, useState } from "react";
import { useGetUserOrders } from "@/hooks/useOrder";

interface OrderItem {
  productId: string;
  productName: string;
  productShortDescription: string;
  productDescription: string;
  quantity: number;
  price: number;
  images: string[];
}

interface Order {
  userId: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const { getUserOrders, loading } = useGetUserOrders();

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders();

        setOrders(data);

        if (data.length > 0) {
          setSelectedOrder(data[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);
console.log("orders from page", selectedOrder);
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50 p-6">
      <div className="mx-auto max-w-7xl">

        <h1 className="mb-6 text-3xl font-bold text-gray-800">
          My Orders
        </h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

          {/* LEFT SIDE */}

          <div className="lg:col-span-4">

            <div className="overflow-hidden rounded-xl bg-white shadow">

              <div className="border-b bg-yellow-400 px-5 py-4">
                <h2 className="font-semibold text-black">
                  Orders ({orders.length})
                </h2>
              </div>

              <div className="max-h-[75vh] overflow-y-auto">

                {orders.map((order, index) => (

                  <button
                    key={index}
                    onClick={() => setSelectedOrder(order)}
                    className={`w-full border-b p-5 text-left transition-all hover:bg-yellow-50 ${
                      selectedOrder?.createdAt === order.createdAt
                        ? "border-l-4 border-yellow-500 bg-yellow-100"
                        : ""
                    }`}
                  >

                    <div className="flex items-center justify-between">

                      <span className="font-semibold text-gray-800">
                        Order #{index + 1}
                      </span>

                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        {order.status}
                      </span>

                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>

                    <div className="mt-3 flex justify-between">

                      <span className="text-sm text-gray-600">
                        {order.items.length} Item(s)
                      </span>

                      <span className="font-bold text-yellow-700">
                        ₹{order.totalAmount}
                      </span>

                    </div>

                  </button>

                ))}

              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="lg:col-span-8">

            {selectedOrder ? (

              <div className="rounded-xl bg-white shadow">

                {/* HEADER */}

                <div className="border-b p-6">

                  <div className="flex flex-wrap items-center justify-between gap-4">

                    <div>

                      <h2 className="text-2xl font-bold text-gray-800">
                        Order Details
                      </h2>

                      <p className="mt-1 text-gray-500">
                        {new Date(
                          selectedOrder.createdAt
                        ).toLocaleString()}
                      </p>

                    </div>

                    <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                      {selectedOrder.status}
                    </span>

                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

                    <div className="rounded-lg bg-yellow-100 p-4">
                      <p className="text-sm text-gray-600">
                        Total Amount
                      </p>

                      <p className="mt-2 text-2xl font-bold">
                        ₹{selectedOrder.totalAmount}
                      </p>
                    </div>

                    <div className="rounded-lg bg-yellow-100 p-4">
                      <p className="text-sm text-gray-600">
                        Total Items
                      </p>

                      <p className="mt-2 text-2xl font-bold">
                        {selectedOrder.items.length}
                      </p>
                    </div>

                    <div className="rounded-lg bg-yellow-100 p-4">
                      <p className="text-sm text-gray-600">
                        Customer
                      </p>

                      <p className="mt-2 truncate text-sm font-semibold">
                        {selectedOrder.userId}
                      </p>
                    </div>

                  </div>

                </div>

                {/* ITEMS */}

                <div className="p-6">

                  <h3 className="mb-5 text-xl font-semibold">
                    Ordered Items
                  </h3>

                  <div className="space-y-4">

                {selectedOrder.items.map((item, index) => (
  <div
    key={index}
    className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 transition hover:shadow-lg"
  >
    <div className="flex gap-5">

      <img
        src={item.images?.[0] || "/placeholder.png"}
        alt={item.productName}
        className="h-24 w-24 rounded-lg border object-cover"
      />

      <div className="flex flex-col justify-between">

        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {item.productName}
          </h3>

          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {item.productShortDescription}
          </p>
        </div>

        <div className="mt-3 flex gap-6 text-sm text-gray-600">
          <span>
            Qty:
            <span className="ml-1 font-semibold">
              {item.quantity}
            </span>
          </span>

          <span>
            Product ID:
            <span className="ml-1 text-xs text-gray-400">
              {item.productId}
            </span>
          </span>
        </div>

      </div>
    </div>

    <div className="text-right">

      <p className="text-sm text-gray-500">
        Price
      </p>

      <p className="text-2xl font-bold text-yellow-600">
        ₹{item.price}
      </p>

      <p className="mt-2 text-sm text-gray-500">
        Total
      </p>

      <p className="font-semibold text-gray-800">
        ₹{(item.price * item.quantity).toFixed(2)}
      </p>

    </div>
  </div>
))}

                  </div>

                </div>

              </div>

            ) : (

              <div className="rounded-xl bg-white p-12 text-center shadow">
                <h2 className="text-xl font-semibold text-gray-600">
                  No Order Selected
                </h2>
              </div>

            )}

          </div>

        </div>
      </div>
    </div>
  );
}