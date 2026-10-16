import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Eye, FileText, Printer } from 'lucide-react';
// Same service file you already use. GET /api/notices is public, so these work for students too.
import { getNotices, getNoticeFile } from '../../services/admin';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

// Different backends name the stored file differently, so check the common fields.
const fileNameOf = (n) =>
  n.attachment?.originalName ||
  n.attachment?.originalname ||
  n.attachment?.name ||
  n.attachment?.filename ||
  n.fileName ||
  'attachment';

const hasFile = (n) => Boolean(n.attachment || n.fileName);

function openBlob(blob) {
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank', 'noopener');
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

function saveBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function printBlob(blob) {
  const url = URL.createObjectURL(blob);
  const frame = document.createElement('iframe');
  frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
  const cleanup = () => {
    setTimeout(() => {
      frame.remove();
      URL.revokeObjectURL(url);
    }, 1000);
  };
  const doPrint = () => {
    frame.contentWindow.focus();
    frame.contentWindow.print();
    cleanup();
  };

  if (blob.type.startsWith('image/')) {
    frame.srcdoc = `<html><body style="margin:0"><img src="${url}" style="max-width:100%"></body></html>`;
    frame.onload = () => {
      const img = frame.contentDocument.querySelector('img');
      if (img.complete) doPrint();
      else img.onload = doPrint;
    };
  } else {
    frame.src = url;
    frame.onload = doPrint;
  }
  document.body.appendChild(frame);
}

function NoticeCard({ notice }) {
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  const run = async (action) => {
    setBusy(action);
    setError('');
    try {
      const blob = await getNoticeFile(notice._id);
      if (action === 'view') openBlob(blob);
      if (action === 'save') saveBlob(blob, fileNameOf(notice));
      if (action === 'print') printBlob(blob);
    } catch {
      setError('Could not load the file. Please try again.');
    } finally {
      setBusy('');
    }
  };

  const btn =
    'inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50';

  return (
    <article
      className={`rounded-xl border bg-white p-5 shadow-sm ${
        notice.important ? 'border-amber-400' : 'border-slate-200'
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-base font-semibold text-slate-900">{notice.title}</h2>
        {notice.important && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
            Important
          </span>
        )}
      </div>
      <p className="mt-0.5 text-xs text-slate-500">{formatDate(notice.createdAt)}</p>

      {notice.details && (
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-700">
          {notice.details}
        </p>
      )}

      {hasFile(notice) && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
          <span className="mr-1 inline-flex items-center gap-1.5 text-sm text-slate-600">
            <FileText size={16} />
            <span className="max-w-[16rem] truncate">{fileNameOf(notice)}</span>
          </span>
          <button type="button" className={btn} disabled={!!busy} onClick={() => run('view')}>
            <Eye size={15} /> {busy === 'view' ? 'Opening...' : 'View'}
          </button>
          <button type="button" className={btn} disabled={!!busy} onClick={() => run('save')}>
            <Download size={15} /> {busy === 'save' ? 'Saving...' : 'Save'}
          </button>
          <button type="button" className={btn} disabled={!!busy} onClick={() => run('print')}>
            <Printer size={15} /> {busy === 'print' ? 'Preparing...' : 'Print'}
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </article>
  );
}

export default function StudentNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    getNotices()
      .then((data) => {
        if (!alive) return;
        // Backend sends newest first; sort again so the order is safe either way.
        const list = Array.isArray(data) ? data : data?.notices || [];
        setNotices([...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      })
      .catch(() => alive && setError('Could not load notices. Please refresh the page.'))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <Link
        to="/student/dashboard"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft size={16} /> Back to dashboard
      </Link>

      <h1 className="text-2xl font-semibold text-slate-900">Notices</h1>
      <p className="mb-5 text-sm text-slate-500">Latest announcements from the college.</p>

      {loading && <p className="text-sm text-slate-500">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && notices.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          No notices yet. New notices will show up here.
        </p>
      )}

      <div className="space-y-4">
        {notices.map((n) => (
          <NoticeCard key={n._id} notice={n} />
        ))}
      </div>
    </div>
  );
}