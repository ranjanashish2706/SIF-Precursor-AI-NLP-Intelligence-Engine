import React from 'react';
import { FileText, Cpu, Flame, ShieldAlert, FileCheck, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export default function FlowDiagram() {
  const steps = [
    {
      id: 'step-1',
      number: '01',
      title: 'Field Safety Input',
      desc: 'Unstructured text entry or voice dictation in English, Hindi, or Assamese from OIL drilling rigs & refineries.',
      icon: FileText,
      color: 'from-cyan-500 to-blue-600',
      badge: 'Multilingual Ingestion'
    },
    {
      id: 'step-2',
      number: '02',
      title: 'NLP Tokenizer & NER',
      desc: 'Normalizes field jargon, extracts rig equipment entities, location keywords, and missing safeguards.',
      icon: Cpu,
      color: 'from-blue-500 to-purple-600',
      badge: 'Entity Extraction'
    },
    {
      id: 'step-3',
      number: '03',
      title: 'IOGP Energy Wheel',
      desc: 'Maps hazards into 6 High Energy categories (Gravity, Pressure, Chemical, Mechanical, Electrical, Thermal).',
      icon: Flame,
      color: 'from-purple-600 to-pink-600',
      badge: 'High-Energy Mapping'
    },
    {
      id: 'step-4',
      number: '04',
      title: 'SIF Probability Meter',
      desc: 'Algorithm calculates quantitative SIF Risk Score (0-100%) and evaluates precursor severity level.',
      icon: ShieldAlert,
      color: 'from-amber-500 to-red-600',
      badge: 'Risk Quantification'
    },
    {
      id: 'step-5',
      number: '05',
      title: 'Emergency Directive',
      desc: 'Generates automated work-stop directives, IOGP Life-Saving mitigations, and downloadable PDF reports.',
      icon: FileCheck,
      color: 'from-emerald-500 to-cyan-500',
      badge: 'Actionable Mitigation'
    }
  ];

  return (
    <div className="glass-panel p-6 sm:p-8 space-y-6 border border-white/10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-amber font-mono">SYSTEM WORKFLOW DIAGRAM</span>
            <h3 className="text-lg font-extrabold text-white">AI/NLP SIF Intelligence Decision Flow</h3>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            End-to-end operational flowchart from field incident log ingestion to automated work-stop directive generation.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300">Processing Time:</span>
          <span className="text-emerald-400 font-bold">&lt; 150ms</span>
        </div>
      </div>

      {/* Interactive Horizontal Flow Diagram Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          return (
            <div key={step.id} className="relative group">
              {/* Connector Line for Desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10 text-slate-600 group-hover:text-cyan-400 transition-colors">
                  <ArrowRight className="w-5 h-5 animate-pulse" />
                </div>
              )}

              {/* Step Node Card */}
              <div className="bg-slate-950/90 p-5 rounded-2xl border border-white/10 hover:border-cyan-400/50 transition-all duration-300 h-full flex flex-col justify-between shadow-xl relative overflow-hidden group-hover:-translate-y-1">
                {/* Background Shimmer Glow */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${step.color} opacity-10 rounded-full blur-2xl group-hover:opacity-25 transition-opacity`} />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg shadow-cyan-500/20`}>
                      <StepIcon className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-extrabold font-mono text-slate-600 group-hover:text-cyan-300 transition-colors">
                      {step.number}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold font-mono bg-slate-900 text-cyan-300 px-2 py-0.5 rounded border border-slate-800 uppercase tracking-wider inline-block mb-2">
                    {step.badge}
                  </span>

                  <h4 className="text-sm font-extrabold text-white mb-1.5">{step.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Phase {index + 1}</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
