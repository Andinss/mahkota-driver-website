// tests/content.test.ts
// Unit tests for content read/write functions

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readCategory, writeCategory, readAllContent } from '@/lib/content';
import fs from 'fs/promises';
import path from 'path';

// Mock fs/promises to avoid actual file system operations during tests
vi.mock('fs/promises');

const dataDir = path.join(process.cwd(), 'data');

describe('readCategory', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should read statistics.json correctly', async () => {
    const mockData = {
      items: [
        { id: 'stat-1', label: 'Driver', value: 500, suffix: '+' },
        { id: 'stat-2', label: 'Armada', value: 350, suffix: '+' },
        { id: 'stat-3', label: 'Kepuasan', value: 4.8, suffix: '/5', decimals: 1 },
      ],
    };
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockData));

    const result = await readCategory('statistics');
    expect(result).toEqual(mockData);
    expect(fs.readFile).toHaveBeenCalledWith(
      path.join(dataDir, 'statistics.json'),
      'utf-8'
    );
  });

  it('should read contact.json correctly', async () => {
    const mockData = {
      whatsappUrl: 'https://wa.me/6281234567890',
      phone: '+62 812-3456-7890',
      address: 'Jl. Raya Mahkota No. 123',
      socialMedia: { instagram: null, facebook: null },
    };
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockData));

    const result = await readCategory('contact');
    expect(result).toEqual(mockData);
    expect(fs.readFile).toHaveBeenCalledWith(
      path.join(dataDir, 'contact.json'),
      'utf-8'
    );
  });

  it('should throw error for invalid category', async () => {
    await expect(
      readCategory('invalid' as never)
    ).rejects.toThrow('Invalid category');
  });

  it('should throw error when file not found', async () => {
    const err = new Error('ENOENT') as NodeJS.ErrnoException;
    err.code = 'ENOENT';
    vi.mocked(fs.readFile).mockRejectedValue(err);

    await expect(readCategory('statistics')).rejects.toThrow(
      'Data file not found'
    );
  });
});

describe('writeCategory', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should write valid data successfully', async () => {
    vi.mocked(fs.writeFile).mockResolvedValue(undefined);

    const validData = {
      whatsappUrl: 'https://wa.me/6281234567890',
      phone: '+62 812-3456-7890',
      address: 'Jl. Raya Mahkota No. 123',
      socialMedia: { instagram: null, facebook: null },
    };

    const result = await writeCategory('contact', validData);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(validData);
    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join(dataDir, 'contact.json'),
      JSON.stringify(validData, null, 2),
      'utf-8'
    );
  });

  it('should reject invalid data with validation error', async () => {
    const invalidData = {
      whatsappUrl: 'https://wa.me/6281234567890',
      phone: '', // empty phone should fail
      address: 'Jl. Raya Mahkota No. 123',
      socialMedia: { instagram: null, facebook: null },
    };

    await expect(writeCategory('contact', invalidData)).rejects.toThrow(
      'Validation failed'
    );
    expect(fs.writeFile).not.toHaveBeenCalled();
  });

  it('should reject invalid category', async () => {
    await expect(
      writeCategory('invalid' as never, {})
    ).rejects.toThrow('Invalid category');
  });
});

describe('readAllContent', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return all 5 categories', async () => {
    const mockStats = {
      items: [
        { id: 'stat-1', label: 'Driver', value: 500, suffix: '+' },
        { id: 'stat-2', label: 'Armada', value: 350, suffix: '+' },
        { id: 'stat-3', label: 'Kepuasan', value: 4.8, suffix: '/5' },
      ],
    };
    const mockTestimonials = {
      items: [
        { id: 't-1', name: 'Budi', photoUrl: null, quote: 'Bagus!', rating: 5 },
        { id: 't-2', name: 'Ahmad', photoUrl: null, quote: 'Ok.', rating: 4 },
        { id: 't-3', name: 'Siti', photoUrl: null, quote: 'Nice.', rating: 5 },
      ],
    };
    const mockServices = {
      services: [
        { id: 'svc-1', name: 'Harian', description: 'Sewa harian.', iconUrl: '/i.svg', iconAlt: 'Ikon' },
        { id: 'svc-2', name: 'Mingguan', description: 'Sewa mingguan.', iconUrl: '/i.svg', iconAlt: 'Ikon' },
        { id: 'svc-3', name: 'Bulanan', description: 'Sewa bulanan.', iconUrl: '/i.svg', iconAlt: 'Ikon' },
      ],
      advantages: [
        { id: 'adv-1', title: 'Perawatan', description: 'Gratis.' },
        { id: 'adv-2', title: 'Support', description: '24 jam.' },
        { id: 'adv-3', title: 'DP', description: 'Ringan.' },
      ],
    };
    const mockRegistration = {
      steps: [
        { id: 's-1', order: 1, title: 'Isi', description: 'Data.', iconUrl: '/i.svg' },
        { id: 's-2', order: 2, title: 'Verif', description: 'Dok.', iconUrl: '/i.svg' },
        { id: 's-3', order: 3, title: 'TTD', description: 'Kontrak.', iconUrl: '/i.svg' },
      ],
      estimateMinutes: 10,
      formUrl: 'https://forms.example.com',
      playStoreUrl: 'https://play.google.com/store/apps',
    };
    const mockContact = {
      whatsappUrl: 'https://wa.me/6281234567890',
      phone: '+62 812-3456-7890',
      address: 'Jl. Raya Mahkota No. 123',
      socialMedia: { instagram: null, facebook: null },
    };

    // readCategory calls fs.readFile for each category
    vi.mocked(fs.readFile).mockImplementation(async (filePath) => {
      const p = filePath.toString();
      if (p.includes('statistics.json')) return JSON.stringify(mockStats);
      if (p.includes('testimonials.json')) return JSON.stringify(mockTestimonials);
      if (p.includes('services.json')) return JSON.stringify(mockServices);
      if (p.includes('registration.json')) return JSON.stringify(mockRegistration);
      if (p.includes('contact.json')) return JSON.stringify(mockContact);
      throw new Error('Unknown file');
    });

    const result = await readAllContent();

    expect(result).toHaveProperty('statistics');
    expect(result).toHaveProperty('testimonials');
    expect(result).toHaveProperty('services');
    expect(result).toHaveProperty('registration');
    expect(result).toHaveProperty('contact');
    expect(result.statistics).toEqual(mockStats);
    expect(result.testimonials).toEqual(mockTestimonials);
    expect(result.services).toEqual(mockServices);
    expect(result.registration).toEqual(mockRegistration);
    expect(result.contact).toEqual(mockContact);
  });
});
