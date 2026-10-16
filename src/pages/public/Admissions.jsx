import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Send } from 'lucide-react';
import { toast } from 'sonner';
import Seo from '../../components/Seo';
import PageHeader from '../../components/PageHeader';
import FormField from '../../components/FormField';
import FileUploader from '../../components/FileUploader';
import Honeypot from '../../components/Honeypot';
import FormSuccess from '../../components/forms/FormSuccess';
import EnquiryForm, { qualifications } from '../../components/forms/EnquiryForm';
import { useApiForm } from '../../hooks/useApiForm';
import { admissionSchema } from '../../validations/schemas';
import { submitApplication, trackApplication } from '../../services/public';
import { errorMessage } from '../../services/api';
import { publishedTrades } from '../../data/trades';
import { ACCEPTED_DOCS, ACCEPTED_PHOTO, checkFile } from '../../utils/helpers';

const tabs = [
  { id: 'apply', label: 'Apply online' },
  { id: 'enquiry', label: 'Quick enquiry' },
  { id: 'track', label: 'Track status' },
];

function Section({ title, children }) {
  return (
    <fieldset className="space-y-4 border-t border-slate-200 pt-6 first:border-0 first:pt-0 dark:border-white/10">
      <legend className="mb-2 text-lg font-bold text-navy-900 dark:text-white">{title}</legend>
      {children}
    </fieldset>
  );
}

function ApplicationForm({ presetTrade }) {
  const [files, setFiles] = useState({ photo: null, marksheet: null, idProof: null });
  const [fileErrors, setFileErrors] = useState({});
  const [applicationNo, setApplicationNo] = useState(null);

  const f = useApiForm({
    schema: admissionSchema,
    defaultValues: {
      fullName: '', dob: '', gender: '', category: '', phone: '', email: '', address: '', district: '', pincode: '',
      guardianName: '', guardianRelation: '', guardianPhone: '', qualification: '', board: '', passingYear: '', percentage: '',
      tradeFirst: presetTrade || '', tradeSecond: '', declaration: false, website: '',
    },
    success: 'Application submitted.',
    request: async (values) => {
      const errs = {
        photo: !files.photo ? 'Upload a photograph' : checkFile(files.photo, ACCEPTED_PHOTO, 1),
        marksheet: !files.marksheet ? 'Upload your marksheet' : checkFile(files.marksheet, ACCEPTED_DOCS),
        idProof: !files.idProof ? 'Upload an identity proof' : checkFile(files.idProof, ACCEPTED_DOCS),
      };
      setFileErrors(errs);
      if (Object.values(errs).some(Boolean)) throw Object.assign(new Error('files'), { response: { data: { message: 'Please fix the document uploads.' } } });
      const body = new FormData();
      Object.entries(values).forEach(([k, v]) => k !== 'website' && body.append(k, v));
      Object.entries(files).forEach(([k, v]) => body.append(k, v));
      const res = await submitApplication(body);
      setApplicationNo(res.data?.data?.applicationNo || null);
    },
  });
  const e = f.formState.errors;
  const tradeOptions = publishedTrades.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>);

  if (f.done) {
    return <FormSuccess title="Application submitted"
      text={applicationNo ? `Your application number is ${applicationNo}. Keep it safe - you need it with your mobile number to track status.` : 'Your application was received. Note the application number sent to your phone.'}
      onReset={() => { f.setDone(false); setApplicationNo(null); }} resetLabel="Start another application" />;
  }

  return (
    <form onSubmit={f.onSubmit} noValidate className="card relative space-y-8 p-6 sm:p-8">
      <Honeypot register={f.register} />
      <Section title="Personal details">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Full name" required error={e.fullName?.message}><input className="input" autoComplete="name" {...f.register('fullName')} /></FormField>
          <FormField label="Date of birth" required error={e.dob?.message}><input className="input" type="date" {...f.register('dob')} /></FormField>
          <FormField label="Gender" required error={e.gender?.message}><select className="input" {...f.register('gender')}><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select></FormField>
          <FormField label="Category" required error={e.category?.message}><select className="input" {...f.register('category')}><option value="">Select</option><option>General</option><option>OBC</option><option>SC</option><option>ST</option><option>EWS</option></select></FormField>
          <FormField label="Mobile number" required error={e.phone?.message}><input className="input" inputMode="numeric" maxLength={10} {...f.register('phone')} /></FormField>
          <FormField label="Email" error={e.email?.message} hint="Optional"><input className="input" type="email" {...f.register('email')} /></FormField>
        </div>
        <FormField label="Address" required error={e.address?.message}><input className="input" autoComplete="street-address" {...f.register('address')} /></FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="District" required error={e.district?.message}><input className="input" {...f.register('district')} /></FormField>
          <FormField label="PIN code" required error={e.pincode?.message}><input className="input" inputMode="numeric" maxLength={6} autoComplete="postal-code" {...f.register('pincode')} /></FormField>
        </div>
      </Section>

      <Section title="Parent or guardian">
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="Name" required error={e.guardianName?.message}><input className="input" {...f.register('guardianName')} /></FormField>
          <FormField label="Relation" required error={e.guardianRelation?.message}><select className="input" {...f.register('guardianRelation')}><option value="">Select</option><option>Father</option><option>Mother</option><option>Guardian</option></select></FormField>
          <FormField label="Mobile number" required error={e.guardianPhone?.message}><input className="input" inputMode="numeric" maxLength={10} {...f.register('guardianPhone')} /></FormField>
        </div>
      </Section>

      <Section title="Education">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Highest qualification" required error={e.qualification?.message}><select className="input" {...f.register('qualification')}><option value="">Select</option>{qualifications.map((q) => <option key={q}>{q}</option>)}</select></FormField>
          <FormField label="Board / university" required error={e.board?.message}><input className="input" {...f.register('board')} /></FormField>
          <FormField label="Year of passing" required error={e.passingYear?.message}><input className="input" inputMode="numeric" maxLength={4} {...f.register('passingYear')} /></FormField>
          <FormField label="Marks (%)" required error={e.percentage?.message}><input className="input" inputMode="decimal" {...f.register('percentage')} /></FormField>
        </div>
      </Section>

      <Section title="Trade preference">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="First preference" required error={e.tradeFirst?.message}><select className="input" {...f.register('tradeFirst')}><option value="">Select a trade</option>{tradeOptions}</select></FormField>
          <FormField label="Second preference" error={e.tradeSecond?.message} hint="Optional"><select className="input" {...f.register('tradeSecond')}><option value="">None</option>{tradeOptions}</select></FormField>
        </div>
      </Section>

      <Section title="Documents">
        <div className="grid gap-4 sm:grid-cols-3">
          <FileUploader label="Photograph" required accept="image/jpeg,image/png" file={files.photo} error={fileErrors.photo} hint="JPG or PNG, up to 1 MB"
            onChange={(file) => setFiles((s) => ({ ...s, photo: file }))} />
          <FileUploader label="Marksheet" required accept="application/pdf,image/jpeg,image/png" file={files.marksheet} error={fileErrors.marksheet} hint="PDF, JPG or PNG, up to 2 MB"
            onChange={(file) => setFiles((s) => ({ ...s, marksheet: file }))} />
          <FileUploader label="Identity proof" required accept="application/pdf,image/jpeg,image/png" file={files.idProof} error={fileErrors.idProof} hint="PDF, JPG or PNG, up to 2 MB"
            onChange={(file) => setFiles((s) => ({ ...s, idProof: file }))} />
        </div>
      </Section>

      <div>
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300" aria-invalid={e.declaration ? true : undefined} {...f.register('declaration')} />
          <span>I declare that the information and documents I provide are true. I understand that false information can cancel my admission.</span>
        </label>
        {e.declaration && <p role="alert" className="mt-1 text-xs font-medium text-red-600">{e.declaration.message}</p>}
      </div>

      <button type="submit" className="btn-accent" disabled={f.submitting}><Send size={16} aria-hidden="true" /> {f.submitting ? 'Submitting...' : 'Submit application'}</button>
    </form>
  );
}

