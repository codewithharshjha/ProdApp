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