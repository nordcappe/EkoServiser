import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { getKategorija, formatRelativeTime, STATUS_LABELS } from "@/lib/utils";
import { MapPin, MessageCircle, Clock } from "lucide-react";

interface ObjavaCardProps {
  objava: {
    id: string;
    naslov: string;
    kategorija: string;
    grad: string;
    status: string;
    createdAt: Date | string;
    ponude: { id: string }[];
    autor: { ime: string };
  };
}

const statusVariant: Record<string, "green" | "blue" | "gray"> = {
  AKTIVNA:  "green",
  U_TOKU:   "blue",
  ZAVRSENA: "gray",
  OBRISANA: "gray",
};

// Category  top-accent color bar
const katAccent: Record<string, string> = {
  "kucni-uredjaji": "bg-yellow-400",
  "bicikli":        "bg-sky-400",
  "odeca":          "bg-pink-400",
  "namestaj":       "bg-amber-500",
  "elektronika":    "bg-indigo-400",
  "ostalo":         "bg-gray-400",
};

export function ObjavaCard({ objava }: ObjavaCardProps) {
  const kat    = getKategorija(objava.kategorija);
  const accent = katAccent[objava.kategorija] ?? "bg-green-400";

  return (
    <Link href={`/objave/${objava.id}`} className="group block h-full">
      <div className="h-full flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-soft transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-card group-hover:border-green-200">
        {/* Colored accent bar */}
        <div className={`h-1 w-full ${accent} transition-all duration-300 group-hover:h-1.5`} />

        <div className="flex flex-col gap-3 p-5 flex-1">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              {kat.ikona}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-green-700 transition-colors">{objava.naslov}</h3>
              <p className="mt-0.5 text-sm text-gray-400">{objava.autor.ime}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <Badge variant={statusVariant[objava.status] ?? "gray"}>
              {STATUS_LABELS[objava.status] ?? objava.status}
            </Badge>
            <Badge variant="gray">{kat.naziv}</Badge>
          </div>

          <div className="mt-auto flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-3">
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              {objava.grad}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle size={11} />
              {objava.ponude.length}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {formatRelativeTime(objava.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

