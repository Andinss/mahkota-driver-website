// ============================================
// Fleet (Armada)
// ============================================
export interface FleetVehicle {
  id: string;
  name: string;
  year: number;
  capacity: number;
  transmission: "manual" | "matic";
  imageUrl?: string;
  isBestSeller?: boolean;
}

export interface FleetData {
  vehicles: FleetVehicle[];
}

// ============================================
// Contact (General)
// ============================================
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

  // TAMBAHAN BARU UNTUK 100% DINAMIS
  homeAboutText?: string;
  homeAboutPoints?: string[];
  aboutParagraphs?: string[];
  commitments?: { title: string; description: string; icon: string }[];
}

// ============================================
// Statistics
// ============================================
export interface StatisticItem {
  id: string;
  label: string;
  value: number;
  suffix: string;
  decimals?: number;
}

export interface StatisticsData {
  items: StatisticItem[];
}

// ============================================
// Testimonials
// ============================================
export interface Testimonial {
  id: string;
  name: string;
  description?: string;
  quote: string;
  rating: number;
  photoUrl: string | null;
}

export interface TestimonialsData {
  items: Testimonial[];
}

// ============================================
// Services & Advantages
// ============================================
export interface Service {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  iconAlt: string;
}

export interface Advantage {
  id: string;
  title: string;
  description: string;
  iconUrl?: string;
  iconAlt?: string;
}

export interface ServicesData {
  services: Service[];
  advantages: Advantage[];
}

// ============================================
// Registration (Cara Daftar)
// ============================================
export interface RegistrationStep {
  id: string;
  order: number;
  title: string;
  description: string;
  iconUrl: string;
}

export interface RegistrationData {
  steps: RegistrationStep[];
  estimateMinutes: number;
  formUrl: string;
  playStoreUrl: string;
}

// ============================================
// All Content (Gabungan)
// ============================================
export interface AllContent {
  statistics: StatisticsData;
  testimonials: TestimonialsData;
  services: ServicesData;
  registration: RegistrationData;
  contact: ContactData;
  fleet: FleetData;
}
