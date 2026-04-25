"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { Alert } from "@/components/ui/Alert";
import type { Package, PaginatedResult } from "@/types";

export default function PackagesPage() {
  const { token } = useAuth();
  const [result, setResult] = useState<PaginatedResult<Package> | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  async function load(p: number) {
    try {
      setResult(await apiFetch(`/api/packages?page=${p}`, token!));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar");
    }
  }

  useEffect(() => { load(page); }, [page]);

  async function handleDelete(id: string) {
    if (!confirm("Deseja remover este pacote?")) return;
    try {
      await apiFetch(`/api/packages/${id}`, token!, { method: "DELETE" });
      load(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao remover");
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pacotes de Viagem</h1>
        <Link href="/dashboard/packages/new">
          <Button>Novo Pacote</Button>
        </Link>
      </div>

      {error && <div className="mb-4"><Alert message={error} /></div>}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3">Título</th>
              <th className="text-left px-4 py-3">Destino</th>
              <th className="text-left px-4 py-3">Preço</th>
              <th className="text-left px-4 py-3">Duração</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {result?.data.map((pkg) => (
              <tr key={pkg.id}>
                <td className="px-4 py-3 font-medium">{pkg.title}</td>
                <td className="px-4 py-3 text-gray-600">{pkg.destination?.name}</td>
                <td className="px-4 py-3">R$ {pkg.price.toFixed(2)}</td>
                <td className="px-4 py-3">{pkg.durationDays} dias</td>
                <td className="px-4 py-3 flex gap-2 justify-center">
                  <Link href={`/dashboard/packages/${pkg.id}/edit`}>
                    <Button variant="secondary" className="text-xs px-3 py-1">Editar</Button>
                  </Link>
                  <Button variant="danger" className="text-xs px-3 py-1" onClick={() => handleDelete(pkg.id)}>
                    Remover
                  </Button>
                </td>
              </tr>
            ))}
            {result?.data.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Nenhum pacote cadastrado</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {result && <Pagination page={result.page} totalPages={result.totalPages} onPageChange={setPage} />}
    </div>
  );
}
