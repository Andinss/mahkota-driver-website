import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  InstagramIcon,
  Facebook01Icon,
  Location01Icon,
  Call02Icon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons";
import type { ContactData } from "@/types/content";

export default function Footer({ contact }: { contact: ContactData }) {
  return (
    <footer className="bg-navy text-[#a9b4c6] pt-16 pb-10">
      <div className="w">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/logo.png"
                alt="Mahkota Drive"
                className="h-10 w-10 object-contain"
              />
              <div>
                <b className="block text-white text-xl font-extrabold tracking-tight">
                  Mahkota<span className="text-y">Drive</span>
                </b>
                <small className="text-[0.6rem] tracking-[0.25em] text-[#a9b4c6]">
                  RENTAL ARMADA
                </small>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-xs mb-4">
              Mitra perjalanan driver online terpercaya. Sewa armada harian,
              mingguan, atau bulanan dengan perawatan ditanggung.
            </p>
            <div className="text-xs text-[#a9b4c6]/70 font-medium">
              By PT Mahkota Nusantara Raya
            </div>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Kontak
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="ms text-y text-[20px] shrink-0 mt-0.5">
                  <HugeiconsIcon icon={Location01Icon} size="1em" />
                </span>
                <span className="text-sm leading-relaxed">
                  {contact.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="ms text-y text-[20px] shrink-0">
                  <HugeiconsIcon icon={Call02Icon} size="1em" />
                </span>
                <a
                  href={`tel:${contact.phone.replace(/[^0-9+]/g, "")}`}
                  className="text-sm hover:text-y transition-colors"
                >
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="ms text-y text-[20px] shrink-0">
                  <HugeiconsIcon icon={WhatsappIcon} size="1em" />
                </span>
                <a
                  href={contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-y transition-colors"
                >
                  Chat via WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media Column */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Ikuti Kami
            </h3>
            <p className="text-sm mb-4">
              Dapatkan info promo dan armada terbaru.
            </p>
            <div className="flex gap-3">
              {contact.socialMedia.instagram && (
                <a
                  href={contact.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Mahkota Drive"
                  className="h-11 w-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#a9b4c6] hover:bg-y hover:text-navy hover:border-y transition-all duration-200"
                >
                  <span className="ms text-[22px]">
                    <HugeiconsIcon icon={InstagramIcon} size="1em" />
                  </span>
                </a>
              )}
              {contact.socialMedia.facebook && (
                <a
                  href={contact.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Mahkota Drive"
                  className="h-11 w-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#a9b4c6] hover:bg-y hover:text-navy hover:border-y transition-all duration-200"
                >
                  <span className="ms text-[22px]">
                    <HugeiconsIcon icon={Facebook01Icon} size="1em" />
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-[#a9b4c6]">
            © {new Date().getFullYear()} Mahkota Drive. All rights reserved.
          </p>
          <div className="flex gap-4 text-[#a9b4c6]">
            <Link href="/faq" className="hover:text-y transition-colors">
              FAQ
            </Link>
            <Link
              href="/syarat-ketentuan"
              className="hover:text-y transition-colors"
            >
              Syarat & Ketentuan
            </Link>
            <Link href="/privasi" className="hover:text-y transition-colors">
              Kebijakan Privasi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
