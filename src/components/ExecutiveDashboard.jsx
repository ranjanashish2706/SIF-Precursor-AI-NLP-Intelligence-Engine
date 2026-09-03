import React from 'react';
import { 
  AlertTriangle, ShieldAlert, CheckCircle2, Flame, ArrowUpRight, ArrowDownRight,
  Layers, Gauge, Activity, FileText, Zap, ChevronRight, Download, Sparkles, Radio
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, Legend, AreaChart, Area 
} from 'recharts';

export default function ExecutiveDashboard({ dataset, onSelectIncident, onOpenDirective }) {
  // Compute Key Metrics
  const totalReports = dataset.length;
  const sifPrecursors = dataset.filter(d => d.isSifPrecursor);
  const sifCount = sifPrecursors.length;
  const sifRate = totalReports > 0 ? ((sifCount / totalReports) * 100).toFixed(1) : 0;
  
  const criticalCount = dataset.filter(d => d.sifProbability >= 75).length;
  const highCount = dataset.filter(d => d.sifProbability >= 55 && d.sifProbability < 75).length;
  const moderateCount = dataset.filter(d => d.sifProbability < 55).length;

  // Energy distribution data
  const energyCounts = {
    Gravity: 0,
    Pressure: 0,
    Chemical: 0,
    Mechanical: 0,
    Electrical: 0,
    Thermal: 0
  };

  dataset.forEach(item => {
    item.detectedEnergies.forEach(e => {
      if (e.id === 'GRAVITY') energyCounts.Gravity++;
      if (e.id === 'PRESSURE') energyCounts.Pressure++;
      if (e.id === 'CHEMICAL') energyCounts.Chemical++;
      if (e.id === 'MECHANICAL') energyCounts.Mechanical++;
      if (e.id === 'ELECTRICAL') energyCounts.Electrical++;
      if (e.id === 'THERMAL') energyCounts.Thermal++;
    });
  });

  const energyChartData = [
    { name: 'Gravity / Height', count: energyCounts.Gravity, fill: '#ef4444' },
    { name: 'Stored Pressure', count: energyCounts.Pressure, fill: '#f59e0b' },
    { name: 'Chemical / H2S', count: energyCounts.Chemical, fill: '#a855f7' },
    { name: 'Mechanical / Crane', count: energyCounts.Mechanical, fill: '#3b82f6' },
    { name: 'Electrical / LOTO', count: energyCounts.Electrical, fill: '#eab308' },
    { name: 'Thermal / Hot Work', count: energyCounts.Thermal, fill: '#ec4899' },
  ];

  const pieData = [
    { name: 'Critical SIF (≥75%)', value: criticalCount, color: '#ef4444' },
    { name: 'High Potential (55-74%)', value: highCount, color: '#f59e0b' },
    { name: 'Moderate / Low Risk', value: moderateCount, color: '#10b981' }
  ];

  // Priority Critical Alerts
  const criticalAlerts = dataset
    .filter(d => d.isSifPrecursor)
    .sort((a, b) => b.sifProbability - a.sifProbability)
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-holo-boot">
      {/* Hero Cinematic Emergency Command Chamber */}
      <div className="glass-panel p-8 border-l-4 border-l-red-500 bg-gradient-to-r from-red-950/50 via-slate-950/90 to-slate-950/90 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-2xl relative overflow-hidden glow-sif">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start gap-5 relative z-10">
          <div className="p-4 bg-red-500/20 rounded-2xl border border-red-500/50 text-red-400 shadow-2xl shadow-red-500/30 flex-shrink-0">
            <ShieldAlert className="w-10 h-10 animate-bounce text-red-400" />
          </div>

          <div>
            <div className="flex items-center gap-3">
              <span className="badge badge-sif text-xs">HIGH THREAT LEVEL DETECTED</span>
              <span className="text-xs font-mono text-red-400 font-bold">{criticalCount} CRITICAL SI-PRECURSORS ACTIVE</span>
            </div>

            <h2 className="text-xl font-black text-white mt-1 tracking-wide">
              OIL Rig Operational Risk Alert Chamber
            </h2>

            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed max-w-3xl">
              The AI Neural Core detected uncontained high-energy precursors (Work at height without fall arrest, unisolated pressure manifolds, H2S gas risks). Work-stop verification is recommended.
            </p>
          </div>
        </div>

        <button 
          onClick={() => onOpenDirective(criticalAlerts[0])}
          className="btn-danger text-xs px-6 py-3.5 shadow-2xl flex-shrink-0 font-black tracking-wider uppercase"
        >
          <FileText className="w-5 h-5" /> Launch SIF Directive PDF
        </button>
      </div>

      {/* Micro-Intelligent Metric Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Reports Analyzed"
          value={totalReports}
          subtitle="UA / UC / Near-Miss Data"
          trend="+14% Activity"
          trendUp={true}
          icon={Layers}
          color="cyan"
        />
        <KpiCard
          title="SIF Precursors Flagged"
          value={sifCount}
          subtitle={`${sifRate}% Precursor Exposure Rate`}
          trend="-6% Velocity"
          trendUp={false}
          icon={AlertTriangle}
          color="red"
          pulse={sifCount > 0}
        />
        <KpiCard
          title="High Energy Exposure"
          value={energyCounts.Gravity + energyCounts.Pressure + energyCounts.Chemical}
          subtitle="Height, Gas & Pressure"
          trend="Top: Height & Gas"
          icon={Flame}
          color="amber"
        />
        <KpiCard
          title="AI Neural Precision"
          value="96.8%"
          subtitle="IOGP Standard Alignment"
          trend="V2.4 Active"
          icon={CheckCircle2}
          color="emerald"
        />
      </div>

      {/* Holographic Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Bar Chart: High Energy Exposure */}
        <div className="lg:col-span-7 glass-panel p-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2.5">
                <Flame className="w-5 h-5 text-amber-400" /> High-Energy Hazard Exposure Breakdown
              </h3>
              <p className="text-xs text-slate-400 mt-1">Distribution of IOGP Safety Energy Wheel categories detected in safety logs</p>
            </div>
            <span className="badge badge-amber font-mono text-[10px]">IOGP Framework</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={energyChartData} margin={{ top: 15, right: 15, left: -20, bottom: 25 }}>
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  angle={-15} 
                  textAnchor="end" 
                  interval={0}
                />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#030712', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '16px', color: '#f8fafc', boxShadow: '0 20px 40px rgba(0,0,0,0.8)' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {energyChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Risk Matrix */}
        <div className="lg:col-span-5 glass-panel p-7">
          <div className="mb-4">
            <h3 className="text-base font-black text-white flex items-center gap-2.5">
              <Gauge className="w-5 h-5 text-cyan-400" /> SIF Risk Classification Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-1">Quantitative severity matrix computed by SIF Probability Index</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={88}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#030712', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '16px', color: '#f8fafc' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value) => <span className="text-xs font-bold text-slate-300">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Priority Critical SIF Alert Feed */}
      <div className="glass-panel p-7">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 text-red-400" /> Priority SIF Precursor Incident Stream
            </h3>
            <p className="text-xs text-slate-400 mt-1">High-energy reports flagged for urgent HSE field intervention</p>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950/80 px-3 py-1 rounded-xl border border-cyan-800/50">
            Top {criticalAlerts.length} Critical Items
          </span>
        </div>

        <div className="space-y-4">
          {criticalAlerts.map(incident => (
            <div 
              key={incident.id} 
              className="bg-slate-950/90 border border-white/10 rounded-2xl p-5 hover:border-red-500/60 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xl glass-panel-interactive"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-red-950/70 border border-red-800/50 text-red-400 mt-0.5 shadow-lg">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs text-slate-400 font-extrabold bg-slate-900 px-2.5 py-0.5 rounded-lg border border-slate-800">
                      {incident.id}
                    </span>
                    <span className="text-sm font-extrabold text-white">{incident.facility}</span>
                    <span className="badge badge-sif">{incident.sifProbability}% SIF RISK</span>
                    <span className="badge badge-amber">{incident.reportType}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-4xl">{incident.description}</p>
                  
                  {/* Energy Tags */}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className="text-[11px] font-bold text-slate-400">Root Cause:</span>
                    <span className="text-[10px] bg-slate-900 text-cyan-300 font-mono px-3 py-0.5 rounded-lg border border-slate-800">
                      {incident.rootCause}
                    </span>
                    {incident.detectedEnergies.map(e => (
                      <span key={e.id} className="text-[10px] bg-red-950/60 text-red-300 border border-red-800/40 px-3 py-0.5 rounded-lg font-bold">
                        ⚡ {e.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center flex-shrink-0">
                <button 
                  onClick={() => onSelectIncident(incident)}
                  className="btn-secondary text-xs"
                >
                  Analyze in AI <ChevronRight className="w-4 h-4 text-cyan-400" />
                </button>
                <button 
                  onClick={() => onOpenDirective(incident)}
                  className="btn-danger text-xs p-3"
                  title="Generate Directive PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, subtitle, trend, trendUp, icon: Icon, color, pulse }) {
  const colorMap = {
    cyan: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/30',
    red: 'border-red-500/40 text-red-400 bg-red-950/30',
    amber: 'border-amber-500/40 text-amber-400 bg-amber-950/30',
    emerald: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/30'
  };

  return (
    <div className={`glass-panel p-6 border-l-4 ${colorMap[color]} ${pulse ? 'glow-sif' : ''} glass-panel-interactive`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-black uppercase tracking-wider text-slate-400">{title}</span>
        <div className={`p-3 rounded-2xl ${colorMap[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="text-3xl font-black text-white font-mono">{value}</div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10 text-[11px]">
        <span className="text-slate-400">{subtitle}</span>
        {trend && (
          <span className={`font-bold flex items-center gap-0.5 ${trendUp ? 'text-emerald-400' : 'text-amber-400'}`}>
            {trendUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
