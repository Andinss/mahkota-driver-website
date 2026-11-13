import { readCategory } from "@/lib/content";
import LegalPage from "@/components/ui/LegalPage";

export default async function SyaratKetentuanPage() {
  const terms = await readCategory("terms");
  return <LegalPage data={terms} title="Syarat &" accent="Ketentuan" />;
}
