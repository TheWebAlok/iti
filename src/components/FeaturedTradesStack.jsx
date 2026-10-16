import { Link } from 'react-router-dom';
import { ArrowRight, Clock, GraduationCap } from 'lucide-react';
import ScrollStack, { ScrollStackItem } from './ScrollStack';

// Each trade: { slug, name, description, entry, durationLabel, Icon }
export default function FeaturedTradesStack({ trades }) {
  if (!trades?.length) return null;

  return (
    <section className="section pb-0 pt-12" aria-labelledby="popular-trades">
      <div className="container-x">
        <h2 id="popular-trades" className="text-2xl font-bold">
          Popular trades
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Scroll down to go through them one by one.</p>
      </div>

      <div className="mx-auto mt-6 max-w-4xl">
        <ScrollStack
          useWindowScroll
          smoothScroll={false}
          stackPosition="20%"
          itemDistance={80}
          itemStackDistance={24}
          baseScale={0.9}
          itemScale={0.03}
          holdDistance={120}
        >
          {trades.map((t) => (
            <ScrollStackItem key={t.slug} itemClassName="!h-auto !bg-navy-900 !p-6 !text-white sm:!p-10">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/10 text-amber-400 ring-1 ring-white/15">
                  <t.Icon size={28} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-bold !text-white sm:text-2xl">{t.name}</h3>
                  <p className="mt-2 text-slate-300">{t.description}</p>
                  <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-200">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-amber-400" aria-hidden="true" />
                      <dt className="sr-only">Duration</dt>
                      <dd>{t.durationLabel}</dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <GraduationCap size={14} className="text-amber-400" aria-hidden="true" />
                      <dt className="sr-only">Entry qualification</dt>
                      <dd>{t.entry}</dd>
                    </div>
                  </dl>
                  <Link to={`/admissions?trade=${t.slug}`} className="btn-accent mt-6 inline-flex">
                    Apply <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </section>
  );
}