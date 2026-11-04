import Icon from "@/components/ui/Icon";
import type { ServicesData } from "@/types/content";

export default function WhyUs({ services }: { services: ServicesData }) {
  const advantages = services.advantages || [];

  return (
    <section className="sec sf why2">
      <div className="w wy">
        <div className="wyl">
          <p className="ey">Keunggulan</p>
          <h2>
            Kenapa Memilih <span className="y">Mahkota Drive?</span>
          </h2>
          <p className="lead">
            Beberapa alasan ratusan mitra driver mempercayakan armada mereka
            kepada kami.
          </p>
          <a className="btn bd" href="#kontak">
            Daftar Sekarang <Icon name="arrow_forward" />
          </a>
        </div>
        <ol className="wyr">
          {advantages.map((item, index) => (
            <li key={item.id}>
              <span className="wi">
                {item.iconUrl ? (
                  <img
                    src={item.iconUrl}
                    alt={item.iconAlt || item.title}
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <Icon name="sell" />
                )}
              </span>
              <div>
                <b>{item.title}</b>
                <small>{item.description}</small>
              </div>
              <span className="wn">0{index + 1}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
