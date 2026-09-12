"use client";

import { useEffect, useRef, type ComponentType, type ReactNode } from "react";
import type { Screen } from "./data";
import { AUTH_SCREENS, APP_TAB_SCREENS, GROUP_SCREENS } from "./data";
import { AppProvider, useApp, type TFunc } from "./store";
import { StatusBar, ApprovalGate, BottomNav, type NavTab } from "./ui";
import { LandingScreen, LoginScreen, OnboardingScreen, CalendarConnectScreen, TripsHomeScreen, CreateTripScreen, SettingsScreen } from "./screens/flow";
import { ProfileScreen } from "./screens/profile";
import { TripDashboardScreen, MapScreen, tripNav } from "./screens/trip";
import { SearchCompareScreen, AISuggestionsScreen } from "./screens/compare";
import { OptionDetailScreen, CheckoutScreen, AlertsDisruptionsScreen, ChangeHistoryScreen } from "./screens/book";
import { MembersPreferencesScreen, GroupChatScreen, ProposalsVotingScreen } from "./screens/group";
import { BudgetScreen, ExpenseSplitScreen, SettlementEngineScreen } from "./screens/money";
import { FriendsScreen } from "./screens/friends";
import { Companion } from "./screens/companion";
import { ExploreScreen } from "./screens/explore";
import { DealDetailScreen } from "./screens/deal";
import { OtaSearchScreen, OtaResultsScreen, OtaBookingScreen } from "./screens/ota";
import { IconHome, IconCompass, IconUser, type IconProps } from "./icons";

const APP_TABS: { key: "explore" | "trips-home" | "profile"; icon: (p: IconProps) => ReactNode }[] = [
  { key: "explore", icon: IconCompass },
  { key: "trips-home", icon: IconHome },
  { key: "profile", icon: IconUser },
];

function appTabs(t: TFunc): NavTab[] {
  return [
    { key: "explore", label: t("nav.explore"), icon: IconCompass },
    { key: "trips-home", label: t("nav.trips"), icon: IconHome },
    { key: "profile", label: t("nav.profile"), icon: IconUser },
  ];
}

const SCREENS: Record<Screen, ComponentType> = {
  landing: LandingScreen,
  login: LoginScreen,
  onboarding: OnboardingScreen,
  "calendar-connect": CalendarConnectScreen,
  explore: ExploreScreen,
  "trips-home": TripsHomeScreen,
  "create-trip": CreateTripScreen,
  "trip-dashboard": TripDashboardScreen,
  map: MapScreen,
  "search-compare": SearchCompareScreen,
  "aeris-suggestions": AISuggestionsScreen,
  "members-preferences": MembersPreferencesScreen,
  "group-chat": GroupChatScreen,
  "proposals-voting": ProposalsVotingScreen,
  budget: BudgetScreen,
  "expense-split": ExpenseSplitScreen,
  "settlement-engine": SettlementEngineScreen,
  "alerts-disruptions": AlertsDisruptionsScreen,
  "option-detail": OptionDetailScreen,
  checkout: CheckoutScreen,
  "change-history": ChangeHistoryScreen,
  "ota-search": OtaSearchScreen,
  "ota-results": OtaResultsScreen,
  "ota-booking": OtaBookingScreen,
  "deal-detail": DealDetailScreen,
  friends: FriendsScreen,
  settings: SettingsScreen,
  profile: ProfileScreen,
};

function Router() {
  const { route, mode } = useApp();
  const screen = route.screen;

  if (mode === "solo" && GROUP_SCREENS.includes(screen)) {
    // Rule 03: solo mode removes group mechanics entirely - never render them.
    return null;
  }

  const Component = SCREENS[screen] ?? LandingScreen;
  const remountKey =
    screen === "ota-booking"
      ? `ota-booking:${String(route.params?.vertical ?? "")}:${String(route.params?.offerId ?? "")}`
      : undefined;

  return (
    <div className="screen-host" data-screen={screen} key={remountKey}>
      <Component />
    </div>
  );
}

function ShellAndContent() {
  const { toast, userName, route, hydrated, mode, t } = useApp();
  const isAuthScreen = AUTH_SCREENS.includes(route.screen);
  const isAppTab = APP_TAB_SCREENS.includes(route.screen);
  const isTripTab =
    route.screen === "trip-dashboard" || route.screen === "map";
  const hideCompanion = route.screen === "group-chat";
  const hasCompanion = Boolean(userName) && !isAuthScreen && !hideCompanion;
  const contentRef = useRef<HTMLDivElement>(null);
  const navKey = `${route.screen}:${JSON.stringify(route.params ?? null) ?? ""}`;

  useEffect(() => {
    if (!hydrated) return;
    window.scrollTo(0, 0);
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [navKey, hydrated]);

  if (!hydrated) {
    return (
      <div className="phone-frame">
        <span className="hardware-button volume" aria-hidden="true" />
        <span className="hardware-button power" aria-hidden="true" />
        <div className="phone-screen">
          <StatusBar />
          <div className="phone-content" />
        </div>
      </div>
    );
  }

  return (
    <div className="phone-frame">
      <span className="hardware-button volume" aria-hidden="true" />
      <span className="hardware-button power" aria-hidden="true" />
<div className={`phone-screen${hasCompanion ? " has-companion" : ""}`}>
          <StatusBar />
          <div className="phone-content" ref={contentRef}>
            <Router />
          </div>
          {isAppTab && <BottomNav tabs={appTabs(t)} active={route.screen} />}
          {isTripTab && <BottomNav tabs={tripNav(mode, t)} active={route.screen} />}
          <ApprovalGate />
          {hasCompanion && <Companion />}
          {toast && (
            <div role="status" className="toast">
              {toast}
            </div>
          )}
        </div>
    </div>
  );
}

export default function Page() {
  return (
    <AppProvider>
      <ShellAndContent />
    </AppProvider>
  );
}