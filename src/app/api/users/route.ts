import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/services/UserService";

const userService = new UserService();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, password, cpf } = body;

  if (!name || !email || !password || !cpf) {
    return NextResponse.json({ message: "Todos os campos são obrigatórios" }, { status: 400 });
  }

  try {
    const user = await userService.create({ name, email, password, cpf });
    return NextResponse.json({ id: user.id, name: user.name, email: user.email }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao cadastrar usuário";
    return NextResponse.json({ message }, { status: 422 });
  }
}
