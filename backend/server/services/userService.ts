import mongoose from "mongoose";
import { UserModel, User } from "../models/User";

// In-memory user store for fallback when MongoDB is unavailable
const memoryUsers = new Map<string, User & { _id: string }>();
let userIdCounter = 1;

export async function findUserByEmail(email: string): Promise<(User & { _id: string }) | null> {
  if (mongoose.connection?.readyState === 1) {
    // MongoDB is connected
    return await UserModel.findOne({ email }).lean();
  }

  // Fallback to in-memory store
  for (const user of memoryUsers.values()) {
    if (user.email === email) return user;
  }
  return null;
}

export async function createUser(userData: {
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  role?: string;
}): Promise<User & { _id: string }> {
  if (mongoose.connection?.readyState === 1) {
    // MongoDB is connected
    const user = await UserModel.create({
      ...userData,
      role: userData.role || "user",
    });
    return user.toObject();
  }

  // Fallback to in-memory store
  const _id = String(userIdCounter++);
  const user: User & { _id: string } = {
    _id,
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    passwordHash: userData.passwordHash,
    role: userData.role || "user",
  };

  memoryUsers.set(_id, user);
  return user;
}

export async function findUserById(id: string): Promise<(User & { _id: string }) | null> {
  if (mongoose.connection?.readyState === 1) {
    // MongoDB is connected
    const user = await UserModel.findById(id).lean();
    return user;
  }

  // Fallback to in-memory store
  return memoryUsers.get(id) || null;
}
