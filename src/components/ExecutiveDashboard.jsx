import React, { useMemo } from 'react';
import { 
  AlertTriangle, ShieldAlert, CheckCircle2, Flame, ArrowUpRight, ArrowDownRight,
  Layers, Activity, FileText, Download, Target, MapPin, Grid, TrendingUp
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { detectPatterns, calculateSIFDensity } from '../services/nlpEngine';

export default function ExecutiveDashboard({ dataset, onSelectIncident, onOpenDirective }) {
  const totalReports = dataset.length;
  const sifPrecursors = dataset.filter(d => d.isSifPotential);
  const sifCount = sifPrecursors.length;
  const nonSifCount = totalReports - sifCount;
  const sifDensity = totalReports > 0 ? ((sifCount / totalReports) * 100).toFixed(1) : 0;
  
  const patterns = useMemo(() => detectPatterns(dataset), [dataset]);
  const siteDensity = useMemo(() => calculateSIFDensity(dataset, 'facility'), [dataset]);
  
  const highRiskSitesCount = siteDensity.filter(s => parseFloat(s.density) > 20).length;
  const topLSR = patterns.length > 0 ? patterns[0].rule : 'N/A';

  // Extract Barrier Failures
  const barrierCounts = {};
  dataset.forEach(d => {
    if(d.extractedPrecursors && d.extractedPrecursors.barrierFailures) {
      d.extractedPrecursors.barrierFailures.forEach(bf => {
        if(bf !== 'N/A') {
          barrierCounts[bf] = (barrierCounts[bf] || 0) + 1;
        }
      });
    }
  });
  const topBarriers = Object.entries(barrierCounts).sort((a,b) => b[1] - a[1]).slice(0, 5);

  const pieData = [
    { name: 'SIF-Potential', value: sifCount, color: '#ef4444' },
    { name: 'Non-SIF', value: nonSifCount, color: '#10b981' }
  ];

  const siteChartData = siteDensity.slice(0, 5).map(s => ({
    name: s.name.split(' ').slice(0,2).join(' '),
    density: parseFloat(s.density),
    fill: '#f59e0b'
  }));

  // Trend Data for AreaChart
  const trendData = useMemo(() => {
    const grouped = {};
    dataset.forEach(d => {
      if (!d.date) return;
      const dateKey = d.date.substring(5); // e.g., '08-25'
      if (!grouped[dateKey]) grouped[dateKey] = { date: dateKey, SIF: 0, Total: 0 };
      grouped[dateKey].Total++;
      if (d.isSifPotential) grouped[dateKey].SIF++;
    });
    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
  }, [dataset]);

  return (
    <div className="space-y-8 animate-holo-boot">
      {/* Hero Cinematic Emergency Command Chamber */}
      <div className="glass-panel p-8 border-l-4 border-l-red-500 bg-gradient-to-r from-red-950/50 via-slate-950/90 to-slate-950/90 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-2xl relative overflow-hidden glow-sif">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-start gap-5 relative z-10">
          <div className="p-4 bg-red-500/20 rounded-2xl border border-red-500/50 text-red-400 shadow-2xl shadow-red-500/30 flex-shrink-0">
            <Target className="w-10 h-10 animate-bounce text-red-400" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <span className="badge badge-sif text-xs">WHERE SHOULD HSE FOCUS?</span>
              <span className="text-xs font-mono text-red-400 font-bold">{patterns.length} SYSTEMIC PATTERNS DETECTED</span>
            </div>
            <h2 className="text-xl font-black text-white mt-1 tracking-wide">
              Top Priority: {patterns.length > 0 ? patterns[0].pattern : 'No immediate action'}
            </h2>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed max-w-3xl">
              {patterns.length > 0 ? `Detected ${patterns[0].occurrences} occurrences across ${patterns[0].sites.length} sites. High risk of ${patterns[0].rule} violations due to ${patterns[0].mainBarrier}. Immediate intervention required.` : 'All operations normal.'}
            </p>
          </div>
        </div>
      </div>

      {/* Micro-Intelligent Metric Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard title="Total Reports" value={totalReports} icon={Layers} color="cyan" />
        <KpiCard title="SIF-Potential" value={sifCount} icon={AlertTriangle} color="red" pulse={sifCount > 0} />
        <KpiCard title="SIF Density" value={`${sifDensity}%`} icon={Activity} color="amber" />
        <KpiCard title="High-Risk Sites" value={highRiskSitesCount} icon={MapPin} color="amber" />
        <KpiCard title="Top LSR Violation" value={topLSR.split(' ')[0]} icon={ShieldAlert} color="red" />
      </div>

      {/* Holographic Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Area Chart: Trend Over Time */}
        <div className="lg:col-span-8 glass-panel p-7">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-black text-white flex items-center gap-2.5">
              <TrendingUp className="w-5 h-5 text-cyan-400" /> SIF Precursor Volume Trend
            </h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSIF" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#030712', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '16px' }} />
                <Legend verticalAlign="top" height={36} formatter={(value) => <span className="text-xs font-bold text-slate-300">{value}</span>} />
                <Area type="monotone" dataKey="Total" stroke="#10b981" fillOpacity={0} strokeWidth={2} name="Total Reports" />
                <Area type="monotone" dataKey="SIF" stroke="#ef4444" fill="url(#colorSIF)" strokeWidth={3} name="SIF-Potential" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: SIF vs Non-SIF */}
        <div className="lg:col-span-4 glass-panel p-7">
          <h3 className="text-base font-black text-white flex items-center gap-2.5 mb-4">
            <Target className="w-5 h-5 text-cyan-400" /> SIF Classification
          </h3>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`pie-cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#030712', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '16px' }} />
                <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-xs font-bold text-slate-300">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Bar Chart: Density by Site */}
        <div className="glass-panel p-7">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-black text-white flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-amber-400" /> Site SIF Density
            </h3>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={siteChartData} margin={{ top: 15, right: 0, left: -20, bottom: 25 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} angle={-15} textAnchor="end" interval={0}/>
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#030712', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '8px' }} />
                <Bar dataKey="density" radius={[4, 4, 0, 0]} name="Density %">
                  {siteChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Top Barrier Failures */}
        <div className="glass-panel p-7">
          <h3 className="text-base font-black text-white flex items-center gap-2.5 mb-4">
            <Flame className="w-5 h-5 text-red-400" /> Top Barrier Failures
          </h3>
          <div className="space-y-3">
            {topBarriers.map((barrier, i) => (
              <div key={i} className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-xs font-semibold text-slate-300">{i+1}. {barrier[0]}</span>
                <span className="text-xs font-mono font-bold text-red-400">{barrier[1]} events</span>
              </div>
            ))}
          </div>
        </div>

        {/* Systemic Patterns */}
        <div className="glass-panel p-7">
          <h3 className="text-base font-black text-white flex items-center gap-2.5 mb-4">
            <Grid className="w-5 h-5 text-purple-400" /> High-Risk Activities
          </h3>
          <div className="space-y-3">
            {patterns.slice(0,5).map((p, i) => (
              <div key={i} className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-xs font-semibold text-slate-300">{i+1}. {p.pattern}</span>
                <div className="text-right">
                  <div className="text-[10px] text-red-400 font-bold">{p.sifCount} SIF</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function KpiCard({ title, value, icon: Icon, color, pulse }) {
  const colorMap = {
    cyan: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/30',
    red: 'border-red-500/40 text-red-400 bg-red-950/30',
    amber: 'border-amber-500/40 text-amber-400 bg-amber-950/30',
    emerald: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/30'
  };

  return (
    <div className={`glass-panel p-4 border-l-4 ${colorMap[color]} ${pulse ? 'glow-sif' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{title}</span>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-black text-white font-mono">{value}</div>
    </div>
  );
}
