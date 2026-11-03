"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/ui/Icon";

const NAV_ITEMS = [
  { id: "top", label: "Beranda" },
  { id: "tentang", label: "Tentang" },
  { id: "layanan", label: "Layanan" },
  { id: "armada", label: "Armada" },
  { id: "bergabung", label: "Cara Bergabung" },
  { id: "kontak", label: "Kontak" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [active, setActive] = useState("top");
  const pathname = usePathname();

  useEffect(() => {
    // Kalau bukan di halaman home, jangan highlight apa-apa (atau bisa highlight "Tentang" kalau di /about)
    if (pathname !== "/") {
      setActive(pathname === "/about" ? "tentang-page" : "");
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY < 80) {
        setActive("top");
        return;
      }

      // Cek section yang sedang berada di viewport
      let current = "";
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Jika bagian atas section sudah lewat 45% layar dan bawahnya masih di viewport
          if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= 0) {
            current = item.id;
          }
        }
      }
      if (current) setActive(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <>
      <header>
        <div className="w nb">
          <Link className="lg" href="/">
            <img
              src="/images/logo.png"
              alt="Mahkota Drive"
              className="h-[38px] w-[38px] object-contain"
            />
            <span>
              <b>
                Mahkota<i>Drive</i>
              </b>
              <small>RENTAL ARMADA</small>
            </span>
          </Link>

          <nav aria-label="Navigasi utama">
            <ul>
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/#${item.id}`}
                    className={active === item.id ? "on" : ""}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link className="btn bd sm" href="/#kontak">
            Daftar Sekarang <Icon name="arrow_forward" />
          </Link>

          <button
            className="hm"
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Icon
              name={mobileMenuOpen ? "close" : "menu"}
              className="text-[30px]"
            />
          </button>
        </div>
      </header>

      <div className={`mm ${mobileMenuOpen ? "open" : ""}`}>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.id}
            href={`/#${item.id}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            {item.label} <Icon name="north_east" />
          </Link>
        ))}
        <Link
          className="btn by"
          href="/#kontak"
          onClick={() => setMobileMenuOpen(false)}
        >
          Daftar Sekarang <Icon name="arrow_forward" />
        </Link>
      </div>
    </>
  );
}
