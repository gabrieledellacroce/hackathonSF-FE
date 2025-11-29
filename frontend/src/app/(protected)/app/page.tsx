"use client";
import React, { useEffect, useState } from "react";
import {
  ApiUsageChartCard,
  PlaygroundRunsChartCard,
  AccuracyChartCard,
  LatencyChartCard,
  KpiCard,
  ModelBreakdownStackedBar,
  LatencyPercentilesCards,
  ErrorRateCard,
  AccuracyByClass,
  UsageHeatmap,
} from "@/components/charts/DashboardCharts";

export default function AppHomePage() {
  const [kpis, setKpis] = useState<{
    api24h: number;
    runs7d: number;
    acc: number;
    p95: number;
  } | null>(null);

  // Generate KPIs only on client to avoid SSR/CSR mismatch
  useEffect(() => {
    setKpis({
      api24h: Math.floor(Math.random() * 5000 + 2000),
      runs7d: Math.floor(Math.random() * 800 + 200),
      acc: Math.floor(Math.random() * 10 + 85),
      p95: Math.floor(Math.random() * 120 + 40),
    });
  }, []);
  return (
    <section className="space-y-8">
      <div>
        <h1
          className="text-3xl font-light mb-4"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Overview
        </h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="API requests (24h)" value={kpis ? `${kpis.api24h}` : "—"} hint="+12% vs ieri" />
          <KpiCard label="Playground runs (7d)" value={kpis ? `${kpis.runs7d}` : "—"} hint="+4% vs settimana scorsa" />
          <KpiCard label="Accuracy stimata" value={kpis ? `${kpis.acc}%` : "—"} hint="sui test recenti" />
          <KpiCard label="Latency P95" value={kpis ? `${kpis.p95} ms` : "—"} hint="-8% vs 7d" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 min-w-0">
          <ApiUsageChartCard />
        </div>
        <AccuracyChartCard />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="min-w-0">
          <PlaygroundRunsChartCard />
        </div>
        <div className="min-w-0">
          <LatencyChartCard />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 min-w-0">
          <ModelBreakdownStackedBar />
        </div>
        <ErrorRateCard />
      </div>

      <LatencyPercentilesCards />
      <AccuracyByClass />
      <div className="min-w-0">
        <UsageHeatmap />
      </div>
    </section>
  );
}


