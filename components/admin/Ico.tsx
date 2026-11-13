import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

interface IcoProps {
  icon: IconSvgElement;
  className?: string;
}

/**
 * Pembungkus ikon Hugeicons untuk panel admin.
 * Ukuran mengikuti font-size induk (SVG = 1em), sama seperti <Icon /> di landing page.
 */
export default function Ico({ icon, className = "" }: IcoProps) {
  return (
    <span className={`a-i ${className}`.trim()} aria-hidden="true">
      <HugeiconsIcon icon={icon} size="1em" />
    </span>
  );
}
