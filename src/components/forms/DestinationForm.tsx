"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import type { Destination } from "@/types";

interface DestinationFormProps {
  initial?: Destination;
}

export function DestinationForm({ initial }: DestinationFormProps) {
  const { token } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    country: initial?.country ?? "",
    description: initial?.description ?? "",
    imageUrl: initial?.imageUrl ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  function setField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nome é obrigatório";
    if (!form.country.trim()) e.country = "País é obrigatório";
    if (!form.description.trim()) e.description = "Descrição é obrigatória";
    if (!form.imageUrl.trim()) e.imageUrl = "URL da imagem é obrigatória";
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
        await apiFetch(`/api/destinations/${initial.id}`, token!, { method: "PUT", body: JSON.stringify(form) });
      } else {
        await apiFetch("/api/destinations", token!, { method: "POST", body: JSON.stringify(form) });
      }
      router.push("/dashboard/destinations");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      {apiError && <Alert message={apiError} />}
      <Input label="Nome" value={form.name} onChange={(e) => setField("name", e.target.value)} error={errors.name} required />
      <Input label="País" value={form.country} onChange={(e) => setField("country", e.target.value)} error={errors.country} required />
      <Input label="Descrição" value={form.description} onChange={(e) => setField("description", e.target.value)} error={errors.description} required />
      <Input label="URL da Imagem" value={form.imageUrl} onChange={(e) => setField("imageUrl", e.target.value)} error={errors.imageUrl} required />
      <div className="flex gap-3 mt-2">
        <Button type="submit" loading={loading}>{initial ? "Salvar" : "Criar Destino"}</Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>Cancelar</Button>
      </div>
    </form>
  );
}
