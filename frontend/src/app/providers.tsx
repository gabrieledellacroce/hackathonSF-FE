"use client";

import * as React from "react";
import { TooltipProvider } from "@radix-ui/react-tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={0}>
      {children}
    </TooltipProvider>
  );
}


