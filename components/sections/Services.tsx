import Icon from "@/components/ui/Icon";

export default function Services() {
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
          <div className="card">
            <span className="ib">
              <Icon name="today" />
            </span>
            <h3>Sewa Harian</h3>
            <p>
              Rental kendaraan harian untuk fleksibilitas maksimal. Cocok bagi
              driver yang ingin mencoba tanpa komitmen jangka panjang.
            </p>
          </div>
          <div className="card">
            <span className="ib">
              <Icon name="date_range" />
            </span>
            <h3>Sewa Mingguan</h3>
            <p>
              Paket mingguan dengan harga lebih hemat. Ideal untuk driver yang
              sudah rutin beroperasi setiap hari.
            </p>
          </div>
          <div className="card">
            <span className="ib">
              <Icon name="calendar_month" />
            </span>
            <h3>Sewa Bulanan</h3>
            <p>
              Komitmen bulanan dengan tarif paling kompetitif. Pilihan terbaik
              untuk mitra driver jangka panjang.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
