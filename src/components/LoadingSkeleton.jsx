export default function LoadingSkeleton() {
  return (
    <div className="container-x py-40" role="status" aria-label="Loading page">
      <div className="h-9 w-2/3 animate-pulse rounded-lg bg-slate-200 dark:bg-white/10" />
      <div className="mt-6 h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-white/10" />
      <div className="mt-3 h-4 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-white/10" />
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => <div key={i} className="h-40 animate-pulse rounded-2xl bg-slate-200 dark:bg-white/10" />)}
      </div>
    </div>
  );
}
