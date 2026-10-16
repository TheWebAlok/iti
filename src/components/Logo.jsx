import { Link } from 'react-router-dom';
import { institute } from '../config/institute';

export function LogoMark({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#0B1F3A" />
      <circle cx="32" cy="32" r="17" fill="none" stroke="#F59E0B" strokeWidth="7" strokeDasharray="5.5 4.2" />
      <circle cx="32" cy="32" r="8" fill="#fff" />
    </svg>
  );
}

export default function Logo({ light = false }) {
  return (
    <Link to="/" className="flex items-center gap-3" aria-label={`${institute.name} home`}>
      <LogoMark />
      <span className="leading-tight">
        <span className={`block text-base font-extrabold ${light ? 'text-white' : ''}`}>{institute.name}</span>
        <span className={`block text-xs font-medium ${light ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>{institute.tagline}</span>
      </span>
    </Link>
  );
}
