import { CheckCircle2 } from 'lucide-react';

export default function FormSuccess({ title, text, onReset, resetLabel = 'Send another' }) {
  return (
    <div className="card flex flex-col items-center px-6 py-12 text-center" role="status">
      <CheckCircle2 className="text-emerald-500" size={44} aria-hidden="true" />
      <h3 className="mt-4 text-xl font-bold">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">{text}</p>
      <button type="button" className="btn-outline mt-6" onClick={onReset}>{resetLabel}</button>
    </div>
  );
}
