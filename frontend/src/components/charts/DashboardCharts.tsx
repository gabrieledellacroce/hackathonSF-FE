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
import ReactDOMServer from "react-dom/server";

function useMounted(): boolean {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return mounted;
}

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

// Data is generated on the client after mount to avoid hydration mismatches
function useChartData() {
  const mounted = useMounted();
  const apiUsage = React.useMemo(
    () => (mounted ? genSeries(14, 200, 2000) : []),
    [mounted]
  );
  const playgroundRuns = React.useMemo(
    () => (mounted ? genSeries(7, 20, 200) : []),
    [mounted]
  );
  const latencyP95 = React.useMemo(
    () => (mounted ? genSeries(14, 30, 180) : []),
    [mounted]
  );
  const accuracy = React.useMemo(
    () => (mounted ? Math.round(85 + Math.random() * 10) : null),
    [mounted]
  ); // 85-95%
  return { mounted, apiUsage, playgroundRuns, latencyP95, accuracy };
}

// Utils: CSV & SVG download
function toCSV(rows: Array<Record<string, unknown>>): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => JSON.stringify((r as any)[h] ?? "")).join(",")),
  ];
  return lines.join("\n");
}

function downloadText(filename: string, text: string, mime: string) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadSVG(svgEl: SVGSVGElement | null, filename: string) {
  if (!svgEl) return;
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svgEl);
  downloadText(filename, source, "image/svg+xml;charset=utf-8");
}

function ChartHeader({
  title,
  dataForCsv,
  svgRef,
  filename,
}: {
  title: string;
  dataForCsv?: Array<Record<string, unknown>>;
  svgRef?: React.RefObject<HTMLDivElement>;
  filename: string;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="text-sm text-muted">{title}</div>
      <div className="flex gap-2">
        {dataForCsv && (
          <button
            className="text-xs px-2 py-1 border border-white/10 rounded hover:bg-white/5"
            onClick={() => downloadText(`${filename}.csv`, toCSV(dataForCsv), "text/csv")}
          >
            Export CSV
          </button>
        )}
        {svgRef && (
          <button
            className="text-xs px-2 py-1 border border-white/10 rounded hover:bg-white/5"
            onClick={() =>
              downloadSVG(svgRef.current?.querySelector("svg") as SVGSVGElement, `${filename}.svg`)
            }
          >
            Download SVG
          </button>
        )}
      </div>
    </div>
  );
}

