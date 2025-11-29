import React from "react";
import { getModels } from "@/lib/api";

export default async function ModelsPage() {
  const { models } = await getModels();
  return (
    <section>
      <h1
        className="text-3xl font-light mb-6"
        style={{ fontFamily: "var(--font-cormorant)" }}
      >
        Models
      </h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {models.map((m) => (
          <div
            key={m.id}
            className="rounded-lg border border-white/10 p-4 hover:border-white/20 transition"
          >
            <div className="text-sm text-muted">{m.id}</div>
            <div className="text-lg font-medium mt-1">{m.name}</div>
            <p className="text-sm text-muted mt-2">{m.description}</p>
            <div className="text-xs text-muted mt-4">
              Created on {m.createdAt}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


