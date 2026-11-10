"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  LockIcon,
  AlertCircleIcon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        router.push("/admin/dashboard");
        return;
      }

      if (response.status === 429) {
        setError("Terlalu banyak percobaan login. Silakan coba lagi nanti.");
      } else if (response.status === 401) {
        setError("Username atau password salah.");
      } else {
        const data = await response.json().catch(() => null);
        setError(data?.error || "Terjadi kesalahan. Silakan coba lagi.");
      }
    } catch {
      setError("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-navy">
      <div className="absolute inset-0 z-0">
        <img
          src="/images/services/1781145669201-2dq892.png"
          alt="Mahkota Drive Background"
          className="w-full h-full object-cover opacity-20 blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-transparent"></div>
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-y/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-y/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-y mb-4 shadow-lg shadow-y/30">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="h-10 w-10 object-contain"
            />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Mahkota<span className="text-yt">Drive</span>
          </h1>
          <p className="text-gray-400 mt-2 font-medium">Panel Administrator</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gray-200 mb-2"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <span className="ms text-[20px]">
                    <HugeiconsIcon icon={UserIcon} size="1em" />
                  </span>
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-y focus:border-transparent transition-all disabled:opacity-50"
                  placeholder="Masukkan username"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-200 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <span className="ms text-[20px]">
                    <HugeiconsIcon icon={LockIcon} size="1em" />
                  </span>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-y focus:border-transparent transition-all disabled:opacity-50"
                  placeholder="Masukkan password"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl flex items-start gap-2 text-sm text-red-200">
                <span className="ms text-[20px] shrink-0">
                  <HugeiconsIcon icon={AlertCircleIcon} size="1em" />
                </span>
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 mt-2 py-4 bg-y text-navy rounded-xl font-bold text-base hover:bg-y-light transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-y/20"
            >
              {isLoading ? "Memproses..." : "Masuk Dashboard"}
              {!isLoading && (
                <span className="ms text-[20px]">
                  <HugeiconsIcon icon={ArrowRight01Icon} size="1em" />
                </span>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-sm font-medium text-gray-400 hover:text-y transition-colors flex items-center justify-center gap-2"
          >
            <span className="ms text-[16px]">
              <HugeiconsIcon icon={ArrowLeft01Icon} size="1em" />
            </span>{" "}
            Kembali ke Website
          </a>
        </div>
      </div>
    </div>
  );
}
