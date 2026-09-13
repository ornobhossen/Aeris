import type { IconKey } from "./icons";

export type Mode = "group" | "solo";

export type Screen =
  | "landing"
  | "login"
  | "onboarding"
  | "calendar-connect"
  | "explore"
  | "trips-home"
  | "profile"
  | "create-trip"
  | "trip-dashboard"
  | "map"
  | "search-compare"
  | "aeris-suggestions"
  | "members-preferences"
  | "group-chat"
  | "proposals-voting"
  | "budget"
  | "expense-split"
  | "settlement-engine"
  | "alerts-disruptions"
  | "option-detail"
  | "checkout"
  | "change-history"
  | "ota-search"
  | "ota-results"
  | "ota-booking"
  | "deal-detail"
  | "friends"
  | "settings";

export const GROUP_SCREENS: Screen[] = [
  "members-preferences",
  "group-chat",
  "proposals-voting",
  "expense-split",
  "settlement-engine",
];

export const AUTH_SCREENS: Screen[] = [
  "landing",
  "login",
  "onboarding",
  "calendar-connect",
];

export const APP_TAB_SCREENS: Screen[] = ["explore", "trips-home", "profile"];

export interface Traveller {
  id: string;
  name: string;
  initials: string;
  color: string;
  role?: "organiser" | "member";
  you?: boolean;
  submitted?: boolean;
}

export interface PlanItem {
  id: string;
  time: string;
  title: string;
  desc?: string;
  actId: string;
  source: "booked" | "manual" | "ai" | "member";
  aiRule?: string;
  alert?: boolean;
}

export interface DayPlan {
  day: string;
  date: string;
  items: PlanItem[];
}

export interface Option {
  id: string;
  actId: "flight" | "stay" | "food" | "activity" | "transfer" | "guide";
  title: string;
  subtitle: string;
  desc: string;
  photo?: string;
  photoRatio?: string;
  price: string;
  priceNote?: string;
  rating?: number;
  reviews?: number;
  tags: string[];
  track: "manual" | "ai";
  reason?: string;
  conditions?: string[];
}

export interface Expense {
  id: string;
  name: string;
  icon: IconKey;
  paidBy: string;
  date: string;
  baseAmount: string;
  originalAmount?: string;
  originalCurrency?: string;
  rate: string;
  rateSource: "live" | "cached";
  split: "equal" | "percent" | "custom";
}

export interface SettlementMove {
  from: string;
  fromColor: string;
  to: string;
  toColor: string;
  amount: string;
}

export interface AlertItem {
  id: string;
  kind: "delay" | "cancel" | "status" | "info" | "ok";
  title: string;
  desc: string;
  time: string;
  status?: string;
  alternatives?: Option[];
  resolved?: boolean;
}

export interface HistoryEntry {
  id: string;
  kind: "booked" | "ai" | "gate" | "warn" | "vote" | "system";
  text: string;
  who: string;
  time: string;
  approvedBy?: string;
}

export interface Proposal {
  id: string;
  title: string;
  desc: string;
  options: { id: string; label: string; note: string; price: string }[];
  votesIn: number;
  votesNeeded: number;
  deadline: string;
  tallyShown: boolean;
  organiser: string;
  myVote?: string | null;
  extended?: boolean;
  resolved?: boolean;
}

export interface ChatMsg {
  id: string;
  from: "you" | "member" | "ai" | "system";
  author?: string;
  color?: string;
  text: string;
  time: string;
  intent?: { label: string; action: string }[];
}

export interface BudgetCategory {
  label: string;
  spent: string;
  pct: number;
  cap?: string;
  near?: boolean;
}

export interface Budget {
  total: string;
  remaining: string;
  remainingPct: number;
  categories: BudgetCategory[];
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  dates: string;
  mode: Mode;
  tagline: string;
  photo: string;
  photoRatio: string;
  travellers: Traveller[];
  itinerary: DayPlan[];
  options: Option[];
  expenses: Expense[];
  settlement: SettlementMove[];
  naiveSettlementCount: number;
  alerts: AlertItem[];
  history: HistoryEntry[];
  budget: Budget;
  proposals: Proposal[];
  chats: ChatMsg[];
}

export interface DiffRow {
  label: string;
  old: string;
  mine: string;
  delta?: string;
}

export interface GateState {
  id: string;
  title: string;
  sub: string;
  kind: "money" | "schedule" | "change" | "ai";
  diffs: DiffRow[];
  conditions: string[];
  travellers: string[];
  budgetNote?: string;
  approveLabel: string;
  onApprove: () => void;
}

export type TravellerMap = Record<string, Traveller>;

export const YOU_COLOR = "#2563eb";

const you: Traveller = {
  id: "you",
  name: "You",
  initials: "Y",
  color: YOU_COLOR,
  role: "organiser",
  you: true,
  submitted: true,
};
const ana: Traveller = {
  id: "ana",
  name: "Ana",
  initials: "A",
  color: "#0d9488",
  submitted: true,
};
const marco: Traveller = {
  id: "marco",
  name: "Marco",
  initials: "M",
  color: "#7c3aed",
  submitted: true,
};
const zara: Traveller = {
  id: "zara",
  name: "Zara",
  initials: "Z",
  color: "#d97706",
  submitted: false,
};

export const SOLO_TRAVELLERS: Traveller[] = [{ ...you }];

export interface Friend {
  id: string;
  name: string;
  initials: string;
  color: string;
  status?: "on-trip" | "planning" | "idle";
  tripName?: string;
  via?: string;
  mutual?: number;
  blurb?: string;
}

export const FRIENDS: Friend[] = [
  {
    id: "ana",
    name: "Ana",
    initials: "A",
    color: "#0d9488",
    status: "on-trip",
    tripName: "Paris Weekend",
    blurb: "In your Paris Weekend trip",
  },
  {
    id: "marco",
    name: "Marco",
    initials: "M",
    color: "#7c3aed",
    status: "on-trip",
    tripName: "Paris Weekend",
    blurb: "In your Paris Weekend trip",
  },
  {
    id: "leo",
    name: "Leo",
    initials: "L",
    color: "#0891b2",
    status: "planning",
    tripName: "Portugal Coast · Oct",
    blurb: "Backpacking the coast next month",
  },
  {
    id: "sofia",
    name: "Sofia",
    initials: "S",
    color: "#db2777",
    status: "idle",
    blurb: "Always up for a food trip",
  },
];

export const FRIEND_REQUESTS: Friend[] = [
  {
    id: "jules",
    name: "Jules",
    initials: "J",
    color: "#4f46e5",
    via: "Invite code AERIS-7Q2M",
    mutual: 3,
  },
  {
    id: "nick",
    name: "Nick",
    initials: "N",
    color: "#16a34a",
    via: "nick@tripmail.com",
    mutual: 1,
  },
];

export const FIND_FRIENDS: Friend[] = [
  {
    id: "rina",
    name: "Rina",
    initials: "R",
    color: "#9333ea",
    via: "In your contacts",
    mutual: 5,
  },
  {
    id: "otto",
    name: "Otto",
    initials: "O",
    color: "#ea580c",
    via: "Shared Lisbon with Ana",
    mutual: 2,
  },
  {
    id: "tomas",
    name: "Tomas",
    initials: "T",
    color: "#059669",
    via: "Travels with Leo",
    mutual: 1,
  },
];

