import { NextRequest, NextResponse } from "next/server";
import { ReservationService } from "@/services/ReservationService";
import { getAuthUser } from "@/lib/auth";

const service = new ReservationService();

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ message: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  try {
    return NextResponse.json(await service.findById(id, auth.userId));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Não encontrado";
    return NextResponse.json({ message }, { status: 404 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ message: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  if (!body.date || !body.packageId || !body.status) {
    return NextResponse.json({ message: "Todos os campos são obrigatórios" }, { status: 400 });
  }

  try {
    return NextResponse.json(await service.update(id, auth.userId, body));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao atualizar";
    const status = message.includes("não encontrada") ? 404 : 422;
    return NextResponse.json({ message }, { status });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ message: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  try {
    await service.delete(id, auth.userId);
    return NextResponse.json({ message: "Reserva removida com sucesso" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao deletar";
    return NextResponse.json({ message }, { status: 404 });
  }
}
