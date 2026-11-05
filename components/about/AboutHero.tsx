"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import type { ContactData } from "@/types/content";

export default function AboutHero({ contact }: { contact: ContactData }) {
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
      <Link className="bk" href="/">
        <Icon name="arrow_back" /> Kembali ke beranda
      </Link>
      <div className="pgx">
        <div className="pgh rv">
          <p className="ey">Tentang Kami</p>
          <h1>
            <span className="ln">
              <span style={{ "--i": 0 } as React.CSSProperties}>
                Mitra Perjalanan
              </span>
            </span>
            <span className="ln y">
              <span style={{ "--i": 1 } as React.CSSProperties}>
                Driver Online.
              </span>
            </span>
          </h1>
          <p className="lead">
            Penyedia jasa rental armada kendaraan terpercaya yang dirancang
            khusus untuk para supir taksi online di Indonesia.
          </p>
          <div className="cta">
            <a className="btn bd" href="/#kontak">
              Daftar Sekarang <Icon name="arrow_forward" />
            </a>
            <a className="btn bo" href="/#armada">
              Lihat Armada
            </a>
          </div>
        </div>
        <div className="pgv rv">
          <div className="pgi">
            <img
              src={contact.heroImageUrl || "/images/hero-bg.webp"}
              alt="Serah terima kunci"
            />
          </div>
          <div className="pgc c1">
            <Icon name="groups" />
            <div>
              <b>500+</b>
              <small>Mitra driver aktif</small>
            </div>
          </div>
          <div className="pgc c2">
            <Icon name="directions_car" />
            <div>
              <b>350+</b>
              <small>Unit armada</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
