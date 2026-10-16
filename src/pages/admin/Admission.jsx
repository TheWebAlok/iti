import { useEffect, useMemo, useState } from 'react';
import { Download, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { card, input } from '../../components/admin/ui';
import { errorMessage } from '../../services/api';
import { publishedTrades } from '../../data/trades';
import {
  getAdmissions,
  createAdmission,
  updateAdmission,
  deleteAdmission,
  downloadAdmissionPdf,
  fileUrl,
} from '../../services/admin';

const STATUSES = ['Pending', 'Admitted', 'Rejected'];
const STATUS_STYLE = {
  Pending: 'border-amber-500 text-amber-700 dark:text-amber-300',
  Admitted: 'border-emerald-600 text-emerald-700 dark:text-emerald-300',
  Rejected: 'border-red-500 text-red-700 dark:text-red-300',
};
const LEVELS = ['8th', '10th', '12th', 'ITI', 'Graduation'];
const DOCS = [
  ['photo', 'Photo (JPG/PNG)'],
  ['signature', 'Signature (JPG/PNG)'],
  ['aadhaarCard', 'Aadhaar card'],
  ['marksheet', 'Previous marksheet'],
  ['clc', 'CLC'],
  ['residence', 'Residence certificate'],
  ['caste', 'Caste certificate (OBC/SC/ST)'],
];

const emptyQual = () => ({ level: '10th', board: '', maxMarks: '', obtained: '' });
const emptyForm = () => ({
  name: '', email: '', password: '', phone: '', aadhaar: '', fatherName: '', motherName: '',
  dob: '', gender: 'Male', category: 'General', pwd: 'No', exServiceman: 'No', address: '',
  trade: '', duration: '1 Year', eligibility: '', scheme: 'SCVT', tradeCategory: 'SelfFinance',
  qualifications: [emptyQual()],
  paymentMode: 'Cash', paymentAmount: '', receiptNo: '', transactionId: '', paidOn: '',
  status: 'Pending',
});

const toForm = (r) => ({
  ...emptyForm(),
  name: r.name || '', email: r.email || '', phone: r.phone || '', aadhaar: r.aadhaar || '',
  fatherName: r.fatherName || '', motherName: r.motherName || '',
  dob: r.dob ? r.dob.slice(0, 10) : '',
  gender: r.gender || 'Male', category: r.category || 'General',
  pwd: r.pwd || 'No', exServiceman: r.exServiceman || 'No', address: r.address || '',
  trade: r.trade || '', duration: r.duration || '', eligibility: r.eligibility || '',
  scheme: r.scheme || '', tradeCategory: r.tradeCategory || '',
  qualifications: r.qualifications?.length
    ? r.qualifications.map((q) => ({ level: q.level || '', board: q.board || '', maxMarks: q.maxMarks ?? '', obtained: q.obtained ?? '' }))
    : [emptyQual()],
  paymentMode: r.payment?.mode || 'Cash',
  paymentAmount: r.payment?.amount ?? '',
  receiptNo: r.payment?.receiptNo || '',
  transactionId: r.payment?.transactionId || '',
  paidOn: r.payment?.paidOn ? r.payment.paidOn.slice(0, 10) : '',
  status: r.status || 'Pending',
});

const TEXT_KEYS = [
  'name', 'email', 'password', 'phone', 'aadhaar', 'fatherName', 'motherName', 'dob', 'gender',
  'category', 'pwd', 'exServiceman', 'address', 'trade', 'duration', 'eligibility', 'scheme',
  'tradeCategory', 'paymentMode', 'paymentAmount', 'receiptNo', 'transactionId', 'paidOn', 'status',
];

function buildFormData(form, files) {
  const fd = new FormData();
  TEXT_KEYS.forEach((k) => {
    const v = form[k];
    if (v !== '' && v !== null && v !== undefined) fd.append(k, v);
  });
  fd.append('qualifications', JSON.stringify(form.qualifications.filter((q) => q.level)));
  Object.entries(files).forEach(([k, f]) => f && fd.append(k, f));
  return fd;
}

function Field({ label, children, className = '' }) {
  return (
    <label className={`block text-sm ${className}`}>
      <span className="mb-1 block font-medium text-navy-900 dark:text-white">{label}</span>
      {children}
    </label>
  );
}

export default function Admission() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null); // row jo edit ho rahi hai (null = naya admission)
  const [form, setForm] = useState(emptyForm());
  const [files, setFiles] = useState({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    getAdmissions()
      .then(setRows)
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (status === 'All' || r.status === status) &&
        (!q || [r.name, r.phone, r.aadhaar, r.fatherName, r.applicationNo, r.trade].some((v) => String(v || '').toLowerCase().includes(q)))
    );
  }, [rows, query, status]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setQual = (i, k, v) =>
    setForm((f) => ({ ...f, qualifications: f.qualifications.map((q, idx) => (idx === i ? { ...q, [k]: v } : q)) }));

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm());
    setFiles({});
    setFormError('');
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm(toForm(row));
    setFiles({});
    setFormError('');
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const fd = buildFormData(form, files);
      if (editing) {
        const updated = await updateAdmission(editing._id, fd);
        setRows((list) => list.map((r) => (r._id === updated._id ? updated : r)));
      } else {
        const created = await createAdmission(fd);
        setRows((list) => [created, ...list]);
      }
      setOpen(false);
    } catch (err) {
      setFormError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (row, next) => {
    const previous = rows;
    setRows((list) => list.map((r) => (r._id === row._id ? { ...r, status: next } : r)));
    try {
      const fd = new FormData();
      fd.append('status', next);
      await updateAdmission(row._id, fd);
    } catch (err) {
      setRows(previous);
      setError(errorMessage(err));
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`${row.name} ka admission delete karna hai? Student ka login bhi hat jayega.`)) return;
    try {
      await deleteAdmission(row._id);
      setRows((list) => list.filter((r) => r._id !== row._id));
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const pdf = async (row) => {
    try {
      setError('');
      await downloadAdmissionPdf(row._id, `${row.applicationNo}.pdf`);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const tradeOptions = publishedTrades.map((t) => t.name);
  if (form.trade && !tradeOptions.includes(form.trade)) tradeOptions.push(form.trade);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Admissions</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-white/70">
            {rows.filter((r) => r.status === 'Admitted').length} admitted of {rows.length} total.
          </p>
        </div>
        <button type="button" onClick={openNew} className="btn-primary">
          <Plus size={16} aria-hidden="true" /> New admission
        </button>
      </div>

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
              placeholder="Search name, phone, Aadhaar or application no."
              aria-label="Search admissions"
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
          <table className="w-full min-w-[52rem] text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="pb-2 font-medium">App. No.</th>
                <th className="pb-2 font-medium">Student</th>
                <th className="pb-2 font-medium">Trade</th>
                <th className="pb-2 font-medium">Phone</th>
                <th className="pb-2 font-medium">Payment</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="text-navy-900 dark:text-white">
              {visible.map((r) => (
                <tr key={r._id} className="border-t border-slate-200 align-top dark:border-white/10">
                  <td className="py-2.5 font-semibold">{r.applicationNo}</td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      {r.documents?.photo && (
                        <img src={fileUrl(r.documents.photo)} alt="" className="h-9 w-9 rounded-full object-cover" />
                      )}
                      <div>
                        <div className="font-semibold">{r.name}</div>
                        <div className="text-xs text-slate-500">S/o {r.fatherName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5">{r.trade}</td>
                  <td className="py-2.5">{r.phone}</td>
                  <td className="py-2.5">
                    {r.payment?.amount ? (
                      <>
                        Rs. {r.payment.amount}
                        <div className="text-xs text-slate-500">{r.payment.mode}</div>
                      </>
                    ) : (
                      <span className="text-slate-500">Not paid</span>
                    )}
                  </td>
                  <td className="py-2.5">
                    <select
                      value={r.status}
                      onChange={(e) => changeStatus(r, e.target.value)}
                      aria-label={`Status for ${r.name}`}
                      className={`rounded-lg border bg-transparent px-2 py-1 text-xs font-semibold ${STATUS_STYLE[r.status]}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} className="text-black">{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="whitespace-nowrap py-2.5">
                    <button
                      type="button"
                      onClick={() => pdf(r)}
                      disabled={!r.payment?.amount}
                      title={r.payment?.amount ? 'Download PDF (Student + Office copy)' : 'Payment pehle darj karein'}
                      aria-label={`Download PDF for ${r.name}`}
                      className="rounded-lg p-1.5 text-royal-600 hover:bg-slate-100 disabled:opacity-40"
                    >
                      <Download size={16} aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => openEdit(r)} aria-label={`Edit ${r.name}`} className="rounded-lg p-1.5 text-slate-700 hover:bg-slate-100 dark:text-white">
                      <Pencil size={16} aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => remove(r)} aria-label={`Delete ${r.name}`} className="rounded-lg p-1.5 text-red-600 hover:bg-red-50">
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
              {loading && (
                <tr><td colSpan={7} className="py-8 text-center text-slate-500">Loading admissions...</td></tr>
              )}
              {!loading && visible.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-slate-500">No admissions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4">
          <form onSubmit={save} className="mx-auto max-w-4xl space-y-6 rounded-xl bg-white p-5 shadow-xl dark:bg-navy-900 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy-900 dark:text-white">
                {editing ? `Edit admission ${editing.applicationNo}` : 'New admission'}
              </h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="rounded-lg p-1.5 hover:bg-slate-100">
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {formError && (
              <p role="alert" className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">{formError}</p>
            )}

            <section>
              <h3 className="mb-3 font-semibold text-navy-900 dark:text-white">Student details</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Full name *"><input className={input} value={form.name} onChange={set('name')} /></Field>
                <Field label="Father's name *"><input className={input} value={form.fatherName} onChange={set('fatherName')} /></Field>
                <Field label="Mother's name *"><input className={input} value={form.motherName} onChange={set('motherName')} /></Field>
                <Field label="Mobile number *"><input className={input} inputMode="numeric" maxLength={10} value={form.phone} onChange={set('phone')} /></Field>
                <Field label="Aadhaar number *"><input className={input} inputMode="numeric" maxLength={12} value={form.aadhaar} onChange={set('aadhaar')} /></Field>
                <Field label="Date of birth"><input type="date" className={input} value={form.dob} onChange={set('dob')} /></Field>
                <Field label="Gender">
                  <select className={input} value={form.gender} onChange={set('gender')}>
                    {['Male', 'Female', 'Other'].map((g) => <option key={g}>{g}</option>)}
                  </select>
                </Field>
                <Field label="Category">
                  <select className={input} value={form.category} onChange={set('category')}>
                    {['General', 'OBC', 'SC', 'ST', 'EWS'].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="PWD">
                  <select className={input} value={form.pwd} onChange={set('pwd')}>
                    {['No', 'Yes'].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Ex-serviceman">
                  <select className={input} value={form.exServiceman} onChange={set('exServiceman')}>
                    {['No', 'Yes'].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Address (niwas)" className="sm:col-span-2">
                  <input className={input} value={form.address} onChange={set('address')} />
                </Field>
              </div>
            </section>

            <section>
              <h3 className="mb-3 font-semibold text-navy-900 dark:text-white">Student login</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Email (login ke liye) *"><input type="email" className={input} value={form.email} onChange={set('email')} /></Field>
                <Field label={editing ? 'New password (khali chhodein to wahi rahega)' : 'Password * (min 6)'}>
                  <input type="text" autoComplete="off" className={input} value={form.password} onChange={set('password')} />
                </Field>
              </div>
            </section>

            <section>
              <h3 className="mb-3 font-semibold text-navy-900 dark:text-white">Trade</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Trade *" className="sm:col-span-3">
                  <select className={input} value={form.trade} onChange={set('trade')}>
                    <option value="">Select a trade</option>
                    {tradeOptions.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Duration"><input className={input} value={form.duration} onChange={set('duration')} /></Field>
                <Field label="Eligibility"><input className={input} value={form.eligibility} onChange={set('eligibility')} placeholder="8th / 10th" /></Field>
                <Field label="Scheme"><input className={input} value={form.scheme} onChange={set('scheme')} /></Field>
                <Field label="Trade category"><input className={input} value={form.tradeCategory} onChange={set('tradeCategory')} /></Field>
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-navy-900 dark:text-white">Qualification (8th / 10th / 12th / Graduation)</h3>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, qualifications: [...f.qualifications, emptyQual()] }))}
                  className="text-sm text-royal-600 hover:underline"
                >
                  + Add row
                </button>
              </div>
              <div className="space-y-3">
                {form.qualifications.map((q, i) => (
                  <div key={i} className="grid items-end gap-3 sm:grid-cols-[8rem_1fr_7rem_7rem_auto]">
                    <Field label="Level">
                      <select className={input} value={q.level} onChange={(e) => setQual(i, 'level', e.target.value)}>
                        {LEVELS.map((l) => <option key={l}>{l}</option>)}
                      </select>
                    </Field>
                    <Field label="Board / University"><input className={input} value={q.board} onChange={(e) => setQual(i, 'board', e.target.value)} /></Field>
                    <Field label="Max marks"><input type="number" className={input} value={q.maxMarks} onChange={(e) => setQual(i, 'maxMarks', e.target.value)} /></Field>
                    <Field label="Obtained"><input type="number" className={input} value={q.obtained} onChange={(e) => setQual(i, 'obtained', e.target.value)} /></Field>
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, qualifications: f.qualifications.filter((_, idx) => idx !== i) }))}
                      disabled={form.qualifications.length === 1}
                      aria-label="Remove row"
                      className="mb-1 rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-40"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-3 font-semibold text-navy-900 dark:text-white">Documents (JPG, PNG ya PDF, max 2 MB)</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {DOCS.map(([key, label]) => (
                  <Field key={key} label={label}>
                    <input
                      type="file"
                      accept={key === 'photo' || key === 'signature' ? 'image/jpeg,image/png' : 'image/jpeg,image/png,application/pdf'}
                      onChange={(e) => setFiles((f) => ({ ...f, [key]: e.target.files[0] || null }))}
                      className="block w-full text-sm"
                    />
                    {editing?.documents?.[key] && !files[key] && (
                      <a href={fileUrl(editing.documents[key])} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs text-royal-600 hover:underline">
                        Uploaded file dekhein
                      </a>
                    )}
                  </Field>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-3 font-semibold text-navy-900 dark:text-white">Payment</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Mode">
                  <select className={input} value={form.paymentMode} onChange={set('paymentMode')}>
                    {['Cash', 'Online'].map((m) => <option key={m}>{m}</option>)}
                  </select>
                </Field>
                <Field label="Amount (Rs.)"><input type="number" className={input} value={form.paymentAmount} onChange={set('paymentAmount')} /></Field>
                <Field label="Paid on"><input type="date" className={input} value={form.paidOn} onChange={set('paidOn')} /></Field>
                <Field label="Fee receipt / GR no."><input className={input} value={form.receiptNo} onChange={set('receiptNo')} /></Field>
                {form.paymentMode === 'Online' && (
                  <Field label="Transaction ID"><input className={input} value={form.transactionId} onChange={set('transactionId')} /></Field>
                )}
                <Field label="Admission status">
                  <select className={input} value={form.status} onChange={set('status')}>
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </Field>
              </div>
            </section>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : editing ? 'Save changes' : 'Create admission'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}