export const PARIS_TRIP: Trip = {
  id: "paris",
  name: "Paris Weekend",
  destination: "Paris, France",
  dates: "Fri 25 Sep - Sun 27 Sep",
  mode: "group",
  tagline: "4 mates, one long weekend",
  photo: "/images/louvre.jpg",
  photoRatio: "1280/1096",
  travellers: [you, ana, marco, zara],
  itinerary: [
    {
      day: "Day 1",
      date: "Fri 25 Sep",
      items: [
        {
          id: "p1",
          time: "09:40",
          title: "Flight 1208 - outbound",
          desc: "Direct, 1h45. Seat selection done for 4.",
          actId: "flight",
          source: "booked",
        },
        {
          id: "p2",
          time: "13:00",
          title: "Check in - Hotel Sevigne",
          desc: "Latin Quarter, 2 twin rooms.",
          actId: "stay",
          source: "booked",
        },
        {
          id: "p3",
          time: "14:30",
          title: "Walking tour, Latin Quarter",
          desc: "2h guided, 12 stops.",
          actId: "activity",
          source: "manual",
        },
        {
          id: "p4",
          time: "19:00",
          title: "Dinner - Le Comptoir",
          desc: "AI-suggested after 3 intents in chat. Awaiting approval.",
          actId: "food",
          source: "ai",
          aiRule: "Waiting for approval - 2 of 4 approved",
        },
      ],
    },
    {
      day: "Day 2",
      date: "Sat 26 Sep",
      items: [
        {
          id: "p5",
          time: "09:00",
          title: "Louvre, skip-the-line slot",
          desc: "Voting on 09:00 vs 11:00 entry.",
          actId: "activity",
          source: "manual",
        },
        {
          id: "p6",
          time: "13:00",
          title: "Lunch, Le Marais",
          desc: "Casual - falafel crawl.",
          actId: "food",
          source: "member",
        },
        {
          id: "p7",
          time: "15:00",
          title: "Musee d'Orsay",
          desc: "Booked for 4, included in Budget.",
          actId: "activity",
          source: "booked",
        },
      ],
    },
    {
      day: "Day 3",
      date: "Sun 27 Sep",
      items: [
        {
          id: "p8",
          time: "10:00",
          title: "Montmartre + Sacre-Coeur",
          desc: "Free morning, optional climb.",
          actId: "activity",
          source: "member",
        },
        {
          id: "p9",
          time: "15:05",
          title: "Flight 1208 - return",
          desc: "Direct, gate C21 at CDG.",
          actId: "flight",
          source: "booked",
        },
      ],
    },
  ],
  options: [
    {
      id: "o-fl-m",
      actId: "flight",
      title: "EasyJet U2 8845",
      subtitle: "Sat 26 Sep - 06:45 from CDG",
      desc: "Direct 1h35. Early start, cheaper. 5kg cabin bag.",
      price: "96",
      priceNote: "/person",
      rating: 7.9,
      reviews: 2311,
      tags: ["Direct", "06:45", "Cabin bag only"],
      photo: "/images/plane-a320.jpg",
      photoRatio: "3/2",
      track: "manual",
      conditions: [
        "No free name change",
        "Cabin bag only (5kg)",
        "Non-refundable",
      ],
    },
    {
      id: "o-fl-ai",
      actId: "flight",
      title: "Air France AF 1644",
      subtitle: "Sat 26 Sep - 08:30 from CDG",
      desc: "Direct 1h40. 23kg bag, seat included. Top AI pick after your 'departure after 08:00' intent.",
      price: "142",
      priceNote: "/person",
      rating: 8.4,
      reviews: 1204,
      tags: ["Direct", "08:30", "23kg bag", "AI pick"],
      photo: "/images/plane-a350.jpg",
      photoRatio: "3/2",
      track: "ai",
      reason: "Best fit for the 4 group intents (departure after 08:00, no more than 1 stop).",
      conditions: [
        "Free name change until check-in",
        "23kg checked bag",
        "Full refund with fee after approval",
      ],
    },
    {
      id: "o-fl-m2",
      actId: "flight",
      title: "Vueling VY 6831",
      subtitle: "Sat 26 Sep - 11:20 from CDG",
      desc: "Direct 1h55. Later start, carries the sleeping-in crew.",
      price: "104",
      priceNote: "/person",
      rating: 7.6,
      reviews: 1618,
      tags: ["Direct", "11:20", "Check-in bag extra"],
      photo: "/images/plane-vueling.jpg",
      photoRatio: "3/2",
      track: "manual",
      conditions: ["Check-in bag extra 46", "Non-refundable"],
    },
    {
      id: "o-st-m",
      actId: "stay",
      title: "Hotel Sevigne",
      subtitle: "Latin Quarter - 2 bedrooms",
      desc: "Already booked. Quiet street near the Pantheon. Add 3rd night?",
      price: "214",
      priceNote: "/night",
      rating: 8.1,
      reviews: 892,
      tags: ["2 twin rooms", "Walk to metro"],
      photo: "/images/hotel-paris.jpg",
      photoRatio: "3/2",
      track: "manual",
      conditions: ["Free cancellation to 14 Sep", "Breakfast 14/pp"],
    },
    {
      id: "o-st-ai",
      actId: "stay",
      title: "Hotel Lumiere",
      subtitle: "Saint-Germain - family room",
      desc: "AI pick on the 'downtown' intent. One family room for 4 saves 32/night.",
      price: "198",
      priceNote: "/night",
      rating: 8.6,
      reviews: 1520,
      tags: ["Saint-Germain", "Family room", "AI pick"],
      track: "ai",
      reason: "Matches 'downtown' + 'under 220/night' intents from the group chat.",
      photo: "/images/hotel-boutique.jpg",
      photoRatio: "3/2",
      conditions: ["Free cancellation to 20 Sep", "Breakfast included"],
    },
    {
      id: "o-st-m2",
      actId: "stay",
      title: "Le Petit Marais",
      subtitle: "Le Marais - 2 apartments",
      desc: "Found manually. Two studios next door, kitchen access.",
      price: "186",
      priceNote: "/night",
      rating: 7.8,
      reviews: 648,
      tags: ["2 studios", "Kitchen", "Self check-in"],
      track: "manual",
      photo: "/images/paris.jpg",
      photoRatio: "1280/2029",
      conditions: ["Free cancellation to 18 Sep", "No breakfast"],
    },
    {
      id: "o-du-ai",
      actId: "activity",
      title: "Seine cruise, 20:30",
      subtitle: "Replacement for cancelled 18:00 boat",
      desc: "After Zara lands at 19:50, the 20:30 cruise suits everyone.",
      price: "88",
      priceNote: "/4 people",
      rating: 8.2,
      reviews: 3452,
      tags: ["20:30", "Replacement", "AI pick"],
      photo: "/images/seine-cruise.jpg",
      photoRatio: "3/2",
      track: "ai",
      reason: "Every vote on the 18:00 slot is blocked by Zara's arrival - 20:30 clears all schedules.",
      conditions: ["Free cancellation until 19:00", "Boarding at Pont Neuf"],
    },
    {
      id: "o-tr-m",
      actId: "transfer",
      title: "Weekend rental - A2 automatic",
      subtitle: "Sat 10:00 pickup, Latin Quarter garage",
      desc: "Found manually. A small hatchback two blocks from the hotel - handy for the Loire day everyone keeps mentioning.",
      price: "76",
      priceNote: "/day",
      rating: 7.4,
      reviews: 3281,
      tags: ["Automatic", "Car seats", "Glass roof"],
      photo: "/images/car-compact.jpg",
      photoRatio: "3/2",
      track: "manual",
      conditions: ["Driver 23+", "Fuel not included", "Free cancellation to 20 Sep"],
    },
    {
      id: "o-tr-ai",
      actId: "transfer",
      title: "Airport transfer - private minivan",
      subtitle: "CDG to Latin Quarter, door to door",
      desc: "Aeris pick after Ana's 'no dragging suitcases through the metro' note. One minivan carries all 4 of you plus luggage.",
      price: "5",
      priceNote: "/person",
      rating: 8.7,
      reviews: 412,
      tags: ["Door to door", "Luggage x4", "AI pick"],
      photo: "/images/car-minivan.jpg",
      photoRatio: "3/2",
      track: "ai",
      reason: "Matches the luggage + late-arrival intents from the group chat; splits evenly across 4.",
      conditions: ["Meet at arrivals", "Free cancellation to check-in"],
    },
    {
      id: "o-gu-ai",
      actId: "guide",
      title: "Private Louvre guide - 2h",
      subtitle: "Skip-the-line, 09:00 slot",
      desc: "Aeris pick that slots in front of your 09:00 Louvre visit. Small group, headsets, English-speaking expert.",
      price: "48",
      priceNote: "/person",
      rating: 9.1,
      reviews: 1804,
      photo: "/images/louvre.jpg",
      photoRatio: "1280/1096",
      tags: ["EN/FR/ES", "Max 8", "Skip-the-line", "AI pick"],
      track: "ai",
      reason: "Fits the group budget and pairs with the 09:00 Louvre slot already on the itinerary.",
      conditions: ["No-show policy", "Free cancellation to 24h before"],
    },
    {
      id: "o-gu-m",
      actId: "guide",
      title: "Montmartre walking guide - 3h",
      subtitle: "Sunday morning, 12 stops",
      desc: "Found manually. A local who grew up on the hill - meets you at the metro exit and knows the quiet courtyards.",
      price: "22",
      priceNote: "/person",
      rating: 8.9,
      reviews: 731,
      photo: "/images/paris.jpg",
      photoRatio: "1280/2029",
      tags: ["EN", "3h walk", "12 stops"],
      track: "manual",
      conditions: ["Weather dependent", "Cash or card on the day"],
    },
  ],
  expenses: [
    {
      id: "e1",
      name: "Flights - 1208 outbound x4",
      icon: "plane",
      paidBy: "you",
      date: "12 Sep",
      baseAmount: "472",
      originalAmount: "472",
      originalCurrency: "EUR",
      rate: "1.0000",
      rateSource: "live",
      split: "equal",
    },
    {
      id: "e2",
      name: "Hotel Sevigne - 2 nights",
      icon: "stay",
      paidBy: "ana",
      date: "13 Sep",
      baseAmount: "428",
      originalAmount: "428",
      originalCurrency: "EUR",
      rate: "1.0000",
      rateSource: "live",
      split: "equal",
    },
    {
      id: "e3",
      name: "Orsay tickets x4",
      icon: "ticket",
      paidBy: "you",
      date: "15 Sep",
      baseAmount: "64",
      originalAmount: "64",
      originalCurrency: "EUR",
      rate: "1.0000",
      rateSource: "live",
      split: "custom",
    },
    {
      id: "e4",
      name: "Dinner Passy", 
      icon: "food",
      paidBy: "zara",
      date: "17 Sep",
      baseAmount: "118",
      originalAmount: "124",
      originalCurrency: "USD",
      rate: "0.952",
      rateSource: "cached",
      split: "equal",
    },
    {
      id: "e5",
      name: "Group taxi CDG",
      icon: "transfer",
      paidBy: "ana",
      date: "18 Sep",
      baseAmount: "42",
      originalAmount: "42",
      originalCurrency: "EUR",
      rate: "1.0000",
      rateSource: "live",
      split: "equal",
    },
    {
      id: "e6",
      name: "Louvre fast-track x4",
      icon: "ticket",
      paidBy: "marco",
      date: "19 Sep",
      baseAmount: "76",
      originalAmount: "76",
      originalCurrency: "EUR",
      rate: "1.0000",
      rateSource: "live",
      split: "percent",
    },
  ],
  settlement: [
    {
      from: "marco",
      fromColor: "#7c3aed",
      to: "you",
      toColor: YOU_COLOR,
      amount: "158",
    },
    {
      from: "zara",
      fromColor: "#d97706",
      to: "ana",
      toColor: "#0d9488",
      amount: "148",
    },
    {
      from: "zara",
      fromColor: "#d97706",
      to: "you",
      toColor: YOU_COLOR,
      amount: "56",
    },
  ],
  naiveSettlementCount: 6,
  alerts: [
    {
      id: "a1",
      kind: "delay",
      title: "AF 1644 delayed 45 min",
      desc: "Your AI-picked return now departs 09:15. Estimated arrival 11:00. 3 alternatives ranked against your 148 remaining budget.",
      time: "2h ago",
      status: "Delayed 45 min",
      alternatives: [
        {
          id: "al1",
          actId: "flight",
          title: "EasyJet U2 8845 (06:45)",
          subtitle: "Earliest seat, +86 over remaining budget",
          desc: "Still within the group budget window.",
          price: "182",
          priceNote: "/person round trip",
          track: "manual",
          tags: ["+86 vs remaining"],
        },
        {
          id: "al2",
          actId: "flight",
          title: "Vueling VY 6831 (11:20)",
          subtitle: "Later but fits remaining budget",
          desc: "Saves 6 vs the delayed AF flight.",
          price: "104",
          priceNote: "/person",
          track: "manual",
          tags: ["Fits remaining budget"],
        },
        {
          id: "al3",
          actId: "flight",
          title: "Keep AF 1644 (now 09:15)",
          subtitle: "No rebooking - accept the delay",
          desc: "Lowest risk, no new approval needed.",
          price: "0",
          priceNote: "no change",
          track: "ai",
          tags: ["Accept delay"],
        },
      ],
    },
    {
      id: "a2",
      kind: "status",
      title: "Flight 9h40 - status unavailable",
      desc: "We can't reach the airline right now. We'd rather tell you we don't know than claim it's on time. This card refreshes automatically, and we re-check before any claim.",
      time: "1h ago",
      status: "Status unavailable",
    },
    {
      id: "a3",
      kind: "cancel",
      title: "18:00 Seine cruise cancelled",
      desc: "Operator cancelled. Aeris rebooked the 20:30 sailing for the 4 of you - pending approval.",
      time: "3h ago",
      status: "Rebooked 20:30 - waiting for approval",
      resolved: true,
      alternatives: [
        {
          id: "al4",
          actId: "activity",
          title: "Seine cruise 20:30",
          subtitle: "Recommended replacement",
          desc: "Clears Zara's 19:50 arrival and the dinner slot.",
          price: "88",
          priceNote: "/4 people",
          track: "ai",
          tags: ["20:30"],
        },
      ],
    },
    {
      id: "a4",
      kind: "info",
      title: "Quiet - 15 minute debounce",
      desc: "Two airport updates arrived within 10 minutes. Aeris merged them so you get one useful alert instead of spam. Disruptions never fire louder than once per 15 minutes.",
      time: "4h ago",
    },
  ],
  history: [
    {
      id: "h1",
      kind: "booked",
      text: "Flight 1208 (outbound) booked for 4 people",
      who: "You resolved the vote, 2-2 tie",
      time: "Sat, 25 Sep - 10:12",
      approvedBy: "You",
    },
    {
      id: "h2",
      kind: "gate",
      text: "Hotel Lumière chosen - Saint-Germain, 198/night",
      who: "Vote outcome applied by you as organiser",
      time: "Sat, 25 Sep - 10:20",
      approvedBy: "You",
    },
    {
      id: "h3",
      kind: "ai",
      text: "Aeris suggested dinner at Le Comptoir",
      who: "Matched 3 chat intents",
      time: "Sat, 25 Sep - 11:02",
      approvedBy: "You + Ana",
    },
    {
      id: "h4",
      kind: "warn",
      text: "18:00 cruise cancelled - rebooked to 20:30",
      who: "Airline notified, approval gate passed",
      time: "Sat, 25 Sep - 11:40",
      approvedBy: "You",
    },
    {
      id: "h5",
      kind: "vote",
      text: "Louvre entry settled for 09:00",
      who: "All 4 members voted",
      time: "Sat, 25 Sep - 12:05",
    },
    {
      id: "h6",
      kind: "system",
      text: "Budget alert: Activities -20 over cap. 3 alternatives ranked.",
      who: "Aeris system",
      time: "Sat, 25 Sep - 12:31",
    },
  ],
  budget: {
    total: "1,240",
    remaining: "148",
    remainingPct: 12,
    categories: [
      { label: "Flights", spent: "472", pct: 91, cap: "520", near: true },
      { label: "Stay", spent: "428", pct: 97, cap: "440", near: true },
      { label: "Food", spent: "164", pct: 82, cap: "200" },
      { label: "Activities", spent: "120", pct: 120, cap: "100" },
    ],
  },
  proposals: [
    {
      id: "pr1",
      title: "Where the group sleeps",
      desc: "Two options reached the final vote. Tally is hidden until the deadline.",
      options: [
        {
          id: "pr1a",
          label: "Hotel Lumiere",
          note: "Saint-Germain. One family room. Breakfast incl.",
          price: "198/night",
        },
        {
          id: "pr1b",
          label: "Le Petit Marais",
          note: "Two studios. Kitchen. Self check-in.",
          price: "186/night",
        },
      ],
      votesIn: 3,
      votesNeeded: 4,
      deadline: "Sat 26 Sep, 18:00",
      tallyShown: false,
      organiser: "you",
      myVote: "pr1a",
      extended: false,
    },
    {
      id: "pr2",
      title: "Louvre entry slot",
      desc: "Same tickets, two opening slots.",
      options: [
        {
          id: "pr2a",
          label: "09:00 skip-the-line",
          note: "Early start, shortest queue.",
          price: "incl.",
        },
        {
          id: "pr2b",
          label: "11:00 relaxed start",
          note: "Sleep in, queue still ok.",
          price: "incl.",
        },
      ],
      votesIn: 3,
      votesNeeded: 4,
      deadline: "Sat 26 Sep, 18:00",
      tallyShown: false,
      organiser: "you",
      myVote: "pr2a",
      extended: true,
    },
  ],
  chats: [
    {
      id: "c1",
      from: "you",
      text: "Flight options look good - who's on for the weekend?",
      time: "09:02",
    },
    {
      id: "c2",
      from: "member",
      author: "Ana",
      color: "#0d9488",
      text: "Count me in. Hotel needs to be under 220 a night.",
      time: "09:11",
      intent: [{ label: "Hotel <= 220/night", action: "Match AI search" }],
    },
    {
      id: "c3",
      from: "member",
      author: "Marco",
      color: "#7c3aed",
      text: "I'm in. Downtown would be convenient for the metro.",
      time: "09:14",
      intent: [{ label: "Downtown preferred", action: "Match AI search" }],
    },
    {
      id: "c4",
      from: "you",
      text: "Does an 08:30 departure work for everyone?",
      time: "09:20",
      intent: [{ label: "Departure after 08:00", action: "Match AI search" }],
    },
    {
      id: "c5",
      from: "member",
      author: "Zara",
      color: "#d97706",
      text: "I land in Paris at 19:50 - so I can't do the 19:00 group dinner.",
      time: "10:41",
      intent: [{ label: "Dinner after 20:30", action: "Check overlap" }],
    },
    {
      id: "c6",
      from: "system",
      text: "Schedule overlap: Zara's arrival blocks the 19:00 dinner slot for 1 traveller. 2 later slots are free.",
      time: "10:41",
    },
    {
      id: "c7",
      from: "ai",
      text: "Hi, I'm Aeris. I listen for travel intents here but I never change the trip silently - anything I suggest still goes through the approval gate. A dinner after 20:30 clears everyone's schedule. Want me to search?",
      time: "10:42",
      intent: [
        { label: "Search dinner options", action: "open" },
        { label: "Just watching", action: "none" },
      ],
    },
    {
      id: "c8",
      from: "member",
      author: "Zara",
      color: "#d97706",
      text: "Actually the 18:00 cruise doesn't work for me either. I'll decline.",
      time: "10:55",
    },
    {
      id: "c9",
      from: "ai",
      text: "Proposal rejected by Zara. The 3 who voted yes see a private alternative that fits their slot - everyone else's plan stays exactly as approved.",
      time: "10:56",
    },
  ],
};

