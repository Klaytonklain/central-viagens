"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import type { Reservation, Package } from "@/types";

interface ReservationFormProps {
  initial?: Reservation;
}

export function ReservationForm({ initial }: ReservationFormProps) {
  const { token } = useAuth();
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [form, setForm] = useState({
    date: initial?.date ? new Date(initial.date).toISOString().split("T")[0] : "",
    packageId: initial?.packageId ?? "",
    status: initial?.status ?? "PENDING",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiFetch("/api/packages?page=1", token!)
      .then((r) => setPackages(r.data))
      .catch(() => {});
  }, []);

  function setField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.date) e.date = "Data é obrigatória";
    if (!form.packageId) e.packageId = "Pacote é obrigatório";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;

    setLoading(true);
    try {
      if (initial) {
        await apiFetch(`/api/reservations/${initial.id}`, token!, { method: "PUT", body: JSON.stringify(form) });
      } else {
        await apiFetch("/api/reservations", token!, { method: "POST", body: JSON.stringify({ date: form.date, packageId: form.packageId }) });
      }
      router.push("/dashboard/reservations");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      {apiError && <Alert message={apiError} />}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Pacote</label>
        <select
          className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.packageId ? "border-red-500" : "border-gray-300"}`}
          value={form.packageId}
          onChange={(e) => setField("packageId", e.target.value)}
          required
        >
          <option value="">Selecione um pacote</option>
          {packages.map((p) => (
            <option key={p.id} value={p.id}>{p.title} — R$ {p.price.toFixed(2)}</option>
          ))}
        </select>
        {errors.packageId && <span className="text-red-500 text-xs">{errors.packageId}</span>}
      </div>

      <Input label="Data da viagem" type="date" value={form.date} onChange={(e) => setField("date", e.target.value)} error={errors.date} required />

      {initial && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.status}
            onChange={(e) => setField("status", e.target.value)}
          >
            <option value="PENDING">Pendente</option>
            <option value="CONFIRMED">Confirmada</option>
            <option value="CANCELLED">Cancelada</option>
          </select>
        </div>
      )}

      <div className="flex gap-3 mt-2">
        <Button type="submit" loading={loading}>{initial ? "Salvar" : "Criar Reserva"}</Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>Cancelar</Button>
      </div>
    </form>
  );
}
