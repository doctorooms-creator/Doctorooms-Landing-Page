import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Demo request intake. Persists to SQLite via Prisma so the team can
// review inbound "Book a Private Demo" requests. Falls back to a
// logged-only response if the database is unavailable so the landing
// page never breaks the conversion path.
export const runtime = "nodejs";

export const DEMO_STATUSES = [
  "new",
  "contacted",
  "scheduled",
  "archived",
] as const;
type DemoStatus = (typeof DEMO_STATUSES)[number];

function isDemoStatus(v: unknown): v is DemoStatus {
  return typeof v === "string" && (DEMO_STATUSES as readonly string[]).includes(v);
}

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
        phone: true,
        org: true,
        orgType: true,
        size: true,
        note: true,
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

// PATCH /api/demo?id=<cuid> { status: "contacted" | "scheduled" | ... }
// Updates the status of a single demo request. The team uses this from the
// in-page admin overlay to triage inbound leads (new → contacted → scheduled
// → archived). Returns the updated row.
export async function PATCH(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Missing id" },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "Invalid payload" },
        { status: 400 }
      );
    }

    const rawStatus = (body as Record<string, unknown>).status;
    if (!isDemoStatus(rawStatus)) {
      return NextResponse.json(
        {
          ok: false,
          error: `Invalid status. Allowed: ${DEMO_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const updated = await db.demoRequest.update({
      where: { id: String(id).slice(0, 64) },
      data: { status: rawStatus },
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

    return NextResponse.json({ ok: true, row: updated });
  } catch (e) {
    console.error("[demo-request] update error:", e);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
