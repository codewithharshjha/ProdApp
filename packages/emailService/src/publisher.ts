// packages/email/src/publisher.ts

import { getChannel } from "./rabbitmq";

export async function publishOrderEmail(data: any, email: string) {
  const channel = getChannel();
console.log("Publishing message to order-email queue:", { ...data, email });
  channel.sendToQueue(
    "order-email",
    Buffer.from(JSON.stringify({ ...data, email })),
    {
      persistent: true,
    }
  );
  console.log("Message published to order-email queue");
}

export async function publishPaymentSuccess(data: any) {
  const channel = getChannel();
  console.log("[Publisher] Publishing payment success event to payment.success queue:", data);
  console.log("[Publisher] channel available:", Boolean(channel));
  await channel.assertQueue("payment.success", {
    durable: true,
  });
  console.log("[Publisher] queue ensured: payment.success");

  const payload = Buffer.from(JSON.stringify(data));
  const sent = channel.sendToQueue(
    "payment.success",
    payload,
    {
      persistent: true,
    }
  );
  console.log("[Publisher] sendToQueue returned:", sent);
  console.log("[Publisher] payload bytes:", payload.length);
  console.log("[Publisher] Payment success event published");
}