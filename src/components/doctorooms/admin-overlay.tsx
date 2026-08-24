"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Inbox,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

/**
 * AdminOverlay — in-page team panel (no new route, per the single-route rule).
 *
 * Opened by:
 *   • `Shift + A` (registered by `BackToTop` so all global shortcuts live in one place)
 *   • the "Team admin" entry added to the keyboard-shortcuts help dialog
 *
 * Pulls `/api/demo` (GET, 50 most recent) and lets the team:
 *   • Search across name/email/org/orgType
 *   • Filter by status (new / contacted / scheduled / archived)
 *   • Change status inline (PATCH /api/demo?id=...) — useful triage workflow
 *   • See KPI counts at a glance
 *
 * Reduced-motion safe (CSS only). No auth in this demo sandbox; the comment
 * in the header makes that clear to the team.
 */

type Row = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  org: string;
  orgType?: string | null;
  size?: string | null;
  note?: string | null;
  source?: string | null;
  status: string;
  createdAt: string;
};

const STATUSES = [
  { value: "new", label: "New", tone: "brand", icon: Inbox },
  { value: "contacted", label: "Contacted", tone: "amber", icon: Mail },
  { value: "scheduled", label: "Scheduled", tone: "growth", icon: Clock },
  { value: "archived", label: "Archived", tone: "muted", icon: CheckCircle2 },
] as const;

const STATUS_NEXT: Record<string, string> = {
  new: "contacted",
  contacted: "scheduled",
  scheduled: "archived",
  archived: "new",
};

function toneClasses(tone: string) {
  switch (tone) {
    case "brand":
      return "border-brand/30 bg-brand-soft/50 text-brand";
    case "amber":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    case "growth":
      return "border-growth/30 bg-growth/10 text-growth";
    default:
      return "border-border/60 bg-muted/40 text-muted-foreground";
  }
}

function statusMeta(v: string) {
  return STATUSES.find((s) => s.value === v) ?? STATUSES[0];
}

