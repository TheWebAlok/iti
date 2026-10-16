import { useEffect, useState } from 'react';
import { Download, ExternalLink, Printer, X } from 'lucide-react';
import Seo from '../../components/Seo';
import { api } from '../../context/AuthContext';

// Files /uploads pe serve hoti hain (backend root), /api pe nahi.
// Production me VITE_FILES_URL=https://your-backend.com daalo. Dev me khali chhodo (Vite proxy sambhalega).
const FILES_BASE = import.meta.env.VITE_FILES_URL || '';

const assetUrl = (p) => {
  if (!p) return '';
  if (/^https?:/i.test(p)) return p;
  return `${FILES_BASE}${p.startsWith('/') ? '' : '/'}${p}`;
};
const DOC_LABELS = [
  ['photo', 'Photo'],
  ['signature', 'Signature'],
  ['aadhaarCard', 'Aadhaar card'],
  ['marksheet', 'Marksheet'],
  ['clc', 'CLC'],
  ['residence', 'Residence certificate'],
  ['caste', 'Caste certificate'],
];

const date = (d, utc) =>
  d ? new Date(d).toLocaleDateString('en-IN', utc ? { timeZone: 'UTC' } : undefined) : '-';

const STATUS_STYLE = {
  Pending: 'bg-amber-100 text-amber-800',
  Admitted: 'bg-emerald-100 text-emerald-800',
  Rejected: 'bg-red-100 text-red-800',
};

const extOf = (p) => (String(p).match(/\.([a-z0-9]+)$/i)?.[1] || 'file').toLowerCase();

function Item({ label, value }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold text-navy-900">{value || '-'}</dd>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="mb-4 text-lg font-bold text-navy-900">{title}</h2>
      {children}
    </section>
  );
}

// Fetches the student-copy PDF from the protected route as a blob.
async function fetchPdfBlob() {
  const r = await api('/student/admission/pdf');
  if (!r.ok) {
    let message = 'Could not load receipt';
    try {
      message = (await r.json()).message || message;
    } catch {
      /* response was not JSON */
    }
    throw new Error(message);
  }
  return r.blob();
}

