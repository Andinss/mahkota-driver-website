"use client";

import { useEffect, useRef } from "react";
import { CountUp } from "countup.js";
import type { StatisticsData } from "@/types/content";

interface StatisticsProps {
  statistics: StatisticsData;
}

export default function Statistics({ statistics }: StatisticsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const countUpRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          startCountUp();
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  function startCountUp() {
    statistics.items.forEach((item, index) => {
      const el = countUpRefs.current[index];
      if (!el) return;

      try {
        const countUp = new CountUp(el, item.value, {
          duration: 2,
          useEasing: true,
          decimalPlaces: item.decimals || 0,
        });

        if (!countUp.error) {
          countUp.start();
        } else {
          // Fallback: show final value directly
          el.textContent = formatValue(item.value, item.decimals);
        }
      } catch {
        // Fallback: if CountUp fails to initialize, show final value
        el.textContent = formatValue(item.value, item.decimals);
      }
    });
  }

  function formatValue(value: number, decimals?: number): string {
    return decimals ? value.toFixed(decimals) : value.toString();
  }

  return (
    <div ref={sectionRef} className="bg-brand-black">
      <div className="section-container section-padding">
        <div className="flex flex-wrap justify-center gap-8 md:flex-nowrap md:justify-around">
          {statistics.items.map((item, index) => (
            <div
              key={item.id}
              className="flex flex-col items-center text-center"
            >
              <span
                ref={(el) => {
                  countUpRefs.current[index] = el;
                }}
                className="text-gold font-heading text-4xl font-bold md:text-5xl lg:text-6xl"
                aria-label={`${item.label}: ${formatValue(item.value, item.decimals)}${item.suffix}`}
              >
                {formatValue(item.value, item.decimals)}
              </span>
              <span className="text-gold font-heading text-2xl md:text-3xl">
                {item.suffix}
              </span>
              <span className="mt-2 text-sm text-gray-300 md:text-base">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
