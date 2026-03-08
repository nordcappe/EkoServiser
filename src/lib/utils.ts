import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const KATEGORIJE = [
  { id: "kucni-uredjaji", naziv: "Mali kućni uređaji", ikona: "🔌", bg: "bg-yellow-50",  border: "border-yellow-200", text: "text-yellow-700"  },
  { id: "bicikli",        naziv: "Bicikli i sportska", ikona: "🚲", bg: "bg-sky-50",     border: "border-sky-200",    text: "text-sky-700"    },
  { id: "odeca",          naziv: "Odeća i obuća",      ikona: "👗", bg: "bg-pink-50",    border: "border-pink-200",   text: "text-pink-700"   },
  { id: "namestaj",       naziv: "Nameštaj",            ikona: "🪑", bg: "bg-amber-50",   border: "border-amber-200",  text: "text-amber-700"  },
  { id: "elektronika",    naziv: "Elektronika",          ikona: "💻", bg: "bg-indigo-50",  border: "border-indigo-200", text: "text-indigo-700" },
  { id: "ostalo",         naziv: "Ostalo",               ikona: "🔩", bg: "bg-gray-100",   border: "border-gray-200",   text: "text-gray-700"   },
] as const;

export type KategorijaId = (typeof KATEGORIJE)[number]["id"];

export function getKategorija(id: string) {
  return KATEGORIJE.find((k) => k.id === id) ?? { id, naziv: id, ikona: "🔧" };
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000; // seconds

  if (diff < 60) return "Upravo";
  if (diff < 3600) return `Pre ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Pre ${Math.floor(diff / 3600)} h`;
  if (diff < 172800) return "Juče";
  return d.toLocaleDateString("sr-RS", { day: "numeric", month: "short" });
}

export const ROLE_LABELS: Record<string, string> = {
  KORISNIK: "Korisnik",
  MAJSTOR:  "Majstor",
  VOLONTER: "Volonter",
  ADMIN:    "Admin",
};

export const STATUS_LABELS: Record<string, string> = {
  AKTIVNA:  "Aktivna",
  U_TOKU:   "U toku",
  ZAVRSENA: "Završena",
  OBRISANA: "Obrisana",
};
