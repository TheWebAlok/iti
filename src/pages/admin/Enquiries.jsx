import { useEffect, useMemo, useState } from 'react';
import { Phone, Search, Trash2 } from 'lucide-react';
import { card, input } from '../../components/admin/ui';
import { getEnquiries, updateEnquiry, deleteEnquiry } from '../../services/admin';
import { errorMessage } from '../../services/api';
import { publishedTrades } from '../../data/trades';

const STATUSES = ['New', 'Called', 'Admitted', 'Not interested'];

const STATUS_STYLE = {
  New: 'border-royal-600 text-royal-600',
  Called: 'border-amber-500 text-amber-700 dark:text-amber-300',
  Admitted: 'border-emerald-600 text-emerald-700 dark:text-emerald-300',
  'Not interested': 'border-slate-400 text-slate-600 dark:text-white/60',
};

// Database me trade ka slug save hota hai, yahan uska naam dikhate hain
const tradeName = (slug) => publishedTrades.find((t) => t.slug === slug)?.name || slug;

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

export default function Enquiries() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');

  useEffect(() => {
    let active = true;
    getEnquiries()
      .then((data) => active && setRows(data))
      .catch((err) => active && setError(errorMessage(err)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (status === 'All' || r.status === status) &&
        (!q || [r.name, tradeName(r.trade), r.phone].some((v) => String(v).toLowerCase().includes(q)))
    );
  }, [rows, query, status]);

  const setRowStatus = async (id, next) => {
    const previous = rows;
    setRows((list) => list.map((r) => (r._id === id ? { ...r, status: next } : r)));
    try {
      await updateEnquiry(id, { status: next });
    } catch (err) {
      setRows(previous); // save nahi hua to wapas purana status
      setError(errorMessage(err));
    }
  };

  const removeRow = async (row) => {
    if (!window.confirm(`${row.name} ki enquiry delete karni hai?`)) return;
    try {
      await deleteEnquiry(row._id);
      setRows((list) => list.filter((r) => r._id !== row._id));
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Enquiries</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-white/70">
        {rows.filter((r) => r.status === 'New').length} new of {rows.length} total.
      </p>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </p>
      )}

      <div className={`${card} mt-6`}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[14rem] flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, trade or phone"
              aria-label="Search enquiries"
              className={`${input} pl-9`}
            />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status" className={`${input} !w-auto`}>
            {['All', ...STATUSES].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Trade</th>
                <th className="pb-2 font-medium">Phone</th>
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="text-navy-900 dark:text-white">
              {visible.map((r) => (
                <tr key={r._id} className="border-t border-slate-200 align-top dark:border-white/10">
                  <td className="py-2.5">
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-xs text-slate-500">{r.qualification}</div>
                    {r.message && <div className="mt-1 max-w-xs text-xs text-slate-600 dark:text-white/70">{r.message}</div>}
                  </td>
                  <td className="py-2.5">{tradeName(r.trade)}</td>
                  <td className="py-2.5">
                    <a href={`tel:${r.phone}`} className="inline-flex items-center gap-1.5 text-royal-600 hover:underline">
                      <Phone size={14} aria-hidden="true" />
                      {r.phone}
                    </a>
                  </td>
                  <td className="py-2.5">{formatDate(r.createdAt)}</td>
                  <td className="py-2.5">
                    <select
                      value={r.status}
                      onChange={(e) => setRowStatus(r._id, e.target.value)}
                      aria-label={`Status for ${r.name}`}
                      className={`rounded-lg border bg-transparent px-2 py-1 text-xs font-semibold ${STATUS_STYLE[r.status]}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} className="text-black">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2.5">
                    <button
                      type="button"
                      onClick={() => removeRow(r)}
                      aria-label={`Delete enquiry from ${r.name}`}
                      className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
              {loading && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Loading enquiries...
                  </td>
                </tr>
              )}
              {!loading && visible.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No enquiries match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}