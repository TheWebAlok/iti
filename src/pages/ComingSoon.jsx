import { Link } from 'react-router-dom';

export default function ComingSoon({ title = 'This page', backTo = '/admin/dashboard' }) {
  return (
    <section className="section pt-8">
      <div className="container-x">
        <h1 className="text-2xl font-bold capitalize text-navy-900 dark:text-white">{title}</h1>
        <p className="mt-2 text-slate-600 dark:text-white/70">This page is not built yet.</p>
        <Link to={backTo} className="mt-4 inline-block text-sm font-semibold text-royal-600 hover:underline">
          Back to dashboard
        </Link>
      </div>
    </section>
  );
}