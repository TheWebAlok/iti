import { Link } from 'react-router-dom';
import { BadgeIndianRupee, Briefcase, Compass, Download, FileText, HeartHandshake, LifeBuoy, UserPlus } from 'lucide-react';
import Seo from '../../components/Seo';
import PageHeader from '../../components/PageHeader';
import ScrollExpand from '../../components/ScrollExpand';
import { institute } from '../../config/institute';

// TEMPORARY stock photo (Pexels, free to use).
// Before launch, replace with your institute's own photo, e.g. '/hero.jpg' from client/public/.
const HERO_IMAGE =
  'https://images.pexels.com/photos/12562507/pexels-photo-12562507.jpeg?auto=compress&cs=tinysrgb&w=1600';

const services = [
  { icon: UserPlus, title: 'Online admission enquiry', text: 'Ask about trades, eligibility and seats.', to: '/admissions' },
  { icon: LifeBuoy, title: 'Student support', text: 'Raise a support ticket after you log in to the student portal.', to: '/login' },
  { icon: FileText, title: 'Certificate and document requests', text: 'Request bonafide, transfer or character certificates from the portal.', to: '/login' },
  { icon: BadgeIndianRupee, title: 'Fee payment information', text: 'Fee structure and payment modes. Pay online from the student dashboard.', to: '/contact' },
  { icon: Compass, title: 'Career counselling', text: 'Choose a trade that matches your interest and local job demand.', to: '/contact' },
  { icon: HeartHandshake, title: 'Apprenticeship guidance', text: 'How to register and apply for apprenticeship after training.', to: '/placement' },
  { icon: Briefcase, title: 'Placement assistance', text: 'Drives, interview preparation and employer connections.', to: '/placement' },
];

export default function Services() {
  return (
    <>
      <Seo title="Services" description="Admission enquiry, student support, certificate requests, fee information and placement assistance." />
      <PageHeader title="Services" text="Everything an applicant or trainee may need from the office." crumbs={[{ label: 'Services' }]} />

      <ScrollExpand
        src={HERO_IMAGE}
        alt="Trainee practising welding in an ITI workshop"
        title="Learn the trade. Build the career."
        scrollHint="Scroll down to explore"
        useWindowScroll
      >
        <h2 className="text-3xl font-extrabold !text-white md:text-5xl">One office, every service</h2>
        <p className="mt-4 max-w-xl text-white/90">
          From admission enquiry to certificates and placement help, everything you need is in one place.
        </p>
        <Link to="/admissions" className="btn-accent mt-6">
          Enquire about admission
        </Link>
      </ScrollExpand>

      <section className="section pt-12">
        <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link key={s.title} to={s.to} className="card group p-6 transition-shadow hover:shadow-lg">
              <s.icon className="text-royal-600 dark:text-royal-400" size={26} aria-hidden="true" />
              <h2 className="mt-3 text-lg font-bold group-hover:text-royal-600">{s.title}</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{s.text}</p>
            </Link>
          ))}
        </div>
        <div className="container-x mt-12">
          <h2 className="text-2xl font-bold">Download centre</h2>
          <ul className="card mt-4 divide-y divide-slate-100 dark:divide-white/10">
            <li className="flex items-center justify-between gap-4 p-4">
              <span className="text-sm font-semibold">Institute prospectus</span>
              {institute.prospectusUrl ? <a className="btn-outline !py-2" href={institute.prospectusUrl} download><Download size={16} aria-hidden="true" /> Download</a> : <span className="text-xs text-slate-500">Not uploaded yet</span>}
            </li>
          </ul>
          <p className="mt-2 text-xs text-slate-500">Forms, syllabi and circulars will be managed from the admin Document module.</p>
        </div>
      </section>
    </>
  );
}