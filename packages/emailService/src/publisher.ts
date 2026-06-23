// packages/email/src/publisher.ts

import { getChannel } from "./rabbitmq";

export async function publishOrderEmail(data: any) {
  const channel = getChannel();

  channel.sendToQueue(
    "order-email",
    Buffer.from(JSON.stringify(data)),
    {
      persistent: true,
    }
  );
}