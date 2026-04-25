import { createTestUser, cleanDb } from "./helpers";
import { UserService } from "@/services/UserService";

const userService = new UserService();

beforeEach(cleanDb);
afterAll(cleanDb);

describe("Auth — UserService.validateLogin", () => {
  it("retorna o usuário com credenciais corretas", async () => {
    await createTestUser({ email: "login@test.com" });
    const user = await userService.validateLogin("login@test.com", "Senha123");
    expect(user.email).toBe("login@test.com");
  });

  it("lança erro para e-mail inválido", async () => {
    await expect(userService.validateLogin("nao-email", "Senha123")).rejects.toThrow("inválido");
  });

  it("lança erro para usuário não existente", async () => {
    await expect(userService.validateLogin("naoexiste@test.com", "Senha123")).rejects.toThrow("não encontrado");
  });

  it("lança erro para senha incorreta", async () => {
    await createTestUser({ email: "senha@test.com" });
    await expect(userService.validateLogin("senha@test.com", "SenhaErrada1")).rejects.toThrow("incorreta");
  });
});
