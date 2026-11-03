"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import type { FleetData } from "@/types/content";

export default function AboutCTA({ fleet }: { fleet: FleetData }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Ambil gambar mobil pertama. Kalau kosong, pakai gambar default.
  const firstCar = fleet.vehicles[0];
  const carImage = firstCar?.imageUrl || "/images/hero-bg.webp";

  useEffect(() => {
    if (!ref.current) return;

    // Observer untuk mendeteksi saat kotak masuk ke layar
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    // Class "rv" dan "in" dikondisikan lewat state isVisible
    <div ref={ref} className={`pgz rv ${isVisible ? "in" : ""}`}>
      <div>
        <h2>
          Siap Mulai Narik <br />
          Bersama Kami?
        </h2>
        <p>
          Isi formulir singkat dan tim kami akan menghubungi Anda lewat
          WhatsApp.
        </p>
        <div className="cta" style={{ opacity: 1, marginTop: 26 }}>
          <a className="btn bd" href="/#kontak">
            Daftar Sekarang <Icon name="arrow_forward" />
          </a>
          <a className="btn bo" href="/#armada">
            Lihat Armada
          </a>
        </div>
      </div>

      {/* Tampilkan gambar jika URL-nya ada */}
      {carImage && <img src={carImage} alt="Armada" />}
    </div>
  );
}
