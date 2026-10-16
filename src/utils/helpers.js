export const cn = (...parts) => parts.filter(Boolean).join(' ');

export const MAX_UPLOAD_MB = 2;
export const ACCEPTED_DOCS = ['application/pdf', 'image/jpeg', 'image/png'];
export const ACCEPTED_PHOTO = ['image/jpeg', 'image/png'];

/** Client-side file check. The server repeats this check; never rely on this alone. */
export function checkFile(file, allowed, maxMB = MAX_UPLOAD_MB) {
  if (!file) return null;
  if (!allowed.includes(file.type)) return 'Unsupported file type';
  if (file.size > maxMB * 1024 * 1024) return `File must be smaller than ${maxMB} MB`;
  return null;
}

export const whatsappLink = (number, text) =>
  number ? `https://wa.me/${number}?text=${encodeURIComponent(text)}` : null;
