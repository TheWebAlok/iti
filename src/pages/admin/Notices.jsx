import { useEffect, useRef, useState } from 'react';
import { Download, Eye, Paperclip, Printer, Trash2, X } from 'lucide-react';
import { btnDanger, btnPrimary, card, input, label } from '../../components/admin/ui';
import { getNotices, createNotice, deleteNotice, getNoticeFile } from '../../services/admin';
import { errorMessage } from '../../services/api';
import { downloadBlob, printBlob, viewBlob } from '../../utils/noticeFile';

const EMPTY_FORM = { title: '', details: '', important: false };
const MAX_SIZE = 5 * 1024 * 1024; // must match the backend limit
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '-';

const fmtSize = (bytes) => (bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

const smallBtn =
  'inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-navy-900 hover:bg-slate-100 disabled:opacity-60 dark:border-white/20 dark:text-white dark:hover:bg-white/10';

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [busyFile, setBusyFile] = useState(''); // "<id>:<action>" while a file is loading
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const fileInput = useRef(null);

  useEffect(() => {
    let active = true;
    getNotices()
      .then((data) => {
        if (active) setNotices(data);
      })
      .catch((err) => {
        if (active) setLoadError(`Could not load notices: ${errorMessage(err)}`);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const onChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const clearFile = () => {
    setFile(null);
    if (fileInput.current) fileInput.current.value = '';
  };

  const onPickFile = (e) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    if (!ALLOWED_TYPES.includes(picked.type)) {
      setError('Only PDF, JPG, PNG or WEBP files are allowed.');
      clearFile();
      return;
    }
    if (picked.size > MAX_SIZE) {
      setError('File is too large. Maximum size is 5 MB.');
      clearFile();
      return;
    }
    setError('');
    setFile(picked);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Enter a title for the notice.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      // File ke saath bhejna hai, isliye FormData (JSON nahi)
      const data = new FormData();
      data.append('title', form.title.trim());
      data.append('details', form.details.trim());
      data.append('important', String(form.important));
      if (file) data.append('file', file);

      const created = await createNotice(data);
      setNotices((list) => [created, ...list]);
      setForm(EMPTY_FORM);
      clearFile();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (n) => {
    if (!window.confirm(`Delete notice "${n.title}"?`)) return;
    setDeletingId(n._id);
    setError('');
    try {
      await deleteNotice(n._id);
      setNotices((list) => list.filter((x) => x._id !== n._id));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  // action: 'view' | 'download' | 'print'
  const fileAction = async (n, action) => {
    // For "view" open the tab right now (on click) so the popup blocker allows it.
    const win = action === 'view' ? window.open('', '_blank') : null;
    setBusyFile(`${n._id}:${action}`);
    setError('');
    try {
      const blob = await getNoticeFile(n._id);
      if (action === 'view') viewBlob(blob, win);
      else if (action === 'download') downloadBlob(blob, n.attachment.originalName);
      else printBlob(blob);
    } catch (err) {
      if (win) win.close();
      setError(`Could not open the file: ${errorMessage(err)}`);
    } finally {
      setBusyFile('');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Post a notice</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-white/70">
        Notices you post here are saved and shown on the website. You can attach a PDF or image.
      </p>

      {loadError && (
        <p role="alert" className="mt-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {loadError}
        </p>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-5">
        <form onSubmit={onSubmit} className={`${card} space-y-4 xl:col-span-2`} noValidate>
          <label className={label}>
            Title
            <input name="title" value={form.title} onChange={onChange} className={`${input} mt-1`} />
          </label>
          <label className={label}>
            Details (optional)
            <textarea name="details" rows={4} value={form.details} onChange={onChange} className={`${input} mt-1`} />
          </label>

          <div>
            <label className={label} htmlFor="notice-file">
              Attach PDF or image (optional)
            </label>
            <input
              id="notice-file"
              ref={fileInput}
              type="file"
              accept="application/pdf,image/jpeg,image/png,image/webp"
              onChange={onPickFile}
              className={`${input} mt-1`}
            />
            <p className="mt-1 text-xs text-slate-500">PDF, JPG, PNG or WEBP. Maximum 5 MB.</p>
            {file && (
              <p className="mt-2 flex items-center justify-between gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm text-navy-900 dark:bg-white/10 dark:text-white">
                <span className="truncate">
                  {file.name} <span className="text-slate-500">({fmtSize(file.size)})</span>
                </span>
                <button type="button" onClick={clearFile} aria-label="Remove selected file" className="shrink-0">
                  <X size={16} aria-hidden="true" />
                </button>
              </p>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-navy-900 dark:text-white">
            <input type="checkbox" name="important" checked={form.important} onChange={onChange} />
            Mark as important
          </label>
          {error && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-300">
              {error}
            </p>
          )}
          <button type="submit" className={btnPrimary} disabled={saving}>
            {saving ? 'Posting...' : 'Post notice'}
          </button>
        </form>

        <div className={`${card} xl:col-span-3`}>
          <h2 className="text-lg font-semibold text-navy-900 dark:text-white">Posted notices</h2>
          <ul
            className="mt-3 divide-y divide-slate-200 pr-1 dark:divide-white/10"
            style={{ maxHeight: 420, overflowY: 'auto' }}
          >
            {notices.map((n) => (
              <li key={n._id} className="flex items-start justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="font-semibold text-navy-900 dark:text-white">
                    {n.title}
                    {n.important && (
                      <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">Important</span>
                    )}
                  </p>
                  {n.details && <p className="mt-0.5 text-sm text-slate-600 dark:text-white/70">{n.details}</p>}

                  {n.attachment && (
                    <div className="mt-2">
                      <p className="flex items-center gap-1 text-xs text-slate-600 dark:text-white/70">
                        <Paperclip size={12} aria-hidden="true" />
                        <span className="truncate">{n.attachment.originalName}</span>
                        <span className="text-slate-500">({fmtSize(n.attachment.size)})</span>
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-2">
                        <button type="button" className={smallBtn} onClick={() => fileAction(n, 'view')} disabled={busyFile === `${n._id}:view`}>
                          <Eye size={12} aria-hidden="true" />
                          View
                        </button>
                        <button type="button" className={smallBtn} onClick={() => fileAction(n, 'download')} disabled={busyFile === `${n._id}:download`}>
                          <Download size={12} aria-hidden="true" />
                          Save
                        </button>
                        <button type="button" className={smallBtn} onClick={() => fileAction(n, 'print')} disabled={busyFile === `${n._id}:print`}>
                          <Printer size={12} aria-hidden="true" />
                          Print
                        </button>
                      </div>
                    </div>
                  )}

                  <p className="mt-1 text-xs text-slate-500">{fmtDate(n.createdAt)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(n)}
                  className={btnDanger}
                  disabled={deletingId === n._id}
                  aria-label={`Delete ${n.title}`}
                >
                  <Trash2 size={14} aria-hidden="true" />
                  {deletingId === n._id ? 'Deleting...' : 'Delete'}
                </button>
              </li>
            ))}
            {loading && <li className="py-6 text-center text-sm text-slate-500">Loading...</li>}
            {!loading && notices.length === 0 && (
              <li className="py-6 text-center text-sm text-slate-500">No notices yet. Post your first one.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}