"use client";

interface AlertProps {
  message: string;
  type?: "error" | "success";
}

export function Alert({ message, type = "error" }: AlertProps) {
  const styles = {
    error: "bg-red-50 border border-red-300 text-red-700",
    success: "bg-green-50 border border-green-300 text-green-700",
  };

  return (
    <div className={`rounded px-4 py-3 text-sm ${styles[type]}`}>
      {message}
    </div>
  );
}
