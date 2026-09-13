/* ───────────────────────────── Free OTA Search API ───────────────────────────── */
/* Uses free public APIs: Nominatim (geocoding), REST Countries, AviationStack (flights) */

export interface SearchParams {
  vertical: "flights" | "hotels" | "cars" | "attractions";
  destination: string;
  from?: string;
  dates?: string;
  way?: "return" | "oneway";
  travellers?: string;
}

export interface LocationResult {
  name: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  displayName: string;
}

export interface OtaOffer {
  id: string;
  vertical: "flights" | "hotels" | "cars" | "attractions";
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
  description: string;
  conditions: string[];
  meta: Record<string, string>;
}

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
const REST_COUNTRIES_BASE = "https://restcountries.com/v3.1";
const AV_STACK_BASE = "https://api.aviationstack.com/v1";

/* ──────────────── Geocoding ──────────────── */

export async function geocodeDestination(query: string): Promise<LocationResult | null> {
  try {
    const url = `${NOMINATIM_BASE}/search?format=json&q=${encodeURIComponent(query)}&limit=1&addressdetails=1`;
    const res = await fetch(url, { headers: { "User-Agent": "Aeris-Travel/1.0" } });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.length) return null;

    const place = data[0];
    const country = place.address?.country || "";
    const countryCode = (place.address?.country_code || "").toUpperCase();

    return {
      name: place.address?.city || place.address?.town || place.address?.village || place.display_name.split(",")[0],
      country,
      countryCode,
      lat: Number(place.lat),
      lng: Number(place.lon),
      displayName: place.display_name,
    };
  } catch {
    return null;
  }
}

