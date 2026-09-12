"use client";

import { useState, type CSSProperties } from "react";
import type { Mode, Trip, Traveller } from "../data";
import { YOU_COLOR, COUNTRY_CURRENCY, CURRENCY_SYMBOLS, currencySymbolOf, LOCALES, localeLabel } from "../data";
import { useApp, type NotifyPrefs, type OnboardingData } from "../store";
import { Shell, Card, Photo, Avatar, Badge, Section, Progress } from "../ui";
import {
  IconPlane,
  IconSparkle,
  IconChevronRight,
  IconChevronDown,
  IconCalendar,
  IconUsers,
  IconUser,
  IconGlobe,
  IconBell,
  IconCheck,
  IconCheckCircle,
  IconSettings,
  IconPlus,
  IconAlert,
  IconArrowRight,
  IconRefresh,
  IconLock,
  IconHome,
  IconCar,
  IconTicket,
  IconWallet,
  IconMoon,
} from "../icons";

const BOOK_ICON = {
  flights: IconPlane,
  hotels: IconHome,
  cars: IconCar,
  attractions: IconTicket,
} as const;

/* ───────────────────────────── Landing ───────────────────────────── */

export function LandingScreen() {
  const { go, t } = useApp();
  return (
<div className="screen-flex" data-screen="landing">
      <div
        className="content"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          minHeight: 0,
          paddingTop: 40,
          paddingBottom: 28,
        }}
      >
        <div>
          <div className="rail-inline" style={{ justifyContent: "center" }}>
            <img
              src="/images/Logo.png"
              alt="Aeris"
              style={{ width: 96, height: 96, objectFit: "contain" }}
            />
          </div>
          <p
            className="center muted"
            style={{
              fontSize: 12,
              letterSpacing: 3,
              fontWeight: 600,
              textTransform: "uppercase",
              margin: "10px 0 0",
            }}
          >
            Where every journey comes together
          </p>
        </div>

        <div className="vstack" style={{ gap: 10 }}>
          <Card className="card-ai">
            <div className="hstack" style={{ gap: 10 }}>
              <span className="badge badge-ai">
                <IconSparkle size={12} /> {t("landing.aiBadge")}
              </span>
            </div>
            <p className="small fg2" style={{ margin: "8px 0 0" }}>
              {t("landing.aiDesc")}
            </p>
          </Card>
          <Card>
            <div className="hstack" style={{ gap: 10 }}>
              <span className="badge badge-teal">
                <IconShieldLocal /> {t("landing.gateBadge")}
              </span>
            </div>
            <p className="small fg2" style={{ margin: "8px 0 0" }}>
              {t("landing.gateDesc")}
            </p>
          </Card>
          <Card>
            <div className="hstack" style={{ gap: 10 }}>
              <span className="badge badge-primary">
                <IconUsers size={12} /> {t("landing.groupBadge")}
              </span>
            </div>
            <p className="small fg2" style={{ margin: "8px 0 0" }}>
              {t("landing.groupDesc")}
            </p>
          </Card>
        </div>

        <div className="vstack" style={{ gap: 10 }}>
          <button className="btn btn-primary btn-full" onClick={() => go("onboarding")}>
            {t("landing.getStarted")} <IconArrowRight size={16} />
          </button>
          <button className="btn-ghost btn-full" onClick={() => go("login")}>
            {t("landing.haveAccount")}
          </button>
        </div>
      </div>
    </div>
  );
}

function IconShieldLocal() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 2.8v5c0 4.6-3 8-7 10.2-4-2.2-7-5.6-7-10.2v-5L12 3z" />
      <path d="M8.8 12l2.4 2.4 4-4.6" />
    </svg>
  );
}

/* ───────────────────────────── Login ───────────────────────────── */

const COUNTRY_NAMES = Object.keys(COUNTRY_CURRENCY).sort();

