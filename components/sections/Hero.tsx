"use client";

import { useEffect, useState } from "react";
import Image from "next/image"; // Pastikan import Image
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  ArrowLeft01Icon,
  Car01Icon,
  Wrench01Icon,
  CustomerSupportIcon,
  Money03Icon,
} from "@hugeicons/core-free-icons";
import type { FleetData, ContactData } from "@/types/content"; // Tambah ContactData

export default function Hero({
  fleet,
  contact,
}: {
  fleet: FleetData;
  contact: ContactData;
}) {
  const [activeSlide, setActiveSlide] = useState(0);

  const vehicles =
    fleet.vehicles.length > 0
      ? fleet.vehicles.slice(0, 3)
      : [
          {
            id: "1",
            name: "Avanza",
            transmission: "matic" as const,
            imageUrl: "/images/hero-bg.webp",
            capacity: 7,
            year: 2023,
          },
          {
            id: "2",
            name: "Stargezer",
            transmission: "matic" as const,
            imageUrl: "/images/hero-bg.webp",
            capacity: 6,
            year: 2025,
          },
          {
            id: "3",
            name: "Rush",
            transmission: "matic" as const,
            imageUrl: "/images/hero-bg.webp",
            capacity: 7,
            year: 2026,
          },
        ];

  // Mengambil data dari JSON (fallback jika kosong)
  const rawHeadlines = contact?.heroHeadlines || [
    "Narik Online\nTanpa Beli\nMobil.",
    "Servis Gratis,\nSiap Jalan\nSetiap Hari.",
    "Daftar Cepat,\nMulai Narik\nHari Ini.",
  ];
  const rawSubheadlines = contact?.heroSubheadlines || [
    "Sewa armada harian, mingguan, atau bulanan. Langsung siap jalan.",
    "Perawatan dan bantuan darurat kami yang urus, Anda fokus narik.",
    "Isi formulir, tanda tangan digital, lalu ambil kunci.",
  ];

  // Memecah string berdasarkan enter (\n) agar sesuai layout 3 baris
  const slides = rawHeadlines.map((headline, idx) => ({
    t: headline.split("\n").slice(0, 3), // Maksimal 3 baris
    s: rawSubheadlines[idx] || "",
  }));

  useEffect(() => {
    const timer = setInterval(() => setActiveSlide((p) => (p + 1) % 3), 6500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero" aria-roledescription="carousel">
      <div className="w hg">
        <div className="txs">
          {slides.map((slide, idx) => (
            <div key={idx} className={`tx ${activeSlide === idx ? "on" : ""}`}>
              <h1>
                <span className="ln">
                  <span style={{ "--i": 0 } as React.CSSProperties}>
                    {slide.t[0]}
                  </span>
                </span>
                <span className="ln">
                  <span style={{ "--i": 1 } as React.CSSProperties}>
                    {slide.t[1]}
                  </span>
                </span>
                {slide.t[2] && (
                  <span className="ln y">
                    <span style={{ "--i": 2 } as React.CSSProperties}>
                      {slide.t[2]}
                    </span>
                  </span>
                )}
              </h1>
              <p className="sub">{slide.s}</p>
              <div className="cta">
                <a className="btn bd" href="/#kontak">
                  Daftar Sekarang{" "}
                  <span className="ms">
                    <HugeiconsIcon icon={ArrowRight01Icon} size="1em" />
                  </span>
                </a>
                <a className="btn bo" href="/#armada">
                  Lihat Armada
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* ... (Sisa kode stgs, trio, ctl SAMA PERSIS seperti sebelumnya) ... */}
        <div className="stgs">
          {vehicles.map((car, idx) => (
            <div
              key={car.id}
              className={`stg ${activeSlide === idx ? "on" : ""}`}
            >
              <span className="yc" />
              <svg
                className="sky"
                viewBox="0 0 300 160"
                fill="currentColor"
                aria-hidden="true"
              >
                <rect x="10" y="80" width="26" height="80" />
                <rect x="42" y="50" width="22" height="110" />
                <path d="M92 160V60l8-40 8 40v100z" />
                <rect x="118" y="70" width="30" height="90" />
                <rect x="154" y="96" width="24" height="64" />
                <rect x="184" y="40" width="26" height="120" />
                <rect x="216" y="84" width="30" height="76" />
                <rect x="252" y="64" width="22" height="96" />
              </svg>
              {car.imageUrl && (
                <div className="relative w-full h-full absolute inset-0">
                  <Image
                    src={car.imageUrl}
                    alt={car.name}
                    fill
                    className="carimg" // Class CSS lama tetap dipakai
                  />
                </div>
              )}
              <div className="ch">
                <span className="ms">
                  <HugeiconsIcon icon={Car01Icon} size="1em" />
                </span>
                <div>
                  <small>Tipe mobil</small>
                  <b className="capitalize">{car.transmission}</b>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="trio">
          <div>
            <span className="ms">
              <HugeiconsIcon icon={Wrench01Icon} size="1em" />
            </span>
            <span>
              Servis Gratis<small>Perawatan ditanggung</small>
            </span>
          </div>
          <div>
            <span className="ms">
              <HugeiconsIcon icon={CustomerSupportIcon} size="1em" />
            </span>
            <span>
              Dukungan 24 Jam<small>Bantuan di jalan</small>
            </span>
          </div>
          <div>
            <span className="ms">
              <HugeiconsIcon icon={Money03Icon} size="1em" />
            </span>
            <span>
              Tanpa DP Besar<small>Mulai lebih ringan</small>
            </span>
          </div>
        </div>
        <div className="ctl">
          <div className="dots">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                aria-label={`Ke slide ${i + 1}`}
                className={
                  activeSlide === i ? "on" : activeSlide > i ? "dn" : ""
                }
              >
                <i />
              </button>
            ))}
          </div>
          <div className="ar">
            <button
              onClick={() => setActiveSlide((p) => (p - 1 + 3) % 3)}
              aria-label="Slide sebelumnya"
            >
              <span className="ms">
                <HugeiconsIcon icon={ArrowLeft01Icon} size="1em" />
              </span>
            </button>
            <button
              onClick={() => setActiveSlide((p) => (p + 1) % 3)}
              aria-label="Slide berikutnya"
            >
              <span className="ms">
                <HugeiconsIcon icon={ArrowRight01Icon} size="1em" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
