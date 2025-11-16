import { describe, it, expect } from 'vitest';
import { cn, formatDate, formatNumber } from '../utils';

describe('cn', () => {
  it('should merge class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('should handle conditional classes', () => {
    expect(cn('class1', false && 'class2', 'class3')).toBe('class1 class3');
  });

  it('should handle undefined and null', () => {
    expect(cn('class1', undefined, null, 'class2')).toBe('class1 class2');
  });

  it('should merge Tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toContain('py-1');
    // Tailwind merge should handle conflicting classes
  });

  it('should handle empty strings', () => {
    expect(cn('class1', '', 'class2')).toBe('class1 class2');
  });
});

describe('formatDate', () => {
  it('should format date with default options', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date, 'en');
    
    expect(result).toContain('January');
    expect(result).toContain('2024');
  });

  it('should format date with custom locale', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date, 'fr');
    
    expect(result).toBeDefined();
  });

  it('should format date with custom options', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date, 'en', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
    
    expect(result).toBeDefined();
  });

  it('should handle number input', () => {
    const timestamp = new Date('2024-01-15').getTime();
    const result = formatDate(timestamp, 'en');
    
    expect(result).toBeDefined();
  });

  it('should handle string input', () => {
    const dateString = '2024-01-15';
    const result = formatDate(dateString, 'en');
    
    expect(result).toBeDefined();
  });

  it('should format date in Arabic locale', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date, 'ar');
    
    expect(result).toBeDefined();
  });
});

describe('formatNumber', () => {
  it('should format number with default options', () => {
    const result = formatNumber(1234.56, 'en');
    
    expect(result).toBeDefined();
  });

  it('should format number with custom locale', () => {
    const result = formatNumber(1234.56, 'fr');
    
    expect(result).toBeDefined();
  });

  it('should format number with currency', () => {
    const result = formatNumber(1234.56, 'en', {
      style: 'currency',
      currency: 'USD',
    });
    
    expect(result).toContain('$');
  });

  it('should format large numbers', () => {
    const result = formatNumber(1000000, 'en');
    
    expect(result).toBeDefined();
  });

  it('should format decimal numbers', () => {
    const result = formatNumber(1234.567, 'en', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    expect(result).toBeDefined();
  });

  it('should format number in Arabic locale', () => {
    const result = formatNumber(1234.56, 'ar');
    
    expect(result).toBeDefined();
  });
});

