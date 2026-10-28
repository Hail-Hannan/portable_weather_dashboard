import { Sun } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Notice } from "@/components/ui/Notice";
import { calcSolarIndex, solarLevel, SOLAR_INDEX_UNIT } from "@/lib/utils/solar";
import type { SensorDataRow } from "@/lib/supabase/types";

/** No solar sensor exists: this shows a CALCULATED index from BME280 temperature + humidity (see lib/utils/solar.ts). */
export function SolarCard({ envRow }: { envRow: SensorDataRow | null }) {
  const idx = calcSolarIndex(envRow?.temperature, envRow?.humidity);
  const level = idx === null ? null : solarLevel(idx);
  return (
    <Card className="shrink-0 gap-2">
      <CardHeader icon={<Sun className="h-5 w-5 text-[#f59e0b]" />} iconBg="#fff4d6" title="Solar Radiation" badge={<Badge tone={idx === null ? "unknown" : "info"} label={idx === null ? "UNAVAILABLE" : "ESTIMATED"} />} />
      <div className="flex h-[66px] items-center gap-3">
        <div className="flex h-full min-w-[84px] flex-col items-center justify-center rounded-xl border border-[#e6edf6] bg-[#f8fafd] px-3">
          <span className={`text-[22px] font-bold leading-tight ${idx === null ? "text-[#8a9bb0]" : "text-[#0b2a5b]"}`}>{idx === null ? "N/A" : idx.toFixed(0)}</span>
          <span className="text-[12px] text-[#5d7088]">{SOLAR_INDEX_UNIT}</span>
        </div>
        <div className="min-w-0 flex-1">
          {level === null ? (
            <Notice tone="unknown" title="No estimate">Valid temperature and humidity are required.</Notice>
          ) : (
            <Notice tone={level.tone} title={`${level.label} (calculated)`}>Estimated from temperature &amp; humidity, not measured.</Notice>
          )}
        </div>
      </div>
    </Card>
  );
}
