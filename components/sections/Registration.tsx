import Image from 'next/image';
import type { RegistrationData } from '@/types/content';

interface RegistrationProps {
  registration: RegistrationData;
}

export default function Registration({ registration }: RegistrationProps) {
  const sortedSteps = [...registration.steps].sort((a, b) => a.order - b.order);

  return (
    <div className="bg-gray-50">
      <div className="section-container section-padding">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="heading-secondary text-brand-black">Cara Bergabung</h2>
          <p className="mt-4 text-gray-500 font-body max-w-2xl mx-auto">
            Proses pendaftaran yang mudah dan cepat untuk menjadi mitra driver Mahkota Drive
          </p>
        </div>

        {/* Steps — Desktop: horizontal with connectors */}
        <div className="hidden lg:flex items-stretch justify-center mb-12">
          {sortedSteps.map((step, index) => (
            <div key={step.id} className="flex items-stretch">
              {/* Step Card */}
              <div className="flex flex-col items-center text-center w-44">
                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mb-3">
                  <Image
                    src={step.iconUrl}
                    alt={step.title}
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <h3 className="font-heading text-sm font-bold text-brand-black mb-1">
                  {step.title}
                </h3>
                <p className="text-gray-500 font-body text-xs leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector line between steps */}
              {index < sortedSteps.length - 1 && (
                <div className="flex items-center px-2" aria-hidden="true">
                  <div className="w-10 h-0.5 bg-gold/40 relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-gold/60" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Steps — Mobile/Tablet: vertical with connectors */}
        <div className="lg:hidden space-y-0 mb-12">
          {sortedSteps.map((step, index) => (
            <div key={step.id}>
              {/* Step */}
              <div className="flex items-start gap-4 py-4">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <Image
                    src={step.iconUrl}
                    alt={step.title}
                    width={28}
                    height={28}
                    className="w-7 h-7 object-contain"
                  />
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-heading text-base font-bold text-brand-black">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 font-body text-sm mt-1 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Vertical connector with arrow — aligned under the icon */}
              {index < sortedSteps.length - 1 && (
                <div className="flex flex-col items-center w-12" aria-hidden="true">
                  <div className="w-0.5 h-4 bg-gold/40" />
                  <svg className="w-3 h-3 text-gold/60" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M6 9L1.5 4.5h9L6 9z" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Estimate Time */}
        <div className="text-center mb-8">
          <p className="text-gray-500 font-body text-sm inline-flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gold"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Estimasi waktu: <strong className="text-brand-black">~{registration.estimateMinutes} menit</strong>
            </span>
          </p>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <a
            href={registration.formUrl}
            className="btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Daftar Sekarang
          </a>
        </div>
      </div>
    </div>
  );
}
