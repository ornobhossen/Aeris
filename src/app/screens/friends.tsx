"use client";

import { useState } from "react";
import type { Friend } from "../data";
import { FIND_FRIENDS } from "../data";
import { useApp } from "../store";
import { Shell, Card, Avatar, Badge } from "../ui";
import {
  IconUsers,
  IconUser,
  IconPlus,
  IconCheck,
  IconClose,
  IconSearch,
  IconChevronRight,
  IconSend,
  IconSparkle,
} from "../icons";

type Tab = "friends" | "requests" | "find";

const statusBadge = (f: Friend) => {
  if (f.status === "on-trip")
    return (
      <Badge tone="teal">
        <IconUsers size={11} /> {f.tripName ?? "On a trip"}
      </Badge>
    );
  if (f.status === "planning")
    return (
      <Badge tone="ai">
        <IconSparkle size={11} /> {f.tripName ?? "Planning"}
      </Badge>
    );
  return <Badge tone="muted">Idle</Badge>;
};

export function FriendsScreen() {
  const {
    friends,
    requests,
    trips,
    go,
    back,
    acceptFriend,
    dismissFriend,
    addFriend,
    notify,
    t,
  } = useApp();
  const [tab, setTab] = useState<Tab>("friends");
  const [invite, setInvite] = useState<Friend | null>(null);
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [addedIds, setAddedIds] = useState<string[]>([]);

  const claimRequest = (via: string) => {
    const req = requests.find(
      (r) =>
        r.via &&
        via.trim().length > 0 &&
        r.via.toLowerCase().includes(via.trim().toLowerCase())
    );
    if (req) {
      acceptFriend(req.id);
      notify(`${req.name} is now your friend.`);
      return true;
    }
    return false;
  };

  const sendCode = () => {
    if (!code.trim()) return;
    if (!claimRequest(code)) notify("No match yet - Aeris will check and reply shortly.");
    setCode("");
  };

  const sendEmail = () => {
    if (!email.trim()) return;
    const ok = claimRequest(email);
    setEmail("");
    if (!ok) notify("Invitation sent - they'll show up once they accept.");
  };

  const tripPicker = (id: string) => {
    const t = trips[id];
    const already = t.travellers.some((tr) => tr.name === invite?.name);
    notify(
      invite
        ? already
          ? `${invite.name} is already in ${t.name}.`
          : `Invite sent to ${invite.name} for ${t.name}.`
        : "Pick a friend to invite first."
    );
    setInvite(null);
  };

  return (
    <Shell title={t("friends.title")} sub={t("friends.sub")} onBack={back}>
      <div className="tab-bar">
        <button className={`tab-btn${tab === "friends" ? " active" : ""}`} onClick={() => setTab("friends")}>
          {t("friends.title")}
        </button>
        <button className={`tab-btn${tab === "requests" ? " active" : ""}`} onClick={() => setTab("requests")}>
          {t("friends.tabRequests")}{requests.length > 0 ? ` (${requests.length})` : ""}
        </button>
        <button className={`tab-btn${tab === "find" ? " active" : ""}`} onClick={() => setTab("find")}>
          {t("friends.tabFind")}
        </button>
      </div>

      <div className="screen-scroll" style={{ display: "contents" }}>
        {tab === "friends" && (
          <div className="content" style={{ paddingTop: 10 }}>
            <Card style={{ padding: "4px 14px" }}>
              {friends.length === 0 && (
                <p className="small muted" style={{ padding: "10px 0" }}>
                  No friends yet. Use the Find tab or share your invite code.
                </p>
              )}
              {friends.map((f) => (
                <button key={f.id} className="row-link" style={{ paddingLeft: 0, paddingRight: 0 }} onClick={() => setInvite(f)}>
                  <Avatar name={f.name} initials={f.initials} color={f.color} size="md" />
                  <span className="rl-text">
                    <span className="rl-title">{f.name}</span>
                    <span className="rl-sub">{f.blurb}</span>
                  </span>
                  {statusBadge(f)}
                  <IconChevronRight size={16} />
                </button>
              ))}
            </Card>

            <button
              className="btn btn-secondary btn-full"
              style={{ marginTop: 14, borderStyle: "dashed" }}
              onClick={() => setTab("find")}
            >
              <IconPlus size={15} /> Add friends
            </button>

            <p className="small muted" style={{ marginTop: 12 }}>
              Friends can be invited into any trip you organise. Their preferences then feed the same group intents
              in search and voting.
            </p>
          </div>
        )}

        {tab === "requests" && (
          <div className="content" style={{ paddingTop: 10 }}>
            {requests.length === 0 && (
              <div className="empty-state">
                <div className="es-icon">
                  <IconUser size={24} />
                </div>
                <h3>No pending requests</h3>
                <p>New requests arrive here when someone adds you by invite code or email.</p>
              </div>
            )}
            {requests.map((r) => (
              <div key={r.id} className="friend-row">
                <Avatar name={r.name} initials={r.initials} color={r.color} size="md" />
                <div className="rl-text" style={{ flex: 1, minWidth: 0 }}>
                  <div className="rl-title">{r.name}</div>
                  <div className="rl-sub">{r.via} · {r.mutual} mutual</div>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => { acceptFriend(r.id); notify(`${r.name} is now your friend.`); }}>
                  <IconCheck size={13} /> Accept
                </button>
                <button className="btn btn-ghost btn-sm" aria-label={`Decline ${r.name}`} onClick={() => dismissFriend(r.id)}>
                  <IconClose size={15} />
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === "find" && (
          <div className="content" style={{ paddingTop: 10 }}>
            <div className="field">
              <label htmlFor="find-search">{t("friends.searchBy")}</label>
              <div className="search-field">
                <IconSearch size={16} className="muted" />
                <input id="find-search" placeholder={t("friends.searchPh")} aria-label={t("friends.searchBy")} />
              </div>
            </div>

            <div className="field" style={{ marginTop: 14 }}>
              <label htmlFor="invite-code">Add by invite code</label>
              <div className="hstack" style={{ gap: 8 }}>
                <input
                  id="invite-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendCode()}
                  placeholder="AERIS-XXXX"
                  style={{ flex: 1, minWidth: 0 }}
                />
                <button className="btn btn-primary btn-sm" onClick={sendCode}>
                  <IconSend size={14} /> Send
                </button>
              </div>
            </div>

            <div className="field" style={{ marginTop: 14 }}>
              <label htmlFor="find-email">Add by email</label>
              <div className="hstack" style={{ gap: 8 }}>
                <input
                  id="find-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendEmail()}
                  placeholder="name@email.com"
                  style={{ flex: 1, minWidth: 0 }}
                />
                <button className="btn btn-primary btn-sm" onClick={sendEmail}>
                  <IconSend size={14} /> Invite
                </button>
              </div>
            </div>

            <h3 className="section-title" style={{ marginTop: 22 }}>
              Suggested
            </h3>
            <Card style={{ padding: "4px 14px" }}>
              {FIND_FRIENDS.map((f) => {
                const added = addedIds.includes(f.id);
                return (
                  <div key={f.id} className="friend-row">
                    <Avatar name={f.name} initials={f.initials} color={f.color} size="md" />
                    <div className="rl-text" style={{ flex: 1, minWidth: 0 }}>
                      <div className="rl-title">{f.name}</div>
                      <div className="rl-sub">{f.via} · {f.mutual} mutual</div>
                    </div>
                    <button
                      className={`btn btn-sm ${added ? "btn-ghost" : "btn-secondary"}`}
                      disabled={added}
                      onClick={() => {
                        addFriend(f);
                        setAddedIds((prev) => [...prev, f.id]);
                        notify(`${f.name} added to your friends.`);
                      }}
                    >
                      {added ? <><IconCheck size={13} /> Added</> : <><IconPlus size={13} /> Add</>}
                    </button>
                  </div>
                );
              })}
            </Card>
            <p className="small muted" style={{ marginTop: 12 }}>
              Suggested friends come from your contacts and shared trips - you add them, Aeris never invites anyone
              silently.
            </p>
          </div>
        )}
      </div>

      {invite && (
        <div className="gate-overlay" onClick={() => setInvite(null)}>
          <div className="gate-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="gate-grip" />
            <div className="gate-head">
              <div className="gate-icon" style={{ background: "var(--ai-bg)", color: "var(--ai)" }}>
                <IconUsers />
              </div>
              <div>
                <div className="gate-title">Invite {invite.name}</div>
                <div className="gate-sub">Choose a trip to propose them into</div>
              </div>
            </div>
            <div className="gate-zone">
              {Object.values(trips).map((t) => {
                const inside = t.travellers.some((tr) => tr.name === invite.name || tr.id === invite.id);
                return (
                  <button key={t.id} className="row-link" style={{ border: "1px solid var(--border)", borderRadius: 12, marginBottom: 8 }} onClick={() => tripPicker(t.id)}>
                    <Avatar name={t.name} initials={t.name.slice(0, 1)} color="#2563eb" size="md" />
                    <span className="rl-text">
                      <span className="rl-title">
                        {t.name}
                        {inside && <Badge tone="success" style={{ marginLeft: 8 }}>Already in</Badge>}
                      </span>
                      <span className="rl-sub">
                        {t.destination} · {t.dates} · {t.mode === "group" ? "Group" : "Solo"}
                      </span>
                    </span>
                    <IconChevronRight size={16} />
                  </button>
                );
              })}
            </div>
            <p className="small muted" style={{ textAlign: "center", marginTop: 8 }}>
              Inviting adds {invite.name} to the trip's travellers and preferences - it never books anything.
            </p>
          </div>
        </div>
      )}
    </Shell>
  );
}