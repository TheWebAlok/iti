import { Download, Eye, Target, FlaskConical, Hammer, Cpu, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Seo from '../../components/Seo';
import PageHeader from '../../components/PageHeader';
import SectionHeading from '../../components/SectionHeading';
import DemoBadge from '../../components/DemoBadge';
import MagicBento from '../../components/MagicBento';
import useSiteTheme from '../../hooks/useSiteTheme';
import { institute } from '../../config/institute';

const labs = [
  { icon: Hammer, title: 'Mechanical workshops', text: 'Fitting, welding, turning and machining bays.' },
  { icon: Cpu, title: 'Electrical and electronics labs', text: 'Wiring boards, test benches and instruments.' },
  { icon: FlaskConical, title: 'Computer and science labs', text: 'Computer systems and basic laboratory equipment.' },
];

/** React Bits style "FadeContent": fades and lifts the block in when it scrolls into view. */
function Reveal({ children, delay = 0 }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const ink = { color: 'var(--mb-ink)' };
const muted = { color: 'var(--mb-muted)' };

export default function About() {
  const a = institute.affiliation;
  const theme = useSiteTheme();

  const intro = [
    {
      id: 'who',
      colSpan: 2,
      rowSpan: 2,
      content: (
        <div className="flex h-full flex-col justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold" style={ink}>Who we are</h2>
            <p className="mt-3 text-sm leading-relaxed" style={muted}>
              Write the institute's story here: when it was established, who runs it, which communities it serves and what it is proud of. Keep it factual - this text appears on the public site.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {institute.prospectusUrl ? (
              <a className="btn-primary" href={institute.prospectusUrl} download>
                <Download size={16} aria-hidden="true" /> Download prospectus
              </a>
            ) : (
              <button className="btn-outline" disabled title="Upload the prospectus PDF and set its link in the config">
                <Download size={16} aria-hidden="true" /> Prospectus coming soon
              </button>
            )}
            <Link to="/gallery" className="btn-outline">View gallery</Link>
          </div>
        </div>
      ),
    },
    {
      id: 'vision',
      colSpan: 2,
      icon: <Eye size={16} aria-hidden="true" />,
      label: 'Vision',
      title: 'Skilled, safety-conscious technicians',
      description: 'To be the first choice for skilled, safety-conscious technicians in our region.',
    },
    {
      id: 'mission',
      colSpan: 2,
      icon: <Target size={16} aria-hidden="true" />,
      label: 'Mission',
      title: 'Skill, employability, a clear path',
      description: 'To give every trainee workshop skill, employability and a clear path to work or apprenticeship.',
    },
  ];

  const infra = labs.map((l) => ({
    id: l.title,
    icon: <l.icon size={16} aria-hidden="true" />,
    label: 'Facility',
    visual: <l.icon size={56} strokeWidth={1.25} style={{ margin: '0 auto', color: 'var(--mb-faint)' }} />,
    title: l.title,
    description: l.text,
  }));

  const faculty = [
    {
      id: 'faculty',
      content: (
        <div className="flex h-full items-center gap-4">
          <Users size={28} aria-hidden="true" style={{ color: '#F59E0B', flex: 'none' }} />
          <p className="text-sm" style={ink}>
            Add the number of instructors, their trade qualifications and experience once confirmed. Do not publish unverified claims.
          </p>
        </div>
      ),
    },
  ];

  const bentoProps = {
    theme,
    glowColor: '#F59E0B',
    gap: 12,
    radius: 20,
    enableBorderGlow: true,
    enableSpotlight: true,
    spotlightRadius: 300,
    clickEffect: true,
    textAutoHide: false,
    intro: true,
    className: '[&_.magic-bento__card]:select-text', // taaki text select/copy ho sake
  };

  return (
    <>
      <Seo title="About Us" description="Learn about the institute, its vision, mission, faculty, infrastructure and affiliation." />
      <PageHeader title="About the institute" text="Technical training built around workshops, safety and employability." crumbs={[{ label: 'About' }]} />

      <section className="section pt-12">
        <div className="container-x">
          <Reveal>
            <MagicBento {...bentoProps} items={intro} columns={4} rowHeight={190} />
          </Reveal>
        </div>
      </section>

      <section className="section bg-white pt-16 dark:bg-navy-900/60">
        <div className="container-x grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <Reveal>
            <figure className="blueprint flex aspect-[4/5] items-end rounded-2xl bg-navy-800 p-5 text-white">
              <figcaption>
                <span className="block text-lg font-bold">Principal name</span>
                <span className="text-sm text-slate-300">Principal</span>
              </figcaption>
            </figure>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <SectionHeading title="Principal's message" />
                <DemoBadge>Placeholder</DemoBadge>
              </div>
              <p className="mt-4 leading-relaxed">
                Replace this with the principal's own message to applicants and parents. A short, honest note about the institute's approach to training, discipline and placement carries more weight than general praise.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="faculty">
        <div className="container-x">
          <div id="faculty">
            <SectionHeading title="Faculty overview" text="Trade instructors and staff. Individual profiles are managed from the admin panel in Phase 5." />
          </div>
          <div className="mt-8">
            <Reveal>
              <MagicBento {...bentoProps} items={faculty} columns={1} rowHeight={110} />
            </Reveal>
          </div>
        </div>
      </section>

      <section id="infrastructure" className="section bg-white pt-16 dark:bg-navy-900/60" aria-labelledby="infra">
        <div className="container-x">
          <div id="infra">
            <SectionHeading title="Infrastructure and laboratories" text="List only the facilities the institute actually has." />
          </div>
          <div className="mt-8">
            <Reveal>
              <MagicBento {...bentoProps} items={infra} columns={3} rowHeight={220} />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="affil">
        <div className="container-x">
          <div id="affil"><SectionHeading title="Affiliation and recognition" /></div>
          <Reveal>
            {a.verified ? (
              <dl className="card mt-6 grid gap-6 p-6 sm:grid-cols-3">
                {a.items.map((i) => (
                  <div key={i.label}>
                    <dt className="text-xs text-slate-500">{i.label}</dt>
                    <dd className="font-bold text-navy-900 dark:text-white">{i.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                Affiliation details will appear here once verified by the office. <DemoBadge>Not verified</DemoBadge>
              </p>
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}