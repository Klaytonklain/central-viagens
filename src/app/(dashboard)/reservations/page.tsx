"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { Alert } from "@/components/ui/Alert";
import type { Reservation, PaginatedResult } from "@/types";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function ReservationsPage() {
  const { token } = useAuth();
  const [result, setResult] = useState<PaginatedResult<Reservation> | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  async function load(p: number) {
    try {
      setResult(await apiFetch(`/api/reservations?page=${p}`, token!));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar");
    }
  }

  useEffect(() => { load(page); }, [page]);

  async function handleDelete(id: string) {
    if (!confirm("Deseja remover esta reserva?")) return;
    try {
      await apiFetch(`/api/reservations/${id}`, token!, { method: "DELETE" });
      load(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao remover");
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Minhas Reservas</h1>
        <Link href="/dashboard/reservations/new">
          <Button>Nova Reserva</Button>
        </Link>
      </div>

      {error && <div className="mb-4"><Alert message={error} /></div>}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3">Pacote</th>
              <th className="text-left px-4 py-3">Destino</th>
              <th className="text-left px-4 py-3">Data</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {result?.data.map((res) => (
              <tr key={res.id}>
                <td className="px-4 py-3 font-medium">{res.package?.title}</td>
                <td className="px-4 py-3 text-gray-600">{res.package?.destination?.name}</td>
                <td className="px-4 py-3">{new Date(res.date).toLocaleDateString("pt-BR")}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[res.status]}`}>
                    {STATUS_LABELS[res.status]}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2 justify-center">
                  <Link href={`/dashboard/reservations/${res.id}/edit`}>
                    <Button variant="secondary" className="text-xs px-3 py-1">Editar</Button>
                  </Link>
                  <Button variant="danger" className="text-xs px-3 py-1" onClick={() => handleDelete(res.id)}>
                    Remover
                  </Button>
                </td>
              </tr>
            ))}
            {result?.data.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Nenhuma reserva cadastrada</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {result && <Pagination page={result.page} totalPages={result.totalPages} onPageChange={setPage} />}
    </div>
  );
}
