import { statisticsSchema, testimonialsSchema, servicesSchema, registrationSchema, contactSchema, validateCategory } from './lib/validation';

// Test statisticsSchema - valid
const validStats = { items: [
  { id: '1', label: 'Drivers', value: 100, suffix: '+' },
  { id: '2', label: 'Fleet', value: 50, suffix: '+' },
  { id: '3', label: 'Rating', value: 4.8, suffix: '/5', decimals: 1 },
]};
const r1 = statisticsSchema.safeParse(validStats);
console.log('statisticsSchema valid:', r1.success);

// Test statisticsSchema - invalid (only 1 item)
const r2 = statisticsSchema.safeParse({ items: [{ id: '1', label: 'A', value: 0, suffix: '' }] });
console.log('statisticsSchema invalid (1 item):', !r2.success);

// Test statisticsSchema - invalid (label too long)
const r2b = statisticsSchema.safeParse({ items: [
  { id: '1', label: 'A'.repeat(31), value: 0, suffix: '' },
  { id: '2', label: 'B', value: 0, suffix: '' },
  { id: '3', label: 'C', value: 0, suffix: '' },
]});
console.log('statisticsSchema invalid (label > 30):', !r2b.success);

// Test testimonialsSchema - valid
const validTest = { items: [
  { id: '1', name: 'John', photoUrl: null, quote: 'Great service', rating: 5 },
  { id: '2', name: 'Jane', photoUrl: '/photo.jpg', quote: 'Excellent', rating: 4 },
  { id: '3', name: 'Bob', photoUrl: null, quote: 'Good', rating: 3 },
]};
const r3 = testimonialsSchema.safeParse(validTest);
console.log('testimonialsSchema valid:', r3.success);

// Test testimonialsSchema - invalid (rating 6)
const invalidTest = { items: [
  { id: '1', name: 'John', photoUrl: null, quote: 'Great', rating: 6 },
  { id: '2', name: 'Jane', photoUrl: null, quote: 'Good', rating: 4 },
  { id: '3', name: 'Bob', photoUrl: null, quote: 'Nice', rating: 3 },
]};
const r3b = testimonialsSchema.safeParse(invalidTest);
console.log('testimonialsSchema invalid (rating 6):', !r3b.success);

// Test servicesSchema - valid
const validServices = {
  services: [
    { id: '1', name: 'Daily', description: 'Daily rental', iconUrl: '/icon.svg', iconAlt: 'Daily icon' },
    { id: '2', name: 'Weekly', description: 'Weekly rental', iconUrl: '/icon.svg', iconAlt: 'Weekly icon' },
    { id: '3', name: 'Monthly', description: 'Monthly rental', iconUrl: '/icon.svg', iconAlt: 'Monthly icon' },
  ],
  advantages: [
    { id: '1', title: 'Affordable', description: 'Low prices' },
    { id: '2', title: 'Reliable', description: 'Always available' },
    { id: '3', title: 'Quality', description: 'Well maintained' },
  ],
};
const r4 = servicesSchema.safeParse(validServices);
console.log('servicesSchema valid:', r4.success);

// Test servicesSchema - invalid (description > 150)
const invalidServices = {
  services: [
    { id: '1', name: 'Daily', description: 'A'.repeat(151), iconUrl: '/icon.svg', iconAlt: 'Daily icon' },
    { id: '2', name: 'Weekly', description: 'Weekly rental', iconUrl: '/icon.svg', iconAlt: 'Weekly icon' },
    { id: '3', name: 'Monthly', description: 'Monthly rental', iconUrl: '/icon.svg', iconAlt: 'Monthly icon' },
  ],
  advantages: [
    { id: '1', title: 'Affordable', description: 'Low prices' },
    { id: '2', title: 'Reliable', description: 'Always available' },
    { id: '3', title: 'Quality', description: 'Well maintained' },
  ],
};
const r4b = servicesSchema.safeParse(invalidServices);
console.log('servicesSchema invalid (desc > 150):', !r4b.success);

// Test registrationSchema - valid
const validReg = {
  steps: [
    { id: '1', order: 1, title: 'Step 1', description: 'Desc 1', iconUrl: '/icon1.svg' },
    { id: '2', order: 2, title: 'Step 2', description: 'Desc 2', iconUrl: '/icon2.svg' },
    { id: '3', order: 3, title: 'Step 3', description: 'Desc 3', iconUrl: '/icon3.svg' },
  ],
  estimateMinutes: 10,
};
const r5 = registrationSchema.safeParse(validReg);
console.log('registrationSchema valid:', r5.success);

// Test registrationSchema - invalid (duplicate order)
const dupReg = {
  steps: [
    { id: '1', order: 1, title: 'Step 1', description: 'Desc 1', iconUrl: '/icon1.svg' },
    { id: '2', order: 1, title: 'Step 2', description: 'Desc 2', iconUrl: '/icon2.svg' },
    { id: '3', order: 3, title: 'Step 3', description: 'Desc 3', iconUrl: '/icon3.svg' },
  ],
  estimateMinutes: 10,
};
const r5b = registrationSchema.safeParse(dupReg);
console.log('registrationSchema invalid (dup order):', !r5b.success);

// Test registrationSchema - invalid (estimateMinutes out of range)
const invalidReg = { ...validReg, estimateMinutes: 20 };
const r5c = registrationSchema.safeParse(invalidReg);
console.log('registrationSchema invalid (estimate 20):', !r5c.success);

// Test contactSchema - valid
const validContact = {
  whatsappUrl: 'https://wa.me/628123456789',
  phone: '+628123456789',
  address: 'Jl. Contoh No. 1',
  socialMedia: { instagram: '@mahkotadrive', facebook: null },
};
const r6 = contactSchema.safeParse(validContact);
console.log('contactSchema valid:', r6.success);

// Test contactSchema - invalid (empty phone)
const invalidContact = { ...validContact, phone: '' };
const r6b = contactSchema.safeParse(invalidContact);
console.log('contactSchema invalid (empty phone):', !r6b.success);

// Test validateCategory
const r7 = validateCategory('statistics', validStats);
console.log('validateCategory statistics:', r7.success);

const r8 = validateCategory('invalid_category', {});
console.log('validateCategory invalid category:', !r8.success);

const r9 = validateCategory('contact', validContact);
console.log('validateCategory contact:', r9.success);

console.log('\n--- All validation tests completed ---');
