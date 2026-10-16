import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Clock, GraduationCap, ArrowRight } from 'lucide-react';
import { TradeIcon } from './tradeIcons';

export default function TradeCard({ trade }) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      layout={!reduce}
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="card group flex h-full flex-col overflow-hidden"
    >
      <div className="blueprint relative flex h-28 items-center justify-center bg-navy-900">
        <div className="rounded-2xl bg-white/10 p-4 text-amber-400 ring-1 ring-white/15 transition-colors group-hover:bg-amber-500 group-hover:text-navy-950">
          <TradeIcon name={trade.icon} size={32} />
        </div>
        <span className="chip absolute right-3 top-3 border-white/25 bg-white/10 text-white">{trade.category}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-snug">{trade.name}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">{trade.description}</p>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2"><Clock size={15} className="text-royal-600" aria-hidden="true" /><dt className="sr-only">Duration</dt><dd>{trade.duration}</dd></div>
          <div className="flex items-center gap-2"><GraduationCap size={15} className="text-royal-600" aria-hidden="true" /><dt className="sr-only">Entry qualification</dt><dd>{trade.entryQualification}</dd></div>
        </dl>
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm dark:border-white/10">
          <span className="text-slate-500">{trade.seats ? `${trade.seats} seats` : 'Seats: ask office'}</span>
          <Link to={`/trades/${trade.slug}`} className="inline-flex items-center gap-1 font-semibold text-royal-600 hover:underline dark:text-royal-400">
            View details <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
