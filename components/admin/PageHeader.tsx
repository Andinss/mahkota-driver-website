import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Slot kanan: biasanya jumlah item dan tombol tambah. */
  children?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <div className="a-ph">
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children && <div className="a-ph-r">{children}</div>}
    </div>
  );
}
