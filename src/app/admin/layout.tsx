import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, FileText, Settings } from "lucide-react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  try {
    await requireAdmin();
  } catch {
    redirect("/prijava");
  }

  const links = [
    { href: "/admin",           icon: <LayoutDashboard size={16} />, label: "Dashboard" },
    { href: "/admin/korisnici", icon: <Users size={16} />,           label: "Korisnici" },
    { href: "/admin/objave",    icon: <FileText size={16} />,        label: "Objave" },
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-gray-100 bg-white lg:flex lg:flex-col">
        <div className="border-b border-gray-100 px-5 pt-6 pb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Admin Panel</p>
        </div>
        <nav className="flex flex-col gap-1 p-3 flex-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              {l.icon}
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-gray-100 p-4">
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-600">
            ← Nazad na sajt
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex border-t border-gray-100 bg-white">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium text-gray-600 hover:text-green-700">
            {l.icon}
            {l.label}
          </Link>
        ))}
      </div>

      <div className="flex-1 bg-gray-50 p-4 pb-20 sm:p-6 lg:pb-6">{children}</div>
    </div>
  );
}
