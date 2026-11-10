import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import Icon from "@/components/ui/Icon";
import type { ServicesData } from "@/types/content";

export default function WhyUs({ services }: { services: ServicesData }) {
  const advantages = services.advantages || [];

  return (
    <section className="sec sf why2" id="keunggulan">
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
            Daftar Sekarang{" "}
            <span className="ms">
              <HugeiconsIcon icon={ArrowRight01Icon} size="1em" />
            </span>
          </a>
        </div>
        <ol className="wyr">
          {advantages.map((item, index) => (
            <li key={item.id}>
              <span className="wi">
                <Icon name={item.icon ?? "sell"} />
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
