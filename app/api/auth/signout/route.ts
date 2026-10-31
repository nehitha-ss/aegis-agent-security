import { clearSession } from "@/lib/google-auth";
import { expectedBrowserOrigin } from "@/lib/server-origin";
export const dynamic = "force-dynamic";
export async function POST(request: Request) { if (request.headers.get("origin") && request.headers.get("origin") !== expectedBrowserOrigin(request)) return Response.json({ error: "Invalid origin" }, { status: 403 }); return new Response(null, { status: 204, headers: { "Set-Cookie": clearSession() } }); }
