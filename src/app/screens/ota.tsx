"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { OtaOffer, Vertical } from "../data";
import { OTA_OFFERS } from "../data";
import { useApp } from "../store";
import { Shell, Card, Badge, Photo } from "../ui";
import {
  IconPlane,
  IconHome,
  IconCar,
  IconTicket,
  IconSearch,
  IconCalendar,
  IconStar,
  IconChevronRight,
  IconArrowRight,
  IconCheckCircle,
  IconInfo,
  IconShield,
  IconClock,
  IconMapPin,
} from "../icons";
import { searchOffers, SearchParams } from "../lib/ota-search";

const VERT_TITLE: Record<Vertical, string> = {
  flights: "Flights",
  hotels: "Hotels",
  cars: "Cars",
  attractions: "Attractions",
};

const VERT_ICON: Record<Vertical, typeof IconPlane> = {
  flights: IconPlane,
  hotels: IconHome,
  cars: IconCar,
  attractions: IconTicket,
};

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

const v = (param: unknown): Vertical =>
  (["flights", "hotels", "cars", "attractions"] as const).includes(param as Vertical)
    ? (param as Vertical)
    : "flights";

/* ──────────────── Search form ──────────────── */

export function OtaSearchScreen() {
  const { go, back, route } = useApp();
  const vertical = v(route.params?.vertical);
  const isFlight = vertical === "flights";
  const [to, setTo] = useState(typeof route.params?.destination === "string" ? String(route.params.destination) : isFlight ? "Paris" : "Paris");
  const [from, setFrom] = useState("London");
  const [way, setWay] = useState<"return" | "oneway">("return");
  const [dateA, setDateA] = useState("Fri 25 Sep");
  const [dateB, setDateB] = useState("Sun 27 Sep");
  const [trav, setTrav] = useState("2");
  const [loading, setLoading] = useState(false);

  const run = (screen: "ota-results" | "ota-booking", extra?: Record<string, unknown>) => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      go(screen, {
        vertical,
        destination: to,
        dates: way === "return" ? `${dateA} - ${dateB}` : dateA,
        from,
        way,
        ...extra,
      });
    }, 850);
  };

  const Icon = VERT_ICON[vertical];

  return (
    <Shell title={`Search ${VERT_TITLE[vertical].toLowerCase()}`} sub={isFlight ? "Compare airlines end to end" : `Best ${VERT_TITLE[vertical].toLowerCase()} near your dates`} onBack={back}>
      <div className="content">
        <div className="vstack">
          {isFlight && (
            <div className="field">
              <label>From</label>
              <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Departure city or airport" />
            </div>
          )}

          <div className="field">
            <label>{isFlight ? "To" : "City"}</label>
            <input type="text" value={to} onChange={(e) => setTo(e.target.value)} placeholder={isFlight ? "Arrival city or airport" : "Where are you headed?"} />
          </div>

          <div className="od-grid" style={{ "--od-cols": way === "return" && isFlight ? 2 : 2, "--od-gap": "12px" } as CSSProperties}>
            <div className="field">
              <label>{isFlight ? "Depart" : "Check-in"}</label>
              <input type="text" value={dateA} onChange={(e) => setDateA(e.target.value)} />
            </div>
            {(way === "return" || !isFlight) && (
              <div className="field">
                <label>{isFlight ? "Return" : "Check-out"}</label>
                <input type="text" value={dateB} onChange={(e) => setDateB(e.target.value)} />
              </div>
            )}
          </div>

          {isFlight && (
            <div className="field">
              <label>Trip type</label>
              <div className="seg">
                <button className={`seg-btn${way === "return" ? " active" : ""}`} onClick={() => setWay("return")}>
                  <IconCalendar size={14} /> Return
                </button>
                <button className={`seg-btn${way === "oneway" ? " active" : ""}`} onClick={() => setWay("oneway")}>
                  <IconArrowRight size={13} /> One way
                </button>
              </div>
            </div>
          )}

          <div className="field">
            <label>{isFlight ? "Travellers" : "Guests"}</label>
            <input type="text" inputMode="numeric" value={trav} onChange={(e) => setTrav(e.target.value.replace(/\D/g, ""))} />
          </div>

          <button className="btn btn-primary btn-full" onClick={() => run("ota-results")} disabled={loading || !to.trim()}>
            {loading ? (
              <>
                <IconClock size={15} /> Searching {to || "..."}...
              </>
            ) : (
              <>
                <IconSearch size={15} /> Search
              </>
            )}
          </button>

          <Card className="card-ai" style={{ marginTop: 12 }}>
            <div className="hstack" style={{ gap: 10 }}>
              <Icon size={18} style={{ color: "var(--ai)", flex: "none" }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 650 }}>Aeris cross-search</div>
                <p className="small muted" style={{ margin: "4px 0 0" }}>
                  Book this and Aeris will pair it with nearby {vertical === "flights" ? "hotels and rides" : vertical === "hotels" ? "rides and tickets" : vertical === "cars" ? "tickets and stays" : "stays and flights"} in one basket.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}

