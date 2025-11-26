export type DashboardList = {
  id: string;
  title: string;
  icon: string;
  value: string;
  url?: string;
  tabs?: Array<{
    name: string;
    value: string;
  }>;
  tip?: string;
  status?: "normal" | "warning" | "critical";
  up?: "water" | "power" | "normal";
};
