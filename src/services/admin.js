import { api } from './api';

// ---------- Enquiries ----------
export const getEnquiries = async (status = '') => {
  const res = await api.get('/admin/enquiries', { params: status ? { status } : {} });
  return res.data;
};

export const updateEnquiry = async (id, data) => {
  const res = await api.put(`/admin/enquiries/${id}`, data);
  return res.data;
};

export const deleteEnquiry = async (id) => {
  const res = await api.delete(`/admin/enquiries/${id}`);
  return res.data;
};

// ---------- Admissions ----------
export const getAdmissions = async (params = {}) => (await api.get('/admin/admissions', { params })).data;

// formData = FormData (text fields + documents)
export const createAdmission = async (formData) => (await api.post('/admin/admissions', formData)).data;
export const updateAdmission = async (id, formData) => (await api.put(`/admin/admissions/${id}`, formData)).data;
export const deleteAdmission = async (id) => (await api.delete(`/admin/admissions/${id}`)).data;

// Uploaded document ka full link (photo, marksheet etc.)
export const fileUrl = (path) => (api.defaults.baseURL || '').replace(/\/api\/?$/, '') + path;

// PDF (Student copy + Office copy) download
export async function downloadAdmissionPdf(id, filename = 'admission.pdf') {
  try {
    const res = await api.get(`/admin/admissions/${id}/pdf`, { responseType: 'blob' });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    // blob error ko JSON me badlo taki errorMessage(err) sahi message dikhaye
    if (err.response?.data instanceof Blob) {
      try {
        err.response.data = JSON.parse(await err.response.data.text());
      } catch {
        /* ignore */
      }
    }
    throw err;
  }
}  
 export const getNotices = () => api.get('/notices').then((r) => r.data);
   export const createNotice = (data) => api.post('/notices', data).then((r) => r.data);
   export const deleteNotice = (id) => api.delete(`/notices/${id}`).then((r) => r.data);
   export const getNoticeFile = (id) => api.get(`/notices/${id}/file`, { responseType: 'blob' }).then((r) => r.data);

      export const getPlacements = () => api.get('/placements').then((r) => r.data);
   export const createPlacement = (data) => api.post('/placements', data).then((r) => r.data);
   export const deletePlacement = (id) => api.delete(`/placements/${id}`).then((r) => r.data);
   export const placementPhotoUrl = (id) => `${api.defaults.baseURL}/placements/${id}/photo`;