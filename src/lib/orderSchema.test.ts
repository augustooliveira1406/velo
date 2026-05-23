import { describe, it, expect } from 'vitest';
import { orderSchema } from './orderSchema';

describe('orderSchema', () => {
  it('rejeita envio com campos obrigatórios inválidos e retorna mensagens esperadas', () => {
    const result = orderSchema.safeParse({
      name: '',
      lastname: 'B',
      email: 'invalido',
      phone: '1199999',
      document: '123',
      store: '',
      terms: false,
    });

    expect(result.success).toBe(false);
    if (result.success) return;

    const messages = Object.fromEntries(
      result.error.errors.map((err) => [err.path[0], err.message]),
    );

    expect(messages.name).toBe('Nome deve ter pelo menos 2 caracteres');
    expect(messages.lastname).toBe('Sobrenome deve ter pelo menos 2 caracteres');
    expect(messages.email).toBe('Email inválido');
    expect(messages.phone).toBe('Telefone inválido');
    expect(messages.document).toBe('CPF inválido');
    expect(messages.store).toBe('Selecione uma loja');
    expect(messages.terms).toBe('Aceite os termos');
  });
});
