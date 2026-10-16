import { api } from './api';

// Web3Forms key public hoti hai, phir bhi .env me rakhna better hai
const W3F_KEY = import.meta.env.VITE_WEB3FORMS_KEY || 'd1b51a8c-0e3d-4805-9b71-20e5a9957f06';

// Public endpoints. The Express API for these is built in Phase 2.
export const submitContact = async (data) => {
  // Honeypot bhara hai to bot hai: kuch mat bhejo, chupchap success
  if (data.website) return { data: { message: 'Received.' } };

  // 1) Pehle apne DB me save. Validation ya rate-limit (4xx) error aaye to
  //    yahin ruk jao, taaki useApiForm wahi message dikhaye aur mail na jaye.
  let dbError = null;
  let saved = null;
  try {
    saved = await api.post('/contact', data);
  } catch (err) {
    const status = err?.response?.status;
    if (status && status >= 400 && status < 500) throw err;
    dbError = err; // network ya server error: mail try karenge
  }

  // 2) Web3Forms se mail. Plain fetch, kyunki api instance ka baseURL/token yahan nahi chahiye.
  let mailOk = false;
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: W3F_KEY,
        subject: `${data.subject} - ${data.name}`,
        from_name: 'ITI Website Contact Form',
        name: data.name,
        phone: data.phone,
        email: data.email || 'not provided',
        message: data.message,
      }),
    });
    const json = await res.json().catch(() => ({}));
    mailOk = res.ok && json.success !== false;
  } catch {
    mailOk = false;
  }

  // Dono fail hone par hi error
  if (dbError && !mailOk) throw dbError;
  return saved || { data: { message: 'Message sent.' } };
};

export const submitEnquiry = (data) => api.post('/public/enquiry', data);
export const submitEmployerEnquiry = (data) => api.post('/placements/employer-enquiries', data);
export const submitApplication = (formData) =>
  api.post('/admissions', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const trackApplication = (applicationNo, phone) =>
  api.get(`/admissions/track/${encodeURIComponent(applicationNo)}`, { params: { phone } });