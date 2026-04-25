export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Package {
  id: string;
  title: string;
  price: number;
  durationDays: number;
  description: string;
  destinationId: string;
  destination?: Destination;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reservation {
  id: string;
  date: Date;
  status: ReservationStatus;
  packageId: string;
  package?: Package;
  userId: string;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  cpf: string;
}

export interface UpdateUserDTO {
  name: string;
  password: string;
  cpf: string;
}

export interface CreateDestinationDTO {
  name: string;
  country: string;
  description: string;
  imageUrl: string;
}

export interface CreatePackageDTO {
  title: string;
  price: number;
  durationDays: number;
  description: string;
  destinationId: string;
}

export interface CreateReservationDTO {
  date: string;
  packageId: string;
}

export interface UpdateReservationDTO {
  date: string;
  status: ReservationStatus;
  packageId: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface ApiError {
  message: string;
  field?: string;
}
