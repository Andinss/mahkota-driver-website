import Icon from "@/components/ui/Icon";
import type { ContactData } from "@/types/content";

const getWaLink = (text: string) =>
  `https://wa.me/6281234567890?text=${encodeURIComponent(text)}`;

export default function Contact({ contact }: { contact: ContactData }) {
  return (
    <section className="sec" id="kontak">
      <div className="w">
        <div className="kt">
          <div>
            <p className="ey">Hubungi Kami</p>
            <h2>
              Kontak <span className="y">Kami</span>
            </h2>
            <p className="lead">
              Ada pertanyaan soal armada, skema sewa, atau proses bergabung? Tim
              Mahkota Drive siap membantu Anda.
            </p>
            <a
              className="wa"
              href={getWaLink(
                "Halo Mahkota Drive, saya ingin bertanya tentang rental armada.",
              )}
              target="_blank"
              rel="noopener"
            >
              <Icon name="chat" />
              <span>
                <b>Chat langsung via WhatsApp</b>
                <small>Hubungi kami sekarang</small>
              </span>
            </a>
          </div>
          <div className="ktg">
            <a
              className="kti"
              href={`tel:${contact.phone.replace(/[^0-9+]/g, "")}`}
            >
              <span className="ib">
                <Icon name="call" />
              </span>
              <span>
                <small>Telepon / WhatsApp</small>
                <b>{contact.phone}</b>
              </span>
            </a>
            <div className="kti">
              <span className="ib">
                <Icon name="support_agent" />
              </span>
              <span>
                <small>Dukungan 24 Jam</small>
                <b>Bantuan di jalan</b>
              </span>
            </div>
            <a
              className="kti w2"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                contact.address,
              )}`}
              target="_blank"
              rel="noopener"
            >
              <span className="ib">
                <Icon name="location_on" />
              </span>
              <span>
                <small>Alamat</small>
                <b>{contact.address}</b>
              </span>
            </a>
            <div className="kti w2">
              <span className="ib">
                <Icon name="share" />
              </span>
              <span>
                <small>Media sosial</small>
                <b className="so">
                  <a
                    href={contact.socialMedia.instagram}
                    target="_blank"
                    rel="noopener"
                  >
                    Instagram
                  </a>
                  <a
                    href={contact.socialMedia.facebook}
                    target="_blank"
                    rel="noopener"
                  >
                    Facebook
                  </a>
                </b>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
