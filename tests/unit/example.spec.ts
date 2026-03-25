import { describe, expect, it } from 'vitest';
import { slugify } from '@/utils/slugify';
import { mapAxiosError } from '@/services/networkError';

describe('slugify', () => {
  it('normaliza cadenas con tildes y simbolos', () => {
    expect(slugify('Metal Gear Solid 2: Sons of Liberty')).toBe('metal-gear-solid-2-sons-of-liberty');
    expect(slugify('Operación Snake Eater')).toBe('operacion-snake-eater');
  });
});

describe('mapAxiosError', () => {
  it('devuelve unknown para errores no axios', () => {
    const mapped = mapAxiosError(new Error('x'));
    expect(mapped.kind).toBe('unknown');
  });

  it('mapea timeout de axios', () => {
    const mapped = mapAxiosError({ isAxiosError: true, code: 'ECONNABORTED' });
    expect(mapped.kind).toBe('timeout');
  });
});
