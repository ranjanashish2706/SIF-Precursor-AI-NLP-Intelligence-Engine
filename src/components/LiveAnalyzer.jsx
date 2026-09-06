import React, { useState, useEffect } from 'react';
import { 
  Cpu, Mic, MicOff, AlertTriangle, ShieldCheck, 
  Flame, CheckCircle, FileText, Sparkles, RefreshCw, XCircle, Edit3, MessageSquare
} from 'lucide-react';
import { analyzeSafetyReport } from '../services/nlpEngine';
import { SAMPLE_INCIDENT_PRESETS } from '../services/mockData';

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
  
  // HSE Review State
  const [hseComment, setHseComment] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Re-run NLP engine whenever text changes
  useEffect(() => {
    const result = analyzeSafetyReport(inputText);
    setNlpOutput(result);
  }, [inputText]);

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
          recognition.onerror = () => simulateVoiceInput();
          recognition.onend = () => setIsRecording(false);
          recognition.start();
        } catch (e) { simulateVoiceInput(); }
      } else { setIsRecording(false); }
    } else { simulateVoiceInput(); }
  };

  const simulateVoiceInput = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setInputText('Duliajan Rig 4 worker without harness. Fall hazard.');
        setIsRecording(false);
      }, 2500);
    } else { setIsRecording(false); }
  };

  const handleHSEReview = (status) => {
    alert(`Report marked as: ${status}\nComment: ${hseComment}`);
    setShowReviewModal(false);
    setHseComment('');
  };

  return (
    <div className="space-y-8 animate-holo-boot">
      {/* Top Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-slate-950 via-cyan-950/30 to-slate-950 border-cyan-500/30 shadow-2xl">
        <div className="flex items-center gap-2.5">
          <span className="badge badge-cyan font-mono">NLP V3.0 ENGINE</span>
          <h2 className="text-lg font-extrabold text-white">Live Incident SIF Intelligence Analyzer</h2>
        </div>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          Real-time SIF classification, IOGP Life-Saving Rule mapping, and structured precursor extraction.
        </p>
      </div>

      {/* Main Grid: Form Input & AI Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Input Form */}
        <div className="lg:col-span-5 space-y-5">
          <div className="glass-panel p-6 space-y-5">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" /> Original Report Input
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-slate-300 block font-bold uppercase tracking-wider mb-1">Facility</label>
                <select value={facility} onChange={(e) => setFacility(e.target.value)} className="w-full text-xs font-bold bg-[#0b1329] text-white border border-white/20 rounded-xl p-2.5">
                  <option value="Duliajan Drilling Rig #4">Duliajan Drilling Rig #4</option>
                  <option value="Digboi Refinery Unit 3">Digboi Refinery Unit 3</option>
                  <option value="Moran Gas Field">Moran Gas Field</option>
                  <option value="Nahorkatia Tank Farm">Nahorkatia Tank Farm</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-slate-300 block font-bold uppercase tracking-wider mb-1">Category</label>
                <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full text-xs font-bold bg-[#0b1329] text-white border border-white/20 rounded-xl p-2.5">
                  <option value="Unsafe Act">Unsafe Act (UA)</option>
                  <option value="Unsafe Condition">Unsafe Condition (UC)</option>
                  <option value="Near-Miss">Near-Miss (NM)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-300 block font-bold uppercase tracking-wider mb-1">Incident Free-Text Log</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={8}
                placeholder="Type or paste unstructured safety report text..."
                className="w-full font-mono text-xs text-white bg-[#0b1329] placeholder-slate-400 border border-white/20 rounded-xl p-3.5 focus:border-cyan-400"
              />
            </div>
            
            <button onClick={toggleVoiceRecording} className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-900 text-cyan-400 border border-slate-700'}`}>
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isRecording ? 'Listening...' : 'Voice Dictation'}
            </button>
          </div>
        </div>

        {/* Right: AI Output Display */}
        <div className="lg:col-span-7 space-y-5">
          {nlpOutput ? (
            <div className="glass-panel p-6 space-y-6">
              
              {/* SIF Assessment Banner */}
              <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${nlpOutput.isSifPotential ? 'bg-red-950/40 border-red-500/60 glow-sif' : 'bg-emerald-950/40 border-emerald-500/50'}`}>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">SIF Assessment</span>
                  <div className="text-2xl font-extrabold flex items-center gap-3 mt-1">
                    {nlpOutput.isSifPotential ? (
                      <><AlertTriangle className="w-8 h-8 text-red-400 animate-bounce" /><span className="text-red-400">SIF-Potential</span></>
                    ) : (
                      <><ShieldCheck className="w-8 h-8 text-emerald-400" /><span className="text-emerald-400">Non-SIF-Potential</span></>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">AI Confidence</div>
                  <div className="text-3xl font-mono font-bold text-white">{nlpOutput.confidenceScore}%</div>
                </div>
              </div>

              {/* Life-Saving Rule & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Life-Saving Rule Mapping</h4>
                  {nlpOutput.mappedRules.length > 0 ? (
                    <div>
                      <div className="text-sm font-bold text-amber-400 mb-1">{nlpOutput.mappedRules[0].rule}</div>
                      <div className="text-[10px] text-slate-300">Confidence: {nlpOutput.mappedRules[0].confidence}%</div>
                      <div className="text-[10px] text-slate-500 mt-2">Keywords: {nlpOutput.mappedRules[0].evidence.join(', ')}</div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500">No rule mapped</div>
                  )}
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-center items-center">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Action Priority</h4>
                  <div className="text-3xl font-extrabold text-cyan-400">{nlpOutput.priorityScore}</div>
                </div>
              </div>

              {/* Structured Precursor Extraction */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Extracted Precursors</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(nlpOutput.extractedPrecursors).map(([k, v]) => (
                    <div key={k} className="flex bg-slate-950/60 p-2 rounded border border-slate-800/50">
                      <span className="w-1/3 text-slate-400 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <span className="w-2/3 font-semibold text-slate-100">{Array.isArray(v) ? v.join(', ') : v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Explainable AI */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <h4 className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-2"><Sparkles className="w-3 h-3"/> Why was this flagged?</h4>
                <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {nlpOutput.explanation}
                </div>
              </div>

              {/* HSE Review Workflow */}
              <div className="pt-4 border-t border-white/10">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">HSE Review Workflow</h4>
                
                {showReviewModal ? (
                  <div className="space-y-3 bg-slate-900 p-4 rounded-xl border border-slate-700">
                    <textarea 
                      value={hseComment} 
                      onChange={(e) => setHseComment(e.target.value)}
                      placeholder="Add HSE Officer comments..." 
                      className="w-full bg-[#0b1329] text-xs text-white p-2 rounded-lg border border-slate-700 focus:border-cyan-400"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleHSEReview('ACCEPTED')} className="btn-secondary !py-1.5 !px-3 !text-[11px] !bg-emerald-900/40 !border-emerald-500/50 text-emerald-400"><CheckCircle className="w-3 h-3"/> Accept</button>
                      <button onClick={() => handleHSEReview('REJECTED')} className="btn-secondary !py-1.5 !px-3 !text-[11px] !bg-red-900/40 !border-red-500/50 text-red-400"><XCircle className="w-3 h-3"/> Reject</button>
                      <button onClick={() => setShowReviewModal(false)} className="ml-auto text-[10px] text-slate-400 hover:text-white">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setShowReviewModal(true)} className="btn-secondary !py-2 !px-4 !text-[11px]"><CheckCircle className="w-3.5 h-3.5 text-emerald-400"/> Validate AI Output</button>
                    <button className="btn-secondary !py-2 !px-4 !text-[11px]"><Edit3 className="w-3.5 h-3.5 text-cyan-400"/> Edit Fields</button>
                  </div>
                )}
              </div>

            </div>
          ) : (
             <div className="glass-panel p-12 text-center text-slate-400">Loading AI Engine...</div>
          )}
        </div>
      </div>
    </div>
  );
}
