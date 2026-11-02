import React, { useState } from 'react';
import { MapPin, Search, Filter, Download, ExternalLink, Eye, CheckCircle2, Clock, AlertTriangle, ArrowUpRight, FileText, ChevronRight, X } from 'lucide-react';
import { Language, ReportStatus, RoadComplaintReport } from '../types';
import { t } from '../translations';
import { generateComplaintPdf } from '../utils/pdfGenerator';
import { formatInr } from '../utils/costCalculator';

interface MyReportsViewProps {
  reports: RoadComplaintReport[];
  onUpdateReportStatus: (id: string, newStatus: ReportStatus) => void;
  lang: Language;
}

export const MyReportsView: React.FC<MyReportsViewProps> = ({
  reports,
  onUpdateReportStatus,
  lang
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<RoadComplaintReport | null>(null);

  // Status Milestones
  const statusSteps: ReportStatus[] = [
    'Logged Locally',
    'Submitted to Authority',
    'Work Order Issued',
    'Repair In Progress',
    'Resolved & Verified'
  ];

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.roadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'Resolved & Verified':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
      case 'Repair In Progress':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case 'Work Order Issued':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
      case 'Submitted to Authority':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>{t('reportsTitle', lang)}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">
              Civic Geo-Tracker
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('reportsSubtitle', lang)}
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
          <span>{filteredReports.length} {lang === 'hi' ? 'रिपोर्ट्स प्रदर्शित' : 'Reports Logged'}</span>
        </div>
      </div>

      {/* Interactive Civic Map View (Pan-India Pothole Hotspot Map) */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 z-10 relative">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-rose-500" />
            <h3 className="font-bold text-white text-sm">
              {lang === 'hi' ? 'भारतीय सड़क गड्ढा जीपीएस हॉटस्पॉट मानचित्र' : 'Indian Road Distress Geo-Coordinates'}
            </h3>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span>Dangerous / Critical</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Poor / High Priority</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Verified Repaired</span>
            </span>
          </div>
        </div>

        {/* Map Visualization Container */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
          {/* Stylized Grid Lines resembling GIS map */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>

          {/* India Outline Silhouette (SVG) */}
          <svg className="w-full h-full max-w-xl opacity-20 pointer-events-none" viewBox="0 0 600 600" fill="currentColor">
            <path d="M 300,50 C 330,80 370,120 380,160 C 400,200 480,220 460,260 C 440,300 410,340 370,390 C 340,430 320,490 300,560 C 280,490 260,430 230,390 C 190,340 160,300 140,260 C 120,220 200,200 220,160 C 230,120 270,80 300,50 Z" />
          </svg>

          {/* Render Active Geo-markers */}
          {reports.map((r, idx) => {
            const isSelected = selectedReport?.id === r.id;
            // Map lat/long approximately into relative canvas positions
            // India roughly Lat 8 to 35, Long 68 to 96
            const lat = r.coordinates?.latitude || (19 + idx * 3);
            const lng = r.coordinates?.longitude || (73 + idx * 2);

            // Normalized to percentage
            const topPct = Math.min(85, Math.max(15, 100 - ((lat - 8) / (35 - 8)) * 100));
            const leftPct = Math.min(85, Math.max(15, ((lng - 68) / (96 - 68)) * 100));

            const isDangerous = r.scanResult?.overallCondition === 'Dangerous';
            const isResolved = r.status === 'Resolved & Verified';

            return (
              <div
                key={r.id}
                onClick={() => setSelectedReport(r)}
                style={{ top: `${topPct}%`, left: `${leftPct}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              >
                <div className="relative">
                  {/* Ping effect for critical reports */}
                  {isDangerous && !isResolved && (
                    <span className="absolute -inset-1 rounded-full bg-red-500 animate-ping opacity-75"></span>
                  )}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-lg border-2 border-slate-950 transition-transform group-hover:scale-125 ${
                      isResolved
                        ? 'bg-emerald-500'
                        : isDangerous
                        ? 'bg-red-500'
                        : 'bg-amber-500'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Tooltip on Hover */}
                <div className="hidden group-hover:block absolute bottom-8 left-1/2 -translate-x-1/2 w-48 p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-[11px] shadow-2xl z-30 pointer-events-none">
                  <p className="font-bold text-amber-400">{r.id}</p>
                  <p className="font-semibold truncate">{r.roadName}</p>
                  <p className="text-slate-400 text-[10px]">{r.district}, {r.state}</p>
                  <p className="text-emerald-400 font-mono text-[10px] pt-1">{r.status}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchReports', lang)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
          >
            <option value="all">{t('allStatuses', lang)}</option>
            {statusSteps.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Reports List Table */}
      {filteredReports.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <FileText className="w-10 h-10 text-slate-400 mx-auto" />
          <h4 className="font-bold text-slate-900 dark:text-white text-base">
            {t('emptyReportsTitle', lang)}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {t('emptyReportsDesc', lang)}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((r) => (
            <div
              key={r.id}
              onClick={() => setSelectedReport(r)}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/80 hover:shadow-lg transition cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition">
                    {r.id}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(r.status)}`}>
                    {r.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">
                  {r.roadName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {r.district}, {r.state}
                </p>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                  {r.citizenDescription || 'Road distress with deep potholes.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Est. Budget</span>
                  <span className="font-bold text-amber-500 font-mono">
                    {formatInr(r.costEstimate?.totalEstimatedCost || 0)}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      generateComplaintPdf(r, lang);
                    }}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                    title="Download Official PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-700 dark:text-slate-300 font-semibold text-xs transition flex items-center space-x-1"
                  >
                    <span>View</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Report Detailed Modal / Drawer */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-amber-500">{selectedReport.id}</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedReport.roadName}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedReport.district}, {selectedReport.state} • {selectedReport.roadAuthority}
                </p>
              </div>

              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Remediation Milestone Stepper */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Remediation Workflow Timeline
              </h4>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
                {statusSteps.map((step, idx) => {
                  const currentIdx = statusSteps.indexOf(selectedReport.status);
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={step} className="relative flex items-start space-x-3 text-xs">
                      <div
                        className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center border-2 ${
                          isCompleted
                            ? 'bg-emerald-500 border-emerald-400 text-white'
                            : 'bg-slate-800 border-slate-600 text-slate-500'
                        }`}
                      >
                        {isCompleted && <CheckCircle2 className="w-2.5 h-2.5" />}
                      </div>

                      <div className="flex-1">
                        <span className={`font-bold ${isCurrent ? 'text-amber-400' : isCompleted ? 'text-white' : 'text-slate-500'}`}>
                          {step}
                        </span>
                        {isCurrent && (
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Current active state in civic tracking
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Advance Status Dropdown for Demo/Field Inspector Testing */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Update Status (Field Inspector / Citizen):
              </span>
              <select
                value={selectedReport.status}
                onChange={(e) => {
                  const newSt = e.target.value as ReportStatus;
                  onUpdateReportStatus(selectedReport.id, newSt);
                  setSelectedReport({ ...selectedReport, status: newSt });
                }}
                className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
              >
                {statusSteps.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Action Buttons in Modal */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => generateComplaintPdf(selectedReport, lang)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-2 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{t('btnDownloadPdf', lang)}</span>
              </button>

              {selectedReport.officialPortalUrl && (
                <a
                  href={selectedReport.officialPortalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-2 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{t('btnOpenPortal', lang)}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
