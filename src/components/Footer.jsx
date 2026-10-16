import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Facebook, Instagram, Youtube } from 'lucide-react';
import Logo from './Logo';
import { institute } from '../config/institute';

const quick = [
  ['/about', 'About us'], ['/trades', 'Trades and courses'], ['/admissions', 'Admissions'],
  ['/placement', 'Placement'], ['/notices', 'Notices and events'], ['/gallery', 'Gallery'],
];
const help = [
  ['/services', 'Services'], ['/contact', 'Contact us'], ['/login', 'Student / staff login'],
  ['/privacy-policy', 'Privacy policy'], ['/terms-and-conditions', 'Terms and conditions'],
];

export default function Footer() {
  const social = [
    [institute.social.facebook, Facebook, 'Facebook'],
    [institute.social.instagram, Instagram, 'Instagram'],
    [institute.social.youtube, Youtube, 'YouTube'],
  ].filter(([url]) => url);

  return (
    <footer className="blueprint bg-navy-900 text-slate-300">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 text-sm leading-relaxed">Technical and vocational training that prepares trainees for industry, apprenticeship and self-employment.</p>
          {social.length > 0 && (
            <div className="mt-4 flex gap-2">
              {social.map(([url, Icon, label]) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} className="rounded-lg bg-white/10 p-2 hover:bg-white/20"><Icon size={18} /></a>
              ))}
            </div>
          )}
        </div>
        <nav aria-label="Quick links">
          <h2 className="text-sm font-bold !text-white">Explore</h2>
          <ul className="mt-4 space-y-2 text-sm">{quick.map(([to, l]) => <li key={to}><Link to={to} className="hover:text-amber-400">{l}</Link></li>)}</ul>
        </nav>
        <nav aria-label="Help and legal">
          <h2 className="text-sm font-bold !text-white">Help and legal</h2>
          <ul className="mt-4 space-y-2 text-sm">{help.map(([to, l]) => <li key={to}><Link to={to} className="hover:text-amber-400">{l}</Link></li>)}</ul>
        </nav>
        <div>
          <h2 className="text-sm font-bold !text-white">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-amber-400" aria-hidden="true" /><span>{institute.address.join(', ')}</span></li>
            <li className="flex gap-2"><Phone size={16} className="mt-0.5 shrink-0 text-amber-400" aria-hidden="true" /><a href={`tel:${institute.phone.replace(/\s/g, '')}`} className="hover:text-amber-400">{institute.phone}</a></li>
            <li className="flex gap-2"><Mail size={16} className="mt-0.5 shrink-0 text-amber-400" aria-hidden="true" /><a href={`mailto:${institute.email}`} className="hover:text-amber-400">{institute.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} {institute.name}. All rights reserved.
      </div>
    </footer>
  );
}
