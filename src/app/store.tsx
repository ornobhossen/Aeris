"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Friend, GateState, OtaBooking, Screen, Trip, TripsMap } from "./data";
import { FRIENDS, FRIEND_REQUESTS, SEED_TRIPS, COUNTRY_CURRENCY, CURRENCY_SYMBOLS, DEFAULT_CURRENCY, moneySymbol, invalidLocale } from "./data";
import { translate, type LocaleCode } from "./i18n";

export interface Route<T = Record<string, unknown>> {
  screen: Screen;
  params?: T;
}

export interface NotifyPrefs {
  disruptions: boolean;
  votes: boolean;
  promotions: boolean;
}

export type Theme = "light" | "dark";

export interface OnboardingData {
  name: string;
  color: string;
  locale: string;
  country: string;
  notifyPrefs: NotifyPrefs;
}

interface AppValue {
  trips: TripsMap;
  tripId: string;
  trip: Trip;
  mode: "group" | "solo";
  route: Route;
  stack: Route[];
  canBack: boolean;
  go: (screen: Screen, params?: Record<string, unknown>) => void;
  replace: (screen: Screen, params?: Record<string, unknown>) => void;
  reset: (screen: Screen, params?: Record<string, unknown>) => void;
  back: () => void;
  toTrip: (id: string) => void;
  addTrip: (t: Trip) => void;
  patchTrip: (patch: Partial<Trip> | ((t: Trip) => Partial<Trip>)) => void;
  run: (fn: (t: Trip) => Trip) => void;
  gate: GateState | null;
  openGate: (g: GateState) => void;
  closeGate: () => void;
  toast: string | null;
  notify: (m: string) => void;
  notificationsOn: boolean;
  toggleNotifications: () => void;
  friends: Friend[];
  requests: Friend[];
  acceptFriend: (id: string) => void;
  dismissFriend: (id: string) => void;
  addFriend: (f: Friend) => void;
  companionOpen: boolean;
  openCompanion: () => void;
  closeCompanion: () => void;
  userName: string | null;
  setUserName: (name: string | null) => void;
  hydrated: boolean;
  otaBookings: OtaBooking[];
  addOtaBooking: (b: OtaBooking) => void;
  country: string;
  currency: string;
  currencySymbol: string;
  displayName: string | null;
  bio: string;
  setCountry: (c: string) => void;
  setCurrency: (code: string) => void;
  setDisplayName: (name: string | null) => void;
  setBio: (text: string) => void;
  logout: () => void;
  deleteAccount: () => void;
  avatarColor: string;
  setAvatarColor: (c: string) => void;
  locale: string;
  setLocale: (code: string) => void;
  notifyPrefs: NotifyPrefs;
  setNotifyPrefs: (p: NotifyPrefs) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  finishOnboarding: (data: OnboardingData) => Promise<void>;
  t: (key: string, vars?: Record<string, string | number>) => string;
  money: (amount: string | number) => string;
  fxStatus: "live" | "cached" | "offline";
  fxUpdatedAt: number | null;
}

export type FxStatus = AppValue["fxStatus"];
export type TFunc = AppValue["t"];

const Ctx = createContext<AppValue | null>(null);

export function useApp(): AppValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used inside AppProvider");
  return v;
}

function readStoredName(): string | null {
  try { return window.localStorage.getItem("aeris.user") || null; } catch { return null; }
}

const FX_REFRESH_MS = 15 * 60 * 1000;
const FX_STORAGE_KEY = "aeris.fx";

interface FxCache {
  ts: number;
  rates: Record<string, number>;
}

function readFxCache(): FxCache | null {
  try {
    const raw = window.localStorage.getItem(FX_STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<FxCache>;
    if (!p || typeof p.ts !== "number" || !p.rates || typeof p.rates !== "object") return null;
    return { ts: p.ts, rates: p.rates as Record<string, number> };
  } catch { return null; }
}

function writeFxCache(cache: FxCache): void {
  try { window.localStorage.setItem(FX_STORAGE_KEY, JSON.stringify(cache)); } catch { /* ignore storage errors */ }
}

function parseFxRates(payload: unknown): Record<string, number> | null {
  const rates = (payload as { rates?: unknown } | null)?.rates;
  if (!rates || typeof rates !== "object") return null;
  const out: Record<string, number> = {};
  for (const [code, raw] of Object.entries(rates)) {
    const n = Number(raw);
    if (Number.isFinite(n) && n > 0) out[code.toUpperCase()] = n;
  }
  return Object.keys(out).length ? out : null;
}

async function fetchJson(url: string, ms = 8000): Promise<unknown> {
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.json();
  } finally {
    window.clearTimeout(timer);
  }
}

