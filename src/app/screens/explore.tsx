"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import type { OtaOffer, Vertical } from "../data";
import { OTA_OFFERS } from "../data";
import { useApp } from "../store";
import { Shell, Card, Badge, Photo } from "../ui";
import { CalendarModal } from "../components/CalendarModal";
import {
  IconPlane,
  IconHome,
  IconCar,
  IconTicket,
  IconSettings,
  IconSearch,
  IconCalendar,
  IconUsers,
  IconChevronRight,
  IconArrowRight,
  IconSparkle,
} from "../icons";

const GLIDE_MS = 9000;
const DRAG_THRESHOLD = 6;

const VERT_ICON: Record<Vertical, typeof IconPlane> = {
  flights: IconPlane,
  hotels: IconHome,
  cars: IconCar,
  attractions: IconTicket,
};

const VERTICALS: {
  v: Vertical;
  icon: typeof IconPlane;
  title: string;
  sub: string;
  from: number;
  grad: string;
}[] = [
  { v: "flights", icon: IconPlane, title: "Flights", sub: "Compare airlines end to end", from: 39, grad: "linear-gradient(135deg,#2563eb,#1d4ed8)" },
  { v: "hotels", icon: IconHome, title: "Hotels", sub: "Browse and reserve stays", from: 89, grad: "linear-gradient(135deg,#0d9488,#0f766e)" },
  { v: "cars", icon: IconCar, title: "Cars", sub: "Rentals + live ride-hailing", from: 12, grad: "linear-gradient(135deg,#d97706,#b45309)" },
  { v: "attractions", icon: IconTicket, title: "Attractions", sub: "Tickets for tours & parks", from: 16, grad: "linear-gradient(135deg,#7c3aed,#6d28d9)" },
];

function getCheapestPerVertical(): OtaOffer[] {
  const verticals: Vertical[] = ["flights", "hotels", "cars", "attractions"];
  return verticals
    .map((v) => {
      const offers = OTA_OFFERS.filter((o) => o.vertical === v);
      if (offers.length === 0) return null;
      return offers.reduce((min, o) => {
        const a = Number(String(min.price).replace(/[^\d.]/g, ""));
        const b = Number(String(o.price).replace(/[^\d.]/g, ""));
        return b < a ? o : min;
      });
    })
    .filter((o): o is OtaOffer => o !== null);
}

