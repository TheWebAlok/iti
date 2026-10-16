import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Inbox, Users, Wrench } from 'lucide-react';
import { getAdmissions, getEnquiries } from '../../services/admin';
import { errorMessage } from '../../services/api';
import { publishedTrades } from '../../data/trades';

const STATUS_STYLE = {
  New: 'bg-royal-600 text-white',
  Called: 'bg-amber-100 text-amber-900',
  Admitted: 'bg-emerald-100 text-emerald-900',
  'Not interested': 'bg-slate-200 text-slate-700',
  Pending: 'bg-amber-100 text-amber-900',
  Rejected: 'bg-red-100 text-red-800',
};

const card = 'rounded-xl border border-slate-200 bg-white p-5 dark:border-white/15 dark:bg-navy-900';

// Kitni latest rows hamesha dikhni chahiye
const PREVIEW = 5;

// Enquiries store the trade slug; show its name instead.
const tradeName = (slug) => publishedTrades.find((t) => t.slug === slug)?.name || slug;

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '-';

// Admission session like 2026-27 (April to March)
const currentSession = () => {
  const now = new Date();
  const start = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  return `${start}-${String(start + 1).slice(-2)}`;
};

function Stat({ icon: Icon, label, value, note }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/15 dark:bg-navy-900">
      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-white/70">
        <Icon size={16} aria-hidden="true" />
        {label}
      </div>
      <p className="mt-2 text-3xl font-bold text-navy-900 dark:text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{note}</p>
    </div>
  );
}

