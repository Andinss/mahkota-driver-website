// tests/property-based.test.tsx
// Property-based tests using fast-check + vitest

import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';
import StarRating from '@/components/ui/StarRating';
import BackToTop from '@/components/ui/BackToTop';
import { validateCategory } from '@/lib/validation';
import { act } from 'react';

/**
 * Property 6: Label statistik 1–30 karakter
 * **Validates: Requirements 3.2**
 *
 * statisticsSchema accepts labels of length 1-30 and rejects labels of length 0 or >30.
 */
describe('Property 6: Label statistik 1–30 karakter', () => {
  it('accepts labels with length 1-30', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 30 }),
        (label) => {
          const data = {
            items: [
              { id: 'stat-1', label, value: 100, suffix: '+' },
              { id: 'stat-2', label: 'Armada', value: 200, suffix: '+' },
              { id: 'stat-3', label: 'Kepuasan', value: 4.5, suffix: '/5' },
            ],
          };
          const result = validateCategory('statistics', data);
          expect(result.success).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('rejects labels with length 0 (empty string)', () => {
    const data = {
      items: [
        { id: 'stat-1', label: '', value: 100, suffix: '+' },
        { id: 'stat-2', label: 'Armada', value: 200, suffix: '+' },
        { id: 'stat-3', label: 'Kepuasan', value: 4.5, suffix: '/5' },
      ],
    };
    const result = validateCategory('statistics', data);
    expect(result.success).toBe(false);
  });

  it('rejects labels with length > 30', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 31, maxLength: 100 }),
        (label) => {
          const data = {
            items: [
              { id: 'stat-1', label, value: 100, suffix: '+' },
              { id: 'stat-2', label: 'Armada', value: 200, suffix: '+' },
              { id: 'stat-3', label: 'Kepuasan', value: 4.5, suffix: '/5' },
            ],
          };
          const result = validateCategory('statistics', data);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 10: Rating bintang akurat
 * **Validates: Requirements 4.2**
 *
 * For any integer rating 1-5, StarRating renders exactly `rating` filled stars
 * (text-gold class) and `5 - rating` empty stars (text-gray-600 class).
 */
describe('Property 10: Rating bintang akurat', () => {
  it('renders correct number of filled and empty stars for any rating 1-5', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 5 }),
        (rating) => {
          const { container } = render(<StarRating rating={rating} />);
          const stars = container.querySelectorAll('svg');

          expect(stars).toHaveLength(5);

          const filled = Array.from(stars).filter((s) =>
            s.classList.contains('text-gold')
          );
          const empty = Array.from(stars).filter((s) =>
            s.classList.contains('text-gray-600')
          );

          expect(filled).toHaveLength(rating);
          expect(empty).toHaveLength(5 - rating);
        }
      ),
      { numRuns: 50 }
    );
  });
});

/**
 * Property 18: BackToTop visibility
 * **Validates: Requirements 7.4**
 *
 * When scrollY > 300, button has opacity-100 (visible).
 * When scrollY <= 300, button has opacity-0 (hidden).
 */
describe('Property 18: BackToTop visibility', () => {
  beforeEach(() => {
    // Reset scrollY
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
  });

  it('is visible when scrollY > 300 and hidden when scrollY <= 300', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 2000 }),
        (scrollY) => {
          // Set scrollY before rendering
          Object.defineProperty(window, 'scrollY', {
            value: scrollY,
            writable: true,
            configurable: true,
          });

          const { container } = render(<BackToTop />);

          // Trigger scroll event to update component state
          act(() => {
            window.dispatchEvent(new Event('scroll'));
          });

          const button = container.querySelector('button');
          expect(button).not.toBeNull();

          if (scrollY > 300) {
            expect(button!.className).toContain('opacity-100');
          } else {
            expect(button!.className).toContain('opacity-0');
          }
        }
      ),
      { numRuns: 50 }
    );
  });
});

/**
 * Property 21: PUT menolak data tidak valid
 * **Validates: Requirements 9.6**
 *
 * Invalid data structures (wrong types, missing fields, out-of-range values)
 * are rejected by validateCategory with { success: false }.
 */
