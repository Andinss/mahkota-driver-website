'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { FleetData, FleetVehicle } from '@/types/content';

interface FleetProps {
  fleet: FleetData;
}

function VehicleCard({ vehicle }: { vehicle: FleetVehicle }) {
  return (
    <div className="bg-brand-card rounded-xl overflow-hidden border border-white/5 hover:border-gold/30 transition-all duration-200 h-full">
      {vehicle.imageUrl ? (
        <div className="relative h-44 w-full bg-brand-dark">
          <Image src={vehicle.imageUrl} alt={vehicle.name} fill className="object-cover" />
        </div>
      ) : (
        <div className="h-44 w-full bg-brand-dark flex items-center justify-center">
          <svg className="h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
          </svg>
        </div>
      )}
      <div className="p-5">
        <h3 className="font-heading text-lg font-bold text-white mb-3">{vehicle.name}</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xs text-gray-500 mb-1">Tahun</p>
            <p className="text-sm font-medium text-gold">{vehicle.year}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Kapasitas</p>
            <p className="text-sm font-medium text-gold">{vehicle.capacity} org</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Transmisi</p>
            <p className="text-sm font-medium text-gold capitalize">{vehicle.transmission}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FleetGrid({ vehicles }: { vehicles: FleetVehicle[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}

function FleetCarousel({ vehicles }: { vehicles: FleetVehicle[] }) {
  const [SwiperComponents, setSwiperComponents] = useState<{
    Swiper: typeof import('swiper/react').Swiper;
    SwiperSlide: typeof import('swiper/react').SwiperSlide;
    Pagination: typeof import('swiper/modules').Pagination;
  } | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    async function loadSwiper() {
      try {
        const [swiperReact, swiperModules] = await Promise.all([
          import('swiper/react'),
          import('swiper/modules'),
        ]);
        await import('swiper/css');
        await import('swiper/css/pagination');
        setSwiperComponents({
          Swiper: swiperReact.Swiper,
          SwiperSlide: swiperReact.SwiperSlide,
          Pagination: swiperModules.Pagination,
        });
      } catch {
        setLoadFailed(true);
      }
    }
    loadSwiper();
  }, []);

  if (loadFailed || !SwiperComponents) {
    return <FleetGrid vehicles={vehicles} />;
  }

  const { Swiper, SwiperSlide, Pagination } = SwiperComponents;

  return (
    <Swiper
      modules={[Pagination]}
      pagination={{ clickable: true }}
      slidesPerView={1.15}
      spaceBetween={16}
      className="fleet-swiper"
    >
      {vehicles.map((vehicle) => (
        <SwiperSlide key={vehicle.id}>
          <VehicleCard vehicle={vehicle} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default function Fleet({ fleet }: FleetProps) {
  return (
    <div className="bg-brand-black">
      <div className="section-container section-padding">
        <div className="text-center mb-12">
          <h2 className="heading-secondary text-white">Katalog Armada</h2>
          <p className="mt-4 text-gray-400 font-body max-w-2xl mx-auto">
            Pilihan kendaraan berkualitas yang siap menemani perjalanan Anda
          </p>
        </div>

        {/* Mobile: Swiper carousel */}
        <div className="md:hidden">
          <FleetCarousel vehicles={fleet.vehicles} />
        </div>

        {/* Desktop: Static grid */}
        <div className="hidden md:block">
          <FleetGrid vehicles={fleet.vehicles} />
        </div>
      </div>
    </div>
  );
}
