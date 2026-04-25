import { cleanDb, createTestUser, createTestDestination, createTestPackage } from "./helpers";
import { ReservationService } from "@/services/ReservationService";

const service = new ReservationService();

beforeEach(cleanDb);
afterAll(cleanDb);

describe("ReservationService", () => {
  it("cria reserva com dados válidos", async () => {
    const user = await createTestUser();
    const dest = await createTestDestination();
    const pkg = await createTestPackage(dest.id);
    const res = await service.create(user.id, { date: "2025-12-01", packageId: pkg.id });
    expect(res.status).toBe("PENDING");
    expect(res.userId).toBe(user.id);
  });

  it("rejeita reserva sem data", async () => {
    const user = await createTestUser();
    const dest = await createTestDestination();
    const pkg = await createTestPackage(dest.id);
    await expect(service.create(user.id, { date: "", packageId: pkg.id })).rejects.toThrow("obrigatória");
  });

  it("rejeita reserva com pacote inexistente", async () => {
    const user = await createTestUser();
    await expect(service.create(user.id, { date: "2025-12-01", packageId: "id-invalido" })).rejects.toThrow("não encontrado");
  });

  it("lista reservas do usuário com paginação", async () => {
    const user = await createTestUser();
    const dest = await createTestDestination();
    const pkg = await createTestPackage(dest.id);
    await service.create(user.id, { date: "2025-12-01", packageId: pkg.id });
    const result = await service.list(user.id, 1);
    expect(result.data.length).toBe(1);
  });

  it("atualiza reserva existente", async () => {
    const user = await createTestUser();
    const dest = await createTestDestination();
    const pkg = await createTestPackage(dest.id);
    const res = await service.create(user.id, { date: "2025-12-01", packageId: pkg.id });
    const updated = await service.update(res.id, user.id, { date: "2025-12-15", status: "CONFIRMED", packageId: pkg.id });
    expect(updated.status).toBe("CONFIRMED");
  });

  it("lança 404 ao buscar reserva inexistente", async () => {
    const user = await createTestUser();
    await expect(service.findById("id-inexistente", user.id)).rejects.toThrow("não encontrada");
  });

  it("deleta reserva existente", async () => {
    const user = await createTestUser();
    const dest = await createTestDestination();
    const pkg = await createTestPackage(dest.id);
    const res = await service.create(user.id, { date: "2025-12-01", packageId: pkg.id });
    await expect(service.delete(res.id, user.id)).resolves.not.toThrow();
  });
});
