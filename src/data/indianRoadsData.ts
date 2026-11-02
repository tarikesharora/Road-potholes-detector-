import { IndianAuthorityOption, PwdRateSchedule } from '../types';

export const PWD_SCHEDULES: PwdRateSchedule[] = [
  {
    id: 'cpwd_dsr',
    name: 'CPWD DSR 2023-24 (All-India Benchmark)',
    state: 'Central / Pan-India',
    asphaltPerTonne: 5200, // ₹5,200 per metric tonne of BC / DBM mix
    tackCoatPerLitre: 75, // ₹75 per litre RS-1 bitumen emulsion
    aggregatePerCuM: 1450, // ₹1,450 per cu.m. 40mm/20mm crushed stone aggregate
    masonPerDay: 850, // Skilled road mason
    labourPerDay: 580, // Semi-skilled/unskilled road labour
    rollerHirePerDay: 4200, // 8-10 tonne vibratory roller per shift
    sawCutterPerDay: 1800, // Asphalt diamond cutter with operator
    contingencyPercent: 7
  },
  {
    id: 'mh_pwd',
    name: 'Maharashtra PWD SoR 2024-25',
    state: 'Maharashtra',
    asphaltPerTonne: 5450,
    tackCoatPerLitre: 78,
    aggregatePerCuM: 1550,
    masonPerDay: 900,
    labourPerDay: 620,
    rollerHirePerDay: 4500,
    sawCutterPerDay: 1950,
    contingencyPercent: 8
  },
  {
    id: 'ka_pwd',
    name: 'Karnataka PWD / BBMP Schedule 2024',
    state: 'Karnataka',
    asphaltPerTonne: 5350,
    tackCoatPerLitre: 74,
    aggregatePerCuM: 1480,
    masonPerDay: 880,
    labourPerDay: 600,
    rollerHirePerDay: 4300,
    sawCutterPerDay: 1850,
    contingencyPercent: 7
  },
  {
    id: 'delhi_pwd',
    name: 'Delhi PWD & MCD Schedule 2024',
    state: 'Delhi (NCT)',
    asphaltPerTonne: 5600,
    tackCoatPerLitre: 80,
    aggregatePerCuM: 1600,
    masonPerDay: 920,
    labourPerDay: 650,
    rollerHirePerDay: 4600,
    sawCutterPerDay: 2000,
    contingencyPercent: 7
  },
  {
    id: 'tn_highways',
    name: 'Tamil Nadu Highways Department SoR',
    state: 'Tamil Nadu',
    asphaltPerTonne: 5100,
    tackCoatPerLitre: 72,
    aggregatePerCuM: 1380,
    masonPerDay: 840,
    labourPerDay: 570,
    rollerHirePerDay: 4100,
    sawCutterPerDay: 1750,
    contingencyPercent: 6
  },
  {
    id: 'up_pwd',
    name: 'Uttar Pradesh PWD Rates 2024',
    state: 'Uttar Pradesh',
    asphaltPerTonne: 4950,
    tackCoatPerLitre: 70,
    aggregatePerCuM: 1320,
    masonPerDay: 780,
    labourPerDay: 540,
    rollerHirePerDay: 3900,
    sawCutterPerDay: 1650,
    contingencyPercent: 7
  }
];

