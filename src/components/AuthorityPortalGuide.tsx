import React from 'react';
import { ExternalLink, Phone, ShieldAlert, BookOpen, Building, CheckCircle, Scale } from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';
import { INDIAN_AUTHORITIES } from '../data/indianRoadsData';

interface AuthorityPortalGuideProps {
  lang: Language;
}

export const AuthorityPortalGuide: React.FC<AuthorityPortalGuideProps> = ({ lang }) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
          <span>{t('portalsTitle', lang)}</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">
            Govt. Verified
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('portalsSubtitle', lang)}
        </p>
      </div>

      {/* Statutory Legal Rights Under Indian Law */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-amber-500 font-bold text-sm">
          <Scale className="w-5 h-5" />
          <span>Statutory Framework: Citizen Rights & Authority Liability</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Under <strong>Section 198A of the Motor Vehicles (Amendment) Act, 2019</strong>, any contractor, consultant, or concessionaire responsible for the design, construction, or maintenance of the road who fails to comply with safety standards is liable to be penalized up to <strong>₹1,00,000</strong> if such failure leads to death or disability. RoadRakshak AI generates evidence conforming to Indian Road Congress (IRC:SP:100) and Central PWD documentation guidelines.
        </p>
      </div>

      {/* Authority Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {INDIAN_AUTHORITIES.map((auth) => (
          <div
            key={auth.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-amber-500/80 transition"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  {auth.type}
                </span>
                <span className="text-xs text-slate-400 font-medium">{auth.state}</span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {auth.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {auth.jurisdiction}
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="font-mono text-[11px]">{auth.helpline}</span>
              </div>

              {auth.twitterHandle && (
                <div className="text-[11px] text-slate-400">
                  Twitter / X: <span className="text-blue-400 font-semibold">{auth.twitterHandle}</span>
                </div>
              )}

              <a
                href={auth.portalUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full mt-2 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition text-slate-700 dark:text-slate-200"
              >
                <span>Visit Grievance Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Central Redressal Portals */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center space-x-2">
          <Building className="w-5 h-5 text-indigo-500" />
          <span>Pan-India Apex Portals</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              CPGRAMS (pgportal.gov.in)
            </h4>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Centralized Public Grievance Redress and Monitoring System under Department of Administrative Reforms & Public Grievances. Escalates directly to Ministry of Road Transport and Highways (MoRTH).
            </p>
            <a
              href="https://pgportal.gov.in"
              target="_blank"
              rel="noreferrer"
              className="text-amber-500 font-semibold inline-flex items-center space-x-1 hover:underline pt-1"
            >
              <span>Go to CPGRAMS Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              NHAI Sukhad Yatra App & 1033
            </h4>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Official National Highways incident management and pothole reporting system. Dedicated toll-free 1033 helpline with 30-minute response time on golden quadrilateral and national corridors.
            </p>
            <a
              href="https://pgportal.gov.in"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-500 font-semibold inline-flex items-center space-x-1 hover:underline pt-1"
            >
              <span>Dial 1033 or Sukhad Yatra</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
