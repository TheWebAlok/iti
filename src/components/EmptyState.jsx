export default function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      {Icon && <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-500 dark:bg-white/10"><Icon size={28} aria-hidden="true" /></div>}
      <h3 className="text-lg font-bold">{title}</h3>
      {text && <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
