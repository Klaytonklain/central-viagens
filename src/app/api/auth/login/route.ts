import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/services/UserService";
import { signToken } from "@/lib/jwt";

const userService = new UserService();

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: "E-mail e senha são obrigatórios" }, { status: 400 });
  }

  try {
    const user = await userService.validateLogin(email, password);
    const token = signToken({ userId: user.id, email: user.email });
    return NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao fazer login";
    return NextResponse.json({ message }, { status: 401 });
  }
}
