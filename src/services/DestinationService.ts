import { prisma } from "@/lib/prisma";
import type { CreateDestinationDTO, Destination, PaginatedResult } from "@/types";

const PER_PAGE = 10;

export class DestinationService {
  async list(page: number): Promise<PaginatedResult<Destination>> {
    const skip = (page - 1) * PER_PAGE;
    const [data, total] = await Promise.all([
      prisma.destination.findMany({ skip, take: PER_PAGE, orderBy: { createdAt: "desc" } }),
      prisma.destination.count(),
    ]);
    return { data, total, page, perPage: PER_PAGE, totalPages: Math.ceil(total / PER_PAGE) };
  }

  async create(data: CreateDestinationDTO): Promise<Destination> {
    this.validateFields(data);
    return prisma.destination.create({ data });
  }

  async update(id: string, data: CreateDestinationDTO): Promise<Destination> {
    await this.findOrFail(id);
    this.validateFields(data);
    return prisma.destination.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.findOrFail(id);
    await prisma.destination.delete({ where: { id } });
  }

  async findById(id: string): Promise<Destination> {
    return this.findOrFail(id);
  }

  private async findOrFail(id: string): Promise<Destination> {
    const item = await prisma.destination.findUnique({ where: { id } });
    if (!item) throw new Error("Destino não encontrado");
    return item;
  }

  private validateFields(data: CreateDestinationDTO): void {
    if (!data.name?.trim()) throw new Error("Nome é obrigatório");
    if (!data.country?.trim()) throw new Error("País é obrigatório");
    if (!data.description?.trim()) throw new Error("Descrição é obrigatória");
    if (!data.imageUrl?.trim()) throw new Error("URL da imagem é obrigatória");
  }
}
