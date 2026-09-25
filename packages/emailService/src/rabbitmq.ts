// packages/email/src/rabbitmq.ts

import amqp from "amqplib";

let channel: amqp.Channel;

export async function connectRabbitMQ() {
  const rabbitMqUrl =
    process.env.RABBITMQ_URL ?? "amqp://guest:guest@localhost:5672";

  console.log(`[RabbitMQ] connecting to ${rabbitMqUrl}`);
  const connection = await amqp.connect(rabbitMqUrl);

  channel = await connection.createChannel();
  console.log("[RabbitMQ] channel created");

  await channel.assertQueue("order-email");
  console.log("[RabbitMQ] queue asserted: order-email");

  await channel.assertQueue("payment.success", {
    durable: true,
  });
  console.log("[RabbitMQ] queue asserted: payment.success");

  connection.on("close", () => {
    console.log("[RabbitMQ] connection closed");
  });

  connection.on("error", (err) => {
    console.error("[RabbitMQ] connection error", err);
  });

  return channel;
}

export function getChannel() {
  console.log("[RabbitMQ] getChannel called, channel ready:", Boolean(channel));
  return channel;
}