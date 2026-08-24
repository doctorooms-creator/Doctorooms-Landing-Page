import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Demo request intake. Persists to SQLite via Prisma so the team can
// review inbound "Book a Private Demo" requests. Falls back to a
// logged-only response if the database is unavailable so the landing
// page never breaks the conversion path.
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

    const str = (v: unknown) =>
      v == null ? undefined : String(v).slice(0, 2000);

    const data = {
      name: String((body as Record<string, unknown>).name).trim().slice(0, 200),
      email: String((body as Record<string, unknown>).email).trim().slice(0, 320),
      phone: str((body as Record<string, unknown>).phone)?.trim() || undefined,
      org: String((body as Record<string, unknown>).org).trim().slice(0, 200),
      orgType: str((body as Record<string, unknown>).orgType)?.trim() || undefined,
      size: str((body as Record<string, unknown>).size)?.trim() || undefined,
      note: str((body as Record<string, unknown>).note)?.trim() || undefined,
      source: str((body as Record<string, unknown>).source) || "landing",
    };

    // Try to persist; if the DB is unavailable, still log + succeed so the
    // conversion path is never broken by infra.
    try {
      await db.demoRequest.create({ data });
    } catch (dbErr) {
      console.error("[demo-request] db write failed:", dbErr);
      console.info("[demo-request] (unpersisted)", JSON.stringify(data));
    }

    return NextResponse.json({
      ok: true,
      message: "Demo request received. Our team will reach out within one business day.",
    });
  } catch (e) {
    console.error("[demo-request] server error:", e);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}

// Read-only list endpoint for the team (no auth in this demo sandbox).
export async function GET() {
  try {
    const rows = await db.demoRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        name: true,
        email: true,
        org: true,
        orgType: true,
        size: true,
        source: true,
        status: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ ok: true, count: rows.length, rows });
  } catch (e) {
    console.error("[demo-request] list error:", e);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
