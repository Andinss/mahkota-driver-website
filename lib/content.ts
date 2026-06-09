// lib/content.ts
// Functions for reading and writing JSON content files per category

import fs from 'fs/promises';
import path from 'path';
import { validateCategory } from '@/lib/validation';
import type {
  AllContent,
  StatisticsData,
  TestimonialsData,
  ServicesData,
  RegistrationData,
  ContactData,
  FleetData,
} from '@/types/content';

/** Valid content categories */
export const VALID_CATEGORIES = [
  'statistics',
  'testimonials',
  'services',
  'registration',
  'contact',
  'fleet',
] as const;

export type ContentCategory = (typeof VALID_CATEGORIES)[number];

/** Map category name to its TypeScript type */
type CategoryDataMap = {
  statistics: StatisticsData;
  testimonials: TestimonialsData;
  services: ServicesData;
  registration: RegistrationData;
  contact: ContactData;
  fleet: FleetData;
};

/**
 * Get the file path for a given category's JSON file.
 */
function getCategoryPath(category: ContentCategory): string {
  return path.join(process.cwd(), 'data', `${category}.json`);
}

/**
 * Check if a string is a valid content category.
 */
export function isValidCategory(category: string): category is ContentCategory {
  return VALID_CATEGORIES.includes(category as ContentCategory);
}

/**
 * Read a single category's JSON data file.
 * Parses the file and returns typed data.
 *
 * @throws Error if file not found or JSON parse fails
 */
export async function readCategory<T extends ContentCategory>(
  category: T
): Promise<CategoryDataMap[T]> {
  if (!isValidCategory(category)) {
    throw new Error(`Invalid category: ${category}`);
  }

  const filePath = getCategoryPath(category);

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent) as CategoryDataMap[T];
    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(
        `Failed to parse JSON for category "${category}": ${error.message}`
      );
    }
    if (
      error instanceof Error &&
      'code' in error &&
      (error as NodeJS.ErrnoException).code === 'ENOENT'
    ) {
      throw new Error(`Data file not found for category "${category}"`);
    }
    throw error;
  }
}

/**
 * Write data to a category's JSON file after validating with Zod.
 * Returns the validation result or throws on file write errors.
 *
 * @throws Error if validation fails or file write fails
 */
export async function writeCategory<T extends ContentCategory>(
  category: T,
  data: unknown
): Promise<{ success: true; data: CategoryDataMap[T] }> {
  if (!isValidCategory(category)) {
    throw new Error(`Invalid category: ${category}`);
  }

  const validationResult = validateCategory(category, data);

  if (!validationResult.success) {
    const messages = validationResult.error.issues.map(
      (issue: { message: string; path: (string | number)[] }) => `${issue.path.join('.')}: ${issue.message}`
    );
    throw new Error(
      `Validation failed for category "${category}": ${messages.join(', ')}`
    );
  }

  const filePath = getCategoryPath(category);
  const jsonContent = JSON.stringify(validationResult.data, null, 2);

  try {
    await fs.writeFile(filePath, jsonContent, 'utf-8');
    return { success: true, data: validationResult.data as CategoryDataMap[T] };
  } catch (error) {
    throw new Error(
      `Failed to write data for category "${category}": ${(error as Error).message}`
    );
  }
}

/**
 * Read all 5 content categories and return a combined AllContent object.
 *
 * @throws Error if any category file fails to read
 */
export async function readAllContent(): Promise<AllContent> {
  const [statistics, testimonials, services, registration, contact, fleet] =
    await Promise.all([
      readCategory('statistics'),
      readCategory('testimonials'),
      readCategory('services'),
      readCategory('registration'),
      readCategory('contact'),
      readCategory('fleet'),
    ]);

  return {
    statistics,
    testimonials,
    services,
    registration,
    contact,
    fleet,
  };
}
