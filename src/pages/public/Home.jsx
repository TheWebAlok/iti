import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight, BadgeCheck, Briefcase, ClipboardCheck, FileUp, HardHat, Hammer, Receipt, ShieldCheck,
  UserCheck, UserPlus, Wallet, Wrench, Images, Quote, Cog,
} from 'lucide-react';
import Seo from '../../components/Seo';
import Reveal from '../../components/Reveal';
import SectionHeading from '../../components/SectionHeading';
import AnimatedCounter from '../../components/AnimatedCounter';
import TradeCard from '../../components/TradeCard';
import Faq from '../../components/Faq';
import DemoBadge from '../../components/DemoBadge';
import ContactForm from '../../components/forms/ContactForm';
import TechText from '../../components/TechText'; // <- react-bits files ka path apne hisaab se badlo
import MaskedHeading from '../../components/MaskedHeading';
import ParticleText from '../../components/ParticleText';
import { institute, isDemo } from '../../config/institute';
import { publishedTrades } from '../../data/trades';
import { galleryItems } from '../../data/gallery';

/* MaskedHeading ke andar dikhne wali image. Apni photo/video lagani ho to
   isko '/images/trades-heading.jpg' jaisa path de do. */
const HEADING_TEXTURE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='400'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#1D4ED8'/><stop offset='.55' stop-color='#3B82F6'/><stop offset='1' stop-color='#F59E0B'/></linearGradient></defs><rect width='1200' height='400' fill='url(#g)'/></svg>"
  );

function GearDrawing() {
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[400px] lg:ml-auto lg:mr-0" aria-hidden="true">
      <svg viewBox="0 0 400 400" className="h-full w-full">
        {/* dimension / centre lines */}
        <g stroke="rgba(255,255,255,.28)" strokeWidth="1" strokeDasharray="6 6">
          <line x1="0" y1="200" x2="400" y2="200" />
          <line x1="200" y1="0" x2="200" y2="400" />
        </g>
        <g stroke="rgba(255,255,255,.5)" strokeWidth="1" fill="none">
          <line x1="50" y1="372" x2="350" y2="372" />
          <path d="M50 366v12M350 366v12" />
        </g>
        <motion.g style={{ transformOrigin: '200px 200px' }} animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}>
          <circle cx="200" cy="200" r="150" fill="none" stroke="#F59E0B" strokeWidth="24" strokeDasharray="14.7 10.1" />
          <circle cx="200" cy="200" r="136" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.35)" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="104" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="1" strokeDasharray="3 5" />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <circle key={a} cx={200 + 70 * Math.cos((a * Math.PI) / 180)} cy={200 + 70 * Math.sin((a * Math.PI) / 180)} r="12" fill="#0B1F3A" stroke="rgba(255,255,255,.45)" strokeWidth="1.5" />
          ))}
        </motion.g>
        <circle cx="200" cy="200" r="26" fill="#0B1F3A" stroke="#fff" strokeWidth="2" />
        <circle cx="200" cy="200" r="8" fill="#F59E0B" />
      </svg>
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded bg-navy-900 px-2 text-xs text-slate-300">Theory + Workshop + Industry</span>
    </div>
  );
}

