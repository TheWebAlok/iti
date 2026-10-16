import { useEffect, useRef, useState } from 'react';
import { Trash2, Upload } from 'lucide-react';
import { btnDanger, btnPrimary, card, input, label } from '../../components/admin/ui';

// Same categories as the public Gallery page (folder names in src/assets/gallery).
const CATEGORIES = ['Campus', 'Workshops', 'Training', 'Events', 'Placement'];
const MAX_MB = 5;

// Phase 4: upload to Cloudinary and save the returned URL.
// For now photos only live in this browser tab (they disappear on refresh).
export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [filter, setFilter] = useState('All');
  const [error, setError] = useState('');
  const urlsRef = useRef([]);
  const fileRef = useRef(null);

  // Free the temporary preview URLs when leaving the page.
  useEffect(() => () => urlsRef.current.forEach((u) => URL.revokeObjectURL(u)), []);

  const onPick = (e) => {
    const files = Array.from(e.target.files || []);
    const bad = files.filter((f) => !f.type.startsWith('image/') || f.size > MAX_MB * 1024 * 1024);
    const good = files.filter((f) => !bad.includes(f));

    setError(bad.length ? `${bad.length} file(s) skipped. Use images under ${MAX_MB} MB.` : '');
    const added = good.map((f) => {
      const url = URL.createObjectURL(f);
      urlsRef.current.push(url);
      return { id: crypto.randomUUID(), name: f.name, category, url };
    });
    setPhotos((list) => [...added, ...list]);
    if (fileRef.current) fileRef.current.value = '';
  };

  const remove = (p) => {
    URL.revokeObjectURL(p.url);
    urlsRef.current = urlsRef.current.filter((u) => u !== p.url);
    setPhotos((list) => list.filter((x) => x.id !== p.id));
  };

  const shown = photos.filter((p) => filter === 'All' || p.category === filter);

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Upload photos</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-white/70">
        Preview only - photos are not saved to the website yet (Phase 4).
      </p>

      <div className={`${card} mt-6`}>
        <div className="flex flex-wrap items-end gap-4">
          <label className={`${label} w-48`}>
            Category
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${input} mt-1`}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className={`${btnPrimary} cursor-pointer`}>
            <Upload size={16} aria-hidden="true" />
            Choose photos
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={onPick} className="sr-only" />
          </label>
        </div>
        {error && (
          <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-300">
            {error}
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter photos">
        {['All', ...CATEGORIES].map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={filter === c}
            onClick={() => setFilter(c)}
            className={`chip !px-3 !py-1 text-xs ${
              filter === c
                ? 'border-royal-600 bg-royal-600 text-white'
                : 'border-slate-300 bg-white text-navy-900 dark:border-white/20 dark:bg-navy-900 dark:text-white'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">No photos yet. Pick a category and choose photos above.</p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {shown.map((p) => (
            <li key={p.id} className={`${card} !p-2`}>
              <img src={p.url} alt={p.name} className="aspect-[4/3] w-full rounded-lg object-cover" />
              <div className="mt-2 flex items-center justify-between gap-2 px-1">
                <span className="truncate text-xs text-slate-600 dark:text-white/70">
                  {p.category} - {p.name}
                </span>
                <button type="button" onClick={() => remove(p)} className={btnDanger} aria-label={`Remove ${p.name}`}>
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}