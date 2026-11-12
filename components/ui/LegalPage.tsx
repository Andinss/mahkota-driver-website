import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import type { LegalData } from "@/types/content";
import LegalBody from "./LegalBody";

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Kerangka bersama untuk Syarat & Ketentuan dan Kebijakan Privasi. */
export default function LegalPage({
  data,
  title,
  accent,
}: {
  data: LegalData;
  /** Bagian judul yang tidak diberi warna. */
  title: string;
  /** Bagian judul yang diberi warna emas. */
  accent: string;
}) {
  return (
    <div className="pg bg-white">
      <div className="w max-w-3xl px-4 md:px-0">
        <Link className="bk" href="/">
          <span className="ms">
            <HugeiconsIcon icon={ArrowLeft01Icon} size="1em" />
          </span>{" "}
          Kembali ke beranda
        </Link>
        <h1 className="text-2xl md:text-5xl font-extrabold text-ink tracking-tight mt-6 mb-8">
          {title} <span className="y">{accent}</span>
        </h1>
        <div className="prose prose-sm md:prose-base max-w-none text-mu text-sm md:text-base">
          <p className="mb-4">Terakhir diperbarui: {formatDate(data.updatedAt)}</p>
          {data.sections.map((section) => (
            <section key={section.id}>
              <h2 className="text-xl font-bold text-ink mt-8 mb-3">
                {section.title}
              </h2>
              <LegalBody body={section.body} />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
