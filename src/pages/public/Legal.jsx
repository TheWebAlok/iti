import Seo from '../../components/Seo';
import PageHeader from '../../components/PageHeader';
import { institute } from '../../config/institute';

const content = {
  privacy: {
    title: 'Privacy policy',
    sections: [
      ['What we collect', 'Details you submit in enquiry, admission, placement and contact forms, such as name, phone number, email, address, education details and uploaded documents. Enrolled students also have attendance, fee and result records.'],
      ['How we use it', 'To process admissions, run training, record fees and attendance, publish results to the student concerned, arrange placement and respond to enquiries.'],
      ['Who can see it', 'Only authorised institute staff and the student concerned. Student documents are not public. Placement partners receive student details only with the student\'s consent.'],
      ['Storage and security', 'Data is stored in access-controlled systems. Payments are processed by a third-party gateway; we do not store card or bank details.'],
      ['Your choices', `You may ask the office to correct or delete your enquiry data, subject to record-keeping rules. Write to ${institute.email}.`],
    ],
  },
  terms: {
    title: 'Terms and conditions',
    sections: [
      ['Use of this website', 'Information is provided to help applicants and students. Fees, seats and dates may change; the office confirmation prevails.'],
      ['Admissions', 'Submitting an application does not guarantee admission. Admission is confirmed only when the office approves the application and issues an enrollment number.'],
      ['Fees and refunds', 'Fees are as notified by the institute. Refunds, where allowed, follow the institute\'s refund policy and are recorded with authorisation.'],
      ['Accounts', 'Keep your login private. Activity under your account is your responsibility. Do not attempt to alter fee, attendance, result or admission records.'],
      ['Contact', `Questions about these terms: ${institute.email}.`],
    ],
  },
};

export default function Legal({ kind }) {
  const page = content[kind];
  return (
    <>
      <Seo title={page.title} />
      <PageHeader title={page.title} crumbs={[{ label: page.title }]} />
      <section className="section pt-10">
        <div className="container-x max-w-3xl space-y-8">
          <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
            Template text. Have it reviewed against your legal requirements before the site goes live.
          </p>
          {page.sections.map(([h, t]) => (
            <div key={h}><h2 className="text-xl font-bold">{h}</h2><p className="mt-2 leading-relaxed">{t}</p></div>
          ))}
        </div>
      </section>
    </>
  );
}
