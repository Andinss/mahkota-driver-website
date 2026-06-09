import Image from 'next/image';
import PlayStoreButton from '@/components/ui/PlayStoreButton';

interface DownloadProps {
  playStoreUrl: string;
  appMockupUrl?: string;
}

export default function Download({ playStoreUrl, appMockupUrl }: DownloadProps) {
  const mockupSrc = appMockupUrl || '/images/app-mockup.webp';

  return (
    <div className="bg-brand-dark">
      <div className="section-container section-padding">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Text + Button Column */}
          <div className="text-center lg:text-left">
            <h2 className="heading-secondary text-white">
              Download Aplikasi Mahkota Drive
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-300 md:text-lg">
              Kelola rental kendaraan Anda langsung dari genggaman. Dengan
              aplikasi Mahkota Drive, Anda bisa memantau status sewa, melihat
              riwayat transaksi, dan menghubungi tim support kapan saja.
            </p>
            <div className="mt-8">
              <PlayStoreButton url={playStoreUrl} />
            </div>
          </div>

          {/* App Mockup Column */}
          <div className="flex justify-center lg:justify-end">
            <Image
              src={mockupSrc}
              alt="Tampilan aplikasi Mahkota Drive di smartphone"
              width={280}
              height={560}
              className="h-auto w-auto max-w-[280px]"
              priority={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
