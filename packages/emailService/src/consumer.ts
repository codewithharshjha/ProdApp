// packages/email/src/emailConsumer.ts

import { getChannel } from "./rabbitmq";
import { sendOrderEmail } from "./sendEmail";

export async function startEmailConsumer() {
  const channel = getChannel();

  channel.consume("order-email", async (msg) => {
    if (!msg) return;

    try {
      const data = JSON.parse(msg.content.toString());

      await sendOrderEmail(data);

      channel.ack(msg);
    } catch (error) {
      console.error(error);

      channel.nack(msg, false, true);
    }
  });
}