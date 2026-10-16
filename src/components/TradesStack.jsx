import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Clock, GraduationCap, TrendingUp } from 'lucide-react';
import ScrollStack, { ScrollStackItem } from './ScrollStack';

function TradeCard({ t }) {
  // Try the trade photo first, then a generic photo, then the icon.
  const sources = [t.image, `https://picsum.photos/seed/${t.slug}/800/600`].filter(Boolean);
  const [srcIndex, setSrcIndex] = useState(0);
  const broken = srcIndex >= sources.length;
  const Icon = t.Icon || GraduationCap;
  const fee = t.feePaise ? `₹${(t.feePaise / 100).toLocaleString('en-IN')}` : null;

  return (
    <div className="flex h-full flex-col md:flex-row">
      {/* Image side */}
      <div className="relative h-56 shrink-0 overflow-hidden bg-slate-200 dark:bg-navy-900 md:h-full md:w-[46%]">
        {!broken ? (
          <img
            key={sources[srcIndex]}
            src={sources[srcIndex]}
            alt={t.name}
            referrerPolicy="no-referrer"
            onError={() => setSrcIndex((i) => i + 1)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400 dark:text-white/30">
            <Icon size={96} strokeWidth={1.25} aria-hidden="true" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold capitalize text-white backdrop-blur">
          {t.category}
        </span>
      </div>

      {/* Details side */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-amber-500/15 text-amber-500">
            <Icon size={24} aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-2xl font-extrabold leading-tight sm:text-3xl">{t.name}</h3>
            <p className="mt-1 text-sm capitalize text-slate-500 dark:text-slate-300">{t.category}</p>
          </div>
        </div>

        <p className="text-base text-slate-700 dark:text-slate-200">{t.description}</p>

        {t.features?.length > 0 && (
          <ul className="space-y-2">
            {t.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
                <Check size={16} className="mt-0.5 shrink-0 text-amber-500" aria-hidden="true" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        )}

        {t.future && (
          <p className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
            <TrendingUp size={16} className="mt-0.5 shrink-0 text-amber-500" aria-hidden="true" />
            <span>{t.future}</span>
          </p>
        )}

        <div className="mt-auto">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium">
            <span className="inline-flex items-center gap-2">
              <Clock size={16} className="text-amber-500" aria-hidden="true" /> {t.durationLabel}
            </span>
            <span className="inline-flex items-center gap-2">
              <GraduationCap size={16} className="text-amber-500" aria-hidden="true" /> {t.entry}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-200 pt-4 dark:border-white/10">
            <p className="text-sm text-slate-500 dark:text-slate-300">
              {t.seats ? `Seats: ${t.seats}` : 'Seats: ask office'}
              {fee ? ` · Fee: ${fee}` : ''}
            </p>
            <Link
              to={`/admissions?trade=${encodeURIComponent(t.slug)}`}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-navy-900 transition hover:bg-amber-400"
            >
              Apply <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TradesStack({ trades }) {
  // With many cards a fixed offset pushes the pinned pile off the screen.
  // Keep the whole pile within ~40px, whatever the number of cards.
  const n = trades.length;
  const stackDistance = n > 1 ? Math.max(0, Math.min(14, Math.floor(40 / (n - 1)))) : 0;

  return (
    <ScrollStack
      key={n}
      useWindowScroll
      stackPosition="96px"
      itemStackDistance={stackDistance}
      itemDistance={80}
      baseScale={0.94}
      itemScale={0.02}
      dimAmount={0.06}
      holdDistance={100}
    >
      {trades.map((t) => (
        <ScrollStackItem key={t.slug} itemClassName="trade-card">
          <TradeCard t={t} />
        </ScrollStackItem>
      ))}
    </ScrollStack>
  );
}