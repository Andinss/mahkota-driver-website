import { readCategory } from "@/lib/content";
import LegalPage from "@/components/ui/LegalPage";

export default async function KebijakanPrivasiPage() {
  const privacy = await readCategory("privacy");
  return <LegalPage data={privacy} title="Kebijakan" accent="Privasi" />;
}
