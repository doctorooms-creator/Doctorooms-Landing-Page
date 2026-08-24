import { NextResponse } from "next/server";

// Demo request intake. Persists nothing by default — returns a
// confirmation. A future integration can write to a CRM / DB.
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }

    const required = ["name", "email", "org"];
    for (const key of required) {
      const v = String((body as Record<string, unknown>)[key] ?? "").trim();
      if (!v) {
        return NextResponse.json(
          { ok: false, error: `Missing field: ${key}` },
          { status: 400 }
        );
      }
    }

    // In production this would enqueue to CRM / email. For now, log server-side.
    console.info("[demo-request]", JSON.stringify(body));

    return NextResponse.json({
      ok: true,
      message: "Demo request received. Our team will reach out within one business day.",
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
