import { Send } from 'lucide-react';
import FormField from '../FormField';
import Honeypot from '../Honeypot';
import FormSuccess from './FormSuccess';
import { useApiForm } from '../../hooks/useApiForm';
import { contactSchema } from '../../validations/schemas';
import { submitContact } from '../../services/public';

export default function ContactForm() {
  const f = useApiForm({
    schema: contactSchema,
    defaultValues: { name: '', phone: '', email: '', subject: '', message: '', website: '' },
    request: submitContact,
    success: 'Message sent. We will get back to you soon.',
  });
  const e = f.formState.errors;

  if (f.done) return <FormSuccess title="Message sent" text="Thank you for writing to us. The office will respond on the phone number or email you provided." onReset={() => f.setDone(false)} />;

  return (
    <form onSubmit={f.onSubmit} noValidate className="card relative space-y-4 p-6 sm:p-8">
      <Honeypot register={f.register} />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Full name" required error={e.name?.message}><input className="input" autoComplete="name" {...f.register('name')} /></FormField>
        <FormField label="Mobile number" required error={e.phone?.message}><input className="input" inputMode="numeric" maxLength={10} autoComplete="tel-national" {...f.register('phone')} /></FormField>
      </div>
      <FormField label="Email" error={e.email?.message} hint="Optional"><input className="input" type="email" autoComplete="email" {...f.register('email')} /></FormField>
      <FormField label="Subject" required error={e.subject?.message}><input className="input" {...f.register('subject')} /></FormField>
      <FormField label="Message" required error={e.message?.message}><textarea className="input min-h-[120px]" {...f.register('message')} /></FormField>
      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={f.submitting}>
        <Send size={16} aria-hidden="true" /> {f.submitting ? 'Sending...' : 'Send message'}
      </button>
    </form>
  );
}