async function fetchFxRates(): Promise<FxCache> {
  const primary = await fetchJson("https://open.er-api.com/v6/latest/EUR");
  const primaryRates = parseFxRates(primary);
  if (primaryRates) return { ts: Date.now(), rates: primaryRates };
  const fallback = await fetchJson("https://api.frankfurter.app/latest?from=EUR");
  const fallbackRates = parseFxRates(fallback);
  if (!fallbackRates) throw new Error("No FX rates available");
  return { ts: Date.now(), rates: fallbackRates };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<TripsMap>(SEED_TRIPS);
  const [stack, setStack] = useState<Route[]>([
    { screen: "landing", params: {} },
  ]);
  const [tripId, setTripId] = useState<string>("paris");
  const [gate, setGate] = useState<GateState | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [friends, setFriends] = useState<Friend[]>(FRIENDS);
  const [requests, setRequests] = useState<Friend[]>(FRIEND_REQUESTS);
  const [companionOpen, setCompanionOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [otaBookings, setOtaBookings] = useState<OtaBooking[]>([]);
  const [country, setCountryState] = useState("");
  const [currency, setCurrencyState] = useState<string>(DEFAULT_CURRENCY);
  const [displayName, setDisplayNameState] = useState<string | null>(null);
  const [bio, setBioState] = useState("");
  const [avatarColor, setAvatarColorState] = useState("#2563eb");
  const [locale, setLocaleState] = useState("en");
  const [notifyPrefs, setNotifyPrefsState] = useState<NotifyPrefs>({
    disruptions: true,
    votes: true,
    promotions: false,
  });
  const [theme, setThemeState] = useState<Theme>("light");
  const [fxRates, setFxRates] = useState<Record<string, number> | null>(null);
  const [fxStatus, setFxStatus] = useState<FxStatus>("offline");
  const [fxUpdatedAt, setFxUpdatedAt] = useState<number | null>(null);
  const fxRatesRef = useRef<Record<string, number> | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    const stored = readStoredName();
    if (stored) {
      setUserName(stored);
      setStack([{ screen: "explore", params: {} }]);
      let c = "";
      let cur = DEFAULT_CURRENCY;
      let dn: string | null = null;
      let bioText = "";
      let avatar = "#2563eb";
      let loc = "en";
      let prefs: NotifyPrefs = { disruptions: true, votes: true, promotions: false };
      let th: Theme = "light";
      try {
        const raw = window.localStorage.getItem("aeris.profile");
        if (raw) {
          const p = JSON.parse(raw) as {
            country?: string;
            currency?: string;
            displayName?: string | null;
            bio?: string;
            avatarColor?: string;
            locale?: string;
            notifyPrefs?: Partial<NotifyPrefs>;
            theme?: Theme;
          };
          if (p.country && COUNTRY_CURRENCY[p.country]) c = p.country;
          if (p.currency) cur = p.currency;
          dn = p.displayName ?? null;
          bioText = p.bio ?? "";
          if (p.avatarColor) avatar = p.avatarColor;
          if (p.locale && !invalidLocale(p.locale)) loc = p.locale;
          if (p.notifyPrefs) {
            prefs = {
              disruptions: p.notifyPrefs.disruptions ?? true,
              votes: p.notifyPrefs.votes ?? true,
              promotions: p.notifyPrefs.promotions ?? false,
            };
          }
          if (p.theme === "dark" || p.theme === "light") th = p.theme;
        }
      } catch {
        /* ignore malformed profile */
      }
      setCountryState(c);
      setCurrencyState(cur);
      setDisplayNameState(dn);
      setBioState(bioText);
      setAvatarColorState(avatar);
      setLocaleState(loc);
      setNotifyPrefsState(prefs);
      setThemeState(th);
    }
    setHydrated(true);
    mountedRef.current = true;
  }, []);

  useEffect(() => {
    if (!mountedRef.current) return;
    try {
      if (userName) window.localStorage.setItem("aeris.user", userName);
      else window.localStorage.removeItem("aeris.user");
    } catch { /* ignore storage errors */ }
  }, [userName]);

  useEffect(() => {
    if (!mountedRef.current) return;
    try {
      window.localStorage.setItem(
        "aeris.profile",
        JSON.stringify({ country, currency, displayName, bio, avatarColor, locale, notifyPrefs, theme })
      );
    } catch { /* ignore storage errors */ }
  }, [country, currency, displayName, bio, avatarColor, locale, notifyPrefs, theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    const cached = readFxCache();
    if (cached) {
      const fresh = Date.now() - cached.ts < FX_REFRESH_MS;
      fxRatesRef.current = cached.rates;
      setFxRates(cached.rates);
      setFxUpdatedAt(cached.ts);
      setFxStatus(fresh ? "live" : "cached");
    }

    const refresh = () => {
      fetchFxRates()
        .then((c) => {
          writeFxCache(c);
          fxRatesRef.current = c.rates;
          setFxRates(c.rates);
          setFxUpdatedAt(c.ts);
          setFxStatus("live");
        })
        .catch(() => {
          setFxStatus(fxRatesRef.current ? "cached" : "offline");
        });
    };
    refresh();
    const id = window.setInterval(refresh, FX_REFRESH_MS);
    return () => window.clearInterval(id);
  }, []);

  const route = stack[stack.length - 1];
  const trip = trips[tripId as keyof TripsMap] ?? trips.paris;
  const mode = trip.mode;
  const canBack = stack.length > 1;

  const go = useCallback((screen: Screen, params?: Record<string, unknown>) => {
    setStack((s) => [...s, { screen, params: params ?? {} }]);
  }, []);

  const replace = useCallback(
    (screen: Screen, params?: Record<string, unknown>) => {
      setStack((s) => [...s.slice(0, -1), { screen, params: params ?? {} }]);
    },
    []
  );

  const reset = useCallback(
    (screen: Screen, params?: Record<string, unknown>) => {
      setStack([{ screen, params: params ?? {} }]);
    },
    []
  );

  const back = useCallback(() => {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);

  const toTrip = useCallback((id: string) => {
    setTripId(id);
    setStack((s) => [...s, { screen: "trip-dashboard", params: {} }]);
  }, []);

  const addTrip = useCallback((t: Trip) => {
    setTrips((prev) => ({ ...prev, [t.id]: t }));
    setTripId(t.id);
    setStack((s) => [...s.slice(0, -1), { screen: "trip-dashboard", params: { fresh: true } }]);
  }, []);

  const run = useCallback(
    (fn: (t: Trip) => Trip) => {
      setTrips((prev) => {
        const key = tripId as keyof TripsMap;
        const cur = prev[key];
        if (!cur) return prev;
        return { ...prev, [key]: fn(cur) };
      });
    },
    [tripId]
  );

  const patchTrip = useCallback(
    (patch: Partial<Trip> | ((t: Trip) => Partial<Trip>)) => {
      setTrips((prev) => {
        const key = tripId as keyof TripsMap;
        const cur = prev[key];
        if (!cur) return prev;
        const p = typeof patch === "function" ? patch(cur) : patch;
        return { ...prev, [key]: { ...cur, ...p } };
      });
    },
    [tripId]
  );

  const openGate = useCallback((g: GateState) => setGate(g), []);
  const closeGate = useCallback(() => setGate(null), []);

  const notify = useCallback((m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 2600);
  }, []);

  const toggleNotifications = useCallback(() => {
    setNotificationsOn((v) => !v);
    notify(notificationsOn ? "Notifications off" : "Notifications on");
  }, [notificationsOn, notify]);

  const acceptFriend = useCallback(
    (id: string) => {
      const f = requests.find((r) => r.id === id);
      if (!f) return;
      setRequests((prev) => prev.filter((r) => r.id !== id));
      setFriends((prev) =>
        prev.some((x) => x.id === f.id) ? prev : [...prev, { ...f, blurb: f.via }]
      );
    },
    [requests]
  );

  const dismissFriend = useCallback((id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const addFriend = useCallback((f: Friend) => {
    setFriends((prev) =>
      prev.some((x) => x.id === f.id)
        ? prev
        : [...prev, { ...f, status: "idle", via: undefined, mutual: undefined }]
    );
  }, []);

  const openCompanion = useCallback(() => setCompanionOpen(true), []);
  const closeCompanion = useCallback(() => setCompanionOpen(false), []);

  const addOtaBooking = useCallback((b: OtaBooking) => {
    setOtaBookings((prev) => [b, ...prev]);
  }, []);

  const setCountry = useCallback((c: string) => {
    setCountryState(c);
    const cc = COUNTRY_CURRENCY[c];
    if (cc) setCurrencyState(cc.code);
  }, []);

  const setCurrency = useCallback((code: string) => {
    if (CURRENCY_SYMBOLS[code] || code === DEFAULT_CURRENCY) setCurrencyState(code);
  }, []);

  const setDisplayName = useCallback((name: string | null) => setDisplayNameState(name), []);
  const setBio = useCallback((text: string) => setBioState(text), []);
  const setAvatarColor = useCallback((c: string) => setAvatarColorState(c), []);
  const setLocale = useCallback((code: string) => {
    if (!invalidLocale(code)) setLocaleState(code);
  }, []);
  const setNotifyPrefs = useCallback((p: NotifyPrefs) => setNotifyPrefsState(p), []);
  const setTheme = useCallback((t: Theme) => setThemeState(t), []);

  const finishOnboarding = useCallback(async (data: OnboardingData) => {
    const profile = {
      country: data.country,
      currency: COUNTRY_CURRENCY[data.country]?.code ?? DEFAULT_CURRENCY,
      displayName: data.name,
      bio: "",
      avatarColor: data.color,
      locale: data.locale,
      notifyPrefs: data.notifyPrefs,
      theme: "light" as Theme,
    };
    await new Promise<void>((resolve) => window.setTimeout(resolve, 450));
    try {
      window.localStorage.setItem("aeris.user", data.name);
      window.localStorage.setItem("aeris.profile", JSON.stringify(profile));
    } catch { /* ignore storage errors */ }
    setUserName(data.name);
    setCountryState(data.country);
    setCurrencyState(profile.currency);
    setDisplayNameState(data.name);
    setBioState("");
    setAvatarColorState(data.color);
    setLocaleState(data.locale);
    setNotifyPrefsState(data.notifyPrefs);
    setStack([{ screen: "explore", params: {} }]);
  }, []);

  const logout = useCallback(() => {
    setUserName(null);
    setCountryState("");
    setCurrencyState(DEFAULT_CURRENCY);
    setDisplayNameState(null);
    setBioState("");
    setAvatarColorState("#2563eb");
    setLocaleState("en");
    setNotifyPrefsState({ disruptions: true, votes: true, promotions: false });
    setThemeState("light");
    setStack([{ screen: "landing", params: {} }]);
  }, []);

  const deleteAccount = useCallback(() => {
    setUserName(null);
    setCountryState("");
    setCurrencyState(DEFAULT_CURRENCY);
    setDisplayNameState(null);
    setBioState("");
    setAvatarColorState("#2563eb");
    setLocaleState("en");
    setNotifyPrefsState({ disruptions: true, votes: true, promotions: false });
    setThemeState("light");
    try {
      window.localStorage.removeItem("aeris.user");
      window.localStorage.removeItem("aeris.profile");
    } catch { /* ignore storage errors */ }
    setStack([{ screen: "landing", params: {} }]);
  }, []);

  const currencySymbol = moneySymbol(currency);
  const localeKey: LocaleCode = invalidLocale(locale) ? "en" : (locale as LocaleCode);
  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => translate(localeKey, key, vars),
    [localeKey]
  );
  const money = useCallback(
    (amount: string | number) => {
      const n = Number(amount);
      if (!Number.isFinite(n)) return `${currencySymbol}${amount}`;
      const r = fxRates?.[currency] ?? null;
      const v = r != null && currency !== DEFAULT_CURRENCY ? n * r : n;
      return `${currencySymbol}${Math.round(v)}`;
    },
    [currency, fxRates, currencySymbol]
  );

  const value = useMemo<AppValue>(
    () => ({
      trips,
      tripId,
      trip,
      mode,
      route,
      stack,
      canBack,
      go,
      replace,
      reset,
      back,
      toTrip,
      addTrip,
      patchTrip,
      run,
      gate,
      openGate,
      closeGate,
      toast,
      notify,
      notificationsOn,
      toggleNotifications,
      friends,
      requests,
      acceptFriend,
      dismissFriend,
      addFriend,
      companionOpen,
      openCompanion,
      closeCompanion,
      userName,
      setUserName,
      hydrated,
      otaBookings,
      addOtaBooking,
      country,
      currency,
      currencySymbol,
      displayName,
      bio,
      setCountry,
      setCurrency,
      setDisplayName,
      setBio,
      logout,
      deleteAccount,
      avatarColor,
      setAvatarColor,
      locale,
      setLocale,
      notifyPrefs,
      setNotifyPrefs,
      theme,
      setTheme,
      finishOnboarding,
      t,
      money,
      fxStatus,
      fxUpdatedAt,
    }),
    [trips, tripId, trip, mode, route, stack, canBack, go, replace, reset, back, toTrip, addTrip, patchTrip, run, gate, openGate, closeGate, toast, notify, notificationsOn, toggleNotifications, friends, requests, acceptFriend, dismissFriend, addFriend, companionOpen, openCompanion, closeCompanion, userName, setUserName, hydrated, otaBookings, addOtaBooking, country, currency, currencySymbol, displayName, bio, setCountry, setCurrency, setDisplayName, setBio, logout, deleteAccount, avatarColor, setAvatarColor, locale, setLocale, notifyPrefs, setNotifyPrefs, theme, setTheme, finishOnboarding, t, money, fxStatus, fxUpdatedAt]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}