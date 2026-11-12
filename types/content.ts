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
  /** Harga sewa harian (dalam Rupiah, angka saja) */
  price?: number;
  /** Biaya join fee / deposit (dalam Rupiah, angka saja) */
  joinFee?: number;
  /** Deskripsi singkat / solusi untuk driver */
  description?: string;
  /** List keunggulan spesifik mobil */
  features?: string[];
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
    instagram: string;
    facebook: string;
  };
  heroDescription?: string;
  heroImageUrl?: string;
  appMockupUrl?: string;

  homeAboutText?: string;
  homeAboutPoints?: string[];
  aboutParagraphs?: string[];
  commitments?: { title: string; description: string; icon: string }[];

  // --- TAMBAHAN UNTUK HERO DINAMIS ---
  heroHeadlines?: string[];
  heroSubheadlines?: string[];
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
  iconAlt: string;
  /** Hugeicons key (see ICON_MAP in components/ui/Icon.tsx). */
  icon?: string;
}

export interface Advantage {
  id: string;
  title: string;
  description: string;
  iconAlt?: string;
  /** Hugeicons key (see ICON_MAP in components/ui/Icon.tsx). */
  icon?: string;
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
  /** Hugeicons key (see ICON_MAP). */
  icon?: string;
}

export interface RegistrationData {
  steps: RegistrationStep[];
  /** Dipakai di kalimat "Mendaftar hanya sekitar N menit" pada bagian Cara Bergabung. */
  estimateMinutes: number;
}

// ============================================
// FAQ
// ============================================
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqData {
  items: FaqItem[];
}

// ============================================
// Halaman legal (Syarat & Ketentuan, Kebijakan Privasi)
// ============================================
export interface LegalSection {
  id: string;
  title: string;
  /**
   * Isi bagian. Paragraf dipisah satu baris kosong; baris yang diawali "- "
   * ditampilkan sebagai daftar poin.
   */
  body: string;
}

export interface LegalData {
  /** Tanggal terakhir diubah dari admin, format YYYY-MM-DD. */
  updatedAt: string;
  sections: LegalSection[];
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
  faq: FaqData;
  terms: LegalData;
  privacy: LegalData;
}
