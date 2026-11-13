import type { IconSvgElement } from "@hugeicons/react";
import Ico from "./Ico";

interface SectionHeadProps {
  icon: IconSvgElement;
  title: string;
  description: string;
}

/** Judul bagian di dalam kartu: ikon + judul + penjelasan singkat. */
export default function SectionHead({
  icon,
  title,
  description,
}: SectionHeadProps) {
  return (
    <div className="a-sec-h">
      <div className="a-ib a-soft">
        <Ico icon={icon} />
      </div>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}
