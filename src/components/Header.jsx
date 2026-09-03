import React from 'react';
import { Flame, ShieldAlert, Cpu, Activity, FileText, BarChart2, BookOpen, Layers, Zap, ChevronDown } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, sifCount, totalCount, userRole, setUserRole }) {
  return (
    <header className="glass-panel mb-8 border border-white/10 px-6 py-5 rounded-2xl shadow-2xl relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-5 relative z-10">
        {/* Left: Branding & Organization */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-600 to-red-600 flex items-center justify-center shadow-xl shadow-amber-500/25 border border-amber-300/30">
              <Flame className="w-8 h-8 text-slate-950 animate-pulse" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full" title="System Online" />
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-extrabold text-xl tracking-wider text-white">OIL INDIA LIMITED</span>
              <span className="badge badge-amber text-[10px] py-0.5">SIH26165</span>
            </div>
            <h1 className="text-xs font-bold text-cyan-400 flex items-center gap-2 mt-0.5 tracking-wide">
              <Cpu className="w-4 h-4 text-cyan-400" /> SIF Precursor AI & NLP Intelligence Engine
            </h1>
          </div>
        </div>

        {/* Center: System Status & Quick SIF Ticker */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-950/80 px-5 py-2.5 rounded-xl border border-white/10 shadow-inner">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
            </span>
            <span className="text-xs text-slate-300 font-medium">SIF Alerts:</span>
            <span className="text-sm font-extrabold text-red-400 font-mono bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40">
              {sifCount} / {totalCount} Reports
            </span>
          </div>

          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-slate-300">Model:</span>
            <span className="text-xs text-cyan-300 font-semibold font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              IOGP-NLP v2.4
            </span>
          </div>
        </div>

        {/* Right: Role & Actions */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
            <div className="text-right text-[11px]">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Active Role</span>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="bg-transparent text-cyan-300 font-bold border-none p-0 text-xs focus:ring-0 cursor-pointer"
              >
                <option value="Executive HSE Director">Executive HSE Director</option>
                <option value="Field HSE Safety Engineer">Field HSE Safety Engineer</option>
                <option value="Rig Operation Manager">Rig Operation Manager</option>
              </select>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex items-center gap-2 mt-6 border-t border-white/10 pt-4 overflow-x-auto">
        <TabButton
          id="overview"
          label="Executive Dashboard"
          icon={BarChart2}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabButton
          id="live"
          label="Live Incident AI Analyzer"
          icon={Cpu}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          badge="Interactive"
        />
        <TabButton
          id="batch"
          label="Batch Dataset & Ingestion"
          icon={Layers}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          count={totalCount}
        />
        <TabButton
          id="analytics"
          label="Regional Risk Heatmaps"
          icon={Activity}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabButton
          id="knowledge"
          label="IOGP Safety Energy Standards"
          icon={BookOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </nav>
    </header>
  );
}

function TabButton({ id, label, icon: Icon, activeTab, setActiveTab, badge, count }) {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 relative ${
        isActive
          ? 'bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/40'
          : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
      }`}
    >
      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
      <span>{label}</span>
      {badge && (
        <span className="bg-amber-400/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full border border-amber-400/40 font-mono">
          {badge}
        </span>
      )}
      {count !== undefined && (
        <span className="bg-slate-900 text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-mono border border-slate-700">
          {count}
        </span>
      )}
    </button>
  );
}
