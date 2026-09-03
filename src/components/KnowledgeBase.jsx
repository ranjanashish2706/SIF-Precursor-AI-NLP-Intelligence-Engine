import React from 'react';
import { BookOpen, ShieldCheck, Flame, Gauge, Skull, Cog, Zap, AlertTriangle } from 'lucide-react';
import { ENERGY_CATEGORIES } from '../services/nlpEngine';
import FlowDiagram from './FlowDiagram';

export default function KnowledgeBase() {
  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-slate-950 via-cyan-950/30 to-slate-950 border-cyan-500/30 shadow-2xl">
        <div className="flex items-center gap-2.5">
          <span className="badge badge-cyan">HSE SAFETY SCIENCE</span>
          <h2 className="text-lg font-extrabold text-white">IOGP SIF Energy Wheel & Safety Standards Guide</h2>
        </div>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-4xl">
          Serious Injury & Fatality (SIF) precursor detection relies on identifying High-Energy Exposure and Critical Control Absence rather than counting traditional low-level incident frequency.
        </p>
      </div>

      {/* Interactive System Flowchart Diagram */}
      <FlowDiagram />

      {/* Energy Wheel Grid */}
      <div>
        <h3 className="text-base font-extrabold text-white mb-4 flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-400" /> The 6 IOGP High Energy Wheel Categories
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.values(ENERGY_CATEGORIES).map((cat) => (
            <div key={cat.id} className="glass-panel p-5 border-t-4 shadow-xl hover:-translate-y-1 transition-transform" style={{ borderTopColor: cat.color }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${cat.color}25`, color: cat.color }}>
                    <Flame className="w-6 h-6" />
                  </div>
                  <h4 className="font-extrabold text-sm text-white">{cat.label}</h4>
                </div>
                <span className="text-[10px] font-mono bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                  {cat.code}
                </span>
              </div>

              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                High energy threshold capable of causing life-altering or fatal harm if uncontained.
              </p>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Key NLP Trigger Terms:</span>
                <div className="flex flex-wrap gap-1.5">
                  {cat.keywords.slice(0, 8).map((kw, i) => (
                    <span key={i} className="text-[10px] bg-slate-900 text-cyan-300 px-2 py-0.5 rounded font-mono border border-slate-800">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* IOGP Life Saving Rules Summary */}
      <div className="glass-panel p-6">
        <h3 className="text-base font-extrabold text-white mb-5 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" /> OIL IOGP Life-Saving Rules Directives
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="font-extrabold text-cyan-300 text-sm block mb-1.5">1. Work at Height</span>
            <p className="text-slate-300 text-xs leading-relaxed">Always protect yourself against falling when working at height (above 1.8m). Lanyards must be anchored to certified anchor points.</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="font-extrabold text-cyan-300 text-sm block mb-1.5">2. Energy Isolation (LOTO)</span>
            <p className="text-slate-300 text-xs leading-relaxed">Verify isolation before work begins and test for zero energy state across all pressure, electrical, and hydraulic systems.</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="font-extrabold text-cyan-300 text-sm block mb-1.5">3. Toxic Gas & Confined Space</span>
            <p className="text-slate-300 text-xs leading-relaxed">Obtain authorization before entering a confined space. Test gas continuously (H2S &lt; 5ppm, O2 19.5-23.5%).</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="font-extrabold text-cyan-300 text-sm block mb-1.5">4. Line of Fire & Crane Lifts</span>
            <p className="text-slate-300 text-xs leading-relaxed">Never position yourself under a suspended load. Establish 100% barricaded exclusion zones during heavy hoisting.</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="font-extrabold text-cyan-300 text-sm block mb-1.5">5. Hot Work Authorization</span>
            <p className="text-slate-300 text-xs leading-relaxed">Clear flammable materials and perform continuous atmospheric gas monitoring before producing any spark or flame.</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="font-extrabold text-cyan-300 text-sm block mb-1.5">6. Stop Work Authority</span>
            <p className="text-slate-300 text-xs leading-relaxed">Every employee & contractor has the explicit duty and right to STOP work if any SIF precursor or unsafe condition is observed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
