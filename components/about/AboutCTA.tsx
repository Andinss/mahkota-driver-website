"use client";

import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import type { FleetData } from "@/types/content";

export default function AboutCTA({ fleet }: { fleet: FleetData }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const firstCar = fleet.vehicles[0];
  const carImage = firstCar?.imageUrl || "/images/hero-bg.webp";

  useEffect(() => {
    if (!ref.current) return;
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
      {carImage && <img src={carImage} alt="Armada" />}
    </div>
  );
}
