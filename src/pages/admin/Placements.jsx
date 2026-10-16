import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Trash2, X } from 'lucide-react';
import { btnDanger, btnPrimary, card, input, label } from '../../components/admin/ui';
import { createPlacement, deletePlacement, getPlacements, placementPhotoUrl } from '../../services/admin';

const TRADES = ['Fitter', 'Electrician', 'Welder', 'COPA', 'Mechanic Motor Vehicle'];
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_MB = 2;

const EMPTY = { student: '', trade: TRADES[0], company: '', salary: '', year: String(new Date().getFullYear()) };

const errMsg = (err, fallback) => err?.response?.data?.message || fallback;

function Avatar({ row }) {
  const [broken, setBroken] = useState(false);
  if (row.photo && !broken) {
    return (
      <img
        src={placementPhotoUrl(row._id)}
        alt={row.student}
        onError={() => setBroken(true)}
        className="h-9 w-9 rounded-full object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600 dark:bg-white/10 dark:text-white/70"
    >
      {row.student.charAt(0).toUpperCase()}
    </span>
  );
}

export default function Placements() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    let alive = true;
    getPlacements()
      .then((data) => alive && setRows(data))
      .catch((err) => alive && setError(errMsg(err, 'Could not load placements.')))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  // preview ka object URL band karo jab image badle ya page chhode
  useEffect(() => {
    if (!photo) {
      setPreview('');
      return undefined;
    }
    const url = URL.createObjectURL(photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const clearPhoto = () => {
    setPhoto(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const onPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED.includes(file.type)) {
      setError('Photo must be a JPG, PNG or WEBP image.');
      clearPhoto();
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Photo is too large. Maximum size is ${MAX_MB} MB.`);
      clearPhoto();
      return;
    }
    setError('');
    setPhoto(file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.student.trim() || !form.company.trim()) {
      setError('Enter the student name and company.');
      return;
    }
    const salary = form.salary === '' ? '' : Number(form.salary);
    if (salary !== '' && (Number.isNaN(salary) || salary < 0)) {
      setError('Package must be a number, for example 2.4');
      return;
    }

    const data = new FormData();
    data.append('student', form.student.trim());
    data.append('trade', form.trade);
    data.append('company', form.company.trim());
    data.append('salary', form.salary);
    data.append('year', form.year);
    if (photo) data.append('photo', photo);

    setError('');
    setSaving(true);
    try {
      const created = await createPlacement(data);
      setRows((list) => [created, ...list]);
      setForm(EMPTY);
      clearPhoto();
    } catch (err) {
      setError(errMsg(err, 'Could not save the placement. Please try again.'));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (r) => {
    if (!window.confirm(`Delete placement of ${r.student}?`)) return;
    try {
      await deletePlacement(r._id);
      setRows((list) => list.filter((x) => x._id !== r._id));
    } catch (err) {
      setError(errMsg(err, 'Could not delete. Please try again.'));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Add placement</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-white/70">
        {loading ? 'Loading...' : `${rows.length} placements listed.`}
      </p>

      <div className="mt-6 grid gap-6 xl:grid-cols-5">
        <form onSubmit={onSubmit} className={`${card} space-y-4 xl:col-span-2`} noValidate>
          <label className={label}>
            Student name
            <input name="student" value={form.student} onChange={onChange} className={`${input} mt-1`} />
          </label>
          <label className={label}>
            Trade
            <select name="trade" value={form.trade} onChange={onChange} className={`${input} mt-1`}>
              {TRADES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className={label}>
            Company
            <input name="company" value={form.company} onChange={onChange} className={`${input} mt-1`} />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className={label}>
              Package (LPA)
              <input name="salary" inputMode="decimal" value={form.salary} onChange={onChange} placeholder="2.4" className={`${input} mt-1`} />
            </label>
            <label className={label}>
              Year
              <input name="year" inputMode="numeric" value={form.year} onChange={onChange} className={`${input} mt-1`} />
            </label>
          </div>

          <div>
            <span className={label}>Student photo (optional)</span>
            <input ref={fileRef} id="placement-photo" type="file" accept=".jpg,.jpeg,.png,.webp" onChange={onPhoto} className="sr-only" />
            {photo ? (
              <div className="mt-1 flex items-center gap-3 rounded-lg border border-slate-200 p-2 dark:border-white/10">
                <img src={preview} alt="Selected student" className="h-14 w-14 rounded-full object-cover" />
                <div className="min-w-0 flex-1 text-sm text-navy-900 dark:text-white">
                  <p className="truncate font-medium">{photo.name}</p>
                  <p className="text-xs text-slate-500">{(photo.size / 1024).toFixed(0)} KB</p>
                </div>
                <button type="button" onClick={clearPhoto} className={btnDanger} aria-label="Remove photo">
                  <X size={14} aria-hidden="true" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="placement-photo"
                className="mt-1 flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-3 text-sm text-slate-600 hover:bg-slate-50 dark:border-white/20 dark:text-white/70 dark:hover:bg-white/5"
              >
                <ImagePlus size={18} aria-hidden="true" />
                Choose JPG, PNG or WEBP (max {MAX_MB} MB)
              </label>
            )}
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-300">
              {error}
            </p>
          )}
          <button type="submit" disabled={saving} className={`${btnPrimary} disabled:opacity-60`}>
            {saving ? 'Saving...' : 'Add placement'}
          </button>
        </form>

        <div className={`${card} xl:col-span-3`}>
          <h2 className="text-lg font-semibold text-navy-900 dark:text-white">Placed students</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="pb-2 font-medium">Student</th>
                  <th className="pb-2 font-medium">Trade</th>
                  <th className="pb-2 font-medium">Company</th>
                  <th className="pb-2 font-medium">LPA</th>
                  <th className="pb-2 font-medium">Year</th>
                  <th className="pb-2" />
                </tr>
              </thead>
              <tbody className="text-navy-900 dark:text-white">
                {rows.map((r) => (
                  <tr key={r._id} className="border-t border-slate-200 dark:border-white/10">
                    <td className="py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar row={r} />
                        <span className="font-semibold">{r.student}</span>
                      </div>
                    </td>
                    <td className="py-2.5">{r.trade}</td>
                    <td className="py-2.5">{r.company}</td>
                    <td className="py-2.5">{r.salary ?? '-'}</td>
                    <td className="py-2.5">{r.year}</td>
                    <td className="py-2.5 text-right">
                      <button type="button" onClick={() => remove(r)} className={btnDanger} aria-label={`Delete ${r.student}`}>
                        <Trash2 size={14} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && rows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No placements yet. Add the first one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}