// Shown inside AdminLayout (sidebar + top bar), so no page padding or logout here.
export default function AdminDashboard() {
  const [admissions, setAdmissions] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAllEnq, setShowAllEnq] = useState(false);
  const [showAllAdm, setShowAllAdm] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.allSettled([getAdmissions(), getEnquiries()]).then(([adm, enq]) => {
      if (!active) return;
      const errors = [];
      if (adm.status === 'fulfilled') setAdmissions(adm.value);
      else errors.push(`Admissions: ${errorMessage(adm.reason)}`);
      if (enq.status === 'fulfilled') setEnquiries(enq.value);
      else errors.push(`Enquiries: ${errorMessage(enq.reason)}`);
      setError(errors.join(' | '));
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const admitted = useMemo(() => admissions.filter((a) => a.status === 'Admitted'), [admissions]);
  const pending = admissions.filter((a) => a.status === 'Pending').length;
  const newEnquiries = enquiries.filter((e) => e.status === 'New').length;

  // Admitted students per trade. Seats are shown only if the trade data has a `seats` number.
  const tradeRows = useMemo(
    () =>
      publishedTrades.map((t) => {
        const filled = admitted.filter((a) => a.trade === t.name).length;
        const seats = Number(t.seats) || null;
        return { name: t.name, filled, seats };
      })
        // Jin trades me admission hua hai wo upar, baaki (0 admitted) neeche scroll me.
        // sort stable hai, isliye barabar wale trades apne original order me rehte hain.
        .sort((a, b) => b.filled - a.filled),
    [admitted]
  );
  const maxFilled = Math.max(1, ...tradeRows.map((t) => t.filled));

  // Newest first from the API. Pehli 5 hamesha dikhengi, baaki "Show more" par scroll me.
  const filteredEnquiries = enquiries.filter((e) => statusFilter === 'All' || e.status === statusFilter);
  const rows = showAllEnq ? filteredEnquiries : filteredEnquiries.slice(0, PREVIEW);
  const recentAdmissions = showAllAdm ? admissions : admissions.slice(0, PREVIEW);

  return (
    <div>
      <header>
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-white/70">
          Admission session {currentSession()}. Live data from your admissions and enquiries.
        </p>
      </header>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Stat icon={Users} label="Students admitted" value={loading ? '-' : admitted.length} note={`of ${admissions.length} applications`} />
        <Stat icon={GraduationCap} label="Pending admissions" value={loading ? '-' : pending} note="awaiting decision" />
        <Stat icon={Inbox} label="New enquiries" value={loading ? '-' : newEnquiries} note="not called yet" />
        <Stat icon={Wrench} label="Trades" value={publishedTrades.length} note="published on website" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-5">
        <div className={`${card} xl:col-span-2`}>
          <h2 className="text-lg font-semibold text-navy-900 dark:text-white">Admitted by trade</h2>
          <ul className="mt-4 space-y-4 pr-2" style={{ maxHeight: 300, overflowY: 'auto' }}>
            {tradeRows.map((t) => {
              const base = t.seats || maxFilled;
              const pct = Math.min(100, Math.round((t.filled / base) * 100));
              const full = t.seats ? t.filled >= t.seats : false;
              return (
                <li key={t.name}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="font-semibold text-navy-900 dark:text-white">{t.name}</span>
                    <span className="text-slate-600 dark:text-white/70">
                      {t.seats ? `${t.filled}/${t.seats} seats${full ? ' (full)' : ''}` : `${t.filled} admitted`}
                    </span>
                  </div>
                  <div
                    className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/15"
                    role="progressbar"
                    aria-label={`${t.name} admitted students`}
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div className={`h-full rounded-full ${full ? 'bg-emerald-600' : 'bg-royal-600'}`} style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
            {tradeRows.length === 0 && <li className="text-sm text-slate-500">No trades found.</li>}
          </ul>
        </div>

        <div className={`${card} xl:col-span-3`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-navy-900 dark:text-white">Recent enquiries</h2>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter enquiries by status">
              {['All', 'New', 'Called', 'Admitted'].map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={statusFilter === s}
                  onClick={() => {
                    setStatusFilter(s);
                    setShowAllEnq(false);
                  }}
                  className={`chip !px-3 !py-1 text-xs ${
                    statusFilter === s
                      ? 'border-royal-600 bg-royal-600 text-white'
                      : 'border-slate-300 bg-white text-navy-900 dark:border-white/20 dark:bg-navy-900 dark:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Scroll sirf tab jab "Show more" khula ho; warna sirf 5 latest rows */}
          <div className="mt-4" style={showAllEnq ? { maxHeight: 245, overflow: 'auto' } : undefined}>
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead className="sticky top-0 bg-white text-slate-500 dark:bg-navy-900">
                <tr>
                  <th className="pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium">Trade</th>
                  <th className="pb-2 font-medium">Phone</th>
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-navy-900 dark:text-white">
                {rows.map((e) => (
                  <tr key={e._id} className="border-t border-slate-200 dark:border-white/10">
                    <td className="py-2.5 font-semibold">{e.name}</td>
                    <td className="py-2.5">{tradeName(e.trade)}</td>
                    <td className="py-2.5">{e.phone}</td>
                    <td className="py-2.5">{fmtDate(e.createdAt)}</td>
                    <td className="py-2.5">
                      <span className={`rounded px-2 py-0.5 text-xs font-semibold ${STATUS_STYLE[e.status] || ''}`}>{e.status}</span>
                    </td>
                  </tr>
                ))}
                {loading && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500">Loading...</td>
                  </tr>
                )}
                {!loading && rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500">No enquiries with this status.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredEnquiries.length > PREVIEW && (
            <button
              type="button"
              onClick={() => setShowAllEnq((v) => !v)}
              className="mt-3 mr-4 text-sm text-royal-600 hover:underline"
            >
              {showAllEnq ? 'Show less' : `Show more (${filteredEnquiries.length - PREVIEW})`}
            </button>
          )}
          <Link to="/admin/enquiries" className="mt-3 inline-block text-sm text-royal-600 hover:underline">
            View all enquiries
          </Link>
        </div>
      </div>

      <div className={`${card} mt-6`}>
        <h2 className="text-lg font-semibold text-navy-900 dark:text-white">Recent admissions</h2>
        <ul
          className="mt-3 divide-y divide-slate-200 dark:divide-white/10"
          style={showAllAdm ? { maxHeight: 215, overflowY: 'auto' } : undefined}
        >
          {recentAdmissions.map((a) => (
            <li key={a._id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
              <span className="text-navy-900 dark:text-white">
                <span className="font-semibold">{a.name}</span>
                <span className="text-slate-500"> &middot; {a.trade} &middot; {a.applicationNo}</span>
              </span>
              <span className="flex shrink-0 items-center gap-3">
                <span className={`rounded px-2 py-0.5 text-xs font-semibold ${STATUS_STYLE[a.status] || ''}`}>{a.status}</span>
                <span className="text-slate-500">{fmtDate(a.createdAt)}</span>
              </span>
            </li>
          ))}
          {!loading && recentAdmissions.length === 0 && (
            <li className="py-4 text-center text-sm text-slate-500">No admissions yet.</li>
          )}
        </ul>

        {admissions.length > PREVIEW && (
          <button
            type="button"
            onClick={() => setShowAllAdm((v) => !v)}
            className="mt-3 mr-4 text-sm text-royal-600 hover:underline"
          >
            {showAllAdm ? 'Show less' : `Show more (${admissions.length - PREVIEW})`}
          </button>
        )}
        <Link to="/admin/admission" className="mt-3 inline-block text-sm text-royal-600 hover:underline">
          View all admissions
        </Link>
      </div>
    </div>
  );
}