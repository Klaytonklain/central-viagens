"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const links = [
  { href: "/dashboard", label: "Início" },
  { href: "/dashboard/destinations", label: "Destinos" },
  { href: "/dashboard/packages", label: "Pacotes" },
  { href: "/dashboard/reservations", label: "Reservas" },
  { href: "/dashboard/profile", label: "Meu Perfil" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-blue-700 text-white flex flex-col min-h-screen">
      <div className="p-6 border-b border-blue-600">
        <h1 className="text-xl font-bold">Central Viagens</h1>
        <p className="text-blue-200 text-sm mt-1 truncate">{user?.name}</p>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 rounded transition text-sm font-medium ${
              pathname === link.href
                ? "bg-white text-blue-700"
                : "hover:bg-blue-600 text-blue-100"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-blue-600">
        <button
          onClick={logout}
          className="w-full text-left px-4 py-2 rounded hover:bg-blue-600 text-sm text-blue-100 transition"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}
