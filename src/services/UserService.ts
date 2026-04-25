import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { validateEmail, validateCPF, validatePassword } from "@/lib/validators";
import type { CreateUserDTO, UpdateUserDTO, User } from "@/types";

export class UserService {
  async create(data: CreateUserDTO): Promise<User> {
    this.validateFields(data.email, data.cpf, data.password);

    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) throw new Error("E-mail já cadastrado");

    const cpfExists = await prisma.user.findUnique({ where: { cpf: data.cpf } });
    if (cpfExists) throw new Error("CPF já cadastrado");

    const hashed = await bcrypt.hash(data.password, 10);
    return prisma.user.create({
      data: { name: data.name, email: data.email, password: hashed, cpf: data.cpf },
    });
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    this.validateUpdateFields(data.cpf, data.password);

    const user = await this.findOrFail(id);
    const cpfExists = await prisma.user.findFirst({
      where: { cpf: data.cpf, id: { not: id } },
    });
    if (cpfExists) throw new Error("CPF já cadastrado");

    const hashed = await bcrypt.hash(data.password, 10);
    return prisma.user.update({
      where: { id: user.id },
      data: { name: data.name, cpf: data.cpf, password: hashed },
    });
  }

  async findById(id: string): Promise<User> {
    return this.findOrFail(id);
  }

  async validateLogin(email: string, password: string): Promise<User> {
    if (!validateEmail(email)) throw new Error("E-mail inválido");
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Usuário não encontrado");
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Senha incorreta");
    return user;
  }

  private async findOrFail(id: string): Promise<User> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error("Usuário não encontrado");
    return user;
  }

  private validateFields(email: string, cpf: string, password: string): void {
    if (!validateEmail(email)) throw new Error("E-mail inválido");
    if (!validateCPF(cpf)) throw new Error("CPF inválido");
    if (!validatePassword(password)) {
      throw new Error("Senha fraca: mínimo 8 caracteres, 1 maiúscula e 1 número");
    }
  }

  private validateUpdateFields(cpf: string, password: string): void {
    if (!validateCPF(cpf)) throw new Error("CPF inválido");
    if (!validatePassword(password)) {
      throw new Error("Senha fraca: mínimo 8 caracteres, 1 maiúscula e 1 número");
    }
  }
}
