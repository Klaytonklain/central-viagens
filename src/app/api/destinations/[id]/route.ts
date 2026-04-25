import { NextRequest, NextResponse } from "next/server";
import { DestinationService } from "@/services/DestinationService";
import { getAuthUser } from "@/lib/auth";

const service = new DestinationService();

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ message: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  try {
    return NextResponse.json(await service.findById(id));
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

  if (!body.name || !body.country || !body.description || !body.imageUrl) {
    return NextResponse.json({ message: "Todos os campos são obrigatórios" }, { status: 400 });
  }

  try {
    return NextResponse.json(await service.update(id, body));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao atualizar";
    const status = message.includes("não encontrado") ? 404 : 422;
    return NextResponse.json({ message }, { status });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ message: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  try {
    await service.delete(id);
    return NextResponse.json({ message: "Destino removido com sucesso" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao deletar";
    return NextResponse.json({ message }, { status: 404 });
  }
}
