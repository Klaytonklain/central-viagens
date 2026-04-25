import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/services/UserService";
import { getAuthUser } from "@/lib/auth";

const userService = new UserService();

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ message: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  if (auth.userId !== id) return NextResponse.json({ message: "Proibido" }, { status: 403 });

  try {
    const user = await userService.findById(id);
    return NextResponse.json({ id: user.id, name: user.name, email: user.email, cpf: user.cpf });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro";
    return NextResponse.json({ message }, { status: 404 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ message: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  if (auth.userId !== id) return NextResponse.json({ message: "Proibido" }, { status: 403 });

  const body = await req.json();
  const { name, password, cpf } = body;

  if (!name || !password || !cpf) {
    return NextResponse.json({ message: "Todos os campos são obrigatórios" }, { status: 400 });
  }

  try {
    const user = await userService.update(id, { name, password, cpf });
    return NextResponse.json({ id: user.id, name: user.name, email: user.email, cpf: user.cpf });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao atualizar";
    return NextResponse.json({ message }, { status: 422 });
  }
}
