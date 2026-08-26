export const ADMIN_SESSION_COOKIE = "admin_session";

export async function computeSessionValue(password: string): Promise<string> {
  const data = new TextEncoder().encode(`t-style-menu:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function isValidSessionValue(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  const expected = await computeSessionValue(process.env.ADMIN_PASSWORD!);
  return value === expected;
}
