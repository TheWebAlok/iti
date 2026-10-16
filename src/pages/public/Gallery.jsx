import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Images, X } from 'lucide-react';
import Seo from '../../components/Seo';
import PageHeader from '../../components/PageHeader';
import ChromaGrid from '../../components/ChromaGrid'; // <- apne path ke hisaab se badlo

/* ------------------------------------------------------------------ */
/* PHOTOS (priority order)                                             */
/* 1. Local: src/assets/gallery/<Category>/photo.jpg                   */
/* 2. EXTRA: your own links/paths                                      */
/* 3. ONLINE: Wikimedia Commons se auto-fetch (no API key needed)      */
/* ------------------------------------------------------------------ */
const EXTRA = [
  // { category: 'Workshops', title: 'Welding practice', src: 'https://your-image-link.jpg' },
];

// Category -> ChromaGrid accent (spotlight glow + border color)
const ACCENTS = {
  Workshops: '#ff8a4c',
  Campus: '#7cc4ff',
  Events: '#ff7eb6',
  Training: '#ffd23f',
  Placement: '#a98bff',
};

// Jab tak photo load nahi hoti (ya fail hoti hai) tab ka neutral placeholder
const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='600' height='400' fill='#27242f'/></svg>"
  );

// query = Wikimedia search text, pick = kaun si photo (0 = pehli, 1 = doosri...)
const ONLINE = [
  { category: 'Workshops', title: 'Fitter workshop', query: 'machine shop workshop tools', pick: 0 },
  { category: 'Workshops', title: 'Safety training', query: 'industrial safety helmet workers', pick: 0 },
  { category: 'Campus', title: 'Institute building', query: 'college campus building', pick: 0 },
  { category: 'Campus', title: 'Classroom session', query: 'classroom students India', pick: 0 },
  { category: 'Events', title: 'Annual day', query: 'school annual day stage performance', pick: 0 },
  { category: 'Events', title: 'Certificate ceremony', query: 'graduation ceremony certificate', pick: 0 },
  { category: 'Training', title: 'Welding bay', query: 'welding worker', pick: 0 },
  { category: 'Training', title: 'Electrical lab', query: 'electrician wiring', pick: 0 },
  { category: 'Training', title: 'Machine shop', query: 'lathe machine operator', pick: 0 },
  { category: 'Placement', title: 'Placement drive', query: 'job interview', pick: 0 },
  { category: 'Placement', title: 'Industry visit', query: 'factory industrial plant', pick: 0 },
];

