import { useId, cloneElement } from 'react';

/** Accessible label + control + error wrapper. Pass a single input/select/textarea child. */
export default function FormField({ label, error, hint, required, children, className = '' }) {
  const id = useId();
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-navy-900 dark:text-slate-200">
        {label}{required && <span className="text-red-500" aria-hidden="true"> *</span>}
      </label>
      {cloneElement(children, {
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
        className: `${children.props.className || 'input'} ${error ? 'input-error' : ''}`,
      })}
      {hint && !error && <p id={`${id}-hint`} className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && <p id={`${id}-err`} role="alert" className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
