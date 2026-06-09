import Image from "next/image";
import PlayStoreButton from "@/components/ui/PlayStoreButton";
import type { ContactData } from "@/types/content";

interface HeroProps {
  contact: ContactData;
  playStoreUrl: string;
}

const DEFAULT_DESCRIPTION =
  "Mahkota Drive adalah penyedia jasa rental armada kendaraan terpercaya yang dirancang khusus untuk para supir taksi online di Indonesia. Kami memahami bahwa memiliki kendaraan sendiri bukan syarat utama untuk meraih penghasilan — yang Anda butuhkan adalah akses ke armada berkualitas dengan biaya sewa yang terjangkau. Dengan pilihan skema sewa harian, mingguan, dan bulanan, kami memberikan fleksibilitas penuh bagi mitra driver untuk menjalankan aktivitas di platform ride-hailing favorit mereka. Seluruh unit armada kami dirawat secara berkala demi kenyamanan dan keselamatan di jalan. Bergabunglah bersama ratusan mitra driver yang telah mempercayakan perjalanan karier mereka kepada Mahkota Drive dan rasakan kemudahan bermitra bersama kami.";

export default function Hero({ contact, playStoreUrl }: HeroProps) {
  const description = contact.heroDescription || DEFAULT_DESCRIPTION;
  const heroImage = contact.heroImageUrl || "/images/hero-bg.webp";

  return (
    <div className="bg-brand-black">
      <div className="section-container section-padding">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          {/* Text content — left column */}
          <div className="text-white">
            <h1 className="font-heading text-[clamp(32px,5vw,56px)] font-bold leading-tight text-white">
              Mahkota Drive
            </h1>

            <p className="mt-6 max-w-xl font-body text-base leading-relaxed text-gray-300 md:text-lg">
              {description}
            </p>

            <div className="mt-8">
              <PlayStoreButton url={playStoreUrl} />
            </div>
          </div>

          {/* Hero image — right column */}
          <div className="relative flex items-center justify-center">
            <Image
              src={heroImage}
              alt="Armada kendaraan Mahkota Drive siap melayani mitra driver taksi online"
              width={600}
              height={500}
              className="rounded-lg object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
