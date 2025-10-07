// helpers/bcryptHelper.ts
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/**
 * Encrypt (hash) a token using bcrypt
 * @param token Raw token string
 * @returns Encrypted (hashed) token
 */
export async function encryptToken(token: string): Promise<string> {
  return await bcrypt.hash(token, SALT_ROUNDS);
}

/**
 * Compare raw token with hashed token
 * @param token Raw token to verify
 * @param hashedToken Stored hashed token
 * @returns true if match, false otherwise
 */
export async function compareToken(
  token: string,
  hashedToken: string
): Promise<boolean> {
  return await bcrypt.compare(token, hashedToken);
}
