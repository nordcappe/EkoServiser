"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Wrench, AlertCircle } from "lucide-react";

export default function RegistracijaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const body = {
      ime:      fd.get("ime"),
      email:    fd.get("email"),
      lozinka:  fd.get("lozinka"),
      grad:     fd.get("grad"),
      role:     fd.get("role"),
    };

    const res = await fetch("/api/registracija", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Greška pri registraciji.");
      return;
    }
    router.push("/prijava?registered=1");
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-green-600 text-white shadow-card">
            <Wrench size={26} />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Kreiraj nalog</h1>
          <p className="mt-1 text-sm text-gray-500">Pridruži se EkoServiser zajednici</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-card">
          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <Input name="ime" label="Ime i prezime" placeholder="Marko Marković" required />
            <Input name="email" type="email" label="Email adresa" placeholder="tvoj@email.com" required />
            <Input name="grad" label="Grad" placeholder="Beograd" required />
            <Select
              name="role"
              label="Uloga"
              defaultValue="KORISNIK"
              options={[
                { value: "KORISNIK",  label: "Korisnik — imam pokvarene predmete" },
                { value: "MAJSTOR",   label: "Majstor — mogu da pomognem" },
                { value: "VOLONTER",  label: "Volonter — pomažem besplatno" },
              ]}
            />
            <Input
              name="lozinka"
              type="password"
              label="Lozinka"
              placeholder="Min. 8 karaktera"
              minLength={8}
              required
              autoComplete="new-password"
            />
            <Button type="submit" size="lg" loading={loading} className="mt-1 w-full">
              Registruj se
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Već imaš nalog?{" "}
            <Link href="/prijava" className="font-semibold text-green-700 hover:underline">
              Prijavi se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
