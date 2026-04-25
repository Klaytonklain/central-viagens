import { cleanDb, createTestDestination } from "./helpers";
import { PackageService } from "@/services/PackageService";

const service = new PackageService();

beforeEach(cleanDb);
afterAll(cleanDb);

async function validData(destinationId: string) {
  return {
    title: "Tour Europa",
    price: 8000,
    durationDays: 15,
    description: "Roteiro completo",
    destinationId,
  };
}

describe("PackageService", () => {
  it("cria pacote com dados válidos", async () => {
    const dest = await createTestDestination();
    const pkg = await service.create(await validData(dest.id));
    expect(pkg.title).toBe("Tour Europa");
    expect(pkg.destination).toBeDefined();
  });

  it("rejeita pacote sem destino", async () => {
    await expect(service.create(await validData("id-invalido"))).rejects.toThrow("não encontrado");
  });

  it("rejeita preço inválido", async () => {
    const dest = await createTestDestination();
    const data = await validData(dest.id);
    await expect(service.create({ ...data, price: -1 })).rejects.toThrow("positivo");
  });

  it("lista pacotes com paginação", async () => {
    const dest = await createTestDestination();
    await service.create(await validData(dest.id));
    const result = await service.list(1);
    expect(result.data.length).toBeGreaterThan(0);
  });

  it("atualiza pacote existente", async () => {
    const dest = await createTestDestination();
    const pkg = await service.create(await validData(dest.id));
    const updated = await service.update(pkg.id, { ...(await validData(dest.id)), title: "Novo título" });
    expect(updated.title).toBe("Novo título");
  });

  it("lança 404 ao atualizar pacote inexistente", async () => {
    const dest = await createTestDestination();
    await expect(service.update("id-inexistente", await validData(dest.id))).rejects.toThrow("não encontrado");
  });

  it("deleta pacote existente", async () => {
    const dest = await createTestDestination();
    const pkg = await service.create(await validData(dest.id));
    await expect(service.delete(pkg.id)).resolves.not.toThrow();
  });

  it("lança 404 ao deletar pacote inexistente", async () => {
    await expect(service.delete("id-inexistente")).rejects.toThrow("não encontrado");
  });
});
