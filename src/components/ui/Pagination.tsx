"use client";

import { Button } from "./Button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-2 justify-center mt-4">
      <Button
        variant="secondary"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        Anterior
      </Button>
      <span className="text-sm text-gray-600">
        Página {page} de {totalPages}
      </span>
      <Button
        variant="secondary"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Próxima
      </Button>
    </div>
  );
}
