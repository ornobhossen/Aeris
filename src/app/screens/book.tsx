"use client";

import { useMemo, useState } from "react";
import type { Option } from "../data";
import { useApp } from "../store";
import { Shell, Card, Badge, Photo, Section } from "../ui";
import {
  IconChevronRight,
  IconStar,
  IconSparkle,
  IconShield,
  IconCheckCircle,
  IconAlert,
  IconInfo,
  IconRefresh,
  IconClock,
  IconUsers,
  IconCard,
} from "../icons";

function numOf(s: string): number {
  return Number(String(s).replace(/[^0-9.]/g, "")) || 0;
}

function findOption(trip: ReturnType<typeof useApp>["trip"], id: string): Option | undefined {
  return (
    trip.options.find((o) => o.id === id) ??
    trip.alerts.flatMap((a) => a.alternatives ?? []).find((o) => o.id === id)
  );
}

function actLabel(o: Option): string {
  return { flight: "Flight", stay: "Stay", food: "Dinner", activity: "Activity", transfer: "Car / taxi", guide: "Tour guide" }[o.actId];
}

const trackBadge = (o: Option) =>
  o.track === "ai" ? (
    <Badge tone="ai">
      <IconSparkle size={11} /> AI pick
    </Badge>
  ) : (
    <Badge tone="muted">Found manually</Badge>
  );

/* ──────────────── Option detail ──────────────── */

export function OptionDetailScreen() {
  const { trip, go, back, route, money } = useApp();
  const id = String(route.params?.optionId ?? "");
  const option = useMemo(() => findOption(trip, id), [trip, id]);

  if (!option) {
    return (
      <Shell title="Option" onBack={back}>
        <div className="content">
          <div className="empty-state">
            <div className="es-icon">
              <IconInfo size={24} />
            </div>
            <h3>Option not found</h3>
            <p>Head back to the comparison list and pick another candidate.</p>
            <button className="btn btn-secondary" onClick={back}>
              Back to compare
            </button>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell title={actLabel(option)} sub={option.title} onBack={back}>
      <div className="content">
        <Photo src={option.photo} ratio={option.photoRatio} alt={option.title} />
        <div style={{ marginTop: 14 }}>
          <div className="spread">
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 750 }}>{option.title}</h2>
            {trackBadge(option)}
          </div>
          <div className="small muted" style={{ marginTop: 3 }}>
            {option.subtitle}
          </div>
          <div className="hstack" style={{ gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            {option.tags.map((t) => (
              <Badge key={t} tone="outline">
                {t}
              </Badge>
            ))}
            {option.rating ? (
              <span className="hstack" style={{ gap: 3 }}>
                <IconStar size={14} style={{ color: "var(--amber)" }} />
                <b style={{ fontSize: 13 }}>{option.rating}</b>
                <span className="muted small">({option.reviews} reviews)</span>
              </span>
            ) : null}
          </div>

          <div className="spread" style={{ marginTop: 14, padding: "14px 0", borderTop: "1px solid var(--border-soft)", borderBottom: "1px solid var(--border-soft)" }}>
            <div>
              <div className="small muted">Total for your booking</div>
              <div style={{ fontSize: 24, fontWeight: 750 }}>
                {money(option.price)}
                <span className="muted" style={{ fontSize: 13, fontWeight: 500 }}> {option.priceNote}</span>
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => go("checkout", { optionId: option.id })}>
              Book <IconChevronRight size={15} />
            </button>
          </div>

          {option.reason && (
            <div className="ai-note" style={{ marginTop: 14 }}>
              <IconSparkle size={14} />
              <span>{option.reason}</span>
            </div>
          )}

          <p className="small fg2" style={{ marginTop: 14 }}>
            {option.desc}
          </p>

          <Section title="Conditions">
            <div className="vstack" style={{ gap: 6 }}>
              {option.conditions?.map((c) => (
                <div key={c} className="hstack" style={{ gap: 8 }}>
                  <IconInfo size={14} className="muted" />
                  <span className="small fg2">{c}</span>
                </div>
              ))}
              <div className="hstack" style={{ gap: 8 }}>
                <IconShield size={14} style={{ color: "var(--teal)" }} />
                <span className="small fg2">Anything booked here goes through the approval gate first.</span>
              </div>
            </div>
          </Section>

          <button className="btn btn-ghost btn-full" onClick={() => go("search-compare")}>
            Back to comparison list
          </button>
        </div>
      </div>
    </Shell>
  );
}

/* ──────────────── Checkout + Approval Gate ──────────────── */

