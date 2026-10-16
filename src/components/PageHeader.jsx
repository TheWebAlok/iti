import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function PageHeader({ title, text, crumbs = [] }) {
  return (
    <header className="blueprint relative overflow-hidden bg-navy-900 pb-14 pt-28 text-white sm:pb-20 sm:pt-36">
      <div className="container-x relative">
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1 text-sm text-slate-300">
          <Link to="/" className="hover:text-white">Home</Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1">
              <ChevronRight size={14} aria-hidden="true" />
              {c.to ? <Link to={c.to} className="hover:text-white">{c.label}</Link> : <span aria-current="page">{c.label}</span>}
            </span>
          ))}
        </nav>
        <h1 className="max-w-3xl text-4xl font-extrabold !text-white sm:text-5xl">{title}</h1>
        {text && <p className="mt-4 max-w-2xl text-lg text-slate-300">{text}</p>}
      </div>
    </header>
  );
}
