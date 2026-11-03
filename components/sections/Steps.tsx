"use client";

import { useEffect, useRef } from "react";

export default function Steps() {
  const timelineRef = useRef<HTMLOListElement>(null);

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
  }, []);

  return (
    <section className="sec sf" id="bergabung">
      <div className="w c">
        <h2>
          Cara <span className="y">Bergabung</span>
        </h2>
        <p className="lead">
          Empat langkah dari formulir sampai kunci di tangan. Mendaftar hanya
          sekitar 10 menit.
        </p>
        <ol className="steps" ref={timelineRef}>
          <li>
            <b>1</b>
            <h3>Isi Formulir Online</h3>
            <p>
              Lengkapi data diri Anda melalui formulir pendaftaran online kami.
            </p>
          </li>
          <li>
            <b>2</b>
            <h3>Verifikasi Dokumen</h3>
            <p>
              Unggah KTP, SIM, dan dokumen pendukung untuk proses verifikasi.
            </p>
          </li>
          <li>
            <b>3</b>
            <h3>Tanda Tangan Kontrak</h3>
            <p>
              Tinjau dan tandatangani perjanjian sewa kendaraan secara digital.
            </p>
          </li>
          <li>
            <b>4</b>
            <h3>Ambil Kendaraan</h3>
            <p>
              Datang ke pool kami untuk serah terima kendaraan dan mulai
              beroperasi.
            </p>
          </li>
        </ol>
      </div>
    </section>
  );
}
