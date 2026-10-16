import { useId } from 'react';
import { Upload, FileCheck2, X } from 'lucide-react';

export default function FileUploader({ label, accept, file, onChange, error, required, hint }) {
  const id = useId();
  return (
    <div>
      <span className="mb-1.5 block text-sm font-semibold text-navy-900 dark:text-slate-200">
        {label}{required && <span className="text-red-500" aria-hidden="true"> *</span>}
      </span>
      <div className={`flex items-center gap-3 rounded-xl border border-dashed px-4 py-3 ${error ? 'border-red-500' : 'border-slate-300 dark:border-white/20'}`}>
        {file ? <FileCheck2 className="shrink-0 text-emerald-600" size={20} aria-hidden="true" /> : <Upload className="shrink-0 text-slate-400" size={20} aria-hidden="true" />}
        <label htmlFor={id} className="min-w-0 flex-1 cursor-pointer truncate text-sm text-slate-600 dark:text-slate-300">
          {file ? file.name : 'Choose file'}
          <input id={id} type="file" accept={accept} className="sr-only" aria-invalid={error ? true : undefined}
            onChange={(e) => onChange(e.target.files?.[0] || null)} />
        </label>
        {file && (
          <button type="button" onClick={() => onChange(null)} aria-label={`Remove ${label}`} className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10">
            <X size={16} />
          </button>
        )}
      </div>
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && <p role="alert" className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
