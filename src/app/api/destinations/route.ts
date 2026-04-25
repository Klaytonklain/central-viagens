import { NextRequest, NextResponse } from "next/server";
import { DestinationService } from "@/services/DestinationService";
import { getAuthUser } from "@/lib/auth";
import { parsePage } from "@/lib/validators";

const service = new DestinationService();

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ message: "Não autorizado" }, { status: 401 });

  const page = parsePage(req.nextUrl.searchParams.get("page"));
  const result = await service.list(page);
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ message: "Não autorizado" }, { status: 401 });

  const body = await req.json();
  if (!body.name || !body.country || !body.description || !body.imageUrl) {
    return NextResponse.json({ message: "Todos os campos são obrigatórios" }, { status: 400 });
  }

  try {
    const item = await service.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao criar destino";
    return NextResponse.json({ message }, { status: 422 });
  }
}
