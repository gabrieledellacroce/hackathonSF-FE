import React from "react";
import { redirect } from "next/navigation";
import { stackServerApp } from "@/../stack/server";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side protection: redirect to sign-in if not authenticated
  const user = await stackServerApp.getUser({ or: "return-null" });
  if (!user) {
    redirect("/auth/sign-in");
  }
  return <>{children}</>;
}


