// Uses Web Crypto API so this works in both Edge middleware and Node API routes

async function sign(value: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  const bytes = new Uint8Array(signature);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function createAuthToken(secret: string): Promise<string> {
  const timestamp = Date.now().toString();
  const signature = await sign(timestamp, secret);
  return `${timestamp}.${signature}`;
}

export async function verifyAuthToken(
  token: string | undefined,
  secret: string
): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [timestamp, signature] = parts;

  const expected = await sign(timestamp, secret);
  if (!timingSafeEqualHex(signature, expected)) return false;

  const ts = parseInt(timestamp, 10);
  if (isNaN(ts)) return false;
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  if (Date.now() - ts > thirtyDays) return false;

  return true;
}

export const AUTH_COOKIE_NAME = "studio-j-auth";
