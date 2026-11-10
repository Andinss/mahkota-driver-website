import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, Clock01Icon } from "@hugeicons/core-free-icons";
import Icon from "@/components/ui/Icon";
import type { RegistrationData } from "@/types/content";

interface RegistrationProps {
  registration: RegistrationData;
}

export default function Registration({ registration }: RegistrationProps) {
  const sortedSteps = [...registration.steps].sort((a, b) => a.order - b.order);

  return (
    <div className="bg-gray-50">
      <div className="section-container section-padding">
        <div className="text-center mb-12">
          <h2 className="heading-secondary text-brand-black">Cara Bergabung</h2>
          <p className="mt-4 text-gray-500 font-body max-w-2xl mx-auto">
            Proses pendaftaran yang mudah dan cepat untuk menjadi mitra driver
            Mahkota Drive
          </p>
        </div>

        {/* Desktop */}
        <div className="hidden lg:flex items-stretch justify-center mb-12">
          {sortedSteps.map((step, index) => (
            <div key={step.id} className="flex items-stretch">
              <div className="flex flex-col items-center text-center w-44">
                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mb-3">
                  <Icon
                    name={step.icon ?? "assignment"}
                    className="text-[28px] text-yt"
                  />
                </div>
                <h3 className="font-heading text-sm font-bold text-brand-black mb-1">
                  {step.title}
                </h3>
                <p className="text-gray-500 font-body text-xs leading-relaxed">
                  {step.description}
                </p>
              </div>
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

        {/* Mobile */}
        <div className="lg:hidden space-y-0 mb-12">
          {sortedSteps.map((step, index) => (
            <div key={step.id}>
              <div className="flex items-start gap-4 py-4">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <Icon
                    name={step.icon ?? "assignment"}
                    className="text-[24px] text-yt"
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
              {index < sortedSteps.length - 1 && (
                <div
                  className="flex flex-col items-center w-12"
                  aria-hidden="true"
                >
                  <div className="w-0.5 h-4 bg-gold/40" />
                  <span className="ms text-[12px] text-gold/60">
                    <HugeiconsIcon icon={ArrowDown01Icon} size="1em" />
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mb-8">
          <p className="text-gray-500 font-body text-sm inline-flex items-center gap-2">
            <span className="ms text-[20px] text-gold">
              <HugeiconsIcon icon={Clock01Icon} size="1em" />
            </span>
            <span>
              Estimasi waktu:{" "}
              <strong className="text-brand-black">
                ~{registration.estimateMinutes} menit
              </strong>
            </span>
          </p>
        </div>

        <div className="text-center">
          <a
            href={registration.formUrl}
            className="btn bg-gold text-brand-black hover:bg-gold-light"
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
