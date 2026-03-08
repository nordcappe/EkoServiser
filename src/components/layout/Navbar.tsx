"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Menu, X, Plus, LogOut, User, LayoutDashboard, Leaf } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { href: "/objave",      label: "Objave" },
    { href: "/mapa",        label: "Mapa" },
    { href: "/#kategorije", label: "Kategorije" },
    { href: "/#kako",       label: "Kako funkcioniše" },
  ];

  const transparent = isHome && !scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        transparent
          ? "bg-green-950/70 backdrop-blur-md"
          : "border-b border-gray-100/80 bg-white/95 shadow-soft backdrop-blur-md"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5 font-extrabold text-lg">
          <div className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-700 text-white shadow-green-sm transition-shadow duration-300 group-hover:shadow-green-glow">
            <Leaf size={17} className="transition-transform duration-500 group-hover:animate-sway" />
          </div>
          <span className={cn(
            "transition-colors duration-300",
            transparent ? "text-green-100" : "text-gray-900"
          )}>
            Eko<span className="text-green-600">Serviser</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="ml-6 hidden items-center gap-0.5 lg:flex">
          {navLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    "relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                    active
                      ? "text-green-600"
                      : transparent
                      ? "text-white hover:text-white hover:bg-white/10"
                      : "text-gray-600 hover:text-green-700 hover:bg-green-50"
                  )}
                >
                  {l.label}
                  {active && (
                    <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-green-500 animate-scale-in" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2">
          {session ? (
            <>
              <Link href="/objave/nova" className="hidden sm:block">
                <Button size="sm" className="btn-shimmer shadow-green-sm">
                  <Plus size={15} /> Nova objava
                </Button>
              </Link>
              <UserMenu session={session} />
            </>
          ) : (
            <>
              <Link href="/prijava" className="hidden sm:block">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(transparent && "text-white hover:bg-white/15 hover:text-white")}
                >
                  Prijava
                </Button>
              </Link>
              <Link href="/registracija">
                <Button size="sm" className="btn-shimmer shadow-green-sm">
                  Registruj se
                </Button>
              </Link>
            </>
          )}
          <button
            className={cn(
              "rounded-lg p-2 transition-colors lg:hidden",
              transparent ? "text-white hover:bg-white/15" : "text-gray-600 hover:bg-gray-100"
            )}
            onClick={() => setOpen(!open)}
            aria-label="Meni"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="animate-slide-up border-t border-gray-100 bg-white/97 px-4 pb-5 backdrop-blur-md lg:hidden">
          <ul className="mt-3 flex flex-col gap-1">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    pathname === l.href
                      ? "bg-green-50 text-green-700 font-semibold"
                      : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            {!session && (
              <li>
                <Link href="/prijava" onClick={() => setOpen(false)} className="flex items-center rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Prijava
                </Link>
              </li>
            )}
            {session && (
              <li>
                <Link href="/objave/nova" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-xl bg-green-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-green-500">
                  <Plus size={14} /> Nova objava
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}

function UserMenu({ session }: { session: { user: { name?: string | null; email?: string | null; role?: string } } }) {
  const [open, setOpen] = useState(false);
  const isAdmin  = session.user.role === "ADMIN";
  const initials = session.user.name?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex size-9 items-center justify-center rounded-full text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-green-glow",
          isAdmin ? "bg-gradient-to-br from-purple-500 to-purple-700" : "bg-gradient-to-br from-green-500 to-green-700"
        )}
        aria-label="Korisnicki meni"
      >
        {initials}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-50 min-w-56 animate-scale-in rounded-2xl border border-gray-100 bg-white p-2 shadow-card">
            <div className="border-b border-gray-100 px-3 py-2.5 mb-1">
              <p className="text-sm font-bold text-gray-900">{session.user.name}</p>
              <p className="text-xs text-gray-400">{session.user.email}</p>
              <span className="mt-1 inline-block rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
                {session.user.role}
              </span>
            </div>
            <Link href="/profil" onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <User size={14} /> Moj profil
            </Link>
            {isAdmin && (
              <Link href="/admin" onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-purple-700 hover:bg-purple-50 transition-colors">
                <LayoutDashboard size={14} /> Admin panel
              </Link>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50 mt-1 transition-colors"
            >
              <LogOut size={14} /> Odjavi se
            </button>
          </div>
        </>
      )}
    </div>
  );
}

