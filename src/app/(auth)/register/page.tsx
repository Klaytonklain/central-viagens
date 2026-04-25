"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { validateEmail, validateCPF, validatePassword } from "@/lib/validators";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", cpf: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  function setField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!validateEmail(form.email)) newErrors.email = "E-mail inválido";
    if (!validateCPF(form.cpf)) newErrors.cpf = "CPF inválido";
    if (!validatePassword(form.password)) {
      newErrors.password = "Mínimo 8 caracteres, 1 maiúscula e 1 número";
    }
    if (form.password !== form.confirm) newErrors.confirm = "Senhas não conferem";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, cpf: form.cpf, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setApiError(data.message ?? "Erro ao cadastrar");
        return;
      }
      router.push("/login");
    } catch {
      setApiError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Criar conta</h1>
        <p className="text-gray-500 mb-6">Preencha os dados para se cadastrar</p>

        {apiError && <div className="mb-4"><Alert message={apiError} /></div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Nome completo" value={form.name} onChange={(e) => setField("name", e.target.value)} error={errors.name} required />
          <Input label="E-mail" type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} error={errors.email} required />
          <Input label="CPF" value={form.cpf} onChange={(e) => setField("cpf", e.target.value)} placeholder="000.000.000-00" error={errors.cpf} required />
          <Input label="Senha" type="password" value={form.password} onChange={(e) => setField("password", e.target.value)} error={errors.password} required />
          <Input label="Confirmar senha" type="password" value={form.confirm} onChange={(e) => setField("confirm", e.target.value)} error={errors.confirm} required />
          <Button type="submit" loading={loading} className="mt-2">
            Cadastrar
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Já tem conta?{" "}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
