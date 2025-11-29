import Link from "next/link";
import React from "react";
import { stackServerApp } from "@/../stack/server";

function getInitials(input: string) {
  const parts = input.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  const clean = input.replace(/[^a-zA-Z]/g, "");
  return clean.slice(0, 2).toUpperCase();
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await stackServerApp.getUser({ or: "redirect" });
  const displayName =
    user?.displayName || user?.primaryEmail?.email || "User";
  const avatarUrl =
    // @ts-ignore - optional property names based on SDK
    user?.profileImageUrl || user?.imageUrl || null;

  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside className="border-r border-white/10 bg-surface/50 p-6">
        <div className="text-xs tracking-widest text-muted mb-6">MODELMARKT</div>
        <nav className="space-y-2">
          <Link
            href="/app"
            className="block px-3 py-2 rounded-md hover:bg-white/5 transition"
          >
            Home
          </Link>
          <Link
            href="/app/models"
            className="block px-3 py-2 rounded-md hover:bg-white/5 transition"
          >
            Models
          </Link>
          <Link
            href="/app/settings"
            className="block px-3 py-2 rounded-md hover:bg-white/5 transition"
          >
            Settings
          </Link>
        </nav>
      </aside>

      {/* Content */}
      <div className="min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="h-14 flex items-center justify-end px-6 border-b border-white/10 bg-transparent">
          <Link
            href="/profile"
            className="flex items-center gap-3 group"
            aria-label="Apri profilo"
          >
            <span className="text-sm text-muted group-hover:text-white transition">
              {displayName}
            </span>
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-9 h-9 rounded-full border border-white/10 object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full border border-white/10 grid place-items-center bg-white/5 text-sm font-medium">
                {getInitials(displayName)}
              </div>
            )}
          </Link>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}


