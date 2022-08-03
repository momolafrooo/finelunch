import { compareSync, hashSync } from 'bcrypt';

export function hashPassword(password: string) {
  return hashSync(password, 12);
}

export function comparePassword(password: string, hash: string) {
  return compareSync(password, hash);
}
