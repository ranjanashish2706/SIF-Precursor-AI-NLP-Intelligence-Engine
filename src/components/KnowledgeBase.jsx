import React from 'react';
import { BookOpen, ShieldCheck, Flame, Gauge, Skull, Cog, Zap, AlertTriangle } from 'lucide-react';
import { IOGP_LIFE_SAVING_RULES } from '../services/nlpEngine';
import FlowDiagram from './FlowDiagram';

export default function KnowledgeBase() {
  return (
    <div className="space-y-8 animate-holo-boot">
      {/* Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-slate-950 via-cyan-950/30 to-slate-950 border-cyan-500/30 shadow-2xl">
        <div className="flex items-center gap-2.5">
          <span className="badge badge-cyan">HSE SAFETY SCIENCE</span>
          <h2 className="text-lg font-extrabold text-white">IOGP Life-Saving Rules & Safety Standards Guide</h2>
        </div>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-4xl">
          Serious Injury & Fatality (SIF) precursor detection relies on identifying High-Energy Exposure and Life-Saving Rule violations.
        </p>
      </div>

      {/* Interactive System Flowchart Diagram */}
      <FlowDiagram />

      {/* Energy Wheel Grid */}
      <div>
        <h3 className="text-base font-extrabold text-white mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" /> The IOGP Life-Saving Rules
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {IOGP_LIFE_SAVING_RULES.map((rule, idx) => (
            <div key={rule.id} className="glass-panel p-5 border-t-4 shadow-xl hover:-translate-y-1 transition-transform border-t-cyan-500">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-950/30 text-cyan-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="font-extrabold text-sm text-white">{rule.id}</h4>
                </div>
                <span className="text-[10px] font-mono bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                  RULE {idx + 1}
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Key NLP Trigger Terms:</span>
                <div className="flex flex-wrap gap-1.5">
                  {rule.keywords.slice(0, 8).map((kw, i) => (
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
    </div>
  );
}