export const BALI_TRIP: Trip = {
  id: "bali",
  name: "Bali Retreat",
  destination: "Ubud, Bali",
  dates: "Mon 12 Oct - Sun 18 Oct",
  mode: "solo",
  tagline: "One person, zero negotiations",
  photo: "/images/bali.jpg",
  photoRatio: "1280/853",
  travellers: SOLO_TRAVELLERS,
  itinerary: [
    {
      day: "Day 1",
      date: "Mon 12 Oct",
      items: [
        {
          id: "b1",
          time: "08:15",
          title: "Flight 9H40 - outbound",
          desc: "Direct, checked in.",
          actId: "flight",
          source: "booked",
        },
        {
          id: "b2",
          time: "14:00",
          title: "Check in - Villa Tulip",
          desc: "Private villa, pool, Ubud edge.",
          actId: "stay",
          source: "booked",
        },
        {
          id: "b3",
          time: "17:30",
          title: "Sunset at Campuhan Ridge",
          desc: "Free, 20 min walk.",
          actId: "activity",
          source: "ai",
        },
      ],
    },
    {
      day: "Day 2",
      date: "Tue 13 Oct",
      items: [
        {
          id: "b4",
          time: "07:30",
          title: "Scooter rental pickup",
          desc: "Held for the week, 390k IDR total.",
          actId: "transfer",
          source: "booked",
        },
        {
          id: "b5",
          time: "09:00",
          title: "Tegalalang rice terraces",
          desc: "Morning light, least busy.",
          actId: "activity",
          source: "manual",
        },
      ],
    },
    {
      day: "Day 3",
      date: "Wed 14 Oct",
      items: [
        {
          id: "b6",
          time: "11:00",
          title: "Tirta Empul purification",
          desc: "Sarong rental at gate.",
          actId: "activity",
          source: "ai",
          aiRule: "AI-strategy: empty 30 min before noon",
        },
      ],
    },
  ],
  options: [
    {
      id: "b-tr-ai",
      actId: "transfer",
      title: "Airport pickup - private car",
      subtitle: "DPS to Ubud, 80 min door to door",
      desc: "Aeris pick for arrival day: driver waits with your name, AC on and cold water in the car.",
      price: "12",
      priceNote: "/trip",
      rating: 9.0,
      reviews: 2287,
      tags: ["Door to door", "Meet & greet", "AI pick"],
      photo: "/images/car-clio.jpg",
      photoRatio: "3/2",
      track: "ai",
      reason: "Your flight lands 14:00 - skips the public-shuttle queue on arrival day.",
      conditions: ["Free cancellation to 12h before"],
    },
    {
      id: "b-gu-m",
      actId: "guide",
      title: "Rice terrace guide - morning",
      subtitle: "Tegalalang, 09:00 until 12:30",
      desc: "A local guide who knows the farmers' paths behind the main viewpoint, found via the pool-guy's tip.",
      price: "35",
      priceNote: "/person",
      rating: 8.8,
      reviews: 964,
      tags: ["EN", "Photography spots", "Driver incl."],
      photo: "/images/bali-rice.jpg",
      photoRatio: "3/2",
      track: "manual",
      conditions: ["Sarong provided", "Cash on the day"],
    },
  ],
  expenses: [
    {
      id: "be1",
      name: "Villa Tulip - 6 nights",
      icon: "stay",
      paidBy: "you",
      date: "20 Sep",
      baseAmount: "498",
      originalAmount: "540",
      originalCurrency: "USD",
      rate: "0.922",
      rateSource: "live",
      split: "equal",
    },
    {
      id: "be2",
      name: "Scooter rental - 6 days",
      icon: "transfer",
      paidBy: "you",
      date: "21 Sep",
      baseAmount: "23",
      originalAmount: "390000",
      originalCurrency: "IDR",
      rate: "0.0000589",
      rateSource: "cached",
      split: "equal",
    },
    {
      id: "be3",
      name: "Flight 9H40 return",
      icon: "plane",
      paidBy: "you",
      date: "22 Sep",
      baseAmount: "76",
      originalAmount: "76",
      originalCurrency: "EUR",
      rate: "1.0000",
      rateSource: "live",
      split: "equal",
    },
  ],
  settlement: [],
  naiveSettlementCount: 0,
  alerts: [
    {
      id: "ba1",
      kind: "status",
      title: "Flight 9H40 - status unavailable",
      desc: "We can't confirm the gate yet. Rather than guessing 'on time', we show status unavailable and keep re-checking.",
      time: "30 min ago",
      status: "Status unavailable",
    },
    {
      id: "ba2",
      kind: "info",
      title: "Villa pool cleaned Mon 09:00",
      desc: "Cleaning overlaps your first pool session. No schedule impact - just FYI.",
      time: "2h ago",
    },
  ],
  history: [
    {
      id: "bh1",
      kind: "booked",
      text: "Villa Tulip confirmed - 6 nights",
      who: "You",
      time: "Sun, 20 Sep - 18:22",
      approvedBy: "You",
    },
    {
      id: "bh2",
      kind: "ai",
      text: "Aeris suggested Tirta Empul on Wed (quietest window)",
      who: "Matched 'want to avoid crowds'",
      time: "Mon, 21 Sep - 09:10",
      approvedBy: "You",
    },
    {
      id: "bh3",
      kind: "gate",
      text: "Scooter rental added to expenses",
      who: "You",
      time: "Tue, 22 Sep - 07:05",
    },
  ],
  budget: {
    total: "900",
    remaining: "302",
    remainingPct: 34,
    categories: [
      { label: "Flights", spent: "152", pct: 76, cap: "200" },
      { label: "Stay", spent: "498", pct: 100, cap: "500", near: true },
      { label: "Mobility", spent: "23", pct: 16, cap: "140" },
      { label: "Activities", spent: "27", pct: 15, cap: "180" },
    ],
  },
  proposals: [],
  chats: [],
};