export function ApiUsageChartCard() {
  const { mounted, apiUsage } = useChartData();
  const ref = React.useRef<HTMLDivElement>(null);
  if (!mounted) {
    return (
      <div className="rounded-xl border border-white/10 p-4">
        <ChartHeader title="API Requests (14 days)" filename="api-requests-14d" />
        <div className="h-48 grid place-items-center text-xs text-muted">Loading…</div>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-white/10 p-4">
      <ChartHeader
        title="API Requests (14 days)"
        dataForCsv={apiUsage}
        svgRef={ref}
        filename="api-requests-14d"
      />
      <div className="h-48" ref={ref}>
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
  const { mounted, playgroundRuns } = useChartData();
  const ref = React.useRef<HTMLDivElement>(null);
  if (!mounted) {
    return (
      <div className="rounded-xl border border-white/10 p-4">
        <ChartHeader title="Playground Runs (7 days)" filename="playground-runs-7d" />
        <div className="h-48 grid place-items-center text-xs text-muted">Loading…</div>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-white/10 p-4">
      <ChartHeader
        title="Playground Runs (7 days)"
        dataForCsv={playgroundRuns}
        svgRef={ref}
        filename="playground-runs-7d"
      />
      <div className="h-48" ref={ref}>
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
  const { mounted, accuracy } = useChartData();
  const radialData = [{ name: "Accuracy", value: accuracy, fill: "#ffffff" }];
  if (!mounted || accuracy == null) {
    return (
      <div className="rounded-xl border border-white/10 p-4 flex items-center">
        <div className="flex-1">
          <div className="text-sm text-muted mb-2">Estimated accuracy</div>
          <div className="h-48 grid place-items-center text-xs text-muted">Loading…</div>
        </div>
        <div className="w-28 text-center">
          <div className="text-4xl font-light">—</div>
          <div className="text-xs text-muted mt-1">on recent tests</div>
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-white/10 p-4 flex items-center">
      <div className="flex-1">
        <div className="text-sm text-muted mb-2">Estimated accuracy</div>
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
        <div className="text-xs text-muted mt-1">on recent tests</div>
      </div>
    </div>
  );
}

export function LatencyChartCard() {
  const { mounted, latencyP95 } = useChartData();
  const ref = React.useRef<HTMLDivElement>(null);
  if (!mounted) {
    return (
      <div className="rounded-xl border border-white/10 p-4">
        <ChartHeader title="Latency P95 (ms)" filename="latency-p95-14d" />
        <div className="h-48 grid place-items-center text-xs text-muted">Loading…</div>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-white/10 p-4">
      <ChartHeader
        title="Latency P95 (ms)"
        dataForCsv={latencyP95}
        svgRef={ref}
        filename="latency-p95-14d"
      />
      <div className="h-48" ref={ref}>
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
      <div className="text-3xl font-light mt-2" suppressHydrationWarning>
        {value}
      </div>
      {hint && <div className="text-xs text-muted mt-1">{hint}</div>}
    </div>
  );
}

// Advanced additions
// 1) Stacked bar per modello (top 5)
function genModelBreakdown() {
  const models = ["fruit", "dog", "car", "face", "doc"];
  const days = genSeries(7, 1, 1).map((d) => d.day);
  const data = days.map((day) => {
    const row: any = { day };
    models.forEach((m) => {
      row[m] = Math.floor(Math.random() * 800 + 50);
    });
    return row;
  });
  return { models, data };
}
const modelBreakdown = genModelBreakdown();

export function ModelBreakdownStackedBar() {
  const ref = React.useRef<HTMLDivElement>(null);
  return (
    <div className="rounded-xl border border-white/10 p-4">
      <ChartHeader
        title="API Requests by model (7 days, top 5)"
        dataForCsv={modelBreakdown.data}
        svgRef={ref}
        filename="api-requests-by-model"
      />
      <div className="h-56" ref={ref}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={modelBreakdown.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip />
            {modelBreakdown.models.map((m, idx) => (
              <Bar key={m} dataKey={m} stackId="a" fill={`hsl(${(idx * 60) % 360} 10% 90%)`} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// 2) Percentili latency mini-cards
export function LatencyPercentilesCards() {
  // simulate monotonic percentiles
  const p50 = Math.floor(Math.random() * 40 + 40);
  const p90 = p50 + Math.floor(Math.random() * 40 + 20);
  const p95 = p90 + Math.floor(Math.random() * 30 + 10);
  const p99 = p95 + Math.floor(Math.random() * 40 + 20);
  const max = p99;
  const items = [
    { label: "P50", value: p50 },
    { label: "P90", value: p90 },
    { label: "P95", value: p95 },
    { label: "P99", value: p99 },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it) => (
        <div key={it.label} className="rounded-xl border border-white/10 p-4">
          <div className="text-sm text-muted">{it.label}</div>
          <div className="text-2xl font-light mt-1">{it.value} ms</div>
          <div className="h-2 w-full bg-white/10 rounded mt-2 overflow-hidden">
            <div
              className="h-full bg-white rounded"
              style={{ width: `${(it.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// 3) Error rate & success rate (stacked bar horizontal)
export function ErrorRateCard() {
  const success = Math.round(95 + Math.random() * 4 * 10) / 10; // ~95-99.9
  const err4 = Math.round((100 - success) * 0.7 * 10) / 10;
  const err5 = Math.max(0, Math.round((100 - success - err4) * 10) / 10);
  return (
    <div className="rounded-xl border border-white/10 p-4">
      <div className="text-sm text-muted mb-2">Success / 4xx / 5xx</div>
      <div className="h-3 w-full bg-white/10 rounded overflow-hidden flex">
        <div className="bg-white/80" style={{ width: `${success}%` }} />
        <div className="bg-white/40" style={{ width: `${err4}%` }} />
        <div className="bg-white/20" style={{ width: `${err5}%` }} />
      </div>
      <div className="text-xs text-muted mt-2 flex gap-4">
        <span>Success: {success}%</span>
        <span>4xx: {err4}%</span>
        <span>5xx: {err5}%</span>
      </div>
    </div>
  );
}

// 4) Accuracy by class (small multiples)
export function AccuracyByClass() {
  const classes = ["fresh", "rotten", "green", "red", "unknown"];
  const data = classes.map((c) => ({
    name: c,
    correct: Math.floor(Math.random() * 80 + 10),
    wrong: Math.floor(Math.random() * 20 + 1),
  }));
  return (
    <div className="rounded-xl border border-white/10 p-4">
      <div className="text-sm text-muted mb-2">Accuracy by class</div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {data.map((d) => (
          <div key={d.name} className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[d]}>
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                <Tooltip />
                <Bar dataKey="correct" stackId="a" fill="#ffffff" />
                <Bar dataKey="wrong" stackId="a" fill="rgba(255,255,255,0.3)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}

// 5) Usage heatmap (ora x giorno)
export function UsageHeatmap() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const values: number[][] = days.map(() =>
    hours.map(() => Math.floor(Math.random() * 100))
  );
  const max = Math.max(...values.flat());
  return (
    <div className="rounded-xl border border-white/10 p-4">
      <div className="text-sm text-muted mb-3">Usage heatmap (hour of day vs days)</div>
      <div className="overflow-auto">
        <div className="inline-grid grid-rows-8 grid-cols-[60px_repeat(24,minmax(18px,1fr))] gap-1">
          <div />
          {hours.map((h) => (
            <div key={h} className="text-[10px] text-center text-muted">
              {h}
            </div>
          ))}
          {days.map((d, r) => (
            <React.Fragment key={d}>
              <div className="text-xs text-muted pr-2 flex items-center">{d}</div>
              {hours.map((h, c) => {
                const v = values[r][c];
                const opacity = v / max;
                return (
                  <div
                    key={`${r}-${c}`}
                    title={`${d} ${h}:00 — ${v}`}
                    className="h-5 rounded"
                    style={{ background: `rgba(255,255,255,${0.15 + opacity * 0.7})` }}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}


