"use client";

import type { Metadata } from "next";
import "./globals.css";
import { Inter, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import React from "react";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300","400","600"], display: "swap", variable: "--font-cormorant" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400","500"], display: "swap", variable: "--font-jbmono" });

export const metadata: Metadata = {
  title: "ModelMarkt",
  description: "Turn your vision models into APIs in minutes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorant.variable} ${jetbrains.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

