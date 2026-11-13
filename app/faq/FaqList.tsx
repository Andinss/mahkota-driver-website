"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import type { FaqItem } from "@/types/content";

export default function FaqList({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
        <div className="space-y-3 md:space-y-4 mb-12 md:mb-16">
          {items.map((faq, index) => (
            <div
              key={faq.id}
              className="border border-ln rounded-2xl bg-surf overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full px-4 md:px-6 py-4 md:py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-bold text-ink text-base md:text-lg pr-4">
                  {faq.question}
                </span>
                <span className="ms text-mu shrink-0 text-[20px] md:text-[24px]">
                  <HugeiconsIcon
                    icon={openIndex === index ? ArrowUp01Icon : ArrowDown01Icon}
                    size="1em"
                  />
                </span>
              </button>
              <div
                className={`px-4 md:px-6 overflow-hidden transition-all duration-300 ${
                  openIndex === index
                    ? "max-h-[40rem] pb-4 md:pb-6 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p
                  className="text-mu leading-relaxed text-sm md:text-base"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
  );
}
