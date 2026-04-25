"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();

  const items = [
    { href: "/dashboard/destinations", label: "Destinos", desc: "Gerencie os destinos disponíveis" },
    { href: "/dashboard/packages", label: "Pacotes", desc: "Gerencie os pacotes de viagem" },
    { href: "/dashboard/reservations", label: "Reservas", desc: "Acompanhe suas reservas" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Olá, {user?.name}!</h1>
      <p className="text-gray-500 mb-8">Bem-vindo ao painel da Central Viagens</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="hover:shadow-md transition cursor-pointer h-full">
              <h3 className="text-lg font-semibold text-blue-700">{item.label}</h3>
              <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