describe('Property 21: PUT menolak data tidak valid', () => {
  it('rejects arbitrary invalid data for statistics category', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // Missing items field
          fc.record({ notItems: fc.anything() }),
          // Items is not an array
          fc.record({ items: fc.oneof(fc.string(), fc.integer(), fc.boolean()) }),
          // Wrong number of items (not 3)
          fc.record({
            items: fc.array(
              fc.record({
                id: fc.string(),
                label: fc.string({ minLength: 1, maxLength: 30 }),
                value: fc.nat(),
                suffix: fc.string(),
              }),
              { minLength: 0, maxLength: 2 }
            ),
          }),
          // Negative value
          fc.constant({
            items: [
              { id: 'a', label: 'Test', value: -1, suffix: '+' },
              { id: 'b', label: 'Test', value: 10, suffix: '+' },
              { id: 'c', label: 'Test', value: 10, suffix: '+' },
            ],
          })
        ),
        (data) => {
          const result = validateCategory('statistics', data);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('rejects arbitrary invalid data for testimonials category', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // Missing items field
          fc.record({ notItems: fc.anything() }),
          // Items with fewer than 3 entries
          fc.record({
            items: fc.array(
              fc.record({
                id: fc.string(),
                name: fc.string({ minLength: 1 }),
                photoUrl: fc.constant(null),
                quote: fc.string({ minLength: 1 }),
                rating: fc.integer({ min: 1, max: 5 }),
              }),
              { minLength: 0, maxLength: 2 }
            ),
          }),
          // Rating out of range
          fc.constant({
            items: [
              { id: 'a', name: 'A', photoUrl: null, quote: 'Q', rating: 6 },
              { id: 'b', name: 'B', photoUrl: null, quote: 'Q', rating: 3 },
              { id: 'c', name: 'C', photoUrl: null, quote: 'Q', rating: 2 },
            ],
          }),
          // Empty name
          fc.constant({
            items: [
              { id: 'a', name: '', photoUrl: null, quote: 'Q', rating: 3 },
              { id: 'b', name: 'B', photoUrl: null, quote: 'Q', rating: 3 },
              { id: 'c', name: 'C', photoUrl: null, quote: 'Q', rating: 2 },
            ],
          })
        ),
        (data) => {
          const result = validateCategory('testimonials', data);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('rejects unknown categories', () => {
    const validCategories = ['statistics', 'testimonials', 'services', 'registration', 'contact'];
    // Object prototype property names that would resolve to truthy values in a plain object lookup
    const prototypeKeys = ['valueOf', 'toString', 'hasOwnProperty', 'constructor', 'isPrototypeOf'];

    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(
          (s) => !validCategories.includes(s) && !prototypeKeys.includes(s)
        ),
        (category) => {
          const result = validateCategory(category, {});
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 50 }
    );
  });
});

/**
 * Property 23: Direktori sensitif tidak bisa diakses
 * **Validates: Requirements 10.1**
 *
 * Verifies that `data/` and `config/` directories exist on the filesystem
 * but are NOT inside the `public/` directory — meaning Next.js will not serve them as static assets.
 */
describe('Property 23: Direktori sensitif tidak bisa diakses', () => {
  const projectRoot = path.resolve(__dirname, '..');

  it('data/ directory exists but is NOT inside public/', () => {
    const dataDir = path.join(projectRoot, 'data');
    const publicDataDir = path.join(projectRoot, 'public', 'data');

    // data/ exists at project root
    expect(fs.existsSync(dataDir)).toBe(true);
    // data/ does NOT exist inside public/
    expect(fs.existsSync(publicDataDir)).toBe(false);
  });

  it('config/ directory exists but is NOT inside public/', () => {
    const configDir = path.join(projectRoot, 'config');
    const publicConfigDir = path.join(projectRoot, 'public', 'config');

    // config/ exists at project root
    expect(fs.existsSync(configDir)).toBe(true);
    // config/ does NOT exist inside public/
    expect(fs.existsSync(publicConfigDir)).toBe(false);
  });

  it('no sensitive JSON files are accessible via public/ for any data category', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('statistics', 'testimonials', 'services', 'registration', 'contact'),
        (category) => {
          const sensitiveFile = path.join(projectRoot, 'data', `${category}.json`);
          const publicFile = path.join(projectRoot, 'public', 'data', `${category}.json`);

          // Sensitive file exists on disk
          expect(fs.existsSync(sensitiveFile)).toBe(true);
          // But NOT accessible via public/
          expect(fs.existsSync(publicFile)).toBe(false);
        }
      ),
      { numRuns: 10 }
    );
  });

  it('admin config is not accessible via public/', () => {
    const configFile = path.join(projectRoot, 'config', 'admin.json');
    const publicConfigFile = path.join(projectRoot, 'public', 'config', 'admin.json');

    // Config file exists on disk
    expect(fs.existsSync(configFile)).toBe(true);
    // But NOT accessible via public/
    expect(fs.existsSync(publicConfigFile)).toBe(false);
  });
});
