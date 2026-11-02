import React from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, ArrowRight, Calculator, FileText, Info, Crosshair, Droplets } from 'lucide-react';
import { Language, RoadScanResult } from '../types';
import { t } from '../translations';

interface AssessmentViewProps {
  scanResult: RoadScanResult | null;
  onProceedToEstimator: () => void;
  onProceedToComplaint: () => void;
  lang: Language;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  scanResult,
  onProceedToEstimator,
  onProceedToComplaint,
  lang
}) => {
  if (!scanResult) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {lang === 'hi' ? 'कोई सक्रिय सड़क स्कैन उपलब्ध नहीं है' : 'No Active Road Scan Found'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          {lang === 'hi'
            ? 'कृपया पहले कैमरा स्कैन चलाएं या डैशबोर्ड से एक नमूना भारतीय सड़क परिदृश्य चुनें।'
            : 'Please run a camera road scan or select a benchmark scenario from the dashboard to view the condition assessment.'}
        </p>
      </div>
    );
  }

  // Count by severity
  const criticalCount = scanResult.potholes.filter(p => p.severity === 'critical').length;
  const highCount = scanResult.potholes.filter(p => p.severity === 'high').length;
  const mediumCount = scanResult.potholes.filter(p => p.severity === 'medium').length;
  const lowCount = scanResult.potholes.filter(p => p.severity === 'low').length;
  const hasWater = scanResult.potholes.some(p => p.waterFilled);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>{t('assessmentTitle', lang)}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">
              {scanResult.detectionMode === 'live_ai' ? 'Gemini 3.8 Flash' : 'Calibrated CV'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('assessmentSubtitle', lang)}
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onProceedToEstimator}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md shadow-amber-950 flex items-center space-x-2 transition cursor-pointer"
          >
            <Calculator className="w-4 h-4" />
            <span>{t('btnProceedToCost', lang)}</span>
          </button>

          <button
            onClick={onProceedToComplaint}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950 flex items-center space-x-2 transition cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>{t('btnProceedToComplaint', lang)}</span>
          </button>
        </div>
      </div>

      {/* Main Score & Severity Diagnostic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* PCI Index Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t('pciScore', lang)}</span>
            <Info className="w-4 h-4" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-black text-slate-900 dark:text-white">{scanResult.pciScore}</span>
            <span className="text-sm text-slate-400 font-semibold">/ 100</span>
          </div>
          {/* Progress gauge bar */}
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-3">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                scanResult.pciScore > 75
                  ? 'bg-emerald-500'
                  : scanResult.pciScore > 45
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${scanResult.pciScore}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">
            Standard ASTM D6433 Pavement Rating
          </p>
        </div>

        {/* Overall Condition Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t('overallCondition', lang)}</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <div className={`text-2xl font-black ${
              scanResult.overallCondition === 'Dangerous' ? 'text-red-500' : 'text-amber-500'
            }`}>
              {scanResult.overallCondition}
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Surface: {scanResult.surfaceType || 'Bituminous Asphalt'}
            </p>
          </div>
          <div className="mt-3 text-[11px] font-semibold text-slate-400">
            {scanResult.totalUniquePotholes} Total Unique Potholes
          </div>
        </div>

        {/* Commuter Safety Hazard */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t('safetyRisk', lang)}</span>
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <div className="text-xl font-black text-rose-500">
              {scanResult.commuterSafetyRisk}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Indian 2-Wheeler Skid Hazard
            </p>
          </div>
          {hasWater && (
            <div className="mt-2 flex items-center space-x-1 text-[11px] font-semibold text-blue-500">
              <Droplets className="w-3.5 h-3.5" />
              <span>Waterlogged Monsoon Crater</span>
            </div>
          )}
        </div>

        {/* Repair Priority */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t('repairPriority', lang)}</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <div className="text-base font-black text-slate-900 dark:text-white">
              {scanResult.repairPriority}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              MoRTH Emergency Response Matrix
            </p>
          </div>
          <div className="mt-3 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            Escalation Ready
          </div>
        </div>
      </div>

      {/* Severity Breakdown Bar */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Distress Severity Breakdown
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-between">
            <span className="font-semibold text-red-500">{t('severityCritical', lang)}</span>
            <span className="font-extrabold text-red-600 dark:text-red-400 text-sm">{criticalCount}</span>
          </div>

          <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-between">
            <span className="font-semibold text-orange-500">{t('severityHigh', lang)}</span>
            <span className="font-extrabold text-orange-600 dark:text-orange-400 text-sm">{highCount}</span>
          </div>

          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <span className="font-semibold text-amber-500">{t('severityMedium', lang)}</span>
            <span className="font-extrabold text-amber-600 dark:text-amber-400 text-sm">{mediumCount}</span>
          </div>

          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-between">
            <span className="font-semibold text-yellow-600 dark:text-yellow-500">{t('severityLow', lang)}</span>
            <span className="font-extrabold text-yellow-600 dark:text-yellow-400 text-sm">{lowCount}</span>
          </div>
        </div>
      </div>

      {/* Primary Engineering Recommendation */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-2">
          <Crosshair className="w-4 h-4 text-amber-500" />
          <span>IRC:SP:100 Engineering Diagnosis & Action Plan</span>
        </h3>
        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          {scanResult.primaryRecommendation}
        </p>

        {/* Commuter Risk Advisory */}
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-300 space-y-1">
          <p className="font-bold flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Specific Indian Traffic Risk Factor:</span>
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-700 dark:text-slate-300 pl-1">
            <li>{t('hazardTwoWheeler', lang)}</li>
            <li>{t('hazardAutoRickshaw', lang)}</li>
            {hasWater && <li>{t('hazardWaterlogged', lang)}</li>}
          </ul>
        </div>
      </div>

      {/* Detected Potholes Detail Roster */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Detailed Pothole Geometry & Risk Analysis
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            {scanResult.potholes.length} Detected Items
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Est. Dimensions (L × W)</th>
                <th className="px-4 py-3">Est. Depth</th>
                <th className="px-4 py-3">Area (m²)</th>
                <th className="px-4 py-3">Shape</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3">Commuter Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {scanResult.potholes.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{p.id}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        p.severity === 'critical'
                          ? 'bg-red-500/10 text-red-500 border border-red-500/30'
                          : p.severity === 'high'
                          ? 'bg-orange-500/10 text-orange-500 border border-orange-500/30'
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                      }`}
                    >
                      {p.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono">
                    {p.approxDimensions.lengthCm} × {p.approxDimensions.widthCm} cm
                  </td>
                  <td className="px-4 py-3 font-mono">
                    ~{p.approxDimensions.depthCm} cm
                  </td>
                  <td className="px-4 py-3 font-mono">
                    {p.approxDimensions.areaSqMeters} m²
                  </td>
                  <td className="px-4 py-3 capitalize">{p.shape || 'irregular'}</td>
                  <td className="px-4 py-3 font-mono font-bold text-emerald-500">
                    {Math.round(p.confidence * 100)}%
                  </td>
                  <td className="px-4 py-3 max-w-xs text-slate-500 truncate" title={p.commuterHazard}>
                    {p.commuterHazard || 'Rim deformation'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Optical Depth Measurement Disclaimer Note */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start space-x-2">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-700 dark:text-slate-300">Optical Dimension Notice:</strong> Ordinary single-camera 2D photographs provide geometric perspective estimates. True millimeter-depth profiling requires stereoscopic cameras, LiDAR telemetry, or a calibrated physical reference scale (such as a standard 10 Rupee coin or PWD measurement rod). RoadRakshak AI applies ground-plane regression calibrated to standard 3.5m Indian carriageway lanes.
        </p>
      </div>
    </div>
  );
};
