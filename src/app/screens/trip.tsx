"use client";

import dynamic from "next/dynamic";
import type { CSSProperties } from "react";
import type { Mode, Screen } from "../data";
import { useApp } from "../store";
import {
  Shell,
  Card,
  Photo,
  Badge,
  Section,
  Avatar,
  type NavTab,
} from "../ui";
import {
  IconBack,
  IconChevronRight,
  IconHome,
  IconUsers,
  IconWallet,
  IconMapPin,
  IconSparkle,
  IconBell,
  IconChat,
  IconArrowRight,
} from "../icons";

const MapView = dynamic(() => import("./MapView").then((mod) => mod.MapView), {
  ssr: false,
  loading: () => (
    <div style={{ height: 360, borderRadius: 12, background: "var(--border-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="small muted">Loading map…</div>
    </div>
  ),
});

export function tripNav(mode: Mode, t: (key: string, vars?: Record<string, string | number>) => string): NavTab[] {
  if (mode === "solo") {
    return [
      { key: "trip-dashboard", label: t("nav.overview"), icon: IconHome },
      { key: "map", label: t("nav.map"), icon: IconMapPin },
      { key: "budget", label: t("nav.budget"), icon: IconWallet },
      { key: "alerts-disruptions", label: t("nav.alerts"), icon: IconBell },
    ];
  }
  return [
    { key: "trip-dashboard", label: t("nav.overview"), icon: IconHome },
    { key: "map", label: t("nav.map"), icon: IconMapPin },
    { key: "group-chat", label: t("nav.chat"), icon: IconChat },
    { key: "budget", label: t("nav.budget"), icon: IconWallet },
    { key: "alerts-disruptions", label: t("nav.alerts"), icon: IconBell },
  ];
}

const sourceTone = { booked: "teal", ai: "ai", manual: "muted", member: "outline" } as const;
const sourceLabel = { booked: "Booked", ai: "Waiting approval", manual: "You added", member: "Group" } as const;

/* ──────────────── Trip dashboard ──────────────── */

export function TripDashboardScreen() {
  const { trip, mode, back, canBack, go, money, t } = useApp();
  const openAlerts = trip.alerts.filter((a) => !a.resolved && a.kind !== "info").length;
  const aiItems = trip.itinerary.flatMap((d) => d.items.filter((i) => i.source === "ai"));
  const hoverItem = aiItems[0];

  const quick: { label: string; sub: string; screen: Screen; tag?: string }[] = [
    { label: t("trip.quickCompare"), sub: t("trip.quickCompareSub"), screen: "search-compare" },
    { label: t("trip.quickAiSuggest"), sub: t("trip.quickAiSuggestSub"), screen: "aeris-suggestions", tag: "AI" },
    { label: t("nav.budget"), sub: t("trip.quickBudgetLeft", { p: money(trip.budget.remaining) }), screen: "budget" },
    { label: t("trip.quickAlerts"), sub: t("trip.quickAlertsSub", { n: openAlerts }), screen: "alerts-disruptions" },
  ];
  if (mode === "group") {
    quick.push(
      { label: t("trip.quickChat"), sub: t("trip.quickChatSub"), screen: "group-chat" },
      { label: t("trip.quickMembers"), sub: t("trip.quickMembersSub", { a: 3, b: 4 }), screen: "members-preferences" },
      { label: t("trip.quickVote"), sub: t("trip.quickVoteSub"), screen: "proposals-voting", tag: "2" },
      { label: t("trip.quickExpenses"), sub: t("trip.quickExpensesSub"), screen: "expense-split" },
      { label: t("trip.quickSettle"), sub: t("trip.quickSettleSub"), screen: "settlement-engine" }
    );
  }
  quick.push({ label: t("trip.quickHistory"), sub: t("trip.quickHistorySub"), screen: "change-history" });

  return (
    <Shell
      header={
        <header className="top-bar">
          {canBack && (
            <button className="tb-btn" aria-label={t("trip.backToTrips")} onClick={back}>
              <IconBack />
            </button>
          )}
          <div className="tb-text">
            <h2>{trip.name}</h2>
            <div className="tb-sub">
              {trip.destination} - {trip.dates}
            </div>
          </div>
          {mode === "group" ? (
            <Badge tone="ai">
              <IconUsers size={12} /> {trip.travellers.length}
            </Badge>
          ) : (
            <Badge tone="teal">Solo</Badge>
          )}
        </header>
      }
    >
      <div className="content">
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <Photo src={trip.photo} ratio={trip.photoRatio} alt={trip.destination} />
          <div style={{ padding: 16 }}>
            <div className="spread">
              <div>
                <h3 style={{ margin: 0, fontSize: 19, fontWeight: 750 }}>{trip.destination}</h3>
                <div className="small muted" style={{ marginTop: 3 }}>
                  {trip.tagline}
                </div>
              </div>
              {mode === "group" && (
                <div className="avatar-stack">
                  {trip.travellers.map((tr) => (
                    <Avatar key={tr.id} name={tr.name} initials={tr.initials} color={tr.color} size="sm" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>

        {hoverItem && (
          <Card className="card-ai" style={{ marginTop: 12 }}>
            <div className="hstack" style={{ gap: 10 }}>
              <IconSparkle size={18} style={{ color: "var(--ai)", flex: "none" }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 650 }}>AI suggestion awaiting approval</div>
                <div className="small muted">
                  {hoverItem.title} - {hoverItem.desc}
                </div>
              </div>
              <button className="btn-ghost btn-sm" onClick={() => go("aeris-suggestions")}>
                Review
              </button>
            </div>
          </Card>
        )}

        <Section title="Plan this trip">
          <div className="od-grid quick-grid" style={{ "--od-cols": 2, "--od-gap": "8px" } as CSSProperties}>
            {quick.map((q) => (
              <Card key={q.label} className="card-press" style={{ padding: 13 }} onClick={() => go(q.screen)}>
                <div className="rl-title" style={{ fontSize: 13.5, display: "flex", alignItems: "center", gap: 6 }}>
                  {q.label}
                  {q.tag && (
                    <Badge tone={q.tag === "AI" ? "ai" : "warn"}>{q.tag}</Badge>
                  )}
                </div>
                <div className="small muted" style={{ marginTop: 2 }}>
                  {q.sub}
                </div>
                <div style={{ marginTop: "auto", paddingTop: 8 }}>
                  <IconChevronRight size={16} className="muted" />
                </div>
              </Card>
            ))}
          </div>
        </Section>

        <Section
          title="Itinerary"
          action={
            <button className="btn-ghost btn-sm" onClick={() => go("map")}>
              Full plan <IconArrowRight size={13} />
            </button>
          }
        >
          {trip.itinerary.map((d) => (
            <div key={d.day} style={{ marginBottom: 8 }}>
              <div className="day-header">
                <span className="day-date">{d.day}</span> {d.date}
              </div>
              {d.items.map((it) => (
                <div key={it.id} className={`itinerary-item${it.source === "ai" ? " ai" : ""}${it.source === "booked" ? " booked" : ""}`}>
                  <span className="itinerary-time">{it.time}</span>
                  <div className="itinerary-detail">
                    <h4>{it.title}</h4>
                    {it.desc && <p>{it.desc}</p>}
                    <div style={{ marginTop: 4 }}>
                      <Badge tone={sourceTone[it.source]}>{sourceLabel[it.source]}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </Section>
      </div>
    </Shell>
  );
}

/* ──────────────── Map ──────────────── */

interface MapPin {
  label: string;
  lat: number;
  lng: number;
  kind: "accent" | "ai" | "you" | "muted";
  description?: string;
}

function pinsFor(tripId: string): MapPin[] {
  if (tripId === "bali")
    return [
      { label: "DPS Airport", lat: -8.7481, lng: 115.1672, kind: "you", description: "Arrival airport" },
      { label: "Villa Tulip", lat: -8.5192, lng: 115.2638, kind: "accent", description: "Private villa, pool, Ubud edge" },
      { label: "Campuhan Ridge", lat: -8.5069, lng: 115.2625, kind: "ai", description: "Free, 20 min walk, sunset spot" },
      { label: "Tegalalang Rice Terraces", lat: -8.4182, lng: 115.2925, kind: "accent", description: "Morning light, least busy" },
      { label: "Tirta Empul Temple", lat: -8.4333, lng: 115.3117, kind: "muted", description: "Purification temple, sarong rental at gate" },
    ];
  return [
    { label: "CDG Airport", lat: 49.0097, lng: 2.5479, kind: "you", description: "Flight 1208 arrival/departure" },
    { label: "Hotel Sevigne", lat: 48.8434, lng: 2.3488, kind: "accent", description: "Latin Quarter, 2 twin rooms" },
    { label: "Le Comptoir", lat: 48.8512, lng: 2.3397, kind: "ai", description: "AI-suggested dinner, awaiting approval" },
    { label: "Louvre Museum", lat: 48.8606, lng: 2.3376, kind: "accent", description: "Skip-the-line 09:00 slot" },
    { label: "Musée d'Orsay", lat: 48.8600, lng: 2.3270, kind: "muted", description: "Impressionists, timed entry" },
  ];
}

export function MapScreen() {
  const { trip, mode, go, back, canBack } = useApp();
  const pins = pinsFor(trip.id);
  const block = trip.chats.find((c) => c.from === "system" && c.text.includes("Schedule overlap"));

  return (
    <Shell
      title="Map & plan"
      sub={trip.destination}
      onBack={canBack ? back : undefined}
    >
      <div className="content-tight">
        <div className="map-area" aria-label="Interactive trip map" style={{ height: 360, borderRadius: 12, overflow: "hidden" }}>
          <MapView pins={pins} />
        </div>
      </div>

      <div className="section">
        {mode === "group" && block && (
          <Card className="card-teal" style={{ marginBottom: 4 }}>
            <div style={{ fontSize: 14, fontWeight: 650 }}>Schedule overlap, named blockers</div>
            <p className="small fg2" style={{ margin: "4px 0 0" }}>
              {block.text}
            </p>
          </Card>
        )}
        <div className="section-row">
          <h3 className="section-title">Day by day</h3>
          <button className="btn-ghost btn-sm" onClick={() => go("search-compare")}>
            Compare options
          </button>
        </div>
        {trip.itinerary.map((d) => (
          <div key={d.day} style={{ marginBottom: 10 }}>
            <div className="day-header">
              <span className="day-date">{d.day}</span> {d.date}
            </div>
            {d.items.map((it) => (
              <div key={it.id} className={`itinerary-item${it.source === "ai" ? " ai" : ""}${it.source === "booked" ? " booked" : ""}`}>
                <span className="itinerary-time">{it.time}</span>
                <div className="itinerary-detail">
                  <h4>{it.title}</h4>
                  {it.desc && <p>{it.desc}</p>}
                  <div style={{ marginTop: 4 }}>
                    <Badge tone={sourceTone[it.source]}>{sourceLabel[it.source]}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Shell>
  );
}