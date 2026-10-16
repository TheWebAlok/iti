import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Download, Search, BellOff } from 'lucide-react';
import Seo from '../../components/Seo';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';
import AnimatedList from '../../components/AnimatedList';
import useSiteTheme from '../../hooks/useSiteTheme';

// Vite use kar rahe ho to .env me VITE_API_URL=http://localhost:5000 rakho.
// Agar proxy laga hai to khali chhod do, relative URL chalega.
const API_BASE = import.meta.env.VITE_API_URL || '';

export default function Notices() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useSiteTheme();

  // DB se notices laao
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/notices`, { signal: controller.signal });
        if (!res.ok) throw new Error('Could not load notices.');
        setNotices(await res.json());
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message || 'Could not load notices.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notices
      .filter((n) => category === 'All' || (category === 'Important' ? n.important : !n.important))
      .filter((n) => !q || `${n.title} ${n.details || ''}`.toLowerCase().includes(q))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [notices, query, category]);

  const renderNotice = (n) => (
    <>
      <time dateTime={n.createdAt} className="w-16 shrink-0 self-start rounded-xl bg-navy-900 py-2 text-center text-white">
        <span className="block text-2xl font-extrabold leading-none">{format(new Date(n.createdAt), 'dd')}</span>
        <span className="block text-xs">{format(new Date(n.createdAt), 'MMM yyyy')}</span>
      </time>
      <div className="min-w-0 flex-1 py-1">
        <span
          className={`chip ${
            n.important
              ? 'border-amber-500/50 text-amber-600 dark:text-amber-400'
              : 'border-royal-500/40 text-royal-600 dark:text-royal-400'
          }`}
        >
          {n.important ? 'Important' : 'General'}
        </span>
        <h2 className="mt-2 text-base font-bold leading-snug sm:text-lg">{n.title}</h2>
        {n.details && (
          <p className="mt-1 text-sm" style={{ color: 'var(--al-muted)' }}>{n.details}</p>
        )}
      </div>
      {n.attachment && (
        <a
          href={`${API_BASE}/api/notices/${n._id}/file`}
          target="_blank"
          rel="noopener noreferrer"
          download={n.attachment.originalName}
          onClick={(e) => e.stopPropagation()}
          className="btn-outline shrink-0 self-start !py-2"
        >
          <Download size={16} aria-hidden="true" />
          {n.attachment.mimeType === 'application/pdf' ? 'PDF' : 'Image'}
        </a>
      )}
    </>
  );

  return (
    <>
      <Seo title="Notices and Events" description="Admission deadlines, examination notices, events and holiday announcements." />
      <PageHeader title="Notices and events" text="Admission deadlines, examination schedules, events and holidays." crumbs={[{ label: 'Notices' }]} />
      <section className="section pt-10">
        <div className="container-x max-w-4xl">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input type="search" className="input !pl-10" placeholder="Search notices" aria-label="Search notices" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <select className="input sm:w-48" aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>All</option>
              <option>Important</option>
              <option>General</option>
            </select>
          </div>

          <div className="mt-6">
            {loading ? (
              <p className="py-10 text-center text-sm" style={{ color: 'var(--al-muted)' }}>Loading notices…</p>
            ) : error ? (
              <EmptyState icon={BellOff} title="Something went wrong" text={error} />
            ) : results.length === 0 ? (
              <EmptyState
                icon={BellOff}
                title="No notices found"
                text={notices.length === 0 ? 'No notices have been published yet.' : 'Try another keyword or category.'}
              />
            ) : (
              <AnimatedList
                items={results}
                renderItem={renderNotice}
                itemClassName="!select-text !items-start"
                theme={theme}
                accentColor="#F59E0B"
                animation="slide"
                width="100%"
                maxHeight={640}
                radius={16}
                gap={10}
                stagger={0.06}
                fadeSize={48}
                frame
                showGradients
                displayScrollbar
                selectOnHover
                enableArrowNavigation
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}