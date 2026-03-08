"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  majstorId: string;
  objavaId:  string;
}

export default function OcenaForm({ majstorId, objavaId }: Props) {
  const [hovered,  setHovered]  = useState(0);
  const [selected, setSelected] = useState(0);
  const [komentar, setKomentar] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [done,     setDone]     = useState(false);

  if (done) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <p className="text-2xl mb-1">⭐</p>
        <p className="font-semibold text-green-800">Ocena je zabeležena! Hvala ti.</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) {
      setError("Odaberi broj zvezdica.");
      return;
    }
    setError(null);
    setLoading(true);
    const res = await fetch("/api/ocene", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vrednost: selected, komentar: komentar || undefined, majstorId, objavaId }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Greška.");
      return;
    }
    setDone(true);
  }

  const display = hovered || selected;

  return (
    <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6">
      <h3 className="font-bold text-gray-900 mb-1">Oceni majstora</h3>
      <p className="text-sm text-gray-500 mb-4">Kako je prošla popravka?</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star selector */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setSelected(n)}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
              className="focus:outline-none"
              aria-label={`${n} zvezdica`}
            >
              <Star
                size={28}
                className={cn(
                  "transition-colors",
                  n <= display ? "text-yellow-400 fill-yellow-400" : "text-gray-300",
                )}
              />
            </button>
          ))}
          {selected > 0 && (
            <span className="ml-2 self-center text-sm font-semibold text-gray-700">
              {["", "Loše", "Ispod proseka", "Prosečno", "Dobro", "Odlično"][selected]}
            </span>
          )}
        </div>

        {/* Comment */}
        <textarea
          value={komentar}
          onChange={(e) => setKomentar(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Komentar (opciono)..."
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 resize-none"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" size="sm" loading={loading}>
          Pošalji ocenu
        </Button>
      </form>
    </div>
  );
}
