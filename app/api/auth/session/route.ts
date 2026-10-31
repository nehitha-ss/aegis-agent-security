import { getSession } from "@/lib/google-auth";
export const dynamic = "force-dynamic";
export async function GET(request: Request) { const user = getSession(request); return user ? Response.json({ user }, { headers: { "Cache-Control": "no-store" } }) : Response.json({ user: null }, { status: 401, headers: { "Cache-Control": "no-store" } }); }
