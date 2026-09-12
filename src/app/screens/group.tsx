"use client";

import { useState, type ReactNode } from "react";
import type { ChatMsg } from "../data";
import { useApp } from "../store";
import {
  Shell,
  Card,
  Badge,
  Avatar,
  AiNote,
  Progress,
  OrganiserChip,
} from "../ui";
import {
  IconSparkle,
  IconSend,
  IconLock,
  IconUsers,
  IconCrown,
  IconCheck,
  IconClock,
  IconEyeOff,
  IconRefresh,
  IconShield,
} from "../icons";

/* ──────────────── Members & preferences ──────────────── */

const personConstraints: Record<string, string> = {
  you: "Max 1 stop, leaves after 08:00",
  ana: "Hotel under 220/night",
  marco: "Prefers downtown",
  zara: "Lands 19:50 on Day 1 - no early dinners",
};

export function MembersPreferencesScreen() {
  const { trip, back, notify, t } = useApp();
  const submitted = trip.travellers.filter((t) => t.submitted).length;
  const needed = trip.travellers.length;
  const blockers = ["After 08:00 departure (2)", "Lands 19:50 Day 1 (1)"];

  return (
    <Shell
      title={t("trip.quickMembers")}
      sub={t("trip.quickMembersSub", { a: submitted, b: needed })}
      onBack={back}
    >
      <div className="content">
        <Card style={{ marginBottom: 12 }}>
          <div className="spread" style={{ marginBottom: 8 }}>
            <span className="section-title" style={{ margin: 0 }}>
              {t("group.preferenceCollection")}
            </span>
            <Badge tone={submitted === needed ? "success" : "warn"}>
              {submitted}/{needed} done
            </Badge>
          </div>
          <Progress pct={(submitted / needed) * 100} />
        </Card>

        <div className="vstack" style={{ gap: 8 }}>
          {trip.travellers.map((t) => (
            <Card key={t.id} style={{ padding: 13 }}>
              <div className="spread">
                <div className="hstack" style={{ gap: 10 }}>
                  <Avatar name={t.name} initials={t.initials} color={t.color} />
                  <div>
                    <div className="hstack" style={{ gap: 6 }}>
                      <span className="rl-title" style={{ fontSize: 14 }}>
                        {t.name}
                      </span>
                      {t.role === "organiser" && <OrganiserChip name={t.name} />}
                    </div>
                    <div className="small muted">{personConstraints[t.id] ?? "No hard constraints"}</div>
                  </div>
                </div>
                <div>
                  {t.submitted ? (
                    <Badge tone="success">
                      <IconCheck size={11} /> Submitted
                    </Badge>
                  ) : (
                    <Badge tone="warn">Not submitted</Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="card-teal" style={{ marginTop: 12 }}>
          <div className="hstack" style={{ gap: 8 }}>
            <IconLock size={15} style={{ color: "var(--teal)", flex: "none" }} />
            <p className="small" style={{ margin: 0 }}>
              Individual budgets stay private. The group only sees who submitted and non-private
              preferences like time windows.
            </p>
          </div>
        </Card>

        <Section title={t("group.schedConstraints")}>
          <div className="rail-inline">
            {blockers.map((b) => (
              <Badge key={b} tone="outline">
                <IconClock size={11} /> {b}
              </Badge>
            ))}
          </div>
        </Section>

        <button
          className="btn btn-secondary btn-full"
          style={{ marginTop: 4 }}
          onClick={() => notify("Reminder queued - debounced with other alerts")}
        >
          Send a reminder to Zara
        </button>
      </div>
    </Shell>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="section" style={{ paddingLeft: 0, paddingRight: 0 }}>
      <h3 className="section-title">{title}</h3>
      {children}
    </section>
  );
}

/* ──────────────── Group chat ──────────────── */

export function GroupChatScreen() {
  const { trip, back, go, notify, t } = useApp();
  const [tab, setTab] = useState<"group" | "ai">("group");
  const [msgs, setMsgs] = useState<ChatMsg[]>(trip.chats);
  const [draft, setDraft] = useState("");

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMsgs((prev) => [
      ...prev,
      {
        id: "me-" + Date.now(),
        from: "you",
        text,
        time: "now",
        intent:
          /dinner|hotel|flight|budget/.test(text.toLowerCase())
            ? [{ label: "Intent heard", action: "match" }]
            : undefined,
      },
    ]);
    setDraft("");
  };

  return (
    <Shell title={t("trip.quickChat")} sub={trip.name} onBack={back}>
      <div className="chat-tabs">
        <button className={`tab-btn${tab === "group" ? " active" : ""}`} onClick={() => setTab("group")}>
          Group
        </button>
        <button className={`tab-btn${tab === "ai" ? " active" : ""}`} onClick={() => setTab("ai")}>
          <IconSparkle size={14} style={{ verticalAlign: -2 }} /> Aeris AI
        </button>
      </div>

      {tab === "group" ? (
        <>
          <div className="chat-list">
            {msgs.map((m) => {
              if (m.from === "ai") {
                return (
                  <div key={m.id} className="chat-msg">
                    <div className="chat-bubble" style={{ background: "var(--ai-bg)", border: "1px solid color-mix(in oklab, var(--ai), transparent 60%)", borderTopLeftRadius: 4 }}>
                      <div className="hstack" style={{ gap: 6, marginBottom: 4 }}>
                        <IconSparkle size={13} style={{ color: "var(--ai)" }} />
                        <b style={{ fontSize: 12, color: "var(--ai)" }}>Aeris</b>
                      </div>
                      <p className="small fg2" style={{ margin: 0 }}>
                        {m.text}
                      </p>
                      {m.intent && (
                        <div className="rail-inline" style={{ marginTop: 8 }}>
                          {m.intent.map((i) => (
                            <button
                              key={i.label}
                              className="chip chip-ai active"
                              onClick={() => (i.action === "open" ? go("search-compare") : notify("Alright - staying in conversation mode."))}
                            >
                              {i.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="chat-meta">10:42</span>
                  </div>
                );
              }
              if (m.from === "system") {
                return (
                  <div key={m.id} className="chat-msg" style={{ maxWidth: "100%" }}>
                    <div className="chat-bubble" style={{ background: "var(--warn-bg)", color: "var(--warn)", fontSize: 12, width: "100%" }}>
                      {m.text}
                    </div>
                  </div>
                );
              }
              const isYou = m.from === "you";
              const member = trip.travellers.find((t) => isYou ? t.you : t.name === m.author);
              return (
                <div key={m.id} className={`chat-msg${isYou ? " self" : ""}`}>
                  {!isYou && member && <Avatar name={member.name} initials={member.initials} color={member.color} size="sm" />}
                  <div>
                    <div className="chat-bubble">
                      {!isYou && <b style={{ fontSize: 12, display: "block", marginBottom: 2 }}>{m.author}</b>}
                      {m.text}
                    </div>
                    {m.intent && (
                      <div className="rail-inline" style={{ marginTop: 4 }}>
                        {m.intent.map((i) => (
                          <span key={i.label} className="badge badge-ai">
                            <IconSparkle size={10} /> {i.label}
                          </span>
                        ))}
                      </div>
                    )}
                    <span className="chat-meta">{m.time}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="chat-composer">
            <div className="chat-intent-bar">
              <div className="ai-note" style={{ margin: 0 }}>
                <IconSparkle size={14} />
                <span>Aeris listens for travel intents here. It never edits the plan silently - anything it acts on shows up in change history.</span>
              </div>
            </div>

            <div className="chat-input-bar">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Message the group..."
                aria-label="Message the group"
              />
              <button className="btn btn-primary btn-sm" style={{ width: 44, height: 44, borderRadius: 22, padding: 0 }} onClick={send} aria-label="Send">
                <IconSend size={18} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <ChatAiPane />
      )}
    </Shell>
  );
}

/* ──────────────── Aeris AI tab (companion inside the chat) ──────────────── */

interface AiMsg {
  id: string;
  from: "ai" | "you";
  text: string;
  chips?: { label: string; action: string }[];
}

function ChatAiPane() {
  const { trip, go, openGate, run, notify, money } = useApp();
  const [msgs, setMsgs] = useState<AiMsg[]>([
    {
      id: "ai0",
      from: "ai",
      text: "Hi, I'm Aeris - the companion pinned inside your chat. I suggest, I never silently change the plan: anything I arrange still passes the approval gate. What should we sort for Paris?",
      chips: [
        { label: "Book dinner for tonight", action: "dinner" },
        { label: "Sort the airport transfer", action: "transfer" },
        { label: "Add a tour guide", action: "guide" },
        { label: "Just checking", action: "idle" },
      ],
    },
  ]);
  const [draft, setDraft] = useState("");

  const reply = (action: string) => {
    const key = /guide/.test(action) ? "guide" : /taxi|transfer|car/.test(action) ? "transfer" : /dinner|food|restaurant/.test(action) ? "dinner" : "idle";
    const scripts: Record<string, AiMsg> = {
      guide: {
        id: "ai-g",
        from: "ai",
        text: "Good one. A private Louvre guide lets you skip the line right before your 09:00 slot - 48/person, max 8, EN/FR/ES. It fits the remaining budget.",
        chips: [
          { label: "Compare tour guides", action: "open:guides" },
          { label: "Book it for everyone", action: "gate:guide" },
        ],
      },
      transfer: {
        id: "ai-t",
        from: "ai",
        text: "For the group with luggage, a private minivan CDG to the Latin Quarter costs 5/person door to door - simpler than four 32 metro tickets on Day 1.",
        chips: [
          { label: "Compare cars & taxi", action: "open:cars" },
          { label: "Ask for the weekend car too", action: "idle" },
        ],
      },
      dinner: {
        id: "ai-d",
        from: "ai",
        text: "19:00 was too early for Zara (lands 19:50). Something after 20:30 in Le Marais clears everyone's calendar - I've ranked a few against the food budget.",
        chips: [
          { label: "Compare restaurants", action: "open:restaurants" },
          { label: "Just browsing", action: "idle" },
        ],
      },
      idle: {
        id: "ai-i",
        from: "ai",
        text: "No worries. I'll keep a quiet eye on intents and nudge the group when a vote needs attention. Say the word for dinner, a transfer, or a guide.",
        chips: [
          { label: "Sort the airport transfer", action: "transfer" },
          { label: "Add a tour guide", action: "guide" },
        ],
      },
    };
    const picked = scripts[key];
    setMsgs((prev) => [
      ...prev,
      { id: "you-" + Date.now() + action, from: "you", text: action === "idle" ? "Just checking." : action === "guide" ? "Can you sort a tour guide?" : action === "transfer" ? "What about the transfer?" : "Dinner, tonight?" },
      { ...picked, id: picked.id + "-" + Date.now() },
    ]);
  };

  const onChip = (action: string) => {
    if (action.startsWith("open:")) {
      const type = action.split(":")[1];
      go("search-compare", { type });
      return;
    }
    if (action.startsWith("gate:")) {
      const per = 48;
      openGate({
        id: "ai-guide-book",
        title: `Aeris, book the Louvre guide for ${trip.travellers.length}?`,
        sub: "Private 2h guide · 09:00 slot · skip-the-line · max 8",
        kind: "ai",
        diffs: [
          { label: "Itinerary", old: "Not booked", mine: "Private Louvre guide · 09:00" },
          { label: "Schedule", old: "—", mine: "Starts before the curated Louvre slot" },
          { label: "Cost /person", old: "—", mine: `${money(per)}`, delta: `+${money(per)}` },
          { label: "Budget left", old: `${money(trip.budget.remaining)}`, mine: `${money(Math.max(0, Number(String(trip.budget.remaining).replace(/[^0-9.]/g, "")) - per * trip.travellers.length))}`, delta: `-${money(per * trip.travellers.length)}` },
        ],
        conditions: ["Free cancellation to 24h before", "Max 8 people", "No-show policy"],
        travellers: trip.travellers.map((t) => t.name),
        approveLabel: `Approve & book - ${money(per * trip.travellers.length)} total`,
        onApprove: () => {
          run((t) => ({
            ...t,
            history: [
              {
                id: "hb-guide-ai",
                kind: "ai",
                text: "Private Louvre guide booked for the group (via chat companion)",
                who: "Aeris · yes/no clarification",
                time: "just now",
                approvedBy: "You",
              },
              ...t.history,
            ],
          }));
          notify("Louvre guide booked for everyone. Change history updated.");
        },
      });
      return;
    }
    reply(action);
  };

  const onSend = () => {
    const text = draft.trim();
    if (!text) return;
    setMsgs((prev) => [...prev, { id: "you-raw-" + Date.now(), from: "you", text }]);
    setDraft("");
    reply(text);
  };

  return (
    <>
      <div className="ai-chat-list">
        {msgs.map((m) =>
          m.from === "ai" ? (
            <div key={m.id} className="chat-msg">
              <div className="chat-bubble" style={{ background: "var(--ai-bg)", border: "1px solid color-mix(in oklab, var(--ai), transparent 60%)", borderTopLeftRadius: 4 }}>
                <div className="hstack" style={{ gap: 6, marginBottom: 4 }}>
                  <IconSparkle size={13} style={{ color: "var(--ai)" }} />
                  <b style={{ fontSize: 12, color: "var(--ai)" }}>Aeris AI</b>
                </div>
                <p className="small fg2" style={{ margin: 0 }}>
                  {m.text}
                </p>
                {m.chips && (
                  <div className="rail-inline" style={{ marginTop: 8 }}>
                    {m.chips.map((c) => (
                      <button key={c.label} className="chip chip-ai active" onClick={() => onChip(c.action)}>
                        {c.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div key={m.id} className="chat-msg self">
              <div>
                <div className="chat-bubble">{m.text}</div>
                <span className="chat-meta" style={{ textAlign: "right" }}>now</span>
              </div>
            </div>
          )
        )}
      </div>

      <div className="chat-composer">
        <div className="chat-intent-bar">
          <div className="ai-note" style={{ margin: 0 }}>
            <IconShield size={14} />
            <span>Clarifies with yes/no answers, then sends commitments through the approval gate.</span>
          </div>
        </div>

        <div className="chat-input-bar">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSend()}
            placeholder="Ask Aeris about the trip..."
            aria-label="Ask Aeris about the trip"
          />
          <button className="btn btn-primary btn-sm" style={{ width: 44, height: 44, borderRadius: 22, padding: 0 }} onClick={onSend} aria-label="Send">
            <IconSend size={18} />
          </button>
        </div>
      </div>
    </>
  );
}

/* ──────────────── Proposals & voting ──────────────── */

export function ProposalsVotingScreen() {
  const { trip, back, openGate, run, notify, money, t } = useApp();
  const [myVotes, setMyVotes] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<string[]>([]);
  const [sim, setSim] = useState<Record<string, "tie" | "zero" | "none">>({});

  const closeProposal = (id: string, chosen: string) => {
    const p = trip.proposals.find((x) => x.id === id);
    if (!p) return;
    const chosenLabel = p.options.find((o) => o.id === chosen)?.label ?? chosen;
    openGate({
      id: "vote:" + id,
      title: `Vote outcome: ${chosenLabel}?`,
      sub: "Proposal voting ends with the approval gate, like every other group decision.",
      kind: "change",
      diffs: [
        { label: "Proposal", old: p.title, mine: `${chosenLabel} wins` },
        { label: "Deadline", old: p.deadline, mine: "Closed by vote" },
        { label: "Cost", old: p.options[0]?.price ?? "-", mine: chosenLabel },
      ],
      conditions: [
        sim[id] === "zero" ? "Deadline auto-extended once" : "Tally shown after close",
        "Once approved it lands in change history",
      ],
      travellers: trip.travellers.map((t) => t.name),
      budgetNote: "No direct budget change",
      approveLabel: "Approve outcome",
      onApprove: () => {
        run((t) => ({
          ...t,
          history: [
            {
              id: "hv-" + id,
              kind: "vote",
              text: `Vote settled: ${chosenLabel}`,
              who: sim[id] === "tie" ? "You broke a 2-2 tie as organiser" : "Proposal closed",
              time: "just now",
              approvedBy: "You",
            },
            ...t.history,
          ],
        }));
        notify("Outcome applied. Change history updated.");
      },
    });
  };

  return (
    <Shell title={t("trip.quickVote")} sub={t("group.voteSub")} onBack={back}>
      <div className="content">
        <AiNote>
          Proposals close at their deadline. Zero votes auto-extends the window once; a tie is broken by
          the organiser. Until then, counts are hidden so nobody follows the crowd.
        </AiNote>

        {trip.proposals.map((p) => {
          const voted = submitted.includes(p.id);
          const simState = sim[p.id] ?? "none";
          const tieOpen = simState === "tie";

          return (
            <Card key={p.id} className="vote-card" style={{ padding: 16 }}>
              <div className="spread">
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{p.title}</h3>
                <Badge tone="teal">
                  <IconUsers size={11} /> {p.votesIn}/{p.votesNeeded} voted
                </Badge>
              </div>
              <p className="small muted" style={{ margin: "4px 0 8px" }}>
                {p.desc}
              </p>
              <div className="hstack" style={{ gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                <span className="timer-pill">
                  <IconClock size={13} /> {p.deadline}
                </span>
                {!tieOpen && (
                  <Badge tone="muted">
                    <IconEyeOff size={11} /> Tally hidden
                  </Badge>
                )}
                {p.extended && <Badge tone="warn">Auto-extended once</Badge>}
              </div>

              {p.options.map((o) => {
                const sel = myVotes[p.id] === o.id;
                const disabled = voted;
                return (
                  <label key={o.id} className={`vote-option${disabled ? " disabled" : ""}${sel ? " selected" : ""}`}>
                    <input
                      type="radio"
                      name={p.id}
                      checked={sel}
                      disabled={disabled}
                      onChange={() => setMyVotes((v) => ({ ...v, [p.id]: o.id }))}
                    />
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: "block", fontWeight: 650, fontSize: 14 }}>{o.label}</span>
                      <span className="small muted">{o.note}</span>
                    </span>
                    <span className="vo-price">{money(o.price)}</span>
                  </label>
                );
              })}

              {!voted ? (
                <div className="hstack" style={{ gap: 8, marginTop: 12 }}>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                    disabled={!myVotes[p.id]}
                    onClick={() => {
                      setSubmitted((s) => [...s, p.id]);
                      notify("Vote recorded. Tally still hidden until the deadline.");
                    }}
                  >
                    <IconCheck size={14} /> Submit my vote
                  </button>
                  <span className="small muted">Votes are confidential</span>
                </div>
              ) : (
                <Badge tone="success" style={{ marginTop: 12 }}>
                  <IconCheck size={11} /> Your vote is in
                </Badge>
              )}

              {/* Demo controls for the two edge cases */}
              {p.extended && (
                <div style={{ marginTop: 14, borderTop: "1px dashed var(--border)", paddingTop: 12 }}>
                  <div className="hstack" style={{ gap: 8, marginBottom: 8 }}>
                    <button
                      className="chip"
                      onClick={() => setSim((s) => ({ ...s, [p.id]: simState === "zero" ? "none" : "zero" }))}
                    >
                      <IconRefresh size={13} />
                      {simState === "zero" ? "Hide zero-vote sim" : "Simulate zero-vote auto-extend"}
                    </button>
                  </div>
                  {simState === "zero" && (
                    <Card className="card-teal" style={{ padding: 12 }}>
                      <div className="hstack" style={{ gap: 8 }}>
                        <IconClock size={16} style={{ color: "var(--teal)" }} />
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 650 }}>Zero votes by 18:00</div>
                          <p className="small fg2" style={{ margin: "4px 0 0" }}>
                            Deadline auto-extended to 21:00. If it's still empty, the organiser decides and
                            that lands in change history - never in a silent edit.
                          </p>
                        </div>
                      </div>
                      <button
                        className="btn btn-sm btn-secondary"
                        style={{ marginTop: 10 }}
                        onClick={() => closeProposal(p.id, p.options[0].id)}
                      >
                        Organiser decides
                      </button>
                    </Card>
                  )}
                </div>
              )}

              {!p.extended && (
                <div style={{ marginTop: 14, borderTop: "1px dashed var(--border)", paddingTop: 12 }}>
                  <button
                    className="chip"
                    onClick={() => setSim((s) => ({ ...s, [p.id]: tieOpen ? "none" : "tie" }))}
                  >
                    <IconEyeOff size={13} />
                    {tieOpen ? "Hide tie sim" : "Simulate tie-break"}
                  </button>
                </div>
              )}

              {tieOpen && (
                <Card className="card-teal" style={{ padding: 14, marginTop: 10 }}>
                  <div className="spread" style={{ marginBottom: 8 }}>
                    <b style={{ fontSize: 14 }}>Tie broken by the organiser</b>
                    <Badge tone="teal">2 - 2</Badge>
                  </div>
                  <p className="small fg2" style={{ margin: "0 0 10px" }}>
                    The deadline auto-extended for the tie. As organiser you pick, then the gate confirms.
                  </p>
                  <div className="hstack" style={{ gap: 8 }}>
                    {p.options.map((o) => (
                      <button
                        key={o.id}
                        className="btn btn-sm btn-secondary"
                        style={{ flex: 1 }}
                        onClick={() => closeProposal(p.id, o.id)}
                      >
                        <IconCrown size={13} /> {o.label}
                      </button>
                    ))}
                  </div>
                </Card>
              )}
            </Card>
          );
        })}

        <Card style={{ padding: 12 }}>
          <div className="hstack" style={{ gap: 8 }}>
            <IconShield size={16} className="muted" />
            <p className="small muted" style={{ margin: 0 }}>
              A rejected proposal doesn't edit anyone's plan. The yes-voters get a private alternative in
              chat instead.
            </p>
          </div>
        </Card>
      </div>
    </Shell>
  );
}