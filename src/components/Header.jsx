import React from 'react';
import { ShieldAlert, Cpu, Activity, BarChart2, BookOpen, Layers, Zap, ChevronDown, Radio } from 'lucide-react';
import NeuralCore from './NeuralCore';

export default function Header({ activeTab, setActiveTab, sifCount, totalCount, userRole, setUserRole }) {
  return (
    <header className="glass-panel mb-8 p-6 rounded-3xl border border-white/15 shadow-2xl relative overflow-hidden animate-holo-boot">
      {/* Ambient Lighting Accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
        {/* Left: Branding & Holographic AI Neural Core */}
        <div className="flex items-center gap-5">
          <NeuralCore sifCount={sifCount} totalCount={totalCount} />

          <div>
            <div className="flex items-center gap-3">
              <span className="font-black text-2xl tracking-wider text-white gradient-text-oil">
                OIL INDIA LIMITED
              </span>
              <span className="badge badge-amber font-mono text-[10px] py-0.5">SIH26165</span>
            </div>
            <h1 className="text-xs font-extrabold text-cyan-400 flex items-center gap-2 mt-1 tracking-widest uppercase">
              <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" /> AI/NLP SIF Intelligence Command System
            </h1>
          </div>
        </div>

        {/* Center: Live AI Neural Status Ticker */}
        <div className="flex flex-wrap items-center gap-4 bg-slate-950/90 px-6 py-3 rounded-2xl border border-white/10 shadow-inner">
          <div className="flex items-center gap-3">
            <Radio className="w-4 h-4 text-red-400 animate-pulse" />
            <span className="text-xs text-slate-300 font-bold uppercase tracking-wider">SIF Threat Radar:</span>
            <span className="text-sm font-black text-red-400 font-mono bg-red-950/80 px-2.5 py-0.5 rounded-lg border border-red-800/50">
              {sifCount} / {totalCount} Critical
            </span>
          </div>

          <div className="h-5 w-[1px] bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-slate-300 font-bold uppercase tracking-wider">Engine:</span>
            <span className="text-xs text-cyan-300 font-black font-mono bg-cyan-950/80 px-2.5 py-0.5 rounded-lg border border-cyan-800/50">
              IOGP-NLP v2.4 ONLINE
            </span>
          </div>
        </div>

        {/* Right: Role Selector */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950/90 px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-3 shadow-lg">
            <div className="text-right">
              <span className="text-slate-400 block text-[9px] uppercase font-black tracking-widest">Active Commander</span>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="bg-transparent text-cyan-300 font-extrabold border-none p-0 text-xs focus:ring-0 cursor-pointer"
              >
                <option value="Executive HSE Director">Executive HSE Director</option>
                <option value="Field HSE Safety Engineer">Field HSE Safety Engineer</option>
                <option value="Rig Operation Manager">Rig Operation Manager</option>
              </select>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Floating Holographic Navigation Tabs */}
      <nav className="flex items-center gap-3 mt-6 border-t border-white/10 pt-5 overflow-x-auto">
        <TabButton
          id="overview"
          label="Executive Command"
          icon={BarChart2}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabButton
          id="live"
          label="Live AI Incident Analyzer"
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
          label="IOGP Safety Standards"
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
      className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-xs font-black whitespace-nowrap transition-all duration-300 ${
        isActive
          ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-xl shadow-cyan-500/30 border border-cyan-300/50 scale-105'
          : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
      <span className="tracking-wide">{label}</span>
      {badge && (
        <span className="bg-amber-400/20 text-amber-300 text-[10px] px-2.5 py-0.5 rounded-full border border-amber-400/50 font-mono">
          {badge}
        </span>
      )}
      {count !== undefined && (
        <span className="bg-slate-950 text-slate-300 text-[10px] px-2.5 py-0.5 rounded-full font-mono border border-slate-800">
          {count}
        </span>
      )}
    </button>
  );
}
