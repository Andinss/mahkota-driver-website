"use client";

import { useEffect, useRef } from "react";
import Icon from "@/components/ui/Icon";
import type { ContactData, StatisticsData } from "@/types/content";
import StatCounter from "@/components/ui/StatCounter";

export default function AboutCommitment({
  contact,
  statistics,
}: {
  contact: ContactData;
  statistics: StatisticsData;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const stats = statistics.items || [];
  const commitments = contact.commitments || [];

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
    <div ref={ref}>
      <div className="km">
        <h2 className="rv">
          Komitmen <span className="y">Kami</span>
        </h2>
        <div className="kg">
          {commitments.map((item, index) => (
            <div
              key={index}
              className="kc rv"
              style={{ "--d": index } as React.CSSProperties}
            >
              <span className="kn">0{index + 1}</span>
              {/* text-white dihapus */}
              <span className="ib">
                <Icon name={item.icon} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="pgs rv">
        {stats.map((s) => (
          <div key={s.id}>
            <b>
              <StatCounter
                value={s.value}
                decimals={s.suffix.includes("/") ? 1 : 0}
              />
            </b>
            <span className="sx">{s.suffix}</span>
            <p>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
