// import { auth } from "@clerk/nextjs/server";
// import { getUploadAuthParams } from "@imagekit/next/server";

// export async function GET() {
//   const { userId } = await auth();
//   if (!userId) {
//     return Response.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
//   const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
//   if (!publicKey || !privateKey) {
//     return Response.json(
//       { error: "ImageKit credentials are not configured on the admin server." },
//       { status: 500 }
//     );
//   }

//   const authParams = getUploadAuthParams({
//     privateKey,
//     publicKey,
//     expire: Math.floor(Date.now() / 1000) + 30 * 60,
//   });
//   return Response.json(
//     { ...authParams, publicKey },
//     { headers: { "Cache-Control": "no-store" } }
//   );
// }


// app/api/imagekit-auth/route.ts

import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
  try {
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

    if (!publicKey || !privateKey) {
      return Response.json(
        { error: "ImageKit environment variables are missing" },
        { status: 500 }
      );
    }

  const { token, expire, signature } = getUploadAuthParams({
  privateKey: privateKey!,
  publicKey: publicKey!,
});

   return Response.json({
  token,
  expire,
  signature,
  publicKey: publicKey,
});
  } catch (error) {
    console.error("ImageKit auth error:", error);

    return Response.json(
      { error: "Failed to generate ImageKit authentication parameters" },
      { status: 500 }
    );
  }
}