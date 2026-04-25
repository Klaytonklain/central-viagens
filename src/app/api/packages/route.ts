import { NextRequest, NextResponse } from "next/server";
import { PackageService } from "@/services/PackageService";
import { getAuthUser } from "@/lib/auth";
import { parsePage } from "@/lib/validators";

const service = new PackageService();

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ message: "Não autorizado" }, { status: 401 });

  const page = parsePage(req.nextUrl.searchParams.get("page"));
  return NextResponse.json(await service.list(page));
}

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ message: "Não autorizado" }, { status: 401 });

  const body = await req.json();
  if (!body.title || !body.price || !body.durationDays || !body.description || !body.destinationId) {
    return NextResponse.json({ message: "Todos os campos são obrigatórios" }, { status: 400 });
  }

  try {
    const item = await service.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao criar pacote";
    return NextResponse.json({ message }, { status: 422 });
  }
}
