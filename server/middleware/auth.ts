import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/User";

export interface AdminJwtPayload { sub: string; role: "admin"; }
export interface UserJwtPayload { sub: string; role: "user" | "admin"; }

export function signAdminToken(email: string) {
  const secret = process.env.JWT_SECRET || "dev_jwt_secret";
  return jwt.sign({ sub: email, role: "admin" } as AdminJwtPayload, secret, { expiresIn: "2h" });
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const secret = process.env.JWT_SECRET || "dev_jwt_secret";
    const payload = jwt.verify(token, secret) as UserJwtPayload;
    // Check if user is admin by role in token or from database
    if (payload.role !== "admin") return res.status(403).json({ message: "Forbidden" });
    (req as any).admin = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export function signUserToken(id: string, role: string = "user") {
  const secret = process.env.JWT_SECRET || "dev_jwt_secret";
  return jwt.sign({ sub: id, role } as UserJwtPayload, secret, { expiresIn: "7d" });
}

export function requireUser(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const secret = process.env.JWT_SECRET || "dev_jwt_secret";
    const payload = jwt.verify(token, secret) as UserJwtPayload;
    (req as any).user = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
