import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
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
              {/* text-white dihapus, kembali normal */}
              <span className="ib">
                <Icon name={item.icon ?? "today"} className="text-[30px]" />
              </span>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <Link
                href="#kontak"
                className="inline-flex gap-1.5 items-center mt-4 font-semibold text-navy hover:text-yt transition-colors"
              >
                Pilih skema ini{" "}
                <span className="ms text-[20px]">
                  <HugeiconsIcon icon={ArrowRight01Icon} size="1em" />
                </span>
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
