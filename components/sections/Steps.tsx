"use client";

import { useEffect, useRef } from "react";
import type { RegistrationData } from "@/types/content";

export default function Steps({
  registration,
}: {
  registration: RegistrationData;
}) {
  const timelineRef = useRef<HTMLOListElement>(null);
  const steps = registration.steps || [];

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const h = window.innerHeight;
      const p = Math.max(
        0,
        Math.min(1, (h * 0.75 - rect.top) / (rect.height + h * 0.05)),
      );
      timelineRef.current.style.setProperty("--p", p.toString());
      const lis = timelineRef.current.querySelectorAll("li");
      lis.forEach((li, k) => {
        li.classList.toggle("on", p >= k / (lis.length - 1) - 0.03);
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [steps.length]);

  return (
    <section className="sec sf" id="bergabung">
      <div className="w c">
        <h2>
          Cara <span className="y">Bergabung</span>
        </h2>
        <p className="lead">
          {steps.length} langkah dari formulir sampai kunci di tangan. Mendaftar
          hanya sekitar {registration.estimateMinutes} menit.
        </p>
        <ol className="steps" ref={timelineRef}>
          {steps.map((step) => (
            <li key={step.id}>
              <b>{step.order}</b>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
