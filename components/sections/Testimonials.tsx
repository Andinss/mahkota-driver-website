'use client';

import { useState, useEffect } from 'react';
import type { TestimonialsData, Testimonial } from '@/types/content';
import Avatar from '@/components/ui/Avatar';
import StarRating from '@/components/ui/StarRating';

interface TestimonialsProps {
  testimonials: TestimonialsData;
}

/**
 * Testimonial card component used in both carousel and grid layouts.
 */
function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <div className="card-dark flex flex-col">
      {/* Header: Avatar + Name + Description */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar
          name={item.name}
          photoUrl={item.photoUrl}
          size={48}
        />
        <div className="min-w-0">
          <h3 className="font-body text-base font-semibold text-white truncate">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-xs text-gray-400 truncate">{item.description}</p>
          )}
        </div>
      </div>
      {/* Rating */}
      <div className="mb-3">
        <StarRating rating={item.rating} />
      </div>
      {/* Quote */}
      <blockquote className="font-body text-sm leading-relaxed text-gray-300 flex-1">
        &ldquo;{item.quote}&rdquo;
      </blockquote>
    </div>
  );
}

/**
 * Static grid layout used on desktop and as fallback when Swiper fails.
 */
function TestimonialsGrid({ items }: { items: Testimonial[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <TestimonialCard key={item.id} item={item} />
      ))}
    </div>
  );
}

/**
 * Swiper carousel wrapper for mobile viewport.
 * Dynamically imports Swiper to handle load failures gracefully.
 */
function SwiperCarousel({ items }: { items: Testimonial[] }) {
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
        // Import Swiper CSS
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

  // Fallback: if Swiper failed to load, show grid
  if (loadFailed) {
    return <TestimonialsGrid items={items} />;
  }

  // Loading state while Swiper is being imported
  if (!SwiperComponents) {
    return <TestimonialsGrid items={items} />;
  }

  const { Swiper, SwiperSlide, Pagination } = SwiperComponents;

  return (
    <Swiper
      modules={[Pagination]}
      pagination={{ clickable: true }}
      slidesPerView={1}
      spaceBetween={16}
      className="testimonials-swiper"
    >
      {items.map((item) => (
        <SwiperSlide key={item.id}>
          <TestimonialCard item={item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const { items } = testimonials;

  return (
    <div className="bg-brand-black">
      <div className="section-container section-padding">
        <h2 className="heading-secondary mb-10 text-center text-white">
          Testimoni Mitra Driver
        </h2>

        {/* Mobile: Swiper carousel (hidden on md+) */}
        <div className="md:hidden">
          <SwiperCarousel items={items} />
        </div>

        {/* Desktop: Static grid (hidden below md) */}
        <div className="hidden md:block">
          <TestimonialsGrid items={items} />
        </div>
      </div>
    </div>
  );
}
