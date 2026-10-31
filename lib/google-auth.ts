import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION = "aegis_session";
const STATE = "aegis_google_state";
type User = { sub: string; email: string; name: string };

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}
function b64(value: string) { return Buffer.from(value).toString("base64url"); }
function unb64(value: string) { return Buffer.from(value, "base64url").toString("utf8"); }
function sign(value: string) { return createHmac("sha256", env("AEGIS_SESSION_SECRET")).update(value).digest("base64url"); }
function cookie(name: string, value: string, age: number) { return `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${age}`; }
function readCookie(request: Request, name: string) { return request.headers.get("cookie")?.split(";").map((v) => v.trim()).find((v) => v.startsWith(`${name}=`))?.slice(name.length + 1); }

export function googleConfig(origin: string) { return { clientId: env("GOOGLE_CLIENT_ID"), clientSecret: env("GOOGLE_CLIENT_SECRET"), redirectUri: `${origin}/api/auth/callback/google` }; }
export function stateCookie(value: string) { return cookie(STATE, value, 600); }
export function validState(request: Request, state: string | null) { return Boolean(state && readCookie(request, STATE) === state); }
export function sessionCookie(user: User) { const payload = b64(JSON.stringify({ ...user, exp: Date.now() + 8 * 60 * 60 * 1000 })); return cookie(SESSION, `${payload}.${sign(payload)}`, 8 * 60 * 60); }
export function clearSession() { return `${SESSION}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`; }
export function getSession(request: Request): User | null { try { const value = readCookie(request, SESSION); if (!value) return null; const [payload, signature] = value.split("."); const expected = sign(payload); if (!signature || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null; const user = JSON.parse(unb64(payload)) as User & { exp: number }; return user.exp > Date.now() ? { sub: user.sub, email: user.email, name: user.name } : null; } catch { return null; } }
