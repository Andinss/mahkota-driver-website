"use client";

import { useEffect, useRef, useState } from "react";

interface StatCounterProps {
  value: number;
  decimals?: number;
  suffix?: string;
}

export default function StatCounter({
  value,
  decimals = 0,
  suffix = "",
}: StatCounterProps) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true);
          const duration = 1600;
          const startTime = performance.now();

          const animate = (time: number) => {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setDisplay(value * easeOut);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.6 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, triggered]);

  return (
    <span ref={ref}>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