export type TripsMap = Record<string, Trip>;

export const SEED_TRIPS: TripsMap = {
  paris: PARIS_TRIP,
  bali: BALI_TRIP,
};

export function travellerOf(trip: Trip, id: string): Traveller {
  return (
    trip.travellers.find((t) => t.id === id) ?? {
      id,
      name: id,
      initials: id.slice(0, 1).toUpperCase(),
      color: "#9aa0a6",
    }
  );
}

/* ───────────────────────────── OTA (Online Travel Agency) ───────────────────────────── */

export type Vertical = "flights" | "hotels" | "cars" | "attractions";

export interface OtaOffer {
  id: string;
  vertical: Vertical;
  provider: string;
  title: string;
  subtitle: string;
  price: string;
  priceNote?: string;
  rating: number;
  reviews: number;
  tags: string[];
  photo?: string;
  photoRatio?: string;
  planePhoto?: string;
  description: string;
  conditions: string[];
  meta: Record<string, string>;
}

export interface OtaBooking {
  id: string;
  ref: string;
  vertical: Vertical;
  title: string;
  provider: string;
  price: string;
  priceNote?: string;
  meta: Record<string, string>;
  time: string;
}

export const VERTICAL_META: Record<
  Vertical,
  { label: string; verb: string; icon: IconKey; accent: string }
> = {
  flights: { label: "Flights", verb: "Search flights", icon: "plane", accent: "#2563eb" },
  hotels: { label: "Hotels", verb: "Find stays", icon: "stay", accent: "#0d9488" },
  cars: { label: "Cars", verb: "Rent or ride", icon: "car", accent: "#d97706" },
  attractions: { label: "Attractions", verb: "Book tickets", icon: "ticket", accent: "#7c3aed" },
};

