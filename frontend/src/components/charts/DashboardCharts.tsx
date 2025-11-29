"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  AreaChart,
  Area,
} from "recharts";

function genSeries(days: number, min = 100, max = 1200) {
  const out: { day: string; value: number }[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const label = `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}`;
    const value = Math.floor(Math.random() * (max - min) + min);
    out.push({ day: label, value });
  }
  return out;
}

const apiUsage = genSeries(14, 200, 2000);
const playgroundRuns = genSeries(7, 20, 200);
const latencyP95 = genSeries(14, 30, 180);
const accuracy = Math.round(85 + Math.random() * 10); // 85-95%

export function ApiUsageChartCard() {
  return (
    <div className="rounded-xl border border-white/10 p-4">
      <div className="text-sm text-muted mb-2">API Requests (14 giorni)</div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={apiUsage}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#ffffff"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function PlaygroundRunsChartCard() {
  return (
    <div className="rounded-xl border border-white/10 p-4">
      <div className="text-sm text-muted mb-2">Playground Runs (7 giorni)</div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={playgroundRuns}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip />
            <Bar dataKey="value" fill="#ffffff" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function AccuracyChartCard() {
  const radialData = [{ name: "Accuracy", value: accuracy, fill: "#ffffff" }];
  return (
    <div className="rounded-xl border border-white/10 p-4 flex items-center">
      <div className="flex-1">
        <div className="text-sm text-muted mb-2">Accuracy stimata</div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="70%"
              outerRadius="100%"
              data={radialData}
              startAngle={90}
              endAngle={90 + (accuracy / 100) * 360}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar background dataKey="value" cornerRadius={10} />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="w-28 text-center">
        <div className="text-4xl font-light">{accuracy}%</div>
        <div className="text-xs text-muted mt-1">su ultimi test</div>
      </div>
    </div>
  );
}

export function LatencyChartCard() {
  return (
    <div className="rounded-xl border border-white/10 p-4">
      <div className="text-sm text-muted mb-2">Latency P95 (ms)</div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={latencyP95}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#ffffff" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#ffffff" fill="url(#grad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function KpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 p-4">
      <div className="text-sm text-muted">{label}</div>
      <div className="text-3xl font-light mt-2">{value}</div>
      {hint && <div className="text-xs text-muted mt-1">{hint}</div>}
    </div>
  );
}


