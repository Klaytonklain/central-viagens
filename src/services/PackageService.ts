import { prisma } from "@/lib/prisma";
import type { CreatePackageDTO, Package, PaginatedResult } from "@/types";

const PER_PAGE = 10;

export class PackageService {
  async list(page: number): Promise<PaginatedResult<Package>> {
    const skip = (page - 1) * PER_PAGE;
    const [data, total] = await Promise.all([
      prisma.package.findMany({
        skip,
        take: PER_PAGE,
        orderBy: { createdAt: "desc" },
        include: { destination: true },
      }),
      prisma.package.count(),
    ]);
    return { data, total, page, perPage: PER_PAGE, totalPages: Math.ceil(total / PER_PAGE) };
  }

  async create(data: CreatePackageDTO): Promise<Package> {
    this.validateFields(data);
    await this.validateDestination(data.destinationId);
    return prisma.package.create({ data, include: { destination: true } });
  }

  async update(id: string, data: CreatePackageDTO): Promise<Package> {
    await this.findOrFail(id);
    this.validateFields(data);
    await this.validateDestination(data.destinationId);
    return prisma.package.update({ where: { id }, data, include: { destination: true } });
  }

  async delete(id: string): Promise<void> {
    await this.findOrFail(id);
    await prisma.package.delete({ where: { id } });
  }

  async findById(id: string): Promise<Package> {
    return this.findOrFail(id);
  }

  private async findOrFail(id: string): Promise<Package> {
    const item = await prisma.package.findUnique({ where: { id }, include: { destination: true } });
    if (!item) throw new Error("Pacote não encontrado");
    return item;
  }

  private validateFields(data: CreatePackageDTO): void {
    if (!data.title?.trim()) throw new Error("Título é obrigatório");
    if (!data.price || data.price <= 0) throw new Error("Preço deve ser positivo");
    if (!data.durationDays || data.durationDays <= 0) throw new Error("Duração deve ser positiva");
    if (!data.description?.trim()) throw new Error("Descrição é obrigatória");
    if (!data.destinationId?.trim()) throw new Error("Destino é obrigatório");
  }

  private async validateDestination(destinationId: string): Promise<void> {
    const dest = await prisma.destination.findUnique({ where: { id: destinationId } });
    if (!dest) throw new Error("Destino não encontrado");
  }
}