export const OTA_OFFERS: OtaOffer[] = [
  /* ── Flights (London → Paris, per person) ── */
  {
    id: "of-ez",
    vertical: "flights",
    provider: "EasyJet",
    title: "EasyJet U2 8845",
    subtitle: "Non-stop · London to Paris CDG",
    price: "79",
    priceNote: "/person",
    rating: 7.9,
    reviews: 2311,
    tags: ["Non-stop", "06:45", "Cabin bag only"],
    photo: "/images/plane-a320.jpg",
    photoRatio: "3/2",
    description: "The early bird. 06:45 wheels-up gets you into CDG before nine - clears the whole day for exploring.",
    conditions: ["No free name change", "Cabin bag only (5kg)", "Non-refundable"],
    meta: { dep: "06:45", arr: "09:05", duration: "1h 20m", stops: "Non-stop", baggage: "Cabin bag only" },
  },
  {
    id: "of-af",
    vertical: "flights",
    provider: "Air France",
    title: "Air France AF 1680",
    subtitle: "Non-stop · London to Paris CDG",
    price: "129",
    priceNote: "/person",
    rating: 8.3,
    reviews: 3420,
    tags: ["Non-stop", "08:30", "23kg bag"],
    photo: "/images/plane-a350.jpg",
    photoRatio: "3/2",
    description: "The comfortable standard. A relaxed 08:30 departure with a real meal, seat selection and a 23kg checked bag.",
    conditions: ["Free name change until check-in", "23kg checked bag", "Full refund with fee"],
    meta: { dep: "08:30", arr: "09:55", duration: "1h 25m", stops: "Non-stop", baggage: "23kg checked" },
  },
  {
    id: "of-ba",
    vertical: "flights",
    provider: "British Airways",
    title: "British Airways BA 332",
    subtitle: "Non-stop · London to Paris CDG",
    price: "119",
    priceNote: "/person",
    rating: 8.1,
    reviews: 2911,
    tags: ["Non-stop", "10:15", "Free seats"],
    photo: "/images/plane-ba.jpg",
    photoRatio: "3/2",
    description: "Club Europe standard on a short hop. Comfortable 10:15 departure, advance seat pick at no cost.",
    conditions: ["Change fee applies", "23kg checked bag", "Free seat selection"],
    meta: { dep: "10:15", arr: "11:35", duration: "1h 20m", stops: "Non-stop", baggage: "23kg checked" },
  },
  {
    id: "of-fr",
    vertical: "flights",
    provider: "Ryanair",
    title: "Ryanair FR 5401",
    subtitle: "Non-stop · London to Paris Beauvais",
    price: "39",
    priceNote: "/person",
    rating: 7.1,
    reviews: 4122,
    tags: ["Non-stop", "16:40", "Best price"],
    photo: "/images/plane-737.jpg",
    photoRatio: "3/2",
    description: "The budget pick. Note the airport: Beauvais sits 85km north of Paris - add the shuttle bus (~EUR 17).",
    conditions: ["Strict 24h online check-in", "No bag included", "Non-refundable"],
    meta: { dep: "16:40", arr: "18:05", duration: "1h 25m", stops: "Non-stop", baggage: "Cabin bag only" },
  },
  {
    id: "of-vy",
    vertical: "flights",
    provider: "Vueling",
    title: "Vueling VY 6831",
    subtitle: "1 stop · London to Paris CDG",
    price: "114",
    priceNote: "/person",
    rating: 7.6,
    reviews: 1618,
    tags: ["1 stop", "12:20", "Good timing"],
    photo: "/images/plane-vueling.jpg",
    photoRatio: "3/2",
    description: "One stop via Lyon with a short 45-minute connection - mid-afternoon arrival keeps morning plans free.",
    conditions: ["Check-in bag extra", "Change fee applies"],
    meta: { dep: "12:20", arr: "16:55", duration: "3h 35m", stops: "1 stop · Lyon", baggage: "Cabin bag only" },
  },
  {
    id: "of-cj",
    vertical: "flights",
    provider: "CityJet",
    title: "CityJet 1-stop premium",
    subtitle: "1 stop · London to Paris Orly",
    price: "147",
    priceNote: "/person",
    rating: 8.0,
    reviews: 702,
    tags: ["1 stop", "07:00", "2 bags"],
    photo: "/images/plane-737.jpg",
    photoRatio: "3/2",
    description: "Flies into Orly - handiest for the Latin Quarter - with a second checked bag thrown in and lounge access at LHR.",
    conditions: ["Fully refundable to 24h before", "2 bags included", "Priority boarding"],
    meta: { dep: "07:00", arr: "10:40", duration: "3h 40m", stops: "1 stop · Bordeaux", baggage: "2 bags" },
  },

  /* ── Hotels (Paris) ── */
  {
    id: "oh-lumiere",
    vertical: "hotels",
    provider: "Booking",
    title: "Hotel Lumiere",
    subtitle: "Saint-Germain · 4★",
    price: "198",
    priceNote: "/night",
    rating: 8.6,
    reviews: 1520,
    tags: ["4.2 km to Louvre", "Breakfast included", "Free cancellation"],
    photo: "/images/hotel-boutique.jpg",
    photoRatio: "3/2",
    description: "Warm family-run spot on a quiet Saint-Germain street. Est. walk to the Louvre: 18 min; metro Rennes is two blocks.",
    conditions: ["Free cancellation to 20 Sep", "Breakfast included", "No pets"],
    meta: { location: "Saint-Germain", room: "Family room", rating: "4★", amenities: "Breakfast · Wifi · A/C", cancellation: "Free to 20 Sep" },
  },
  {
    id: "oh-marais",
    vertical: "hotels",
    provider: "Booking",
    title: "Le Petit Marais",
    subtitle: "Le Marais · two studios",
    price: "186",
    priceNote: "/night",
    rating: 7.8,
    reviews: 648,
    tags: ["Kitchen", "Self check-in", "Walk to falafels"],
    photo: "/images/paris.jpg",
    photoRatio: "1280/2029",
    description: "Two adjacent studios with a shared kitchen nook. You book both and get the whole floor - great for a group split.",
    conditions: ["Free cancellation to 18 Sep", "No breakfast", "Deposit required"],
    meta: { location: "Le Marais", room: "2 studios", rating: "3★ +", amenities: "Kitchen · Wifi", cancellation: "Free to 18 Sep" },
  },
  {
    id: "oh-sevigne",
    vertical: "hotels",
    provider: "Booking",
    title: "Hotel Sevigne",
    subtitle: "Latin Quarter · 3★",
    price: "214",
    priceNote: "/night",
    rating: 8.1,
    reviews: 892,
    tags: ["2 twin rooms", "Walk to metro", "Quiet street"],
    photo: "/images/hotel-paris.jpg",
    photoRatio: "3/2",
    description: "Your existing pick on the Paris weekend. On a quiet street near the Pantheon, twin rooms for two nights.",
    conditions: ["Free cancellation to 14 Sep", "Breakfast 14/pp", "Parking 28/night"],
    meta: { location: "Latin Quarter", room: "2 twin rooms", rating: "3★", amenities: "Wifi · A/C", cancellation: "Free to 14 Sep" },
  },
  {
    id: "oh-vernet",
    vertical: "hotels",
    provider: "Hyatt",
    title: "Maison Vernet",
    subtitle: "Latin Quarter · 5★",
    price: "320",
    priceNote: "/night",
    rating: 8.9,
    reviews: 1103,
    tags: ["Rooftop bar", "Spa", "Splash out"],
    photo: "/images/hotel-modern.jpg",
    photoRatio: "3/2",
    description: "Upgrade mode. A boutique 5★ with a rooftop bar over the rooftops - every room faces the Seine or the Pantheon.",
    conditions: ["Non-refundable after 22 Sep", "Breakfast 24/pp", "Late check-out on request"],
    meta: { location: "Latin Quarter", room: "Superior double", rating: "5★", amenities: "Rooftop · Spa", cancellation: "Free to 22 Sep" },
  },
  {
    id: "oh-cdg",
    vertical: "hotels",
    provider: "Accor",
    title: "Ibis Paris CDG",
    subtitle: "Roissy · 2★ (airport)",
    price: "89",
    priceNote: "/night",
    rating: 7.4,
    reviews: 2301,
    tags: ["Airport shuttle", "Late arrival", "Budget"],
    photo: "/images/hotel-airport.jpg",
    photoRatio: "3/2",
    description: "Practical pick for a night-before or layover - 24h shuttle loop from CDG T1, and a 06:00 breakfast window for early flights.",
    conditions: ["Shuttle 6/pp each way", "Free cancellation to 21:00", "Soundproofed rooms"],
    meta: { location: "CDG airport", room: "Double", rating: "2★", amenities: "Shuttle · 24h desk", cancellation: "Free to 21:00" },
  },
  {
    id: "oh-mama",
    vertical: "hotels",
    provider: "Design Hotels",
    title: "Mama Shelter",
    subtitle: "East Paris · 3★",
    price: "142",
    priceNote: "/night",
    rating: 8.2,
    reviews: 1265,
    tags: ["Rooftop", "Fun vibe", "Metro 5 min"],
    photo: "/images/hotel-modern.jpg",
    photoRatio: "3/2",
    description: "The young crowd favourite - rooftop terrace with a view over the 20th, bold rooms, and the metro five minutes down the road.",
    conditions: ["Free cancellation to 19 Sep", "Breakfast 16/pp", "Min. 2 nights in Oct"],
    meta: { location: "Gambetta", room: "Queen", rating: "3★", amenities: "Rooftop · Bar", cancellation: "Free to 19 Sep" },
  },

  /* ── Cars (rental + ride-hailing) ── */
  {
    id: "oc-avalon",
    vertical: "cars",
    provider: "Avalon Rent a Car",
    title: "Compact auto · A2",
    subtitle: "CDG pickup · Sat 10:00",
    price: "52",
    priceNote: "/day",
    rating: 7.6,
    reviews: 3281,
    tags: ["Automatic", "5 seats", "Full insurance"],
    photo: "/images/car-compact.jpg",
    photoRatio: "3/2",
    description: "Small five-seat automatic, collected from the CDG counter and dropped at the Latin Quarter garage on Sunday.",
    conditions: ["Driver 23+", "Fuel not included", "Free cancellation to 20 Sep"],
    meta: { type: "Compact · Automatic", seats: "5", pickup: "CDG arrivals, Sat 10:00", dropoff: "Latin Quarter, Sun 19:00", fuel: "Full-to-full" },
  },
  {
    id: "oc-hertz",
    vertical: "cars",
    provider: "Hertz",
    title: "Renault Clio · manual",
    subtitle: "Gare du Nord pickup",
    price: "61",
    priceNote: "/day",
    rating: 8.0,
    reviews: 2104,
    tags: ["Manual", "5 seats", "Extra driver free"],
    photo: "/images/car-clio.jpg",
    photoRatio: "3/2",
    description: "A familiar Clio from the Gare du Nord desk. Second driver free with the same insurance cover.",
    conditions: ["Extra driver included", "Fuel not included", "Free cancellation to 18 Sep"],
    meta: { type: "Medium · Manual", seats: "5", pickup: "Gare du Nord, Sat 14:00", dropoff: "Any desk, Sun 20:00", fuel: "Full-to-full" },
  },
  {
    id: "oc-ent",
    vertical: "cars",
    provider: "Enterprise",
    title: "VW Golf · automatic estate",
    subtitle: "CDG pickup · one-way welcome",
    price: "66",
    priceNote: "/day",
    rating: 8.1,
    reviews: 1765,
    tags: ["Automatic", "Big boot", "One-way ok"],
    photo: "/images/car-golf.jpg",
    photoRatio: "3/2",
    description: "An estate with a proper boot for four suitcases. One-way rental welcomed if you fly home from a different airport.",
    conditions: ["One-way fee waived Apr-Oct", "Driver 25+", "Free cancellation"],
    meta: { type: "Estate · Automatic", seats: "5", pickup: "CDG T2, Sat 08:30", dropoff: "Anywhere in France", fuel: "Full-to-full" },
  },
  {
    id: "oc-uber",
    vertical: "cars",
    provider: "Uber",
    title: "Uber XL · airport pickup",
    subtitle: "CDG → Latin Quarter · door to door",
    price: "58",
    priceNote: "/ride",
    rating: 8.9,
    reviews: 4520,
    tags: ["Ride-hailing", "Door to door", "4 + luggage"],
    photo: "/images/car-minivan.jpg",
    photoRatio: "3/2",
    description: "Grab a private XL when you land - rides are matched live, no booking number needed. Shown via the Uber link in the app.",
    conditions: ["Live price match at pickup", "Free cancellation till driver arrives", "Max 4 + luggage"],
    meta: { type: "Minivan ride", seats: "4 + luggage", pickup: "CDG arrivals, on demand", dropoff: "Latin Quarter", provider: "Uber, live" },
  },
  {
    id: "oc-bolt",
    vertical: "cars",
    provider: "Bolt",
    title: "Bolt · city ride",
    subtitle: "Around town · instant",
    price: "12",
    priceNote: "/typical ride",
    rating: 8.4,
    reviews: 3180,
    tags: ["Ride-hailing", "Cash or card", "Instant"],
    photo: "/images/car-taxi.jpg",
    photoRatio: "3/2",
    description: "For getting around town without booking ahead. Typical cross-city ride from the Latin Quarter to Montmartre.",
    conditions: ["Dynamic pricing at peak", "No cancellation fee", "Link in-app"],
    meta: { type: "Sedan ride", seats: "4", pickup: "Anywhere, instant", dropoff: "Anywhere", provider: "Bolt, live" },
  },
  {
    id: "oc-avis",
    vertical: "cars",
    provider: "Avis",
    title: "Avis campervan · D1",
    subtitle: "Weekend away",
    price: "99",
    priceNote: "/day",
    rating: 7.9,
    reviews: 861,
    tags: ["Sleeps 4", "Auto", "Kitchenette"],
    photo: "/images/car-camper.jpg",
    photoRatio: "3/2",
    description: "For the Loire detour everyone keeps floating - a self-drive camper that sleeps four with a proper little kitchenette.",
    conditions: ["Camper certification required", "Km included 300/day", "Free cancellation to 5 days"],
    meta: { type: "Camper · Automatic", seats: "4 + 4 beds", pickup: "CDG, Sat 09:00", dropoff: "CDG, Mon 18:00", fuel: "Full-to-full" },
  },

  /* ── Attractions ── */
  {
    id: "oa-louvre",
    vertical: "attractions",
    provider: "Tiqets",
    title: "Louvre · skip-the-line",
    subtitle: "Pride of the collection",
    price: "48",
    priceNote: "/person",
    rating: 9.0,
    reviews: 3820,
    tags: ["Skip-the-line", "Timed entry", "Incl. Mona Lisa"],
    photo: "/images/louvre.jpg",
    photoRatio: "1280/1096",
    description: "Timed-entry skip-the-line ticket through the pyramid. Entry windows quarter-hour, audio guide optional at the gate.",
    conditions: ["Free cancellation to 24h before", "No-show policy", "Timed entry required"],
    meta: { duration: "3h+", slot: "09:00 or 13:00", category: "Museum", skipTheLine: "Yes" },
  },
  {
    id: "oa-disney",
    vertical: "attractions",
    provider: "Disneyland Paris",
    title: "Disneyland Park · 1-day",
    subtitle: "Marne-la-Vallee",
    price: "87",
    priceNote: "/person",
    rating: 8.7,
    reviews: 6210,
    tags: ["Park hopper", "FastPass incl.", "RER A direct"],
    photo: "/images/disney-castle.jpg",
    photoRatio: "3/2",
    description: "One-day park ticket on the RER A line from Paris centre. FastPass included on the day's top rides.",
    conditions: ["Park hopper upgrade at gate", "Non-refundable", "Dates are fixed"],
    meta: { duration: "Full day", slot: "Open 9:30", category: "Theme park", skipTheLine: "FastPass incl." },
  },
  {
    id: "oa-seine",
    vertical: "attractions",
    provider: "Vedettes",
    title: "Seine cruise · 20:30",
    subtitle: "Pont Neuf boarding",
    price: "22",
    priceNote: "/person",
    rating: 8.2,
    reviews: 3452,
    tags: ["1h 15m", "Evening", "Glass roof"],
    photo: "/images/seine-cruise.jpg",
    photoRatio: "3/2",
    description: "Evening glass-roofed cruise past the lit-up monuments. The 20:30 sailing keeps the 19:00-20:00 dinner slot free.",
    conditions: ["Free cancellation to 19:00", "Boarding at Pont Neuf", "Open deck"],
    meta: { duration: "1h 15m", slot: "20:30", category: "River cruise", skipTheLine: "n/a" },
  },
  {
    id: "oa-orsay",
    vertical: "attractions",
    provider: "Tiqets",
    title: "Musee d'Orsay",
    subtitle: "Impressionists",
    price: "16",
    priceNote: "/person",
    rating: 8.8,
    reviews: 4110,
    tags: ["Timed entry", "Tue closed", "13 min walk"],
    photo: "/images/orsay.jpg",
    photoRatio: "1280/1707",
    description: "Timed entry for the Impressionist floors - the station clock cafe is the pause spot halfway round.",
    conditions: ["Free cancellation to 24h", "Closed Tuesdays", "Audioguide 5"],
    meta: { duration: "2h", slot: "10:00 or 14:00", category: "Museum", skipTheLine: "Timed entry" },
  },
  {
    id: "oa-garnier",
    vertical: "attractions",
    provider: "Palais Garnier",
    title: "Opera Garnier · backstage tour",
    subtitle: "The Phantom's house",
    price: "19",
    priceNote: "/person",
    rating: 8.5,
    reviews: 1980,
    tags: ["Behind the curtain", "45 min", "EN guide"],
    photo: "/images/opera-garnier.jpg",
    photoRatio: "3/2",
    description: "A behind-the-scenes look at the foyers, the grand staircase and the spot under the chandelier the Phantom called home.",
    conditions: ["Guide in EN", "No big bags", "45 min walkthrough"],
    meta: { duration: "45 min", slot: "13:30", category: "Tour", skipTheLine: "n/a" },
  },
{
      id: "oa-eiffel",
      vertical: "attractions",
      provider: "Paris Tickets",
      title: "Eiffel Tower · summit climb",
      subtitle: "West pillar, timed",
      price: "34",
      priceNote: "/person",
      rating: 8.4,
      reviews: 5330,
      tags: ["Summit access", "Lift line +30", "Night ok"],
      photo: "/images/eiffel.jpg",
      photoRatio: "3/2",
      description: "Timed west-pillar ticket climbing to the summit. Go at 19:00 for the golden-hour view across the city.",
      conditions: ["Non-refundable", "Security check at base", "Summit closes 22:45"],
      meta: { duration: "1h 30m", slot: "14:00 or 19:00", category: "Landmark", skipTheLine: "Priority lift" },
    },
];