export const INDIAN_AUTHORITIES: IndianAuthorityOption[] = [
  {
    id: 'nhai',
    name: 'NHAI (National Highways Authority of India)',
    type: 'NHAI',
    state: 'All India',
    jurisdiction: 'National Highways & Expressways (NH-1 to NH-99)',
    portalUrl: 'https://pgportal.gov.in',
    helpline: '1033 (Toll Free Sukhad Yatra Helpline)',
    twitterHandle: '@NHAI_Official'
  },
  {
    id: 'bmc',
    name: 'BMC (Brihanmumbai Municipal Corporation)',
    type: 'Municipal Corp',
    state: 'Maharashtra',
    jurisdiction: 'Mumbai City & Suburban Roads (< 30ft width)',
    portalUrl: 'https://portal.mcgm.gov.in',
    helpline: '1916 / 022-22694725',
    twitterHandle: '@mybmc'
  },
  {
    id: 'bbmp',
    name: 'BBMP (Bruhat Bengaluru Mahanagara Palike)',
    type: 'Municipal Corp',
    state: 'Karnataka',
    jurisdiction: 'Bengaluru Urban & Major Arterial Roads',
    portalUrl: 'https://bbmp.gov.in',
    helpline: '1533 / 080-22660000',
    twitterHandle: '@BBMPCOMM'
  },
  {
    id: 'mcd',
    name: 'MCD (Municipal Corporation of Delhi)',
    type: 'Municipal Corp',
    state: 'Delhi',
    jurisdiction: 'Delhi Municipal Internal Roads & Colonies',
    portalUrl: 'https://mcdonline.nic.in',
    helpline: '155305 / MCD 311 App',
    twitterHandle: '@MCD_Delhi'
  },
  {
    id: 'delhi_pwd_auth',
    name: 'Delhi Public Works Department (PWD)',
    type: 'PWD',
    state: 'Delhi',
    jurisdiction: 'Ring Roads, Flyovers & Roads > 60ft width',
    portalUrl: 'https://pwd.delhi.gov.in',
    helpline: '1800-11-0093',
    twitterHandle: '@Pwddelhi'
  },
  {
    id: 'mh_pwd_auth',
    name: 'Maharashtra Public Works Department (PWD)',
    type: 'PWD',
    state: 'Maharashtra',
    jurisdiction: 'State Highways & Major District Roads',
    portalUrl: 'https://mahapwd.gov.in',
    helpline: '1800-120-8040 (Aaple Sarkar)',
    twitterHandle: '@MahaPWD'
  },
  {
    id: 'ghmc',
    name: 'GHMC (Greater Hyderabad Municipal Corporation)',
    type: 'Municipal Corp',
    state: 'Telangana',
    jurisdiction: 'Hyderabad Municipal Limits',
    portalUrl: 'https://ghmc.gov.in',
    helpline: '040-21111111 / MyGHMC',
    twitterHandle: '@GHMCOnline'
  },
  {
    id: 'pmc',
    name: 'PMC (Pune Municipal Corporation)',
    type: 'Municipal Corp',
    state: 'Maharashtra',
    jurisdiction: 'Pune Urban Agglomeration',
    portalUrl: 'https://pmc.gov.in',
    helpline: '1800-1030-222',
    twitterHandle: '@PMCPune'
  },
  {
    id: 'gcc',
    name: 'GCC (Greater Chennai Corporation)',
    type: 'Municipal Corp',
    state: 'Tamil Nadu',
    jurisdiction: 'Chennai City Roads & Bus Routes',
    portalUrl: 'https://chennaicorporation.gov.in',
    helpline: '1913 / Namma Chennai App',
    twitterHandle: '@chennaicorp'
  },
  {
    id: 'pmgsy',
    name: 'PMGSY (Pradhan Mantri Gram Sadak Yojana)',
    type: 'PMGSY',
    state: 'All India',
    jurisdiction: 'Rural Connectivity & Village Link Roads',
    portalUrl: 'https://omms.nic.in',
    helpline: 'Meri Sadak Citizen Portal',
    twitterHandle: '@MoRD_GoI'
  }
];

