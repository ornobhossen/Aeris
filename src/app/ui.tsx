"use client";

import type { CSSProperties, ReactNode } from "react";
import type { Screen } from "./data";
import { useApp } from "./store";
import {
  IconBack,
  IconBattery,
  IconChevronRight,
  IconConnection,
  IconCheck,
  IconShield,
  IconAlert,
  IconSparkle,
  IconCrown,
  IconWifi,
  type IconProps,
} from "./icons";

/* ───────────── Phone chrome (rendered once in page.tsx) ───────────── */

export function StatusBar() {
  return (
    <>
      <div className="camera-dot" />
      <div className="status-bar" aria-hidden="true">
        <span className="status-time">09:41</span>
        <span className="status-cutout-zone" />
        <span className="status-icons">
          <IconConnection className="connectivity" />
          <IconWifi className="wifi" />
          <IconBattery className="battery" />
        </span>
      </div>
      <div className="gesture-indicator" />
    </>
  );
}

/* ───────────── Layout atoms ───────────── */

export interface NavTab {
  key: Screen;
  label: string;
  icon: (p: IconProps) => ReactNode;
}

export function BottomNav({
  tabs,
  active,
}: {
  tabs: NavTab[];
  active: Screen;
}) {
  const { go, back, t } = useApp();
  return (
    <nav className="bottom-nav" aria-label={t("nav.tripNavAria")}>
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            className={`nav-item${isActive ? " active" : ""}`}
            aria-current={isActive ? "page" : undefined}
            onClick={() => (isActive ? back() : go(t.key))}
          >
            <Icon />
            <span>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function Shell({
  children,
  title,
  sub,
  onBack,
  header,
  className = "",
}: {
  children: ReactNode;
  title?: string;
  sub?: ReactNode;
  onBack?: () => void;
  header?: ReactNode;
  className?: string;
}) {
  const { t } = useApp();
  return (
    <div className={`screen-flex ${className}`} data-phone-screen="true">
      {header ?? (
        <header className="top-bar">
          {onBack && (
            <button className="tb-btn" onClick={onBack} aria-label={t("common.backAria")}>
              <IconBack />
            </button>
          )}
          <div className="tb-text">
            <h2>{title}</h2>
            {sub && <div className="tb-sub">{sub}</div>}
          </div>
        </header>
      )}
      <div className="screen-scroll">{children}</div>
    </div>
  );
}

export function Section({
  title,
  action,
  children,
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="section">
      {(title || action) && (
        <div className="section-row">
          {title && <h3 className="section-title">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Card({
  children,
  className = "",
  onClick,
  style,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`card${onClick ? " card-press" : ""} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={style}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick();
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}

export function Avatar({
  name,
  initials,
  color,
  size = "md",
}: {
  name: string;
  initials: string;
  color: string;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={`avatar${size === "sm" ? " avatar-sm" : ""}`}
      style={{ background: color }}
      title={name}
      aria-label={name}
    >
      {initials}
    </span>
  );
}

export function Photo({
  src,
  ratio,
  alt,
  className = "",
}: {
  src?: string;
  ratio?: string;
  alt?: string;
  className?: string;
}) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt={alt ?? ""}
      loading="lazy"
      className={`od-media ${className}`}
      style={{ aspectRatio: ratio ?? "auto" }}
    />
  );
}

export function Progress({
  pct,
  className = "",
  style,
}: {
  pct: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`progress-bar ${className}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      style={style}
    >
      <div className="progress-fill" style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
    </div>
  );
}

export function Badge({
  tone = "muted",
  children,
  style,
}: {
  tone?: "success" | "warn" | "danger" | "ai" | "teal" | "muted" | "outline";
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <span className={`badge badge-${tone}`} style={style}>
      {children}
    </span>
  );
}

export function Dot({ tone = "success" }: { tone?: "success" | "warn" | "danger" | "ai" | "teal" | "muted" }) {
  return <span className={`badge-dot dot-${tone}`} style={{ background: "currentColor" }} aria-hidden="true" />;
}

export function AiNote({ children }: { children: ReactNode }) {
  return (
    <div className="ai-note">
      <IconSparkle />
      <span>{children}</span>
    </div>
  );
}

export function SectionLink({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button className="btn-ghost btn-sm" onClick={onClick}>
      {label}
    </button>
  );
}

export function RowArrow() {
  return <IconChevronRight />;
}

export function VerifySeal() {
  return (
    <span className="badge badge-teal" title="Final decision has approval signatures">
      <IconShield size={12} />
      N/A
    </span>
  );
}

export function DivisionNote() {
  return (
    <div className="ai-note">
      <IconSparkle />
      <span>
        This proposal goes through the approval gate. Declining here hands each Yes voter a private alternative; the plan itself is never changed silently.
      </span>
    </div>
  );
}

/* ───────────── Approval Gate (Rule 02) ───────────── */

const gateKindMeta = {
  money: { cls: "warn", label: "Money / Expense", Icon: IconAlert },
  schedule: { cls: "", label: "Schedule change", Icon: IconAlert },
  change: { cls: "", label: "Plan change", Icon: IconCheck },
  ai: { cls: "ai", label: "AI suggestion", Icon: IconSparkle },
} as const;

export function ApprovalGate() {
  const { gate, closeGate, notify, t } = useApp();
  if (!gate) return null;
  const meta = gateKindMeta[gate.kind];

  return (
    <div className="gate-overlay" role="dialog" aria-modal="true" aria-label={gate.title}>
      <div className="gate-sheet">
        <div className="gate-grip" />
        <div className="gate-head">
          <div className={`gate-icon ${meta.cls}`}>
            <meta.Icon />
          </div>
          <div>
            <div className="gate-title">{gate.title}</div>
            <div className="gate-sub">{gate.sub}</div>
          </div>
        </div>

        <div className="gate-zone">
          <div className="gate-zone-label">
            <IconShield size={14} /> {t("gate.beforeAfter")}
          </div>
          <div className="diff-table">
            {gate.diffs.map((d, i) => (
              <div className="diff-row" key={i}>
                <div className="diff-cell">
                  <label>{d.label}</label>
                  <span className="diff-old">{d.old}</span>
                </div>
                <div className="diff-cell">
                  <label>{t("gate.changesTo")}</label>
                  <span className="diff-new">{d.mine}</span>
                </div>
                <div className="diff-cell">
                  <label>{t("gate.delta")}</label>
                  <span className="diff-same">{d.delta ?? "\u2014"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {gate.conditions.length > 0 && (
          <div className="gate-zone">
            <div className="gate-zone-label">{t("gate.conditions")}</div>
            <div className="gate-badges">
              {gate.conditions.map((c) => (
                <Badge key={c} tone="outline">
                  {c}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="gate-zone">
          <div className="gate-zone-label">{t("gate.affects", { n: gate.travellers.length })}</div>
          <div className="gate-travellers">
            {gate.travellers.map((t) => (
              <Badge key={t} tone="teal">
                <Dot tone="teal" />
                {t}
              </Badge>
            ))}
            {gate.budgetNote && <Badge tone="outline">{gate.budgetNote}</Badge>}
          </div>
        </div>

        <div className="gate-actions">
          <button
            className="btn btn-primary btn-full"
            onClick={() => {
              gate.onApprove();
              closeGate();
              notify(t("gate.applied"));
            }}
          >
            {gate.approveLabel}
          </button>
          <button
            className="btn btn-secondary btn-full"
            onClick={() => {
              closeGate();
              notify(t("gate.rejected"));
            }}
          >
            {t("gate.reject")}
          </button>
          <span className="gate-backlink">
            <IconBack size={15} /> {t("gate.backHint")}
          </span>
        </div>
      </div>
    </div>
  );
}

export function OrganiserChip({ name }: { name: string }) {
  return (
    <span className="badge badge-outline">
      <IconCrown size={12} />
      {name}, organiser
    </span>
  );
}