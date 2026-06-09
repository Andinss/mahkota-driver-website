// types/content.ts
// TypeScript interfaces for all content data categories

export interface StatisticItem {
  id: string;
  label: string; // 1–30 karakter
  value: number; // integer ≥ 0 atau float 1.0–5.0
  suffix: string;
  decimals?: number;
}

export interface Testimonial {
  id: string;
  name: string; // non-kosong
  description?: string; // e.g. "Driver Gojek Jakarta"
  photoUrl: string | null;
  quote: string; // non-kosong
  rating: number; // integer 1–5
}

export interface Service {
  id: string;
  name: string;
  description: string; // ≤ 150 karakter
  iconUrl: string;
  iconAlt: string; // non-kosong
}

export interface Advantage {
  id: string;
  title: string;
  description: string; // ≤ 100 karakter
  iconUrl?: string;
  iconAlt?: string;
}

export interface FleetVehicle {
  id: string;
  name: string;       // nama/tipe kendaraan
  year: number;        // tahun kendaraan
  capacity: number;    // kapasitas penumpang
  transmission: 'manual' | 'matic';
  imageUrl?: string;
}

export interface FleetData {
  vehicles: FleetVehicle[];
}

export interface RegistrationStep {
  id: string;
  order: number; // unik
  title: string; // non-kosong
  description: string; // non-kosong
  iconUrl: string;
}

export interface StatisticsData {
  items: StatisticItem[];
}

export interface TestimonialsData {
  items: Testimonial[];
}

export interface ServicesData {
  services: Service[];
  advantages: Advantage[];
}

export interface RegistrationData {
  steps: RegistrationStep[];
  estimateMinutes: number; // 5–15
  formUrl: string;
  playStoreUrl: string;
}

export interface ContactData {
  whatsappUrl: string;
  phone: string;
  address: string;
  socialMedia: {
    instagram: string | null;
    facebook: string | null;
  };
  heroDescription?: string;
  heroImageUrl?: string;
  appMockupUrl?: string;
}

export interface AllContent {
  statistics: StatisticsData;
  testimonials: TestimonialsData;
  services: ServicesData;
  registration: RegistrationData;
  contact: ContactData;
  fleet: FleetData;
}
