"use client";

import { useEffect, useRef } from "react";
import Icon from "@/components/ui/Icon";
import StatCounter from "@/components/ui/StatCounter";

export default function AboutCommitment() {
  const ref = useRef<HTMLDivElement>(null);

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
          <div className="kc rv" style={{ "--d": 0 } as React.CSSProperties}>
            <span className="kn">01</span>
            <span className="ib">
              <Icon name="build" />
            </span>
            <h3>Perawatan Berkala</h3>
            <p>
              Seluruh unit dirawat secara berkala demi kenyamanan dan
              keselamatan di jalan.
            </p>
          </div>
          <div className="kc rv" style={{ "--d": 1 } as React.CSSProperties}>
            <span className="kn">02</span>
            <span className="ib">
              <Icon name="support_agent" />
            </span>
            <h3>Dukungan Darurat</h3>
            <p>
              Bantuan tersedia saat Anda membutuhkannya, sehingga Anda bisa
              fokus narik.
            </p>
          </div>
          <div className="kc rv" style={{ "--d": 2 } as React.CSSProperties}>
            <span className="kn">03</span>
            <span className="ib">
              <Icon name="draw" />
            </span>
            <h3>Kontrak Transparan</h3>
            <p>
              Perjanjian sewa yang jelas, ditandatangani digital dengan proses
              yang cepat.
            </p>
          </div>
        </div>
      </div>
      <div className="pgs rv">
        <div>
          <b>
            <StatCounter value={500} />
          </b>
          <span className="sx">+</span>
          <p>Mitra Driver Aktif</p>
        </div>
        <div>
          <b>
            <StatCounter value={350} />
          </b>
          <span className="sx">+</span>
          <p>Unit Armada</p>
        </div>
        <div>
          <b>
            <StatCounter value={4.8} decimals={1} />
          </b>
          <span className="sx">/5</span>
          <p>Kepuasan Mitra</p>
        </div>
      </div>
    </div>
  );
}
