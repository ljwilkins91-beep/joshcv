import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "studio-j-auth";

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function createAuthToken(secret: string): string {
  // Token is "<timestamp>.<signature>" — valid for 30 days
  const timestamp = Date.now().toString();
  const signature = sign(timestamp, secret);
  return `${timestamp}.${signature}`;
}

export function verifyAuthToken(token: string | undefined, secret: string): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [timestamp, signature] = parts;

  // Check signature
  const expected = sign(timestamp, secret);
  const sigBuf = Buffer.from(signature, "hex");
  const expBuf = Buffer.from(expected, "hex");
  if (sigBuf.length !== expBuf.length) return false;
  if (!timingSafeEqual(sigBuf, expBuf)) return false;

  // Check expiry (30 days)
  const ts = parseInt(timestamp, 10);
  if (isNaN(ts)) return false;
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  if (Date.now() - ts > thirtyDays) return false;

  return true;
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;
