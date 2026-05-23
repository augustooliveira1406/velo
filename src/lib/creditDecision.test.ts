import { describe, it, expect } from 'vitest';
import { resolveCreditStatus } from './creditDecision';

describe('resolveCreditStatus', () => {
  it('aprova financiamento com score baixo quando entrada é >= 50% do total', () => {
    expect(resolveCreditStatus(450, 0.5)).toBe('APROVADO');
    expect(resolveCreditStatus(300, 0.75)).toBe('APROVADO');
  });
});