const files = import.meta.glob('../../assets/gallery/*/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const toTitle = (f) =>
  f.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const fromFolders = Object.entries(files).map(([path, src]) => {
  const [, category, file] = path.match(/gallery\/([^/]+)\/([^/]+)$/);
  return { category, title: toTitle(file), src };
});

const stripHtml = (s = '') => s.replace(/<[^>]*>/g, '').trim();

/* Wikimedia Commons search (CORS allowed, key ki zarurat nahi). sessionStorage me cache. */
async function fetchCommons(query) {
  const cacheKey = `commons:${query}`;
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch { /* ignore */ }

  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    generator: 'search',
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: '6',
    gsrlimit: '12',
    prop: 'imageinfo',
    iiprop: 'url|mime|extmetadata',
    iiurlwidth: '1200',
  });

  const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`);
  if (!res.ok) throw new Error(`Commons ${res.status}`);
  const data = await res.json();

  const pages = Object.values(data?.query?.pages || {}).sort((a, b) => a.index - b.index);
  const photos = pages
    .map((p) => p.imageinfo?.[0])
    .filter((i) => i && /^image\/(jpeg|png)$/.test(i.mime) && i.thumburl)
    .map((i) => ({
      src: i.thumburl,
      credit: [
        stripHtml(i.extmetadata?.Artist?.value),
        i.extmetadata?.LicenseShortName?.value,
      ]
        .filter(Boolean)
        .join(' · '),
    }));

  try {
    sessionStorage.setItem(cacheKey, JSON.stringify(photos));
  } catch { /* ignore */ }
  return photos;
}

function useOnlineItems(enabled) {
  const [items, setItems] = useState(() =>
    ONLINE.map((o) => ({ category: o.category, title: o.title, src: '', credit: '' }))
  );

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    (async () => {
      const queries = [...new Set(ONLINE.map((o) => o.query))];
      const results = {};
      await Promise.all(
        queries.map(async (q) => {
          try {
            results[q] = await fetchCommons(q);
          } catch (e) {
            console.warn('Commons failed for', q, e);
            results[q] = [];
          }
        })
      );
      if (cancelled) return;
      setItems(
        ONLINE.map((o) => {
          const list = results[o.query] || [];
          const photo = list[o.pick] || list[0];
          return {
            category: o.category,
            title: o.title,
            src: photo?.src || '',
            credit: photo?.credit || '',
          };
        })
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return items;
}

/* ------------------------------------------------------------------ */

function Lightbox({ item, onClose }) {
  const closeRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-950/90 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close preview"
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
      >
        <X size={22} />
      </button>

      <motion.figure
        initial={{ scale: 0.96 }}
        animate={{ scale: 1 }}
        className="max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {item.src && !failed ? (
          <img
            src={item.src}
            alt={item.title}
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className="max-h-[75vh] rounded-xl"
          />
        ) : (
          <div className="blueprint flex aspect-video w-[min(90vw,48rem)] items-center justify-center rounded-xl bg-navy-800 text-white/40">
            <Images size={56} aria-hidden="true" />
          </div>
        )}
        <figcaption className="mt-3 text-center text-sm text-white">
          {item.title} - {item.category}
          {item.credit && (
            <span className="mt-1 block text-xs text-white/60">Photo: {item.credit} (Wikimedia Commons)</span>
          )}
        </figcaption>
      </motion.figure>
    </motion.div>
  );
}

export default function Gallery() {
  const [category, setCategory] = useState('All');
  const [active, setActive] = useState(null);

  const ownPhotos = useMemo(() => [...fromFolders, ...EXTRA], []);
  const online = useOnlineItems(ownPhotos.length === 0);

  const galleryItems = useMemo(() => {
    const source = ownPhotos.length ? ownPhotos : online;
    return source.map((g, i) => ({ id: i + 1, ...g }));
  }, [ownPhotos, online]);

  const galleryCategories = useMemo(
    () => [...new Set(galleryItems.map((g) => g.category))],
    [galleryItems]
  );

  const items = galleryItems.filter((g) => category === 'All' || g.category === category);

  // Gallery items -> ChromaGrid items (click par lightbox khulta hai)
  const chromaItems = useMemo(
    () =>
      items.map((g) => ({
        image: g.src || PLACEHOLDER,
        title: g.title,
        subtitle: g.category,
        accent: ACCENTS[g.category] ?? '#ffffff',
        onClick: () => setActive(g),
      })),
    [items]
  );

  return (
    <>
      <Seo
        title="Gallery"
        description="Photographs of workshops, campus, events, practical training and placement drives."
      />
      <PageHeader
        title="Gallery"
        text="Workshops, campus life, events and placement drives."
        crumbs={[{ label: 'Gallery' }]}
      />
      <section className="section pt-10">
        <div className="container-x">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter gallery">
            {['All', ...galleryCategories].map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
                className={`chip !px-4 !py-2 text-sm ${
                  category === c
                    ? 'border-royal-600 bg-royal-600 text-white'
                    : 'border-slate-300 bg-white text-navy-900 dark:border-white/20 dark:bg-navy-900 dark:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <ChromaGrid
              key={category}
              items={chromaItems}
              columns={3}
              minCardWidth={160}
              aspectRatio="4 / 3"
              radius={260}
              frame
              theme="dark"
            />
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Images are for illustration (via Wikimedia Commons). Admin-managed uploads will replace them in Phase 4.
          </p>
        </div>
      </section>

      <AnimatePresence>
        {active && <Lightbox item={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </>
  );
}