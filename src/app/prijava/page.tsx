"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Wrench, AlertCircle } from "lucide-react";

export default function PrijavaPage() {
  return (
    <Suspense>
      <PrijavaForm />
    </Suspense>
  );
}

function PrijavaForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callbackUrl = params.get("callbackUrl") ?? "/";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email:   fd.get("email") as string,
      lozinka: fd.get("lozinka") as string,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Pogrešan email ili lozinka.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-green-600 text-white shadow-card">
            <Wrench size={26} />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Dobrodošli nazad</h1>
          <p className="mt-1 text-sm text-gray-500">Prijavite se na vaš EkoServiser nalog</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-card">
          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <Input
              name="email"
              type="email"
              label="Email adresa"
              placeholder="tvoj@email.com"
              required
              autoComplete="email"
            />
            <Input
              name="lozinka"
              type="password"
              label="Lozinka"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <Button type="submit" size="lg" loading={loading} className="mt-1 w-full">
              Prijavi se
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Nemaš nalog?{" "}
            <Link href="/registracija" className="font-semibold text-green-700 hover:underline">
              Registruj se
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          Demo: <code className="font-mono">admin@ekoserviser.rs</code> / <code className="font-mono">admin123</code>
        </p>
      </div>
    </div>
  );
}
