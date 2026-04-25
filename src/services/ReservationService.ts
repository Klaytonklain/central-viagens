import { prisma } from "@/lib/prisma";
import type {
  CreateReservationDTO,
  UpdateReservationDTO,
  Reservation,
  PaginatedResult,
} from "@/types";

const PER_PAGE = 10;

type PrismaReservation = Awaited<ReturnType<typeof prisma.reservation.findFirst>>;

function toReservation(item: NonNullable<PrismaReservation>): Reservation {
  return item as unknown as Reservation;
}

export class ReservationService {
  async list(userId: string, page: number): Promise<PaginatedResult<Reservation>> {
    const skip = (page - 1) * PER_PAGE;
    const where = { userId };
    const [data, total] = await Promise.all([
      prisma.reservation.findMany({
        where,
        skip,
        take: PER_PAGE,
        orderBy: { createdAt: "desc" },
        include: { package: { include: { destination: true } } },
      }),
      prisma.reservation.count({ where }),
    ]);
    return {
      data: data as unknown as Reservation[],
      total,
      page,
      perPage: PER_PAGE,
      totalPages: Math.ceil(total / PER_PAGE),
    };
  }

  async create(userId: string, data: CreateReservationDTO): Promise<Reservation> {
    if (!data.date) throw new Error("Data é obrigatória");
    if (!data.packageId) throw new Error("Pacote é obrigatório");
    await this.validatePackage(data.packageId);
    const item = await prisma.reservation.create({
      data: { date: new Date(data.date), packageId: data.packageId, userId },
      include: { package: { include: { destination: true } } },
    });
    return toReservation(item);
  }

  async update(id: string, userId: string, data: UpdateReservationDTO): Promise<Reservation> {
    await this.findOrFail(id, userId);
    if (!data.date) throw new Error("Data é obrigatória");
    await this.validatePackage(data.packageId);
    const item = await prisma.reservation.update({
      where: { id },
      data: { date: new Date(data.date), status: data.status, packageId: data.packageId },
      include: { package: { include: { destination: true } } },
    });
    return toReservation(item);
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.findOrFail(id, userId);
    await prisma.reservation.delete({ where: { id } });
  }

  async findById(id: string, userId: string): Promise<Reservation> {
    return this.findOrFail(id, userId);
  }

  private async findOrFail(id: string, userId: string): Promise<Reservation> {
    const item = await prisma.reservation.findFirst({
      where: { id, userId },
      include: { package: { include: { destination: true } } },
    });
    if (!item) throw new Error("Reserva não encontrada");
    return toReservation(item);
  }

  private async validatePackage(packageId: string): Promise<void> {
    const pkg = await prisma.package.findUnique({ where: { id: packageId } });
    if (!pkg) throw new Error("Pacote não encontrado");
  }
}
