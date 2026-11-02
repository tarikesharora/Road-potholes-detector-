import React from 'react';
import { Shield, Camera, FileText, Calculator, MapPin, Globe, ExternalLink, Activity, AlertTriangle } from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  detectionMode?: 'live_ai' | 'demo_fallback' | 'benchmark_sample';
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  detectionMode = 'live_ai'
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0B132B] text-white border-b border-slate-800 shadow-lg">
      {/* Top micro bar for Indian civic tech branding */}
      <div className="bg-slate-950 px-4 py-1 text-xs text-slate-400 flex flex-wrap justify-between items-center border-b border-slate-900">
        <div className="flex items-center space-x-2">
          {/* Subtle Indian Flag Bar */}
          <div className="flex h-2.5 w-6 rounded-xs overflow-hidden border border-slate-700">
            <div className="w-1/3 bg-[#FF9933]"></div>
            <div className="w-1/3 bg-white flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-[#000080]"></div>
            </div>
            <div className="w-1/3 bg-[#138808]"></div>
          </div>
          <span className="font-medium text-slate-300">{t('indiaBadge', lang)}</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className={`w-2 h-2 rounded-full ${detectionMode === 'live_ai' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span className="text-[11px] text-slate-300">
              {detectionMode === 'live_ai' ? t('liveAiActive', lang) : t('demoModeActive', lang)}
            </span>
          </div>

          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="flex items-center space-x-1 px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('switchLang', lang)}</span>
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => setCurrentTab('dashboard')} 
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-emerald-600 to-navy-900 flex items-center justify-center p-0.5 shadow-md shadow-emerald-950">
              <div className="w-full h-full bg-[#0B132B] rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white font-sans">
                  {lang === 'hi' ? 'रोड रक्षक' : 'RoadRakshak'}
                  <span className="text-amber-400 ml-1">AI</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  CIVIC-TECH
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {lang === 'hi' ? 'स्मार्ट सड़क गड्ढा पहचान एवं मरम्मत रिपोर्टिंग' : 'Smart Pothole Detection & Road Repair Reporting'}
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
                currentTab === 'dashboard'
                  ? 'bg-slate-800 text-amber-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>{t('navDashboard', lang)}</span>
            </button>

            <button
              onClick={() => setCurrentTab('scanner')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
                currentTab === 'scanner'
                  ? 'bg-slate-800 text-amber-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>{t('navScan', lang)}</span>
            </button>

            <button
              onClick={() => setCurrentTab('assessment')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
                currentTab === 'assessment'
                  ? 'bg-slate-800 text-amber-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>{t('navAssessment', lang)}</span>
            </button>

            <button
              onClick={() => setCurrentTab('estimator')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
                currentTab === 'estimator'
                  ? 'bg-slate-800 text-amber-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Calculator className="w-4 h-4 text-sky-400" />
              <span>{t('navEstimator', lang)}</span>
            </button>

            <button
              onClick={() => setCurrentTab('complaint')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
                currentTab === 'complaint'
                  ? 'bg-slate-800 text-amber-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4 text-rose-400" />
              <span>{t('navComplaint', lang)}</span>
            </button>

            <button
              onClick={() => setCurrentTab('reports')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
                currentTab === 'reports'
                  ? 'bg-slate-800 text-amber-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MapPin className="w-4 h-4 text-teal-400" />
              <span>{t('navReports', lang)}</span>
            </button>

            <button
              onClick={() => setCurrentTab('portals')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
                currentTab === 'portals'
                  ? 'bg-slate-800 text-amber-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ExternalLink className="w-4 h-4 text-indigo-400" />
              <span>{t('navPortals', lang)}</span>
            </button>
          </nav>

          {/* Quick CTA */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentTab('scanner')}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md shadow-emerald-900/40 flex items-center space-x-2 transition cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">{t('startScanning', lang)}</span>
              <span className="sm:hidden">{lang === 'hi' ? 'स्कैन' : 'Scan'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden overflow-x-auto py-2 border-t border-slate-800/80 space-x-2 no-scrollbar text-xs">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`px-2.5 py-1.5 rounded whitespace-nowrap ${currentTab === 'dashboard' ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-400'}`}
          >
            {t('navDashboard', lang)}
          </button>
          <button
            onClick={() => setCurrentTab('scanner')}
            className={`px-2.5 py-1.5 rounded whitespace-nowrap ${currentTab === 'scanner' ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-400'}`}
          >
            {t('navScan', lang)}
          </button>
          <button
            onClick={() => setCurrentTab('assessment')}
            className={`px-2.5 py-1.5 rounded whitespace-nowrap ${currentTab === 'assessment' ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-400'}`}
          >
            {t('navAssessment', lang)}
          </button>
          <button
            onClick={() => setCurrentTab('estimator')}
            className={`px-2.5 py-1.5 rounded whitespace-nowrap ${currentTab === 'estimator' ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-400'}`}
          >
            {t('navEstimator', lang)}
          </button>
          <button
            onClick={() => setCurrentTab('complaint')}
            className={`px-2.5 py-1.5 rounded whitespace-nowrap ${currentTab === 'complaint' ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-400'}`}
          >
            {t('navComplaint', lang)}
          </button>
          <button
            onClick={() => setCurrentTab('reports')}
            className={`px-2.5 py-1.5 rounded whitespace-nowrap ${currentTab === 'reports' ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-400'}`}
          >
            {t('navReports', lang)}
          </button>
          <button
            onClick={() => setCurrentTab('portals')}
            className={`px-2.5 py-1.5 rounded whitespace-nowrap ${currentTab === 'portals' ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-400'}`}
          >
            {t('navPortals', lang)}
          </button>
        </div>
      </div>
    </header>
  );
};
