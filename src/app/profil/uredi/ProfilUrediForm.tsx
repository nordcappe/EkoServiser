"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

interface UserData {
  ime:     string;
  email:   string;
  grad:    string | null;
  bio:     string | null;
  telefon: string | null;
}

export default function ProfilUrediForm({ user }: { user: UserData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Password change section
  const [showPw, setShowPw] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const body: Record<string, string | null> = {
      ime:     (fd.get("ime") as string) || user.ime,
      grad:    (fd.get("grad") as string) || null,
      bio:     (fd.get("bio") as string) || null,
      telefon: (fd.get("telefon") as string) || null,
    };

    const staraPw = fd.get("stara_lozinka") as string;
    const novaPw  = fd.get("nova_lozinka")  as string;
    const potvrdaPw = fd.get("potvrda_lozinke") as string;

    if (showPw && novaPw) {
      if (novaPw !== potvrdaPw) {
        setError("Nova lozinka i potvrda se ne poklapaju.");
        setLoading(false);
        return;
      }
      (body as Record<string, unknown>).stara_lozinka = staraPw;
      (body as Record<string, unknown>).nova_lozinka  = novaPw;
    }

    const res = await fetch("/api/profil", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Greška pri čuvanju.");
      return;
    }
    setSuccess(true);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link href="/profil" className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft size={14} /> Nazad na profil
      </Link>

      <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Uredi profil</h1>
      <p className="text-gray-500 mb-8">Promeni svoje podatke.</p>

      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-card">
        {success && (
          <div className="mb-5 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
            <CheckCircle2 size={16} />
            Podaci su uspešno sačuvani!
          </div>
        )}
        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <Input
            name="ime"
            label="Ime"
            defaultValue={user.ime}
            required
            maxLength={80}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <input
              value={user.email}
              disabled
              className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm text-gray-400 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400">Email adresa se ne može promeniti.</p>
          </div>

          <Input
            name="grad"
            label="Grad (opciono)"
            defaultValue={user.grad ?? ""}
            maxLength={60}
            placeholder="npr. Beograd"
          />

          <Input
            name="telefon"
            label="Telefon (opciono)"
            defaultValue={user.telefon ?? ""}
            maxLength={30}
            placeholder="+381 6X XXX XXXX"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700" htmlFor="bio">
              Bio (opciono)
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              maxLength={500}
              defaultValue={user.bio ?? ""}
              placeholder="Par reči o sebi..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 resize-none"
            />
          </div>

          {/* Password change section */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="text-sm font-semibold text-green-700 hover:text-green-600"
            >
              {showPw ? "▲ Sakrij promenu lozinke" : "▼ Promeni lozinku"}
            </button>

            {showPw && (
              <div className="mt-4 flex flex-col gap-4">
                <Input
                  name="stara_lozinka"
                  label="Stara lozinka"
                  type="password"
                  autoComplete="current-password"
                />
                <Input
                  name="nova_lozinka"
                  label="Nova lozinka"
                  type="password"
                  minLength={6}
                  autoComplete="new-password"
                />
                <Input
                  name="potvrda_lozinke"
                  label="Potvrdi novu lozinku"
                  type="password"
                  autoComplete="new-password"
                />
              </div>
            )}
          </div>

          <Button type="submit" size="lg" loading={loading} className="w-full">
            Sačuvaj izmene
          </Button>
        </form>
      </div>
    </div>
  );
}
