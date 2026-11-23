import type { SVGProps } from "react";
export type IconName = "home" | "groups" | "book" | "tasks" | "wallet" | "chart" | "user" | "calendar" | "arrow" | "menu" | "close" | "logout" | "refresh";
const paths: Record<IconName, string> = {
  home: "m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8",
  groups: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.87M15 3.13a4 4 0 0 1 0 7.75M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  book: "M12 7v14M3 3h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5v16h-5a4 4 0 0 0-4 2 4 4 0 0 0-4-2H3Z",
  tasks: "M9 5h10v16H5V5h4M9 3h6v4H9ZM9 12h6M9 16h4",
  wallet: "M3 6h17v15H3ZM3 6V3h14v3M15 11h6v5h-6Z",
  chart: "M3 3v18h18M7 16v-5M12 16V7M17 16V4",
  user: "M20 21v-2a6 6 0 0 0-6-6h-4a6 6 0 0 0-6 6v2M16 5a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  calendar: "M3 5h18v16H3ZM3 10h18M7 3v4M17 3v4M7 14h2M13 14h2",
  arrow: "M5 12h14m-5-5 5 5-5 5", menu: "M4 6h16M4 12h16M4 18h16", close: "m6 6 12 12M6 18 18 6",
  logout: "M9 3H3v18h6M9 12h12m-5-5 5 5-5 5", refresh: "M20 7V3m0 4h-4M4 17v4m0-4h4M5 8a8 8 0 0 1 15-1M4 17a8 8 0 0 0 15-1",
};
export default function AppIcon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name]} /></svg>;
}
