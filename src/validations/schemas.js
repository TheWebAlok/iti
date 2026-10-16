import { z } from 'zod';

const phone = z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number');
const name = z.string().trim().min(2, 'Enter at least 2 characters').max(80, 'Too long');
const optionalEmail = z.string().trim().email('Enter a valid email').or(z.literal(''));

export const contactSchema = z.object({
  name,
  phone,
  email: optionalEmail,
  subject: z.string().trim().min(3, 'Enter a subject').max(120),
  message: z.string().trim().min(10, 'Write at least 10 characters').max(1000, 'Keep it under 1000 characters'),
  website: z.string().max(0).optional(), // honeypot
});

export const enquirySchema = z.object({
  name,
  phone,
  email: optionalEmail,
  trade: z.string().min(1, 'Choose a trade'),
  qualification: z.string().min(1, 'Choose a qualification'),
  message: z.string().trim().max(500).optional(),
  website: z.string().max(0).optional(),
});

export const employerSchema = z.object({
  company: z.string().trim().min(2, 'Enter the company name').max(120),
  contactName: name,
  phone,
  email: z.string().trim().email('Enter a valid email'),
  requirement: z.string().trim().min(10, 'Describe the requirement').max(800),
  website: z.string().max(0).optional(),
});

export const admissionSchema = z.object({
  fullName: name,
  dob: z.string().min(1, 'Select date of birth').refine((v) => {
    const age = (Date.now() - new Date(v).getTime()) / (365.25 * 24 * 3600 * 1000);
    return age >= 14 && age <= 60;
  }, 'Applicant must be at least 14 years old'),
  gender: z.string().min(1, 'Select gender'),
  category: z.string().min(1, 'Select category'),
  phone,
  email: optionalEmail,
  address: z.string().trim().min(5, 'Enter your address').max(200),
  district: z.string().trim().min(2, 'Enter district').max(60),
  pincode: z.string().trim().regex(/^\d{6}$/, 'Enter a 6-digit PIN code'),
  guardianName: name,
  guardianRelation: z.string().min(1, 'Select relation'),
  guardianPhone: phone,
  qualification: z.string().min(1, 'Select qualification'),
  board: z.string().trim().min(2, 'Enter board / university').max(80),
  passingYear: z.string().regex(/^(19|20)\d{2}$/, 'Enter a valid year'),
  percentage: z.coerce.number({ invalid_type_error: 'Enter marks percentage' }).min(0).max(100),
  tradeFirst: z.string().min(1, 'Choose your first preference'),
  tradeSecond: z.string().optional(),
  declaration: z.literal(true, { errorMap: () => ({ message: 'You must confirm the declaration' }) }),
  website: z.string().max(0).optional(),
});
