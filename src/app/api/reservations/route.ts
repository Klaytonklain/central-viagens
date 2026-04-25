import { NextRequest, NextResponse } from "next/server";
import { ReservationService } from "@/services/ReservationService";
import { getAuthUser } from "@/lib/auth";
import { parsePage } from "@/lib/validators";

const service = new ReservationService();

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ message: "Não autorizado" }, { status: 401 });

  const page = parsePage(req.nextUrl.searchParams.get("page"));
  return NextResponse.json(await service.list(auth.userId, page));
}

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ message: "Não autorizado" }, { status: 401 });

  const body = await req.json();
  if (!body.date || !body.packageId) {
    return NextResponse.json({ message: "Todos os campos são obrigatórios" }, { status: 400 });
  }

  try {
    const item = await service.create(auth.userId, body);
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao criar reserva";
    return NextResponse.json({ message }, { status: 422 });
  }
}
