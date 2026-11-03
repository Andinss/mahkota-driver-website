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

export interface ContactData {
  whatsappUrl: string;
  phone: string;
  address: string;
  socialMedia: { instagram: string; facebook: string };
  heroDescription?: string;
  heroImageUrl?: string;
  appMockupUrl?: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: string;
}

export interface ServicesData {
  items: ServiceItem[];
}

export interface RegistrationData {
  playStoreUrl?: string;
}

export interface StatisticsData {
  items: { value: string; label: string; suffix?: string }[];
}

export interface TestimonialsData {
  items: { name: string; text: string; rating: number }[];
}

export interface AllContent {
  statistics: StatisticsData;
  testimonials: TestimonialsData;
  services: ServicesData;
  registration: RegistrationData;
  contact: ContactData;
  fleet: FleetData;
}
