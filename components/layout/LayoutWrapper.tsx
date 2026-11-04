"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ContactData } from "@/types/content";

export default function LayoutWrapper({
  children,
  contact,
}: {
  children: React.ReactNode;
  contact: ContactData;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // Jika di halaman admin, jangan tampilkan Navbar & Footer publik
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer contact={contact} />
    </>
  );
}
