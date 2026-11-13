"use client";

import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp01Icon } from "@hugeicons/core-free-icons";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 300);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check initial position
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Kembali ke atas"
      className={`btn bg-gold text-brand-black fixed bottom-6 right-6 z-50 !min-h-[44px] !min-w-[44px] !p-0 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:bg-gold-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <span className="ms text-[24px]">
        <HugeiconsIcon icon={ArrowUp01Icon} size="1em" />
      </span>
    </button>
  );
}
