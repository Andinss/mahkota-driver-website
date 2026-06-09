// tests/validation.test.ts
// Unit tests for Zod schemas and validateCategory function

import { describe, it, expect } from 'vitest';
import {
  statisticsSchema,
  testimonialsSchema,
  servicesSchema,
  registrationSchema,
  contactSchema,
  validateCategory,
} from '@/lib/validation';

describe('statisticsSchema', () => {
  const validData = {
    items: [
      { id: 'stat-1', label: 'Mitra Driver Aktif', value: 500, suffix: '+' },
      { id: 'stat-2', label: 'Unit Armada', value: 350, suffix: '+' },
      { id: 'stat-3', label: 'Kepuasan Mitra', value: 4.8, suffix: '/5', decimals: 1 },
    ],
  };

  it('should pass with valid data', () => {
    const result = statisticsSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail when label exceeds 30 characters', () => {
    const invalid = {
      items: [
        { id: 'stat-1', label: 'A'.repeat(31), value: 500, suffix: '+' },
        { id: 'stat-2', label: 'Unit Armada', value: 350, suffix: '+' },
        { id: 'stat-3', label: 'Kepuasan', value: 4.8, suffix: '/5' },
      ],
    };
    const result = statisticsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should fail when value is negative', () => {
    const invalid = {
      items: [
        { id: 'stat-1', label: 'Driver', value: -10, suffix: '+' },
        { id: 'stat-2', label: 'Armada', value: 350, suffix: '+' },
        { id: 'stat-3', label: 'Kepuasan', value: 4.8, suffix: '/5' },
      ],
    };
    const result = statisticsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe('testimonialsSchema', () => {
  const validData = {
    items: [
      { id: 'testi-1', name: 'Budi', photoUrl: null, quote: 'Bagus sekali!', rating: 5 },
      { id: 'testi-2', name: 'Ahmad', photoUrl: null, quote: 'Proses mudah.', rating: 4 },
      { id: 'testi-3', name: 'Siti', photoUrl: null, quote: 'Fleksibel.', rating: 5 },
    ],
  };

  it('should pass with valid data', () => {
    const result = testimonialsSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail when name is empty', () => {
    const invalid = {
      items: [
        { id: 'testi-1', name: '', photoUrl: null, quote: 'Bagus!', rating: 5 },
        { id: 'testi-2', name: 'Ahmad', photoUrl: null, quote: 'Ok.', rating: 4 },
        { id: 'testi-3', name: 'Siti', photoUrl: null, quote: 'Nice.', rating: 5 },
      ],
    };
    const result = testimonialsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should fail when rating exceeds 5', () => {
    const invalid = {
      items: [
        { id: 'testi-1', name: 'Budi', photoUrl: null, quote: 'Bagus!', rating: 6 },
        { id: 'testi-2', name: 'Ahmad', photoUrl: null, quote: 'Ok.', rating: 4 },
        { id: 'testi-3', name: 'Siti', photoUrl: null, quote: 'Nice.', rating: 5 },
      ],
    };
    const result = testimonialsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe('servicesSchema', () => {
  const validData = {
    services: [
      { id: 'svc-1', name: 'Harian', description: 'Sewa harian.', iconUrl: '/icon.svg', iconAlt: 'Ikon' },
      { id: 'svc-2', name: 'Mingguan', description: 'Sewa mingguan.', iconUrl: '/icon.svg', iconAlt: 'Ikon' },
      { id: 'svc-3', name: 'Bulanan', description: 'Sewa bulanan.', iconUrl: '/icon.svg', iconAlt: 'Ikon' },
    ],
    advantages: [
      { id: 'adv-1', title: 'Perawatan', description: 'Gratis servis.' },
      { id: 'adv-2', title: 'Support', description: '24 jam.' },
      { id: 'adv-3', title: 'DP Ringan', description: 'Deposit kecil.' },
    ],
  };

  it('should pass with valid data', () => {
    const result = servicesSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail when service description exceeds 150 characters', () => {
    const invalid = {
      services: [
        { id: 'svc-1', name: 'Harian', description: 'A'.repeat(151), iconUrl: '/icon.svg', iconAlt: 'Ikon' },
        { id: 'svc-2', name: 'Mingguan', description: 'Ok.', iconUrl: '/icon.svg', iconAlt: 'Ikon' },
        { id: 'svc-3', name: 'Bulanan', description: 'Ok.', iconUrl: '/icon.svg', iconAlt: 'Ikon' },
      ],
      advantages: [
        { id: 'adv-1', title: 'Perawatan', description: 'Gratis.' },
        { id: 'adv-2', title: 'Support', description: '24 jam.' },
        { id: 'adv-3', title: 'DP Ringan', description: 'Deposit kecil.' },
      ],
    };
    const result = servicesSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe('registrationSchema', () => {
  const validData = {
    steps: [
      { id: 'step-1', order: 1, title: 'Isi Formulir', description: 'Lengkapi data.', iconUrl: '/icon.svg' },
      { id: 'step-2', order: 2, title: 'Verifikasi', description: 'Unggah dokumen.', iconUrl: '/icon.svg' },
      { id: 'step-3', order: 3, title: 'Kontrak', description: 'Tanda tangan.', iconUrl: '/icon.svg' },
    ],
    estimateMinutes: 10,
    formUrl: 'https://forms.example.com/daftar',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.example',
  };

  it('should pass with valid data', () => {
    const result = registrationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail when steps are fewer than 3', () => {
    const invalid = {
      steps: [
        { id: 'step-1', order: 1, title: 'Isi', description: 'Data.', iconUrl: '/icon.svg' },
        { id: 'step-2', order: 2, title: 'Verif', description: 'Dokumen.', iconUrl: '/icon.svg' },
      ],
      estimateMinutes: 10,
      formUrl: 'https://forms.example.com/daftar',
      playStoreUrl: 'https://play.google.com/store/apps/details?id=com.example',
    };
    const result = registrationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should fail when estimateMinutes exceeds 15', () => {
    const invalid = {
      steps: [
        { id: 'step-1', order: 1, title: 'Isi', description: 'Data.', iconUrl: '/icon.svg' },
        { id: 'step-2', order: 2, title: 'Verif', description: 'Dokumen.', iconUrl: '/icon.svg' },
        { id: 'step-3', order: 3, title: 'Kontrak', description: 'TTD.', iconUrl: '/icon.svg' },
      ],
      estimateMinutes: 20,
      formUrl: 'https://forms.example.com/daftar',
      playStoreUrl: 'https://play.google.com/store/apps/details?id=com.example',
    };
    const result = registrationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe('contactSchema', () => {
  const validData = {
    whatsappUrl: 'https://wa.me/6281234567890',
    phone: '+62 812-3456-7890',
    address: 'Jl. Raya Mahkota No. 123, Bekasi',
    socialMedia: { instagram: 'https://instagram.com/test', facebook: null },
  };

  it('should pass with valid data', () => {
    const result = contactSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail when phone is empty', () => {
    const invalid = {
      whatsappUrl: 'https://wa.me/6281234567890',
      phone: '',
      address: 'Jl. Raya Mahkota No. 123',
      socialMedia: { instagram: null, facebook: null },
    };
    const result = contactSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe('validateCategory', () => {
  it('should return success for valid statistics data', () => {
    const validStats = {
      items: [
        { id: 'stat-1', label: 'Driver', value: 500, suffix: '+' },
        { id: 'stat-2', label: 'Armada', value: 350, suffix: '+' },
        { id: 'stat-3', label: 'Kepuasan', value: 4.8, suffix: '/5' },
      ],
    };
    const result = validateCategory('statistics', validStats);
    expect(result.success).toBe(true);
  });

  it('should return error for invalid data', () => {
    const invalidStats = { items: [] };
    const result = validateCategory('statistics', invalidStats);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });

  it('should return error for unknown category', () => {
    const result = validateCategory('unknown', {});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Invalid category');
    }
  });
});
