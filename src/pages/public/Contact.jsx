import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Seo from '../../components/Seo';
import PageHeader from '../../components/PageHeader';
import ContactForm from '../../components/forms/ContactForm';
import MagicBento from '../../components/MagicBento';
import useSiteTheme from '../../hooks/useSiteTheme';
import { institute } from '../../config/institute';
import { whatsappLink } from '../../utils/helpers';

const ink = { color: 'var(--mb-ink)' };
const muted = { color: 'var(--mb-muted)' };

/** Ek bento card ka andar ka layout: upar label + icon, neeche value. */
function InfoCard({ icon: Icon, label, children }) {
  return (
    <div className="flex h-full min-w-0 flex-col justify-between gap-3">
      <p className="flex items-center gap-2 text-xs font-medium" style={muted}>
        <Icon size={16} className="text-amber-500" aria-hidden="true" /> {label}
      </p>
      <div className="min-w-0 break-words text-sm font-semibold leading-relaxed" style={ink}>
        {children}
      </div>
    </div>
  );
}

export default function Contact() {
  const theme = useSiteTheme();
  const wa = whatsappLink(institute.whatsappNumber, `Hello ${institute.name}, I have a question.`);
  const phoneHref = `tel:${institute.phone.replace(/\s/g, '')}`;
  const hours = institute.officeHours || [];

  const items = [
    {
      id: 'address',
      colSpan: 2,
      content: (
        <InfoCard icon={MapPin} label="Address">
          {institute.address.join(', ')}
        </InfoCard>
      ),
    },
    {
      id: 'phone',
      content: (
        <InfoCard icon={Phone} label="Phone">
          <a className="hover:underline" href={phoneHref}>{institute.phone}</a>
        </InfoCard>
      ),
    },
    {
      id: 'email',
      content: (
        <InfoCard icon={Mail} label="Email">
          <a className="hover:underline" href={`mailto:${institute.email}`}>{institute.email}</a>
        </InfoCard>
      ),
    },
    {
      id: 'hours',
      colSpan: 2,
      rowSpan: hours.length > 2 ? 2 : 1,
      content: (
        <InfoCard icon={Clock} label="Office hours">
          <div className="space-y-1 font-normal">
            {hours.map((h) => (
              <p key={h.days}>
                <span className="font-semibold">{h.days}:</span> <span style={muted}>{h.time}</span>
              </p>
            ))}
          </div>
        </InfoCard>
      ),
    },
    ...(wa
      ? [{
          id: 'whatsapp',
          colSpan: 2,
          href: wa,
          target: '_blank',
          rel: 'noopener noreferrer',
          content: (
            <div className="flex h-full items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-500 text-white">
                <MessageCircle size={24} aria-hidden="true" />
              </span>
              <div>
                <p className="text-base font-bold" style={ink}>Chat on WhatsApp</p>
                <p className="text-sm" style={muted}>Quick answers during office hours</p>
              </div>
            </div>
          ),
        }]
      : []),
  ];

  return (
    <>
      <Seo title="Contact Us" description="Contact the ITI admission office by phone, email, WhatsApp or the enquiry form." />
      <PageHeader title="Contact us" text="Reach the office during working hours or send a message and we will call you back." crumbs={[{ label: 'Contact' }]} />
      <section className="section pt-10">
        <div className="container-x grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
          <div className="space-y-6">
            <MagicBento
              items={items}
              theme={theme}
              columns={2}
              rowHeight={140}
              gap={12}
              radius={20}
              glowColor="#F59E0B"
              enableBorderGlow
              enableSpotlight
              spotlightRadius={260}
              clickEffect
              textAutoHide={false}
              intro
              className="[&_.magic-bento__card]:select-text"
            />
            <div className="card overflow-hidden">
              {institute.mapEmbedUrl
                ? <iframe title="Institute location map" src={institute.mapEmbedUrl} className="h-72 w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                : <div className="blueprint-light flex h-60 items-center justify-center px-6 text-center text-sm text-slate-500">Add a Google Maps embed URL in <code className="mx-1">src/config/institute.js</code> to show the map.</div>}
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}