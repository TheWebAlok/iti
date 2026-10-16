export default function StatCard({ icon: Icon, label, value, note }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/15 dark:bg-navy-900">
      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-white/70">
        <Icon size={16} aria-hidden="true" />
        {label}
      </div>
      <p className="mt-2 text-3xl font-bold text-navy-900 dark:text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{note}</p>
    </div>
  );
}