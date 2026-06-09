import { readAllContent } from '@/lib/content';
import Navbar from '@/components/sections/Navbar';
import Hero from '@/components/sections/Hero';
import Services from '@/components/sections/Services';
import Fleet from '@/components/sections/Fleet';
import Statistics from '@/components/sections/Statistics';
import Testimonials from '@/components/sections/Testimonials';
import Registration from '@/components/sections/Registration';
import Download from '@/components/sections/Download';
import Footer from '@/components/sections/Footer';
import BackToTop from '@/components/ui/BackToTop';

export default async function Home() {
  const content = await readAllContent();

  return (
    <>
      <Navbar />

      <main>
        <section id="tentang-kami">
          <Hero contact={content.contact} playStoreUrl={content.registration.playStoreUrl} />
        </section>

        <section id="layanan">
          <Services services={content.services} />
        </section>

        <section id="katalog-armada">
          <Fleet fleet={content.fleet} />
        </section>

        <section id="statistik">
          <Statistics statistics={content.statistics} />
        </section>

        <section id="testimoni">
          <Testimonials testimonials={content.testimonials} />
        </section>

        <section id="cara-daftar">
          <Registration registration={content.registration} />
        </section>

        <section id="unduh-aplikasi">
          <Download playStoreUrl={content.registration.playStoreUrl} appMockupUrl={content.contact.appMockupUrl} />
        </section>

        <Footer contact={content.contact} />
      </main>

      <BackToTop />
    </>
  );
}
