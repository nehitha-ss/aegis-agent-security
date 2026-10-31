import { randomUUID } from "node:crypto";
import { googleConfig, stateCookie } from "@/lib/google-auth";
import { expectedBrowserOrigin } from "@/lib/server-origin";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try { const origin = expectedBrowserOrigin(request); const { clientId, redirectUri } = googleConfig(origin); const state = randomUUID(); const url = new URL("https://accounts.google.com/o/oauth2/v2/auth"); url.search = new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri, response_type: "code", scope: "openid email profile", state, prompt: "select_account" }).toString(); return new Response(null, { status: 302, headers: { Location: url.toString(), "Set-Cookie": stateCookie(state), "Cache-Control": "no-store" } }); } catch { return Response.json({ error: "Google sign-in is not configured." }, { status: 503 }); }
}
