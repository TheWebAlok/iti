import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { errorMessage } from '../services/api';

/**
 * Shared behaviour for public forms: zod validation, honeypot spam trap,
 * toast feedback and a success state.
 */
export function useApiForm({ schema, defaultValues, request, success }) {
  const form = useForm({ resolver: zodResolver(schema), defaultValues, mode: 'onTouched' });
  const [done, setDone] = useState(false);

  const onSubmit = form.handleSubmit(async (values) => {
    if (values.website) { setDone(true); return; } // honeypot filled: bots get a fake success
    try {
      await request(values);
      toast.success(success);
      form.reset();
      setDone(true);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  });

  return { ...form, onSubmit, done, setDone, submitting: form.formState.isSubmitting };
}