const stages = ['Submitted', 'Under review', 'Documents needed', 'Approved', 'Rejected'];

function TrackForm() {
  const [appNo, setAppNo] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const submit = async (ev) => {
    ev.preventDefault();
    if (!appNo.trim() || !/^[6-9]\d{9}$/.test(phone)) { toast.error('Enter your application number and a valid 10-digit mobile number.'); return; }
    setLoading(true); setResult(null);
    try {
      const res = await trackApplication(appNo.trim(), phone);
      setResult(res.data?.data || null);
    } catch (err) { toast.error(errorMessage(err)); } finally { setLoading(false); }
  };

  return (
    <div className="card p-6 sm:p-8">
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end" noValidate>
        <FormField label="Application number" required><input className="input" value={appNo} onChange={(e) => setAppNo(e.target.value)} /></FormField>
        <FormField label="Mobile number" required><input className="input" inputMode="numeric" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value)} /></FormField>
        <button className="btn-primary" disabled={loading}><Search size={16} aria-hidden="true" /> {loading ? 'Checking...' : 'Check status'}</button>
      </form>
      {result && (
        <div className="mt-6 rounded-xl bg-slate-50 p-5 dark:bg-white/5" role="status">
          <p className="text-sm text-slate-500">Current status</p>
          <p className="text-xl font-bold text-navy-900 dark:text-white">{result.status}</p>
          {result.remarks && <p className="mt-2 text-sm">{result.remarks}</p>}
        </div>
      )}
      <p className="mt-6 text-xs text-slate-500">Stages: {stages.join(' > ')}. The status shown always comes from the admission office, never from this page.</p>
    </div>
  );
}

export default function Admissions() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState('apply');
  const preset = publishedTrades.some((t) => t.slug === params.get('trade')) ? params.get('trade') : '';

  return (
    <>
      <Seo title="Admissions" description="Apply online for ITI admission, send a quick enquiry or track your application status." />
      <PageHeader title="Admissions" text="Apply online, ask a quick question or check where your application stands." crumbs={[{ label: 'Admissions' }]} />
      <section className="section pt-10">
        <div className="container-x max-w-4xl">
          <div role="tablist" aria-label="Admission options" className="mb-6 inline-flex rounded-xl bg-slate-200/70 p-1 dark:bg-white/10">
            {tabs.map((t) => (
              <button key={t.id} role="tab" type="button" id={`tab-${t.id}`} aria-selected={tab === t.id} aria-controls={`panel-${t.id}`} onClick={() => setTab(t.id)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${tab === t.id ? 'bg-white text-navy-900 shadow dark:bg-navy-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{t.label}</button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={tab} role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              {tab === 'apply' && <ApplicationForm presetTrade={preset} />}
              {tab === 'enquiry' && <EnquiryForm />}
              {tab === 'track' && <TrackForm />}
            </motion.div>
          </AnimatePresence>
          <p className="mt-4 text-xs text-slate-500">The acknowledgement PDF and email/SMS confirmation are generated by the server once the backend is connected (Phase 2 and 6).</p>
        </div>
      </section>
    </>
  );
}
