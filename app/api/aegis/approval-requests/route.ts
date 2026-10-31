import { expectedBrowserOrigin } from "@/lib/server-origin";

export const dynamic = "force-dynamic";

/**
 * A bounded demo representation of an approval queue. It deliberately creates
 * no capability and exposes no recovery material; a real queue needs company
 * identity, durable storage, and a named approver integration.
 */
export async function POST(request: Request) {
  try {
    if (request.headers.get("origin") && request.headers.get("origin") !== expectedBrowserOrigin(request)) {
      return Response.json({ error: "Invalid origin" }, { status: 403 });
    }
    const text = await request.text();
    if (text.length > 4096) return Response.json({ error: "Request too large" }, { status: 413 });
    const body: unknown = JSON.parse(text);
    if (!body || typeof body !== "object" || (body as { action?: unknown }).action !== "recovery-vault" || (body as { requesterRole?: unknown }).requesterRole !== "analyst") {
      return Response.json({ error: "Only the declared recovery-vault demo request is supported." }, { status: 400 });
    }
    return Response.json({
      approvalId: `apr_${crypto.randomUUID().slice(0, 8)}`,
      decision: "APPROVAL",
      policy: "recovery-vault-gate",
      summary: "The request is paused for a named Finance Security approver. No recovery material or temporary capability was released.",
      status: "PENDING_DEMO_APPROVAL",
      evidenceStatus: "FICTIONAL_DEMO_REQUEST",
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Invalid approval request" }, { status: 400 });
  }
}
