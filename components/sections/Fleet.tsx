"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import type { FleetData, FleetVehicle } from "@/types/content";

const getWaLink = (text: string) =>
  `https://wa.me/6281234567890?text=${encodeURIComponent(text)}`;

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

  const tabs: { key: FilterType; label: string; icon: string }[] = [
    { key: "all", label: "Semua", icon: "directions_car" },
    { key: "best", label: "Terlaris", icon: "star" },
    { key: "matic", label: "Matic", icon: "settings" },
    { key: "manual", label: "Manual", icon: "tune" },
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
              <Icon name={tab.icon} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid">
          {filteredVehicles.map((car) => (
            <article key={car.id} className="car">
              {car.isBestSeller && (
                <span className="bs">
                  <Icon name="star" />
                  Terlaris
                </span>
              )}
              {car.imageUrl && (
                <div className="cp">
                  <img src={car.imageUrl} alt={car.name} loading="lazy" />
                </div>
              )}
              <div className="cf">
                <div>
                  <h3>{car.name}</h3>
                  <small className="capitalize">
                    {car.transmission} · {car.capacity} kursi
                  </small>
                  <p>Tahun {car.year}</p>
                </div>
                <a
                  className="go"
                  href={getWaLink(
                    `Halo Mahkota Drive, saya tertarik menyewa ${car.name}.`,
                  )}
                  target="_blank"
                  rel="noopener"
                  aria-label={`Tanya ${car.name}`}
                >
                  <Icon name="arrow_forward" />
                </a>
              </div>
            </article>
          ))}

          {filteredVehicles.length === 0 && (
            <p
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                color: "#A9B4C6",
                padding: "32px 0",
              }}
            >
              Belum ada armada di kategori ini.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
