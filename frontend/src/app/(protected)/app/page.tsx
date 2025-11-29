import React from "react";

export default function AppHomePage() {
  return (
    <section>
      <h1
        className="text-3xl font-light mb-4"
        style={{ fontFamily: "var(--font-cormorant)" }}
      >
        Home
      </h1>
      <p className="text-muted">
        Benvenuto nell’area riservata. Seleziona una voce dal menu a sinistra.
      </p>
    </section>
  );
}


