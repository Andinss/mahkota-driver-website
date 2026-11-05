import Link from "next/link";
import Icon from "@/components/ui/Icon";
import type { ServicesData } from "@/types/content";

export default function Services({ services }: { services: ServicesData }) {
  const items = services.services || [];

  return (
    <section className="sec" id="layanan">
      <div className="w c">
        <h2>
          Layanan <span className="y">Kami</span>
        </h2>
        <p className="lead">
          Pilih skema sewa yang paling pas dengan ritme kerja Anda.
        </p>
        <div className="g3" style={{ textAlign: "left" }}>
          {items.map((item) => (
            <div key={item.id} className="card">
              <span className="ib">
                {item.iconUrl ? (
                  <img
                    src={item.iconUrl}
                    alt={item.iconAlt || item.name}
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <Icon name="today" />
                )}
              </span>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <Link
                href="#kontak"
                className="inline-flex gap-1.5 items-center mt-4 font-semibold text-navy hover:text-yt transition-colors"
              >
                Pilih skema ini{" "}
                <Icon name="arrow_forward" className="text-[20px]" />
              </Link>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-mu col-span-3 text-center py-8">
              Belum ada layanan.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
