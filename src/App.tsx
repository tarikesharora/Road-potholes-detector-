/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { ScannerView } from './components/ScannerView';
import { AssessmentView } from './components/AssessmentView';
import { CostEstimatorView } from './components/CostEstimatorView';
import { ComplaintGeneratorView } from './components/ComplaintGeneratorView';
import { MyReportsView } from './components/MyReportsView';
import { AuthorityPortalGuide } from './components/AuthorityPortalGuide';
import { Language, MaterialCostEstimate, ReportStatus, RoadComplaintReport, RoadScanResult } from './types';
import { calculateRepairEstimate } from './utils/costCalculator';
import { BENCHMARK_SCENARIOS } from './data/indianRoadsData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('roadrakshak_lang') as Language) || 'en';
  });

  const [scanResult, setScanResult] = useState<RoadScanResult | null>(null);
  const [costEstimate, setCostEstimate] = useState<MaterialCostEstimate | null>(null);
  const [reports, setReports] = useState<RoadComplaintReport[]>([]);

  // Persist language
  useEffect(() => {
    localStorage.setItem('roadrakshak_lang', lang);
  }, [lang]);

  // Load reports from server / localStorage
  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch('/api/reports');
        if (res.ok) {
          const data = await res.json();
          if (data.reports && data.reports.length > 0) {
            setReports(data.reports);
            return;
          }
        }
      } catch (e) {
        console.warn('Could not fetch reports from server, falling back to local storage:', e);
      }

      // Local storage fallback
      const local = localStorage.getItem('roadrakshak_reports');
      if (local) {
        try {
          setReports(JSON.parse(local));
        } catch (err) {
          console.error(err);
        }
      }
    }
    fetchReports();
  }, []);

  // When a scan completes
  const handleScanComplete = (result: RoadScanResult) => {
    setScanResult(result);
    // Auto-calculate preliminary cost estimate
    const estimate = calculateRepairEstimate(result.potholes);
    setCostEstimate(estimate);
    setCurrentTab('assessment');
  };

  // When a benchmark is selected from dashboard
  const handleSelectBenchmark = (scenarioId: string) => {
    const sc = BENCHMARK_SCENARIOS.find(s => s.id === scenarioId) || BENCHMARK_SCENARIOS[0];
    const mappedPotholes = sc.simulatedPotholes.map((p, idx) => ({
      id: `P-${idx + 1}`,
      box2d: { ymin: p.ymin, xmin: p.xmin, ymax: p.ymax, xmax: p.xmax },
      confidence: p.confidence,
      severity: p.severity,
      approxDimensions: {
        lengthCm: p.approxLengthCm,
        widthCm: p.approxWidthCm,
        depthCm: p.approxDepthCm,
        areaSqMeters: Number(((p.approxLengthCm * p.approxWidthCm) / 10000).toFixed(2))
      },
      shape: 'irregular' as const,
      waterFilled: p.waterFilled,
      commuterHazard: p.commuterHazard
    }));

    const result: RoadScanResult = {
      scanId: `benchmark_${sc.id}`,
      timestamp: new Date().toISOString(),
      potholes: mappedPotholes,
      totalUniquePotholes: mappedPotholes.length,
      overallCondition: sc.overallCondition,
      pciScore: sc.pciScore,
      repairPriority: sc.repairPriority,
      commuterSafetyRisk: sc.commuterSafetyRisk,
      primaryRecommendation: sc.description,
      detectionMode: 'benchmark_sample',
      surfaceType: 'High-Density Bituminous Asphalt'
    };

    setScanResult(result);
    const estimate = calculateRepairEstimate(mappedPotholes);
    setCostEstimate(estimate);
  };

  // Save new report
  const handleSaveReport = async (newReport: RoadComplaintReport) => {
    const updated = [newReport, ...reports];
    setReports(updated);
    localStorage.setItem('roadrakshak_reports', JSON.stringify(updated));

    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReport)
      });
    } catch (e) {
      console.warn('Report saved locally, server sync failed:', e);
    }

    setCurrentTab('reports');
  };

  // Update report status
  const handleUpdateReportStatus = async (id: string, newStatus: ReportStatus) => {
    const updated = reports.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: newStatus,
          statusHistory: [
            ...(r.statusHistory || []),
            {
              status: newStatus,
              timestamp: new Date().toISOString(),
              note: `Status updated to ${newStatus}`
            }
          ]
        };
      }
      return r;
    });

    setReports(updated);
    localStorage.setItem('roadrakshak_reports', JSON.stringify(updated));

    try {
      await fetch(`/api/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {
      console.warn('Status update saved locally, server sync failed:', e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        lang={lang}
        setLang={setLang}
        detectionMode={scanResult?.detectionMode || 'live_ai'}
      />

      {/* Main Content Viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'dashboard' && (
          <DashboardOverview
            reports={reports}
            latestScan={scanResult}
            onSelectTab={setCurrentTab}
            onSelectBenchmark={handleSelectBenchmark}
            lang={lang}
          />
        )}

        {currentTab === 'scanner' && (
          <ScannerView
            onScanComplete={handleScanComplete}
            lang={lang}
          />
        )}

        {currentTab === 'assessment' && (
          <AssessmentView
            scanResult={scanResult}
            onProceedToEstimator={() => setCurrentTab('estimator')}
            onProceedToComplaint={() => setCurrentTab('complaint')}
            lang={lang}
          />
        )}

        {currentTab === 'estimator' && (
          <CostEstimatorView
            scanResult={scanResult}
            currentEstimate={costEstimate}
            onUpdateEstimate={setCostEstimate}
            onProceedToComplaint={() => setCurrentTab('complaint')}
            lang={lang}
          />
        )}

        {currentTab === 'complaint' && (
          <ComplaintGeneratorView
            scanResult={scanResult}
            costEstimate={costEstimate}
            onSaveReport={handleSaveReport}
            lang={lang}
          />
        )}

        {currentTab === 'reports' && (
          <MyReportsView
            reports={reports}
            onUpdateReportStatus={handleUpdateReportStatus}
            lang={lang}
          />
        )}

        {currentTab === 'portals' && (
          <AuthorityPortalGuide lang={lang} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B132B] text-slate-500 dark:text-slate-400 py-8 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <span className="font-bold text-slate-800 dark:text-white">RoadRakshak AI</span>
            <span>•</span>
            <span>रोड रक्षक AI (स्मार्ट सड़क गड्ढा पहचान एवं मरम्मत रिपोर्टिंग प्रणाली)</span>
          </div>
          <p>
            Designed for India • Aligned with Ministry of Road Transport and Highways (MoRTH) & Indian Road Congress (IRC:SP:100) specifications.
          </p>
          <p className="text-[11px] text-slate-400">
            Citizen Public Grievances are routed through official portals (CPGRAMS, Sukhad Yatra, State PWDs, and Municipal Corporations).
          </p>
        </div>
      </footer>
    </div>
  );
}