function CountrySelect({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  const { t } = useApp();
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="" disabled>
        {t("login.selectCountry")}
      </option>
      {COUNTRY_NAMES.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}

export function LoginScreen() {
  const { go, back, setUserName, reset, setCountry, t } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountryLocal] = useState("");
  const [error, setError] = useState<string | null>(null);

  const signIn = () => {
    if (!email.trim() || !password) {
      setError(t("login.errRequired"));
      return;
    }
    if (!country) {
      setError(t("login.errCountry"));
      return;
    }
    const local = email.split("@")[0].trim();
    setUserName(local ? local.charAt(0).toUpperCase() + local.slice(1) : "You");
    setCountry(country);
    setError(null);
    reset("explore");
  };

  return (
    <Shell title={t("login.title")} onBack={back}>
      <div className="content">
        <div className="vstack" style={{ paddingTop: 32 }}>
          <div className="rail-inline" style={{ justifyContent: "center", marginBottom: 16 }}>
            <div
              className="tb-btn"
              style={{ width: 56, height: 56, borderRadius: 18, background: "var(--accent)", border: "none", color: "white" }}
            >
              <IconPlane size={26} />
            </div>
          </div>
          <h2 style={{ margin: 0, textAlign: "center" }}>{t("login.welcome")}</h2>
          <p className="center muted" style={{ margin: "6px 0 28px" }}>
            {t("login.sub")}
          </p>

          <div className="field">
            <label>{t("login.email")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="field">
            <label>{t("login.password")}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("login.passwordPh")}
            />
          </div>
          <div className="field">
            <label>{t("login.country")}</label>
            <CountrySelect value={country} onChange={(c) => { setCountryLocal(c); setError(null); }} />
            <span className="field-help">
              {country
                ? t("login.helpHas", { sym: currencySymbolOf(country), code: COUNTRY_CURRENCY[country].code })
                : t("login.helpNone")}
            </span>
          </div>
          {error && <span className="field-error">{error}</span>}

          <button className="btn btn-primary btn-full" onClick={signIn}>
            {t("login.signIn")} <IconArrowRight size={16} />
          </button>
          <button className="btn-ghost btn-full" onClick={() => go("onboarding")}>
            {t("login.createAccount")}
          </button>
        </div>
      </div>
    </Shell>
  );
}

/* ───────────────────────────── Onboarding ───────────────────────────── */

export function OnboardingScreen() {
  const { back, go, finishOnboarding, notify, t } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [style, setStyle] = useState("Balanced");
  const [locale, setLocaleLocal] = useState("en");
  const [country, setCountryLocal] = useState("");
  const [color, setColor] = useState("#2563eb");
  const [connectCalendar, setConnectCalendar] = useState(true);
  const [toggles, setToggles] = useState<NotifyPrefs>({ disruptions: true, votes: true, promotions: false });
  const [saving, setSaving] = useState(false);

  const styles = ["Balanced", "Planner", "Spontaneous", "Budget-first"];
  const avatarColors = ["#2563eb", "#0d9488", "#7c3aed", "#d97706", "#15803d", "#dc2626"];

  const finish = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const data: OnboardingData = {
        name: name.trim(),
        color,
        locale,
        country,
        notifyPrefs: toggles,
      };
      await finishOnboarding(data);
      if (connectCalendar) go("calendar-connect");
    } catch {
      notify(t("onboarding.saveError"));
      setSaving(false);
    }
  };

  return (
    <Shell
      title="Set up Aeris"
      onBack={step === 0 ? back : () => setStep((s) => s - 1)}
      header={
        <header className="top-bar">
          <button className="tb-btn" onClick={step === 0 ? back : () => setStep((s) => s - 1)} aria-label="Go back">
            <svg width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <div className="tb-text">
            <h2>{t("onboarding.title")}</h2>
            <div className="tb-sub">{t("onboarding.stepOf", { n: step + 1 })}</div>
          </div>
        </header>
      }
    >
      <div className="content">
        <div className="step-indicator">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`step-dot${i === step ? " active" : ""}`} />
          ))}
        </div>

        {step === 0 && (
          <div className="vstack">
            <h2 style={{ margin: 0 }}>{t("onboarding.who")}</h2>
            <div className="field">
              <label>{t("onboarding.name")}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("onboarding.namePh")}
              />
            </div>
            <div className="field">
              <label>{t("onboarding.avatarColour")}</label>
              <div className="hstack" style={{ gap: 8, flexWrap: "wrap" }}>
                {avatarColors.map((c) => (
                  <button
                    key={c}
                    className="tb-btn avatar-color-dot"
                    aria-label={`colour ${c}`}
                    aria-pressed={color === c}
                    onClick={() => setColor(c)}
                    style={{
                      background: c,
                      borderColor: c,
                      color: "white",
                      boxShadow: color === c ? "0 0 0 2px var(--bg), 0 0 0 4px #0f172a" : "none",
                    }}
                  />
                ))}
              </div>
            </div>
            <button className="btn btn-primary btn-full" onClick={() => setStep(1)} disabled={!name.trim()}>
              {t("common.continue")}
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="vstack">
            <h2 style={{ margin: 0 }}>{t("onboarding.travelStyle")}</h2>
            <div className="section-title" style={{ margin: "8px 0 4px" }}>
              {t("onboarding.planningStyle")}
            </div>
            <div className="rail-inline">
              {styles.map((s) => (
                <button key={s} className={`chip${style === s ? " active" : ""}`} onClick={() => setStyle(s)}>
                  {s}
                </button>
              ))}
            </div>
            <div className="section-title" style={{ margin: "20px 0 4px" }}>
              {t("onboarding.interfaceLanguage")}
            </div>
            <div className="rail-inline">
              {LOCALES.map((l) => (
                <button key={l.code} className={`chip${locale === l.code ? " active" : ""}`} onClick={() => setLocaleLocal(l.code)}>
                  <IconGlobe size={14} /> {l.label}
                </button>
              ))}
            </div>
            <div className="section-title" style={{ margin: "20px 0 4px" }}>
              {t("onboarding.whereLive")}
            </div>
            <div className="field">
              <CountrySelect value={country} onChange={setCountryLocal} />
              <span className="field-help">
                {country
                  ? t("onboarding.currencyHelp", { sym: currencySymbolOf(country), code: COUNTRY_CURRENCY[country].code })
                  : t("onboarding.currencyHelpNone")}
              </span>
            </div>
            <button className="btn btn-primary btn-full" style={{ marginTop: 20 }} onClick={() => setStep(2)} disabled={!country}>
              {t("common.continue")}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="vstack">
            <h2 style={{ margin: 0 }}>{t("onboarding.stayLoop")}</h2>
            <Card>
              <ToggleRow
                label={t("onboarding.alertLabel")}
                sub={t("onboarding.alertSub")}
                on={toggles.disruptions}
                onChange={(v) => setToggles((t) => ({ ...t, disruptions: v }))}
              />
              <div className="divider" />
              <ToggleRow
                label={t("onboarding.voteLabel")}
                sub={t("onboarding.voteSub")}
                on={toggles.votes}
                onChange={(v) => setToggles((t) => ({ ...t, votes: v }))}
              />
              <div className="divider" />
              <ToggleRow
                label={t("onboarding.promoLabel")}
                sub={t("onboarding.promoSub")}
                on={toggles.promotions}
                onChange={(v) => setToggles((t) => ({ ...t, promotions: v }))}
              />
              <div className="divider" />
              <ToggleRow
                label={t("onboarding.connectCalendar")}
                sub={t("onboarding.connectCalendarSub")}
                on={connectCalendar}
                onChange={setConnectCalendar}
              />
            </Card>
            <button className="btn btn-primary btn-full" onClick={finish} disabled={saving}>
              {saving ? t("onboarding.finishing") : t("onboarding.finish")}
            </button>
          </div>
        )}
      </div>
    </Shell>
  );
}

