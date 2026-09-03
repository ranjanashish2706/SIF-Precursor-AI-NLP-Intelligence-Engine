import React from 'react';
import { Cpu, ShieldAlert, Layers, BarChart2, Zap } from 'lucide-react';

export default function QuickDock({ activeTab, setActiveTab, onOpenEmergency }) {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
      <div className="glass-panel px-4 py-2.5 rounded-full border border-white/20 shadow-2xl flex items-center gap-3 backdrop-blur-2xl bg-slate-950/90">
        <button
          onClick={() => setActiveTab('overview')}
          className={`p-2.5 rounded-full transition-all ${
            activeTab === 'overview'
              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/40 scale-110'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Executive Dashboard"
        >
          <BarChart2 className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveTab('live')}
          className={`p-2.5 rounded-full transition-all ${
            activeTab === 'live'
              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/40 scale-110'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Live AI Incident Analyzer"
        >
          <Cpu className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveTab('batch')}
          className={`p-2.5 rounded-full transition-all ${
            activeTab === 'batch'
              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/40 scale-110'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Batch Dataset & CSV Ingestion"
        >
          <Layers className="w-5 h-5" />
        </button>

        <div className="h-5 w-[1px] bg-slate-800" />

        <button
          onClick={onOpenEmergency}
          className="btn-danger text-xs px-3.5 py-1.5 rounded-full shadow-lg shadow-red-500/30 flex items-center gap-1.5 animate-pulse"
        >
          <ShieldAlert className="w-4 h-4" /> Quick SIF Alert
        </button>
      </div>
    </div>
  );
}
