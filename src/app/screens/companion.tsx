"use client";

import { useEffect, useRef, useState } from "react";
import type { Trip } from "../data";
import { useApp } from "../store";
import {
  IconSparkle,
  IconClose,
  IconSend,
  IconShield,
  IconChevronRight,
} from "../icons";

/* The Aeris companion: a floating button that opens a small yes/no chat.
   It suggests, clarifies like a human, deep-links into compare screens,
   and gates every commitment through the approval gate (Rule 02). */

interface CM {
  id: string;
  from: "ai" | "you";
  text: string;
  chips?: { label: string; action: string }[];
  yes?: string;
  no?: string;
}

type Action =
  | "help"
  | "later"
  | "rank-cars"
  | "rank-guides"
  | "alerts"
  | "open:cars"
  | "open:guides"
  | "open:alerts"
  | "open:restaurants"
  | "gate:guide"
  | "gate:transfer"
  | "no"
  | "done";

const USER_LABEL: Partial<Record<Action, string>> = {
  help: "What can you do?",
  later: "Talk later",
  "rank-cars": "Rank cars & taxi",
  "rank-guides": "Rank tour guides",
  alerts: "Check alerts",
  "open:cars": "Yes — open them",
  "open:guides": "Yes — open it",
  "open:alerts": "Yes — show me",
  "open:restaurants": "Yes — dinner first",
  "gate:guide": "Yes, book it",
  "gate:transfer": "Yes, book it",
  no: "No, not now",
  done: "Got it",
};