export async function getCountryInfo(code: string) {
  try {
    const res = await fetch(`${REST_COUNTRIES_BASE}/alpha/${code.toLowerCase()}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data[0];
  } catch {
    return null;
  }
}

/* ──────────────── Flight Search (AviationStack) ──────────────── */

const AIRLINE_LOGOS: Record<string, string> = {
  "EasyJet": "https://images.kiwi.com/airlines/64/U2.png",
  "Ryanair": "https://images.kiwi.com/airlines/64/FR.png",
  "British Airways": "https://images.kiwi.com/airlines/64/BA.png",
  "Air France": "https://images.kiwi.com/airlines/64/AF.png",
  "Lufthansa": "https://images.kiwi.com/airlines/64/LH.png",
  "KLM": "https://images.kiwi.com/airlines/64/KL.png",
  "Vueling": "https://images.kiwi.com/airlines/64/VY.png",
  "Wizz Air": "https://images.kiwi.com/airlines/64/W6.png",
  "Turkish Airlines": "https://images.kiwi.com/airlines/64/TK.png",
  "Emirates": "https://images.kiwi.com/airlines/64/EK.png",
  "Qatar Airways": "https://images.kiwi.com/airlines/64/QR.png",
  "Singapore Airlines": "https://images.kiwi.com/airlines/64/SQ.png",
  "American Airlines": "https://images.kiwi.com/airlines/64/AA.png",
  "Delta": "https://images.kiwi.com/airlines/64/DL.png",
  "United": "https://images.kiwi.com/airlines/64/UA.png",
};

function getAirlineLogo(name: string): string {
  return AIRLINE_LOGOS[name] || "https://images.kiwi.com/airlines/64/BA.png";
}

export async function searchFlights(params: SearchParams): Promise<OtaOffer[]> {
  const apiKey = process.env.AVIATIONSTACK_KEY || "DEMO_KEY";
  if (apiKey === "DEMO_KEY") return generateMockFlights(params);

  try {
    const dest = await geocodeDestination(params.destination);
    const fromLoc = params.from ? await geocodeDestination(params.from) : null;
    
    if (!dest) return generateMockFlights(params);

    const url = `${AV_STACK_BASE}/flights?access_key=${apiKey}&arr_icao=${dest.countryCode}&limit=10`;
    const res = await fetch(url);
    if (!res.ok) return generateMockFlights(params);

    const data = await res.json();
    return (data.data || []).slice(0, 8).map((f: any, i: number) => {
      const airlineName = f.airline?.name || "Airline";
      return {
        id: `flight-${f.flight?.iata || i}`,
        vertical: "flights" as const,
        provider: airlineName,
        title: `${airlineName} ${f.flight?.iata || ""}`,
        subtitle: `${fromLoc?.name || "Various"} → ${dest.name}`,
        price: String(Math.floor(Math.random() * 300) + 50),
        priceNote: "/person",
        rating: Number((Math.random() * 2 + 7).toFixed(1)),
        reviews: Math.floor(Math.random() * 2000) + 500,
        tags: [f.flight?.iata ? `Flight ${f.flight.iata}` : "Direct", "Economy"],
        photo: getAirlineLogo(airlineName),
        photoRatio: "1/1",
        description: `Flight from ${fromLoc?.name || "your city"} to ${dest.name}, ${dest.country}.`,
        conditions: ["Carry-on included", "Checked bag extra", "Free cancellation 24h"],
        meta: {
          dep: f.departure?.scheduled || "TBD",
          arr: f.arrival?.scheduled || "TBD",
          duration: "TBD",
          aircraft: f.aircraft?.iata || "TBD",
        },
      };
    });
  } catch {
    return generateMockFlights(params);
  }
}

/* ──────────────── Mock Generators ──────────────── */

function generateMockFlights(params: SearchParams): OtaOffer[] {
  const dest = params.destination;
  const from = params.from || "London";
  const airlines = [
    { name: "EasyJet", code: "U2", budget: true, logo: "https://images.kiwi.com/airlines/64/U2.png" },
    { name: "Ryanair", code: "FR", budget: true, logo: "https://images.kiwi.com/airlines/64/FR.png" },
    { name: "British Airways", code: "BA", budget: false, logo: "https://images.kiwi.com/airlines/64/BA.png" },
    { name: "Air France", code: "AF", budget: false, logo: "https://images.kiwi.com/airlines/64/AF.png" },
    { name: "Lufthansa", code: "LH", budget: false, logo: "https://images.kiwi.com/airlines/64/LH.png" },
    { name: "KLM", code: "KL", budget: false, logo: "https://images.kiwi.com/airlines/64/KL.png" },
    { name: "Vueling", code: "VY", budget: true, logo: "https://images.kiwi.com/airlines/64/VY.png" },
    { name: "Wizz Air", code: "W6", budget: true, logo: "https://images.kiwi.com/airlines/64/W6.png" },
  ];

  return airlines.slice(0, 6).map((a, i) => {
    const basePrice = a.budget ? 40 + Math.random() * 80 : 120 + Math.random() * 200;
    const depHour = 6 + Math.floor(Math.random() * 14);
    const depMin = Math.random() > 0.5 ? "00" : "30";
    const arrHour = depHour + 2 + Math.floor(Math.random() * 3);
    const arrMin = Math.random() > 0.5 ? "00" : "30";

    return {
      id: `mock-flight-${a.code}-${i}`,
      vertical: "flights" as const,
      provider: a.name,
      title: `${a.name} ${a.code}${1000 + i}`,
      subtitle: `${from} → ${dest}`,
      price: Math.round(basePrice).toString(),
      priceNote: "/person",
      rating: Number((7.5 + Math.random() * 2).toFixed(1)),
      reviews: Math.floor(Math.random() * 3000) + 500,
      tags: a.budget ? ["Budget", "Carry-on only"] : ["Full service", "23kg bag"],
      photo: a.logo,
      photoRatio: "1/1",
      description: `${a.name} flight from ${from} to ${dest}. ${a.budget ? "Low-cost carrier with carry-on only." : "Full service airline with checked baggage."}`,
      conditions: a.budget ? ["No free changes", "Carry-on only (10kg)", "Non-refundable"] : ["Free changes until 24h before", "23kg checked bag", "Meal included"],
      meta: {
        dep: `${depHour.toString().padStart(2, "0")}:${depMin}`,
        arr: `${arrHour.toString().padStart(2, "0")}:${arrMin}`,
        duration: `${2 + Math.floor(Math.random() * 3)}h ${Math.floor(Math.random() * 60)}m`,
        stops: Math.random() > 0.7 ? "1 stop" : "Non-stop",
        baggage: a.budget ? "Carry-on only" : "23kg checked",
      },
    };
  });
}

function generateMockHotels(params: SearchParams): OtaOffer[] {
  const dest = params.destination;
  const hotelTypes = [
    { type: "Boutique Hotel", rating: 4.5, base: 120 },
    { type: "Business Hotel", rating: 4.0, base: 90 },
    { type: "Luxury Resort", rating: 4.8, base: 280 },
    { type: "Budget Hotel", rating: 3.5, base: 55 },
    { type: "Aparthotel", rating: 4.2, base: 85 },
    { type: "Hostel", rating: 3.8, base: 30 },
  ];

  const areas = ["City Center", "Old Town", "Near Station", "Beachfront", "Airport Area", "Business District"];

  return hotelTypes.slice(0, 6).map((h, i) => {
    const price = h.base + Math.floor(Math.random() * 50);
    return {
      id: `mock-hotel-${i}`,
      vertical: "hotels" as const,
      provider: ["Booking.com", "Expedia", "Hotels.com", "Agoda"][Math.floor(Math.random() * 4)],
      title: `${h.type} ${dest}`,
      subtitle: `${areas[i % areas.length]}, ${dest}`,
      price: price.toString(),
      priceNote: "/night",
      rating: Number((h.rating - 0.3 + Math.random() * 0.6).toFixed(1)),
      reviews: Math.floor(Math.random() * 2000) + 200,
      tags: [h.type, `${Math.floor(Math.random() * 3) + 3}★`, "Free WiFi"],
      photo: `/images/hotel-${["paris", "boutique", "modern", "airport"][i % 4]}.jpg`,
      photoRatio: "3/2",
      description: `Comfortable ${h.type.toLowerCase()} in ${areas[i % areas.length].toLowerCase()} of ${dest}. Great location for exploring the city.`,
      conditions: ["Free cancellation until 24h before", "Breakfast available", "24h reception"],
      meta: {
        location: areas[i % areas.length],
        rating: `${Math.floor(h.rating)}★`,
        amenities: "WiFi · AC · Breakfast",
        cancellation: "Free to 24h before",
      },
    };
  });
}

function generateMockCars(params: SearchParams): OtaOffer[] {
  const dest = params.destination;
  const carTypes = [
    { type: "Economy", model: "Fiat 500 / similar", base: 25, seats: 4 },
    { type: "Compact", model: "VW Golf / similar", base: 35, seats: 5 },
    { type: "SUV", model: "Nissan Qashqai / similar", base: 55, seats: 5 },
    { type: "Minivan", model: "VW Sharan / similar", base: 75, seats: 7 },
    { type: "Premium", model: "BMW 3 Series / similar", base: 95, seats: 5 },
    { type: "Electric", model: "Tesla Model 3 / similar", base: 85, seats: 5 },
  ];

  const providers = ["Hertz", "Avis", "Enterprise", "Europcar", "Sixt", "Budget"];

  return carTypes.slice(0, 6).map((c, i) => {
    const price = c.base + Math.floor(Math.random() * 20);
    return {
      id: `mock-car-${i}`,
      vertical: "cars" as const,
      provider: providers[i % providers.length],
      title: `${c.type} · ${c.model}`,
      subtitle: `${dest} rental · ${c.seats} seats`,
      price: price.toString(),
      priceNote: "/day",
      rating: Number((7.5 + Math.random() * 1.5).toFixed(1)),
      reviews: Math.floor(Math.random() * 1500) + 300,
      tags: [c.type, `${c.seats} seats`, "Auto"],
      photo: `/images/car-${["compact", "clio", "golf", "camper", "minivan", "taxi"][i % 6]}.jpg`,
      photoRatio: "3/2",
      description: `${c.type} car rental in ${dest}. ${c.model} with automatic transmission, perfect for ${c.seats >= 7 ? "large groups" : "city driving"}.`,
      conditions: ["Driver 25+", "Full-to-full fuel", "Free cancellation 48h"],
      meta: {
        type: `${c.type} · Automatic`,
        seats: c.seats.toString(),
        pickup: `${dest} Airport / Downtown`,
        dropoff: "Same location",
        fuel: "Full-to-full",
      },
    };
  });
}

function generateMockAttractions(params: SearchParams): OtaOffer[] {
  const dest = params.destination;
  const attractionTypes = [
    { type: "Museum", icon: "🏛️", base: 15, cat: "Culture" },
    { type: "Guided Tour", icon: "🚶", base: 35, cat: "Experience" },
    { type: "Theme Park", icon: "🎢", base: 65, cat: "Entertainment" },
    { type: "Day Trip", icon: "🚌", base: 55, cat: "Excursion" },
    { type: "Food Tour", icon: "🍴", base: 45, cat: "Culinary" },
    { type: "Adventure", icon: "🏔️", base: 75, cat: "Outdoor" },
  ];

  return attractionTypes.slice(0, 6).map((a, i) => {
    const price = a.base + Math.floor(Math.random() * 30);
    return {
      id: `mock-attr-${i}`,
      vertical: "attractions" as const,
      provider: ["GetYourGuide", "Viator", "Tiqets", "Klook", "Musement", "Civitatis"][i % 6],
      title: `${a.type} in ${dest}`,
      subtitle: `${a.icon} ${a.cat} experience`,
      price: price.toString(),
      priceNote: "/person",
      rating: Number((8.0 + Math.random() * 1.5).toFixed(1)),
      reviews: Math.floor(Math.random() * 2000) + 400,
      tags: [a.type, "Instant confirmation", "Mobile ticket"],
      photo: `/images/${["louvre", "disney-castle", "seine-cruise", "orsay", "opera-garnier", "eiffel"][i % 6]}.jpg`,
      photoRatio: "3/2",
      description: `Top-rated ${a.type.toLowerCase()} in ${dest}. Book now for guaranteed entry and skip-the-line access where available.`,
      conditions: ["Free cancellation 24h before", "Mobile voucher accepted", "Guide included"],
      meta: {
        duration: `${2 + Math.floor(Math.random() * 6)}h`,
        category: a.cat,
        skipTheLine: Math.random() > 0.5 ? "Yes" : "No",
      },
    };
  });
}

/* ──────────────── Unified Search ──────────────── */

export async function searchOffers(params: SearchParams): Promise<OtaOffer[]> {
  switch (params.vertical) {
    case "flights":
      return searchFlights(params);
    case "hotels":
      return generateMockHotels(params);
    case "cars":
      return generateMockCars(params);
    case "attractions":
      return generateMockAttractions(params);
    default:
      return [];
  }
}