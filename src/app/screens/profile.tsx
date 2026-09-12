"use client";

import { useState } from "react";
import { LOCALES } from "../data";
import { useApp } from "../store";
import { Shell, Card, Avatar, Section } from "../ui";
import {
  IconLogOut,
  IconTrash,
  IconSettings,
  IconChevronRight,
  IconChevronDown,
  IconGlobe,
  IconShield,
} from "../icons";

export function ProfileScreen() {
  const {
    displayName,
    userName,
    bio,
    setDisplayName,
    setBio,
    country,
    currency,
    currencySymbol,
    go,
    back,
    notify,
    logout,
    deleteAccount,
    avatarColor,
    t,
    locale,
    setLocale,
  } = useApp();

  const [name, setName] = useState(displayName ?? userName ?? "");
  const [bioText, setBioText] = useState(bio);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const current = name.trim() || userName || "You";
  const initials = current
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const save = () => {
    setDisplayName(name.trim() || null);
    setBio(bioText.trim());
    notify(t("profile.saved"));
  };

  return (
    <Shell title={t("profile.title")} onBack={back}>
      <div className="content">
        <div className="vstack" style={{ paddingTop: 8 }}>
          <div className="rail-inline" style={{ justifyContent: "center" }}>
            <Avatar name={current} initials={initials || "Y"} color={avatarColor} />
          </div>
          <h3 style={{ margin: "10px 0 0", textAlign: "center" }}>{current}</h3>
          <p className="center muted" style={{ margin: "2px 0 24px", fontSize: 13 }}>
            {t("settings.profileLine", { country: country || t("settings.noCountry"), sym: currencySymbol, code: currency })}
          </p>

          <div className="field">
            <label>{t("profile.displayName")}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("profile.namePh")}
            />
          </div>
          <div className="field">
            <label>{t("profile.about")}</label>
            <textarea
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              placeholder="e.g. 'Late riser, museum first'"
              rows={3}
            />
          </div>
          <p className="field-help">
            <IconShield size={11} style={{ verticalAlign: -1 }} /> {t("profile.syncNote")}
          </p>
          <button className="btn btn-primary btn-full" onClick={save}>
            {t("profile.saveProfile")}
          </button>

          <Section title={t("profile.review")}>
            <Card style={{ padding: "6px 14px" }}>
              <button className="row-link" style={{ paddingLeft: 0, paddingRight: 0 }} onClick={() => setLangOpen((v) => !v)} aria-expanded={langOpen}>
                <IconSettings size={18} />
                <span className="rl-text">
                  <span className="rl-title">{t("common.language")}</span>
                  <span className="rl-sub">{t("profile.onboardingOnce")}</span>
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
              <button className="row-link" style={{ paddingLeft: 0, paddingRight: 0 }} onClick={() => go("settings")}>
                <IconSettings size={18} />
                <span className="rl-text">
                  <span className="rl-title">{t("common.settings")}</span>
                  <span className="rl-sub">{t("profile.settingsSub")}</span>
                </span>
                <IconChevronRight size={16} />
              </button>
            </Card>
          </Section>

          <div className="vstack" style={{ gap: 10, marginTop: 32 }}>
            <button className="btn btn-secondary btn-full" onClick={logout}>
              <IconLogOut size={15} /> {t("profile.logout")}
            </button>
            <button
              className={`btn btn-full${confirmDelete ? " btn-danger" : " btn-ghost"}`}
              style={{ color: confirmDelete ? undefined : "var(--danger)" }}
              onClick={() => {
                if (!confirmDelete) {
                  setConfirmDelete(true);
                  window.setTimeout(() => setConfirmDelete(false), 4000);
                  return;
                }
                deleteAccount();
              }}
            >
              <IconTrash size={15} /> {confirmDelete ? t("profile.confirmDelete") : t("profile.deleteAccount")}
            </button>
            {!confirmDelete && (
              <p className="center muted small" style={{ margin: 0 }}>
                {t("profile.logoutNote")}
              </p>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}