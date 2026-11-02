import React, { useState, useEffect } from 'react';
import { FileText, MapPin, Download, Copy, Share2, ExternalLink, Check, AlertCircle, Sparkles, Navigation, Send, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Language, MaterialCostEstimate, RoadComplaintReport, RoadScanResult } from '../types';
import { t } from '../translations';
import { INDIAN_AUTHORITIES, INDIAN_STATES_DISTRICTS } from '../data/indianRoadsData';
import { generateComplaintPdf } from '../utils/pdfGenerator';
import { formatInr } from '../utils/costCalculator';

interface ComplaintGeneratorViewProps {
  scanResult: RoadScanResult | null;
  costEstimate: MaterialCostEstimate | null;
  onSaveReport: (report: RoadComplaintReport) => void;
  lang: Language;
}

export const ComplaintGeneratorView: React.FC<ComplaintGeneratorViewProps> = ({
  scanResult,
  costEstimate,
  onSaveReport,
  lang
}) => {
  // Form State
  const [selectedState, setSelectedState] = useState<string>('Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Mumbai Suburban');
  const [selectedAuthorityId, setSelectedAuthorityId] = useState<string>('mh_pwd_auth');
  const [roadName, setRoadName] = useState<string>('Western Express Highway (WEH)');
  const [landmark, setLandmark] = useState<string>('Near Gundavali Metro Station Pillar 124');
  const [citizenDescription, setCitizenDescription] = useState<string>(
    'Multiple deep potholes along express fast lane, heavily waterlogged during recent rain. Significant hazard for two-wheelers and office commuters.'
  );

  // GPS Coordinates
  const [isFetchingGps, setIsFetchingGps] = useState<boolean>(false);
  const [gpsCoordinates, setGpsCoordinates] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>({
    latitude: 19.1176,
    longitude: 72.8561,
    accuracy: 8
  });
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Generated Grievance Reference
  const [generatedRefId, setGeneratedRefId] = useState<string>(() => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `RR-MH-2026-${randomNum}`;
  });

  const [copied, setCopied] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Update district options when state changes
  const districtOptions = INDIAN_STATES_DISTRICTS[selectedState] || ['Central District', 'North District', 'South District'];

  // Acquire Geolocation
  const acquireGps = () => {
    setIsFetchingGps(true);
    setGpsError(null);

    if (!('geolocation' in navigator)) {
      setGpsError('Geolocation is not supported by your browser.');
      setIsFetchingGps(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoordinates({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        });
        setIsFetchingGps(false);
      },
      (err) => {
        console.warn('GPS location error:', err);
        setGpsError('Could not acquire high-accuracy GPS. Please check location permissions.');
        setIsFetchingGps(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const selectedAuthority = INDIAN_AUTHORITIES.find(a => a.id === selectedAuthorityId) || INDIAN_AUTHORITIES[0];

  // Quick hazard tag inserters
  const addQuickTag = (tag: string) => {
    if (!citizenDescription.includes(tag)) {
      setCitizenDescription(prev => prev ? `${prev} • ${tag}` : tag);
    }
  };

  // Compile final grievance letter (Bilingual support)
  const generateFormalLetter = (inHindi = lang === 'hi') => {
    const totalPotholes = scanResult?.totalUniquePotholes || 1;
    const estBudget = formatInr(costEstimate?.totalEstimatedCost || 6999);
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    if (inHindi) {
      return `सेवा में,
कार्यकारी अभियंता / सक्षम सड़क अधिकारी,
${selectedAuthority.name},
${selectedDistrict}, ${selectedState}।

विषय: सड़क गड्ढों एवं खतरनाक स्थिति की शिकायत एवं तत्काल मरम्मत हेतु औपचारिक ज्ञापन (संदर्भ सं: ${generatedRefId})

महोदय/महोदया,

मैं एतद्द्वारा सूचित करता हूँ कि ${roadName} (${landmark ? 'समीप: ' + landmark : ''}) पर सड़क की स्थिति अत्यधिक जर्जर एवं दुर्घटना संभावित है। रोड रक्षक AI कंप्यूटर विज़न प्रणाली द्वारा किए गए तकनीकी निरीक्षण के अनुसार:

1. पहचाने गए विशिष्ट गड्ढे: ${totalPotholes}
2. सड़क की समग्र स्थिति: ${scanResult?.overallCondition || 'Dangerous'} (PCI स्कोर: ${scanResult?.pciScore || 34}/100)
3. मरम्मत प्राथमिकता: ${scanResult?.repairPriority || 'Emergency (24-48 hrs)'}
4. अनुमानित मरम्मत लागत (IRC:SP:100 मानक अनुसार): ${estBudget}
5. GPS भौगोलिक निर्देशांक: Lat ${gpsCoordinates?.latitude.toFixed(6) || '19.117600'}, Long ${gpsCoordinates?.longitude.toFixed(6) || '72.856100'}

नागरिक विवरण:
${citizenDescription}

मोटर वाहन अधिनियम 1988 की धारा 198 एवं भारतीय सड़क कांग्रेस (IRC) के नागरिक सुरक्षा चार्टर के अंतर्गत, जनहित में उक्त सड़क की शीघ्र डामर पैच मरम्मत करवा कर कृतार्थ करें।

भवदीय,
जागरूक नागरिक (रोड रक्षक AI जनरेटेड साक्ष्य सहित)
दिनांक: ${dateStr}`;
    }

    return `To,
The Executive Engineer / Road Maintenance In-Charge,
${selectedAuthority.name},
District: ${selectedDistrict}, State: ${selectedState}.

Subject: Formal Grievance regarding Severe Road Potholes & Hazardous Pavement Conditions (Ref: ${generatedRefId})

Respected Authority,

I am writing to officially report hazardous road distress and deep potholes along ${roadName} (${landmark ? 'Near: ' + landmark : ''}), which poses an immediate threat of vehicular damage and commuter accidents.

Inspection Findings verified via RoadRakshak AI Computer Vision:
1. Total Unique Potholes Identified: ${totalPotholes}
2. Pavement Condition Index (PCI): ${scanResult?.pciScore || 34}/100 (${scanResult?.overallCondition || 'Dangerous'})
3. Recommended Repair Priority: ${scanResult?.repairPriority || 'Emergency (24-48 hrs)'}
4. Estimated PWD Material & Patch Cost (IRC:SP:100): ${estBudget}
5. GPS Geolocation: Lat ${gpsCoordinates?.latitude.toFixed(6) || '19.117600'}, Long ${gpsCoordinates?.longitude.toFixed(6) || '72.856100'} (Accuracy: ±${Math.round(gpsCoordinates?.accuracy || 8)}m)

Citizen Observation & Ground Impact:
${citizenDescription}

In accordance with Section 198A of the Motor Vehicles Act and National Road Safety guidelines, kindly initiate immediate bitumen patch rectification and issue a remediation work order.

Sincerely,
Concerned Citizen (via RoadRakshak AI Civic Technology Platform)
Date: ${dateStr}`;
  };

  const currentLetterText = generateFormalLetter();

  // Create report object
  const constructReportObject = (): RoadComplaintReport => {
    return {
      id: generatedRefId,
      createdAt: new Date().toISOString(),
      status: 'Logged Locally',
      statusHistory: [
        {
          status: 'Logged Locally',
          timestamp: new Date().toISOString(),
          note: 'Complaint dossier generated with computer vision evidence.'
        }
      ],
      state: selectedState,
      district: selectedDistrict,
      cityMunicipality: selectedDistrict,
      roadAuthority: selectedAuthority.name,
      roadName,
      landmark,
      coordinates: gpsCoordinates ? {
        latitude: gpsCoordinates.latitude,
        longitude: gpsCoordinates.longitude,
        accuracy: gpsCoordinates.accuracy
      } : undefined,
      scanResult: scanResult || {
        scanId: `scan_manual_${Date.now()}`,
        timestamp: new Date().toISOString(),
        potholes: [],
        totalUniquePotholes: 1,
        overallCondition: 'Poor',
        pciScore: 45,
        repairPriority: 'High (3-7 days)',
        commuterSafetyRisk: 'High',
        primaryRecommendation: 'Bituminous patching required.',
        detectionMode: 'demo_fallback'
      },
      costEstimate: costEstimate || {
        scheduleId: 'cpwd_dsr',
        scheduleName: 'CPWD DSR 2023-24',
        potholeCount: 1,
        totalPatchAreaSqM: 0.8,
        totalPatchVolumeCuM: 0.08,
        cuttingMarginPercent: 15,
        asphaltTonnage: 0.19,
        asphaltCost: 988,
        tackCoatLitres: 3,
        tackCoatCost: 225,
        aggregateCuM: 0.02,
        aggregateCost: 29,
        masonDays: 0.5,
        masonCost: 425,
        labourDays: 1.5,
        labourCost: 870,
        rollerDays: 0.5,
        rollerCost: 2100,
        cutterDays: 0.5,
        cutterCost: 900,
        subtotal: 5537,
        contingencyCost: 388,
        totalEstimatedCost: 5925,
        isPreliminary: true
      },
      citizenDescription,
      photoUrl: scanResult?.imageUrl,
      officialPortalUrl: selectedAuthority.portalUrl,
      verifiedSubmission: false
    };
  };

  const handleDownloadPdf = () => {
    const report = constructReportObject();
    generateComplaintPdf(report, lang);
  };

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(currentLetterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveToReports = () => {
    const report = constructReportObject();
    onSaveReport(report);
    setIsSaved(true);
  };

  const handleShareWhatsapp = () => {
    const summary = `🚨 *ROAD DEFECT & POTHOLE REPORT* (${generatedRefId})\n\n📍 *Location:* ${roadName}, ${selectedDistrict}, ${selectedState}\n🏛️ *Authority:* ${selectedAuthority.name}\n⚠️ *Severity:* ${scanResult?.overallCondition || 'Dangerous'} (${scanResult?.totalUniquePotholes || 1} Potholes)\n💰 *Est. PWD Repair Cost:* ${formatInr(costEstimate?.totalEstimatedCost || 6999)}\n\n_Generated via RoadRakshak AI Citizen Platform._`;
    const url = `https://wa.me/?text=${encodeURIComponent(summary)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>{t('complaintTitle', lang)}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">
              Bilingual Legal Format
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('complaintSubtitle', lang)}
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <span className="text-xs text-slate-400">{t('referenceIdLabel', lang)}:</span>
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-amber-400 border border-slate-700">
            {generatedRefId}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Complaint Details Form */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-rose-500" />
            <span>Jurisdiction & Geo-Tagged Location</span>
          </h3>

          {/* State & District Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {t('stateLabel', lang)}
              </label>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  const newDistricts = INDIAN_STATES_DISTRICTS[e.target.value] || [];
                  setSelectedDistrict(newDistricts[0] || '');
                }}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
              >
                {Object.keys(INDIAN_STATES_DISTRICTS).map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {t('districtLabel', lang)}
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
              >
                {districtOptions.map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Road Authority */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              {t('authorityLabel', lang)}
            </label>
            <select
              value={selectedAuthorityId}
              onChange={(e) => setSelectedAuthorityId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
            >
              {INDIAN_AUTHORITIES.map((auth) => (
                <option key={auth.id} value={auth.id}>
                  {auth.name} • {auth.jurisdiction}
                </option>
              ))}
            </select>
          </div>

          {/* Road Name & Landmark */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {t('roadNameLabel', lang)}
              </label>
              <input
                type="text"
                value={roadName}
                onChange={(e) => setRoadName(e.target.value)}
                placeholder="e.g. NH-48 / MG Road"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {t('landmarkLabel', lang)}
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Near Flyover Pillar 124"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          {/* GPS Coordinates Button */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                <Navigation className="w-3.5 h-3.5 text-blue-500" />
                <span>{t('gpsCoordinatesLabel', lang)}</span>
              </span>

              <button
                type="button"
                onClick={acquireGps}
                disabled={isFetchingGps}
                className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] transition cursor-pointer flex items-center space-x-1"
              >
                <span>{isFetchingGps ? 'Locating...' : t('btnFetchGps', lang)}</span>
              </button>
            </div>

            {gpsCoordinates && (
              <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 flex items-center justify-between">
                <span>Lat: {gpsCoordinates.latitude.toFixed(6)}, Long: {gpsCoordinates.longitude.toFixed(6)}</span>
                <span className="text-emerald-500 font-bold">±{Math.round(gpsCoordinates.accuracy)}m</span>
              </div>
            )}

            {gpsError && (
              <p className="text-[11px] text-rose-500">{gpsError}</p>
            )}
          </div>

          {/* Citizen Description & Quick Tags */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {t('citizenNotesLabel', lang)}
              </label>
            </div>

            {/* Quick tags */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {['Waterlogged crater', 'Two-wheeler skid risk', 'Night accident hotspot', 'School zone', 'Heavy truck damage'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addQuickTag(tag)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-amber-500/20 text-slate-600 dark:text-slate-300 text-[10px] font-medium border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                >
                  + {tag}
                </button>
              ))}
            </div>

            <textarea
              rows={4}
              value={citizenDescription}
              onChange={(e) => setCitizenDescription(e.target.value)}
              placeholder={t('citizenNotesPlaceholder', lang)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Right Column: Formal Bilingual Letter Preview & Action Buttons */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex-1 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span>Statutory Grievance Letter Preview</span>
                </h3>
                <span className="text-[11px] font-mono font-bold text-slate-400">
                  {lang === 'hi' ? 'हिंदी प्रारूप' : 'English Format'}
                </span>
              </div>

              {/* Formatted Letter Body */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 font-serif text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line border border-slate-200 dark:border-slate-800 max-h-[380px] overflow-y-auto">
                {currentLetterText}
              </div>
            </div>

            {/* Official Submission Guidance Card */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-700 dark:text-slate-300 space-y-2">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  {t('officialSubmissionDisclaimer', lang)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  href={selectedAuthority.portalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] inline-flex items-center space-x-1.5 transition shadow"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Official {selectedAuthority.type} Portal</span>
                </a>
                <span className="text-[11px] text-slate-400">Helpline: {selectedAuthority.helpline}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <button
                onClick={handleDownloadPdf}
                className="px-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-950 flex items-center justify-center space-x-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>

              <button
                onClick={handleCopyLetter}
                className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center justify-center space-x-1.5 transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                onClick={handleShareWhatsapp}
                className="px-3 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-950 flex items-center justify-center space-x-1.5 transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>

              <button
                onClick={handleSaveToReports}
                disabled={isSaved}
                className={`px-3 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                  isSaved
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-950'
                }`}
              >
                {isSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                <span>{isSaved ? 'Saved!' : 'Log Report'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
