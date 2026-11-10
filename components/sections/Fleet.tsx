"use client";

import { useState } from "react";
import Image from "next/image";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Car01Icon,
  StarIcon,
  Settings02Icon,
  SlidersHorizontalIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import type { FleetData, FleetVehicle } from "@/types/content";

const getWaLink = (text: string) =>
  `https://wa.me/6289531536509?text=${encodeURIComponent(text)}`;

type FilterType = "all" | "best" | "matic" | "manual";

export default function Fleet({ fleet }: { fleet: FleetData }) {
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredVehicles: FleetVehicle[] = fleet.vehicles.filter((car) => {
    if (filter === "all") return true;
    if (filter === "matic") return car.transmission === "matic";
    if (filter === "manual") return car.transmission === "manual";
    if (filter === "best") return car.isBestSeller === true;
    return true;
  });

  // Gunakan IconSvgElement dari @hugeicons/react, bukan ElementType
  const tabs: { key: FilterType; label: string; icon: IconSvgElement }[] = [
    { key: "all", label: "Semua", icon: Car01Icon },
    { key: "best", label: "Terlaris", icon: StarIcon },
    { key: "matic", label: "Matic", icon: Settings02Icon },
    { key: "manual", label: "Manual", icon: SlidersHorizontalIcon },
  ];

  return (
    <section className="sec nv2" id="armada">
      <div className="w">
        <div className="fh">
          <h2>
            Armada <span className="y">Terlaris</span>
          </h2>
        </div>

        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              aria-pressed={filter === tab.key}
            >
              <span className="ms">
                <HugeiconsIcon icon={tab.icon} size="1em" />
              </span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid">
          {filteredVehicles.map((car) => (
            <article key={car.id} className="car flex flex-col h-full">
              {car.isBestSeller && (
                <span className="bs">
                  <span className="ms">
                    <HugeiconsIcon icon={StarIcon} size="1em" />
                  </span>
                  Terlaris
                </span>
              )}

              {/* Image Container */}
              {car.imageUrl && (
                <div className="cp relative w-full h-[200px] mb-4">
                  <Image
                    src={car.imageUrl}
                    alt={car.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              <div className="cf flex-col items-start gap-2 flex-1">
                <div className="w-full">
                  <h3 className="text-lg font-bold">{car.name}</h3>
                  <small className="text-sm text-[#a9b4c6] capitalize">
                    {car.transmission} · {car.capacity} Kursi · {car.year}
                  </small>
                </div>
              </div>

              <div className="mt-auto pt-4 w-full">
                <a
                  className="btn by w-full justify-center"
                  href={getWaLink(
                    `Halo Mahkota Drive, saya tertarik menyewa ${car.name}. Bisa info detailnya?`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tanya Sewa
                  <span className="ms">
                    <HugeiconsIcon icon={ArrowRight01Icon} size="1em" />
                  </span>
                </a>
              </div>
            </article>
          ))}

          {filteredVehicles.length === 0 && (
            <p className="col-span-full text-center py-8 text-[#a9b4c6]">
              Belum ada armada di kategori ini.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
