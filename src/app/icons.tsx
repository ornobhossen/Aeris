import type { CSSProperties, ReactNode } from "react";

export type IconProps = { size?: number; className?: string; style?: CSSProperties };

function S({
  size = 18,
  className,
  style,
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const IconBack = (p: IconProps) => (
  <S {...p}>
    <path d="M15 6l-6 6 6 6" />
  </S>
);
export const IconChevronRight = (p: IconProps) => (
  <S {...p}>
    <path d="M9 6l6 6-6 6" />
  </S>
);
export const IconChevronDown = (p: IconProps) => (
  <S {...p}>
    <path d="M6 9l6 6 6-6" />
  </S>
);
export const IconClose = (p: IconProps) => (
  <S {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </S>
);
export const IconCheck = (p: IconProps) => (
  <S {...p}>
    <path d="M5 12.5l4.5 4.5L19 7" />
  </S>
);
export const IconCheckCircle = (p: IconProps) => (
  <S {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12.2l2.4 2.4 4.6-5" />
  </S>
);
export const IconPlus = (p: IconProps) => (
  <S {...p}>
    <path d="M12 5v14M5 12h14" />
  </S>
);
export const IconMinus = (p: IconProps) => (
  <S {...p}>
    <path d="M5 12h14" />
  </S>
);
export const IconSearch = (p: IconProps) => (
  <S {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4.4-4.4" />
  </S>
);
export const IconCalendar = (p: IconProps) => (
  <S {...p}>
    <rect x="3.5" y="5" width="17" height="16" rx="3" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </S>
);
export const IconMapPin = (p: IconProps) => (
  <S {...p}>
    <path d="M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.6" />
  </S>
);
export const IconPlane = (p: IconProps) => (
  <S {...p}>
    <path d="M10 3.5l11 4-2 3.5-8.5-2.5L7 14l3 1.5L8 20.5l-3-1L3.5 16 2 19M22 21H12" />
  </S>
);
export const IconSparkle = (p: IconProps) => (
  <S {...p}>
    <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4L12 3z" />
    <path d="M18.5 16l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z" />
  </S>
);
export const IconChat = (p: IconProps) => (
  <S {...p}>
    <path d="M21 12a8.5 8.5 0 01-8.5 8.5c-1.4 0-2.7-.3-3.9-.9L3 21l1.4-5.6A8.5 8.5 0 1121 12z" />
    <path d="M8 11h.01M12 11h.01M16 11h.01" />
  </S>
);
export const IconUsers = (p: IconProps) => (
  <S {...p}>
    <circle cx="9" cy="8.5" r="3.4" />
    <path d="M3 20c.8-3.4 3.3-5 6-5s5.2 1.6 6 5" />
    <path d="M15.5 5.6a3 3 0 010 5.8M17.6 15.4c1.7.6 2.9 2 3.4 4" />
  </S>
);
export const IconUser = (p: IconProps) => (
  <S {...p}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M5 20c.9-3.7 3.7-5.5 7-5.5s6.1 1.8 7 5.5" />
  </S>
);
export const IconWallet = (p: IconProps) => (
  <S {...p}>
    <rect x="3" y="6" width="18" height="14" rx="3" />
    <path d="M3 10h18M16 15h2M7 15h3" />
  </S>
);
export const IconPercent = (p: IconProps) => (
  <S {...p}>
    <path d="M19 5L5 19" />
    <circle cx="7.5" cy="7.5" r="2.5" />
    <circle cx="16.5" cy="16.5" r="2.5" />
  </S>
);
export const IconSwap = (p: IconProps) => (
  <S {...p}>
    <path d="M7 4v13M7 4L4 7M7 4l3 3" />
    <path d="M17 20V7M17 20l-3-3M17 20l3-3" />
  </S>
);
export const IconAlert = (p: IconProps) => (
  <S {...p}>
    <path d="M12 4l9 16H3L12 4z" />
    <path d="M12 10v4.5M12 17.2v.3" />
  </S>
);
export const IconClock = (p: IconProps) => (
  <S {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </S>
);
export const IconHome = (p: IconProps) => (
  <S {...p}>
    <path d="M4 11.5L12 4l8 7.5" />
    <path d="M6 10v9.5h12V10" />
  </S>
);
export const IconInfo = (p: IconProps) => (
  <S {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5.5M12 7.5v.3" />
  </S>
);
export const IconGlobe = (p: IconProps) => (
  <S {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.6 2.3 3.9 5.2 3.9 8.5s-1.3 6.2-3.9 8.5c-2.6-2.3-3.9-5.2-3.9-8.5s1.3-6.2 3.9-8.5z" />
  </S>
);
export const IconBell = (p: IconProps) => (
  <S {...p}>
    <path d="M6 9a6 6 0 0112 0c0 4.5 2 5.5 2 6.5H4c0-1 2-2 2-6.5zM10 19.5a2.2 2.2 0 004 0" />
  </S>
);
export const IconMoon = (p: IconProps) => (
  <S {...p}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </S>
);
export const IconRefresh = (p: IconProps) => (
  <S {...p}>
    <path d="M20 12a8 8 0 11-2.3-5.6M20 4v4h-4" />
  </S>
);
export const IconSend = (p: IconProps) => (
  <S {...p}>
    <path d="M4 12L20 4l-6 16-3.5-5L4 12z" />
  </S>
);
export const IconStar = (p: IconProps) => (
  <S {...p}>
    <path d="M12 4l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 9.7l5.4-.8L12 4z" />
  </S>
);
export const IconShield = (p: IconProps) => (
  <S {...p}>
    <path d="M12 3l7 2.8v5c0 4.6-3 8-7 10.2-4-2.2-7-5.6-7-10.2v-5L12 3z" />
    <path d="M8.8 12l2.4 2.4 4-4.6" />
  </S>
);
export const IconReceipt = (p: IconProps) => (
  <S {...p}>
    <path d="M6 3h12v18l-2.2-1.6L14 21l-2-1.6L10 21l-1.8-1.6L6 21V3z" />
    <path d="M9 8h6M9 12h6" />
  </S>
);
export const IconScale = (p: IconProps) => (
  <S {...p}>
    <path d="M12 4v16M7 20h10M12 8l-6 1M18 9l-6-1" />
    <path d="M4.5 14.5L12 8l7.5 6.5a4.3 4.3 0 01-7.5 2.7 4.3 4.3 0 01-7.5-2.7z" />
  </S>
);
export const IconSettings = (p: IconProps) => (
  <S {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.9 2.9l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.6v.2a2 2 0 11-4 0v-.2a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.9-2.9l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.6-1H3a2 2 0 110-4h.2a1.7 1.7 0 001.6-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.9-2.9l.1.1a1.7 1.7 0 001.9.3h.1a1.7 1.7 0 001-1.6V3a2 2 0 114 0v.2a1.7 1.7 0 001 1.6 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.9 2.9l-.1.1a1.7 1.7 0 00-.3 1.9v.1a1.7 1.7 0 001.6 1h.2a2 2 0 110 4h-.2a1.7 1.7 0 00-1.6 1z" />
  </S>
);
export const IconArrowRight = (p: IconProps) => (
  <S {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </S>
);
export const IconArrowUpRight = (p: IconProps) => (
  <S {...p}>
    <path d="M7 17L17 7M9 7h8v8" />
  </S>
);
export const IconEyeOff = (p: IconProps) => (
  <S {...p}>
    <path d="M4 12s3-5.5 8-5.5 8 5.5 8 5.5-3 5.5-8 5.5-8-5.5-8-5.5z" />
    <path d="M12 9a3 3 0 100 6 3 3 0 000-6zm4.5-3.5L20 12l-3.5 6.5" />
  </S>
);
export const IconLock = (p: IconProps) => (
  <S {...p}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
    <path d="M8 10.5V7.5a4 4 0 018 0v3" />
  </S>
);
export const IconLogOut = (p: IconProps) => (
  <S {...p}>
    <path d="M9 21H5.5a2 2 0 01-2-2V5a2 2 0 012-2H9" />
    <path d="M16 17l5-5-5-5M21 12H9" />
  </S>
);
export const IconTrash = (p: IconProps) => (
  <S {...p}>
    <path d="M4 7h16M9.5 7V5a1.5 1.5 0 011.5-1.5h2A1.5 1.5 0 0114.5 5v2M6.5 7l.8 12a2 2 0 002 1.9h5.4a2 2 0 002-1.9l.8-12" />
    <path d="M10 11v6M14 11v6" />
  </S>
);
export const IconCard = (p: IconProps) => (
  <S {...p}>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="M3 10h18M7 15h4" />
  </S>
);
export const IconCrown = (p: IconProps) => (
  <S {...p}>
    <path d="M4 8l3.5 3.5L12 6l4.5 5.5L20 8l-1.5 10h-13L4 8z" />
  </S>
);
export const IconLandmark = (p: IconProps) => (
  <S {...p}>
    <path d="M4 21h16M6.5 21v-8M12 21v-8M17.5 21v-8M3.5 13h17L12 4 3.5 13z" />
  </S>
);
export const IconUtensils = (p: IconProps) => (
  <S {...p}>
    <path d="M5 3v8M5 11v10M8 3v6a3 3 0 01-6 0V3" />
    <path d="M17 3v18M17 3c2 2 3 4 3 6s-1 3-3 3" />
  </S>
);
export const IconCamera = (p: IconProps) => (
  <S {...p}>
    <path d="M4 8h3l2-3h6l2 3h3a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z" />
    <circle cx="12" cy="13" r="3.5" />
  </S>
);
export const IconBus = (p: IconProps) => (
  <S {...p}>
    <path d="M5 5a7 7 0 0114 0v9a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
    <path d="M5.5 11h13M8 18l-1 3.5M16 18l1 3.5M8.5 14.5h.01M15.5 14.5h.01" />
  </S>
);
export const IconCar = (p: IconProps) => (
  <S {...p}>
    <path d="M5 11l1.3-3.6a2 2 0 011.9-1.3h5.6a2 2 0 011.9 1.3L17 11" />
    <path d="M4 11h16a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4a1 1 0 011-1z" />
    <path d="M6.5 16v1.5M17.5 16v1.5M7.5 13.5h.01M16.5 13.5h.01" />
  </S>
);
export const IconCompass = (p: IconProps) => (
  <S {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M15.7 8.3l-2.1 5.3-5.3 2.1 2.1-5.3 5.3-2.1z" />
  </S>
);
export const IconTicket = (p: IconProps) => (
  <S {...p}>
    <path d="M4 8V6a1 1 0 011-1h14a1 1 0 011 1v2a2.5 2.5 0 000 5v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2a2.5 2.5 0 000-5z" />
    <path d="M13.5 5v.5M13.5 18.5v.5" />
  </S>
);
export const IconWifi = (p: IconProps) => (
  <S {...p}>
    <path d="M12 19h.01M3.5 9a12 12 0 0117 0M6.5 12.5a8 8 0 0111 0M9.5 15.5a4 4 0 015 0" />
  </S>
);
export const IconBattery = (p: IconProps) => (
  <S {...p}>
    <rect x="2" y="7" width="17" height="10" rx="2.5" />
    <path d="M22 10.5v3M6 10v4M9.5 10v4M13 10v4" />
  </S>
);
export const IconConnection = (p: IconProps) => (
  <S {...p}>
    <path d="M5 9a12 12 0 0114 0M8.5 12.5a6.5 6.5 0 017 0M12 16.5h.01" />
  </S>
);

export const iconMap = {
  plane: IconPlane,
  stay: IconHome,
  food: IconUtensils,
  activity: IconLandmark,
  transfer: IconBus,
  car: IconCar,
  guide: IconCompass,
  ticket: IconTicket,
  alert: IconAlert,
  user: IconUser,
  currency: IconPercent,
  card: IconCard,
  chat: IconChat,
  scale: IconScale,
  wallet: IconWallet,
  refresh: IconRefresh,
  info: IconInfo,
  shield: IconShield,
  crown: IconCrown,
  bell: IconBell,
  star: IconStar,
  receipt: IconReceipt,
} as const;

export type IconKey = keyof typeof iconMap;