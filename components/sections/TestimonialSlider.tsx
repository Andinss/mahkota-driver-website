"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

/**
 * Slider horizontal berbasis scroll-snap untuk testimoni.
 * Dipakai saat jumlah testimoni lebih banyak dari yang muat dalam satu baris.
 */
export default function TestimonialSlider({
  children,
}: {
  children: ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  function scrollByCard(dir: -1 | 1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 24 : el.clientWidth;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={update}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="region"
        aria-label="Daftar testimoni"
        tabIndex={0}
      >
        {children}
      </div>

      <div className="flex justify-center gap-3 mt-6">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          disabled={!canPrev}
          aria-label="Testimoni sebelumnya"
          className="h-11 w-11 rounded-full border border-ln bg-surf flex items-center justify-center text-ink hover:border-ink transition-colors disabled:opacity-40 disabled:hover:border-ln"
        >
          <span className="ms text-[20px]">
            <HugeiconsIcon icon={ArrowLeft01Icon} size="1em" />
          </span>
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          disabled={!canNext}
          aria-label="Testimoni berikutnya"
          className="h-11 w-11 rounded-full border border-ln bg-surf flex items-center justify-center text-ink hover:border-ink transition-colors disabled:opacity-40 disabled:hover:border-ln"
        >
          <span className="ms text-[20px]">
            <HugeiconsIcon icon={ArrowRight01Icon} size="1em" />
          </span>
        </button>
      </div>
    </div>
  );
}
