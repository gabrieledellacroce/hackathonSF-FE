import React from "react";

function TerminalBlock() {
  return (
    <div className="max-w-2xl mx-auto mt-12 mb-16">
      <div className="bg-surface border border-white/10 rounded-lg overflow-hidden">
        <div className="px-4 py-2 border-b border-white/5 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <span className="ml-4 text-xs text-muted font-[var(--font-jbmono)]">
            zsh — modelmarkt-cli
          </span>
        </div>
        <div className="p-6 text-sm space-y-3 text-white/80 font-[var(--font-jbmono)]">
          <div className="flex gap-3">
            <span className="text-white/40">❯</span>
            <span className="text-white/90">modelmarkt deploy fruit-classifier.keras</span>
          </div>
          <div className="text-muted pl-6 text-xs">
            ✓ Model uploaded (2.3MB)
            <br />
            ✓ Inference endpoint ready
            <br />
            ✓ API key generated
          </div>
          <div className="flex gap-3 pt-2">
            <span className="text-white/40">❯</span>
            <span className="text-white/90">
              curl api.modelmarkt.dev/v1/predict -F "img=@apple.jpg"
            </span>
          </div>
          <div className="text-white/60 pl-6 text-xs">
            {"{"}"class": "fresh_apple", "confidence": 0.98{""}"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center px-8 pt-24">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 px-8 py-6">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="text-sm font-light tracking-wider">MODELMARKT</div>
          <div className="flex gap-8 text-xs text-muted font-light">
            <a href="#" className="hover:text-white transition">
              Models
            </a>
            <a href="#" className="hover:text-white transition">
              Docs
            </a>
            <button className="border-b border-white/10 pb-1 hover:border-white transition">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Text centered vertically */}
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="font-[var(--font-cormorant)] text-7xl md:text-8xl font-light leading-[1.1] mb-8 tracking-tight"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Turn your vision models
            <br />
            into <span className="italic">APIs in minutes</span>
          </h1>
          <p className="text-muted text-lg font-light max-w-xl mx-auto leading-relaxed">
            A minimal marketplace for deploying machine learning models. Upload once, deploy
            everywhere.
          </p>
        </div>
      </div>

      {/* Terminal below text */}
      <TerminalBlock />

      {/* CTA */}
      <div className="flex justify-center mb-16">
        <button className="border-b border-white/10 px-12 py-4 text-sm font-light tracking-wider hover:border-white transition">
          Get Started
        </button>
      </div>
    </main>
  );
}


