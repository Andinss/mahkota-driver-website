// lib/validation.ts
// Zod schemas per content category for input validation and sanitization

import { z } from 'zod';

// Statistics schema: exactly 3 items, label 1-30 chars, value >= 0
export const statisticsSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    label: z.string().min(1).max(30),
    value: z.number().min(0),
    suffix: z.string(),
    decimals: z.number().optional(),
  })).length(3),
});

// Testimonials schema: min 3 items, name/quote non-empty, rating 1-5
export const testimonialsSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    name: z.string().min(1),
    description: z.string().optional(),
    photoUrl: z.string().nullable(),
    quote: z.string().min(1),
    rating: z.number().int().min(1).max(5),
  })).min(3),
});

// Services schema: services min 3 (description <= 150 chars), advantages min 3 (description <= 100 chars)
export const servicesSchema = z.object({
  services: z.array(z.object({
    id: z.string(),
    name: z.string().min(1),
    description: z.string().max(150),
    iconUrl: z.string(),
    iconAlt: z.string().min(1),
  })).min(3),
  advantages: z.array(z.object({
    id: z.string(),
    title: z.string().min(1),
    description: z.string().max(100),
    iconUrl: z.string().optional(),
    iconAlt: z.string().optional(),
  })).min(3),
});

// Registration schema: steps 3-6, order unique, estimateMinutes 5-15
export const registrationSchema = z.object({
  steps: z.array(z.object({
    id: z.string(),
    order: z.number().int(),
    title: z.string().min(1),
    description: z.string().min(1),
    iconUrl: z.string(),
  })).min(3).max(6),
  estimateMinutes: z.number().int().min(5).max(15),
  formUrl: z.string(),
  playStoreUrl: z.string(),
}).check((payload) => {
  const orders = payload.value.steps.map((s) => s.order);
  const uniqueOrders = new Set(orders);
  if (uniqueOrders.size !== orders.length) {
    payload.issues.push({
      code: 'custom',
      message: 'Step orders must be unique',
      path: ['steps'],
      input: payload.value.steps,
    });
  }
});

// Contact schema: whatsappUrl/phone non-empty, address non-empty
export const contactSchema = z.object({
  whatsappUrl: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  socialMedia: z.object({
    instagram: z.string().nullable(),
    facebook: z.string().nullable(),
  }),
  heroDescription: z.string().optional(),
  heroImageUrl: z.string().optional(),
  appMockupUrl: z.string().optional(),
});

// Fleet schema: array of vehicles
export const fleetSchema = z.object({
  vehicles: z.array(z.object({
    id: z.string(),
    name: z.string().min(1),
    year: z.number().int().min(2000).max(2030),
    capacity: z.number().int().min(1).max(20),
    transmission: z.enum(['manual', 'matic']),
    imageUrl: z.string().optional(),
  })).min(1),
});

// Map of category names to their schemas
const schemas: Record<string, z.ZodType> = {
  statistics: statisticsSchema,
  testimonials: testimonialsSchema,
  services: servicesSchema,
  registration: registrationSchema,
  contact: contactSchema,
  fleet: fleetSchema,
};

// Valid category names
export type ContentCategory = 'statistics' | 'testimonials' | 'services' | 'registration' | 'contact' | 'fleet';

// Validation result type
export type ValidationResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: { issues: Array<{ message: string; path: (string | number)[] }> } };

/**
 * Validate data for a specific content category using the appropriate Zod schema.
 * @param category - One of: 'statistics', 'testimonials', 'services', 'registration', 'contact'
 * @param data - Unknown data to validate
 * @returns Validation result with parsed data on success, or error details on failure
 */
export function validateCategory(category: string, data: unknown): ValidationResult {
  const schema = schemas[category];

  if (!schema) {
    return {
      success: false,
      error: {
        issues: [{ message: `Invalid category: ${category}`, path: [] }],
      },
    };
  }

  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    error: {
      issues: result.error.issues.map((issue) => ({
        message: issue.message,
        path: issue.path as (string | number)[],
      })),
    },
  };
}
