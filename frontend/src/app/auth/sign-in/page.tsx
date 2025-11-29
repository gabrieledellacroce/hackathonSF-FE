import React from "react";
import { SignIn } from "@stackframe/stack";

export const metadata = {
  title: "Sign In • ModelMarkt",
};

export default function CustomSignInPage() {
  return (
    <main className="min-h-[100svh] grid place-items-center px-6">
      <div className="w-full max-w-md mx-auto">
        {/* Back */}
        <a
          href="/"
          className="inline-flex items-center text-sm text-muted hover:text-white mb-6"
          aria-label="Back to home"
        >
          <span className="text-lg">←</span>
          <span className="sr-only">Back to home</span>
        </a>
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="text-xs tracking-widest text-muted">MODELMARKT</div>
          <p className="text-xs text-muted mt-2">
            Continue to upload models and generate API keys
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-white/10 bg-surface/70 backdrop-blur p-6 shadow-2xl">
          <SignIn fullPage={false} automaticRedirect={true} />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted mt-6">
          By continuing you agree to our{" "}
          <a className="underline hover:text-white" href="/terms">
            Terms
          </a>{" "}
          and{" "}
          <a className="underline hover:text-white" href="/privacy">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </main>
  );
}


