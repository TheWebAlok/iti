import { Send } from 'lucide-react';
import FormField from '../FormField';
import Honeypot from '../Honeypot';
import FormSuccess from './FormSuccess';
import { useApiForm } from '../../hooks/useApiForm';
import { employerSchema } from '../../validations/schemas';
import { submitEmployerEnquiry } from '../../services/public';

export default function EmployerForm() {
  const f = useApiForm({
    schema: employerSchema,
    defaultValues: { company: '', contactName: '', phone: '', email: '', requirement: '', website: '' },
    request: submitEmployerEnquiry,
    success: 'Employer enquiry sent.',
  });
  const e = f.formState.errors;

  if (f.done) return <FormSuccess title="Enquiry sent" text="Our placement officer will contact you to discuss your requirement." onReset={() => f.setDone(false)} resetLabel="Send another" />;

  return (
    <form onSubmit={f.onSubmit} noValidate className="card relative space-y-4 p-6 sm:p-8">
      <Honeypot register={f.register} />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Company name" required error={e.company?.message}><input className="input" autoComplete="organization" {...f.register('company')} /></FormField>
        <FormField label="Contact person" required error={e.contactName?.message}><input className="input" autoComplete="name" {...f.register('contactName')} /></FormField>
        <FormField label="Mobile number" required error={e.phone?.message}><input className="input" inputMode="numeric" maxLength={10} {...f.register('phone')} /></FormField>
        <FormField label="Work email" required error={e.email?.message}><input className="input" type="email" autoComplete="email" {...f.register('email')} /></FormField>
      </div>
      <FormField label="Hiring or apprenticeship requirement" required error={e.requirement?.message} hint="Trades, number of positions, location and timeline">
        <textarea className="input min-h-[110px]" {...f.register('requirement')} />
      </FormField>
      <button type="submit" className="btn-primary" disabled={f.submitting}><Send size={16} aria-hidden="true" /> {f.submitting ? 'Sending...' : 'Send employer enquiry'}</button>
    </form>
  );
}
