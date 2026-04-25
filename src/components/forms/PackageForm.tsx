"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import type { Package, Destination } from "@/types";

interface PackageFormProps {
  initial?: Package;
}

export function PackageForm({ initial }: PackageFormProps) {
  const { token } = useAuth();
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    price: initial?.price?.toString() ?? "",
    durationDays: initial?.durationDays?.toString() ?? "",
    description: initial?.description ?? "",
    destinationId: initial?.destinationId ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiFetch("/api/destinations?page=1", token!)
      .then((r) => setDestinations(r.data))
      .catch(() => {});
  }, []);

  function setField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Título é obrigatório";
    if (!form.price || Number(form.price) <= 0) e.price = "Preço deve ser positivo";
    if (!form.durationDays || Number(form.durationDays) <= 0) e.durationDays = "Duração deve ser positiva";
    if (!form.description.trim()) e.description = "Descrição é obrigatória";
    if (!form.destinationId) e.destinationId = "Destino é obrigatório";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;

    const body = { ...form, price: Number(form.price), durationDays: Number(form.durationDays) };
    setLoading(true);
    try {
      if (initial) {
        await apiFetch(`/api/packages/${initial.id}`, token!, { method: "PUT", body: JSON.stringify(body) });
      } else {
        await apiFetch("/api/packages", token!, { method: "POST", body: JSON.stringify(body) });
      }
      router.push("/dashboard/packages");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      {apiError && <Alert message={apiError} />}
      <Input label="Título" value={form.title} onChange={(e) => setField("title", e.target.value)} error={errors.title} required />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Destino</label>
        <select
          className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.destinationId ? "border-red-500" : "border-gray-300"}`}
          value={form.destinationId}
          onChange={(e) => setField("destinationId", e.target.value)}
          required
        >
          <option value="">Selecione um destino</option>
          {destinations.map((d) => (
            <option key={d.id} value={d.id}>{d.name} — {d.country}</option>
          ))}
        </select>
        {errors.destinationId && <span className="text-red-500 text-xs">{errors.destinationId}</span>}
      </div>

      <Input label="Preço (R$)" type="number" step="0.01" value={form.price} onChange={(e) => setField("price", e.target.value)} error={errors.price} required />
      <Input label="Duração (dias)" type="number" value={form.durationDays} onChange={(e) => setField("durationDays", e.target.value)} error={errors.durationDays} required />
      <Input label="Descrição" value={form.description} onChange={(e) => setField("description", e.target.value)} error={errors.description} required />

      <div className="flex gap-3 mt-2">
        <Button type="submit" loading={loading}>{initial ? "Salvar" : "Criar Pacote"}</Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>Cancelar</Button>
      </div>
    </form>
  );
}
