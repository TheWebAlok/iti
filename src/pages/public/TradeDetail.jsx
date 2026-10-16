import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { publishedTrades } from '../../data/trades';
import { TRADE_DETAILS, tradeImage } from '../../data/tradeDetails';

export default function TradeDetail() {
  const { slug } = useParams();
  const trade = publishedTrades.find((t) => t.slug === slug);
  const details = TRADE_DETAILS[slug];

  if (!trade) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Trade not found</h1>
        <Link to="/trades" className="mt-4 inline-block text-royal-600 hover:underline">
          Back to all trades
        </Link>
      </section>
    );
  }

  const facts = [
    ['Duration', trade.duration],
    ['Eligibility', trade.eligibility],
    ['Category', trade.category],
  ].filter(([, value]) => value);

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <Link to="/trades" className="inline-flex items-center gap-1.5 text-sm text-royal-600 hover:underline">
        <ArrowLeft size={16} aria-hidden="true" /> All trades
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-navy-900 dark:text-white">{trade.name}</h1>

      <img
        src={tradeImage(slug)}
        alt={trade.name}
        loading="lazy"
        onError={(e) => (e.currentTarget.style.display = 'none')}
        className="mt-6 h-64 w-full rounded-xl object-cover sm:h-80"
      />

      {facts.length > 0 && (
        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          {facts.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-slate-200 p-4 dark:border-white/10">
              <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
              <dd className="mt-1 font-semibold text-navy-900 dark:text-white">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {details && (
        <>
          <h2 className="mt-8 text-xl font-semibold text-navy-900 dark:text-white">What you will learn</h2>
          <ul className="mt-3 space-y-2">
            {details.features.map((f) => (
              <li key={f} className="flex gap-2 text-slate-700 dark:text-white/80">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>

          <h2 className="mt-8 text-xl font-semibold text-navy-900 dark:text-white">Future scope</h2>
          <p className="mt-2 text-slate-700 dark:text-white/80">{details.future}</p>
        </>
      )}

      <Link to="/Enquiry" className="btn-primary mt-10 inline-flex">
        Enquire about this trade
      </Link>
    </section>
  );
}