// packages/email/src/emailConsumer.ts

import { getChannel } from "./rabbitmq";
import { sendOrderEmail } from "./sendEmail";

type CreateOrder = (
  userId: string,
  input: { items: unknown[] }
) => Promise<unknown>;

function isValidPaymentSuccessPayload(data: unknown): data is { userId: string; items: unknown[] } {
  return Boolean(
    data &&
      typeof data === "object" &&
      "userId" in data &&
      typeof (data as { userId?: unknown }).userId === "string" &&
      "items" in data &&
      Array.isArray((data as { items?: unknown }).items)
  );
}

export async function startEmailConsumer() {
  const channel = getChannel();
  console.log("[Consumer] Starting email consumer for order-email queue");
  channel.consume("order-email", async (msg) => {
    if (!msg) return;

    try {
      const data = JSON.parse(msg.content.toString());
      console.log("[Consumer] Received message from order-email queue:", data);
      await sendOrderEmail(data.order, data.email);

      channel.ack(msg);
    } catch (error) {
      console.error("[Consumer] Failed to process order-email message:", error);
      channel.nack(msg, false, false);
    }
  });
}

export async function CreatingOrderAfterpaymentSuccessConsumer(createOrder: CreateOrder) {
  const channel = getChannel();

  await channel.assertQueue("payment.success", {
    durable: true,
  });

  console.log("[Consumer] Starting consumer for payment.success queue");

  channel.consume("payment.success", async (msg) => {
    if (!msg) return;

    console.log("[Consumer] callback entered for payment.success message", msg.content.toString());

    try {
      const data = JSON.parse(msg.content.toString());

      console.log("[Consumer] Received payment success:", data);

      if (!isValidPaymentSuccessPayload(data)) {
        console.warn("[Consumer] Skipping malformed payment.success message:", data);
        channel.ack(msg);
        return;
      }
console.log("[Consumer] Valid payment success payload:", data);
      await createOrder(data.userId, {
        items: data.items as any[],
      });
console.log("[Consumer] Order created successfully for user:", data.userId);
      channel.ack(msg);
    } catch (error) {
      console.error("[Consumer] Failed to process payment.success message:", error);
      channel.nack(msg, false, false);
    }
  });
}