export function Companion() {
  const { trip, companionOpen, openCompanion, closeCompanion, go, openGate, run, notify, userName, money } = useApp();
  const [msgs, setMsgs] = useState<CM[]>([]);
  const [suggesting, setSuggesting] = useState(true);
  const started = useRef(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!started.current) {
      started.current = true;
      setMsgs([
        {
          id: "c-greet",
          from: "ai",
          text: `Hey ${userName}, I'm Aeris - the companion who lives in this dot. I suggest, I don't decide: anything I arrange still passes the approval gate, and I'll ask you yes/no questions before I touch the plan.`,
          chips: [
            { label: "What can you do?", action: "help" },
            { label: "Talk later", action: "later" },
          ],
        },
      ]);
    }
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs.length]);

  useEffect(() => {
    if (companionOpen) {
      setSuggesting(false);
      return;
    }
    const t = window.setTimeout(() => setSuggesting(true), 30000);
    return () => window.clearTimeout(t);
  }, [companionOpen, msgs.length]);

  const budgetRemaining = () =>
    Math.max(
      0,
      Number(String(trip.budget.remaining).replace(/[^0-9.]/g, "")) || 0
    );

  const last = msgs[msgs.length - 1];

  const pushUser = (text: string) =>
    setMsgs((prev) => [...prev, { id: "u-" + Date.now(), from: "you", text }]);

  const pushAi = (m: Omit<CM, "id" | "from">) =>
    setMsgs((prev) => [...prev, { id: "a-" + Date.now(), from: "ai", ...m }]);

  const handle = (action: Action) => {
    if (action === "help") {
      pushUser("What can you do?");
      pushAi({
        text: "Now we're talking. I rank flights, stays, cars & taxi, restaurants, activities and tour guides - and I watch for clashes like Ana's dinner or Zara's late arrival. Pick a lane:",
        chips: [
          { label: "Rank cars & taxi", action: "rank-cars" },
          { label: "Rank tour guides", action: "rank-guides" },
          { label: "Check alerts", action: "alerts" },
        ],
      });
      return;
    }
    if (action === "later") {
      pushUser("Talk later");
      pushAi({
        text: "Fair. I'll keep this dot quiet - no pings, no nudges. When you're ready, tap me and I'll pick right back up.",
        chips: [{ label: "Actually - surprise me", action: "help" }],
      });
      return;
    }
    if (action === "rank-cars") {
      pushUser("Rank cars & taxi");
      pushAi({
        text: `For ${trip.destination}: a weekend A2 rental and a private minivan to the airport (5/person, door to door). Both split neatly across your ${trip.travellers.length}. Open the comparison?`,
        yes: "open:cars",
        no: "no",
      });
      return;
    }
    if (action === "rank-guides") {
      pushUser("Rank tour guides");
      pushAi({
        text: "Good call. A private guide slots straight in front of your Louvre morning: skip-the-line, 48/person, max 8, EN/FR/ES. In budget too. Preview it?",
        yes: "open:guides",
        no: "no",
      });
      return;
    }
    if (action === "alerts") {
      pushUser("Check alerts");
      pushAi({
        text: trip.alerts.filter((a) => !a.resolved && a.kind !== "info").length > 0
          ? "One live alert on this trip: the return flight is delayed 45 min. I ranked 3 alternatives against your remaining budget and none touch anything you already approved until you pick."
          : "You're clear - no live alerts right now. Anything like a cancellation or a schedule clash, I'll surface it here before it costs you.",
        yes: "open:alerts",
        no: "no",
      });
      return;
    }
    if (action === "open:cars" || action === "open:guides" || action === "open:restaurants" || action === "open:alerts") {
      pushUser(USER_LABEL[action] ?? "Yes");
      const type =
        action === "open:cars" ? "cars" : action === "open:guides" ? "guides" : action === "open:restaurants" ? "restaurants" : null;
      if (type) {
        setTimeout(() => {
          closeCompanion();
          go("search-compare", { type });
        }, 350);
      } else {
        setTimeout(() => {
          closeCompanion();
          go("alerts-disruptions");
        }, 350);
      }
      return;
    }
    if (action === "gate:guide" || action === "gate:transfer") {
      pushUser(USER_LABEL[action] ?? "Yes, book it");
      const guide = trip.options.find((o) => o.actId === "guide");
      const per = Number(String(guide?.price ?? "48").replace(/[^0-9.]/g, "")) || 48;
      const total = per * trip.travellers.length;
      const remaining = budgetRemaining();
      const item = action === "gate:guide"
        ? "Louvre guide booked for the group (via companion)"
        : "Airport transfer booked for the group (via companion)";
      openGate({
        id: "comp:" + action,
        title: `Book the private guide for ${trip.travellers.length}?`,
        sub: "One yes/no here - then everything goes through the approval gate below.",
        kind: "ai",
        diffs: [
          { label: "Itinerary", old: "Not booked", mine: guide ? `Add ${guide.title}` : "Private tour guide" },
          { label: "Schedule", old: "—", mine: "Before the morning slot" },
          { label: "Cost /person", old: "—", mine: `${money(per)}`, delta: `+${money(per)}` },
          { label: "Budget left", old: `${money(remaining)}`, mine: `${money(Math.max(0, remaining - total))}`, delta: `-${money(total)}` },
        ],
        conditions: guide?.conditions ?? ["Free cancellation to 24h before", "Max 8 people"],
        travellers: trip.travellers.map((t) => t.name),
        approveLabel: `Approve & book - ${money(total)}`,
        onApprove: () => {
          run((t: Trip) => ({
            ...t,
            history: [
              {
                id: "hb-comp-" + Date.now(),
                kind: "ai",
                text: item,
                who: "Aeris companion · yes/no then approval",
                time: "just now",
                approvedBy: "You",
              },
              ...t.history,
            ],
          }));
          notify("Booked. Change history updated - approval logged.");
        },
      });
      return;
    }
    if (action === "no" || action === "done") {
      pushUser(action === "no" ? "No, not now" : "Got it");
      pushAi({
        text: "No problem - I keep every option ranked in the background, nothing changes until you say the word. Ping me for cars, a guide, dinner, or an alert check.",
        chips: [
          { label: "Rank cars & taxi", action: "rank-cars" },
          { label: "Rank tour guides", action: "rank-guides" },
        ],
      });
      return;
    }
  };

  const onChip = (action: string) => handle(action as Action);

  const onQuick = (which: "yes" | "no") => {
    if (!last || !last[which]) return;
    handle(last[which] as Action);
  };

  const onText = () => {
    // free-text input intentionally turns into a clarifying question or a redirect
    pushAi({
      text: "I'm most useful with quick yes/no steps - tap a chip above and I'll take you straight to the ranked options for this trip.",
      chips: [
        { label: "Rank cars & taxi", action: "rank-cars" },
        { label: "Talk later", action: "later" },
      ],
    });
  };

  return (
    <>
      {!companionOpen && (
        <button
          className={`comp-fab${suggesting ? " pulse" : ""}`}
          onClick={() => {
            setSuggesting(false);
            openCompanion();
          }}
          aria-label="Open Aeris companion"
          title="Aeris companion"
        >
          <IconSparkle size={24} />
        </button>
      )}

      {companionOpen && (
        <div className="comp-overlay" onClick={closeCompanion}>
          <div className="comp-sheet" onClick={(e) => e.stopPropagation()}>
            <header className="comp-head">
              <div className="comp-head-icon">
                <IconSparkle size={20} />
              </div>
              <div className="comp-head-text">
                <b>Aeris companion</b>
                <span>Asks first · never changes silently</span>
              </div>
              <button className="comp-close" onClick={closeCompanion} aria-label="Close companion">
                <IconClose size={18} />
              </button>
            </header>

            <div className="ai-chat-list comp-msgs" ref={listRef}>
              {msgs.map((m) =>
                m.from === "ai" ? (
                  <div key={m.id} className="chat-msg">
                    <div className="chat-bubble comp-bubble">
                      <p className="small fg2" style={{ margin: 0 }}>
                        {m.text}
                      </p>
                      {m.chips && (
                        <div className="rail-inline" style={{ marginTop: 8 }}>
                          {m.chips.map((c) => (
                            <button
                              key={c.label}
                              className="chip chip-ai active"
                              onClick={() => onChip(c.action)}
                            >
                              {c.label}
                            </button>
                          ))}
                        </div>
                      )}
                      {m === last && (m.yes || m.no) && (
                        <div className="rail-inline comp-quick-in" style={{ marginTop: 8 }}>
                          {m.yes && (
                            <button className="chip quick-yes" onClick={() => onQuick("yes")}>
                              Yes <IconChevronRight size={13} />
                            </button>
                          )}
                          {m.no && (
                            <button className="chip quick-no" onClick={() => onQuick("no")}>
                              No
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div key={m.id} className="chat-msg self">
                    <div className="chat-bubble comp-you">{m.text}</div>
                  </div>
                )
              )}
            </div>

            <div className="comp-input" onClick={onText}>
              <span className="comp-input-ico">
                <IconShield size={15} />
              </span>
              <span>Ask me something - it stays gated</span>
              <IconSend size={16} className="muted" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}