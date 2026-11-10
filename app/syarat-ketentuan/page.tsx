import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

export default function SyaratKetentuanPage() {
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
          Syarat & <span className="y">Ketentuan</span>
        </h1>
        <div className="prose prose-sm md:prose-base max-w-none text-mu text-sm md:text-base">
          <p className="mb-4">
            Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}
          </p>

          <h2 className="text-xl font-bold text-ink mt-8 mb-3">
            1. Ketentuan Umum
          </h2>
          <p className="mb-4">
            Dengan mendaftar sebagai mitra driver Mahkota Drive, Anda dianggap
            telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan
            yang berlaku.
          </p>

          <h2 className="text-xl font-bold text-ink mt-8 mb-3">
            2. Syarat Pendaftaran
          </h2>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Memiliki KTP yang masih berlaku.</li>
            <li>Memiliki SIM A yang masih berlaku.</li>
            <li>Membayar deposit/join fee sesuai unit yang dipilih.</li>
          </ul>

          <h2 className="text-xl font-bold text-ink mt-8 mb-3">
            3. Kewajiban Mitra
          </h2>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Membayar setoran harian tepat waktu sesuai kesepakatan.</li>
            <li>Menjaga kebersihan dan kondisi kendaraan.</li>
            <li>Tidak menyalahgunakan kendaraan untuk tindak kriminal.</li>
          </ul>

          <h2 className="text-xl font-bold text-ink mt-8 mb-3">
            4. Denda & Keterlambatan
          </h2>
          <p className="mb-4">
            Keterlambatan pembayaran setoran akan dikenakan denda sesuai
            kebijakan perusahaan. Jika terjadi penunggakan dalam jangka waktu
            lama, pihak perusahaan berhak menarik kembali unit kendaraan.
          </p>
        </div>
      </div>
    </div>
  );
}
