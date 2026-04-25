import { cleanDb } from "./helpers";
import { UserService } from "@/services/UserService";

const userService = new UserService();

beforeEach(cleanDb);
afterAll(cleanDb);

function generateValidCPF(): string {
  const n = () => Math.floor(Math.random() * 9);
  const d = Array.from({ length: 9 }, n);
  let s1 = d.reduce((acc, v, i) => acc + v * (10 - i), 0);
  let r1 = (s1 * 10) % 11; if (r1 >= 10) r1 = 0;
  d.push(r1);
  let s2 = d.reduce((acc, v, i) => acc + v * (11 - i), 0);
  let r2 = (s2 * 10) % 11; if (r2 >= 10) r2 = 0;
  d.push(r2);
  return d.join("");
}

describe("UserService.create", () => {
  it("cria usuário com dados válidos", async () => {
    const user = await userService.create({
      name: "João",
      email: `joao-${Date.now()}@test.com`,
      password: "Senha123",
      cpf: generateValidCPF(),
    });
    expect(user.name).toBe("João");
    expect(user.email).toContain("joao-");
  });

  it("rejeita e-mail inválido", async () => {
    await expect(userService.create({ name: "A", email: "invalido", password: "Senha123", cpf: generateValidCPF() }))
      .rejects.toThrow("inválido");
  });

  it("rejeita CPF inválido", async () => {
    await expect(userService.create({ name: "A", email: "a@test.com", password: "Senha123", cpf: "00000000000" }))
      .rejects.toThrow("CPF inválido");
  });

  it("rejeita senha fraca", async () => {
    await expect(userService.create({ name: "A", email: "a@test.com", password: "fraca", cpf: generateValidCPF() }))
      .rejects.toThrow("Senha fraca");
  });

  it("rejeita e-mail duplicado", async () => {
    const email = `dup-${Date.now()}@test.com`;
    await userService.create({ name: "A", email, password: "Senha123", cpf: generateValidCPF() });
    await expect(userService.create({ name: "B", email, password: "Senha123", cpf: generateValidCPF() }))
      .rejects.toThrow("já cadastrado");
  });
});
