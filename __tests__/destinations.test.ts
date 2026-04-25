import { cleanDb } from "./helpers";
import { DestinationService } from "@/services/DestinationService";

const service = new DestinationService();

const validData = {
  name: "Paris",
  country: "França",
  description: "Cidade luz",
  imageUrl: "https://example.com/paris.jpg",
};

beforeEach(cleanDb);
afterAll(cleanDb);

describe("DestinationService", () => {
  it("cria um destino com dados válidos", async () => {
    const dest = await service.create(validData);
    expect(dest.name).toBe("Paris");
  });

  it("rejeita destino sem nome", async () => {
    await expect(service.create({ ...validData, name: "" })).rejects.toThrow("obrigatório");
  });

  it("lista destinos com paginação", async () => {
    await service.create(validData);
    const result = await service.list(1);
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(0);
  });

  it("atualiza um destino existente", async () => {
    const dest = await service.create(validData);
    const updated = await service.update(dest.id, { ...validData, name: "Lyon" });
    expect(updated.name).toBe("Lyon");
  });

  it("lança 404 ao atualizar destino inexistente", async () => {
    await expect(service.update("id-inexistente", validData)).rejects.toThrow("não encontrado");
  });

  it("deleta um destino existente", async () => {
    const dest = await service.create(validData);
    await expect(service.delete(dest.id)).resolves.not.toThrow();
  });

  it("lança 404 ao deletar destino inexistente", async () => {
    await expect(service.delete("id-inexistente")).rejects.toThrow("não encontrado");
  });
});
