import type { TestimonialsData } from "@/types/content";
import Icon from "@/components/ui/Icon";

export default function Testimonials({
  testimonials,
}: {
  testimonials: TestimonialsData;
}) {
  const items = testimonials.items || [];
  if (items.length === 0) return null;

  return (
    <section className="sec" id="testimoni">
      <div className="w">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-[clamp(1.9rem,4vw,3.1rem)] font-extrabold leading-tight">
            Kata <span className="y">Mitra Driver</span>
          </h2>
          <p className="text-mu text-lg mt-4">
            Cerita nyata dari mereka yang telah bergabung dan bertumbuh bersama
            kami.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="bg-surf border border-ln rounded-[24px] p-8 flex flex-col shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex gap-1 text-y mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon
                    key={i}
                    name={i < item.rating ? "star" : "star_border"}
                    className="text-[18px]"
                  />
                ))}
              </div>
              <p className="text-ink leading-relaxed italic mb-6 flex-1">
                "{item.quote}"
              </p>
              <div className="flex items-center gap-4 border-t border-ln pt-6">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-bg border border-ln shrink-0 flex items-center justify-center">
                  {item.photoUrl ? (
                    <img
                      src={item.photoUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-bold text-mu">
                      {item.name
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <b className="block text-sm font-bold text-ink">
                    {item.name}
                  </b>
                  <small className="text-xs text-mu font-medium">
                    {item.description || "Mitra Driver"}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 3 && (
          <div className="text-center mt-10">
            <a
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-bold text-ink hover:text-yt transition-colors"
            >
              Lihat semua testimoni{" "}
              <Icon name="arrow_forward" className="text-[18px]" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
