"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { Option } from "../data";
import { useApp } from "../store";
import { Shell, Card, Badge, AiNote } from "../ui";
import {
  IconChevronRight,
  IconStar,
  IconSearch,
  IconSparkle,
  IconShield,
  IconLock,
} from "../icons";

type Track = "manual" | "ai";
const trackMeta = {
  manual: { label: "I search", icon: IconSearch, cls: "" },
  ai: { label: "Aeris searches", icon: IconSparkle, cls: "chip-ai active" },
} as const;

/* ──────────────── Search & compare (Rule 01) ──────────────── */

export function SearchCompareScreen() {
  const { trip, go, back, route, money, t } = useApp();
  const CATS = ["flights", "stay", "cars", "restaurants", "activities", "guides"] as const;
  type Cat = (typeof CATS)[number];
  const catLabel = (c: Cat) =>
    c === "flights" ? "Flights" : c === "stay" ? "Stay" : c === "cars" ? "Cars & taxi" : c === "restaurants" ? "Restaurants" : c === "activities" ? "Activities" : "Tour guides";
  const catFrom = (v: unknown): Cat => (CATS.includes(v as Cat) ? (v as Cat) : "flights");
  const [type, setType] = useState<Cat>(catFrom(route.params?.type));
  const [running, setRunning] = useState<{ manual: boolean; ai: boolean }>({ manual: false, ai: false });
  const [done, setDone] = useState<{ manual: boolean; ai: boolean }>({ manual: false, ai: false });

  const actByType: Record<Cat, string[]> = {
    flights: ["flight"],
    stay: ["stay"],
    cars: ["transfer"],
    restaurants: ["food"],
    activities: ["activity"],
    guides: ["guide"],
  };

  const options = trip.options.filter((o) => actByType[type].includes(o.actId));
  const manualOpts = options.filter((o) => o.track === "manual");
  const aiOpts = options.filter((o) => o.track === "ai");
  const combined = [...options].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  const rejoined = done.manual && done.ai;
  const bothEmpty = manualOpts.length === 0 && aiOpts.length === 0;
  const trackLocked = (t: Track) => done[t] || running[t];

  useEffect(() => {
    const v = catFrom(route.params?.type);
    if (v !== type) switchType(v);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.type]);

  const runTrack = (t: Track) => {
    setRunning((r) => ({ ...r, [t]: true }));
    window.setTimeout(() => {
      setRunning((r) => ({ ...r, [t]: false }));
      setDone((d) => ({ ...d, [t]: true }));
    }, 950);
  };

  const switchType = (t: typeof type) => {
    setType(t);
    setDone({ manual: false, ai: false });
    setRunning({ manual: false, ai: false });
  };

  const trackList = (opts: Option[]) =>
    opts.length === 0 ? (
      <p className="small muted" style={{ margin: 0, padding: "4px 2px" }}>
        No candidates in this track yet.
      </p>
    ) : (
      opts.map((o) => (
        <button
          key={o.id}
          className="row-link"
          style={{ padding: "8px 2px", borderBottom: "1px solid var(--border-soft)" }}
          onClick={() => go("option-detail", { optionId: o.id })}
        >
          <span className="rl-text">
            <span className="rl-title">{o.title}</span>
            <span className="rl-sub">{o.subtitle}</span>
          </span>
          <b style={{ fontSize: 13, whiteSpace: "nowrap" }}>{money(o.price)}</b>
          <IconChevronRight size={15} />
        </button>
      ))
    );

  return (
    <Shell title={t("trip.quickCompare")} sub={t("compare.twoTracks")} onBack={back}>
      <div className="content">
        {trip.mode === "solo" ? (
          <AiNote>Running solo - you see all candidates without group votes.</AiNote>
        ) : (
          <AiNote>
            Manual and AI tracks run side by side and rejoin below in one ranked list. The group never
            commits until you pick here.
          </AiNote>
        )}

        <div className="rail-inline">
          {CATS.map((t) => (
            <button
              key={t}
              className={`chip${type === t ? " active" : ""}`}
              onClick={() => switchType(t)}
            >
              {catLabel(t)}
            </button>
          ))}
        </div>

        {!bothEmpty && (
          <div className="dual-track" style={{ marginTop: 14 }}>
            {(["manual", "ai"] as const).map((t) => {
              const Meta = trackMeta[t];
              const Icon = Meta.icon;
              const opts = t === "manual" ? manualOpts : aiOpts;
              return (
                <div key={t} className="card" style={{ padding: 13 }}>
                  <div className={`track-label ${t === "ai" ? "ai" : "manual"}`}>
                    <Icon size={14} /> {Meta.label}
                  </div>
                  {!done[t] ? (
                    <button
                      className="btn btn-sm btn-secondary"
                      style={{ width: "100%" }}
                      disabled={running[t]}
                      onClick={() => runTrack(t)}
                    >
                      {running[t] ? "Searching..." : t === "manual" ? "Search" : "Have Aeris search"}
                    </button>
                  ) : (
                    trackList(opts)
                  )}
                </div>
              );
            })}
          </div>
        )}

        {rejoined && combined.length > 0 && (
          <>
            <div className="ai-note" style={{ marginTop: 16, background: "var(--teal-bg)", color: "var(--teal)" }}>
              <IconShield size={14} /> Both tracks rejoined - candidates in one list, ranked together.
            </div>
            <SectionTitle>Combined list</SectionTitle>
            <div className="vstack" style={{ gap: 8 }}>
              {combined.map((o, i) => (
                <Card key={o.id} className="card-press" style={{ padding: 14 }} onClick={() => go("option-detail", { optionId: o.id })}>
                  <div className="spread">
                    <div className="rl-title" style={{ fontSize: 14.5 }}>
                      {i + 1}. {o.title}
                    </div>
                    <div className="hstack" style={{ gap: 6 }}>
                      <Badge tone={o.track === "ai" ? "ai" : "muted"}>
                        {o.track === "ai" ? <><IconSparkle size={11} /> AI</> : "Manual"}
                      </Badge>
                      <IconChevronRight size={15} className="muted" />
                    </div>
                  </div>
                  <div className="small muted">{o.subtitle}</div>
                  <div className="hstack" style={{ gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                    {o.rating && (
                      <span className="small fg2 hstack" style={{ gap: 3 }}>
                        <IconStar size={13} style={{ color: "var(--amber)" }} />
                        {o.rating}
                        <span className="muted">({o.reviews})</span>
                      </span>
                    )}
                    <b style={{ fontSize: 13, marginLeft: "auto" }}>
                      {money(o.price)} <span className="muted mono" style={{ fontSize: 10 }}>{o.priceNote}</span>
                    </b>
                  </div>
                </Card>
              ))}
            </div>
            <p className="small muted" style={{ margin: "12px 2px" }}>
              Every pick below still passes the approval gate before any money or schedule changes stick.
            </p>
          </>
        )}

        {bothEmpty && (
          <Card className="card-ai" style={{ marginTop: 14 }}>
            <div className="hstack" style={{ gap: 10 }}>
              <IconSparkle size={18} style={{ color: "var(--ai)", flex: "none" }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 650 }}>Nothing to compare yet</div>
                <p className="small muted" style={{ margin: "4px 0 0" }}>
                  Add a flight, stay, car &amp; taxi, restaurant, activity or tour guide first. Your itinerary is still
                  empty until the first plan lands.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Shell>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="section-title" style={{ marginTop: 18 }}>{children}</h3>;
}

/* ──────────────── Aeris suggestions ──────────────── */

interface Sugg {
  id: string;
  title: string;
  subtitle: string;
  reason: string;
  price: string;
  src?: Option;
  actor: "stay" | "activity" | "food" | "flight" | "transfer" | "guide";
}

function suggestionsFor(trip: ReturnType<typeof useApp>["trip"]): Sugg[] {
  const fromOptions = trip.options
    .filter((o) => o.track === "ai")
    .map((o) => ({
      id: o.id,
      title: o.title,
      subtitle: o.subtitle,
      reason: o.reason ?? "Ranked against the group intents",
      price: `${o.price} ${o.priceNote ?? ""}`,
      src: o,
      actor: o.actId,
    }));
  if (fromOptions.length > 0) return fromOptions;
  return [
    {
      id: "sugg1",
      title: "Tirta Empul at 11:00",
      subtitle: "Quiet window before the tour buses",
      reason: "Matched your avoid-crowds intent on Wed.",
      price: "15 incl. sarong",
      actor: "activity",
    },
    {
      id: "sugg2",
      title: "Sunset at Campuhan, 17:00",
      subtitle: "Earlier slot beats the 16:30 rain window",
      reason: "Reordered your Day 1 plan to the dry slot.",
      price: "Free",
      actor: "activity",
    },
  ];
}

export function AISuggestionsScreen() {
  const { trip, go, back, openGate, run, notify, money, t } = useApp();
  const suggestions = suggestionsFor(trip);
  const travellerNames = trip.travellers.map((t) => t.name);
  const isSolo = trip.mode === "solo";

  const applyGate = (s: Sugg) => {
    openGate({
      id: "apply:" + s.id,
      title: isSolo ? t("compare.gateApply") : t("compare.gateGroup"),
      sub: t("compare.gateSub"),
      kind: "ai",
      diffs: [
        { label: t("compare.itinerary"), old: t("compare.notPlanned"), mine: t("compare.addTitle", { title: s.title }) },
        { label: t("compare.slot"), old: t("compare.free"), mine: s.subtitle },
        { label: t("compare.cost"), old: "-", mine: `${money(s.price)}`, delta: `+${money(s.price)}` },
      ],
      conditions: ["Free to undo before the trip", "No charge to reject"],
      travellers: isSolo ? ["You"] : travellerNames,
      budgetNote: `Budget ${money(trip.budget.remaining)} left`,
      approveLabel: "Approve suggestion",
      onApprove: () => {
        run((t) => ({
          ...t,
          history: [
            {
              id: "hs-" + s.id,
              kind: "ai",
              text: `Aeris suggestion applied: ${s.title}`,
              who: isSolo ? "AI matched your preference" : "AI matched 3 group intents",
              time: "just now",
              approvedBy: isSolo ? "You" : "You + Ana",
            },
            ...t.history,
          ],
        }));
        notify("Suggestion applied and logged in change history.");
      },
    });
  };

  return (
    <Shell title={t("trip.quickAiSuggest")} sub={t("compare.ranked")} onBack={back}>
      <div className="content">
        <AiNote>
          Aeris listens to your chat intents and preferences, then suggests only what passes your budget and
          schedule rules. Nothing is applied until you approve the gate.
        </AiNote>

        <div className="vstack" style={{ gap: 10 }}>
          {suggestions.map((s, i) => (
            <Card key={s.id} className="card-ai" style={{ padding: 15 }}>
              <div className="spread">
                <div>
                  <div className="hstack" style={{ gap: 6, marginBottom: 4 }}>
                    <Badge tone="ai">
                      <IconSparkle size={11} /> Pick #{i + 1}
                    </Badge>
                    {s.src?.rating ? (
                      <span className="hstack" style={{ gap: 3 }}>
                        <IconStar size={12} style={{ color: "var(--amber)" }} />
                        <span className="small fg2">{s.src.rating}</span>
                      </span>
                    ) : null}
                  </div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{s.title}</h3>
                  <div className="small muted">{s.subtitle}</div>
                </div>
                <b style={{ fontSize: 14, whiteSpace: "nowrap" }}>{money(s.price)}</b>
              </div>
              <p className="small fg2" style={{ margin: "10px 0 0", borderLeft: "2px solid var(--ai)", paddingLeft: 10 }}>
                {s.reason}
              </p>
              <div className="hstack" style={{ gap: 8, marginTop: 12 }}>
                <button
                  className="btn btn-sm btn-ai"
                  style={{ flex: 1 }}
                  onClick={() => applyGate(s)}
                >
                  <IconShield size={13} /> Apply
                </button>
                <button className="btn btn-sm btn-secondary" style={{ flex: 1 }} onClick={() => s.src ? go("option-detail", { optionId: s.src.id }) : notify("Detail view is a demo shortcut")}>
                  Review
                </button>
              </div>
            </Card>
          ))}
        </div>

        <Card style={{ marginTop: 12 }}>
          <div className="hstack" style={{ gap: 8 }}>
            <IconLock size={16} className="muted" />
            <p className="small fg2" style={{ margin: 0 }}>
              Suggestions never update the trip directly. Approving logs a visible "AI suggestion" entry in
              change history so the group can audit what changed.
            </p>
          </div>
        </Card>
      </div>
    </Shell>
  );
}