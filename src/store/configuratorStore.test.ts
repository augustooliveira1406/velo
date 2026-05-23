import { describe, it, expect } from 'vitest';
import {
  calculateTotalPrice,
  calculateInstallment,
  formatPrice,
  CarConfiguration
} from './configuratorStore';

describe('configuratorStore', () => {
  
  describe('calculateTotalPrice', () => {
    it('deve retornar o valor base do carro quando não houver adicionais', () => {
      const config: CarConfiguration = {
        exteriorColor: 'glacier-blue',
        interiorColor: 'carbon-black',
        wheelType: 'aero', // rodas padrão
        optionals: [], // sem opcionais
      };
      
      expect(calculateTotalPrice(config)).toBe(40000);
    });

    it('deve adicionar o valor das rodas esportivas', () => {
      const config: CarConfiguration = {
        exteriorColor: 'glacier-blue',
        interiorColor: 'carbon-black',
        wheelType: 'sport', // rodas esportivas (+2000)
        optionals: [],
      };
      
      expect(calculateTotalPrice(config)).toBe(42000);
    });

    it('deve somar corretamente os valores dos opcionais selecionados', () => {
      const config: CarConfiguration = {
        exteriorColor: 'glacier-blue',
        interiorColor: 'carbon-black',
        wheelType: 'aero',
        optionals: ['precision-park', 'flux-capacitor'], // 5500 + 5000 = 10500
      };
      
      expect(calculateTotalPrice(config)).toBe(50500); // 40000 base + 10500 opcionais
    });
  });

  describe('calculateInstallment', () => {
    it('deve calcular o parcelamento em 12x com juros compostos de 2% ao mês', () => {
      const total = 40000;
      const result = calculateInstallment(total);
      
      // Montante base: 40000
      // Fator de financiamento Price para 12x a 2% a.m.:
      // 40000 * 0.02 * (1.02^12) / ((1.02^12) - 1)
      expect(result).toBeCloseTo(3782.38, 2); 
    });
  });

  describe('formatPrice', () => {
    it('deve formatar o valor como moeda BRL (R$)', () => {
      const formatted = formatPrice(40000);
      
      // Por conta de variações no ambiente/Node entre espaços normais e non-breaking spaces
      // O match com Regex garante que o formato básico da moeda e dos milhares está correto
      expect(formatted).toMatch(/R\$\s?40\.000,00/);
    });
  });
});
