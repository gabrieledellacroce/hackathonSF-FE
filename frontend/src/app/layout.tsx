import type { Metadata } from "next";
import "./globals.css";
import { Inter, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import React from "react";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../../stack/server";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300","400","600"], display: "swap", variable: "--font-cormorant" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400","500"], display: "swap", variable: "--font-jbmono" });

export const metadata: Metadata = {
  title: "ModelMarkt",
  description: "Turn your vision models into APIs in minutes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${cormorant.variable} ${jetbrains.variable} antialiased`}>
        <Providers>
          <StackProvider
            app={stackServerApp}
            lang="en"
          >
            <StackTheme
              theme={{
                radius: "10px",
                dark: {
                  primary: "#ffffff",
                },
              }}
            >
              {children}
            </StackTheme>
          </StackProvider>
        </Providers>
      </body>
    </html>
  );
}

