import { NextRequest } from "next/server";
import { verifyToken } from "./jwt";
import type { JwtPayload } from "@/types";

export function getAuthUser(req: NextRequest): JwtPayload | null {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  try {
    return verifyToken(header.slice(7));
  } catch {
    return null;
  }
}
