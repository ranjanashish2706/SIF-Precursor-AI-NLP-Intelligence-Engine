import React, { useState } from 'react';
import { 
  Layers, Download, Upload, Search, Filter, AlertTriangle, 
  CheckCircle2, FileSpreadsheet, ChevronRight, FileText, CheckCircle, Clock
} from 'lucide-react';
import { analyzeSafetyReport } from '../services/nlpEngine';

export default function BatchAnalyzer({ dataset, setDataset, onSelectIncident, onOpenDirective }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [facilityFilter, setFacilityFilter] = useState('ALL');
  const [reviewFilter, setReviewFilter] = useState('ALL');

  const facilities = Array.from(new Set(dataset.map(d => d.facility)));

  const filteredDataset = dataset.filter(item => {
    const matchesSearch = 
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.facility.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'ALL' ? true :
      statusFilter === 'SIF_ONLY' ? item.isSifPotential :
      !item.isSifPotential;

    const matchesFacility = 
      facilityFilter === 'ALL' ? true : item.facility === facilityFilter;

    const matchesReview = 
      reviewFilter === 'ALL' ? true : item.reviewStatus === reviewFilter;

    return matchesSearch && matchesStatus && matchesFacility && matchesReview;
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').filter(line => line.trim() !== '');
      if (lines.length <= 1) return;

      const newItems = [];
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

  const exportToCSV = () => {
    const headers = ['ID', 'Date', 'Facility', 'Activity', 'SIF_Status', 'Confidence', 'Life_Saving_Rule', 'Barrier_Failure', 'Priority', 'Review_Status'];
    const rows = filteredDataset.map(item => [
      item.id,
      item.date,
      `"${item.facility}"`,
      item.reportType,
      item.isSifPotential ? 'SIF-Potential' : 'Non-SIF',
      `${item.confidenceScore}%`,
      `"${item.mappedRules?.length > 0 ? item.mappedRules[0].rule : 'N/A'}"`,
      `"${item.extractedPrecursors?.barrierFailures?.join(', ') || 'N/A'}"`,
      item.priorityScore,
      item.reviewStatus || 'PENDING_REVIEW'
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
    <div className="space-y-6 animate-holo-boot">
      {/* Top Action Bar */}
      <div className="glass-panel p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" /> HSE Intelligence Data Table
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Structured SIF-Potential pipeline with IOGP rule tagging and Barrier Failure isolation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="btn-secondary text-xs cursor-pointer">
            <Upload className="w-4 h-4" /> Upload CSV
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>
          <button onClick={exportToCSV} className="btn-primary text-xs">
            <Download className="w-4 h-4" /> Export Data ({filteredDataset.length})
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="glass-panel p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input type="text" placeholder="Search keywords..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 text-xs bg-[#0b1329] border-slate-700 rounded-lg p-2 text-white" />
        </div>
        <div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full text-xs bg-[#0b1329] border-slate-700 rounded-lg p-2.5 text-white">
            <option value="ALL">All Status</option>
            <option value="SIF_ONLY">SIF-Potential</option>
            <option value="NON_SIF">Non-SIF</option>
          </select>
        </div>
        <div>
          <select value={facilityFilter} onChange={(e) => setFacilityFilter(e.target.value)} className="w-full text-xs bg-[#0b1329] border-slate-700 rounded-lg p-2.5 text-white">
            <option value="ALL">All Sites</option>
            {facilities.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <select value={reviewFilter} onChange={(e) => setReviewFilter(e.target.value)} className="w-full text-xs bg-[#0b1329] border-slate-700 rounded-lg p-2.5 text-white">
            <option value="ALL">All Review Status</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
            <option value="EDITED">Edited</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                <th className="p-3">ID & Date</th>
                <th className="p-3">Site</th>
                <th className="p-3">Activity</th>
                <th className="p-3">SIF Status</th>
                <th className="p-3">Life-Saving Rule</th>
                <th className="p-3">Barrier Failure</th>
                <th className="p-3 text-center">Priority</th>
                <th className="p-3">Review</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredDataset.length > 0 ? (
                filteredDataset.map((item) => (
                  <tr key={item.id} className={`hover:bg-slate-800/40 transition-all ${item.isSifPotential ? 'bg-red-950/10' : ''}`}>
                    <td className="p-3 font-mono">
                      <div className="font-bold text-white">{item.id}</div>
                      <div className="text-[10px] text-slate-400">{item.date}</div>
                    </td>
                    <td className="p-3 font-semibold text-slate-200">{item.facility}</td>
                    <td className="p-3"><span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">{item.reportType}</span></td>
                    <td className="p-3">
                      {item.isSifPotential ? (
                        <div className="flex items-center gap-1.5 font-bold text-red-400"><AlertTriangle className="w-3.5 h-3.5" /> SIF-Potential ({item.confidenceScore}%)</div>
                      ) : (
                        <div className="flex items-center gap-1.5 font-bold text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" /> Non-SIF</div>
                      )}
                    </td>
                    <td className="p-3 font-semibold text-amber-400">{item.mappedRules?.length > 0 ? item.mappedRules[0].rule : '-'}</td>
                    <td className="p-3 text-slate-300">{item.extractedPrecursors?.barrierFailures?.join(', ') || '-'}</td>
                    <td className="p-3 text-center font-mono font-bold text-cyan-400">{item.priorityScore}</td>
                    <td className="p-3">
                      {item.reviewStatus === 'ACCEPTED' ? <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Accepted</span> :
                       item.reviewStatus === 'REJECTED' ? <span className="text-red-400 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Rejected</span> :
                       <span className="text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3"/> Pending</span>}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => onSelectIncident(item)} className="btn-secondary text-[10px] py-1 px-2">Analyze</button>
                        {item.isSifPotential && (
                          <button onClick={() => onOpenDirective(item)} className="btn-danger text-[10px] py-1 px-2"><FileText className="w-3.5 h-3.5" /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={9} className="p-8 text-center text-slate-400">No safety records matched criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-slate-900/80 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Showing {filteredDataset.length} of {dataset.length} entries</span>
        </div>
      </div>
    </div>
  );
}