function CheapestDeals() {
  const { money, go } = useApp();
  const deals = getCheapestPerVertical();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stRef = useRef({
    startX: 0,
    originX: 0,
    half: 912,
    dragging: false,
    moved: false,
    suppress: false,
  });
  const [grabbing, setGrabbing] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const half = track.scrollWidth / 2;
    if (half > 0 && Number.isFinite(half)) stRef.current.half = half;
    track.style.animation = `deal-glide ${GLIDE_MS}ms linear infinite`;
  }, []);

  const currentX = () => {
    const track = trackRef.current;
    if (!track) return 0;
    return new DOMMatrixReadOnly(getComputedStyle(track).transform).m41 || 0;
  };

  const onMove = (e: PointerEvent) => {
    const s = stRef.current;
    const track = trackRef.current;
    if (!s.dragging || !track) return;
    const dx = e.clientX - s.startX;
    if (!s.moved) {
      if (Math.abs(dx) <= DRAG_THRESHOLD) return;
      s.moved = true;
      s.suppress = true;
      track.style.animation = "none";
      const x = Math.max(-s.half, Math.min(0, s.originX + dx));
      track.style.transform = `translate3d(${x}px, 0, 0)`;
      return;
    }
    const x = Math.max(-s.half, Math.min(0, s.originX + dx));
    track.style.transform = `translate3d(${x}px, 0, 0)`;
  };

  const onUp = () => {
    const s = stRef.current;
    const track = trackRef.current;
    if (!s.dragging || !track) return;
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointercancel", onUp);
    s.dragging = false;
    setGrabbing(false);
    if (s.moved) {
      let x = currentX();
      while (x < -s.half) x += s.half;
      while (x > 0) x -= s.half;
      const elapsed = Math.min(1, Math.max(0, -x / s.half)) * GLIDE_MS;
      track.style.transform = "";
      track.style.animation = `deal-glide ${GLIDE_MS}ms linear infinite`;
      track.style.animationDelay = `-${elapsed}ms`;
    } else {
      track.style.animationPlayState = "running";
    }
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    const s = stRef.current;
    s.suppress = false;
    s.startX = e.clientX;
    s.originX = currentX();
    s.dragging = true;
    s.moved = false;
    track.style.animationPlayState = "paused";
    setGrabbing(true);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  return (
    <div className="deal-marquee" ref={viewportRef}>
      <div
        ref={trackRef}
        className={`deal-track${grabbing ? " is-grabbing" : ""}`}
        onPointerDown={onPointerDown}
      >
        {[...deals, ...deals].map((d, i) => {
          const Icon = VERT_ICON[d.vertical];
          const grad = VERTICALS.find((v) => v.v === d.vertical)?.grad ?? "var(--accent)";
          return (
            <button
              key={`${d.id}-${i}`}
              className="deal-card"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", flex: "0 0 280px" }}
              onClick={() => {
                if (stRef.current.suppress) return;
                go("ota-booking", { vertical: d.vertical, offer: d });
              }}
            >
              <div className="deal-media">
                {d.photo ? (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    <Photo src={d.photo} ratio="16/9" alt={d.title} className="deal-photo" />
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", background: "var(--border-soft)" }}>
                    <Icon size={28} className="muted" />
                  </div>
                )}
                <span className="deal-vertical-badge" style={{ background: grad }}>
                  <Icon size={11} style={{ color: "white" }} />
                </span>
              </div>
              <div className="deal-info" style={{ padding: 12 }}>
                <span className="deal-title" style={{ fontWeight: 650, fontSize: 13.5, display: "block", marginBottom: 2 }}>{d.title}</span>
                <span className="deal-price" style={{ fontWeight: 700, fontSize: 15, display: "block", marginBottom: 8 }}>{money(d.price)}</span>
                <div className="deal-meta" style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>
                  {d.subtitle}
                </div>
                <div className="hstack" style={{ gap: 6, alignItems: "center" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3l7 2.8v5c0 4.6-3 8-7 10.2-4-2.2-7-5.6-7-10.2v-5L12 3z"/><path d="M8.8 12l2.4 2.4 4-4.6"/></svg>
                    <span style={{ fontWeight: 500 }}>&#9733; {d.rating}</span>
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 2, color: "var(--muted)" }}>
                    <IconChevronRight size={12} />
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function offerById(id: string): OtaOffer | undefined {
  return OTA_OFFERS.find((o) => o.id === id);
}

function relatedFor(v: Vertical): OtaOffer[] {
  const map: Record<Vertical, Vertical[]> = {
    flights: ["hotels", "cars"],
    hotels: ["cars", "attractions"],
    cars: ["attractions", "hotels"],
    attractions: ["hotels", "flights"],
  };
  return map[v]
    .map((vert) =>
      OTA_OFFERS.filter((o) => o.vertical === vert)
        .slice()
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 1)
    )
    .flat();
}

export function ExploreScreen() {
  const { userName, go, toTrip, trips, otaBookings, money, t } = useApp();
  const tripList = Object.values(trips);
  const last = otaBookings[0];
  const seed = last ? relatedFor(last.vertical) : relatedFor("flights");
  const first = tripList[0];

  const fmt = (d: Date) => d.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" });
  const toISO = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
  const fromISO = (iso: string) => {
    const d = new Date(`${iso}T00:00:00`);
    return Number.isNaN(d.getTime()) ? iso : fmt(d);
  };
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 2);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 4);

  const [searchDest, setSearchDest] = useState("");
  const [searchDateA, setSearchDateA] = useState(toISO(today));
  const [searchDateB, setSearchDateB] = useState(toISO(tomorrow));
  const [searchTrav, setSearchTrav] = useState("2");
  const [searchWay, setSearchWay] = useState<"return" | "oneway">("return");
  const [calendarOpen, setCalendarOpen] = useState<"depart" | "return" | null>(null);

  const handleSearch = (vertical: Vertical) => {
    if (!searchDest.trim()) return;
    go("ota-results", {
      vertical,
      destination: searchDest,
      from: "London",
      dates: searchWay === "return" ? `${fromISO(searchDateA)} - ${fromISO(searchDateB)}` : fromISO(searchDateA),
      way: searchWay,
    });
  };

  const openCalendar = (which: "depart" | "return") => {
    setCalendarOpen(which);
  };

  const closeCalendar = () => {
    setCalendarOpen(null);
  };

  const handleDateSelect = (date: string) => {
    if (calendarOpen === "depart") {
      setSearchDateA(date);
    } else if (calendarOpen === "return") {
      setSearchDateB(date);
    }
    closeCalendar();
  };

  return (
    <>
      <Shell
        header={
          <header className="top-bar top-bar-stack">
            <div className="tb-row">
              <Image
                src="/images/logo2.jpeg"
                alt="Aeris"
                width={66}
                height={28}
                unoptimized
                priority
                className="tb-logo"
              />
              <button className="tb-btn" aria-label={t("common.settings")} onClick={() => go("settings")}>
                <IconSettings />
              </button>
            </div>
            <div className="tb-text">
              <h2>{userName ? t("explore.hi", { name: userName }) : t("nav.explore")}</h2>
              <div className="tb-sub">{t("explore.greeting")}</div>
            </div>
          </header>
        }
      >
        <div className="screen-scroll" style={{ flex: 1 }}>
          <div className="content" style={{ paddingTop: 8 }}>
            <Card className="search-hero-card" style={{ padding: 16, marginBottom: 24 }}>
              <div className="vstack" style={{ gap: 12 }}>
                <div className="hstack" style={{ gap: 8, alignItems: "flex-end" }}>
                  <div style={{ flex: 1 }}>
                    <label className="small muted" style={{ display: "block", marginBottom: 4 }}>{t("explore.whereTo")}</label>
                    <input
                      type="text"
                      value={searchDest}
                      onChange={(e) => setSearchDest(e.target.value)}
                      placeholder={t("explore.whereToPh")}
                      style={{ width: "100%", padding: "12px 14px", fontSize: 16, borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface)", outline: "none" }}
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    style={{ height: 48, padding: "0 20px", flex: "none" }}
                    onClick={() => handleSearch("flights")}
                    disabled={!searchDest.trim()}
                  >
                    <IconSearch size={18} /> {t("explore.searchBtn")}
                  </button>
                </div>

                <div className="od-grid" style={{ "--od-cols": 3, "--od-gap": "10px" } as CSSProperties}>
                  <div className="field" style={{ margin: 0 }}>
                    <label>{t("explore.depart")}</label>
                    <div className="field-input-wrapper">
                      <input
                        type="text"
                        value={fromISO(searchDateA)}
                        readOnly
                        onClick={() => openCalendar("depart")}
                        style={{ width: "100%", cursor: "pointer" }}
                      />
                      <IconCalendar size={20} className="calendar-trigger" />
                    </div>
                  </div>
                  <div className="field" style={{ margin: 0 }}>
                    <label>{t("explore.return")}</label>
                    <div className="field-input-wrapper">
                      <input
                        type="text"
                        value={fromISO(searchDateB)}
                        readOnly
                        onClick={() => openCalendar("return")}
                        style={{ width: "100%", cursor: searchWay === "return" ? "pointer" : "not-allowed", opacity: searchWay === "return" ? 1 : 0.5 }}
                        disabled={searchWay === "oneway"}
                      />
                      <IconCalendar size={20} className="calendar-trigger" />
                    </div>
                  </div>
                  <div className="field" style={{ margin: 0 }}>
                    <label>{t("explore.travellersLabel")}</label>
                    <input type="text" inputMode="numeric" value={searchTrav} onChange={(e) => setSearchTrav(e.target.value.replace(/\D/g, ""))} style={{ width: "100%", padding: "12px 14px", fontSize: 16, borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface)", outline: "none" }} />
                  </div>
                </div>

                <div className="field" style={{ margin: 0 }}>
                  <label>{t("explore.tripType")}</label>
                  <div className="seg" style={{ width: "100%" }}>
                    <button className={`seg-btn${searchWay === "return" ? " active" : ""}`} onClick={() => setSearchWay("return")} style={{ flex: 1 }}>
                      {t("explore.returnTrip")}
                    </button>
                    <button className={`seg-btn${searchWay === "oneway" ? " active" : ""}`} onClick={() => setSearchWay("oneway")} style={{ flex: 1 }}>
                      {t("explore.oneWay")}
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            <div className="ota-grid">
              {VERTICALS.map((v) => {
                const Icon = v.icon;
                return (
                  <Card
                    key={v.v}
                    className="card-press ota-vtile"
                    style={{ ["--vtile-grad" as string]: v.grad } as CSSProperties}
                    onClick={() => go("ota-search", { vertical: v.v })}
                  >
                    <div className="ota-vtile-head">
                      <span className="ota-vtile-icon">
                        <Icon size={20} />
                      </span>
                      <span className="ota-vtile-from">{t("explore.from", { p: money(v.from) })}</span>
                    </div>
                    <div className="ota-vtile-title">{t(`explore.vert.${v.v}`)}</div>
                    <div className="ota-vtile-sub">{t(`explore.vert.${v.v}.sub`)}</div>
                  </Card>
                );
              })}
            </div>

            <section className="section" style={{ paddingLeft: 0, paddingRight: 0 }}>
              <div className="section-row">
                <h3 className="section-title" style={{ margin: 0 }}>
                  {t("explore.deals")}
                </h3>
                <span className="small muted">{t("explore.perPerson")}</span>
              </div>
              <CheapestDeals />
            </section>

            <section className="section" style={{ paddingLeft: 0, paddingRight: 0 }} key={seed[0]?.id ?? "seed"}>
              <div className="section-row">
                <h3 className="section-title" style={{ margin: 0 }}>
                  {last ? t("explore.roundOut") : t("explore.buildItinerary")}
                </h3>
                <Badge tone="ai">
                  <IconSparkle size={11} /> {t("explore.crossSell")}
                </Badge>
              </div>
              <div className="vstack" style={{ gap: 8 }}>
                {seed.map((o) => (
                  <Card
                    key={o.id}
                    className="card-press"
                    style={{ padding: 12 }}
                    onClick={() => go("ota-booking", { vertical: o.vertical, offer: o })}
                  >
                    <div className="hstack" style={{ gap: 12 }}>
                      {o.photo ? (
                        <Photo src={o.photo} ratio="1/1" alt={o.title} className="ota-thumb" />
                      ) : (
                        <span className="ota-thumb ota-thumb-ph" style={{ background: "var(--border-soft)" }}>
                          {(() => {
                            const ThumbIcon = VERT_ICON[o.vertical];
                            return <ThumbIcon size={18} />;
                          })()}
                        </span>
                      )}
                      <span className="ota-sugg-text">
                        <span className="rl-title">{o.title}</span>
                        <span className="rl-sub">
                          {withRate(o)} · &#9733; {o.rating}
                        </span>
                      </span>
                      <b className="ota-sugg-price">{money(o.price)}</b>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {first && (
              <section className="section" style={{ paddingLeft: 0, paddingRight: 0 }}>
                <div className="section-row">
                  <h3 className="section-title" style={{ margin: 0 }}>
                    {t("explore.continue")}
                  </h3>
                  <button className="btn-ghost btn-sm" onClick={() => go("trips-home")}>
                    {t("explore.allTrips")} <IconChevronRight size={13} />
                  </button>
                </div>
                <Card className="card-press" style={{ padding: 14 }} onClick={() => toTrip(first.id)}>
                  <div className="ota-card-row">
                    {first.photo ? (
                      <span className="cc-media">
                        <Photo src={first.photo} ratio="1/1" alt={first.destination} />
                      </span>
                    ) : null}
                    <div className="ota-card-body">
                      <div className="rl-title">{first.name}</div>
                      <div className="rl-sub">
                        {first.destination} - {first.dates}
                      </div>
                      <div className="hstack" style={{ gap: 6, marginTop: 8 }}>
                        {first.mode === "group" ? (
                          <Badge tone="ai">
                            <IconUsers size={11} /> {t("tripsHome.groupOf", { n: first.travellers.length })}
                          </Badge>
                        ) : (
                          <Badge tone="teal">{t("createTrip.soloBtn")}</Badge>
                        )}
                      </div>
                    </div>
                    <IconChevronRight size={18} className="muted" style={{ marginRight: 14, flex: "none" }} />
                  </div>
                </Card>
              </section>
            )}
          </div>
        </div>
      </Shell>
      <CalendarModal
        isOpen={!!calendarOpen}
        onClose={closeCalendar}
        title={calendarOpen === "depart" ? t("explore.depart") : t("explore.return")}
        selectedDate={calendarOpen === "depart" ? searchDateA : searchDateB}
        onSelect={handleDateSelect}
        minDate={calendarOpen === "return" ? searchDateA : undefined}
      />
    </>
  );
}

function withRate(o: OtaOffer): string {
  const v = o.vertical;
  if (v === "flights") return `Non-stop ${o.meta.duration}`;
  if (v === "hotels") return `${o.meta.rating} · ${o.meta.location}`;
  if (v === "cars") return `${o.meta.type}`;
  return o.meta.category;
}