"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import { ReservationForm } from "@/components/forms/ReservationForm";
import { Alert } from "@/components/ui/Alert";
import type { Reservation } from "@/types";

export default function EditReservationPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch(`/api/reservations/${id}`, token!)
      .then(setReservation)
      .catch((err) => setError(err.message));
  }, [id]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Reserva</h1>
      {error && <Alert message={error} />}
      {reservation && <ReservationForm initial={reservation} />}
    </div>
  );
}
