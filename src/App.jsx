import React, { useState } from 'react';
import Header from './components/Header';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import LiveAnalyzer from './components/LiveAnalyzer';
import BatchAnalyzer from './components/BatchAnalyzer';
import RiskAnalytics from './components/RiskAnalytics';
import KnowledgeBase from './components/KnowledgeBase';
import DirectiveModal from './components/DirectiveModal';
import QuickDock from './components/QuickDock';
import { getInitialDataset } from './services/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dataset, setDataset] = useState(getInitialDataset());
  const [selectedIncidentForAnalysis, setSelectedIncidentForAnalysis] = useState(null);
  const [activeDirectiveIncident, setActiveDirectiveIncident] = useState(null);
  const [userRole, setUserRole] = useState('Executive HSE Director');

  const sifPrecursors = dataset.filter(d => d.isSifPrecursor);
  const sifCount = sifPrecursors.length;

  const handleSelectIncidentForAnalysis = (incident) => {
    setSelectedIncidentForAnalysis(incident);
    setActiveTab('live');
  };

  const handleSaveToDataset = (newRecord) => {
    setDataset(prev => [newRecord, ...prev]);
  };

  const handleOpenDirective = (incident) => {
    setActiveDirectiveIncident(incident || sifPrecursors[0] || dataset[0]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24">
      <div className="app-container">
        {/* Navigation Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sifCount={sifCount}
          totalCount={dataset.length}
          userRole={userRole}
          setUserRole={setUserRole}
        />

        {/* Tab Content Rendering */}
        <main>
          {activeTab === 'overview' && (
            <ExecutiveDashboard
              dataset={dataset}
              onSelectIncident={handleSelectIncidentForAnalysis}
              onOpenDirective={handleOpenDirective}
            />
          )}

          {activeTab === 'live' && (
            <LiveAnalyzer
              initialIncident={selectedIncidentForAnalysis}
              onSaveToDataset={handleSaveToDataset}
              onOpenDirective={handleOpenDirective}
            />
          )}

          {activeTab === 'batch' && (
            <BatchAnalyzer
              dataset={dataset}
              setDataset={setDataset}
              onSelectIncident={handleSelectIncidentForAnalysis}
              onOpenDirective={handleOpenDirective}
            />
          )}

          {activeTab === 'analytics' && (
            <RiskAnalytics dataset={dataset} />
          )}

          {activeTab === 'knowledge' && (
            <KnowledgeBase />
          )}
        </main>
      </div>

      {/* Floating Quick Navigation Dock */}
      <QuickDock
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEmergency={() => handleOpenDirective(sifPrecursors[0] || dataset[0])}
      />

      {/* SIF Emergency Directive Modal */}
      {activeDirectiveIncident && (
        <DirectiveModal
          incident={activeDirectiveIncident}
          onClose={() => setActiveDirectiveIncident(null)}
        />
      )}
    </div>
  );
}