export const INDIAN_STATES_DISTRICTS: Record<string, string[]> = {
  'Delhi': ['Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi', 'North West Delhi', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi'],
  'Maharashtra': ['Mumbai City', 'Mumbai Suburban', 'Pune', 'Thane', 'Nagpur', 'Nashik', 'Aurangabad (Chhatrapati Sambhajinagar)', 'Solapur', 'Kolhapur', 'Raigad'],
  'Karnataka': ['Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Dakshina Kannada (Mangaluru)', 'Belagavi', 'Dharwad (Hubballi)', 'Kalaburagi', 'Udupi', 'Tumakuru'],
  'Telangana': ['Hyderabad', 'Ranga Reddy', 'Medchal-Malkajgiri', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Kanchipuram', 'Chengalpattu', 'Vellore'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur Nagar', 'Gautam Buddha Nagar (Noida)', 'Ghaziabad', 'Varanasi', 'Prayagraj', 'Agra', 'Meerut', 'Bareilly', 'Gorakhpur'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Gandhinagar', 'Jamnagar'],
  'West Bengal': ['Kolkata', 'North 24 Parganas', 'South 24 Parganas', 'Howrah', 'Hooghly', 'Darjeeling', 'Paschim Bardhaman'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Udaipur', 'Ajmer', 'Bikaner', 'Alwar'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar'],
  'Kerala': ['Thiruvananthapuram', 'Ernakulam (Kochi)', 'Kozhikode', 'Thrissur', 'Kollam', 'Kannur', 'Palakkad'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'SAS Nagar (Mohali)', 'Bathinda'],
  'Haryana': ['Gurugram', 'Faridabad', 'Panchkula', 'Sonipat', 'Ambala', 'Karnal', 'Panipat'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga'],
  'Odisha': ['Khordha (Bhubaneswar)', 'Cuttack', 'Sundargarh (Rourkela)', 'Ganjam', 'Puri']
};

export interface BenchmarkScenario {
  id: string;
  title: string;
  titleHi: string;
  location: string;
  state: string;
  district: string;
  roadName: string;
  landmark: string;
  authorityId: string;
  imageThumbnail: string; // inline data or SVG road simulation
  description: string;
  descriptionHi: string;
  simulatedPotholes: {
    ymin: number;
    xmin: number;
    ymax: number;
    xmax: number;
    confidence: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    approxLengthCm: number;
    approxWidthCm: number;
    approxDepthCm: number;
    waterFilled: boolean;
    commuterHazard: string;
  }[];
  overallCondition: 'Good' | 'Fair' | 'Poor' | 'Dangerous';
  pciScore: number;
  commuterSafetyRisk: 'Low' | 'Moderate' | 'High' | 'Severe / Life Threatening';
  repairPriority: 'Emergency (24-48 hrs)' | 'High (3-7 days)' | 'Medium (15-30 days)' | 'Routine Maintenance';
  latitude: number;
  longitude: number;
}

// Highly realistic benchmark scenarios reflecting typical Indian road distress
export const BENCHMARK_SCENARIOS: BenchmarkScenario[] = [
  {
    id: 'mumbai_we_highway',
    title: 'Western Express Highway (Andheri Flyover descent)',
    titleHi: 'वेस्टर्न एक्सप्रेस हाईवे (अंधेरी फ्लाईओवर ढलान, मुंबई)',
    location: 'Mumbai, Maharashtra',
    state: 'Maharashtra',
    district: 'Mumbai Suburban',
    roadName: 'Western Express Highway (WEH)',
    landmark: 'Opposite Gundavali Metro Station, Andheri East',
    authorityId: 'mh_pwd_auth',
    imageThumbnail: 'mumbai_monsoon',
    description: 'Multiple deep, water-filled craters along fast lane after heavy monsoon showers. Critical two-wheeler skid hazard.',
    descriptionHi: 'भारी मानसूनी बारिश के बाद फास्ट लेन में कई गहरे पानी से भरे गड्ढे। दोपहिया वाहनों के लिए गंभीर खतरा।',
    simulatedPotholes: [
      {
        ymin: 420,
        xmin: 240,
        ymax: 680,
        xmax: 520,
        confidence: 0.96,
        severity: 'critical',
        approxLengthCm: 85,
        approxWidthCm: 60,
        approxDepthCm: 16,
        waterFilled: true,
        commuterHazard: 'Severe risk of two-wheeler rim bending, bike skidding, and loss of commuter balance.'
      },
      {
        ymin: 510,
        xmin: 620,
        ymax: 720,
        xmax: 840,
        confidence: 0.91,
        severity: 'high',
        approxLengthCm: 65,
        approxWidthCm: 45,
        approxDepthCm: 11,
        waterFilled: true,
        commuterHazard: 'Causes abrupt braking and rear-end collisions during peak office hours.'
      },
      {
        ymin: 310,
        xmin: 450,
        ymax: 420,
        xmax: 560,
        confidence: 0.84,
        severity: 'medium',
        approxLengthCm: 35,
        approxWidthCm: 30,
        approxDepthCm: 6,
        waterFilled: false,
        commuterHazard: 'Asphalt surface raveling and aggregate loosening.'
      }
    ],
    overallCondition: 'Dangerous',
    pciScore: 32,
    commuterSafetyRisk: 'Severe / Life Threatening',
    repairPriority: 'Emergency (24-48 hrs)',
    latitude: 19.1176,
    longitude: 72.8561
  },
  {
    id: 'bengaluru_outer_ring_road',
    title: 'Outer Ring Road (Near Bellandur Tech Park)',
    titleHi: 'आउटर रिंग रोड (बेलंदूर टेक पार्क के पास, बेंगलुरु)',
    location: 'Bengaluru, Karnataka',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    roadName: 'Outer Ring Road (ORR) - Service Road Junction',
    landmark: 'Between Ecospace and Bellandur Bus Stop',
    authorityId: 'bbmp',
    imageThumbnail: 'bengaluru_orr',
    description: 'Deep pavement depression with exposed coarse aggregate causing daily traffic bottleneck and bus axle impact.',
    descriptionHi: 'उभरी हुई गिट्टी व गहरा गड्ढा जिससे रोज़ाना भारी जाम लग रहा है व बसों के एक्सल को नुकसान हो रहा है।',
    simulatedPotholes: [
      {
        ymin: 380,
        xmin: 320,
        ymax: 610,
        xmax: 590,
        confidence: 0.94,
        severity: 'high',
        approxLengthCm: 72,
        approxWidthCm: 55,
        approxDepthCm: 12,
        waterFilled: false,
        commuterHazard: 'Auto-rickshaw suspension damage and sudden motorcycle swerving.'
      },
      {
        ymin: 580,
        xmin: 680,
        ymax: 760,
        xmax: 890,
        confidence: 0.89,
        severity: 'medium',
        approxLengthCm: 45,
        approxWidthCm: 40,
        approxDepthCm: 8,
        waterFilled: false,
        commuterHazard: 'Edge breakup along storm drain kerb.'
      }
    ],
    overallCondition: 'Poor',
    pciScore: 48,
    commuterSafetyRisk: 'High',
    repairPriority: 'High (3-7 days)',
    latitude: 12.9260,
    longitude: 77.6762
  },
  {
    id: 'delhi_ring_road',
    title: 'Mahatma Gandhi Ring Road (Near Lajpat Nagar)',
    titleHi: 'महात्मा गांधी रिंग रोड (लाजपत नगर के समीप, नई दिल्ली)',
    location: 'New Delhi, Delhi',
    state: 'Delhi',
    district: 'South Delhi',
    roadName: 'Mahatma Gandhi Ring Road',
    landmark: 'Opposite Flyover Pillar 42, Lajpat Nagar-IV',
    authorityId: 'delhi_pwd_auth',
    imageThumbnail: 'delhi_ringroad',
    description: 'High-speed lane asphalt crater with loose stones projectile risk to following vehicles.',
    descriptionHi: 'हाई-स्पीड लेन में डामर का गड्ढा जिसमें से गिट्टी उड़कर पीछे आ रहे वाहनों पर लगने का खतरा है।',
    simulatedPotholes: [
      {
        ymin: 450,
        xmin: 380,
        ymax: 690,
        xmax: 640,
        confidence: 0.95,
        severity: 'critical',
        approxLengthCm: 90,
        approxWidthCm: 70,
        approxDepthCm: 14,
        waterFilled: false,
        commuterHazard: 'High speed vehicular tyre blowout and two-wheeler loss of control.'
      }
    ],
    overallCondition: 'Poor',
    pciScore: 42,
    commuterSafetyRisk: 'High',
    repairPriority: 'High (3-7 days)',
    latitude: 28.5677,
    longitude: 77.2433
  },
  {
    id: 'nh48_highspeed',
    title: 'NH-48 Golden Quadrilateral (Pune-Satara Section)',
    titleHi: 'NH-48 स्वर्णिम चतुर्भुज (पुणे-सातारा खंड, किमी 812)',
    location: 'Pune District, Maharashtra',
    state: 'Maharashtra',
    district: 'Pune',
    roadName: 'National Highway 48 (NH-48)',
    landmark: 'Toll Plaza Approach Road, KM Stone 812',
    authorityId: 'nhai',
    imageThumbnail: 'nh48_highway',
    description: 'Trench-like longitudinal asphalt void along wheel path on 6-lane national expressway.',
    descriptionHi: '6-लेन राष्ट्रीय राजमार्ग पर पहियों के रास्ते में लंबा गहरा गड्ढा। तेज गति वाहनों के लिए घातक।',
    simulatedPotholes: [
      {
        ymin: 490,
        xmin: 220,
        ymax: 740,
        xmax: 480,
        confidence: 0.97,
        severity: 'critical',
        approxLengthCm: 110,
        approxWidthCm: 50,
        approxDepthCm: 15,
        waterFilled: false,
        commuterHazard: 'Severe vehicle rollover risk at 80-100 km/h expressway speeds.'
      },
      {
        ymin: 390,
        xmin: 590,
        ymax: 530,
        xmax: 710,
        confidence: 0.88,
        severity: 'medium',
        approxLengthCm: 40,
        approxWidthCm: 35,
        approxDepthCm: 7,
        waterFilled: false,
        commuterHazard: 'Steering wobble and lane deviation.'
      }
    ],
    overallCondition: 'Dangerous',
    pciScore: 36,
    commuterSafetyRisk: 'Severe / Life Threatening',
    repairPriority: 'Emergency (24-48 hrs)',
    latitude: 18.3245,
    longitude: 73.8567
  }
];
