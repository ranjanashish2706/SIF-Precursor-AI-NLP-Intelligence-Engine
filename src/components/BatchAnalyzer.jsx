import React, { useState } from 'react';
import { 
  Layers, Download, Upload, Search, Filter, AlertTriangle, 
  CheckCircle2, FileSpreadsheet, ChevronRight, FileText, Trash2
} from 'lucide-react';
import { analyzeSafetyReport } from '../services/nlpEngine';

export default function BatchAnalyzer({ dataset, setDataset, onSelectIncident, onOpenDirective }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [facilityFilter, setFacilityFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  // Facilities list for dropdown filter
  const facilities = Array.from(new Set(dataset.map(d => d.facility)));

  // Filter dataset
  const filteredDataset = dataset.filter(item => {
    const matchesSearch = 
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.facility.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'ALL' ? true :
      statusFilter === 'SIF_ONLY' ? item.isSifPrecursor :
      !item.isSifPrecursor;

    const matchesFacility = 
      facilityFilter === 'ALL' ? true : item.facility === facilityFilter;

    const matchesSeverity = 
      severityFilter === 'ALL' ? true :
      severityFilter === 'CRITICAL' ? item.sifProbability >= 75 :
      severityFilter === 'HIGH' ? (item.sifProbability >= 55 && item.sifProbability < 75) :
      item.sifProbability < 55;

    return matchesSearch && matchesStatus && matchesFacility && matchesSeverity;
  });

  // Handle CSV File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').filter(line => line.trim() !== '');
      if (lines.length <= 1) return;

      const newItems = [];
      // Skip header line
      for (let i = 1; i < lines.length; i++) {
        const columns = lines[i].split(',');
        if (columns.length >= 2) {
          const desc = columns.slice(3).join(',').replace(/^"|"$/g, '') || columns[0];
          const nlpRes = analyzeSafetyReport(desc);
          newItems.push({
            id: `CSV-${1000 + i}`,
            date: new Date().toISOString().split('T')[0],
            facility: columns[1] ? columns[1].trim() : 'Uploaded Site',
            reporterRole: 'Bulk Upload User',
            reportType: columns[2] ? columns[2].trim() : 'Unsafe Act',
            description: desc,
            ...nlpRes
          });
        }
      }

      setDataset(prev => [...newItems, ...prev]);
      alert(`Successfully processed & appended ${newItems.length} safety reports from CSV!`);
    };
    reader.readAsText(file);
  };

  // Export Filtered Data to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'Date', 'Facility', 'Type', 'Description', 'SIF_Probability', 'Is_SIF_Precursor', 'Severity', 'Root_Cause'];
    const rows = filteredDataset.map(item => [
      item.id,
      item.date,
      `"${item.facility}"`,
      item.reportType,
      `"${item.description.replace(/"/g, '""')}"`,
      `${item.sifProbability}%`,
      item.isSifPrecursor ? 'YES' : 'NO',
      item.severityLevel,
      `"${item.rootCause}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `OIL_SIF_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="glass-panel p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" /> Batch Data Ingestion & SIF Triage Table
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Process bulk safety incident logs from OIL HSSE database. Filter by high-energy precursor status, facilities, or severity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="btn-secondary text-xs cursor-pointer">
            <Upload className="w-4 h-4" /> Upload CSV Dataset
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>
          <button onClick={exportToCSV} className="btn-primary text-xs">
            <Download className="w-4 h-4" /> Export CSV ({filteredDataset.length})
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="glass-panel p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search keywords, IDs, facility..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 text-xs"
          />
        </div>

        {/* SIF Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full text-xs"
          >
            <option value="ALL">All Reports ({dataset.length})</option>
            <option value="SIF_ONLY">SIF Precursors Only ({dataset.filter(d => d.isSifPrecursor).length})</option>
            <option value="NON_SIF">Non-SIF Low Risk ({dataset.filter(d => !d.isSifPrecursor).length})</option>
          </select>
        </div>

        {/* Facility Filter */}
        <div>
          <select
            value={facilityFilter}
            onChange={(e) => setFacilityFilter(e.target.value)}
            className="w-full text-xs"
          >
            <option value="ALL">All Operational Facilities</option>
            {facilities.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        {/* Severity Filter */}
        <div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full text-xs"
          >
            <option value="ALL">All Severity Levels</option>
            <option value="CRITICAL">Critical SIF (≥75%)</option>
            <option value="HIGH">High SIF (55-74%)</option>
            <option value="MODERATE">Moderate/Safe (&lt;55%)</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
                <th className="p-3.5">ID & Date</th>
                <th className="p-3.5">Facility / Site</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Incident Description</th>
                <th className="p-3.5 text-center">SIF Risk Index</th>
                <th className="p-3.5">Classification</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredDataset.length > 0 ? (
                filteredDataset.map((item) => (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-slate-800/40 transition-all ${
                      item.isSifPrecursor ? 'bg-red-950/10' : ''
                    }`}
                  >
                    <td className="p-3.5 font-mono">
                      <div className="font-bold text-white">{item.id}</div>
                      <div className="text-[10px] text-slate-400">{item.date}</div>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-200">{item.facility}</td>
                    <td className="p-3.5">
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                        {item.reportType}
                      </span>
                    </td>
                    <td className="p-3.5 max-w-md">
                      <p className="text-slate-300 line-clamp-2">{item.description}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.detectedEnergies.map(e => (
                          <span key={e.id} className="text-[9px] bg-slate-900 text-cyan-300 border border-slate-800 px-1.5 py-0.5 rounded">
                            {e.label.split('/')[0]}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5 text-center font-mono">
                      <div className="inline-flex flex-col items-center">
                        <span className={`font-extrabold text-sm ${
                          item.sifProbability >= 75 ? 'text-red-400' :
                          item.sifProbability >= 55 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {item.sifProbability}%
                        </span>
                        <div className="w-12 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                          <div 
                            className="h-full rounded-full"
                            style={{ 
                              width: `${item.sifProbability}%`,
                              backgroundColor: item.sifProbability >= 75 ? '#ef4444' : item.sifProbability >= 55 ? '#f59e0b' : '#10b981'
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      {item.isSifPrecursor ? (
                        <span className="badge badge-sif text-[10px]">
                          <AlertTriangle className="w-3 h-3" /> SIF PRECURSOR
                        </span>
                      ) : (
                        <span className="badge badge-safe text-[10px]">
                          <CheckCircle2 className="w-3 h-3" /> LOW RISK
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectIncident(item)}
                          className="btn-secondary text-[11px] py-1 px-2"
                          title="Open in AI Analyzer"
                        >
                          Analyze
                        </button>
                        {item.isSifPrecursor && (
                          <button
                            onClick={() => onOpenDirective(item)}
                            className="btn-danger text-[11px] py-1 px-2"
                            title="Print SIF Directive PDF"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No safety records matched the specified filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-3 bg-slate-900/80 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Showing {filteredDataset.length} of {dataset.length} total entries</span>
          <span className="font-mono text-cyan-400 font-semibold">SIF Rate in Selection: {filteredDataset.length > 0 ? ((filteredDataset.filter(d => d.isSifPrecursor).length / filteredDataset.length) * 100).toFixed(1) : 0}%</span>
        </div>
      </div>
    </div>
  );
}
