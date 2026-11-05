import Link from "next/link";
import Icon from "@/components/ui/Icon";
import type { ContactData, StatisticsData } from "@/types/content";

export default function About({
  contact,
  statistics,
}: {
  contact: ContactData;
  statistics: StatisticsData;
}) {
  const stats = statistics.items || [];
  const points = contact.homeAboutPoints || [];

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
              {contact.homeAboutText ||
                "Mahkota Drive menyediakan armada rental yang dirawat berkala..."}
            </p>
            <ul className="ck">
              {points.map((point, i) => (
                <li key={i}>
                  <Icon name="check_circle" />
                  {point}
                </li>
              ))}
            </ul>
            <Link className="btn bd" href="/about">
              Lihat Selengkapnya <Icon name="arrow_forward" />
            </Link>
          </div>
        </div>
        <div className="stats">
          {stats.map((stat) => (
            <div className="stat" key={stat.id}>
              <b>{stat.value}</b>
              <span className="sx">{stat.suffix}</span>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
