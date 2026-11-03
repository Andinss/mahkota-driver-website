import Icon from "@/components/ui/Icon";

export default function WhyUs() {
  return (
    <section className="sec sf why2">
      <div className="w wy">
        <div className="wyl">
          <p className="ey">Keunggulan</p>
          <h2>
            Kenapa Memilih <span className="y">Mahkota Drive?</span>
          </h2>
          <p className="lead">
            Empat alasan ratusan mitra driver mempercayakan armada mereka kepada
            kami.
          </p>
          <a className="btn bd" href="/#kontak">
            Daftar Sekarang <Icon name="arrow_forward" />
          </a>
        </div>
        <ol className="wyr">
          <li>
            <span className="wi">
              <Icon name="sell" />
            </span>
            <div>
              <b>Perawatan Gratis</b>
              <small>Servis berkala ditanggung</small>
            </div>
            <span className="wn">01</span>
          </li>
          <li>
            <span className="wi">
              <Icon name="support_agent" />
            </span>
            <div>
              <b>Dukungan 24 Jam</b>
              <small>Bantuan darurat di jalan</small>
            </div>
            <span className="wn">02</span>
          </li>
          <li>
            <span className="wi">
              <Icon name="payments" />
            </span>
            <div>
              <b>Tanpa DP Besar</b>
              <small>Mulai dengan ringan</small>
            </div>
            <span className="wn">03</span>
          </li>
          <li>
            <span className="wi">
              <Icon name="draw" />
            </span>
            <div>
              <b>Kontrak Digital</b>
              <small>Tanda tangan dari HP</small>
            </div>
            <span className="wn">04</span>
          </li>
        </ol>
      </div>
    </section>
  );
}