function ToggleRow({
  label,
  sub,
  on,
  onChange,
}: {
  label: string;
  sub: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="spread" style={{ gap: 12 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="rl-title" style={{ fontSize: 14, fontWeight: 600 }}>
          {label}
        </div>
        <div className="small muted">{sub}</div>
      </div>
      <button
        className={`toggle${on ? " on" : ""}`}
        aria-pressed={on}
        aria-label={label}
        onClick={() => onChange(!on)}
      />
    </div>
  );
}

/* ───────────────────────────── Calendar connect ───────────────────────────── */

export function CalendarConnectScreen() {
  const { go, back, reset, t } = useApp();
  const [state, setState] = useState<"idle" | "syncing" | "done">("idle");

  const connect = () => {
    setState("syncing");
    window.setTimeout(() => setState("done"), 700);
  };

  return (
    <Shell title={t("calendar.title")} onBack={back}>
      <div className="content">
        {state !== "done" ? (
          <div className="vstack">
            <div className="card-hero card" style={{ padding: 20 }}>
              <div className="hstack" style={{ gap: 10, marginBottom: 10 }}>
                <IconCalendar size={22} />
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 650 }}>
                  {t("calendar.heading")}
                </h3>
              </div>
              <p className="small" style={{ margin: 0, opacity: 0.92, lineHeight: 1.5 }}>
                {t("calendar.desc")}
              </p>
            </div>
            <Card>
              <div className="spread">
                <div>
                  <div className="rl-title" style={{ fontSize: 14, fontWeight: 600 }}>
                    {t("calendar.readTitle")}
                  </div>
                  <div className="small muted">{t("calendar.readSub")}</div>
                </div>
                <button className={`toggle on`} aria-pressed="true" aria-label={t("calendar.readTitle")} />
              </div>
              <div className="divider" />
              <div className="spread">
                <div>
                  <div className="rl-title" style={{ fontSize: 14, fontWeight: 600 }}>
                    {t("calendar.slotTitle")}
                  </div>
                  <div className="small muted">{t("calendar.slotSub")}</div>
                </div>
                <button className="toggle on" aria-pressed="true" aria-label={t("calendar.slotTitle")} />
              </div>
              <div className="divider" />
              <div className="spread">
                <div>
                  <div className="rl-title" style={{ fontSize: 14, fontWeight: 600 }}>
                    {t("calendar.writeTitle")}{" "}
                    <Badge tone="muted">
                      <IconLock size={11} /> {t("calendar.locked")}
                    </Badge>
                  </div>
                  <div className="small muted">{t("calendar.writeSub")}</div>
                </div>
                <button className="toggle" aria-pressed="false" aria-label={t("calendar.writeTitle")} disabled />
              </div>
            </Card>
            <button className="btn btn-primary btn-full" onClick={connect} disabled={state === "syncing"}>
              {state === "syncing" ? (
                <>
                  <IconRefresh size={16} /> {t("calendar.connecting")}
                </>
              ) : (
                <>
                  {t("calendar.connect")} <IconArrowRight size={16} />
                </>
              )}
            </button>
            <button className="btn-ghost btn-full" onClick={() => reset("explore")}>
              {t("common.skipForNow")}
            </button>
          </div>
        ) : (
          <div className="vstack" style={{ paddingTop: 40 }}>
            <div className="empty-state">
              <div className="es-icon">
                <IconCheckCircle size={26} />
              </div>
              <h3>{t("calendar.done")}</h3>
              <p>{t("calendar.doneSub")}</p>
            </div>
            <button className="btn btn-primary btn-full" onClick={() => reset("trips-home")}>
              {t("calendar.seeTrips")} <IconArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </Shell>
  );
}

/* ───────────────────────────── Trips home ───────────────────────────── */

export function TripsHomeScreen() {
  const { trips, go, toTrip, notify, friends, requests, notificationsOn, toggleNotifications, otaBookings, money, locale, setLocale, t } = useApp();
  const [langOpen, setLangOpen] = useState(false);

  const tripList = Object.values(trips);

  return (
    <Shell
      title={t("tripsHome.title")}
      header={
        <header className="top-bar">
          <div className="tb-text">
            <h2>{t("tripsHome.title")}</h2>
            <div className="tb-sub">{t("tripsHome.upcoming", { n: tripList.length })}</div>
          </div>
          <button className="tb-btn" aria-label={t("common.settings")} onClick={() => go("settings")}>
            <IconSettings />
          </button>
        </header>
      }
    >
      <div className="screen-scroll" style={{ flex: 1 }}>
        <div className="content">
          {tripList.map((trip) => {
            const openAlerts = trip.alerts.filter((a) => !a.resolved && a.kind !== "info").length;
            return (
              <Card key={trip.id} className="card-press" onClick={() => toTrip(trip.id)} style={{ padding: 0, overflow: "hidden" }}>
                <Photo src={trip.photo} ratio={trip.photoRatio} alt={trip.destination} />
                <div style={{ padding: 16 }}>
                  <div className="spread">
                    <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{trip.name}</h3>
                    {trip.mode === "group" ? <Badge tone="ai"><IconUsers size={12} /> {t("tripsHome.groupOf", { n: trip.travellers.length })}</Badge> : <Badge tone="teal"><IconUser size={12} /> {t("createTrip.soloBtn")}</Badge>}
                  </div>
                  <div className="small muted" style={{ marginTop: 3 }}>
                    {trip.destination} - {trip.dates}
                  </div>
                  <div className="spread" style={{ marginTop: 12 }}>
                    <div className="avatar-stack">
                      {trip.travellers.map((tr, i) => (
                        <Avatar key={tr.id} name={tr.name} initials={tr.initials} color={tr.color} size="sm" />
                      ))}
                    </div>
                    <div className="hstack" style={{ gap: 8 }}>
                      {openAlerts > 0 && (
                        <Badge tone="warn">
                          <IconAlert size={12} /> {t("tripsHome.alertOpen", { n: openAlerts })}
                        </Badge>
                      )}
                      <IconChevronRight size={18} className="muted" />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          {otaBookings.length > 0 && (
            <Section title={t("tripsHome.recentBookings")}>
              <div className="vstack" style={{ gap: 8 }}>
                {otaBookings
                  .slice()
                  .reverse()
                  .slice(0, 3)
                  .map((b) => {
                    const BIcon = BOOK_ICON[b.vertical];
                    return (
                      <Card
                        key={b.ref}
                        className="card-press"
                        style={{ padding: 12 }}
                        onClick={() => notify(t("tripsHome.confirmed", { ref: b.ref }))}
                      >
                        <div className="hstack" style={{ gap: 12 }}>
                          <span className="ota-thumb ota-thumb-ph" style={{ background: "var(--border-soft)" }}>
                            <BIcon size={18} />
                          </span>
                          <span className="ota-sugg-text">
                            <span className="rl-title">{b.title}</span>
                            <span className="rl-sub">
                              {b.provider} · {money(b.price)} · {b.time}
                            </span>
                          </span>
                          <Badge tone="ai">{b.ref}</Badge>
                        </div>
                      </Card>
                    );
                  })}
              </div>
              <button className="btn btn-ghost btn-full" style={{ marginTop: 12 }} onClick={() => notify(t("tripsHome.viewBookings"))}>
                {t("tripsHome.viewAllBookings")} <IconChevronRight size={14} />
              </button>
            </Section>
          )}

          <button
            className="btn btn-secondary btn-full"
            style={{ marginTop: 16, borderStyle: "dashed" }}
            onClick={() => go("create-trip")}
          >
            <IconPlus size={16} /> {t("createTrip.title")}
          </button>

          <Section title={t("tripsHome.quickSettings")} >
            <Card style={{ padding: "6px 14px" }}>
              <button className="row-link" style={{ paddingLeft: 0, paddingRight: 0 }} onClick={() => go("friends")}>
                <IconUsers size={18} />
                <span className="rl-text">
                  <span className="rl-title">{t("common.friends")}</span>
                  <span className="rl-sub">
                    {t("tripsHome.friendsSub", { n: friends.length, r: requests.length })}
                  </span>
                </span>
                {requests.length > 0 && (
                  <Badge tone="ai">
                    <IconSparkle size={11} /> {requests.length}
                  </Badge>
                )}
                <IconChevronRight size={16} />
              </button>
              <button className="row-link" style={{ paddingLeft: 0, paddingRight: 0 }} onClick={() => setLangOpen((v) => !v)} aria-expanded={langOpen}>
                <IconGlobe size={18} />
                <span className="rl-text">
                  <span className="rl-title">{t("common.language")}</span>
                  <span className="rl-sub">{localeLabel(locale)}</span>
                </span>
                <IconChevronDown size={16} className={langOpen ? "rot" : ""} />
              </button>
              {langOpen && (
                <div className="rail-inline" style={{ padding: "6px 0 10px" }}>
                  {LOCALES.map((l) => (
                    <button
                      key={l.code}
                      className={`chip${locale === l.code ? " active" : ""}`}
                      onClick={() => { setLocale(l.code); notify(t("common.languageSet", { l: l.label })); }}
                    >
                      <IconGlobe size={14} /> {l.label}
                    </button>
                  ))}
                </div>
              )}
              <button className="row-link" style={{ paddingLeft: 0, paddingRight: 0 }} onClick={toggleNotifications} aria-pressed={notificationsOn}>
                <IconBell size={18} />
                <span className="rl-text">
                  <span className="rl-title">{t("common.notifications")}</span>
                  <span className="rl-sub">
                    {notificationsOn ? t("tripsHome.notifOn") : t("tripsHome.notifOff")}
                  </span>
                </span>
                <Badge tone={notificationsOn ? "success" : "danger"}>{notificationsOn ? t("common.on") : t("common.off")}</Badge>
              </button>
            </Card>
          </Section>

          <Section title={t("tripsHome.sampleTitle")} >
            <p className="small muted" style={{ margin: 0 }}>
              {t("tripsHome.sampleDesc")}
            </p>
          </Section>
        </div>
      </div>
    </Shell>
  );
}

/* ───────────────────────────── Settings ───────────────────────────── */

export function SettingsScreen() {
  const {
    go,
    back,
    notify,
    friends,
    requests,
    notificationsOn,
    toggleNotifications,
    userName,
    displayName,
    country,
    currency,
    currencySymbol,
    setCountry,
    setCurrency,
    avatarColor,
    locale,
    setLocale,
    theme,
    setTheme,
    t,
  } = useApp();
  const [countryOpen, setCountryOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [currencyQuery, setCurrencyQuery] = useState("");
  const [langOpen, setLangOpen] = useState(false);
  const currencyFiltered = Object.keys(CURRENCY_SYMBOLS).filter((code) => {
    const q = currencyQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      code.toLowerCase().includes(q) ||
      CURRENCY_SYMBOLS[code].toLowerCase().includes(q)
    );
  });

  const name = displayName ?? userName ?? "You";
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Shell title={t("settings.title")} onBack={back}>
      <div className="content">
        <Card style={{ padding: "6px 14px" }}>
          <button className="row-link" style={{ paddingLeft: 0, paddingRight: 0 }} onClick={() => go("profile")}>
            <Avatar name={name} initials={initials || "Y"} color={avatarColor} size="sm" />
            <span className="rl-text">
              <span className="rl-title">{name}</span>
              <span className="rl-sub">
                {t("settings.profileLine", { country: country || t("settings.noCountry"), sym: currencySymbol, code: currency })}
              </span>
            </span>
            <IconChevronRight size={16} />
          </button>
        </Card>

        <Section title={t("settings.quick")}>
          <Card style={{ padding: "6px 14px" }}>
            <button className="row-link" style={{ paddingLeft: 0, paddingRight: 0 }} onClick={() => go("friends")}>
              <IconUsers size={18} />
              <span className="rl-text">
                <span className="rl-title">{t("common.friends")}</span>
                <span className="rl-sub">
                  {t("tripsHome.friendsSub", { n: friends.length, r: requests.length })}
                </span>
              </span>
              {requests.length > 0 && (
                <Badge tone="ai">
                  <IconSparkle size={11} /> {requests.length}
                </Badge>
              )}
              <IconChevronRight size={16} />
            </button>
            <div className="divider" />
            <button className="row-link" style={{ paddingLeft: 0, paddingRight: 0 }} onClick={() => setLangOpen((v) => !v)} aria-expanded={langOpen}>
              <IconGlobe size={18} />
              <span className="rl-text">
                <span className="rl-title">{t("common.language")}</span>
                <span className="rl-sub">{localeLabel(locale)}</span>
              </span>
              <IconChevronDown size={16} className={langOpen ? "rot" : ""} />
            </button>
            {langOpen && (
              <div className="rail-inline" style={{ padding: "6px 0 10px" }}>
                {LOCALES.map((l) => (
                  <button
                    key={l.code}
                    className={`chip${locale === l.code ? " active" : ""}`}
                    onClick={() => { setLocale(l.code); notify(t("common.languageSet", { l: l.label })); setLangOpen(false); }}
                  >
                    <IconGlobe size={14} /> {l.label}
                  </button>
                ))}
              </div>
            )}
            <div className="divider" />
            <button className="row-link" style={{ paddingLeft: 0, paddingRight: 0 }} onClick={toggleNotifications} aria-pressed={notificationsOn}>
              <IconBell size={18} />
              <span className="rl-text">
                <span className="rl-title">{t("common.notifications")}</span>
                <span className="rl-sub">
                  {notificationsOn ? t("tripsHome.notifOn") : t("tripsHome.notifOff")}
                </span>
              </span>
              <Badge tone={notificationsOn ? "success" : "danger"}>{notificationsOn ? t("common.on") : t("common.off")}</Badge>
            </button>
            <div className="divider" />
            <button className="row-link" style={{ paddingLeft: 0, paddingRight: 0 }} onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-pressed={theme === "dark"}>
              <IconMoon size={18} />
              <span className="rl-text">
                <span className="rl-title">{t("settings.darkMode")}</span>
                <span className="rl-sub">{t("settings.darkModeSub")}</span>
              </span>
              <Badge tone={theme === "dark" ? "success" : "danger"}>{theme === "dark" ? t("common.on") : t("common.off")}</Badge>
            </button>
            <div className="divider" />
            <button className="row-link" style={{ paddingLeft: 0, paddingRight: 0 }} onClick={() => go("calendar-connect")}>
              <IconCalendar size={18} />
              <span className="rl-text">
                <span className="rl-title">{t("settings.calendarSync")}</span>
                <span className="rl-sub">{t("tripsHome.calendarSyncSub")}</span>
              </span>
              <IconChevronDown size={16} className="rot" />
            </button>
          </Card>
        </Section>

        <Section title={t("settings.currencyRegion")}>
          <Card style={{ padding: "6px 14px" }}>
            <button className="row-link" style={{ paddingLeft: 0, paddingRight: 0 }} onClick={() => setCountryOpen((v) => !v)} aria-expanded={countryOpen}>
              <IconGlobe size={18} />
              <span className="rl-text">
                <span className="rl-title">{t("settings.country")}</span>
                <span className="rl-sub">
                  {country ? t("settings.countrySub", { country, sym: CURRENCY_SYMBOLS[currency] ?? currency, code: currency }) : t("settings.countrySubNone")}
                </span>
              </span>
              <IconChevronDown size={16} className={countryOpen ? "rot" : ""} />
            </button>
            {countryOpen && (
              <div style={{ padding: "4px 0 10px" }}>
                <CountrySelect value={country} onChange={(c) => { setCountry(c); notify(t("settings.currencySet", { sym: currencySymbolOf(c), code: COUNTRY_CURRENCY[c].code })); setCountryOpen(false); }} />
              </div>
            )}
            <div className="divider" />
            <button className="row-link" style={{ paddingLeft: 0, paddingRight: 0 }} onClick={() => setCurrencyOpen((v) => !v)} aria-expanded={currencyOpen}>
              <IconWallet size={18} />
              <span className="rl-text">
                <span className="rl-title">{t("settings.preferredCurrency")}</span>
                <span className="rl-sub">
                  {t("settings.currencySub", { sym: currencySymbol, code: currency })}
                </span>
              </span>
              <IconChevronDown size={16} className={currencyOpen ? "rot" : ""} />
            </button>
            {currencyOpen && (
              <div style={{ padding: "10px 0 10px" }}>
                <input
                  className="currency-search"
                  type="text"
                  value={currencyQuery}
                  onChange={(e) => setCurrencyQuery(e.target.value)}
                  placeholder={t("settings.currencySearchPh")}
                  aria-label={t("settings.currencySearchAria")}
                />
                <div className="rail-inline" style={{ marginTop: 8, maxHeight: 200, overflowY: "auto" }}>
                  {currencyFiltered.map((code) => (
                    <button
                      key={code}
                      className={`chip${currency === code ? " active" : ""}`}
                      onClick={() => { setCurrency(code); notify(t("settings.currencySet", { sym: CURRENCY_SYMBOLS[code], code })); setCurrencyOpen(false); setCurrencyQuery(""); }}
                    >
                      {CURRENCY_SYMBOLS[code]} {code}
                    </button>
                  ))}
                  {currencyFiltered.length === 0 && (
                    <p className="small muted" style={{ margin: "4px 2px" }}>
                      {t("settings.currencyEmpty", { q: currencyQuery.trim() })}
                    </p>
                  )}
                </div>
              </div>
            )}
          </Card>
        </Section>

        <Section title={t("settings.sampleTitle")}>
          <p className="small muted" style={{ margin: 0 }}>
            {t("settings.sampleDesc")}
          </p>
        </Section>
      </div>
    </Shell>
  );
}

/* ───────────────────────────── Create trip ───────────────────────────── */

export function CreateTripScreen() {
  const { go, back, addTrip, currency, t } = useApp();
  const [dest, setDest] = useState("Paris, France");
  const [from, setFrom] = useState("Fri 25 Sep");
  const [to, setTo] = useState("Sun 27 Sep");
  const [mode, setMode] = useState<Mode>("group");
  const [budget, setBudget] = useState("600");
  const [members, setMembers] = useState<string[]>(["ana", "zara"]);
  const [error, setError] = useState<string | null>(null);

  const memberOptions: { id: string; name: string; initials: string; color: string }[] = [
    { id: "ana", name: "Ana", initials: "A", color: "#0d9488" },
    { id: "marco", name: "Marco", initials: "M", color: "#7c3aed" },
    { id: "zara", name: "Zara", initials: "Z", color: "#d97706" },
  ];

  const save = () => {
    if (!dest.trim()) {
      setError(t("createTrip.errDestination"));
      return;
    }
    const id = "t" + Date.now();
    const logo = dest.toLowerCase().includes("paris")
      ? "/images/louvre.jpg"
      : dest.toLowerCase().includes("bali")
      ? "/images/bali.jpg"
      : "/images/generic-dest.jpg";
    const ratio = dest.toLowerCase().includes("paris")
      ? "1280/1096"
      : dest.toLowerCase().includes("bali")
      ? "1280/853"
      : "3/2";

    const trav: Traveller = {
      id: "you",
      name: "You",
      initials: "Y",
      color: YOU_COLOR,
      role: "organiser",
      you: true,
      submitted: true,
    };
    const groupTravellers = members.map((m) => {
      const o = memberOptions.find((x) => x.id === m)!;
      return { id: o.id, name: o.name, initials: o.initials, color: o.color, submitted: false } as Traveller;
    });

    const trip: Trip = {
      id,
      name: dest,
      destination: dest,
      dates: `${from} - ${to}`,
      mode,
      tagline: mode === "group" ? `${groupTravellers.length + 1} travellers` : "Just you",
      photo: logo,
      photoRatio: ratio,
      travellers: mode === "group" ? [trav, ...groupTravellers] : [trav],
      itinerary: [],
      options: [],
      expenses: [],
      settlement: [],
      naiveSettlementCount: 0,
      alerts: [
        {
          id: "na1",
          kind: "info",
          title: "Aeris is watching this trip",
          desc: "Alerts from this trip arrive in batched, 15-minute windows to keep things quiet.",
          time: "just now",
        },
      ],
      history: [
        {
          id: "nh1",
          kind: "system",
          text: "Trip created",
          who: "You",
          time: "just now",
        },
      ],
      budget: {
        total: budget || "0",
        remaining: budget || "0",
        remainingPct: 100,
        categories: [
          { label: "Flights", spent: "0", pct: 0 },
          { label: "Stay", spent: "0", pct: 0 },
          { label: "Food", spent: "0", pct: 0 },
          { label: "Activities", spent: "0", pct: 0 },
        ],
      },
      proposals: [],
      chats: [],
    };
    addTrip(trip);
  };

  return (
    <Shell title={t("createTrip.title")} onBack={back}>
      <div className="content">
        <div className="vstack">
          <div className="field">
            <label>{t("createTrip.destination")}</label>
            <input type="text" value={dest} onChange={(e) => setDest(e.target.value)} placeholder={t("createTrip.destPh")} />
          </div>
          <div className="od-grid" style={{ "--od-cols": 2, "--od-gap": "12px" } as CSSProperties}>
            <div className="field">
              <label>{t("createTrip.from")}</label>
              <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="field">
              <label>{t("createTrip.to")}</label>
              <input type="text" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label>{t("createTrip.howTravel")}</label>
            <div className="seg">
              <button className={`seg-btn${mode === "group" ? " active" : ""}`} onClick={() => setMode("group")}>
                <IconUsers size={14} /> {t("createTrip.groupBtn")}
              </button>
              <button className={`seg-btn${mode === "solo" ? " active" : ""}`} onClick={() => setMode("solo")}>
                <IconUser size={14} /> {t("createTrip.soloBtn")}
              </button>
            </div>
            <span className="field-help">
              {mode === "group"
                ? t("createTrip.groupHelp")
                : t("createTrip.soloHelp")}
            </span>
          </div>

          {mode === "group" && (
            <div className="field">
              <label>{t("createTrip.travellers")}</label>
              <div className="rail-inline">
                {memberOptions.map((m) => {
                  const sel = members.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      className={`chip${sel ? " active" : ""}`}
                      onClick={() => setMembers((prev) => (sel ? prev.filter((x) => x !== m.id) : [...prev, m.id]))}
                    >
                      {m.initials} {m.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="field">
            <label>{t("createTrip.budgetEstimate", { cur: currency })}</label>
            <input type="text" inputMode="numeric" value={budget} onChange={(e) => setBudget(e.target.value)} />
            {budget && Number(budget) > 0 && <Progress pct={100} />}
          </div>

          {error && <span className="field-error">{error}</span>}

          <div className="hstack" style={{ justifyContent: "space-between" }}>
            <button className="btn-ghost" onClick={back}>
              {t("common.cancel")}
            </button>
            <button className="btn btn-primary" onClick={save}>
              {t("createTrip.create")} <IconCheck size={16} />
            </button>
          </div>
        </div>
      </div>
    </Shell>
  );
}