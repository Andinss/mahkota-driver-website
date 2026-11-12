"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserIcon,
  AlertCircleIcon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";
import Ico from "@/components/admin/Ico";
import PasswordField from "@/components/admin/PasswordField";

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
    <main className="a-login">
      <section className="a-login-art">
        <div className="a-brand" style={{ padding: 0 }}>
          <img src="/images/logo.png" alt="" />
          <div>
            <b>
              Mahkota<span>Drive</span>
            </b>
            <span className="a-ey">Panel admin</span>
          </div>
        </div>
        <div>
          <h2>Kelola isi website Mahkota Drive.</h2>
          <p>
            Ubah armada, testimoni, dan kontak dari satu tempat. Perubahan
            langsung tampil di website.
          </p>
        </div>
        <img
          className="a-car"
          src="/images/services/1781145669201-2dq892.png"
          alt=""
        />
      </section>

      <section className="a-login-form">
        <div className="a-login-card">
          <h1>Masuk ke panel admin</h1>
          <p>Gunakan akun administrator Anda.</p>

          {error && (
            <div className="a-alert a-bad" role="alert">
              <Ico icon={AlertCircleIcon} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="a-field">
              <label htmlFor="username">Username</label>
              <div className="a-has-ic">
                <Ico icon={UserIcon} />
                <input
                  id="username"
                  className="a-input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  disabled={isLoading}
                  placeholder="Masukkan username"
                />
              </div>
            </div>

            <PasswordField
              id="password"
              label="Password"
              value={password}
              onChange={setPassword}
              required
              autoComplete="current-password"
              disabled={isLoading}
              placeholder="Masukkan password"
            />

            <button
              type="submit"
              className="a-btn a-bd a-block"
              style={{ marginTop: 8 }}
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Masuk"}
              {!isLoading && <Ico icon={ArrowRight01Icon} />}
            </button>
          </form>

          <Link className="a-back" href="/">
            <Ico icon={ArrowLeft01Icon} />
            Kembali ke website
          </Link>
        </div>
      </section>
    </main>
  );
}