function timeAgo(iso: string) {
  const then = new Date(iso).getTime();
  const diff = Math.max(0, Date.now() - then);
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d ago`;
  const mo = Math.floor(day / 30);
  return `${mo}mo ago`;
}

function escapeCsv(v: string) {
  if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

export function AdminOverlay({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/demo", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setRows(Array.isArray(json.rows) ? (json.rows as Row[]) : []);
      setLastFetch(Date.now());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && rows.length === 0 && !loading && !error) {
      void load();
    }
  }, [open, load, rows.length, loading, error]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.org.toLowerCase().includes(q) ||
        (r.orgType ?? "").toLowerCase().includes(q)
      );
    });
  }, [rows, filter, query]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { new: 0, contacted: 0, scheduled: 0, archived: 0 };
    for (const r of rows) {
      if (c[r.status] != null) c[r.status] += 1;
    }
    return c;
  }, [rows]);

  async function changeStatus(r: Row, next: string) {
    setUpdatingId(r.id);
    try {
      const res = await fetch(`/api/demo?id=${encodeURIComponent(r.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const updated = json.row as Row | undefined;
      setRows((prev) =>
        prev.map((row) => (row.id === r.id ? { ...row, status: updated?.status ?? next } : row))
      );
      track("admin_status_change", {
        id: r.id,
        from: r.status,
        to: next,
        org: r.org,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update");
    } finally {
      setUpdatingId(null);
    }
  }

  function exportCsv() {
    const header = ["name", "email", "phone", "org", "orgType", "size", "status", "createdAt", "note"];
    const lines = filtered.map((r) =>
      [
        r.name,
        r.email,
        r.phone ?? "",
        r.org,
        r.orgType ?? "",
        r.size ?? "",
        r.status,
        new Date(r.createdAt).toISOString(),
        r.note ?? "",
      ]
        .map(escapeCsv)
        .join(",")
    );
    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `doctorooms-demo-requests-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[92vh] overflow-hidden p-0 sm:max-w-5xl"
        aria-describedby="admin-overlay-desc"
      >
        <div className="flex max-h-[92vh] flex-col">
          {/* Header */}
          <DialogHeader className="border-b border-border/60 bg-gradient-to-br from-brand-soft/40 to-transparent px-5 py-4 sm:px-6">
            <DialogTitle className="flex flex-wrap items-center gap-2 text-xl">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <ShieldCheck className="h-4 w-4" />
              </span>
              Team admin
              <Badge className="ml-1 border-border/60 bg-muted/40 text-[10px] font-normal text-muted-foreground">
                demo-requests
              </Badge>
            </DialogTitle>
            <DialogDescription id="admin-overlay-desc" className="text-xs">
              Inbound &quot;Book a Private Demo&quot; submissions, persisted to the
              landing-page SQLite database. No auth in this sandbox view —
              replace with a real auth gate before sharing the URL broadly.
            </DialogDescription>
          </DialogHeader>

          {/* KPI row */}
          <div className="grid grid-cols-2 gap-px border-b border-border/60 bg-border/40 sm:grid-cols-4">
            {STATUSES.map((s) => {
              const Icon = s.icon;
              const active = filter === s.value;
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setFilter(active ? "all" : s.value)}
                  className={cn(
                    "flex items-center gap-3 bg-background px-4 py-3 text-left transition-colors hover:bg-muted/30",
                    active && "bg-muted/40"
                  )}
                  aria-pressed={active}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                      toneClasses(s.tone)
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      {s.label}
                    </div>
                    <div className="text-lg font-semibold tabular-nums leading-tight text-foreground">
                      {counts[s.value] ?? 0}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-border/60 px-4 py-3 sm:px-6">
            <div className="relative min-w-[180px] flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, email, org…"
                className="h-9 pl-8"
                aria-label="Search demo requests"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="h-9 w-[150px]" aria-label="Filter by status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void load()}
              disabled={loading}
              className="h-9"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
              Refresh
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={exportCsv}
              disabled={filtered.length === 0}
              className="h-9"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Export CSV
            </Button>
            <div className="ml-auto hidden items-center gap-1.5 text-[11px] text-muted-foreground sm:flex">
              <Users className="h-3 w-3" />
              <span className="tabular-nums">{filtered.length}</span>
              <span>of</span>
              <span className="tabular-nums">{rows.length}</span>
              <span>shown</span>
              {lastFetch && (
                <span className="ml-1">· updated {timeAgo(new Date(lastFetch).toISOString())}</span>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            {error && (
              <div className="m-4 flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <div className="font-medium">Couldn&apos;t reach the demo-request store</div>
                  <div className="text-[11px] opacity-80">{error}</div>
                </div>
              </div>
            )}

            {loading && rows.length === 0 ? (
              <div className="space-y-3 p-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-1/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-7 w-24 rounded-full" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/40 text-muted-foreground">
                  <Inbox className="h-7 w-7" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {rows.length === 0 ? "No demo requests yet" : "No matches"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {rows.length === 0
                      ? "Submit the Book-a-Demo form to see leads here."
                      : "Try a different search or clear the status filter."}
                  </div>
                </div>
                {rows.length === 0 && (
                  <Button size="sm" variant="outline" onClick={() => void load()}>
                    <RefreshCw className="h-3.5 w-3.5" /> Reload
                  </Button>
                )}
              </div>
            ) : (
              <ul className="divide-y divide-border/40">
                {filtered.map((r) => {
                  const meta = statusMeta(r.status);
                  const StatusIcon = meta.icon;
                  const next = STATUS_NEXT[r.status] ?? "new";
                  const isUpdating = updatingId === r.id;
                  return (
                    <li
                      key={r.id}
                      className="grid grid-cols-1 gap-3 px-4 py-3.5 transition-colors hover:bg-muted/20 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">{r.name}</span>
                          <Badge className={cn("border", toneClasses(meta.tone))}>
                            <StatusIcon className="h-3 w-3" />
                            {meta.label}
                          </Badge>
                          {r.orgType && (
                            <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                              {r.orgType}
                            </span>
                          )}
                          {r.size && (
                            <span className="text-[10px] text-muted-foreground">· {r.size}</span>
                          )}
                          <span className="text-[10px] text-muted-foreground">· {timeAgo(r.createdAt)}</span>
                        </div>
                        <div className="mt-0.5 truncate text-xs text-muted-foreground">
                          {r.org}
                          <span className="mx-1.5 opacity-40">·</span>
                          <a
                            href={`mailto:${r.email}`}
                            className="text-brand hover:underline"
                          >
                            {r.email}
                          </a>
                          {r.phone && (
                            <>
                              <span className="mx-1.5 opacity-40">·</span>
                              <a href={`tel:${r.phone}`} className="inline-flex items-center gap-1 hover:underline">
                                <Phone className="h-3 w-3" /> {r.phone}
                              </a>
                            </>
                          )}
                        </div>
                        {r.note && (
                          <div className="mt-1 line-clamp-2 text-xs italic text-muted-foreground">
                            “{r.note}”
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 sm:justify-end">
                        <Select
                          value={r.status}
                          onValueChange={(v) => void changeStatus(r, v)}
                          disabled={isUpdating}
                        >
                          <SelectTrigger
                            className="h-8 w-[140px] text-xs"
                            aria-label={`Change status for ${r.name}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => (
                              <SelectItem key={s.value} value={s.value}>
                                {s.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-8 px-2.5 text-[11px]"
                          onClick={() => void changeStatus(r, next)}
                          disabled={isUpdating}
                          aria-label={`Advance ${r.name} to ${statusMeta(next).label}`}
                        >
                          {isUpdating ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <>
                              → {statusMeta(next).label}
                            </>
                          )}
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 border-t border-border/60 bg-muted/20 px-4 py-3 text-[11px] text-muted-foreground sm:px-6">
            <span className="tabular-nums">
              {rows.length} total · {counts.new} new · {counts.scheduled} scheduled
            </span>
            <span className="hidden sm:inline">
              Tip: press <kbd>Esc</kbd> to close, or <kbd>Shift</kbd>+<kbd>A</kbd> to reopen later.
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
