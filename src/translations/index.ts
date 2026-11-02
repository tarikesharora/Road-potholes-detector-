import { Language } from '../types';

export const translations = {
  en: {
    appName: 'RoadRakshak AI',
    appTagline: 'Smart Pothole Detection & Road Repair Reporting System',
    indiaBadge: 'MoRTH & IRC Guidelines Aligned • India Civic-Tech',
    
    // Navigation
    navDashboard: 'Dashboard',
    navScan: 'Scan Road',
    navAssessment: 'Condition Assessment',
    navEstimator: 'Cost & Material Estimator',
    navComplaint: 'Lodge Grievance',
    navReports: 'My Reports & Map',
    navPortals: 'Authority Portals',
    
    // Header & Actions
    switchLang: 'हिंदी में देखें',
    startScanning: 'Start Road Scan',
    systemStatus: 'CV System Ready',
    demoModeActive: 'Demo / Benchmark Mode Active',
    liveAiActive: 'Live Gemini Vision Model Active',
    
    // Metrics
    metricTotalScans: 'Total Roads Inspected',
    metricPotholesDetected: 'Potholes Identified',
    metricRepairBudget: 'Est. Repair Budget',
    metricReportsTracked: 'Complaints Tracked',
    metricResolvedCases: 'Repairs Completed',
    
    // Scanner
    scannerTitle: 'Real-Time Road Pothole Scanner',
    scannerSubtitle: 'Scan through mobile back camera, dashcam interval, or upload high-res photos and road inspection video.',
    tabLiveCamera: 'Live Road Camera',
    tabUpload: 'Upload Photo / Video',
    tabBenchmarks: 'Sample Road Test Scenarios',
    
    btnStartCamera: 'Activate Camera',
    btnStopCamera: 'Pause Camera',
    btnSnapAnalyze: 'Capture & Analyze Frame',
    btnSwitchCamera: 'Switch Camera',
    btnTorchOn: 'Torch On',
    btnTorchOff: 'Torch Off',
    autoScanInterval: 'Continuous Dashcam Scanning',
    autoScanInfo: 'Scans frame every 2.5s with multi-frame deduplication tracking.',
    
    dropzoneTitle: 'Drag & drop road photo or inspection video here',
    dropzoneSubtitle: 'Supports JPG, PNG, WebP (up to 20MB) and MP4, WebM (up to 100MB)',
    btnBrowseFiles: 'Choose File from Device',
    
    // Calibration
    calibrationTitle: 'Optical Dimension & Calibration Settings',
    calibrationDesc: 'Single 2D images cannot provide millimeter-accurate depth without sensor telemetry. RoadRakshak uses standard Indian lane width (3.5m) and pavement texture cues for reference estimation.',
    refObjectUsed: 'Reference Scale: Standard Highway Lane (3.5m) / Tyre Track (0.22m)',
    
    // Assessment View
    assessmentTitle: 'Road Condition & Pothole Diagnostic Report',
    assessmentSubtitle: 'Automated computer vision breakdown of pavement distress and commuter hazard level.',
    uniquePotholesFound: 'Unique Potholes Detected',
    pciScore: 'Pavement Condition Index (PCI)',
    overallCondition: 'Overall Road Condition',
    safetyRisk: 'Commuter Hazard Rating',
    repairPriority: 'Recommended Repair Priority',
    
    // Severity Labels
    severityLow: 'Low Severity',
    severityMedium: 'Medium Severity',
    severityHigh: 'High Severity',
    severityCritical: 'Critical Hazard',
    
    conditionGood: 'Good Condition',
    conditionFair: 'Fair (Maintenance Needed)',
    conditionPoor: 'Poor (Urgent Attention)',
    conditionDangerous: 'Dangerous (Accident Prone)',
    
    // Commuter risks
    hazardTwoWheeler: 'High risk of two-wheeler skidding / loss of balance, especially at night or monsoon.',
    hazardAutoRickshaw: 'Severe risk of suspension damage and auto-rickshaw overturning.',
    hazardWaterlogged: 'Water-filled crater obscures true depth, causing hidden wheel trapping.',
    
    // Buttons
    btnProceedToCost: 'Calculate PWD Repair Cost',
    btnProceedToComplaint: 'Generate Official Complaint',
    btnDownloadPdf: 'Download Official PDF Report',
    btnCopyLetter: 'Copy Grievance Letter',
    btnShareWhatsapp: 'Share via WhatsApp',
    btnOpenPortal: 'Open Official Grievance Portal',
    
    // Cost Estimator
    estimatorTitle: 'PWD Repair Material & Cost Estimator',
    estimatorSubtitle: 'Engineering takeoff adhering to IRC:SP:100 and MoRTH Specifications for Road Works.',
    scheduleOfRates: 'Applicable Schedule of Rates (SoR)',
    selectSchedule: 'Select State PWD / CPWD DSR Schedule',
    potholeDimensions: 'Patch Dimension & Quantity Takeoff',
    potholeCount: 'Number of Potholes',
    totalPatchArea: 'Total Patch Repair Area',
    totalPatchVolume: 'Total Compacted Asphalt Volume',
    sawCuttingAllowance: 'Saw-Cut Perimeter Margin (+15%)',
    
    // Materials Breakdown
    materialBituminousConcrete: 'Bituminous Concrete (BC / DBM)',
    materialTackCoat: 'Tack Coat Bitumen Emulsion (RS-1)',
    materialAggregate: 'Granular Sub-Base / Crushed Aggregate',
    labourMason: 'Skilled Road Mason (CPWD Rates)',
    labourGeneral: 'Unskilled Road Repair Crew',
    machineryRoller: 'Vibratory Tandem Roller Hire',
    machineryCutter: 'Asphalt Road Saw Cutter Machine',
    contingencyOverhead: 'Contractor Overhead & Contingency (7%)',
    totalEstimatedBudget: 'Total Estimated Repair Cost',
    costDisclaimer: 'Note: Preliminary engineering estimate calculated using Indian Road Congress (IRC:SP:100) formulas. Actual contractor bids may vary by district PWD tender rates.',
    
    // Complaint Form
    complaintTitle: 'India-Specific Government Grievance Generator',
    complaintSubtitle: 'Draft an enforceable, structured petition for NHAI, State PWD, or Municipal Corporation with geo-tagged evidence.',
    stateLabel: 'State / Union Territory',
    districtLabel: 'District',
    authorityLabel: 'Road Owning Authority / Municipal Body',
    roadNameLabel: 'Road Name / Highway Number (e.g., NH-48, MG Road)',
    landmarkLabel: 'Nearest Landmark / Ward / Kilometre Stone',
    gpsCoordinatesLabel: 'GPS Geolocation Coordinates',
    btnFetchGps: 'Acquire Current GPS Location',
    gpsAccuracy: 'Accuracy',
    citizenNotesLabel: 'Citizen Ground Description / Commuter Hazards',
    citizenNotesPlaceholder: 'E.g. Several deep potholes after recent rains causing heavy traffic bottlenecks and multiple two-wheeler accidents near the school crossing...',
    
    referenceIdLabel: 'Unique Grievance Ref No.',
    officialSubmissionDisclaimer: 'Important: RoadRakshak AI generates authenticated grievance documents. Click to open verified state/central grievance portals (e.g. CPGRAMS, Sukhad Yatra, MCGM 24x7) to submit with official acknowledgment.',
    
    // My Reports
    reportsTitle: 'Report Tracker & Civic Geo-Map',
    reportsSubtitle: 'Track remediation milestones from Citizen Logging to PWD Work Order and Final Bitumen Patching.',
    searchReports: 'Search by Ref ID, Road Name, or City...',
    filterStatus: 'Filter Status',
    allStatuses: 'All Statuses',
    statusDraft: 'Draft',
    statusLogged: 'Logged Locally',
    statusSubmitted: 'Submitted to Authority',
    statusWorkOrder: 'Work Order Issued',
    statusInProgress: 'Repair In Progress',
    statusResolved: 'Resolved & Verified',
    emptyReportsTitle: 'No reports filed yet',
    emptyReportsDesc: 'Scan a road or choose a sample scenario to generate your first verified PWD grievance report.',
    
    // Portals
    portalsTitle: 'Indian Government Road Grievance Portals',
    portalsSubtitle: 'Direct links and contact numbers for official road maintenance authorities across India.',
  },
  
  hi: {
    appName: 'रोड रक्षक AI',
    appTagline: 'स्मार्ट गड्ढा पहचान एवं सड़क मरम्मत रिपोर्टिंग प्रणाली',
    indiaBadge: 'MoRTH एवं IRC मानकों के अनुरूप • भारत सिविक-टेक',
    
    // Navigation
    navDashboard: 'डैशबोर्ड',
    navScan: 'सड़क स्कैन करें',
    navAssessment: 'स्थिति आकलन',
    navEstimator: 'लागत व सामग्री आकलन',
    navComplaint: 'शिकायत दर्ज करें',
    navReports: 'मेरी रिपोर्ट्स व मानचित्र',
    navPortals: 'सरकारी पोर्टल',
    
    // Header & Actions
    switchLang: 'View in English',
    startScanning: 'सड़क स्कैन शुरू करें',
    systemStatus: 'CV सिस्टम तैयार',
    demoModeActive: 'डेमो / बेंचमार्क मोड सक्रिय',
    liveAiActive: 'सक्रिय जेमिनी विज़न AI मॉडल',
    
    // Metrics
    metricTotalScans: 'कुल जांची गई सड़कें',
    metricPotholesDetected: 'पहचाने गए गड्ढे',
    metricRepairBudget: 'अनुमानित मरम्मत बजट',
    metricReportsTracked: 'दर्ज शिकायतें',
    metricResolvedCases: 'पूर्ण की गई मरम्मत',
    
    // Scanner
    scannerTitle: 'रीयल-टाइम सड़क गड्ढा स्कैनर',
    scannerSubtitle: 'मोबाइल बैक कैमरा, डैशकैम अंतराल से स्कैन करें या सड़क की फोटो और वीडियो अपलोड करें।',
    tabLiveCamera: 'लाइव सड़क कैमरा',
    tabUpload: 'फोटो / वीडियो अपलोड करें',
    tabBenchmarks: 'नमूना सड़क परिदृश्य',
    
    btnStartCamera: 'कैमरा चालू करें',
    btnStopCamera: 'कैमरा रोकें',
    btnSnapAnalyze: 'फोटो लें व विश्लेषण करें',
    btnSwitchCamera: 'कैमरा बदलें',
    btnTorchOn: 'टॉर्च चालू करें',
    btnTorchOff: 'टॉर्च बंद करें',
    autoScanInterval: 'निरंतर डैशकैम स्कैनिंग',
    autoScanInfo: 'हर 2.5 सेकंड में फ्रेम स्कैन करता है और एक ही गड्ढे को दोबारा नहीं गिनता।',
    
    dropzoneTitle: 'सड़क की फोटो या वीडियो यहाँ खींच कर लाएं',
    dropzoneSubtitle: 'JPG, PNG, WebP (20MB तक) और MP4, WebM (100MB तक)',
    btnBrowseFiles: 'डिवाइस से फ़ाइल चुनें',
    
    // Calibration
    calibrationTitle: 'ऑप्टिकल आयाम व अंशांकन विवरण',
    calibrationDesc: 'साधारण 2D फोटो से बिना सेंसर टेलीमेट्री के सटीक मिलीमीटर गहराई मापना संभव नहीं है। रोड रक्षक भारतीय मानक लेन चौड़ाई (3.5 मी) व सड़क टेक्सचर का संदर्भ लेता है।',
    refObjectUsed: 'संदर्भ पैमाना: मानक राष्ट्रीय राजमार्ग लेन (3.5 मी) / वाहन टायर ट्रैक',
    
    // Assessment View
    assessmentTitle: 'सड़क स्थिति व गड्ढा नैदानिक रिपोर्ट',
    assessmentSubtitle: 'सड़क क्षति व नागरिकों की सुरक्षा जोखिम का स्वचालित कंप्यूटर विज़न विश्लेषण।',
    uniquePotholesFound: 'पहचाने गए कुल विशिष्ट गड्ढे',
    pciScore: 'पेवमेंट कंडीशन इंडेक्स (PCI)',
    overallCondition: 'सड़क की समग्र स्थिति',
    safetyRisk: 'यातायात सुरक्षा जोखिम स्तर',
    repairPriority: 'अनुशंसित मरम्मत प्राथमिकता',
    
    // Severity Labels
    severityLow: 'निम्न गंभीरता',
    severityMedium: 'मध्यम गंभीरता',
    severityHigh: 'उच्च गंभीरता (गंभीर)',
    severityCritical: 'अत्यंत खतरनाक (घातक)',
    
    conditionGood: 'अच्छी स्थिति',
    conditionFair: 'सामान्य (रखरखाव आवश्यक)',
    conditionPoor: 'खराब (तत्काल ध्यान दें)',
    conditionDangerous: 'अत्यंत खतरनाक (दुर्घटना संभावित)',
    
    // Commuter risks
    hazardTwoWheeler: 'दोपहिया वाहनों के फिसलने व संतुलन बिगड़ने का गंभीर खतरा, विशेषकर रात या बारिश में।',
    hazardAutoRickshaw: 'ऑटो-रिक्शा पलटने व सस्पेंशन टूटने का अत्यधिक जोखिम।',
    hazardWaterlogged: 'पानी भरा होने से गड्ढे की वास्तविक गहराई छिप जाती है, जिससे पहिया फंस जाता है।',
    
    // Buttons
    btnProceedToCost: 'PWD मरम्मत लागत की गणना करें',
    btnProceedToComplaint: 'सरकारी शिकायत पत्र तैयार करें',
    btnDownloadPdf: 'आधिकारिक PDF रिपोर्ट डाउनलोड करें',
    btnCopyLetter: 'शिकायत पत्र कॉपी करें',
    btnShareWhatsapp: 'व्हाट्सएप पर साझा करें',
    btnOpenPortal: 'आधिकारिक शिकायत पोर्टल खोलें',
    
    // Cost Estimator
    estimatorTitle: 'PWD मरम्मत सामग्री एवं लागत कैलकुलेटर',
    estimatorSubtitle: 'भारतीय सड़क कांग्रेस (IRC:SP:100) व MoRTH विनिर्देशों पर आधारित प्राक्कलन।',
    scheduleOfRates: 'लागू दर अनुसूची (Schedule of Rates)',
    selectSchedule: 'राज्य PWD / CPWD DSR दर सूची चुनें',
    potholeDimensions: 'गड्ढों का माप एवं सामग्री परिमाण',
    potholeCount: 'गड्ढों की संख्या',
    totalPatchArea: 'कुल मरम्मत क्षेत्र',
    totalPatchVolume: 'कुल आवश्यक डामर (कंक्रीट) आयतन',
    sawCuttingAllowance: 'सॉ-कटिंग पेरीमीटर मार्जिन (+15%)',
    
    // Materials Breakdown
    materialBituminousConcrete: 'बिटुमिनस डामर कंक्रीट (BC / DBM)',
    materialTackCoat: 'टैक कोट इमल्शन (RS-1)',
    materialAggregate: 'क्रश स्टोन पत्थर गिट्टी / रोड़ी (GSB)',
    labourMason: 'कुशल सड़क मिस्त्री (CPWD दरें)',
    labourGeneral: 'अकुशल श्रमिक दल',
    machineryRoller: 'वाइब्रेटरी टैंडम रोलर किराया',
    machineryCutter: 'सड़क डामर कटिंग कटर मशीन',
    contingencyOverhead: 'ठेकेदार का खर्च एवं आकस्मिकता (7%)',
    totalEstimatedBudget: 'कुल अनुमानित मरम्मत लागत',
    costDisclaimer: 'नोट: यह प्रारंभिक इंजीनियरिंग प्राक्कलन है जो IRC:SP:100 फॉर्मूले पर आधारित है। वास्तविक टेंडर दरें स्थानीय PWD कार्यालय के अनुसार भिन्न हो सकती हैं।',
    
    // Complaint Form
    complaintTitle: 'भारत-विशिष्ट सरकारी शिकायत जनरेटर',
    complaintSubtitle: 'NHAI, राज्य लोक निर्माण विभाग (PWD) या नगर निगम हेतु जियो-टैग्ड साक्ष्य सहित वैधानिक शिकायत पत्र तैयार करें।',
    stateLabel: 'राज्य / केंद्र शासित प्रदेश',
    districtLabel: 'ज़िला',
    authorityLabel: 'सड़क प्राधिकरण / संबंधित नगर निकाय',
    roadNameLabel: 'सड़क का नाम / हाईवे संख्या (उदा. NH-48, मुख्य सड़क)',
    landmarkLabel: 'निकटतम मील का पत्थर / लैंडमार्क / वार्ड',
    gpsCoordinatesLabel: 'GPS भौगोलिक निर्देशांक',
    btnFetchGps: 'वर्तमान GPS स्थान प्राप्त करें',
    gpsAccuracy: 'सटीकता',
    citizenNotesLabel: 'नागरिक का जमीनी विवरण / समस्या',
    citizenNotesPlaceholder: 'उदा. हालिया बारिश के बाद यहाँ गहरे गड्ढे बन गए हैं जिससे दोपहिया वाहनों की दुर्घटनाएं हो रही हैं और भारी जाम लग रहा है...',
    
    referenceIdLabel: 'विशिष्ट शिकायत संदर्भ संख्या',
    officialSubmissionDisclaimer: 'महत्वपूर्ण सूचना: रोड रक्षक AI प्रमाणित शिकायत दस्तावेज तैयार करता है। आधिकारिक सरकारी पावती प्राप्त करने हेतु नीचे दिए गए लिंक से आधिकारिक पोर्टल (जैसे CPGRAMS, सुखद यात्रा, या नगर निगम) पर सबमिट करें।',
    
    // My Reports
    reportsTitle: 'शिकायत ट्रैकर एवं सिविक मैप',
    reportsSubtitle: 'नागरिक शिकायत से लेकर PWD वर्क ऑर्डर एवं सड़क डामरीकरण तक की स्थिति ट्रैक करें।',
    searchReports: 'संदर्भ संख्या, सड़क या शहर खोजें...',
    filterStatus: 'स्थिति अनुसार छांटें',
    allStatuses: 'सभी स्थितियां',
    statusDraft: 'प्रारूप (Draft)',
    statusLogged: 'स्थानीय दर्ज',
    statusSubmitted: 'प्राधिकरण को प्रेषित',
    statusWorkOrder: 'वर्क ऑर्डर जारी',
    statusInProgress: 'मरम्मत कार्य प्रगति पर',
    statusResolved: 'मरम्मत पूर्ण व सत्यापित',
    emptyReportsTitle: 'अभी तक कोई शिकायत दर्ज नहीं है',
    emptyReportsDesc: 'सड़क स्कैन करें या एक परीक्षण परिदृश्य चुनकर अपनी पहली रिपोर्ट बनाएं।',
    
    // Portals
    portalsTitle: 'भारतीय सरकारी सड़क शिकायत पोर्टल एवं हेल्पलाइन',
    portalsSubtitle: 'भारत के प्रमुख सड़क विभागों के आधिकारिक पोर्टल व त्वरित सहायता नंबर।',
  }
};

export function t(key: keyof typeof translations['en'], lang: Language): string {
  return translations[lang]?.[key] || translations['en'][key] || key;
}
