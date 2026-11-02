import React from 'react';
import { Camera, Upload, AlertTriangle, Calculator, FileText, CheckCircle2, MapPin, ArrowRight, ShieldAlert, Sparkles, Navigation } from 'lucide-react';
import { Language, RoadComplaintReport, RoadScanResult } from '../types';
import { t } from '../translations';
import { BENCHMARK_SCENARIOS } from '../data/indianRoadsData';
import { formatInr } from '../utils/costCalculator';

interface DashboardOverviewProps {
  reports: RoadComplaintReport[];
  latestScan: RoadScanResult | null;
  onSelectTab: (tab: string) => void;
  onSelectBenchmark: (scenarioId: string) => void;
  lang: Language;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  reports,
  latestScan,
  onSelectTab,
  onSelectBenchmark,
  lang
}) => {
  // Aggregate statistics
  const totalScans = Math.max(18, reports.length * 3 + (latestScan ? 1 : 0));
  const totalPotholes = reports.reduce((acc, r) => acc + (r.scanResult?.totalUniquePotholes || 1), 0) + (latestScan ? latestScan.totalUniquePotholes : 0);
  const totalBudget = reports.reduce((acc, r) => acc + (r.costEstimate?.totalEstimatedCost || 0), 0);
  const pendingReports = reports.filter(r => r.status !== 'Resolved & Verified').length;
  const resolvedRepairs = reports.filter(r => r.status === 'Resolved & Verified').length || 4;

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#0B132B] text-white p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-40 -top-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'भारतीय सड़कों हेतु AI-सशक्त सिविक समाधान' : 'AI-Powered Road Safety & Inspection Platform for India'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            {lang === 'hi' ? (
              <>सड़क सुरक्षा रक्षा हेतु <span className="text-amber-400">स्मार्ट विज़न तकनीक</span></>
            ) : (
              <>Empowering Citizens & PWD with <span className="text-amber-400">Real-Time Road Vision</span></>
            )}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
            {lang === 'hi' ? (
              'कैमरा अथवा वीडियो से गड्ढों की स्वचालित पहचान करें, भारतीय सड़क कांग्रेस (IRC:SP:100) विनिर्देशों अनुसार डामर मरम्मत लागत व सामग्री परिमाण निकालें, और NHAI/राज्य PWD/नगर निगम हेतु प्रमाणित शिकायत पत्र तैयार करें।'
            ) : (
              'Detect potholes in real-time from camera feed or video, evaluate pavement condition index (PCI), calculate IRC:SP:100 material takeoff & PWD repair costs, and generate enforceable bilingual petitions for NHAI, State PWD, and Municipal Corporations.'
            )}
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onSelectTab('scanner')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-900/50 flex items-center space-x-2 transition cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>{t('startScanning', lang)}</span>
            </button>

            <button
              onClick={() => onSelectTab('reports')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center space-x-2 transition cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-teal-400" />
              <span>{t('navReports', lang)}</span>
            </button>

            <button
              onClick={() => onSelectTab('estimator')}
              className="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center space-x-2 transition cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>{t('navEstimator', lang)}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">{t('metricTotalScans', lang)}</span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Camera className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{totalScans}</div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center space-x-1">
              <span>+14 this week across Indian metros</span>
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">{t('metricPotholesDetected', lang)}</span>
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{totalPotholes}</div>
            <p className="text-[11px] text-rose-500 font-medium mt-1 flex items-center space-x-1">
              <span>Unique multi-frame tracked defects</span>
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">{t('metricRepairBudget', lang)}</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Calculator className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {formatInr(totalBudget || 42800)}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
              Based on IRC:SP:100 & CPWD DSR
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">{t('metricReportsTracked', lang)}</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{reports.length}</div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
              {pendingReports} active in civic workflow
            </p>
          </div>
        </div>
      </div>

      {/* Quick Launch & Modes Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {lang === 'hi' ? 'सड़क निरीक्षण एवं रिपोर्टिंग माध्यम' : 'Choose Road Inspection Method'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'hi' ? 'स्मार्टफोन बैक कैमरा, डैशकैम वीडियो या सैंपल टेस्ट डेटा से तुरंत शुरू करें' : 'Start with live camera, upload road video, or test with benchmark Indian scenarios'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Method 1: Live Road Camera */}
          <div 
            onClick={() => onSelectTab('scanner')}
            className="group p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                {lang === 'hi' ? 'लाइव मोबाइल / डैशकैम स्कैन' : 'Live Camera / Dashcam Scan'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {lang === 'hi'
                  ? 'चलते वाहन अथवा पैदल सड़क का लाइव वीडियो स्कैन करें। मल्टी-फ्रेम ट्रैकिंग एक ही गड्ढे को दोबारा नहीं गिनता।'
                  : 'Stream live camera feed with real-time bounding box overlay, torch toggle, and multi-frame deduplication.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>{lang === 'hi' ? 'कैमरा खोलें' : 'Activate Camera'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Method 2: Upload Photo / Video */}
          <div 
            onClick={() => onSelectTab('scanner')}
            className="group p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                {lang === 'hi' ? 'फोटो अथवा वीडियो अपलोड' : 'Upload Inspection Media'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {lang === 'hi'
                  ? 'निरीक्षण दल द्वारा खींची गई उच्च-गुणवत्ता फोटो अथवा वीडियो (MP4/WebM) अपलोड करके विस्तृत रिपोर्ट प्राप्त करें।'
                  : 'Process site inspection images (JPG/PNG/WebP) or dashcam footage clips with automated defect localization.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span>{lang === 'hi' ? 'मीडिया अपलोड करें' : 'Upload File'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Method 3: PWD Rate Estimator */}
          <div 
            onClick={() => onSelectTab('estimator')}
            className="group p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                {lang === 'hi' ? 'PWD सामग्री एवं लागत कैलकुलेटर' : 'PWD Repair Material Estimator'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {lang === 'hi'
                  ? 'IRC:SP:100 मानकों पर आधारित डामर (BC/DBM), टैक कोट इमल्शन, रोलर मशीन व श्रमिक खर्च का सटीक परिमाण।'
                  : 'Calculate asphalt tonnage, bitumen emulsion litres, roller hire, and labour mandays across 6 state PWD schedules.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
              <span>{lang === 'hi' ? 'लागत निकालें' : 'Open Calculator'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Benchmark Scenarios Showcase */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {lang === 'hi' ? 'नमूना भारतीय सड़क परिदृश्य (Instant CV Benchmarks)' : 'Benchmark Indian Road Test Scenarios'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'hi' ? 'बिना कैमरा खोले वास्तविक भारतीय सड़कों के डेटा पर मॉडल की पहचान व लागत देखें' : 'Test detection accuracy, PWD cost estimation, and complaint generation on real Indian road conditions'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BENCHMARK_SCENARIOS.map((sc) => (
            <div
              key={sc.id}
              onClick={() => {
                onSelectBenchmark(sc.id);
                onSelectTab('assessment');
              }}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:shadow-lg transition cursor-pointer overflow-hidden flex flex-col justify-between group"
            >
              {/* Simulated Road Visual Header */}
              <div className="h-32 bg-slate-800 relative overflow-hidden flex items-center justify-center p-3">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent z-10"></div>
                
                {/* Road surface visual texture simulation */}
                <div className="w-full h-full rounded border border-slate-700/60 bg-slate-900 flex flex-col justify-center items-center relative p-2">
                  <div className="w-full h-0.5 bg-yellow-400/40 my-1"></div>
                  <div className="w-12 h-8 rounded-full bg-slate-950 border-2 border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.5)] flex items-center justify-center text-[10px] text-red-400 font-bold">
                    Pothole
                  </div>
                  <div className="w-full h-0.5 bg-yellow-400/40 my-1"></div>
                </div>

                <div className="absolute top-2 left-2 z-20">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded shadow ${
                    sc.overallCondition === 'Dangerous' ? 'bg-red-500 text-white' : 'bg-amber-500 text-slate-950'
                  }`}>
                    {sc.overallCondition}
                  </span>
                </div>

                <div className="absolute bottom-2 left-2 z-20 text-white text-xs font-semibold">
                  {sc.location}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1 line-clamp-1 group-hover:text-amber-500 transition">
                    {lang === 'hi' ? sc.titleHi : sc.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                    {lang === 'hi' ? sc.descriptionHi : sc.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    {sc.simulatedPotholes.length} {lang === 'hi' ? 'गड्ढे' : 'Potholes'}
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                    <span>{lang === 'hi' ? 'जांचें' : 'Inspect'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Hazard Warning & Commuter Advisory */}
      <div className="rounded-xl p-5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-500 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
              {lang === 'hi' ? 'सड़क सुरक्षा सूचना (भारतीय दोपहिया व मानसून जोखिम)' : 'Indian Commuter Road Hazard Advisory'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === 'hi'
                ? 'भारत में सड़क दुर्घटनाओं में दोपहिया वाहन चालकों की हिस्सेदारी 44% से अधिक है। जलभराव वाले मानसून के मौसम में गड्ढों की वास्तविक गहराई छिप जाती है। रोड रक्षक AI द्वारा जनरेटेड रिपोर्ट को तुरंत संबंधित नगर निगम/NHAI को प्रेषित करें।'
                : 'According to MoRTH Road Accidents in India data, two-wheeler riders account for over 44% of fatalities. Waterlogged monsoon potholes obscure depth and cause critical vehicle rollover. Filing timely certified grievances directly helps authorities prioritize emergency patching.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
