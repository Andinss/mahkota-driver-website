import { readAllContent } from "@/lib/content";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import WhyUs from "@/components/sections/WhyUs";
import Fleet from "@/components/sections/Fleet";
import Steps from "@/components/sections/Steps";
import Contact from "@/components/sections/Contact";

export default async function Home() {
  const content = await readAllContent();
  return (
    <main id="top">
      <Hero fleet={content.fleet} />
      <About contact={content.contact} />
      <Services />
      <WhyUs />
      <Fleet fleet={content.fleet} />
      <Steps />
      <Contact contact={content.contact} />
    </main>
  );
}
