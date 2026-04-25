import { ReservationForm } from "@/components/forms/ReservationForm";

export default function NewReservationPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Nova Reserva</h1>
      <ReservationForm />
    </div>
  );
}
