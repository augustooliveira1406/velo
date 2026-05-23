import { z } from 'zod';

export const orderSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  lastname: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(14, 'Telefone inválido'),
  document: z.string().min(14, 'CPF inválido'),
  store: z.string().min(1, 'Selecione uma loja'),
  terms: z.boolean().refine((val) => val === true, 'Aceite os termos'),
});

export type OrderFormData = z.infer<typeof orderSchema>;
