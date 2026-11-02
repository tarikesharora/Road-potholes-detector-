import React, { useState, useEffect } from 'react';
import { Calculator, Settings2, FileText, Check, RotateCcw, Info, ArrowRight, ShieldCheck } from 'lucide-react';
import { Language, MaterialCostEstimate, PwdRateSchedule, RoadScanResult } from '../types';
import { t } from '../translations';
import { PWD_SCHEDULES } from '../data/indianRoadsData';
import { calculateRepairEstimate, formatInr } from '../utils/costCalculator';

interface CostEstimatorViewProps {
  scanResult: RoadScanResult | null;
  currentEstimate: MaterialCostEstimate | null;
  onUpdateEstimate: (estimate: MaterialCostEstimate) => void;
  onProceedToComplaint: () => void;
  lang: Language;
}

export const CostEstimatorView: React.FC<CostEstimatorViewProps> = ({
  scanResult,
  currentEstimate,
  onUpdateEstimate,
  onProceedToComplaint,
  lang
}) => {
  // Selected PWD Schedule
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>(
    currentEstimate?.scheduleId || PWD_SCHEDULES[0].id
  );

  // Dimension & Engineering Overrides
  const defaultArea = scanResult?.potholes.reduce((acc, p) => acc + p.approxDimensions.areaSqMeters, 0) || 0.65;
  const defaultDepth = scanResult?.potholes.length 
    ? Math.round(scanResult.potholes.reduce((acc, p) => acc + p.approxDimensions.depthCm, 0) / scanResult.potholes.length)
    : 10;

  const [patchArea, setPatchArea] = useState<number>(
    currentEstimate ? currentEstimate.totalPatchAreaSqM : Number(defaultArea.toFixed(2))
  );
  const [patchDepthCm, setPatchDepthCm] = useState<number>(defaultDepth || 10);
  const [cuttingMargin, setCuttingMargin] = useState<number>(15);

  // Custom Unit Rate Overrides
  const [isEditingRates, setIsEditingRates] = useState<boolean>(false);
  const currentSchedule = PWD_SCHEDULES.find(s => s.id === selectedScheduleId) || PWD_SCHEDULES[0];
  
  const [asphaltRate, setAsphaltRate] = useState<number>(currentSchedule.asphaltPerTonne);
  const [tackCoatRate, setTackCoatRate] = useState<number>(currentSchedule.tackCoatPerLitre);
  const [aggregateRate, setAggregateRate] = useState<number>(currentSchedule.aggregatePerCuM);
  const [masonRate, setMasonRate] = useState<number>(currentSchedule.masonPerDay);
  const [labourRate, setLabourRate] = useState<number>(currentSchedule.labourPerDay);
  const [rollerRate, setRollerRate] = useState<number>(currentSchedule.rollerHirePerDay);
  const [cutterRate, setCutterRate] = useState<number>(currentSchedule.sawCutterPerDay);

  // Sync when schedule changes
  useEffect(() => {
    setAsphaltRate(currentSchedule.asphaltPerTonne);
    setTackCoatRate(currentSchedule.tackCoatPerLitre);
    setAggregateRate(currentSchedule.aggregatePerCuM);
    setMasonRate(currentSchedule.masonPerDay);
    setLabourRate(currentSchedule.labourPerDay);
    setRollerRate(currentSchedule.rollerHirePerDay);
    setCutterRate(currentSchedule.sawCutterPerDay);
  }, [selectedScheduleId]);

  // Recalculate estimate whenever inputs change
  useEffect(() => {
    const updated = calculateRepairEstimate(
      scanResult?.potholes || [],
      currentSchedule,
      {
        customAreaSqM: patchArea,
        customDepthCm: patchDepthCm,
        cuttingMarginPercent: cuttingMargin,
        customRates: {
          asphaltPerTonne: asphaltRate,
          tackCoatPerLitre: tackCoatRate,
          aggregatePerCuM: aggregateRate,
          masonPerDay: masonRate,
          labourPerDay: labourRate,
          rollerHirePerDay: rollerRate,
          sawCutterPerDay: cutterRate,
        }
      }
    );
    onUpdateEstimate(updated);
  }, [
    selectedScheduleId,
    patchArea,
    patchDepthCm,
    cuttingMargin,
    asphaltRate,
    tackCoatRate,
    aggregateRate,
    masonRate,
    labourRate,
    rollerRate,
    cutterRate
  ]);

  const estimate = currentEstimate || calculateRepairEstimate(scanResult?.potholes || [], currentSchedule);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>{t('estimatorTitle', lang)}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-bold border border-amber-500/20">
              IRC:SP:100 & MoRTH
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('estimatorSubtitle', lang)}
          </p>
        </div>

        <button
          onClick={onProceedToComplaint}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950 flex items-center space-x-2 transition cursor-pointer self-start sm:self-auto"
        >
          <FileText className="w-4 h-4" />
          <span>{t('btnProceedToComplaint', lang)}</span>
        </button>
      </div>

      {/* Main Estimator Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Dimensions & Schedule Settings (1 col) */}
        <div className="space-y-5">
          {/* Schedule of Rates Selector */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>{t('scheduleOfRates', lang)}</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                {t('selectSchedule', lang)}
              </label>
              <select
                value={selectedScheduleId}
                onChange={(e) => setSelectedScheduleId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none"
              >
                {PWD_SCHEDULES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.state})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Benchmark Base:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{currentSchedule.state}</span>
            </div>
          </div>

          {/* Dimension Controls */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-2">
              <Settings2 className="w-4 h-4 text-amber-500" />
              <span>{t('potholeDimensions', lang)}</span>
            </h3>

            {/* Patch Area Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-600 dark:text-slate-300">Total Patch Area:</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{patchArea} m²</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="25.0"
                step="0.05"
                value={patchArea}
                onChange={(e) => setPatchArea(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0.1 m² (Single Spot)</span>
                <span>25 m² (Continuous Stretch)</span>
              </div>
            </div>

            {/* Depth Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-600 dark:text-slate-300">Average Depth:</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{patchDepthCm} cm</span>
              </div>
              <input
                type="range"
                min="3"
                max="30"
                step="1"
                value={patchDepthCm}
                onChange={(e) => setPatchDepthCm(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>3 cm (Surface Scrape)</span>
                <span>30 cm (Sub-base Crater)</span>
              </div>
            </div>

            {/* Cutting Margin */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-600 dark:text-slate-300">Rectangular Saw-Cut Allowance:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">+{cuttingMargin}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={cuttingMargin}
                onChange={(e) => setCuttingMargin(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 leading-tight">
                IRC:SP:100 Clause 4.3 mandates saw-cutting squared edges at least 75-100mm beyond visible cracks.
              </p>
            </div>
          </div>

          {/* Unit Rates Editor Toggle */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">Local Tender Rates Editor</h4>
              <button
                onClick={() => setIsEditingRates(!isEditingRates)}
                className="text-xs text-amber-500 hover:text-amber-400 font-semibold"
              >
                {isEditingRates ? 'Done' : 'Customize'}
              </button>
            </div>

            {isEditingRates && (
              <div className="space-y-2.5 pt-2 text-xs">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Bituminous Mix (₹/Tonne)</label>
                  <input
                    type="number"
                    value={asphaltRate}
                    onChange={(e) => setAsphaltRate(Number(e.target.value))}
                    className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Tack Coat Emulsion (₹/Litre)</label>
                  <input
                    type="number"
                    value={tackCoatRate}
                    onChange={(e) => setTackCoatRate(Number(e.target.value))}
                    className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Roller Hire (₹/Day)</label>
                  <input
                    type="number"
                    value={rollerRate}
                    onChange={(e) => setRollerRate(Number(e.target.value))}
                    className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Bill of Quantities (BOQ) & Total (2 cols) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Total Cost Highlight Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-slate-900 border border-amber-500/30 shadow-lg text-slate-900 dark:text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                {t('totalEstimatedBudget', lang)}
              </span>
              <div className="text-3xl sm:text-5xl font-black text-amber-500 font-sans mt-1">
                {formatInr(estimate.totalEstimatedCost)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Estimated for {estimate.totalPatchAreaSqM} m² ({estimate.totalPatchVolumeCuM} m³ compacted volume)
              </p>
            </div>

            <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6 space-y-1 text-xs">
              <div className="text-slate-400">Contingency & Taxes (7%):</div>
              <div className="font-bold text-slate-200 font-mono">{formatInr(estimate.contingencyCost)}</div>
              <div className="text-slate-400 pt-1">Schedule:</div>
              <div className="font-medium text-emerald-400">{estimate.scheduleName}</div>
            </div>
          </div>

          {/* Bill of Quantities (BOQ) Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Itemized Material & Labour Takeoff (BOQ)
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500">
                MoRTH Section 3000
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {/* Material 1: Bituminous Concrete */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {t('materialBituminousConcrete', lang)}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Hot Dense Bituminous Macadam (DBM) compacted at ~2.4 tonnes/m³.
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900 dark:text-white text-sm font-mono">
                    {formatInr(estimate.asphaltCost)}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {estimate.asphaltTonnage} Tonnes @ {formatInr(currentSchedule.asphaltPerTonne)}/T
                  </div>
                </div>
              </div>

              {/* Material 2: Tack Coat */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {t('materialTackCoat', lang)}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Rapid Setting RS-1 bitumen emulsion sprayed at 0.35 L/m² for binding.
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900 dark:text-white text-sm font-mono">
                    {formatInr(estimate.tackCoatCost)}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {estimate.tackCoatLitres} Litres @ {formatInr(currentSchedule.tackCoatPerLitre)}/L
                  </div>
                </div>
              </div>

              {/* Material 3: Crushed Aggregate Base */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {t('materialAggregate', lang)}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    40mm/20mm crushed stone aggregate for bottom crater stabilization.
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900 dark:text-white text-sm font-mono">
                    {formatInr(estimate.aggregateCost)}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {estimate.aggregateCuM} m³ @ {formatInr(currentSchedule.aggregatePerCuM)}/m³
                  </div>
                </div>
              </div>

              {/* Labour Component */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {t('labourMason', lang)} & {t('labourGeneral', lang)}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Site preparation, asphalt leveling, raking, and joint sealing crew.
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900 dark:text-white text-sm font-mono">
                    {formatInr(estimate.masonCost + estimate.labourCost)}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {estimate.masonDays} Mason + {estimate.labourDays} Crew Days
                  </div>
                </div>
              </div>

              {/* Machinery & Equipment */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {t('machineryRoller', lang)} & {t('machineryCutter', lang)}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Tandem vibratory roller for compaction + diamond blade road saw.
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900 dark:text-white text-sm font-mono">
                    {formatInr(estimate.rollerCost + estimate.cutterCost)}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {estimate.rollerDays} Roller + {estimate.cutterDays} Cutter Days
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Disclaimer & Transparency Note */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start space-x-2">
            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {t('costDisclaimer', lang)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
