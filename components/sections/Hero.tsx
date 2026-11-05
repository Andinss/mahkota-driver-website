"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import type { FleetData } from "@/types/content";

const SLIDES = [
  {
    t: ["Narik Online", "Tanpa Beli", "Mobil."],
    s: "Sewa armada harian, mingguan, atau bulanan. Langsung siap jalan.",
  },
  {
    t: ["Servis Gratis,", "Siap Jalan", "Setiap Hari."],
    s: "Perawatan dan bantuan darurat kami yang urus, Anda fokus narik.",
  },
  {
    t: ["Daftar Cepat,", "Mulai Narik", "Hari Ini."],
    s: "Isi formulir, tanda tangan digital, lalu ambil kunci.",
  },
];

export default function Hero({ fleet }: { fleet: FleetData }) {
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

  useEffect(() => {
    const timer = setInterval(() => setActiveSlide((p) => (p + 1) % 3), 6500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero" aria-roledescription="carousel">
      <div className="w hg">
        <div className="txs">
          {SLIDES.map((slide, idx) => (
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
                <span className="ln y">
                  <span style={{ "--i": 2 } as React.CSSProperties}>
                    {slide.t[2]}
                  </span>
                </span>
              </h1>
              <p className="sub">{slide.s}</p>
              <div className="cta">
                <a className="btn bd" href="/#kontak">
                  Daftar Sekarang <Icon name="arrow_forward" />
                </a>
                <a className="btn bo" href="/#armada">
                  Lihat Armada
                </a>
              </div>
            </div>
          ))}
        </div>
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
                <img className="carimg" src={car.imageUrl} alt={car.name} />
              )}
              <div className="ch">
                <Icon name="directions_car" />
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
            <Icon name="build" />
            <span>
              Servis Gratis<small>Perawatan ditanggung</small>
            </span>
          </div>
          <div>
            <Icon name="support_agent" />
            <span>
              Dukungan 24 Jam<small>Bantuan di jalan</small>
            </span>
          </div>
          <div>
            <Icon name="payments" />
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
              <Icon name="arrow_back" />
            </button>
            <button
              onClick={() => setActiveSlide((p) => (p + 1) % 3)}
              aria-label="Slide berikutnya"
            >
              <Icon name="arrow_forward" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
