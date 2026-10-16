import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { institute } from '../config/institute';
import { whatsappLink } from '../utils/helpers';

export default function WhatsAppButton() {
  const href = whatsappLink(institute.whatsappNumber, `Hello ${institute.name}, I would like to know about admissions.`);
  const cls = 'fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-600';
  const inner = (<><MessageCircle size={20} aria-hidden="true" /><span className="hidden sm:inline">WhatsApp enquiry</span></>);
  return href
    ? <a href={href} target="_blank" rel="noopener noreferrer" className={cls} aria-label="Enquire on WhatsApp">{inner}</a>
    : <Link to="/contact" className={cls} aria-label="Contact the institute" title="WhatsApp number not configured yet">{inner}</Link>;
}
