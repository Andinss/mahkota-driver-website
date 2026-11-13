import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { readCategory } from "@/lib/content";
import FaqList from "./FaqList";

export default async function FaqPage() {
  const [faq, contact] = await Promise.all([
    readCategory("faq"),
    readCategory("contact"),
  ]);

  const waText = "text=Halo%20Mahkota%20Drive,%20saya%20ingin%20bertanya.";
  const waHref = `${contact.whatsappUrl}${contact.whatsappUrl.includes("?") ? "&" : "?"}${waText}`;

  return (
    <div className="pg bg-white">
      <div className="w max-w-3xl px-4 md:px-0">
        <Link className="bk" href="/">
          <span className="ms">
            <HugeiconsIcon icon={ArrowLeft01Icon} size="1em" />
          </span>{" "}
          Kembali ke beranda
        </Link>

        <div className="text-center mb-8 md:mb-12 mt-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-ink tracking-tight mb-3 md:mb-4">
            Pertanyaan <span className="y">Umum</span>
          </h1>
          <p className="text-mu text-base md:text-lg">
            Punya pertanyaan seputar layanan Mahkota Drive? Temukan jawabannya
            di sini.
          </p>
        </div>

        <FaqList items={faq.items} />

        <div className="text-center bg-bg p-6 md:p-8 rounded-3xl border border-ln">
          <h2 className="text-lg md:text-xl font-bold text-ink mb-2">
            Masih ada pertanyaan?
          </h2>
          <p className="text-mu mb-6 text-sm md:text-base">
            Tim kami siap membantu Anda kapan saja.
          </p>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn by w-full md:w-auto"
          >
            Hubungi Kami via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
