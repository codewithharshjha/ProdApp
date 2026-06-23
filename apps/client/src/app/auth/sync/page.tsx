"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SyncPage() {
  const router = useRouter();
  console.log("SyncPage rendered, starting sync...");

  useEffect(() => {
    const sync = async () => {
      await fetch("/api/users/sync", {
        method: "POST",
      });

      router.replace("/");
    };

    sync();
  }, []);

  return <p>Setting up your account...</p>;
}