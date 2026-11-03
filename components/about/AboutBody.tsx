"use client";

import { useEffect, useRef } from "react";
import Icon from "@/components/ui/Icon";

export default function AboutBody({ contact }: { contact: any }) {
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
    <div ref={ref} className="pgb">
      <div className="pgt">
        <p className="rv">
          Mahkota Drive adalah penyedia jasa rental armada kendaraan terpercaya
          yang dirancang khusus untuk para supir taksi online di Indonesia. Kami
          memahami bahwa memiliki kendaraan sendiri bukan syarat utama untuk
          meraih penghasilan — yang Anda butuhkan adalah akses ke armada
          berkualitas dengan biaya sewa yang terjangkau.
        </p>
        <p className="rv" style={{ "--d": 1 } as React.CSSProperties}>
          Dengan pilihan skema sewa harian, mingguan, dan bulanan, kami
          memberikan fleksibilitas penuh bagi mitra driver untuk menjalankan
          aktivitas di platform ride-hailing favorit mereka. Seluruh unit armada
          kami dirawat secara berkala demi kenyamanan dan keselamatan di jalan.
        </p>
        <p className="rv" style={{ "--d": 2 } as React.CSSProperties}>
          Kami percaya akses ke kendaraan yang layak tidak harus mahal. Karena
          itu perawatan berkala, dukungan darurat, dan kontrak yang transparan
          menjadi standar untuk setiap mitra.
        </p>
        <p className="rv" style={{ "--d": 3 } as React.CSSProperties}>
          Bergabunglah bersama ratusan mitra driver yang telah mempercayakan
          perjalanan karier mereka kepada Mahkota Drive dan rasakan kemudahan
          bermitra bersama kami.
        </p>
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
