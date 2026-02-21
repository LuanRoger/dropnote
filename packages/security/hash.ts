import "server-only";
import bcrypt from "bcrypt";
import { keys as env } from "./env";

export function hashPassword(password: string) {
  const saltRounds = env().SALT_ROUNDS;
  return bcrypt.hash(password, saltRounds);
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
