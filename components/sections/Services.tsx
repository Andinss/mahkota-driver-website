import Image from 'next/image';
import type { ServicesData } from '@/types/content';

interface ServicesProps {
  services: ServicesData;
}

export default function Services({ services }: ServicesProps) {
  return (
    <div className="bg-gray-50">
      <div className="section-container section-padding">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="heading-secondary text-brand-black">Layanan Kami</h2>
          <p className="mt-4 text-gray-500 font-body max-w-2xl mx-auto">
            Pilihan paket sewa kendaraan yang fleksibel untuk kebutuhan Anda sebagai mitra driver
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {services.services.map((service) => (
            <div
              key={service.id}
              className="card-light hover:shadow-lg hover:-translate-y-1 transition-all duration-200 coarse-pointer:shadow-lg coarse-pointer:translate-y-0 flex flex-col items-center text-center"
            >
              <div className="mb-4 relative w-16 h-16">
                <Image
                  src={service.iconUrl}
                  alt={service.iconAlt}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <h3 className="font-heading text-lg font-bold text-brand-black mb-2">
                {service.name}
              </h3>
              <p className="text-gray-500 font-body text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Advantages Section */}
        <div className="mt-12">
          <h3 className="heading-secondary text-brand-black text-center mb-8">
            Keunggulan Kami
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.advantages.map((advantage) => (
              <div
                key={advantage.id}
                className="flex flex-col items-center text-center p-6"
              >
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                  {advantage.iconUrl ? (
                    <Image
                      src={advantage.iconUrl}
                      alt={advantage.iconAlt || advantage.title}
                      width={24}
                      height={24}
                      className="w-6 h-6 object-contain"
                    />
                  ) : (
                    <svg
                      className="w-6 h-6 text-gold"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <h4 className="font-heading text-base font-bold text-brand-black mb-2">
                  {advantage.title}
                </h4>
                <p className="text-gray-500 font-body text-sm">
                  {advantage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
