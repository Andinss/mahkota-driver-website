import { readAllContent } from "@/lib/content";
import AboutHero from "@/components/about/AboutHero";
import AboutBody from "@/components/about/AboutBody";
import AboutCommitment from "@/components/about/AboutCommitment";
import AboutCTA from "@/components/about/AboutCTA";

export default async function TentangPage() {
  const content = await readAllContent();

  return (
    <div className="pg bg-white">
      <div className="w">
        <AboutHero contact={content.contact} />
        <AboutBody contact={content.contact} />
        <AboutCommitment
          contact={content.contact}
          statistics={content.statistics}
        />
        <AboutCTA fleet={content.fleet} />
      </div>
    </div>
  );
}
