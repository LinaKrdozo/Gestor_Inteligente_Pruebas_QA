import React, { useState } from 'react';
import { Header } from './components/Header';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { TestMatrix } from './components/TestMatrix';
import { DefectsRemediation } from './components/DefectsRemediation';
import { BugTracker } from './components/BugTracker';
import { TestHistory } from './components/TestHistory';
import { LiveSandbox } from './components/LiveSandbox';
import { CheckpointSimulator } from './components/CheckpointSimulator';
import { ExportModal } from './components/ExportModal';
import { 
  ALL_TEST_CASES, 
  DEFECTS_DATA, 
  INITIAL_PRODUCTS, 
  INITIAL_TEST_HISTORY 
} from './data/auditData';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('summary');
  const [fixedDefectIds, setFixedDefectIds] = useState<number[]>([]);
  const [selectedDefectId, setSelectedDefectId] = useState<number>(1);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const totalTests = ALL_TEST_CASES.length; // 35
  const passedCount = 29 + fixedDefectIds.length;
  const unresolvedBlockingBugs = DEFECTS_DATA.filter(
    (d) => d.blocksLaunch && !fixedDefectIds.includes(d.id)
  );
  const hasBlockingBugs = unresolvedBlockingBugs.length > 0;

  const handleToggleDefectFix = (defectId: number) => {
    setFixedDefectIds((prev) =>
      prev.includes(defectId) ? prev.filter((id) => id !== defectId) : [...prev, defectId]
    );
  };

  const handleApplyAllMandatory = () => {
    // Mandatory defects: #1, #2, #3
    setFixedDefectIds((prev) => Array.from(new Set([...prev, 1, 2, 3])));
  };

  const handleApplyAllDefects = () => {
    setFixedDefectIds([1, 2, 3, 4, 5, 6]);
  };

  const handleResetAll = () => {
    setFixedDefectIds([]);
  };

  const handleOpenDefectDetail = (defectId: number) => {
    setSelectedDefectId(defectId);
    setActiveTab('defects');
  };

  const handleNavigateToSandbox = (defectId?: number) => {
    if (defectId) setSelectedDefectId(defectId);
    setActiveTab('sandbox');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Bar Contract (Wordmark - Navigation - Primary Actions) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        passedCount={passedCount}
        totalCount={totalTests}
        hasBlockingBugs={hasBlockingBugs}
        onReset={handleResetAll}
        onExport={() => setIsExportModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'summary' && (
          <ExecutiveSummary
            defects={DEFECTS_DATA}
            fixedDefectIds={fixedDefectIds}
            onNavigateToTab={setActiveTab}
            onOpenDefectDetail={handleOpenDefectDetail}
          />
        )}

        {activeTab === 'matrix' && (
          <TestMatrix
            testCases={ALL_TEST_CASES}
            defects={DEFECTS_DATA}
            fixedDefectIds={fixedDefectIds}
            onToggleDefectFix={handleToggleDefectFix}
            onOpenDefectDetail={handleOpenDefectDetail}
          />
        )}

        {activeTab === 'defects' && (
          <DefectsRemediation
            defects={DEFECTS_DATA}
            fixedDefectIds={fixedDefectIds}
            selectedDefectId={selectedDefectId}
            onToggleDefectFix={handleToggleDefectFix}
            onNavigateToSandbox={handleNavigateToSandbox}
          />
        )}

        {activeTab === 'tracking' && (
          <BugTracker
            defects={DEFECTS_DATA}
            fixedDefectIds={fixedDefectIds}
            onToggleDefectFix={handleToggleDefectFix}
            onNavigateToSandbox={handleNavigateToSandbox}
          />
        )}

        {activeTab === 'history' && (
          <TestHistory
            historyCycles={INITIAL_TEST_HISTORY}
            currentPassedTests={passedCount}
            totalTests={totalTests}
            onNavigateToSimulator={() => setActiveTab('simulator')}
          />
        )}

        {activeTab === 'sandbox' && (
          <LiveSandbox
            initialProducts={INITIAL_PRODUCTS}
            defects={DEFECTS_DATA}
            fixedDefectIds={fixedDefectIds}
            onToggleDefectFix={handleToggleDefectFix}
            preselectedDefectId={selectedDefectId}
          />
        )}

        {activeTab === 'simulator' && (
          <CheckpointSimulator
            defects={DEFECTS_DATA}
            fixedDefectIds={fixedDefectIds}
            onToggleDefectFix={handleToggleDefectFix}
            onApplyAllMandatory={handleApplyAllMandatory}
            onApplyAllDefects={handleApplyAllDefects}
            onResetAll={handleResetAll}
            onExport={() => setIsExportModalOpen(true)}
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">AuditQA Platform</span>
            <span>·</span>
            <span>Auditoría de Calidad E-commerce B2C (QA / Staging)</span>
          </div>

          <div className="flex items-center gap-4">
            <span>DOC-QA-2026-B2C-084</span>
            <span>·</span>
            <span>Release Candidate v1.0.0-rc.3</span>
            <span>·</span>
            <span>Metodología ISTQB & CI/CD Gate</span>
          </div>
        </div>
      </footer>

      {/* Corporate Export Modal with 2 Cases */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        passedCount={passedCount}
        totalCount={totalTests}
        defects={DEFECTS_DATA}
        fixedDefectIds={fixedDefectIds}
        historyCycles={INITIAL_TEST_HISTORY}
      />
    </div>
  );
}
