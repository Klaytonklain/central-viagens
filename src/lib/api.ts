export async function apiFetch(path: string, token: string, options?: RequestInit) {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options?.headers ?? {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Erro na requisição");
  return data;
}
