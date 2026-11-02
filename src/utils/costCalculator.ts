import { DetectedPothole, MaterialCostEstimate, PwdRateSchedule } from '../types';
import { PWD_SCHEDULES } from '../data/indianRoadsData';

/**
 * Technical formulas according to Indian Road Congress (IRC:SP:100 - Guidelines for Patch Repair of Bituminous Surfaces):
 * 1. Pavement distress patch rectangular cutting margin:
 *    IRC stipulates that patch repairs must be trimmed to clean rectangular edges with at least 75mm - 100mm border around distress perimeter.
 *    Cutting margin factor: ~1.15 to 1.25x net pothole area.
 * 2. Bituminous Mix (DBM / Bituminous Concrete) compacted density:
 *    Standard MoRTH Section 500 compacted density = 2.42 tonnes / m³ (approx 2.4 tonnes / m³).
 * 3. Tack coat application rate:
 *    0.25 to 0.35 kg/m² or ~0.30 litres of RS-1 bitumen emulsion per sq. metre of prepared patch base and vertical edges.
 * 4. Granular Sub-Base / Crushed aggregate:
 *    For potholes deeper than 75mm (0.075m), lower layer is backfilled with compacted 40mm/20mm crushed stone aggregate.
 * 5. Labour productivity:
 *    1 skilled road mason + 3 unskilled labourers can prepare, tack coat, and hand-lay ~8 to 12 m² of patch repair per 8-hour shift.
 * 6. Compaction machinery:
 *    Light tandem roller or plate compactor (hire rate charged per shift or pro-rated with min half-day charge).
 */

export function calculateRepairEstimate(
  potholes: DetectedPothole[],
  schedule: PwdRateSchedule = PWD_SCHEDULES[0],
  customOverrides?: {
    customAreaSqM?: number;
    customDepthCm?: number;
    cuttingMarginPercent?: number;
    customRates?: Partial<PwdRateSchedule>;
  }
): MaterialCostEstimate {
  const mergedSchedule: PwdRateSchedule = {
    ...schedule,
    ...(customOverrides?.customRates || {})
  };

  const cuttingMargin = customOverrides?.cuttingMarginPercent ?? 15;
  const cuttingMultiplier = 1 + cuttingMargin / 100;

  // Compute raw area & depth
  let totalRawAreaSqM = 0;
  let totalRawVolumeCuM = 0;

  if (customOverrides?.customAreaSqM !== undefined && customOverrides.customAreaSqM > 0) {
    totalRawAreaSqM = customOverrides.customAreaSqM;
    const depthM = (customOverrides.customDepthCm ?? 10) / 100;
    totalRawVolumeCuM = totalRawAreaSqM * depthM;
  } else if (potholes.length > 0) {
    for (const p of potholes) {
      const area = p.approxDimensions.areaSqMeters || 0.25;
      const depthM = (p.approxDimensions.depthCm || 8) / 100;
      totalRawAreaSqM += area;
      totalRawVolumeCuM += area * depthM;
    }
  } else {
    // Default fallback baseline 1 sample pothole
    totalRawAreaSqM = 0.5;
    totalRawVolumeCuM = 0.5 * 0.08;
  }

  // Adjusted for standard rectangular saw-cut
  const totalPatchAreaSqM = Math.max(0.1, Number((totalRawAreaSqM * cuttingMultiplier).toFixed(2)));
  const totalPatchVolumeCuM = Math.max(0.01, Number((totalRawVolumeCuM * cuttingMultiplier).toFixed(3)));

  // Material Calculations:
  // Bituminous Concrete / DBM density ~2.4 tonnes/m3
  const asphaltDensityTonnesPerCuM = 2.4;
  const asphaltTonnage = Math.max(0.05, Number((totalPatchVolumeCuM * asphaltDensityTonnesPerCuM).toFixed(2)));
  const asphaltCost = Math.round(asphaltTonnage * mergedSchedule.asphaltPerTonne);

  // Tack coat emulsion: 0.35 L/m2 (including vertical trimmed edges)
  const tackCoatLitres = Math.max(1, Math.round(totalPatchAreaSqM * 0.35));
  const tackCoatCost = Math.round(tackCoatLitres * mergedSchedule.tackCoatPerLitre);

  // Aggregate for base (if avg depth > 7.5cm)
  const avgDepthCm = (totalRawVolumeCuM / (totalRawAreaSqM || 1)) * 100;
  let aggregateCuM = 0;
  if (avgDepthCm > 7.5) {
    aggregateCuM = Number((totalPatchVolumeCuM * 0.35).toFixed(2));
  }
  const aggregateCost = Math.round(aggregateCuM * mergedSchedule.aggregatePerCuM);

  // Labour Calculations:
  // 1 shift can complete up to 10 m2. Minimum 0.5 days charged.
  const labourShifts = Math.max(0.5, Number((totalPatchAreaSqM / 10).toFixed(1)));
  const masonDays = Number((labourShifts * 1).toFixed(1));
  const labourDays = Number((labourShifts * 3).toFixed(1));

  const masonCost = Math.round(masonDays * mergedSchedule.masonPerDay);
  const labourCost = Math.round(labourDays * mergedSchedule.labourPerDay);

  // Machinery:
  // Saw cutter (min 0.5 day)
  const cutterDays = Math.max(0.5, Number((totalPatchAreaSqM / 15).toFixed(1)));
  const cutterCost = Math.round(cutterDays * mergedSchedule.sawCutterPerDay);

  // Tandem Roller / Compactor (min 0.5 day)
  const rollerDays = Math.max(0.5, Number((totalPatchAreaSqM / 20).toFixed(1)));
  const rollerCost = Math.round(rollerDays * mergedSchedule.rollerHirePerDay);

  const subtotal = asphaltCost + tackCoatCost + aggregateCost + masonCost + labourCost + cutterCost + rollerCost;
  const contingencyCost = Math.round(subtotal * (mergedSchedule.contingencyPercent / 100));
  const totalEstimatedCost = subtotal + contingencyCost;

  return {
    scheduleId: mergedSchedule.id,
    scheduleName: mergedSchedule.name,
    potholeCount: potholes.length || 1,
    totalPatchAreaSqM,
    totalPatchVolumeCuM,
    cuttingMarginPercent: cuttingMargin,
    
    asphaltTonnage,
    asphaltCost,
    tackCoatLitres,
    tackCoatCost,
    aggregateCuM,
    aggregateCost,
    
    masonDays,
    masonCost,
    labourDays,
    labourCost,
    
    rollerDays,
    rollerCost,
    cutterDays,
    cutterCost,
    
    subtotal,
    contingencyCost,
    totalEstimatedCost,
    isPreliminary: true
  };
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}
