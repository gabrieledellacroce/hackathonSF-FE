import React from "react";
import {
  ApiUsageChartCard,
  PlaygroundRunsChartCard,
  AccuracyChartCard,
  LatencyChartCard,
  KpiCard,
} from "@/components/charts/DashboardCharts";

export default function AppHomePage() {
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
          <KpiCard label="API requests (24h)" value={`${Math.floor(Math.random()*5000+2000)}`} hint="+12% vs yesterday" />
          <KpiCard label="Playground runs (7d)" value={`${Math.floor(Math.random()*800+200)}`} hint="+4% vs last week" />
          <KpiCard label="Estimated accuracy" value={`${Math.floor(Math.random()*10+85)}%`} hint="on recent tests" />
          <KpiCard label="Latency P95" value={`${Math.floor(Math.random()*120+40)} ms`} hint="-8% vs 7d" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ApiUsageChartCard />
        </div>
        <AccuracyChartCard />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PlaygroundRunsChartCard />
        <LatencyChartCard />
      </div>
    </section>
  );
}


