import "./admin.css";

/**
 * Layout khusus area admin (/admin dan /admin/dashboard).
 * Membungkus halaman dengan .adm supaya semua gaya admin (admin.css)
 * hanya berlaku di sini dan tidak bocor ke landing page.
 */
export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="adm">{children}</div>;
}
