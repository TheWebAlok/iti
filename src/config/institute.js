/**
 * Single place to configure institute identity and public data.
 * Everything marked demo is placeholder content and is labelled as demo on screen.
 * Replace with real, verified details before going live. In later phases this will be
 * served from the InstituteSettings collection through the API.
 */
export const institute = {
  name: 'Aurangabad ITI',
  shortName: 'ITI',
  tagline: 'Industrial Training Institute',
  email: 'info@your-iti.example',
  phone: '+91 00000 00000',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '',
  address: ['Institute address line 1', 'City, District, State - PIN'],
  officeHours: [
    { days: 'Monday to Friday', time: '9:30 AM - 5:00 PM' },
    { days: 'Saturday', time: '9:30 AM - 1:00 PM' },
    { days: 'Sunday', time: 'Closed' },
  ],
mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2154.7350708022755!2d84.40426737826206!3d24.733128019442113!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398cfd105b1c062d%3A0x35c9f844a3de3194!2z4KSU4KSw4KSC4KSX4KS-4KSs4KS-4KSmIOCkquClgC7gpLUu4KSfIOCkh-CkpOCkvyDgpJTgpLDgpILgpJfgpL7gpKzgpL7gpKY!5e0!3m2!1shi!2sin!4v1791887967258!5m2!1shi!2sin', // Google Maps embed src // paste a Google Maps "Embed a map" src URL here
  prospectusUrl: '', // e.g. /downloads/prospectus.pdf once uploaded
  social: { facebook: '', instagram: '', youtube: '' },

  // Show affiliation only after the office has verified the details.
  affiliation: {
    verified: false,
    items: [
      { label: 'Affiliating body', value: 'NCVT / SCVT (to be confirmed)' },
      { label: 'Institute code', value: 'To be added' },
      { label: 'Recognition valid until', value: 'To be added' },
    ],
  },

  dataMode: 'demo', // 'demo' | 'live'
  stats: [
    { key: 'students', label: 'Students enrolled', value: 850 },
    { key: 'trades', label: 'Trades offered', value: null },
    { key: 'placement', label: 'Placement rate', value: 82, suffix: '%' },
    { key: 'partners', label: 'Industry partners', value: 35 },
  ],

  faqs: [
    { q: 'Who can apply for admission?', a: 'Eligibility depends on the trade. Most trades ask for an 8th or 10th pass certificate and a minimum age of 14 years. Check the entry qualification on each trade page and in the prospectus.' },
    { q: 'Which documents are needed to apply?', a: 'A recent passport-size photograph, the latest qualification marksheet, an identity proof and, where applicable, a category certificate. You can upload them in the online application.' },
    { q: 'How do I know the fees for a trade?', a: 'Fees are published on the trade page when the office has configured them. Otherwise the admission office will share the current fee structure on request.' },
    { q: 'How do I track my application?', a: 'Use Track Status on the Admissions page with your application number and the mobile number you applied with.' },
    { q: 'Is placement guaranteed?', a: 'No institute can guarantee jobs. We run placement drives and apprenticeship guidance, and publish placement figures only from actual records.' },
  ],
};

export const isDemo = institute.dataMode === 'demo';
