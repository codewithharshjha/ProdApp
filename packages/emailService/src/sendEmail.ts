// packages/email/src/sendEmail.ts

import { Resend } from "resend";

const resend = new Resend("re_cpre7U8f_3HSj9N2Ui98tC1bQjKdJVDoo");

export async function sendOrderEmail(order:any,useremail) {
  console.log("Sending order email for order:", order , "to user email:", useremail); ;
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: useremail ,
    subject: "Order Confirmation",
    html: `
      <h1>Thanks for your order!</h1>
      <p>Order ID: ${order?.orderId}</p>
    `,
  }).then((response) => {
    console.log("Email sent successfully:", response);
  }).catch((error) => {
    console.error("Error sending email:", error);
  });
}