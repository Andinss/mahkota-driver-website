import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Alert02Icon } from "@hugeicons/core-free-icons";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-bg px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-y/10 text-y rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="ms text-[40px]">
            <HugeiconsIcon icon={Alert02Icon} size="1em" />
          </span>
        </div>
        <h1 className="text-4xl font-extrabold text-ink mb-4 tracking-tight">
          404
        </h1>
        <h2 className="text-xl font-bold text-ink mb-2">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-mu mb-8">
          Maaf, halaman yang Anda cari mungkin telah dihapus, diubah namanya,
          atau tidak pernah ada.
        </p>
        <Link href="/" className="btn bd">
          <span className="ms">
            <HugeiconsIcon icon={ArrowLeft01Icon} size="1em" />
          </span>
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
