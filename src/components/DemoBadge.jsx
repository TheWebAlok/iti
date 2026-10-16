export default function DemoBadge({ children = 'Demo content' }) {
  return (
    <span className="chip border-amber-400/60 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
      {children}
    </span>
  );
}
