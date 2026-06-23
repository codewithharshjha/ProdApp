// packages/email/src/rabbitmq.ts

import amqp from "amqplib";

let channel: amqp.Channel;

export async function connectRabbitMQ() {
  const connection = await amqp.connect(
    "amqp://guest:guest@localhost:5672"
  );

  channel = await connection.createChannel();

  await channel.assertQueue("order-email");

  return channel;
}

export function getChannel() {
  return channel;
}