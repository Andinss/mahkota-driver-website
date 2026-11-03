import Link from "next/link";
import Icon from "@/components/ui/Icon";
import StatCounter from "@/components/ui/StatCounter";
import type { ContactData } from "@/types/content";

export default function About({ contact }: { contact: ContactData }) {
  return (
    <section className="sec sf" id="tentang">
      <div className="w">
        <div className="ab">
          <div className="ph">
            <img
              src={contact.heroImageUrl || "/images/hero-bg.webp"}
              alt="Serah terima kunci"
            />
          </div>
          <div>
            <h2>
              Mitra Perjalanan <span className="y">Driver Online.</span>
            </h2>
            <p className="lead">
              Mahkota Drive menyediakan armada rental yang dirawat berkala
              dengan skema sewa fleksibel, supaya setiap driver bisa mulai
              berpenghasilan tanpa harus punya mobil sendiri.
            </p>
            <ul className="ck">
              <li>
                <Icon name="check_circle" />
                Unit dirawat berkala dan siap jalan
              </li>
              <li>
                <Icon name="check_circle" />
                Sewa harian, mingguan, atau bulanan
              </li>
              <li>
                <Icon name="check_circle" />
                Kontrak digital, proses cepat
              </li>
            </ul>
            <Link className="btn bd" href="/about">
              Lihat Selengkapnya <Icon name="arrow_forward" />
            </Link>
          </div>
        </div>
        <div className="stats">
          <div className="stat">
            <b>
              <StatCounter value={500} />
            </b>
            <span className="sx">+</span>
            <p>Mitra Driver Aktif</p>
          </div>
          <div className="stat">
            <b>
              <StatCounter value={350} />
            </b>
            <span className="sx">+</span>
            <p>Unit Armada</p>
          </div>
          <div className="stat">
            <b>
              <StatCounter value={4.8} decimals={1} />
            </b>
            <span className="sx">/5</span>
            <p>Kepuasan Mitra</p>
          </div>
        </div>
      </div>
    </section>
  );
}
