"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PonudaForm({ objavaId }: { objavaId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/objave/${objavaId}/ponude`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ poruka: fd.get("poruka") }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Greška.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-soft">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Ponudi pomoć</h2>
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={15} /> {error}
        </div>
      )}
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <textarea
          name="poruka"
          rows={4}
          required
          maxLength={600}
          placeholder="Opiši kako možeš da pomogneš..."
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 resize-none"
        />
        <Button type="submit" loading={loading}>
          Pošalji ponudu
        </Button>
      </form>
    </div>
  );
}