// Saves a blob. Uses the native "Save as" dialog where the browser supports it
// (Chrome / Edge), otherwise falls back to a normal download.
async function saveBlob(blob, filename) {
  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({ suggestedName: filename });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (e) {
      if (e.name === 'AbortError') return; // user cancelled
    }
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

// Modal that previews an uploaded document (image or PDF) with save buttons.
function DocViewer({ doc, applicantName, onClose }) {
  const [blob, setBlob] = useState(null);
  const [blobUrl, setBlobUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let url = '';
    let cancelled = false;
    fetch(assetUrl(doc.path))
      .then((r) => {
        if (!r.ok) throw new Error('Could not load this file');
        return r.blob();
      })
      .then((b) => {
        if (cancelled) return;
        url = URL.createObjectURL(b);
        setBlob(b);
        setBlobUrl(url);
      })
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [doc.path]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const ext = extOf(doc.path);
  const isPdf = ext === 'pdf' || blob?.type === 'application/pdf';
  const filename = `${applicantName}-${doc.label}`.replace(/[^a-z0-9]+/gi, '_') + `.${ext}`;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={doc.label}
    >
      <div
        className="flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-3">
          <h3 className="font-bold text-navy-900">{doc.label}</h3>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 hover:bg-slate-100">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="flex min-h-[16rem] flex-1 items-center justify-center overflow-auto bg-slate-100 p-3">
          {error && <p className="text-sm text-red-700">{error}</p>}
          {!error && !blobUrl && <p className="text-sm text-slate-500">Loading...</p>}
          {blobUrl && isPdf && (
            <iframe title={doc.label} src={blobUrl} className="h-[70vh] w-full rounded-lg bg-white" />
          )}
          {blobUrl && !isPdf && (
            <img src={blobUrl} alt={doc.label} className="max-h-[70vh] max-w-full rounded-lg object-contain" />
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 px-5 py-3">
          {blobUrl && (
            <a
              href={blobUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-navy-900 hover:bg-slate-50"
            >
              <ExternalLink size={16} aria-hidden="true" /> Open in new tab
            </a>
          )}
          <button
            type="button"
            disabled={!blob}
            onClick={() => saveBlob(blob, filename)}
            className="btn-primary disabled:opacity-50"
          >
            <Download size={16} aria-hidden="true" /> Save / Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StudentProfile() {
  const [a, setA] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const [viewer, setViewer] = useState(null); // { label, path }

  useEffect(() => {
    api('/student/admission')
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.message || 'Could not load profile');
        setA(d);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const hasPayment = Boolean(a?.payment?.amount);

  const download = async () => {
    setBusy('download');
    setError('');
    try {
      await saveBlob(await fetchPdfBlob(), `${a.applicationNo}-student-copy.pdf`);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy('');
    }
  };

  const print = async () => {
    setBusy('print');
    setError('');
    try {
      const url = URL.createObjectURL(await fetchPdfBlob());
      const frame = document.createElement('iframe');
      frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
      frame.src = url;
      frame.onload = () => {
        frame.contentWindow.focus();
        frame.contentWindow.print();
        setTimeout(() => {
          frame.remove();
          URL.revokeObjectURL(url);
        }, 60000);
      };
      document.body.appendChild(frame);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy('');
    }
  };

  return (
    <>
      <Seo title="My profile" />
      <section className="container-x py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-navy-900">My profile</h1>
            {a && (
              <p className="mt-1 text-sm text-slate-600">
                Application No: <span className="font-semibold">{a.applicationNo}</span>
                <span className={`ml-3 rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[a.status] || ''}`}>
                  {a.status}
                </span>
              </p>
            )}
          </div>

          {a && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={print}
                disabled={!hasPayment || busy !== ''}
                title={hasPayment ? 'Print admission receipt' : 'Receipt is available after payment is recorded'}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-navy-900 hover:bg-slate-50 disabled:opacity-50"
              >
                <Printer size={16} aria-hidden="true" /> {busy === 'print' ? 'Preparing...' : 'Print receipt'}
              </button>
              <button
                type="button"
                onClick={download}
                disabled={!hasPayment || busy !== ''}
                title={hasPayment ? 'Download admission receipt' : 'Receipt is available after payment is recorded'}
                className="btn-primary disabled:opacity-50"
              >
                <Download size={16} aria-hidden="true" /> {busy === 'download' ? 'Downloading...' : 'Download receipt'}
              </button>
            </div>
          )}
        </div>

        {error && (
          <p role="alert" className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
        )}
        {loading && <p className="mt-6 text-sm text-slate-500">Loading your details...</p>}

        {a && (
          <div className="mt-6 space-y-5">
            <Card title="Personal details">
              <div className="flex flex-col gap-6 sm:flex-row">
                {a.documents?.photo && (
                  <button
                    type="button"
                    onClick={() => setViewer({ label: 'Photo', path: a.documents.photo })}
                    aria-label="View photo"
                    className="h-36 w-28 shrink-0"
                  >
                    <img
                      src={assetUrl(a.documents.photo)}
                      alt={`Photo of ${a.name}`}
                      className="h-36 w-28 rounded-lg border border-slate-200 object-cover"
                    />
                  </button>
                )}
                <dl className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Item label="Full name" value={a.name} />
                  <Item label="Father's name" value={a.fatherName} />
                  <Item label="Mother's name" value={a.motherName} />
                  <Item label="Date of birth" value={date(a.dob, true)} />
                  <Item label="Gender" value={a.gender} />
                  <Item label="Category" value={a.category} />
                  <Item label="Mobile" value={a.phone} />
                  <Item label="Email" value={a.email} />
                  <Item label="Aadhaar" value={a.aadhaar} />
                  <Item label="PWD" value={a.pwd} />
                  <Item label="Ex-serviceman" value={a.exServiceman} />
                  <Item label="Address" value={a.address} />
                </dl>
              </div>
            </Card>

            <Card title="Trade">
              <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Item label="Trade" value={a.trade} />
                <Item label="Duration" value={a.duration} />
                <Item label="Eligibility" value={a.eligibility} />
                <Item label="Scheme" value={a.scheme} />
                <Item label="Trade category" value={a.tradeCategory} />
                <Item label="Applied on" value={date(a.createdAt)} />
              </dl>
            </Card>

            <Card title="Qualification">
              {a.qualifications?.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[30rem] text-left text-sm">
                    <thead className="text-slate-500">
                      <tr>
                        <th className="pb-2 font-medium">Level</th>
                        <th className="pb-2 font-medium">Board / University</th>
                        <th className="pb-2 font-medium">Max marks</th>
                        <th className="pb-2 font-medium">Obtained</th>
                        <th className="pb-2 font-medium">Percentage</th>
                      </tr>
                    </thead>
                    <tbody className="text-navy-900">
                      {a.qualifications.map((q, i) => (
                        <tr key={i} className="border-t border-slate-200">
                          <td className="py-2 font-semibold">{q.level}</td>
                          <td className="py-2">{q.board || '-'}</td>
                          <td className="py-2">{q.maxMarks ?? '-'}</td>
                          <td className="py-2">{q.obtained ?? '-'}</td>
                          <td className="py-2">{q.percentage != null ? `${q.percentage}%` : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-slate-500">No qualification details saved.</p>
              )}
            </Card>

            <Card title="Payment">
              {hasPayment ? (
                <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Item label="Mode" value={a.payment.mode} />
                  <Item label="Amount" value={`Rs. ${a.payment.amount}`} />
                  <Item label="Paid on" value={date(a.payment.paidOn)} />
                  <Item label="Fee receipt / GR no." value={a.payment.receiptNo} />
                  {a.payment.mode === 'Online' && <Item label="Transaction ID" value={a.payment.transactionId} />}
                </dl>
              ) : (
                <p className="text-sm text-slate-500">Payment has not been recorded yet.</p>
              )}
            </Card>

            <Card title="Documents">
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {DOC_LABELS.map(([key, label]) => (
                  <li key={key} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm">
                    <span className="text-navy-900">{label}</span>
                    {a.documents?.[key] ? (
                      <button
                        type="button"
                        onClick={() => setViewer({ label, path: a.documents[key] })}
                        className="font-medium text-royal-600 hover:underline"
                      >
                        View
                      </button>
                    ) : (
                      <span className="text-slate-400">Not uploaded</span>
                    )}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}
      </section>

      {viewer && <DocViewer doc={viewer} applicantName={a?.name || 'document'} onClose={() => setViewer(null)} />}
    </>
  );
}