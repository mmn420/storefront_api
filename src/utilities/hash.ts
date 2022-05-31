import { hashSync, compareSync } from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const salt_rounds = parseInt(process.env.SALT_ROUNDS as string);
const pepper = process.env.BCRYPT_PASSWORD;

export function generate_hash(password: string): string {
  const hash = hashSync(password + pepper, salt_rounds);
  return hash;
}

export function compare_hash(password: string, hashed_password: string) {
  const result: boolean = compareSync(password + pepper, hashed_password);
  return result;
}
