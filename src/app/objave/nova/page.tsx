"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { KATEGORIJE } from "@/lib/utils";
import { AlertCircle, ArrowLeft, ImagePlus, X } from "lucide-react";

export default function NovaObjavaPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (status === "loading") return <PageLoader />;
  if (!session) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
        <span className="text-5xl">🔒</span>
        <h2 className="text-xl font-bold">Prijava je potrebna</h2>
        <p className="text-gray-500">Morate biti prijavljeni da biste objavili problem.</p>
        <Link href="/prijava">
          <Button>Prijavi se</Button>
        </Link>
      </div>
    );
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Slika ne sme biti veća od 2 MB.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const latRaw = fd.get("lat") as string;
    const lngRaw = fd.get("lng") as string;

    const res = await fetch("/api/objave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        naslov:     fd.get("naslov"),
        opis:       fd.get("opis"),
        kategorija: fd.get("kategorija"),
        grad:       fd.get("grad"),
        adresa:     fd.get("adresa") || undefined,
        lat:        latRaw ? parseFloat(latRaw) : undefined,
        lng:        lngRaw ? parseFloat(lngRaw) : undefined,
        slika:      imagePreview ?? undefined,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Greška pri objavi.");
      return;
    }
    router.push(`/objave/${data.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link href="/objave" className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft size={14} /> Nazad na objave
      </Link>

      <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Nova objava</h1>
      <p className="text-gray-500 mb-8">Opiši šta je pokvareno i dobij pomoć u blizini.</p>

      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-card">
        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <Input
            name="naslov"
            label="Šta je pokvareno?"
            placeholder="npr. Toster koji ne greje"
            required
            maxLength={120}
          />

          <Select
            name="kategorija"
            label="Kategorija"
            placeholder="— Izaberi kategoriju —"
            required
            options={KATEGORIJE.map((k) => ({ value: k.id, label: `${k.ikona} ${k.naziv}` }))}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700" htmlFor="opis">
              Opis (opciono)
            </label>
            <textarea
              id="opis"
              name="opis"
              rows={4}
              maxLength={1000}
              placeholder="Detaljnije opiši problem..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 resize-none"
            />
          </div>

          {/* Image upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Fotografija (opciono)</label>
            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Pregled" className="w-full max-h-60 object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                  aria-label="Ukloni sliku"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-sm text-gray-500 hover:border-green-300 hover:bg-green-50 transition-colors">
                <ImagePlus size={24} className="text-gray-400" />
                <span>Klikni da dodaš sliku (max 2 MB)</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          <Input name="grad" label="Grad" placeholder="npr. Beograd" required />

          <Input name="adresa" label="Adresa (opciono)" placeholder="npr. Knez Mihailova 10" />

          {/* Location coordinates */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Koordinate (opciono)</p>
            <p className="text-xs text-gray-400 mb-3">
              Pronaći koordinate možeš na{" "}
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-green-700 underline">
                Google Maps
              </a>{" "}
              desnim klikom → &ldquo;Šta ima ovde?&rdquo;.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Input name="lat" label="Geografska širina" placeholder="npr. 44.8176" type="number" step="any" />
              <Input name="lng" label="Geografska dužina" placeholder="npr. 20.4569" type="number" step="any" />
            </div>
          </div>

          <div className="rounded-xl bg-green-50 border border-green-100 p-4 text-sm text-green-800">
            💡 <strong>Savet:</strong> Što detaljniji opis, veće su šanse da dobijete brzu i korisnu ponudu.
          </div>

          <Button type="submit" size="lg" loading={loading} className="w-full mt-2">
            Objavi problem
          </Button>
        </form>
      </div>
    </div>
  );
}

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="size-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
    </div>
  );
}


