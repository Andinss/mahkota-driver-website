import type { ReactNode } from "react";

/**
 * Menampilkan isi bagian halaman legal dari teks sederhana:
 * paragraf dipisah satu baris kosong, baris berawalan "- " menjadi daftar poin.
 */
export default function LegalBody({ body }: { body: string }) {
  const blocks = body
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <>
      {blocks.map((block, i): ReactNode => {
        const lines = block.split("\n").map((l) => l.trim());
        const isList = lines.every((l) => l.startsWith("- "));
        if (isList) {
          return (
            <ul key={i} className="list-disc pl-5 mb-4 space-y-2">
              {lines.map((l, j) => (
                <li key={j}>{l.slice(2)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="mb-4" style={{ whiteSpace: "pre-line" }}>
            {block}
          </p>
        );
      })}
    </>
  );
}
