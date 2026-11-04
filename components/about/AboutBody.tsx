"use client";

import { useEffect, useRef } from "react";
import Icon from "@/components/ui/Icon";
import type { ContactData } from "@/types/content";

export default function AboutBody({ contact }: { contact: ContactData }) {
  const ref = useRef<HTMLDivElement>(null);
  const paragraphs = contact.aboutParagraphs || [];

  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll(".rv");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="pgb">
      <div className="pgt">
        {paragraphs.map((text, i) => (
          <p key={i} className="rv" style={{ "--d": i } as React.CSSProperties}>
            {text}
          </p>
        ))}
      </div>
      <aside className="pga rv" style={{ "--d": 2 } as React.CSSProperties}>
        <ul className="ck">
          <li>
            <Icon name="check_circle" /> Unit dirawat berkala dan siap jalan
          </li>
          <li>
            <Icon name="check_circle" /> Sewa harian, mingguan, atau bulanan
          </li>
          <li>
            <Icon name="check_circle" /> Kontrak digital, proses cepat
          </li>
        </ul>
        <a className="btn bd" href="/#kontak" style={{ width: "100%" }}>
          Daftar Sekarang <Icon name="arrow_forward" />
        </a>
      </aside>
    </div>
  );
}
