"use client";

import { useState, type ReactNode } from "react";
import { useApp } from "../store";
import { Shell, Card, Badge, Progress, Avatar } from "../ui";
import {
  IconChevronRight,
  IconScale,
  IconRefresh,
  IconCheck,
  IconPlus,
  IconArrowRight,
  iconMap,
} from "../icons";

/* ──────────────── Budget ──────────────── */

export function BudgetScreen() {
  const { trip, back, go, money, t } = useApp();
  const remaining = Number(String(trip.budget.remaining).replace(/\D/g, "")) || 0;
  const alternatives = trip.alerts.flatMap((a) => a.alternatives ?? []).slice(0, 3);

  return (
    <Shell
      title={t("nav.budget")}
      sub={trip.mode === "group" ? t("money.shared") : t("money.personal")}
      onBack={back}
    >
      <div className="content">
        <Card className="card-hero" style={{ padding: 18 }}>
          <div className="spread">
            <div>
              <div className="small" style={{ opacity: 0.85 }}>
                {t("money.remainingOf", { p: money(trip.budget.total) })}
              </div>
              <div style={{ fontSize: 26, fontWeight: 750 }}>
                {money(trip.budget.remaining)}
              </div>
            </div>
            <Badge tone={remaining < 20 ? "warn" : "outline"}>
              {t("money.pctLeft", { n: remaining })}
            </Badge>
          </div>
          <Progress pct={100 - remaining} style={{ marginTop: 12 }} />
        </Card>

        <SectionT title={t("money.byCategory")}>
          <div className="vstack" style={{ gap: 10 }}>
            {trip.budget.categories.map((c) => {
              const label = c.pct >= 100 ? "over" : "left";
              return (
                <div key={c.label}>
                  <div className="spread" style={{ marginBottom: 5 }}>
                    <div className="hstack" style={{ gap: 6 }}>
                      <span style={{ fontWeight: 650, fontSize: 14 }}>{c.label}</span>
                      {c.cap && (
                        <span className="small muted">{t("money.cap", { p: money(c.cap) })}</span>
                      )}
                    </div>
                    <div className="hstack" style={{ gap: 6 }}>
                      <span className="small fg2">
                        {money(c.spent)}
                        {c.cap ? ` / ${money(c.cap)}` : ""}{" "}
                        {label === "over" ? `(${t("money.over")})` : ""}
                      </span>
                      {c.near && (
                        <Badge tone={c.pct >= 100 ? "danger" : "warn"}>
                          {c.pct >= 100 ? t("money.overCap") : t("money.nearCap")}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Progress pct={c.pct} />
                </div>
              );
            })}
          </div>
        </SectionT>

        {alternatives.length > 0 && (
          <SectionT title="Alternatives ranked vs your remaining budget">
            <div className="vstack" style={{ gap: 8 }}>
              {alternatives.map((a, i) => (
                <button key={a.id} className="row-link" style={{ border: "1px solid var(--border)", borderRadius: 10 }} onClick={() => go("option-detail", { optionId: a.id })}>
                  <span className="rl-text">
                    <span className="rl-title">
                      #{i + 1} {a.title}
                    </span>
                    <span className="rl-sub">{a.subtitle}</span>
                    <div style={{ marginTop: 4 }}>
                      {Number(String(a.price).replace(/\D/g, "")) <= remaining ? (
                        <Badge tone="success">Fits remaining budget</Badge>
                      ) : (
                        <Badge tone="warn">
                          +{Number(String(a.price).replace(/\D/g, "")) - remaining} over remaining
                        </Badge>
                      )}
                    </div>
                  </span>
                  <b style={{ fontSize: 13, whiteSpace: "nowrap" }}>{money(a.price)}</b>
                  <IconChevronRight size={15} className="muted" />
                </button>
              ))}
            </div>
            <p className="small muted" style={{ margin: "10px 2px 0" }}>
              Ranking uses your trip budget first, then schedule fit, then rating.
            </p>
          </SectionT>
        )}

        {trip.mode === "group" && (
          <button className="btn btn-secondary btn-full" onClick={() => go("expense-split")}>
            <IconScale size={15} /> Open expense split
          </button>
        )}
      </div>
    </Shell>
  );
}

function SectionT({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="section" style={{ paddingLeft: 0, paddingRight: 0 }}>
      <h3 className="section-title">{title}</h3>
      {children}
    </section>
  );
}

/* ──────────────── Expense split ──────────────── */

export function ExpenseSplitScreen() {
  const { trip, back, go, notify, currency, money, fxStatus } = useApp();
  const [mode, setMode] = useState<"equal" | "percent" | "custom">("equal");
  const splitMeta = {
    equal: "Everyone splits it evenly",
    percent: "Split by chosen percentages",
    custom: "Per-member amounts you approve",
  } as const;

  return (
    <Shell title="Expenses & split" sub={`Ledger in ${currency} (base)`} onBack={back}>
      <div className="content">
        <div className={`rate-badge${fxStatus === "live" ? " rate-badge-live" : ""}`}>
          <IconRefresh size={13} />
          {fxStatus === "live"
            ? "Live FX rates · refreshing every 15 min"
            : fxStatus === "cached"
            ? "Live FX unavailable - showing last cached rates. Re-checking every 15 min."
            : "FX rates unavailable - amounts shown without conversion."}
        </div>

        <Card style={{ marginTop: 12, padding: 0 }}>
          {trip.expenses.map((e) => {
            const payer = trip.travellers.find((t) => t.id === e.paidBy);
            const Icon = iconMap[e.icon] ?? iconMap.receipt;
            return (
              <div key={e.id} className="expense-row" style={{ paddingInline: 16 }}>
                <div className="expense-icon">
                  <Icon />
                </div>
                <div className="expense-detail">
                  <h4>{e.name}</h4>
                  <p>
                    {e.date} - paid by {payer?.name ?? "?"} - {e.split}
                  </p>
                  <div className="hstack" style={{ gap: 6, flexWrap: "wrap" }}>
                    <Badge tone="outline">{e.split} split</Badge>
                    {e.rateSource === "cached" && (
                      <Badge tone="warn">
                        <IconRefresh size={10} /> last cached rate
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="expense-amount">
                  <div className="primary">{money(e.baseAmount)}</div>
                  <div className="secondary">
                    {e.originalCurrency !== "EUR" && e.originalAmount
                      ? `= ${e.originalAmount} ${e.originalCurrency}`
                      : `1.0000 ${currency}`}
                  </div>
                </div>
              </div>
            );
          })}
        </Card>

        <button className="btn btn-secondary btn-full" style={{ marginTop: 12 }} onClick={() => notify("Add expense form (prototype)")}>
          <IconPlus size={15} /> Add expense
        </button>

        <SectionT title="Split mode for new expenses">
          <Card>
            <div className="seg">
              {(["equal", "percent", "custom"] as const).map((m) => (
                <button key={m} className={`seg-btn${mode === m ? " active" : ""}`} onClick={() => setMode(m)}>
                  {m}
                </button>
              ))}
            </div>
            <p className="small fg2" style={{ margin: "10px 0" }}>
              {splitMeta[mode]}
            </p>
            <div className="rail-inline">
              {trip.travellers.map((t) => (
                <span key={t.id} className="badge badge-outline hstack" style={{ gap: 6, padding: "4px 10px" }}>
                  <Avatar name={t.name} initials={t.initials} color={t.color} size="sm" />
                  {mode === "equal"
                    ? "25%"
                    : mode === "percent"
                    ? `You ${t.id === "marco" ? "20%" : t.id === "zara" ? "15%" : t.id === "ana" ? "25%" : "40%"}`
                    : `${money(t.id === "you" ? "30" : t.id === "ana" ? "30" : t.id === "marco" ? "20" : "20")}`}
                </span>
              ))}
            </div>
          </Card>
        </SectionT>

        <Card className="card-teal">
          <div className="hstack" style={{ gap: 8 }}>
            <IconShieldLocal />
            <p className="small" style={{ margin: 0 }}>
              Only travellers can mark something paid. Vendors and merchants never get ledger write access.
            </p>
          </div>
        </Card>

        <button className="btn btn-primary btn-full" style={{ marginTop: 10 }} onClick={() => go("settlement-engine")}>
          Compute settlement <IconArrowRight size={15} />
        </button>
      </div>
    </Shell>
  );
}

function IconShieldLocal() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 2.8v5c0 4.6-3 8-7 10.2-4-2.2-7-5.6-7-10.2v-5L12 3z" />
      <path d="M8.8 12l2.4 2.4 4-4.6" />
    </svg>
  );
}

/* ──────────────── Settlement engine ──────────────── */

export function SettlementEngineScreen() {
  const { trip, back, notify, money } = useApp();

  return (
    <Shell title="Settlement" sub="Fewest transfers possible" onBack={back}>
      <div className="content">
        <Card className="card-hero" style={{ padding: 18 }}>
          <div className="spread">
            <div>
              <div className="small" style={{ opacity: 0.85 }}>Optimised flows</div>
              <div style={{ fontSize: 24, fontWeight: 750 }}>{trip.settlement.length} transfers</div>
            </div>
            <Badge tone="outline" style={{ background: "rgba(255,255,255,.15)", color: "white" }}>
              vs {trip.naiveSettlementCount} naively
            </Badge>
          </div>
          <p className="small" style={{ margin: "10px 0 0", opacity: 0.92 }}>
            Everyone nets out to zero. No traveller pays twice in the same curl - the engine proves the
            minimal set.
          </p>
        </Card>

        <div className="vstack" style={{ gap: 8, marginTop: 14 }}>
          {trip.settlement.map((s, i) => {
            const from = trip.travellers.find((t) => t.id === s.from);
            const to = trip.travellers.find((t) => t.id === s.to);
            return (
              <div key={i} className="settlement-row">
                <Avatar name={from?.name ?? s.from} initials={from?.initials ?? "?"} color={s.fromColor} />
                <div className="settlement-arrow">
                  <IconArrowRight />
                </div>
                <Avatar name={to?.name ?? s.to} initials={to?.initials ?? "?"} color={s.toColor} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="rl-title" style={{ fontSize: 13.5 }}>
                    {from?.name ?? s.from} pays {to?.name ?? s.to}
                  </div>
                  <div className="small muted">transfer {i + 1} of {trip.settlement.length}</div>
                </div>
                <div className="settlement-amount">{money(s.amount)}</div>
              </div>
            );
          })}
        </div>

        <Card style={{ marginTop: 12 }}>
          <div className="spread">
            <span className="small fg2">
              <IconCheck size={13} style={{ color: "var(--success)" }} /> All four balances net zero
            </span>
            <button className="btn btn-secondary btn-sm" onClick={() => notify("Reminders sent - debounced with alerts")}>
              Send reminders
            </button>
          </div>
        </Card>
      </div>
    </Shell>
  );
}