/* ───────────────────────────── Country → currency ───────────────────────────── */

export const COUNTRY_CURRENCY: Record<string, { code: string; symbol: string }> = {
  Afghanistan: { code: "AFN", symbol: "؋" },
  Albania: { code: "ALL", symbol: "L" },
  Algeria: { code: "DZD", symbol: "دج" },
  Andorra: { code: "EUR", symbol: "€" },
  Angola: { code: "AOA", symbol: "Kz" },
  "Antigua and Barbuda": { code: "XCD", symbol: "EC$" },
  Argentina: { code: "ARS", symbol: "$" },
  Armenia: { code: "AMD", symbol: "֏" },
  Australia: { code: "AUD", symbol: "$" },
  Austria: { code: "EUR", symbol: "€" },
  Azerbaijan: { code: "AZN", symbol: "₼" },
  Bahamas: { code: "BSD", symbol: "B$" },
  Bahrain: { code: "BHD", symbol: "BD" },
  Bangladesh: { code: "BDT", symbol: "৳" },
  Barbados: { code: "BBD", symbol: "Bds$" },
  Belarus: { code: "BYN", symbol: "Br" },
  Belgium: { code: "EUR", symbol: "€" },
  Belize: { code: "BZD", symbol: "BZ$" },
  Benin: { code: "XOF", symbol: "FCFA" },
  Bhutan: { code: "BTN", symbol: "Nu" },
  Bolivia: { code: "BOB", symbol: "Bs" },
  "Bosnia and Herzegovina": { code: "BAM", symbol: "KM" },
  Botswana: { code: "BWP", symbol: "P" },
  Brazil: { code: "BRL", symbol: "R$" },
  Brunei: { code: "BND", symbol: "B$" },
  Bulgaria: { code: "BGN", symbol: "лв" },
  "Burkina Faso": { code: "XOF", symbol: "FCFA" },
  Burundi: { code: "BIF", symbol: "Fr" },
  Cambodia: { code: "KHR", symbol: "៛" },
  Cameroon: { code: "XAF", symbol: "FCFA" },
  Canada: { code: "CAD", symbol: "$" },
  "Cape Verde": { code: "CVE", symbol: "$" },
  "Central African Republic": { code: "XAF", symbol: "FCFA" },
  Chad: { code: "XAF", symbol: "FCFA" },
  Chile: { code: "CLP", symbol: "$" },
  China: { code: "CNY", symbol: "¥" },
  Colombia: { code: "COP", symbol: "$" },
  Comoros: { code: "KMF", symbol: "CF" },
  "Costa Rica": { code: "CRC", symbol: "₡" },
  "Côte d'Ivoire": { code: "XOF", symbol: "FCFA" },
  Croatia: { code: "EUR", symbol: "€" },
  Cuba: { code: "CUP", symbol: "$" },
  Cyprus: { code: "EUR", symbol: "€" },
  Czechia: { code: "CZK", symbol: "Kč" },
  "Democratic Republic of the Congo": { code: "CDF", symbol: "FC" },
  Denmark: { code: "DKK", symbol: "kr" },
  Djibouti: { code: "DJF", symbol: "Fdj" },
  Dominica: { code: "XCD", symbol: "EC$" },
  "Dominican Republic": { code: "DOP", symbol: "RD$" },
  Ecuador: { code: "USD", symbol: "$" },
  Egypt: { code: "EGP", symbol: "E£" },
  "El Salvador": { code: "USD", symbol: "$" },
  "Equatorial Guinea": { code: "XAF", symbol: "FCFA" },
  Eritrea: { code: "ERN", symbol: "Nfk" },
  Estonia: { code: "EUR", symbol: "€" },
  Eswatini: { code: "SZL", symbol: "E" },
  Ethiopia: { code: "ETB", symbol: "Br" },
  Fiji: { code: "FJD", symbol: "FJ$" },
  Finland: { code: "EUR", symbol: "€" },
  France: { code: "EUR", symbol: "€" },
  Gabon: { code: "XAF", symbol: "FCFA" },
  Gambia: { code: "GMD", symbol: "D" },
  Georgia: { code: "GEL", symbol: "₾" },
  Germany: { code: "EUR", symbol: "€" },
  Ghana: { code: "GHS", symbol: "₵" },
  Greece: { code: "EUR", symbol: "€" },
  Grenada: { code: "XCD", symbol: "EC$" },
  Guatemala: { code: "GTQ", symbol: "Q" },
  Guinea: { code: "GNF", symbol: "Fr" },
  "Guinea-Bissau": { code: "XOF", symbol: "FCFA" },
  Guyana: { code: "GYD", symbol: "G$" },
  Haiti: { code: "HTG", symbol: "G" },
  Honduras: { code: "HNL", symbol: "L" },
  Hungary: { code: "HUF", symbol: "Ft" },
  Iceland: { code: "ISK", symbol: "kr" },
  India: { code: "INR", symbol: "₹" },
  Indonesia: { code: "IDR", symbol: "Rp" },
  Iran: { code: "IRR", symbol: "﷼" },
  Iraq: { code: "IQD", symbol: "ع.د" },
  Ireland: { code: "EUR", symbol: "€" },
  Israel: { code: "ILS", symbol: "₪" },
  Italy: { code: "EUR", symbol: "€" },
  Jamaica: { code: "JMD", symbol: "J$" },
  Japan: { code: "JPY", symbol: "¥" },
  Jordan: { code: "JOD", symbol: "JD" },
  Kazakhstan: { code: "KZT", symbol: "₸" },
  Kenya: { code: "KES", symbol: "KSh" },
  Kiribati: { code: "AUD", symbol: "$" },
  Kosovo: { code: "EUR", symbol: "€" },
  Kuwait: { code: "KWD", symbol: "KD" },
  Kyrgyzstan: { code: "KGS", symbol: "сом" },
  Laos: { code: "LAK", symbol: "₭" },
  Latvia: { code: "EUR", symbol: "€" },
  Lebanon: { code: "LBP", symbol: "LBP" },
  Lesotho: { code: "LSL", symbol: "L" },
  Liberia: { code: "LRD", symbol: "L$" },
  Libya: { code: "LYD", symbol: "LD" },
  Liechtenstein: { code: "CHF", symbol: "CHF" },
  Lithuania: { code: "EUR", symbol: "€" },
  Luxembourg: { code: "EUR", symbol: "€" },
  Madagascar: { code: "MGA", symbol: "Ar" },
  Malawi: { code: "MWK", symbol: "MK" },
  Malaysia: { code: "MYR", symbol: "RM" },
  Maldives: { code: "MVR", symbol: "Rf" },
  Mali: { code: "XOF", symbol: "FCFA" },
  Malta: { code: "EUR", symbol: "€" },
  "Marshall Islands": { code: "USD", symbol: "$" },
  Mauritania: { code: "MRU", symbol: "UM" },
  Mauritius: { code: "MUR", symbol: "₨" },
  Mexico: { code: "MXN", symbol: "$" },
  Micronesia: { code: "USD", symbol: "$" },
  Moldova: { code: "MDL", symbol: "L" },
  Monaco: { code: "EUR", symbol: "€" },
  Mongolia: { code: "MNT", symbol: "₮" },
  Montenegro: { code: "EUR", symbol: "€" },
  Morocco: { code: "MAD", symbol: "د.م" },
  Mozambique: { code: "MZN", symbol: "MT" },
  Myanmar: { code: "MMK", symbol: "K" },
  Namibia: { code: "NAD", symbol: "N$" },
  Nauru: { code: "AUD", symbol: "$" },
  Nepal: { code: "NPR", symbol: "₨" },
  Netherlands: { code: "EUR", symbol: "€" },
  "New Zealand": { code: "NZD", symbol: "$" },
  Nicaragua: { code: "NIO", symbol: "C$" },
  Niger: { code: "XOF", symbol: "FCFA" },
  Nigeria: { code: "NGN", symbol: "₦" },
  "North Korea": { code: "KPW", symbol: "₩" },
  "North Macedonia": { code: "MKD", symbol: "ден" },
  Norway: { code: "NOK", symbol: "kr" },
  Oman: { code: "OMR", symbol: "ر.ع" },
  Pakistan: { code: "PKR", symbol: "₨" },
  Palau: { code: "USD", symbol: "$" },
  Palestine: { code: "ILS", symbol: "₪" },
  Panama: { code: "PAB", symbol: "B/." },
  "Papua New Guinea": { code: "PGK", symbol: "K" },
  Paraguay: { code: "PYG", symbol: "₲" },
  Peru: { code: "PEN", symbol: "S/" },
  Philippines: { code: "PHP", symbol: "₱" },
  Poland: { code: "PLN", symbol: "zł" },
  Portugal: { code: "EUR", symbol: "€" },
  Qatar: { code: "QAR", symbol: "QR" },
  "Republic of the Congo": { code: "XAF", symbol: "FCFA" },
  Romania: { code: "RON", symbol: "lei" },
  Russia: { code: "RUB", symbol: "₽" },
  Rwanda: { code: "RWF", symbol: "FRw" },
  "Saint Kitts and Nevis": { code: "XCD", symbol: "EC$" },
  "Saint Lucia": { code: "XCD", symbol: "EC$" },
  "Saint Vincent and the Grenadines": { code: "XCD", symbol: "EC$" },
  Samoa: { code: "WST", symbol: "T" },
  "San Marino": { code: "EUR", symbol: "€" },
  "São Tomé and Príncipe": { code: "STN", symbol: "Db" },
  "Saudi Arabia": { code: "SAR", symbol: "ر.س" },
  Senegal: { code: "XOF", symbol: "FCFA" },
  Serbia: { code: "RSD", symbol: "дин" },
  Seychelles: { code: "SCR", symbol: "₨" },
  "Sierra Leone": { code: "SLE", symbol: "Le" },
  Singapore: { code: "SGD", symbol: "S$" },
  Slovakia: { code: "EUR", symbol: "€" },
  Slovenia: { code: "EUR", symbol: "€" },
  "Solomon Islands": { code: "SBD", symbol: "SI$" },
  Somalia: { code: "SOS", symbol: "S" },
  "South Africa": { code: "ZAR", symbol: "R" },
  "South Korea": { code: "KRW", symbol: "₩" },
  "South Sudan": { code: "SSP", symbol: "SSP" },
  Spain: { code: "EUR", symbol: "€" },
  "Sri Lanka": { code: "LKR", symbol: "₨" },
  Sudan: { code: "SDG", symbol: "SDG" },
  Suriname: { code: "SRD", symbol: "$" },
  Sweden: { code: "SEK", symbol: "kr" },
  Switzerland: { code: "CHF", symbol: "CHF" },
  Syria: { code: "SYP", symbol: "£S" },
  Taiwan: { code: "TWD", symbol: "NT$" },
  Tajikistan: { code: "TJS", symbol: "SM" },
  Tanzania: { code: "TZS", symbol: "TSh" },
  Thailand: { code: "THB", symbol: "฿" },
  "Timor-Leste": { code: "USD", symbol: "$" },
  Togo: { code: "XOF", symbol: "FCFA" },
  Tonga: { code: "TOP", symbol: "T$" },
  "Trinidad and Tobago": { code: "TTD", symbol: "TT$" },
  Tunisia: { code: "TND", symbol: "DT" },
  Turkey: { code: "TRY", symbol: "₺" },
  Turkmenistan: { code: "TMT", symbol: "TMT" },
  Tuvalu: { code: "AUD", symbol: "$" },
  Uganda: { code: "UGX", symbol: "USh" },
  Ukraine: { code: "UAH", symbol: "₴" },
  "United Arab Emirates": { code: "AED", symbol: "د.إ" },
  "United Kingdom": { code: "GBP", symbol: "£" },
  "United States": { code: "USD", symbol: "$" },
  Uruguay: { code: "UYU", symbol: "$U" },
  Uzbekistan: { code: "UZS", symbol: "so'm" },
  Vanuatu: { code: "VUV", symbol: "Vt" },
  "Vatican City": { code: "EUR", symbol: "€" },
  Venezuela: { code: "VES", symbol: "Bs" },
  Vietnam: { code: "VND", symbol: "₫" },
  Yemen: { code: "YER", symbol: "YR" },
  Zambia: { code: "ZMW", symbol: "K" },
  Zimbabwe: { code: "ZWL", symbol: "Z$" },
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  AED: "د.إ",
  AFN: "؋",
  ALL: "L",
  AMD: "֏",
  AOA: "Kz",
  ARS: "$",
  AUD: "$",
  AZN: "₼",
  BAM: "KM",
  BBD: "Bds$",
  BDT: "৳",
  BGN: "лв",
  BHD: "BD",
  BIF: "Fr",
  BND: "B$",
  BOB: "Bs",
  BRL: "R$",
  BSD: "B$",
  BTN: "Nu",
  BWP: "P",
  BYN: "Br",
  BZD: "BZ$",
  CAD: "$",
  CDF: "FC",
  CHF: "CHF",
  CLP: "$",
  CNY: "¥",
  COP: "$",
  CRC: "₡",
  CUP: "$",
  CVE: "$",
  CZK: "Kč",
  DJF: "Fdj",
  DKK: "kr",
  DOP: "RD$",
  DZD: "دج",
  EGP: "E£",
  ERN: "Nfk",
  ETB: "Br",
  EUR: "€",
  FJD: "FJ$",
  GBP: "£",
  GEL: "₾",
  GHS: "₵",
  GMD: "D",
  GNF: "Fr",
  GTQ: "Q",
  GYD: "G$",
  HNL: "L",
  HTG: "G",
  HUF: "Ft",
  IDR: "Rp",
  ILS: "₪",
  INR: "₹",
  IQD: "ع.د",
  IRR: "﷼",
  ISK: "kr",
  JMD: "J$",
  JOD: "JD",
  JPY: "¥",
  KES: "KSh",
  KGS: "сом",
  KHR: "៛",
  KMF: "CF",
  KPW: "₩",
  KRW: "₩",
  KWD: "KD",
  KZT: "₸",
  LAK: "₭",
  LBP: "LBP",
  LKR: "₨",
  LRD: "L$",
  LSL: "L",
  LYD: "LD",
  MAD: "د.م",
  MDL: "L",
  MGA: "Ar",
  MKD: "ден",
  MMK: "K",
  MNT: "₮",
  MRU: "UM",
  MUR: "₨",
  MVR: "Rf",
  MWK: "MK",
  MXN: "$",
  MYR: "RM",
  MZN: "MT",
  NAD: "N$",
  NGN: "₦",
  NIO: "C$",
  NOK: "kr",
  NPR: "₨",
  NZD: "$",
  OMR: "ر.ع",
  PAB: "B/.",
  PEN: "S/",
  PGK: "K",
  PHP: "₱",
  PKR: "₨",
  PLN: "zł",
  PYG: "₲",
  QAR: "QR",
  RON: "lei",
  RSD: "дин",
  RUB: "₽",
  RWF: "FRw",
  SAR: "ر.س",
  SBD: "SI$",
  SCR: "₨",
  SDG: "SDG",
  SEK: "kr",
  SGD: "S$",
  SLE: "Le",
  SOS: "S",
  SRD: "$",
  SSP: "SSP",
  STN: "Db",
  SYP: "£S",
  SZL: "E",
  THB: "฿",
  TJS: "SM",
  TMT: "TMT",
  TND: "DT",
  TOP: "T$",
  TRY: "₺",
  TTD: "TT$",
  TWD: "NT$",
  TZS: "TSh",
  UAH: "₴",
  UGX: "USh",
  USD: "$",
  UYU: "$U",
  UZS: "so'm",
  VES: "Bs",
  VND: "₫",
  VUV: "Vt",
  WST: "T",
  XAF: "FCFA",
  XCD: "EC$",
  XOF: "FCFA",
  YER: "YR",
  ZAR: "R",
  ZMW: "K",
  ZWL: "Z$",
};

export const DEFAULT_CURRENCY = "EUR";

export const LOCALES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
] as const;

export type LocaleCode = (typeof LOCALES)[number]["code"];

export function localeLabel(code: string): string {
  return LOCALES.find((l) => l.code === code)?.label ?? LOCALES[0].label;
}

export function invalidLocale(code: string): boolean {
  return !LOCALES.some((l) => l.code === code);
}

export function moneySymbol(code: string): string {
  return CURRENCY_SYMBOLS[code] ?? code;
}

export function currencySymbolOf(country: string): string {
  return COUNTRY_CURRENCY[country]?.symbol ?? moneySymbol(DEFAULT_CURRENCY);
}