export function CheckoutScreen() {
  const { trip, go, back, reset, route, openGate, run, notify, money } = useApp();
  const id = String(route.params?.optionId ?? "");
  const option = useMemo(() => findOption(trip, id), [trip, id]);
  const [booked, setBooked] = useState(false);

  if (!option) {
    return (
      <Shell title="Checkout" onBack={back}>
        <div className="content">
          <div className="empty-state">
            <div className="es-icon">
              <IconInfo size={24} />
            </div>
            <h3>Nothing to book</h3>
            <button className="btn btn-secondary" onClick={back}>
              Go back
            </button>
          </div>
        </div>
      </Shell>
    );
  }

  const perPerson = numOf(option.price);
  const quantity = option.actId === "flight" || option.actId === "guide" ? trip.travellers.length : option.actId === "stay" ? 2 : 1;
  const total = perPerson * quantity;
  const groupSplit = trip.mode === "group";

  const doBook = () => {
    openGate({
      id: "book:" + option.id,
      title: `Book ${option.title}?`,
      sub: `${groupSplit ? `Split across the group of ${trip.travellers.length}` : "You pay now"} - shown here before anything is held.`,
      kind: "money",
      diffs: [
        { label: "Itinerary", old: "Not booked", mine: `Add ${actLabel(option)}: ${option.title}` },
        { label: "Schedule", old: "—", mine: option.subtitle },
        { label: "Cost /person", old: "—", mine: `${money(perPerson)}`, delta: `+${money(perPerson)}` },
        { label: "Budget left", old: `${money(trip.budget.remaining)}`, mine: `${money(Math.max(0, numOf(trip.budget.remaining) - total))}`, delta: `-${money(total)}` },
      ],
      conditions: option.conditions ?? [],
      travellers: trip.travellers.map((t) => t.name),
      budgetNote: `New remaining ${money(Math.max(0, numOf(trip.budget.remaining) - total))}`,
      approveLabel: `Approve & book - ${money(total)}`,
      onApprove: () => {
        run((t) => {
          const remaining = Math.max(0, numOf(t.budget.remaining) - total);
          return {
            ...t,
            budget: { ...t.budget, remaining: `${remaining}`, remainingPct: Math.round((remaining / numOf(t.budget.total)) * 100) },
            history: [
              {
                id: "hb-" + option.id,
                kind: "booked",
                text: `${actLabel(option)} booked: ${option.title}`,
                who: groupSplit ? "You approved the gate for everyone" : "You",
                time: "just now",
                approvedBy: groupSplit ? "You" : "You",
              },
              ...t.history,
            ],
          };
        });
        notify(`Booked ${option.title}. Change history updated.`);
        setBooked(true);
      },
    });
  };

  if (booked) {
    return (
      <Shell title="Booking" onBack={back}>
        <div className="content">
          <div className="empty-state">
            <div className="es-icon" style={{ background: "var(--success-bg)", color: "var(--success)" }}>
              <IconCheckCircle size={26} />
            </div>
            <h3>Booked and approved</h3>
            <p>
              {option.title} is on your itinerary. The approval gate logged it in your change history, budget
              updated, and travellers who can opt out were notified.
            </p>
            <div className="hstack" style={{ justifyContent: "center", gap: 8, marginTop: 8 }}>
              <button className="btn btn-primary" onClick={() => go("change-history")}>
                View change history
              </button>
            </div>
            <button className="btn btn-secondary btn-full" style={{ marginTop: 10 }} onClick={() => reset("trip-dashboard")}>
              Back to trip
            </button>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell title="Checkout" sub={option.title} onBack={back}>
      <div className="content">
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <Photo src={option.photo} ratio={option.photoRatio} alt={option.title} />
          <div style={{ padding: 15 }}>
            <div className="spread">
              <div className="rl-title" style={{ fontSize: 15 }}>
                {option.title}
              </div>
              {trackBadge(option)}
            </div>
            <div className="small muted">{option.subtitle}</div>
          </div>
        </Card>

        <Card style={{ marginTop: 12 }}>
          <div className="section-row" style={{ marginBottom: 8 }}>
            <h3 className="section-title" style={{ margin: 0 }}>
              Payment
            </h3>
          </div>
          <div className="spread" style={{ padding: "8px 0" }}>
            <div className="hstack" style={{ gap: 10 }}>
              <div className="expense-icon" style={{ background: "var(--teal-bg)", color: "var(--teal)" }}>
                <IconCard />
              </div>
              <div>
                <div className="rl-title" style={{ fontSize: 14 }}>
                  {groupSplit ? `Split across the group · equal` : "You pay now"}
                </div>
                <div className="small muted">Visa ... 4242</div>
              </div>
            </div>
            <IconChevronRight size={16} className="muted" />
          </div>
          <div className="divider" />
          <div className="vstack" style={{ gap: 6 }}>
            <Row label={actLabel(option)} value={`${option.price} x ${quantity}`} />
            <Row label="Fees & taxes" value="incl." />
            <Row label="Approval gate" value="before payment" />
            <div className="spread" style={{ paddingTop: 8, borderTop: "1px solid var(--border-soft)" }}>
              <b style={{ fontSize: 15 }}>Total</b>
              <b style={{ fontSize: 16 }}>{money(total)}</b>
            </div>
          </div>
          {groupSplit && (
            <div className="small muted" style={{ marginTop: 10 }}>
              Each traveller clears their share later in Settlement, using the fewest transfers possible.
            </div>
          )}
        </Card>

        <button className="btn btn-primary btn-full" style={{ marginTop: 16 }} onClick={doBook}>
          <IconShield size={16} /> Confirm booking - {money(total)}
        </button>
      </div>
    </Shell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="spread small">
      <span className="muted">{label}</span>
      <span className="fg2" style={{ fontWeight: 600 }}>
        {value}
      </span>
    </div>
  );
}

/* ──────────────── Alerts & disruptions ──────────────── */

export function AlertsDisruptionsScreen() {
  const { trip, back, go, openGate, run, notify, money } = useApp();
  const [picked, setPicked] = useState<string | null>(null);
  const [refreshSpin, setRefreshSpin] = useState(false);

  const remaining = numOf(trip.budget.remaining);

  const applyReplacement = (alt: Option) => {
    openGate({
      id: "alt:" + alt.id,
      title: `Switch to ${alt.title}?`,
      sub: "Replacing the disrupted flight keeps the group moving. Nothing changes until you approve.",
      kind: "schedule",
      diffs: [
        { label: "Departure", old: "09:15 (delayed)", mine: alt.subtitle },
        { label: "Cost /person", old: `${money(142)}`, mine: `${money(alt.price)}`, delta: `${numOf(alt.price) > 142 ? `+${money(numOf(alt.price) - 142)}` : `${money(numOf(alt.price) - 142)}`}` },
        { label: "Budget left", old: `${money(trip.budget.remaining)}`, mine: `${money(Math.max(0, remaining - numOf(alt.price) * trip.travellers.length))}` },
      ],
      conditions: alt.conditions ?? ["Fares are what you approve - no surprise mark-up"],
      travellers: trip.travellers.map((t) => t.name),
      budgetNote: numOf(alt.price) <= 142 ? "Stays within budget" : "Over budget, flagged",
      approveLabel: `Approve & rebook`,
      onApprove: () => {
        run((t) => ({
          ...t,
          alerts: t.alerts.map((a) =>
            a.id === "a1" ? { ...a, resolved: true, status: "Rebooked via gate" } : a
          ),
          history: [
            {
              id: "ht-" + alt.id,
              kind: "warn",
              text: `Disruption: switched to ${alt.title}`,
              who: "Airline delay on AF 1644",
              time: "just now",
              approvedBy: "You",
            },
            ...t.history,
          ],
        }));
        notify(`Rebooked to ${alt.title}. Status: arriving as planned.`);
      },
    });
  };

  return (
    <Shell title="Alerts & disruptions" sub="15-minute debounce active" onBack={back}>
      <div className="content">
        <div className="ai-note" style={{ marginTop: 0 }}>
          <IconClock size={14} />
          <span>
            Two updates arrived within 10 minutes - merged into one alert. Disruptions never fire louder
            than once per 15 minutes.
          </span>
        </div>

        {trip.alerts.map((a) => {
          if (a.kind === "info") {
            return (
              <Card key={a.id} className="alert-card info" style={{ border: "none" }}>
                <h4>
                  <IconInfo /> {a.title}
                </h4>
                <p>{a.desc}</p>
                <span className="small muted">{a.time}</span>
              </Card>
            );
          }
          if (a.kind === "status") {
            return (
              <Card key={a.id} className="alert-card neutral">
                <h4>
                  <IconAlert /> {a.title}
                </h4>
                <Badge tone="warn">{a.status}</Badge>
                <p>{a.desc}</p>
                <div className="spread">
                  <span className="small muted">{a.time}</span>
                  <button
                    className="btn-ghost btn-sm"
                    aria-label="Re-check status"
                    onClick={() => {
                      setRefreshSpin(true);
                      window.setTimeout(() => setRefreshSpin(false), 900);
                    }}
                  >
                    <IconRefresh size={14} className={refreshSpin ? "spin" : ""} /> Re-check
                  </button>
                </div>
              </Card>
            );
          }
          if (a.kind === "cancel" && a.resolved) {
            return (
              <Card key={a.id} className="alert-card neutral">
                <h4>
                  <IconCheckCircle style={{ color: "var(--success)" }} /> {a.title}
                </h4>
                <p>{a.desc}</p>
                <Badge tone="success">Resolved</Badge>
              </Card>
            );
          }
          return (
            <Card key={a.id} className="alert-card delay">
              <h4>
                <IconAlert /> {a.title}
              </h4>
              <Badge tone="danger">{a.status}</Badge>
              <p>{a.desc}</p>
              {a.alternatives && (
                <div className="alt-ranked" style={{ marginTop: 10 }}>
                  {a.alternatives.map((alt, i) => {
                    const over = numOf(alt.price) - remaining;
                    const sel = picked === alt.id;
                    return (
                      <button
                        key={alt.id}
                        className="row-link"
                        style={{
                          border: `1px solid ${sel ? "var(--accent)" : "var(--border)"}`,
                          background: sel ? "var(--surface)" : "var(--surface)",
                        }}
                        onClick={() => setPicked(picked === alt.id ? null : alt.id)}
                      >
                        <span className="rl-text">
                          <span className="rl-title">
                            #{i + 1} {alt.title}
                          </span>
                          <span className="rl-sub">{alt.subtitle}</span>
                          <div style={{ marginTop: 4 }}>
                            {over > 0 ? (
                              <Badge tone="warn">+{over} over remaining budget</Badge>
                            ) : (
                              <Badge tone="success">Fits remaining budget</Badge>
                            )}
                          </div>
                        </span>
                        <b style={{ fontSize: 13, whiteSpace: "nowrap" }}>{money(alt.price)}</b>
                      </button>
                    );
                  })}
                  <button
                    className="btn btn-primary"
                    style={{ width: "100%", marginTop: 4 }}
                    onClick={() => {
                      const alt = picked ? a.alternatives?.find((x) => x.id === picked) : a.alternatives?.[0];
                      if (alt) applyReplacement(alt);
                    }}
                  >
                    Review & approve replacement
                  </button>
                  <span className="small muted" style={{ textAlign: "center" }}>
                    Ranked #1-{a.alternatives.length} against {money(trip.budget.remaining)} remaining
                  </span>
                </div>
              )}
            </Card>
          );
        })}

        <button className="btn btn-ghost btn-full" onClick={() => go("change-history")}>
          What changed recently? <IconChevronRight size={14} />
        </button>
      </div>
    </Shell>
  );
}

/* ──────────────── Change history (audit) ──────────────── */

export function ChangeHistoryScreen() {
  const { trip, back } = useApp();
  const [filter, setFilter] = useState<"all" | "booked" | "ai" | "warn" | "vote" | "system">("all");
  const entries = useMemo(
    () => (filter === "all" ? trip.history : trip.history.filter((h) => h.kind === filter)),
    [trip.history, filter]
  );

  const kindMeta = {
    booked: { icon: IconCheckCircle, cls: "ok", label: "Booking" },
    ai: { icon: IconSparkle, cls: "ai", label: "AI" },
    gate: { icon: IconShield, cls: "ai", label: "Made official via gate" },
    warn: { icon: IconAlert, cls: "warn", label: "Disruption" },
    vote: { icon: IconUsers, cls: "", label: "Vote" },
    system: { icon: IconInfo, cls: "", label: "System" },
  } as const;

  return (
    <Shell title="Change history" sub="Every change, audited" onBack={back}>
      <div className="content">
        <Card className="card-teal" style={{ marginBottom: 6 }}>
          <div className="hstack" style={{ gap: 8 }}>
            <IconShield size={18} style={{ color: "var(--teal)", flex: "none" }} />
            <p className="small" style={{ margin: 0 }}>
              Nothing in this trip was edited silently. Chat suggestions, AI plans, votes and rebookings all
              landed here with an approval signature.
            </p>
          </div>
        </Card>

        <div className="rail-inline" style={{ margin: "14px 0" }}>
          {(["all", "booked", "ai", "warn", "vote", "system"] as const).map((f) => (
            <button key={f} className={`chip${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
              {f === "all" ? "All" : kindMeta[f].label}
            </button>
          ))}
        </div>

        <div className="card" style={{ padding: "6px 16px" }}>
          {entries.map((h) => {
            const meta = kindMeta[h.kind] ?? kindMeta.system;
            const Icon = meta.icon;
            return (
              <div key={h.id} className="history-entry">
                <div className={`history-icon ${meta.cls}`}>
                  <Icon />
                </div>
                <div className="history-text">
                  <p>{h.text}</p>
                  <div className="hs-who">
                    {h.who} - {h.time}
                  </div>
                  {h.approvedBy && (
                    <div className="hs-approval">
                      <IconShield size={11} /> Approved by {h.approvedBy}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {entries.length === 0 && (
            <p className="small muted center" style={{ padding: 16 }}>
              No entries in this filter.
            </p>
          )}
        </div>
      </div>
    </Shell>
  );
}