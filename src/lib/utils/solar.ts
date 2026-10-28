/**
 * Calculated Solar Radiation INDEX (estimate - NOT a measurement).
 *
 * The station has no pyranometer / solar sensor, and temperature + humidity
 * cannot yield a physically valid irradiance in W/m². So this is a
 * dimensionless 0-100 index built from Vapour Pressure Deficit (VPD), the
 * standard measure of how dry/warm the air is (dry, hot air generally goes
 * with clear, sunny conditions; humid, cooler air with cloud/rain).
 *
 *   es  = 0.6108 * exp(17.27 * T / (T + 237.3))     saturation vapour pressure [kPa] (Tetens)
 *   VPD = es * (1 - RH / 100)                       [kPa]
 *   index = clamp(VPD / VPD_MAX * 100, 0, 100)      VPD_MAX = 4.0 kPa
 *
 * It is a pure function of ONE row's temperature and humidity, so the live
 * card, the 24 h trend and today's maximum all use identical numbers.
 */
export const SOLAR_INDEX_UNIT = "index";
const VPD_MAX_KPA = 4.0;

export function calcSolarIndex(tC: number | null | undefined, rh: number | null | undefined): number | null {
  if (tC === null || tC === undefined || rh === null || rh === undefined) return null;
  if (!Number.isFinite(tC) || !Number.isFinite(rh)) return null;
  if (tC < -40 || tC > 85 || rh < 0 || rh > 100) return null; // outside BME280 range: invalid, never clamped
  const es = 0.6108 * Math.exp((17.27 * tC) / (tC + 237.3));
  const vpd = es * (1 - rh / 100);
  return Math.min(100, Math.max(0, (vpd / VPD_MAX_KPA) * 100));
}

export type SolarLevel = { label: string; tone: "normal" | "warning" | "orange" | "danger" };

export function solarLevel(index: number): SolarLevel {
  if (index < 25) return { label: "Low", tone: "normal" };
  if (index < 50) return { label: "Moderate", tone: "warning" };
  if (index < 75) return { label: "High", tone: "orange" };
  return { label: "Very high", tone: "danger" };
}
