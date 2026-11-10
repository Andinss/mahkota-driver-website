"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  UserGroupIcon,
  Car01Icon,
} from "@hugeicons/core-free-icons";
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
        <span className="ms">
          <HugeiconsIcon icon={ArrowLeft01Icon} size="1em" />
        </span>{" "}
        Kembali ke beranda
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

          {/* 3 Jaminan Utama */}
          <div className="mt-6 mb-8">
            <p className="font-semibold text-ink mb-2">3 Jaminan Utama Kami:</p>
            <ul className="space-y-1.5 text-sm text-mu">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-y shrink-0" />
                <span>
                  <b>Armada Prima</b> — Unit bebas mogok dan selalu terawat.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-y shrink-0" />
                <span>
                  <b>Layanan Siaga 24/7</b> — CS sigap membantu kapan pun.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-y shrink-0" />
                <span>
                  <b>Skema Ringan</b> — Setoran transparan tanpa potongan.
                </span>
              </li>
            </ul>
          </div>

          {/* Legalitas PT */}
          <div className="text-xs font-semibold text-mu uppercase tracking-widest mb-6">
            By PT Mahkota Nusantara Raya
          </div>

          <div className="cta">
            <a className="btn bd" href="/#kontak">
              Daftar Sekarang{" "}
              <span className="ms">
                <HugeiconsIcon icon={ArrowRight01Icon} size="1em" />
              </span>
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
            <span className="ms">
              <HugeiconsIcon icon={UserGroupIcon} size="1em" />
            </span>
            <div>
              <b>500+</b>
              <small>Mitra driver aktif</small>
            </div>
          </div>
          <div className="pgc c2">
            <span className="ms">
              <HugeiconsIcon icon={Car01Icon} size="1em" />
            </span>
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
