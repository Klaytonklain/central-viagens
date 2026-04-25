"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import { PackageForm } from "@/components/forms/PackageForm";
import { Alert } from "@/components/ui/Alert";
import type { Package } from "@/types";

export default function EditPackagePage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch(`/api/packages/${id}`, token!)
      .then(setPkg)
      .catch((err) => setError(err.message));
  }, [id]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Pacote</h1>
      {error && <Alert message={error} />}
      {pkg && <PackageForm initial={pkg} />}
    </div>
  );
}
