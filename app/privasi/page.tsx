import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

export default function KebijakanPrivasiPage() {
  return (
    <div className="pg bg-white">
      <div className="w max-w-3xl px-4 md:px-0">
        <Link className="bk" href="/">
          <span className="ms">
            <HugeiconsIcon icon={ArrowLeft01Icon} size="1em" />
          </span>{" "}
          Kembali ke beranda
        </Link>
        <h1 className="text-2xl md:text-5xl font-extrabold text-ink tracking-tight mt-6 mb-8">
          Kebijakan <span className="y">Privasi</span>
        </h1>
        <div className="prose prose-sm md:prose-base max-w-none text-mu text-sm md:text-base">
          <p className="mb-4">
            Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}
          </p>

          <h2 className="text-xl font-bold text-ink mt-8 mb-3">
            1. Pengumpulan Informasi
          </h2>
          <p className="mb-4">
            Kami mengumpulkan informasi pribadi seperti nama, nomor telepon,
            alamat, dan data KTP/SIM hanya untuk keperluan verifikasi
            pendaftaran dan administrasi sewa-menyewa armada.
          </p>

          <h2 className="text-xl font-bold text-ink mt-8 mb-3">
            2. Penggunaan Data
          </h2>
          <p className="mb-4">
            Data Anda tidak akan dijual atau disewakan kepada pihak ketiga. Kami
            hanya menggunakan data Anda untuk komunikasi terkait layanan Mahkota
            Drive.
          </p>

          <h2 className="text-xl font-bold text-ink mt-8 mb-3">
            3. Keamanan Data
          </h2>
          <p className="mb-4">
            Kami berkomitmen menjaga keamanan data Anda dengan standar keamanan
            yang wajar dan tidak menyebarluaskan informasi pribadi tanpa izin
            Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
