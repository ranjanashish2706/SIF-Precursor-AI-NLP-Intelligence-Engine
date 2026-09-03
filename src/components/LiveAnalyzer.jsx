import React, { useState, useEffect } from 'react';
import { 
  Cpu, Mic, MicOff, Play, AlertTriangle, ShieldCheck, 
  Flame, Gauge, CheckCircle, FileText, Globe, Sparkles, RefreshCw, History, ArrowRight
} from 'lucide-react';
import { analyzeSafetyReport } from '../services/nlpEngine';
import { SAMPLE_INCIDENT_PRESETS } from '../services/mockData';
import RiskGauge from './RiskGauge';

export default function LiveAnalyzer({ initialIncident, onSaveToDataset, onOpenDirective }) {
  const [inputText, setInputText] = useState(
    initialIncident ? initialIncident.description : SAMPLE_INCIDENT_PRESETS[0].text
  );
  const [facility, setFacility] = useState(
    initialIncident ? initialIncident.facility : 'Duliajan Drilling Rig #4'
  );
  const [reportType, setReportType] = useState(
    initialIncident ? initialIncident.reportType : 'Unsafe Act'
  );

  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [nlpOutput, setNlpOutput] = useState(null);

  // Re-run NLP engine whenever text changes
  useEffect(() => {
    const result = analyzeSafetyReport(inputText);
    setNlpOutput(result);
  }, [inputText]);

  // Voice recording logic with browser Web Speech API & fallback simulation
  const toggleVoiceRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      if (!isRecording) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.lang = selectedLanguage === 'Hindi' ? 'hi-IN' : selectedLanguage === 'Assamese' ? 'as-IN' : 'en-US';

          recognition.onstart = () => setIsRecording(true);
          recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInputText(prev => prev ? `${prev} ${transcript}` : transcript);
            setIsRecording(false);
          };
          recognition.onerror = () => {
            simulateVoiceInput();
          };
          recognition.onend = () => setIsRecording(false);

          recognition.start();
        } catch (e) {
          simulateVoiceInput();
        }
      } else {
        setIsRecording(false);
      }
    } else {
      simulateVoiceInput();
    }
  };

  const simulateVoiceInput = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setInputText(
          'Duliajan Rig 4 monkey board par roughneck height par bina safety belt va harness kaam kar raha hai. Unchecked winch line.'
        );
        setSelectedLanguage('Hindi/Assamese');
        setIsRecording(false);
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  const handleSelectPreset = (preset) => {
    setInputText(preset.text);
    setFacility(preset.location);
    setSelectedLanguage(preset.language);
  };

  const handleAddToDataset = () => {
    if (!nlpOutput || !inputText) return;
    const newRecord = {
      id: `OIL-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      facility,
      reporterRole: 'Field Safety Engineer',
      reportType,
      description: inputText,
      ...nlpOutput
    };
    onSaveToDataset(newRecord);
    alert(`Incident ${newRecord.id} successfully processed & added to OIL safety dataset!`);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-slate-950 via-cyan-950/30 to-slate-950 border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-2xl">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="badge badge-cyan font-mono">NLP V2.4 ENGINE</span>
            <h2 className="text-lg font-extrabold text-white">Live Incident SIF Intelligence Analyzer</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Real-time natural language evaluation of unstructured safety logs (English, Hindi, Assamese). Identifies high-energy sources, missing safeguards, and computes SIF risk probability.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/90 p-2 rounded-xl border border-white/10">
          <span className="text-xs text-slate-400 font-bold px-2">Language Mode:</span>
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            {['English', 'Hindi', 'Assamese'].map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  selectedLanguage.includes(lang) 
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-World Incident Presets */}
      <div className="glass-panel p-5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" /> Real-World OIL Incident Presets (Click to Auto-fill)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SAMPLE_INCIDENT_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className="text-left bg-slate-950/80 hover:bg-slate-900 p-3.5 rounded-xl border border-white/10 hover:border-cyan-500/50 transition-all text-xs group"
            >
              <div className="font-extrabold text-cyan-300 group-hover:text-white transition-colors truncate">{preset.title}</div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                <span>{preset.location}</span>
                <span className="font-mono text-amber-400">{preset.language}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Form Input & AI Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Form */}
        <div className="lg:col-span-6 space-y-5">
          <div className="glass-panel p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" /> Safety Incident Report Input
              </h3>
              
              {/* Voice Dictation Button */}
              <button
                onClick={toggleVoiceRecording}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
                  isRecording 
                    ? 'bg-red-600 text-white animate-pulse shadow-red-500/50 border border-red-400' 
                    : 'bg-slate-900 text-cyan-400 border border-slate-700 hover:bg-slate-800'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-cyan-400" />}
                {isRecording ? 'Listening (Field Speech)...' : 'Speech-to-Text Input'}
              </button>
            </div>

            {/* Metadata Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-slate-400 block font-bold uppercase tracking-wider mb-1">OIL Operational Facility</label>
                <select
                  value={facility}
                  onChange={(e) => setFacility(e.target.value)}
                  className="w-full text-xs font-semibold"
                >
                  <option value="Duliajan Drilling Rig #4">Duliajan Drilling Rig #4</option>
                  <option value="Digboi Refinery Unit 3">Digboi Refinery Unit 3</option>
                  <option value="Moran Gas Field">Moran Gas Field</option>
                  <option value="Nahorkatia Tank Farm">Nahorkatia Tank Farm</option>
                  <option value="Guwahati Pipeline Station 5">Guwahati Pipeline Station 5</option>
                  <option value="Jorhat Field Ops">Jorhat Field Ops</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block font-bold uppercase tracking-wider mb-1">Report Category</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full text-xs font-semibold"
                >
                  <option value="Unsafe Act">Unsafe Act (UA)</option>
                  <option value="Unsafe Condition">Unsafe Condition (UC)</option>
                  <option value="Near-Miss">Near-Miss (NM)</option>
                </select>
              </div>
            </div>

            {/* Textarea Input */}
            <div>
              <label className="text-[11px] text-slate-400 block font-bold uppercase tracking-wider mb-1">
                Incident Free-Text Log ({inputText.length} chars)
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={8}
                placeholder="Type or paste unstructured safety report text..."
                className="w-full font-mono text-xs leading-relaxed"
              />
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setInputText('')}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Clear Form
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToDataset}
                  className="btn-secondary text-xs"
                >
                  Save to Safety Logs
                </button>
                {nlpOutput && nlpOutput.isSifPrecursor && (
                  <button
                    onClick={() => onOpenDirective({
                      id: 'LIVE-ANALYSIS',
                      facility,
                      reportType,
                      description: inputText,
                      ...nlpOutput
                    })}
                    className="btn-danger text-xs shadow-lg"
                  >
                    <FileText className="w-4 h-4" /> Export SIF Directive PDF
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: AI Output Display */}
        <div className="lg:col-span-6 space-y-5">
          {nlpOutput ? (
            <div className="glass-panel p-6 space-y-6">
              {/* Classification Banner */}
              <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${
                nlpOutput.isSifPrecursor 
                  ? 'bg-gradient-to-r from-red-950/70 via-slate-900 to-red-950/70 border-red-500/60 glow-sif' 
                  : 'bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border-emerald-500/50'
              }`}>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AI Classification Result</span>
                  <div className="text-xl font-extrabold flex items-center gap-2.5 mt-1">
                    {nlpOutput.isSifPrecursor ? (
                      <>
                        <AlertTriangle className="w-7 h-7 text-red-400 animate-bounce" />
                        <span className="text-red-400">{nlpOutput.severityLevel}</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-7 h-7 text-emerald-400" />
                        <span className="text-emerald-400">{nlpOutput.severityLevel}</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    {nlpOutput.isSifPrecursor 
                      ? 'High-energy precursor detected! Requires immediate work-stop evaluation.' 
                      : 'Standard low-energy hazard. Normal HSE routine corrective action.'}
                  </p>
                </div>

                {/* SVG Risk Gauge Meter */}
                <div className="bg-slate-950/80 p-3 rounded-2xl border border-white/10 flex flex-col items-center justify-center">
                  <RiskGauge score={nlpOutput.sifProbability} size={110} />
                </div>
              </div>

              {/* Identified High Energy Exposures */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" /> IOGP High Energy Sources Identified ({nlpOutput.detectedEnergies.length})
                </h4>
                {nlpOutput.detectedEnergies.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {nlpOutput.detectedEnergies.map(e => (
                      <div key={e.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                        <div className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: e.color }} />
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            {e.label}
                            <span className="text-[9px] font-mono bg-slate-900 text-slate-400 px-1.5 py-0.2 rounded border border-slate-800">
                              {e.code}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">Matched words: {e.matches.join(', ')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic bg-slate-950/60 p-3 rounded-xl">No high energy sources identified.</div>
                )}
              </div>

              {/* Control Omissions & Taxonomy Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-400" /> Critical Control Omissions
                  </h4>
                  {nlpOutput.missingControls.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {nlpOutput.missingControls.map((ctrl, i) => (
                        <span key={i} className="badge badge-sif text-[10px] py-1 px-2.5">
                          🛑 {ctrl}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11px] text-emerald-400 font-semibold bg-slate-950/60 p-2.5 rounded-xl border border-emerald-900/30">
                      ✓ No missing control flags.
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Root Cause Taxonomy Code
                  </h4>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded font-bold">
                      {nlpOutput.rootCauseCode}
                    </span>
                    <div className="text-xs text-white font-extrabold mt-1.5">{nlpOutput.rootCause}</div>
                  </div>
                </div>
              </div>

              {/* AI Recommended Actions */}
              <div className="pt-3 border-t border-slate-800">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" /> AI Action Directives (IOGP Alignment)
                </h4>
                <div className="space-y-2">
                  {nlpOutput.mitigations.map((action, i) => (
                    <div key={i} className="text-xs text-slate-200 bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-start gap-3">
                      <span className="text-cyan-400 font-bold font-mono text-sm">{i + 1}.</span>
                      <span className="leading-relaxed">{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Historical Case Matching */}
              {nlpOutput.similarHistoricalCases && nlpOutput.similarHistoricalCases.length > 0 && (
                <div className="pt-3 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <History className="w-4 h-4" /> Historical Incident Vector Matching
                  </h4>
                  <div className="space-y-2.5">
                    {nlpOutput.similarHistoricalCases.slice(0, 2).map((hc) => (
                      <div key={hc.id} className="bg-purple-950/30 border border-purple-900/50 p-3 rounded-xl text-xs">
                        <div className="flex items-center justify-between font-bold text-purple-300">
                          <span>{hc.title} ({hc.year})</span>
                          <span className="text-[10px] bg-purple-900/80 text-purple-200 px-2.5 py-0.5 rounded-full font-mono">
                            {hc.similarityScore}% Match
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
                          <span className="text-purple-400 font-bold">Lesson Learned:</span> {hc.lessonLearned}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel p-12 text-center text-slate-400">
              Enter safety report text to activate real-time NLP analysis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
