"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  Cancel01Icon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";

// Href sekarang bersih: pakai "#" untuk section, dan "/" untuk halaman
const NAV_ITEMS = [
  { id: "top", label: "Beranda", href: "/" },
  { id: "tentang", label: "Tentang", href: "/about" },
  { id: "layanan", label: "Layanan", href: "#layanan" },
  { id: "keunggulan", label: "Keunggulan", href: "#keunggulan" },
  { id: "armada", label: "Armada", href: "#armada" },
  { id: "bergabung", label: "Bergabung", href: "#bergabung" },
  { id: "testimoni", label: "Testimoni", href: "#testimoni" },
  { id: "faq", label: "FAQ", href: "/faq" },
  { id: "kontak", label: "Kontak", href: "#kontak" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [active, setActive] = useState("");
  const pathname = usePathname();

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    setMobileMenuOpen(false);

    // JIKA MENU ADALAH SEBUAH SECTION (Berawalan #)
    if (href.startsWith("#")) {
      // Jika sedang tidak di Beranda, paksa pindah ke Beranda dulu
      if (pathname !== "/") {
        window.location.href = "/" + href;
      } else {
        // Jika sudah di Beranda, scroll mulus
        e.preventDefault();
        const el = document.getElementById(href.replace("#", ""));
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.pushState(null, "", href);
          setActive(href.replace("#", ""));
        }
      }
      return;
    }

    // JIKA MENU ADALAH HALAMAN (About / FAQ)
    // Biarkan Next.js Link yang menangani secara default
    if (href !== "/") {
      setActive(href.replace("/", ""));
    } else {
      setActive("top");
    }
  };

  useEffect(() => {
    // 1. Deteksi jika user membuka URL ber-hash secara langsung (misal /#armada)
    if (pathname === "/" && window.location.hash) {
      const hash = window.location.hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          setActive(hash);
        }
      }, 200);
    }

    // 2. Highlight menu saat scroll (hanya di halaman Beranda)
    if (pathname !== "/") {
      const item = NAV_ITEMS.find((i) => i.href === pathname);
      setActive(item ? item.id : "");
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY < 80) {
        setActive("top");
        return;
      }

      let current = "";
      for (const item of NAV_ITEMS) {
        // Hanya cek menu yang berawalan #
        if (item.href.startsWith("#")) {
          const id = item.href.replace("#", "");
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= 0) {
              current = item.id;
            }
          }
        }
      }
      if (window.innerHeight + scrollY >= document.body.offsetHeight - 50) {
        current = "kontak";
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
        <div className="nb px-4 md:px-8 lg:px-12 max-w-none">
          <Link
            className="lg shrink-0"
            href="/"
            onClick={(e) => handleNavClick(e, "/")}
          >
            <img
              src="/images/logo.png"
              alt="Mahkota Drive"
              className="h-[34px] w-[34px] object-contain"
            />
            <span>
              <b className="text-[1.2rem]">
                Mahkota<i>Drive</i>
              </b>
              <small className="text-[0.5rem]">RENTAL ARMADA</small>
            </span>
          </Link>

          <nav aria-label="Navigasi utama">
            <ul>
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={active === item.id ? "on" : ""}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link
            className="btn by sm text-white shrink-0"
            href="#kontak"
            onClick={(e) => handleNavClick(e, "#kontak")}
          >
            Daftar Sekarang{" "}
            <span className="ms">
              <HugeiconsIcon icon={ArrowRight01Icon} size="1em" />
            </span>
          </Link>

          <button
            className="hm"
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="ms text-[30px]">
              <HugeiconsIcon
                icon={mobileMenuOpen ? Cancel01Icon : Menu01Icon}
                size="1em"
              />
            </span>
          </button>
        </div>
      </header>

      <div className={`mm ${mobileMenuOpen ? "open" : ""}`}>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            onClick={(e) => handleNavClick(e, item.href)}
            className={active === item.id ? "text-y" : ""}
          >
            {item.id === "bergabung" ? "Cara Bergabung" : item.label}{" "}
            <span className="ms">
              <HugeiconsIcon icon={ArrowUpRight01Icon} size="1em" />
            </span>
          </Link>
        ))}
        <Link
          className="btn by text-white"
          href="#kontak"
          onClick={(e) => handleNavClick(e, "#kontak")}
        >
          Daftar Sekarang{" "}
          <span className="ms">
            <HugeiconsIcon icon={ArrowRight01Icon} size="1em" />
          </span>
        </Link>
      </div>
    </>
  );
}