function Hero() {
  const reduce = useReducedMotion();
  const lineHeights = 'h-[56px] sm:h-[76px] lg:h-[92px]';
  const techProps = {
    fontWeight: 800,
    fontSize: 72,
    letterSpacing: -0.04,
    reveal: 'letter',
    dashLength: 4,
    dashGap: 2,
    specks: 15,
    color: '#ffffff',
    accentColor: '#F59E0B',
    reach: 160,
    softness: 0.7,
    strokeWidth: 1.5,
    speed: 1,
    lineStyle: 'dashed',
    selection: true,
    labels: true,
    draggable: true,
    sweep: true,
  };
  return (
    <section className="blueprint relative overflow-hidden bg-navy-900 pb-20 pt-32 text-white sm:pb-28 sm:pt-40" aria-labelledby="hero-title">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1.15fr_.85fr]">
        <div>
          {/* Screen readers ke liye asli h1; visible headline TechText canvas hai */}
          <h1 id="hero-title" className="sr-only">Build Your Skills. Shape Your Future.</h1>
          <div aria-hidden="true" className="space-y-1">
            <div className={lineHeights} style={{ position: 'relative' }}>
              <TechText text="Build Your Skills." {...techProps} />
            </div>
            <div className={lineHeights} style={{ position: 'relative' }}>
              <TechText text="Shape Your Future." {...techProps} />
            </div>
          </div>
          <motion.p className="mt-8 max-w-xl text-lg leading-relaxed text-slate-300" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            Hands-on technical and vocational education in the trades industry hires for. Train in real workshops, earn a recognised certificate and step into work or apprenticeship.
          </motion.p>
          <motion.div className="mt-8 flex flex-wrap gap-3" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
            <Link to="/admissions" className="btn-accent">Apply for Admission <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link to="/trades" className="btn-light">Explore Trades</Link>
            <Link to="/contact" className="btn-light">Contact Us</Link>
          </motion.div>
        </div>
        <GearDrawing />
      </div>
    </section>
  );
}

function Affiliation() {
  const a = institute.affiliation;
  return (
    <section aria-labelledby="aff-title" className="border-b border-slate-200 bg-white dark:border-white/10 dark:bg-navy-900">
      <div className="container-x flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between">
        <h2 id="aff-title" className="flex items-center gap-2 text-base font-bold"><BadgeCheck className="text-royal-600" size={20} aria-hidden="true" />Affiliation and recognition</h2>
        {a.verified ? (
          <dl className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
            {a.items.map((i) => <div key={i.label}><dt className="text-slate-500">{i.label}</dt><dd className="font-semibold text-navy-900 dark:text-white">{i.value}</dd></div>)}
          </dl>
        ) : (
          <p className="text-sm text-slate-600 dark:text-slate-400">Affiliation details will be shown here once the institute office verifies them. <DemoBadge>Not verified</DemoBadge></p>
        )}
      </div>
    </section>
  );
}

function Stats() {
  const stats = institute.stats.map((s) => (s.key === 'trades' ? { ...s, value: publishedTrades.length } : s));
  return (
    <section className="section pb-0" aria-label="Institute statistics">
      <div className="container-x">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 dark:border-white/10 dark:bg-white/10 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.key} className="bg-white p-6 dark:bg-navy-900">
              <p className="text-4xl font-extrabold text-navy-900 dark:text-white"><AnimatedCounter value={s.value} suffix={s.suffix} />{s.key !== 'trades' && s.key !== 'placement' ? '+' : ''}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
        {isDemo && <p className="mt-3 text-xs text-slate-500"><DemoBadge>Demo figures</DemoBadge> Replace with verified numbers in <code>src/config/institute.js</code>. Live figures will come from the database in Phase 4.</p>}
      </div>
    </section>
  );
}

function PopularTrades() {
  const popular = publishedTrades.filter((t) => t.popular);
  return (
    <section className="section" aria-labelledby="pop-title">
      <div className="container-x">
        <MaskedHeading
          id="pop-title"
          tag="h2"
          text="Popular ITI trades"
          src={HEADING_TEXTURE}
          align="left"
          weight={800}
          textScale={0.08}
          reveal="rise"
          trigger="view"
          parallax={26}
          drift={18}
        />
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <p className="max-w-xl text-slate-600 dark:text-slate-400">Choose a trade that matches your interest. Duration and entry qualification are shown on every card.</p>
          <Link to="/trades" className="btn-outline">View all trades <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((t, i) => <Reveal key={t.slug} delay={i * 0.05} className="h-full"><TradeCard trade={t} /></Reveal>)}
        </div>
      </div>
    </section>
  );
}

