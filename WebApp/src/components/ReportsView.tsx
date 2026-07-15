import { useState, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  FolderOpen,
  ArrowUpRight,
  Database
} from 'lucide-react';
import { Customer } from '../types';

interface ReportsViewProps {
  data: Customer[];
}

export default function ReportsView({ data }: ReportsViewProps) {
  const [selectedReport, setSelectedReport] = useState<'customer' | 'revenue' | 'churn' | 'engagement'>('customer');
  const [exporting, setExporting] = useState<string | null>(null);
  const [lastExport, setLastExport] = useState<{ name: string; date: string } | null>(null);

  // Dynamic calculations based on current data
  const reportStats = useMemo(() => {
    const total = data.length;
    if (total === 0) return { total: 0, churned: 0, mrr: 0, avgNps: 0, activeSupport: 0 };
    
    const churned = data.filter(c => c.Churn === 'Yes').length;
    const mrr = data.reduce((sum, c) => sum + c.MonthlyCharges, 0);
    const avgNps = data.reduce((sum, c) => sum + c.NPSScore, 0) / total;
    const activeSupport = data.filter(c => c.SupportTickets > 0).length;

    return {
      total,
      churned,
      mrr,
      avgNps,
      activeSupport
    };
  }, [data]);

  const reportMetadata = {
    customer: {
      title: 'Customer Directory Report',
      description: 'Granular log of all registered subscriber accounts, tenure logs, contract specifications, and personal demographics.',
      headers: ['CustomerID', 'Gender', 'Partner', 'Tenure', 'Contract', 'SubscriptionPlan'],
      getCSV: () => {
        const rows = data.map(c => [c.customerID, c.gender, c.Partner, c.tenure, c.Contract, c.SubscriptionPlan].join(','));
        return ['CustomerID,Gender,Partner,Tenure,Contract,SubscriptionPlan', ...rows].join('\n');
      }
    },
    revenue: {
      title: 'MRR & Revenue Risks Report',
      description: 'Financial ledger assessing monthly charges, life-time totals, contract types, subscription tiers, and estimated monthly revenue at risk.',
      headers: ['CustomerID', 'Contract', 'SubscriptionPlan', 'MonthlyCharges', 'TotalCharges', 'RevenueAtRisk'],
      getCSV: () => {
        const rows = data.map(c => [c.customerID, c.Contract, c.SubscriptionPlan, c.MonthlyCharges, c.TotalCharges, c.RevenueAtRisk].join(','));
        return ['CustomerID,Contract,SubscriptionPlan,MonthlyCharges,TotalCharges,RevenueAtRisk', ...rows].join('\n');
      }
    },
    churn: {
      title: 'Churn Pattern and Standings Report',
      description: 'Predictive surveillance report examining active churn statuses, churn counts, internet types, contract ties, and customer safety classifications.',
      headers: ['CustomerID', 'Contract', 'InternetService', 'AccountHealth', 'NPSScore', 'Churn'],
      getCSV: () => {
        const rows = data.map(c => [c.customerID, c.Contract, c.InternetService, c.AccountHealth, c.NPSScore, c.Churn].join(','));
        return ['CustomerID,Contract,InternetService,AccountHealth,NPSScore,Churn', ...rows].join('\n');
      }
    },
    engagement: {
      title: 'User Activation & Engagement Ledger',
      description: 'Telemetry document detailing login frequencies, support ticket queues, last login dates, and monthly usage hours per customer.',
      headers: ['CustomerID', 'LoginFrequency', 'SupportTickets', 'MonthlyUsageHours', 'LastLoginDays', 'NPSScore'],
      getCSV: () => {
        const rows = data.map(c => [c.customerID, c.LoginFrequency, c.SupportTickets, c.MonthlyUsageHours, c.LastLoginDays, c.NPSScore].join(','));
        return ['CustomerID,LoginFrequency,SupportTickets,MonthlyUsageHours,LastLoginDays,NPSScore', ...rows].join('\n');
      }
    }
  };

  const handleExportCSV = () => {
    setExporting('csv');
    setTimeout(() => {
      const csvContent = reportMetadata[selectedReport].getCSV();
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `ChurnRadar_${selectedReport}_report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setExporting(null);
      setLastExport({
        name: `${reportMetadata[selectedReport].title} (CSV)`,
        date: new Date().toLocaleTimeString()
      });
    }, 850);
  };

  const handleExportPDF = () => {
    setExporting('pdf');
    setTimeout(() => {
      // Simulate generating a PDF by creating a download of a formatted text file (or print window)
      // Since printing is extremely clean, let's generate a formatted summary text file representing the PDF report.
      const summaryContent = `
==================================================
              CHURN RADAR REPORT LEDGER
==================================================
Report Name  : ${reportMetadata[selectedReport].title}
Generated On : ${new Date().toLocaleString()}
Filter State : Active Database Segment

EXECUTIVE METRICS SUMMARY:
- Total Cohort Size: ${reportStats.total.toLocaleString()} Accounts
- Monthly Recurring Revenue (MRR): $${Math.round(reportStats.mrr).toLocaleString()}
- Average Customer NPS Score: ${reportStats.avgNps.toFixed(1)}/10
- Lost to Churn Count: ${reportStats.churned.toLocaleString()} Accounts
- Churn Rate %: ${((reportStats.churned / (reportStats.total || 1)) * 100).toFixed(1)}%

REPORT METADATA AND SCOPE:
${reportMetadata[selectedReport].description}

==================================================
         PRODUCED BY CHURN RADAR ENGINE
==================================================
`;
      const blob = new Blob([summaryContent.trim()], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `ChurnRadar_${selectedReport}_report_${new Date().toISOString().slice(0, 10)}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExporting(null);
      setLastExport({
        name: `${reportMetadata[selectedReport].title} (Summary Ledger)`,
        date: new Date().toLocaleTimeString()
      });
    }, 850);
  };

  return (
    <div className="space-y-6">
      {/* Upper Title Section */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Data Export & Report Ledgers
        </h2>
        <p className="text-slate-400 text-sm mt-0.5">
          Generate, compile, and download formal reports directly from the filtered customer directories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Select Report Type (1 col) */}
        <div className="space-y-4">
          <div className="glass p-5 space-y-4">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Select Report Type</span>
            
            <div className="space-y-2 flex flex-col">
              {(Object.keys(reportMetadata) as Array<keyof typeof reportMetadata>).map((key) => {
                const isSelected = selectedReport === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedReport(key)}
                    className={`w-full flex items-center gap-3.5 px-4 py-4.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/40 text-white shadow-lg shadow-cyan-500/5' 
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    <FileText className={`w-4 h-4 ${isSelected ? 'text-[#00C8FF]' : 'text-slate-400'}`} />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold block">{reportMetadata[key].title}</span>
                      <span className="text-[10px] text-slate-500 block truncate mt-0.5">{key.charAt(0).toUpperCase() + key.slice(1)} analytics ledgers</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Export Status Banner */}
          {lastExport && (
            <div className="glass p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-slate-200 font-semibold block">Last Export Complete</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Successfully exported <strong className="text-slate-300">{lastExport.name}</strong> at {lastExport.date}.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Report Summary Preview and Download Buttons (2 cols) */}
        <div className="lg:col-span-2 glass p-6 space-y-6 flex flex-col justify-between min-h-[400px]">
          <div className="space-y-5">
            <div className="flex justify-between items-center border-b border-white/5 pb-3.5">
              <div>
                <h4 className="text-sm font-semibold text-white">{reportMetadata[selectedReport].title}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-xl">
                  {reportMetadata[selectedReport].description}
                </p>
              </div>
              <FolderOpen className="w-5 h-5 text-purple-400" />
            </div>

            {/* Simulated PDF / Paper Preview Sheet */}
            <div className="bg-[#080C1D]/60 border border-white/10 p-5 rounded-xl text-xs space-y-4 font-mono text-slate-300 shadow-inner">
              <div className="flex justify-between border-b border-white/5 pb-2 text-[10px] text-slate-500 uppercase tracking-widest">
                <span>Churn Radar Core Suite</span>
                <span>SYSTEM_LEDGER_FILE_ACTIVE</span>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-y-1 text-[11px] text-slate-400">
                  <span>Report Cohort Scope:</span>
                  <span className="text-right text-white">Full Database Base ({reportStats.total.toLocaleString()} Accounts)</span>
                  
                  <span>Ledger Code:</span>
                  <span className="text-right text-white">CR-{selectedReport.toUpperCase()}-{new Date().getFullYear()}</span>

                  <span>Total Metric MRR:</span>
                  <span className="text-right text-white">${Math.round(reportStats.mrr).toLocaleString()}/month</span>

                  <span>Active Churn Count:</span>
                  <span className="text-right text-white">{reportStats.churned.toLocaleString()} Subscriber Profiles</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Generated Features In Vector Schema:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {reportMetadata[selectedReport].headers.map((h) => (
                    <span key={h} className="text-[9px] bg-[#080C1D] border border-white/10 text-slate-400 px-2 py-0.5 rounded font-mono">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Download Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-white/5">
            <button
              onClick={handleExportCSV}
              disabled={!!exporting}
              className="py-3 px-4 bg-[#080C1D]/80 hover:bg-[#080C1D] text-white border border-white/10 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-[#00C8FF]" />
              <span>{exporting === 'csv' ? 'Compiling CSV Ledger...' : 'Export to CSV File'}</span>
            </button>
            <button
              onClick={handleExportPDF}
              disabled={!!exporting}
              className="py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white hover:brightness-110 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <FileText className="w-4 h-4 text-white" />
              <span>{exporting === 'pdf' ? 'Formatting Print File...' : 'Download Summary Ledger'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Info Notice card */}
      <div className="glass p-5 flex gap-4 items-start relative overflow-hidden">
        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-slate-400">
          <Database className="w-6 h-6" />
        </div>
        <div className="space-y-1 flex-1">
          <h5 className="text-sm font-semibold text-white flex items-center gap-1.5">Database Snapshot Synchronization</h5>
          <p className="text-xs text-slate-400 leading-relaxed">
            All reports are compiled directly from the currently active data memory buffer in the browser. If you upload a customized customer database CSV, these export modules instantly adjust to synchronize with your uploaded records.
          </p>
        </div>
      </div>
    </div>
  );
}
