import { Send } from 'lucide-react';
import FormField from '../FormField';
import Honeypot from '../Honeypot';
import FormSuccess from './FormSuccess';
import { useApiForm } from '../../hooks/useApiForm';
import { enquirySchema } from '../../validations/schemas';
import { submitEnquiry } from '../../services/public';
import { publishedTrades } from '../../data/trades';

export const qualifications = ['8th pass', '10th pass', '12th pass', 'ITI passed', 'Graduate', 'Other'];

export default function EnquiryForm() {
  const f = useApiForm({
    schema: enquirySchema,
    defaultValues: { name: '', phone: '', email: '', trade: '', qualification: '', message: '', website: '' },
    request: submitEnquiry,
    success: 'Enquiry received.',
  });
  const e = f.formState.errors;

  if (f.done) return <FormSuccess title="Enquiry received" text="The admission office will call you on the number you shared. You can also start a full application whenever you are ready." onReset={() => f.setDone(false)} resetLabel="Submit another enquiry" />;

  return (
    <form onSubmit={f.onSubmit} noValidate className="card relative space-y-4 p-6 sm:p-8">
      <Honeypot register={f.register} />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Full name" required error={e.name?.message}><input className="input" autoComplete="name" {...f.register('name')} /></FormField>
        <FormField label="Mobile number" required error={e.phone?.message}><input className="input" inputMode="numeric" maxLength={10} {...f.register('phone')} /></FormField>
        <FormField label="Trade you are interested in" required error={e.trade?.message}>
          <select className="input" {...f.register('trade')}><option value="">Select a trade</option>{publishedTrades.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}</select>
        </FormField>
        <FormField label="Highest qualification" required error={e.qualification?.message}>
          <select className="input" {...f.register('qualification')}><option value="">Select</option>{qualifications.map((q) => <option key={q}>{q}</option>)}</select>
        </FormField>
      </div>
      <FormField label="Email" error={e.email?.message} hint="Optional"><input className="input" type="email" {...f.register('email')} /></FormField>
      <FormField label="Anything you want to ask?" error={e.message?.message}><textarea className="input min-h-[90px]" {...f.register('message')} /></FormField>
      <button type="submit" className="btn-primary" disabled={f.submitting}><Send size={16} aria-hidden="true" /> {f.submitting ? 'Sending...' : 'Send enquiry'}</button>
    </form>
  );
}
