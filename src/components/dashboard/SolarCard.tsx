import { Sun } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { calcSolarIndex, solarLevel, SOLAR_INDEX_UNIT } from "@/lib/utils/solar";
import type { SensorDataRow } from "@/lib/supabase/types";

// Same panel colours as the shared Notice component (unchanged), used here in a compact layout.
const PANEL: Record<string, { bg: string; fg: string }> = {
  normal: { bg: "#e6f6ec", fg: "#166534" },
  warning: { bg: "#fff6d9", fg: "#946200" },
  orange: { bg: "#fff0e0", fg: "#b45309" },
  danger: { bg: "#fdecec", fg: "#c81e1e" },
  unknown: { bg: "#eef2f7", fg: "#475569" },
};

/** No solar sensor exists: this shows a CALCULATED index from BME280 temperature + humidity (see lib/utils/solar.ts). */
export function SolarCard({ envRow }: { envRow: SensorDataRow | null }) {
  const idx = calcSolarIndex(envRow?.temperature, envRow?.humidity);
  const level = idx === null ? null : solarLevel(idx);
  const panel = PANEL[level?.tone ?? "unknown"];
  return (
    <Card className="shrink-0 gap-2">
      <CardHeader icon={<Sun className="h-5 w-5 text-[#f59e0b]" />} iconBg="#fff4d6" title="Solar Radiation" badge={<Badge tone={idx === null ? "unknown" : "info"} label={idx === null ? "UNAVAILABLE" : "ESTIMATED"} />} />
      <div className="flex h-[66px] items-center gap-3">
        <div className="flex h-full min-w-[84px] shrink-0 flex-col items-center justify-center rounded-xl border border-[#e6edf6] bg-[#f8fafd] px-3">
          <span className={`text-[22px] font-bold leading-tight ${idx === null ? "text-[#8a9bb0]" : "text-[#0b2a5b]"}`}>{idx === null ? "N/A" : idx.toFixed(0)}</span>
          <span className="text-[12px] text-[#5d7088]">{SOLAR_INDEX_UNIT}</span>
        </div>
        <div className="flex h-full min-w-0 flex-1 flex-col justify-center overflow-hidden rounded-xl px-2.5 py-1 leading-tight" style={{ backgroundColor: panel.bg, color: panel.fg }}>
          <div className="text-[12.5px] font-bold">{level === null ? "No estimate" : `${level.label} (calculated)`}</div>
          <div className="mt-0.5 text-[10.5px] opacity-90">
            {level === null ? "Valid temperature and humidity are required." : "Estimated from temperature & humidity, not measured."}
          </div>
        </div>
      </div>
    </Card>
  );
}
