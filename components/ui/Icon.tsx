import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Add01Icon,
  Alert02Icon,
  AlertCircleIcon,
  Analytics01Icon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  ArrowUpRight01Icon,
  Calendar01Icon,
  Calendar02Icon,
  Calendar03Icon,
  Call02Icon,
  Car01Icon,
  Cancel01Icon,
  Chat01Icon,
  CheckmarkCircle02Icon,
  CustomerService02Icon,
  CustomerSupportIcon,
  Image01Icon,
  LinkSquare02Icon,
  Location01Icon,
  LockIcon,
  Logout02Icon,
  Menu01Icon,
  Money03Icon,
  PenTool01Icon,
  Settings02Icon,
  Share08Icon,
  SlidersHorizontalIcon,
  StarIcon,
  StarSquareIcon,
  Tag01Icon,
  TaskDone01Icon,
  ToolsIcon,
  Upload01Icon,
  UserGroupIcon,
  UserIcon,
  Wallet02Icon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons";

/**
 * Maps the legacy icon names (Material Symbols style) to Hugeicons.
 * Keeping the same `name` values means every existing <Icon name="..." />
 * usage, and any icon name stored in JSON / admin tabs, keeps working.
 */
const ICON_MAP: Record<string, IconSvgElement> = {
  // Arrows
  arrow_forward: ArrowRight01Icon,
  arrow_back: ArrowLeft01Icon,
  arrow_upward: ArrowUp01Icon,
  arrow_downward: ArrowDown01Icon,
  north_east: ArrowUpRight01Icon,

  // Actions
  add: Add01Icon,
  close: Cancel01Icon,
  menu: Menu01Icon,
  upload: Upload01Icon,
  share: Share08Icon,
  open_in_new: LinkSquare02Icon,
  logout: Logout02Icon,

  // Status
  check_circle: CheckmarkCircle02Icon,
  warning: Alert02Icon,
  error: AlertCircleIcon,

  // Content
  directions_car: Car01Icon,
  support_agent: CustomerSupportIcon,
  person: UserIcon,
  groups: UserGroupIcon,
  lock: LockIcon,
  today: Calendar03Icon,
  star: StarIcon,
  sell: Tag01Icon,
  payments: Money03Icon,
  location_on: Location01Icon,
  image: Image01Icon,
  chat: Chat01Icon,
  call: Call02Icon,
  build: Wrench01Icon,
  draw: PenTool01Icon,

  // Services & advantages (used via the `icon` field in data/services.json)
  calendar_day: Calendar01Icon,
  calendar_week: Calendar02Icon,
  calendar_month: Calendar03Icon,
  tools: ToolsIcon,
  headset: CustomerService02Icon,
  wallet: Wallet02Icon,

  // Admin sidebar & fleet filters
  bar_chart: Analytics01Icon,
  reviews: StarSquareIcon,
  home_repair_service: ToolsIcon,
  assignment: TaskDone01Icon,
  settings: Settings02Icon,
  tune: SlidersHorizontalIcon,
};

/** Used when an unknown icon name is passed, so the UI never breaks. */
const FALLBACK_ICON: IconSvgElement = StarIcon;

/**
 * Renders a Hugeicons icon.
 * The outer span keeps the `.ms` class so all existing CSS (font-size,
 * color, hover transforms, container sizing) continues to control the icon.
 * The SVG itself is sized to 1em, so `text-[18px]`, `text-2xl`, etc. still work.
 */
export default function Icon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const icon = ICON_MAP[name] ?? FALLBACK_ICON;

  return (
    <span className={`ms ${className}`} aria-hidden="true">
      <HugeiconsIcon icon={icon} size="1em" />
    </span>
  );
}
