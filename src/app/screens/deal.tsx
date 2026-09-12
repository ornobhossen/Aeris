"use client";

import { useApp } from "../store";
import { Shell, Card } from "../ui";
import { IconCalendar, IconCheckCircle, IconArrowRight } from "../icons";

export interface Deal {
  id: string;
  city: string;
  tag: string;
  price: string;
  dates: string;
  highlights: string[];
  grad: string;
}

export const DEALS: Deal[] = [
  {
    id: "paris-flights-2n",
    city: "Paris",
    tag: "Flights + 2 nights from",
    price: "189",
    dates: "Fri 25 Sep - Sun 27 Sep",
    highlights: [
      "Return flights from London",
      "2 nights in a 4-star hotel near the Louvre",
      "Daily breakfast included",
    ],
    grad: "linear-gradient(135deg,#475569,#1f2937)",
  },
  {
    id: "lisbon-sunny-breaks",
    city: "Lisbon",
    tag: "Sunny breaks from",
    price: "149",
    dates: "Fri 25 Sep - Sun 27 Sep",
    highlights: [
      "Return flights from London",
      "2 nights in a city-centre hotel",
      "Free cancellation up to 48h before",
    ],
    grad: "linear-gradient(135deg,#0d9488,#065f46)",
  },
  {
    id: "reykjavik-weekend",
    city: "Reykjavik",
    tag: "Weekend escapes from",
    price: "219",
    dates: "Fri 9 Oct - Sun 11 Oct",
    highlights: [
      "Return flights from London",
      "2 nights in a 3-star hotel",
      "Northern lights tour add-on available",
    ],
    grad: "linear-gradient(135deg,#0891b2,#1e40af)",
  },
  {
    id: "bali-returns",
    city: "Bali",
    tag: "Returns from",
    price: "459",
    dates: "Tue 6 Oct - Sat 24 Oct",
    highlights: [
      "Return flights from London",
      "7 nights beachfront in Seminyak",
      "Airport transfers included",
    ],
    grad: "linear-gradient(135deg,#7c3aed,#581c87)",
  },
];

const DEAL_BY_ID: Record<string, Deal> = Object.fromEntries(DEALS.map((d) => [d.id, d]));

export function DealDetailScreen() {
  const { go, back, route, money } = useApp();
  const dealId = typeof route.params?.dealId === "string" ? String(route.params.dealId) : "";
  const deal = DEAL_BY_ID[dealId] ?? DEALS[0];

  return (
    <Shell title={`${deal.city} deal`} sub={deal.tag} onBack={back}>
      <div className="content">
        <div className="vstack" style={{ gap: 12 }}>
          <div className="deal-hero" style={{ background: deal.grad }}>
            <span className="deal-tag">{deal.tag}</span>
            <span className="deal-hero-city">{deal.city}</span>
            <span className="deal-hero-dates">
              <IconCalendar size={12} /> {deal.dates}
            </span>
            <span className="deal-hero-price">from {money(deal.price)}</span>
          </div>

          <Card>
            <div className="deal-high-title">What&apos;s included</div>
            <ul className="deal-high">
              {deal.highlights.map((h, i) => (
                <li key={i}>
                  <IconCheckCircle size={15} style={{ color: "var(--teal)", flex: "none" }} />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </Card>

          <button className="btn btn-primary btn-full" onClick={() => go("ota-search", { vertical: "flights", destination: deal.city })}>
            Search this destination <IconArrowRight size={15} />
          </button>
        </div>
      </div>
    </Shell>
  );
}