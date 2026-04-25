"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import { DestinationForm } from "@/components/forms/DestinationForm";
import { Alert } from "@/components/ui/Alert";
import type { Destination } from "@/types";

export default function EditDestinationPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch(`/api/destinations/${id}`, token!)
      .then(setDestination)
      .catch((err) => setError(err.message));
  }, [id]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Destino</h1>
      {error && <Alert message={error} />}
      {destination && <DestinationForm initial={destination} />}
    </div>
  );
}