const reasons = [
  { icon: Wrench, title: 'Practical first', text: 'Most training time is spent in workshops and labs on real tools and equipment.' },
  { icon: HardHat, title: 'Safety-first workshops', text: 'Trainees learn safe practice and protective equipment use from day one.' },
  { icon: Briefcase, title: 'Placement and apprenticeship support', text: 'Drives, counselling and apprenticeship guidance, with outcomes recorded honestly.' },
  { icon: ShieldCheck, title: 'Transparent records', text: 'Fees, receipts and attendance are digital, so every rupee and every day is traceable.' },
  { icon: UserCheck, title: 'Instructor-led training', text: 'Trade instructors guide each batch through theory, practical and assessment.' },
  { icon: Cog, title: 'Industry-aligned syllabus', text: 'Training follows the trade syllabus and is paired with employability skills.' },
];

function WhyChoose() {
  return (
    <section className="section bg-white dark:bg-navy-900/60" aria-labelledby="why-title">
      <div className="container-x">
        <div id="why-title"><SectionHeading title="Why train with us" text="Edit these points to match what the institute can stand behind." /></div>
        <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.04}>
              <r.icon className="text-royal-600 dark:text-royal-400" size={26} aria-hidden="true" />
              <h3 className="mt-3 text-lg font-bold">{r.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{r.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Workshops() {
  const items = ['Welding and fabrication bay', 'Electrical and electronics labs', 'Machine shop with lathes and milling machines', 'Automobile and diesel workshop', 'Computer and IT lab', 'Refrigeration and air-conditioning lab'];
  return (
    <section className="blueprint bg-navy-900 py-16 text-white sm:py-24" aria-labelledby="ws-title">
      <div className="container-x grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 id="ws-title" className="text-3xl font-extrabold !text-white sm:text-4xl">Learn on the shop floor</h2>
          <p className="mt-4 max-w-lg text-slate-300">Theory classes explain the why. Workshop hours build the skill. List the labs and equipment your institute actually has here.</p>
          <Link to="/about#infrastructure" className="btn-accent mt-6">See facilities <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((it) => (
            <li key={it} className="flex items-start gap-3 rounded-xl border border-white/15 bg-white/5 p-4 text-sm"><Hammer size={18} className="mt-0.5 shrink-0 text-amber-400" aria-hidden="true" />{it}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const steps = [
  { icon: UserPlus, title: 'Apply online', text: 'Fill the application and choose your trade preferences.' },
  { icon: FileUp, title: 'Upload documents', text: 'Photograph, marksheet and identity proof.' },
  { icon: ClipboardCheck, title: 'Application review', text: 'The office verifies details. You may be asked to correct documents.' },
  { icon: BadgeCheck, title: 'Admission approved', text: 'You receive an enrollment number and batch details.' },
  { icon: Wallet, title: 'Pay fees and join', text: 'Pay the first instalment and download your receipt.' },
];

function Process() {
  return (
    <section className="section" aria-labelledby="proc-title">
      <div className="container-x">
        <div id="proc-title"><SectionHeading title="How admission works" text="Five steps from application to your first day." /></div>
        <div className="mt-12 grid gap-8 md:grid-cols-5">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <div className="relative">
                <div className="flex items-center gap-3 md:block">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-royal-600 text-white"><s.icon size={22} aria-hidden="true" /></span>
                  <span className="text-xs font-bold text-slate-500 md:mt-3 md:block">Step {i + 1}</span>
                </div>
                <h3 className="mt-2 text-base font-bold">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10"><Link to="/admissions" className="btn-primary">Start your application <ArrowRight size={16} aria-hidden="true" /></Link></div>
      </div>
    </section>
  );
}

function Partners() {
  return (
    <section className="section bg-white pt-16 dark:bg-navy-900/60" aria-labelledby="partners-title">
      <div className="container-x">
        <h2 id="partners-title" className="sr-only">Placement partners</h2>
        {/* Dark panel taaki white particles light aur dark dono theme me dikhein */}
        <div aria-hidden="true" className="blueprint h-[240px] overflow-hidden rounded-2xl bg-navy-900 sm:h-[280px]">
          <ParticleText
            text="Placement partners"
            color="#ffffff"
            highlightColor="#F59E0B"
            fontWeight={800}
            fontSize="clamp(2rem, 8vw, 5rem)"
            particleSize={2}
            density={4}
            scatter={180}
            gatherDuration={1600}
            trigger="mount"
            style={{ touchAction: 'pan-y' }}
          />
        </div>
        <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-400">Recruiters and apprenticeship providers who work with the institute.</p>
        <div className="mt-6 flex flex-col items-start gap-4 rounded-2xl border border-dashed border-slate-300 p-8 dark:border-white/20 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4"><Briefcase size={28} className="text-slate-400" aria-hidden="true" /><p className="max-w-lg text-sm text-slate-600 dark:text-slate-400">Company logos appear here only after the employer authorises their use. Add them from the admin panel in a later phase.</p></div>
          <Link to="/placement" className="btn-outline shrink-0">Placement overview</Link>
        </div>
      </div>
    </section>
  );
}

const quotes = [
  { name: 'Sample trainee, Electrician', text: 'The workshop hours made the theory click. I could wire a full panel before the course ended.' },
  { name: 'Sample trainee, COPA', text: 'The instructors were patient and the lab was always available for practice.' },
  { name: 'Sample trainee, Fitter', text: 'The placement drive gave me my first interview. I learned how to present my trade skills.' },
];

function Testimonials() {
  return (
    <section className="section" aria-labelledby="testi-title">
      <div className="container-x">
        <div className="flex flex-wrap items-center gap-3"><div id="testi-title"><SectionHeading title="What trainees say" /></div><DemoBadge>Sample content - replace with real, consented testimonials</DemoBadge></div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {quotes.map((q) => (
            <figure key={q.name} className="card p-6">
              <Quote size={22} className="text-amber-500" aria-hidden="true" />
              <blockquote className="mt-3 text-sm leading-relaxed">{q.text}</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-navy-900 dark:text-white">{q.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryPreview() {
  return (
    <section className="section bg-white pt-16 dark:bg-navy-900/60" aria-labelledby="gal-title">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div id="gal-title"><SectionHeading title="Life at the institute" /></div>
          <Link to="/gallery" className="btn-outline">Open gallery <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
          {galleryItems.slice(0, 6).map((g, i) => (
            <div key={g.id} className={`blueprint relative flex items-end overflow-hidden rounded-xl bg-navy-800 p-4 ${i === 0 ? 'row-span-2 min-h-[260px]' : 'min-h-[124px]'}`}>
              {g.src ? <img src={g.src} alt={g.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" /> : <Images className="absolute right-3 top-3 text-white/25" size={22} aria-hidden="true" />}
              <span className="relative text-sm font-semibold text-white">{g.title}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">Placeholder tiles. Upload real workshop and campus photographs to replace them.</p>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Seo description="Apply for ITI trades, explore courses, check notices and placement support at our Industrial Training Institute." />
      <Hero />
      <Affiliation />
      <Stats />
      <PopularTrades />
      <WhyChoose />
      <Workshops />
      <Process />
      <Partners />
      <Testimonials />
      <GalleryPreview />
      <section className="section" aria-labelledby="faq-title">
        <div className="container-x grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div id="faq-title"><SectionHeading title="Questions applicants ask" text="Cannot find your answer? Write to us and the office will reply." /></div>
          <Faq items={institute.faqs} />
        </div>
      </section>
      <section className="section bg-white pt-16 dark:bg-navy-900/60" aria-labelledby="contact-title">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div id="contact-title"><SectionHeading title="Talk to the admission office" text="Send your question and we will call you back during office hours." />
            <ul className="mt-6 space-y-1 text-sm">{institute.officeHours.map((h) => <li key={h.days}><span className="font-semibold text-navy-900 dark:text-white">{h.days}:</span> {h.time}</li>)}</ul>
            <p className="mt-6 flex items-center gap-2 text-sm"><Receipt size={16} aria-hidden="true" className="text-royal-600" /> Fee details are shared by the office or shown on each trade page once configured.</p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}