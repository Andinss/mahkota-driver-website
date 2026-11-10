"use client";

import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
} from "@hugeicons/core-free-icons";

const FAQS = [
  {
    q: "Apa saja syarat untuk bergabung menjadi mitra driver?",
    a: "Syaratnya sangat mudah: KTP, SIM A yang masih berlaku, dan membayar deposit/join fee sesuai unit yang dipilih. Tidak perlu BI Checking atau antre panjang. Setelah dokumen lengkap, unit langsung bisa dibawa.",
  },
  {
    q: "Apakah ada potongan dari penghasilan harian saya?",
    a: "Tidak ada. Anda hanya membayar setoran sewa harian sesuai tarif yang disepakati di awal. Seluruh sisa penghasilan dari aplikasi sepenuhnya menjadi milik Anda.",
  },
  {
    q: "Bagaimana jika mobil mogok atau mengalami kecelakaan?",
    a: "Tim support kami siaga 24 jam. Jika terjadi mogok atau kendala di jalan, segera hubungi CS kami. Kami akan mengirimkan bantuan darurat atau unit pengganti agar Anda tetap bisa narik.",
  },
  {
    q: "Apakah unit sudah termasuk pajak dan perawatan?",
    a: "Ya. Semua unit Mahkota Drive sudah termasuk pajak tahunan, servis rutin berkala, dan perawatan mesin. Anda hanya perlu mengisi bahan bakar dan menjalankan operasional harian.",
  },
  {
    q: "Berapa lama proses pendaftaran sampai mobil bisa dibawa?",
    a: "Prosesnya sangat cepat, biasanya kurang dari 15 menit. Setelah Anda mengisi formulir online dan verifikasi dokumen via WhatsApp, unit bisa langsung diambil di lokasi kami.",
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="pg bg-white">
      <div className="w max-w-3xl px-4 md:px-0">
        <Link className="bk" href="/">
          <span className="ms">
            <HugeiconsIcon icon={ArrowLeft01Icon} size="1em" />
          </span>{" "}
          Kembali ke beranda
        </Link>

        <div className="text-center mb-8 md:mb-12 mt-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-ink tracking-tight mb-3 md:mb-4">
            Pertanyaan <span className="y">Umum</span>
          </h1>
          <p className="text-mu text-base md:text-lg">
            Punya pertanyaan seputar layanan Mahkota Drive? Temukan jawabannya
            di sini.
          </p>
        </div>

        <div className="space-y-3 md:space-y-4 mb-12 md:mb-16">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className="border border-ln rounded-2xl bg-surf overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full px-4 md:px-6 py-4 md:py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-bold text-ink text-base md:text-lg pr-4">
                  {faq.q}
                </span>
                <span className="ms text-mu shrink-0 text-[20px] md:text-[24px]">
                  <HugeiconsIcon
                    icon={openIndex === index ? ArrowUp01Icon : ArrowDown01Icon}
                    size="1em"
                  />
                </span>
              </button>
              <div
                className={`px-4 md:px-6 overflow-hidden transition-all duration-300 ${
                  openIndex === index
                    ? "max-h-96 pb-4 md:pb-6 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-mu leading-relaxed text-sm md:text-base">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center bg-bg p-6 md:p-8 rounded-3xl border border-ln">
          <h2 className="text-lg md:text-xl font-bold text-ink mb-2">
            Masih ada pertanyaan?
          </h2>
          <p className="text-mu mb-6 text-sm md:text-base">
            Tim kami siap membantu Anda kapan saja.
          </p>
          <a
            href="https://wa.me/6289531536509?text=Halo%20Mahkota%20Drive,%20saya%20ingin%20bertanya."
            target="_blank"
            rel="noopener noreferrer"
            className="btn by w-full md:w-auto"
          >
            Hubungi Kami via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
