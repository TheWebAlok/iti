import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, CalendarClock, ChevronLeft, ChevronRight, Handshake, LockKeyhole, Briefcase } from 'lucide-react';
import Seo from '../../components/Seo';
import PageHeader from '../../components/PageHeader';
import SectionHeading from '../../components/SectionHeading';
import DemoBadge from '../../components/DemoBadge';
import EmployerForm from '../../components/forms/EmployerForm';
import AnimatedCounter from '../../components/AnimatedCounter';
import MagicBento from '../../components/MagicBento'; // path jahan shadcn ne file rakhi ho
import { institute, isDemo } from '../../config/institute';
// GET /api/placements public hai, isliye bina login ke chalta hai.
import { getPlacements, placementPhotoUrl } from '../../services/admin';

/** Site ki dark/light class (<html class="dark">) ke hisaab se bento ka theme chalata hai. */
function useSiteTheme() {
  const read = () => (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  const [theme, setTheme] = useState(read);
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(read()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

function StudentPhoto({ row }) {
  const [broken, setBroken] = useState(false);
  if (row.photo && !broken) {
    return (
      <img
        src={placementPhotoUrl(row._id)}
        alt={`${row.student}, placed at ${row.company}`}
        loading="lazy"
        onError={() => setBroken(true)}
        className="h-full w-full object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="flex h-full w-full items-center justify-center bg-slate-100 text-5xl font-bold text-slate-400 dark:bg-white/5 dark:text-white/30"
    >
      {row.student.charAt(0).toUpperCase()}
    </span>
  );
}

function StudentCard({ row }) {
  return (
    <li className="w-60 shrink-0 snap-start overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5 sm:w-64">
      <div className="h-44 w-full overflow-hidden">
        <StudentPhoto row={row} />
      </div>
      <div className="p-4">
        <h3 className="truncate text-base font-semibold text-navy-900 dark:text-white">{row.student}</h3>
        <p className="mt-0.5 text-sm text-slate-600 dark:text-white/70">{row.trade}</p>
        <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-navy-900 dark:text-white">
          <Building2 size={15} className="shrink-0 text-amber-500" aria-hidden="true" />
          <span className="truncate">{row.company}</span>
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-white/10 dark:text-white/60">
          <span>{row.salary != null ? `${row.salary} LPA` : 'Package not shared'}</span>
          <span>Batch {row.year}</span>
        </div>
      </div>
    </li>
  );
}

function SkeletonCard() {
  return (
    <li className="w-60 shrink-0 animate-pulse overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 sm:w-64">
      <div className="h-44 bg-slate-100 dark:bg-white/5" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-2/3 rounded bg-slate-100 dark:bg-white/10" />
        <div className="h-3 w-1/2 rounded bg-slate-100 dark:bg-white/10" />
        <div className="h-3 w-3/4 rounded bg-slate-100 dark:bg-white/10" />
      </div>
    </li>
  );
}

/** Placed students: DB se aate hain, left to right scroll hota hai. */
function PlacedStudents() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const scroller = useRef(null);

  useEffect(() => {
    let alive = true;
    getPlacements()
      .then((data) => alive && setRows(Array.isArray(data) ? data : []))
      .catch(() => alive && setFailed(true))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const updateArrows = () => {
    const el = scroller.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrows();
    window.addEventListener('resize', updateArrows);
    return () => window.removeEventListener('resize', updateArrows);
  }, [rows, loading]);

  const scrollBy = (dir) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.8, 260), behavior: 'smooth' });
  };

  const arrow =
    'flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-navy-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35 dark:border-white/20 dark:text-white dark:hover:bg-white/10';

  return (
    <section className="section" aria-labelledby="placed">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div id="placed">
            <SectionHeading
              title="Our placed students"
              text={
                rows.length > 0
                  ? `${rows.length} trainees placed so far. Scroll to see more.`
                  : 'Trainees placed through the institute.'
              }
            />
          </div>
          {rows.length > 0 && (
            <div className="flex gap-2">
              <button type="button" className={arrow} onClick={() => scrollBy(-1)} disabled={!canPrev} aria-label="Scroll left">
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <button type="button" className={arrow} onClick={() => scrollBy(1)} disabled={!canNext} aria-label="Scroll right">
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        {failed && <p className="mt-6 text-sm text-slate-500">Placed students could not be loaded. Please refresh the page.</p>}

        {!failed && !loading && rows.length === 0 && (
          <p className="mt-6 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-white/20">
            Placement records will appear here once they are added.
          </p>
        )}

        {!failed && (loading || rows.length > 0) && (
          <ul
            ref={scroller}
            onScroll={updateArrows}
            tabIndex={0}
            aria-label="Placed students, scroll horizontally"
            className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3 outline-none focus-visible:ring-2 focus-visible:ring-amber-500 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {loading
              ? Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)
              : rows.map((r) => <StudentCard key={r._id} row={r} />)}
          </ul>
        )}
      </div>
    </section>
  );
}

export default function Placement() {
  const theme = useSiteTheme();
  const stats = institute.stats.filter((s) => ['placement', 'partners'].includes(s.key));

  const items = [
    ...stats.map((s) => ({
      id: s.key,
      content: (
        <div className="flex h-full flex-col justify-between">
          <p className="text-4xl font-extrabold" style={{ color: 'var(--mb-ink)' }}>
            <AnimatedCounter value={s.value} suffix={s.suffix || '+'} />
          </p>
          <p className="text-sm" style={{ color: 'var(--mb-muted)' }}>{s.label}</p>
        </div>
      ),
    })),
    {
      id: 'drives',
      colSpan: 2,
      rowSpan: 2,
      icon: <CalendarClock size={16} aria-hidden="true" />,
      label: 'Upcoming drives',
      visual: <Briefcase size={72} strokeWidth={1.25} style={{ margin: '0 auto', color: 'var(--mb-faint)' }} />,
      title: 'No drives scheduled',
      description: 'Drives announced by the placement officer will be listed here with date, company and eligible trades.',
    },
    {
      id: 'students',
      colSpan: 2,
      content: (
        <div className="flex h-full flex-col justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--mb-muted)' }}>
              <LockKeyhole size={16} aria-hidden="true" /> For students
            </p>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--mb-ink)' }}>
              Register for placement, view eligible drives, apply and track interview results from your student dashboard.
              Eligible-student lists are visible only to authorised staff.
            </p>
          </div>
          <Link to="/login" className="btn-primary self-start">Student login</Link>
        </div>
      ),
    },
  ];

  return (
    <>
      <Seo title="Placement" description="Placement drives, apprenticeship opportunities and employer enquiries." />
      <PageHeader title="Placement and apprenticeship" text="Drives, interviews and apprenticeship guidance for trainees. Outcomes are published from actual records." crumbs={[{ label: 'Placement' }]} />

      <section className="section pt-12">
        <div className="container-x">
          <SectionHeading title="Placement overview" />
          <div className="mt-6">
            <MagicBento
              items={items}
              theme={theme}
              columns={4}
              rowHeight={190}
              gap={12}
              radius={20}
              glowColor="#F59E0B"
              enableBorderGlow
              enableSpotlight
              spotlightRadius={300}
              clickEffect
              enableStars={false}
              enableTilt={false}
              enableMagnetism={false}
              textAutoHide={false}
              intro
            />
          </div>
          {isDemo && (
            <p className="mt-3 text-xs text-slate-500">
              <DemoBadge>Demo figures</DemoBadge> Real figures will be calculated from placement records in Phase 5.
            </p>
          )}
        </div>
      </section>

      <PlacedStudents />

      <section className="section" aria-labelledby="emp">
        <div className="container-x grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div id="emp">
            <Handshake className="text-royal-600" size={28} aria-hidden="true" />
            <SectionHeading title="Hire our trainees" text="Employers and apprenticeship providers can tell us what they need. The placement officer will respond." />
          </div>
          <EmployerForm />
        </div>
      </section>
    </>
  );
}