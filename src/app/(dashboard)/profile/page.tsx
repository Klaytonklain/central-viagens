"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { validateCPF, validatePassword } from "@/lib/validators";

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [form, setForm] = useState({ name: user?.name ?? "", cpf: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiMessage, setApiMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function setField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!validateCPF(form.cpf)) newErrors.cpf = "CPF inválido";
    if (!validatePassword(form.password)) newErrors.password = "Mínimo 8 caracteres, 1 maiúscula e 1 número";
    if (form.password !== form.confirm) newErrors.confirm = "Senhas não conferem";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setApiMessage("");
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: form.name, cpf: form.cpf, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setApiMessage(data.message ?? "Erro ao atualizar");
        setIsSuccess(false);
        return;
      }
      setApiMessage("Perfil atualizado com sucesso!");
      setIsSuccess(true);
    } catch {
      setApiMessage("Erro de conexão. Tente novamente.");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Meu Perfil</h1>
      <Card>
        <div className="mb-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
          <span className="font-medium">E-mail:</span> {user?.email}
          <span className="ml-2 text-xs text-gray-400">(não pode ser alterado)</span>
        </div>

        {apiMessage && (
          <div className="mb-4">
            <Alert message={apiMessage} type={isSuccess ? "success" : "error"} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Nome completo" value={form.name} onChange={(e) => setField("name", e.target.value)} error={errors.name} required />
          <Input label="CPF" value={form.cpf} onChange={(e) => setField("cpf", e.target.value)} placeholder="000.000.000-00" error={errors.cpf} required />
          <Input label="Nova senha" type="password" value={form.password} onChange={(e) => setField("password", e.target.value)} error={errors.password} required />
          <Input label="Confirmar nova senha" type="password" value={form.confirm} onChange={(e) => setField("confirm", e.target.value)} error={errors.confirm} required />
          <Button type="submit" loading={loading}>Salvar alterações</Button>
        </form>
      </Card>
    </div>
  );
}