/* ──────────────── Results ──────────────── */

export function OtaResultsScreen() {
  const { go, back, route, money } = useApp();
  const vertical = v(route.params?.vertical);
  const destination = typeof route.params?.destination === "string" ? String(route.params.destination) : "Paris";
  const dates = typeof route.params?.dates === "string" ? String(route.params.dates) : "";
  const from = typeof route.params?.from === "string" ? String(route.params.from) : "London";
  const way = (typeof route.params?.way === "string" ? String(route.params.way) : "return") as "return" | "oneway";

  const [sort, setSort] = useState<"rec" | "price" | "rating">("rec");
  const [filter, setFilter] = useState<string>("all");
  const [map, setMap] = useState(false);
  const [offers, setOffers] = useState<OtaOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params: SearchParams = { vertical, destination, from, dates, way };
    setLoading(true);
    searchOffers(params).then((data) => {
      setOffers(data);
      setLoading(false);
    }).catch(() => {
      setOffers([]);
      setLoading(false);
    });
  }, [vertical, destination, from, dates, way]);

  const categories = useMemo(() => {
    const all = offers.flatMap((o) => o.tags.map((t) => t.split("·")[0].trim()));
    const seen = new Set<string>();
    const out: string[] = [];
    for (const c of all) {
      const k = c.split(" ").slice(0, 2).join(" ");
      if (k && !seen.has(k)) {
        seen.add(k);
        out.push(k);
      }
    }
    return out.slice(0, 4);
  }, [offers]);

  const filt = filter === "all" ? offers : offers.filter((o) => o.tags[0]?.toLowerCase().includes(filter.toLowerCase()) || o.subtitle.toLowerCase().includes(filter.toLowerCase()) || o.meta.location?.toLowerCase().includes(filter.toLowerCase()));
  const sorted = [...filt].sort((a, b) => (sort === "price" ? Number(a.price) - Number(b.price) : sort === "rating" ? b.rating - a.rating : b.rating - a.rating));

  const Icon = VERT_ICON[vertical];

  if (loading) {
    return (
      <Shell title={`${VERT_TITLE[vertical]} · ${destination}`} sub={dates} onBack={back}>
        <div className="content">
          <div className="empty-state" style={{ paddingTop: 60 }}>
            <div className="es-icon spin">
              <Icon size={26} />
            </div>
            <h3>Searching {destination}...</h3>
            <p className="small muted">Finding the best options for you</p>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell
      title={`${VERT_TITLE[vertical]} · ${destination}`}
      sub={dates}
      onBack={back}
    >
      <div className="content">
        <div className="hstack" style={{ gap: 8, flexWrap: "wrap" }}>
          {(["rec", "price", "rating"] as const).map((s) => (
            <button key={s} className={`chip${sort === s ? " active" : ""}`} onClick={() => setSort(s)}>
              {s === "rec" ? "Recommended" : s === "price" ? "Price" : "Rating"}
            </button>
          ))}
          {vertical === "hotels" && (
            <button className={`chip${map ? " active" : ""}`} onClick={() => setMap(!map)}>
              <IconMapPin size={13} /> {map ? "List" : "Map"}
            </button>
          )}
        </div>

        {map && vertical === "hotels" && (
          <div className="map-area ota-mini-map" style={{ margin: "12px 0 4px" }}>
            <div className="map-grid" />
            <div className="map-road r1" />
            <div className="map-road r2" />
            <div className="map-river" />
            {sorted.slice(0, 4).map((o, i) => (
              <button
                key={o.id}
                className="ota-map-pin"
                style={{ top: `${18 + i * 18}%`, left: `${20 + i * 14}%` }}
                onClick={() => go("ota-booking", { vertical, offerId: o.id })}
              >
                <IconMapPin size={15} />
                <span>{o.title}</span>
              </button>
            ))}
          </div>
        )}

        <div className="rail-inline" style={{ marginTop: 10 }}>
          <button className={`chip${filter === "all" ? " active" : ""}`} onClick={() => setFilter("all")}>
            All
          </button>
          {categories.map((c) => (
            <button key={c} className={`chip${filter === c ? " active" : ""}`} onClick={() => setFilter(filter === c ? "all" : c)}>
              {c}
            </button>
          ))}
        </div>

        <div className="vstack" style={{ gap: 10, marginTop: 6 }}>
          {sorted.map((o, i) => (
            <Card key={o.id} className="card-press" style={{ padding: 0, overflow: "hidden" }} onClick={() => go("ota-booking", { vertical, offer: o })}>
              <div className="hstack" style={{ gap: 0, alignItems: "stretch" }}>
                {o.photo ? (
                  <Photo src={o.photo} ratio="1/1" alt={o.title} className="ota-offer-photo" />
                ) : (
                  <span className="ota-offer-photo ota-offer-ph" style={{ background: "var(--border-soft)" }}>
                    <Icon size={22} />
                  </span>
                )}
                <div style={{ padding: 12, flex: 1, minWidth: 0 }}>
                  <div className="spread" style={{ gap: 8 }}>
                    <div className="ota-offer-title">{i + 1}. {o.title}</div>
                    <b style={{ fontSize: 14, whiteSpace: "nowrap" }}>
                      {money(o.price)}
                      <span className="muted" style={{ fontSize: 10, fontWeight: 500 }}> {o.priceNote}</span>
                    </b>
                  </div>
                  <div className="small muted" style={{ marginTop: 2 }}>{o.subtitle}</div>
                  <div className="hstack" style={{ gap: 6, marginTop: 7, flexWrap: "wrap" }}>
                    <span className="hstack" style={{ gap: 3 }}>
                      <IconStar size={12} style={{ color: "var(--amber)" }} />
                      <b className="small">{o.rating}</b>
                      <span className="muted small">({o.reviews})</span>
                    </span>
                    {Object.entries(o.meta).slice(0, 2).map(([k, val]) => (
                      <Badge key={k} tone="outline">{val}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {sorted.length === 0 && (
            <Card style={{ padding: 20 }}>
              <div className="empty-state">
                <div className="es-icon">
                  <IconInfo size={22} />
                </div>
                <h3>No matches yet</h3>
                <p className="small muted">Broaden the filters or clear them to see everything.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Shell>
  );
}

/* ──────────────── Booking + cross-sell ──────────────── */

export function OtaBookingScreen() {
  const { route, back, reset, replace, addOtaBooking, money, t } = useApp();
  const vertical = v(route.params?.vertical);
  const offerParam = route.params?.offer;
  const offer = offerParam as OtaOffer | undefined;
  const [stage, setStage] = useState<"review" | "processing" | "done">("review");
  const [ref] = useState(() => "AER-" + Math.floor(1000 + Math.random() * 9000));

  const related = useMemo(() => relatedFor(vertical), [vertical]);

  if (!offer) {
    return (
      <Shell title={t("ota.booking")} onBack={back}>
        <div className="content">
          <div className="empty-state">
            <div className="es-icon">
              <IconInfo size={24} />
            </div>
            <h3>{t("ota.offerNotFound")}</h3>
            <p className="small muted">{t("ota.notFoundSub")}</p>
            <button className="btn btn-secondary" onClick={back}>
              {t("ota.backToResults")}
            </button>
          </div>
        </div>
      </Shell>
    );
  }

  const confirm = () => {
    setStage("processing");
    window.setTimeout(() => {
      addOtaBooking({
        id: offer.id,
        ref,
        vertical: offer.vertical,
        title: offer.title,
        provider: offer.provider,
        price: offer.price,
        priceNote: offer.priceNote,
        meta: offer.meta,
        time: "just now",
      });
      setStage("done");
    }, 950);
  };

  const Icon = VERT_ICON[offer.vertical];
  const Title = VERT_TITLE[offer.vertical];

  if (stage !== "review") {
    if (stage === "processing") {
      return (
        <Shell title={t("ota.booking")}>
          <div className="content">
            <div className="empty-state" style={{ paddingTop: 80 }}>
              <div className="es-icon spin">
                <Icon size={26} />
              </div>
              <h3>{t("ota.confirming", { v: Title.toLowerCase() })}</h3>
              <p className="small muted">{t("ota.holding", { t: offer.title })}...</p>
            </div>
          </div>
        </Shell>
      );
    }

    return (
      <Shell title={t("ota.confirmed")}>
        <div className="content">
          <div className="empty-state" style={{ paddingTop: 48 }}>
            <div className="es-icon" style={{ background: "var(--success-bg)", color: "var(--success)" }}>
              <IconCheckCircle size={26} />
            </div>
            <h3>{t("ota.youreBooked")}</h3>
            <p className="small fg2" style={{ maxWidth: 280, margin: "0 auto 4px" }}>
              {offer.provider} · {offer.title}
            </p>
            <div className="center mono small muted" style={{ marginBottom: 4 }}>{ref}</div>
          </div>

          <Card style={{ padding: 14 }}>
            <div className="vstack" style={{ gap: 6 }}>
              {Object.entries(offer.meta).map(([k, val]) => (
                <div key={k} className="spread">
                  <span className="small muted" style={{ textTransform: "capitalize" }}>{k}</span>
                  <b className="small">{val}</b>
                </div>
              ))}
            </div>
          </Card>

          <section className="section" style={{ paddingLeft: 0, paddingRight: 0 }}>
            <div className="section-row">
              <h3 className="section-title" style={{ margin: 0 }}>
                Add on before you go
              </h3>
              <Badge tone="ai">Cross-sell</Badge>
            </div>
            <div className="vstack" style={{ gap: 8 }}>
              {related.map((r) => {
                const RIcon = VERT_ICON[r.vertical];
                return (
                  <Card key={r.id} className="card-press" style={{ padding: 12 }} onClick={() => replace("ota-booking", { vertical: r.vertical, offer: r })}>
                    <div className="hstack" style={{ gap: 12 }}>
                      {r.photo ? (
                        <Photo src={r.photo} ratio="1/1" alt={r.title} className="ota-thumb" />
                      ) : (
                        <span className="ota-thumb ota-thumb-ph" style={{ background: "var(--border-soft)" }}>
                          <RIcon size={18} />
                        </span>
                      )}
                      <span className="ota-sugg-text">
                        <span className="rl-title">{r.title}</span>
                        <span className="rl-sub">{VERT_TITLE[r.vertical]} · &#9733; {r.rating}</span>
                      </span>
                      <b className="ota-sugg-price">{money(r.price)}</b>
                      <span className="btn btn-primary btn-sm">
                        Book <IconChevronRight size={12} />
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>

          <div className="vstack" style={{ gap: 10, marginTop: 8 }}>
            <button className="btn btn-primary btn-full" onClick={() => reset("explore")}>
              Back to Explore <IconArrowRight size={15} />
            </button>
            <button className="btn btn-secondary btn-full" onClick={() => reset("trips-home")}>
              See my bookings
            </button>
          </div>
          <p className="small muted center" style={{ marginTop: 14 }}>
            <IconShield size={12} style={{ verticalAlign: -2 }} /> This booking appears in your Trips tab.
          </p>
        </div>
      </Shell>
    );
  }

  const displayPhoto = offer.vertical === "flights" && offer.planePhoto ? offer.planePhoto : offer.photo;
    const displayRatio = offer.vertical === "flights" && offer.planePhoto ? "4/3" : (offer.photoRatio ?? "16/9");

    return (
    <Shell title={`${Title} · details`} sub={offer.title} onBack={back}>
      <div className="content">
        {displayPhoto ? (
          <Photo src={displayPhoto} ratio={displayRatio} alt={offer.title} />
        ) : (
          <div className="ota-hero">
            <Icon size={30} />
            <span>{offer.provider}</span>
          </div>
        )}

        <div style={{ marginTop: 14 }}>
          <div className="spread">
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 750 }}>{offer.title}</h2>
            <Badge tone={offer.vertical === "attractions" ? "ai" : "teal"}>{offer.provider}</Badge>
          </div>
          <div className="small muted" style={{ marginTop: 3 }}>{offer.subtitle}</div>
          <div className="hstack" style={{ gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            {offer.tags.map((t) => (
              <Badge key={t} tone="outline">{t}</Badge>
            ))}
            <span className="hstack" style={{ gap: 3 }}>
              <IconStar size={14} style={{ color: "var(--amber)" }} />
              <b style={{ fontSize: 13 }}>{offer.rating}</b>
              <span className="muted small">({offer.reviews} reviews)</span>
            </span>
          </div>

          <Card style={{ marginTop: 14, padding: 0, overflow: "hidden" }}>
            <div style={{ padding: 14, borderBottom: "1px solid var(--border-soft)" }}>
              <div className="vstack" style={{ gap: 8 }}>
                {Object.entries(offer.meta).map(([k, val]) => (
                  <div key={k} className="spread">
                    <span className="small muted" style={{ textTransform: "capitalize" }}>{k}</span>
                    <b className="small">{val}</b>
                  </div>
                ))}
              </div>
            </div>
            <div className="spread" style={{ padding: 14 }}>
              <div>
                <div className="small muted">Total for your booking</div>
                <div style={{ fontSize: 24, fontWeight: 750 }}>
                  <b style={{ fontSize: 18, whiteSpace: "nowrap" }}>{money(offer.price)}</b>
                  <span className="muted" style={{ fontSize: 13, fontWeight: 500 }}> {offer.priceNote}</span>
                </div>
              </div>
              <button className="btn btn-primary" onClick={confirm}>
                Book now <IconChevronRight size={15} />
              </button>
            </div>
          </Card>

          <p className="small fg2" style={{ marginTop: 14 }}>{offer.description}</p>

          <div className="vstack" style={{ gap: 6, marginTop: 10 }}>
            {offer.conditions.map((c) => (
              <div key={c} className="hstack" style={{ gap: 8 }}>
                <IconInfo size={14} className="muted" />
                <span className="small fg2">{c}</span>
              </div>
            ))}
            <div className="hstack" style={{ gap: 8 }}>
              <IconShield size={14} style={{ color: "var(--teal)" }} />
              <span className="small fg2">Free cancellation window applies before departure unless noted.</span>
            </div>
          </div>

          <button className="btn btn-ghost btn-full" style={{ marginTop: 14 }} onClick={back}>
            Back to results
          </button>
        </div>
      </div>
    </Shell>
  );
}