import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";

export async function createTestUser(overrides?: Partial<{ name: string; email: string; cpf: string; password: string }>) {
  const hashed = await bcrypt.hash("Senha123", 10);
  return prisma.user.create({
    data: {
      name: overrides?.name ?? "Teste",
      email: overrides?.email ?? `test-${Date.now()}@test.com`,
      cpf: overrides?.cpf ?? generateCPF(),
      password: overrides?.password ?? hashed,
    },
  });
}

export async function createTestDestination() {
  return prisma.destination.create({
    data: { name: "Tokyo", country: "Japão", description: "Cidade incrível", imageUrl: "https://example.com/tokyo.jpg" },
  });
}

export async function createTestPackage(destinationId: string) {
  return prisma.package.create({
    data: { title: "Pacote Japão", price: 5000, durationDays: 10, description: "Tour completo", destinationId },
  });
}

export function makeToken(userId: string, email: string): string {
  return signToken({ userId, email });
}

export async function cleanDb() {
  await prisma.reservation.deleteMany();
  await prisma.package.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.user.deleteMany();
}

function generateCPF(): string {
  const n = () => Math.floor(Math.random() * 9);
  const d = Array.from({ length: 9 }, n);
  let s1 = d.reduce((acc, v, i) => acc + v * (10 - i), 0);
  let r1 = (s1 * 10) % 11;
  if (r1 === 10 || r1 === 11) r1 = 0;
  d.push(r1);
  let s2 = d.reduce((acc, v, i) => acc + v * (11 - i), 0);
  let r2 = (s2 * 10) % 11;
  if (r2 === 10 || r2 === 11) r2 = 0;
  d.push(r2);
  return d.join("");
}
