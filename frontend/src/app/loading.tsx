export default function Loading() {
  return (
    <div className="min-h-[100svh] grid place-items-center">
      <div className="flex items-center gap-3 text-sm text-muted">
        <span className="w-2.5 h-2.5 rounded-full bg-white/40 animate-pulse" />
        <span>Loading…</span>
      </div>
    </div>
  );
}


