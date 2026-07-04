// packages/email/src/emailConsumer.ts

import { getChannel } from "./rabbitmq";
import { sendOrderEmail } from "./sendEmail";

export async function startEmailConsumer() {
  const channel = getChannel();
console.log("Starting email consumer for order-email queue");
  channel.consume("order-email", async (msg) => {
    if (!msg) return;

    try {
      const data = JSON.parse(msg.content.toString());
console.log("Received message from order-email queue:", data);
      await sendOrderEmail(data.order, data.email);

      channel.ack(msg);
    } catch (error) {
      console.error(error);

      channel.nack(msg, false, true);
    }
  });
}