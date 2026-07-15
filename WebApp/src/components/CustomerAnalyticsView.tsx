import { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Mail, 
  CreditCard, 
  Calendar, 
  Clock, 
  Compass, 
  Smile, 
  AlertOctagon,
  X,
  FileBarChart2,
  Percent,
  LifeBuoy
} from 'lucide-react';
import { Customer, FilterState } from '../types';

interface CustomerAnalyticsViewProps {
  data: Customer[];
  selectedCustomerID: string | null;
  setSelectedCustomerID: (customerID: string | null) => void;
}

export default function CustomerAnalyticsView({ 
  data, 
  selectedCustomerID, 
  setSelectedCustomerID 
}: CustomerAnalyticsViewProps) {
  // Filter States
  const [filters, setFilters] = useState<FilterState>({
    gender: 'All',
    Contract: 'All',
    SubscriptionPlan: 'All',
    InternetService: 'All',
    PaymentMethod: 'All',
    AccountHealth: 'All',
    Churn: 'All',
    searchQuery: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Unique lists for filters
  const uniqueGenders = ['All', 'Male', 'Female'];
  const uniqueContracts = ['All', 'Month-to-month', 'One year', 'Two year'];
  const uniquePlans = ['All', 'Basic', 'Standard', 'Premium'];
  const uniqueInternets = ['All', 'DSL', 'Fiber optic', 'No'];
  const uniquePayments = ['All', 'Electronic check', 'Mailed check', 'Bank transfer (automatic)', 'Credit card (automatic)'];
  const uniqueHealths = ['All', 'Good', 'Fair', 'Poor'];
  const uniqueChurns = ['All', 'Yes', 'No'];

  // Filter & Search Logic
  const filteredCustomers = useMemo(() => {
    return data.filter(c => {
      // Text search (by customerID)
      if (filters.searchQuery && !c.customerID.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false;
      }
      if (filters.gender !== 'All' && c.gender !== filters.gender) return false;
      if (filters.Contract !== 'All' && c.Contract !== filters.Contract) return false;
      if (filters.SubscriptionPlan !== 'All' && c.SubscriptionPlan !== filters.SubscriptionPlan) return false;
      if (filters.InternetService !== 'All' && c.InternetService !== filters.InternetService) return false;
      if (filters.PaymentMethod !== 'All' && c.PaymentMethod !== filters.PaymentMethod) return false;
      if (filters.AccountHealth !== 'All' && c.AccountHealth !== filters.AccountHealth) return false;
      if (filters.Churn !== 'All' && c.Churn !== filters.Churn) return false;
      
      return true;
    });
  }, [data, filters]);

  // Pagination Logic
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCustomers, currentPage]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;

  // Customer Segmentation Metrics
  const segmentStats = useMemo(() => {
    const total = filteredCustomers.length;
    if (total === 0) return { avgTenure: 0, avgMonthly: 0, churnPercent: 0, totalRevenue: 0 };
    
    const tenureSum = filteredCustomers.reduce((sum, c) => sum + c.tenure, 0);
    const monthlySum = filteredCustomers.reduce((sum, c) => sum + c.MonthlyCharges, 0);
    const churnCount = filteredCustomers.filter(c => c.Churn === 'Yes').length;
    const totalRevSum = filteredCustomers.reduce((sum, c) => sum + c.TotalCharges, 0);

    return {
      avgTenure: tenureSum / total,
      avgMonthly: monthlySum / total,
      churnPercent: (churnCount / total) * 100,
      totalRevenue: totalRevSum
    };
  }, [filteredCustomers]);

  // Selected Customer Details
  const selectedCustomer = useMemo(() => {
    if (!selectedCustomerID) return null;
    return data.find(c => c.customerID === selectedCustomerID) || null;
  }, [data, selectedCustomerID]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to page 1 on filter
  };

  const clearFilters = () => {
    setFilters({
      gender: 'All',
      Contract: 'All',
      SubscriptionPlan: 'All',
      InternetService: 'All',
      PaymentMethod: 'All',
      AccountHealth: 'All',
      Churn: 'All',
      searchQuery: ''
    });
    setCurrentPage(1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left side: Main Analytics Table and Filters (2 cols) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Filters Panel */}
        <div className="glass p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#00C8FF]" />
              <h3 className="text-sm font-semibold text-white">Segment Filtration Suite</h3>
            </div>
            <button 
              onClick={clearFilters}
              className="text-xs text-purple-400 hover:text-white cursor-pointer font-medium"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Search Bar */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search Account ID..."
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#080C1D] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00C8FF]/50"
              />
            </div>

            {/* Churn Filter */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-slate-500">Churn Status</label>
              <select
                value={filters.Churn}
                onChange={(e) => handleFilterChange('Churn', e.target.value)}
                className="w-full bg-[#080C1D] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
              >
                {uniqueChurns.map(c => <option key={c} value={c}>{c === 'All' ? 'All Churn' : c === 'Yes' ? 'Churned' : 'Retained'}</option>)}
              </select>
            </div>

            {/* Account Health Filter */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-slate-500">Account Health</label>
              <select
                value={filters.AccountHealth}
                onChange={(e) => handleFilterChange('AccountHealth', e.target.value)}
                className="w-full bg-[#080C1D] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
              >
                {uniqueHealths.map(h => <option key={h} value={h}>{h === 'All' ? 'All Healths' : `Health: ${h}`}</option>)}
              </select>
            </div>

            {/* Contract Filter */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-slate-500">Contract</label>
              <select
                value={filters.Contract}
                onChange={(e) => handleFilterChange('Contract', e.target.value)}
                className="w-full bg-[#080C1D] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
              >
                {uniqueContracts.map(c => <option key={c} value={c}>{c === 'All' ? 'All Contracts' : c}</option>)}
              </select>
            </div>

            {/* Plan Filter */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-slate-500">Tier Tier</label>
              <select
                value={filters.SubscriptionPlan}
                onChange={(e) => handleFilterChange('SubscriptionPlan', e.target.value)}
                className="w-full bg-[#080C1D] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
              >
                {uniquePlans.map(p => <option key={p} value={p}>{p === 'All' ? 'All Plans' : `${p} Tier`}</option>)}
              </select>
            </div>

            {/* Internet Filter */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-slate-500">Internet Connection</label>
              <select
                value={filters.InternetService}
                onChange={(e) => handleFilterChange('InternetService', e.target.value)}
                className="w-full bg-[#080C1D] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
              >
                {uniqueInternets.map(i => <option key={i} value={i}>{i === 'All' ? 'All Connections' : i === 'No' ? 'No Internet' : i}</option>)}
              </select>
            </div>

            {/* Payment Method Filter */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-slate-500">Payment Option</label>
              <select
                value={filters.PaymentMethod}
                onChange={(e) => handleFilterChange('PaymentMethod', e.target.value)}
                className="w-full bg-[#080C1D] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
              >
                {uniquePayments.map(p => <option key={p} value={p}>{p === 'All' ? 'All Payments' : p.replace(' (automatic)', '')}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Segmentation Statistics Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 glass p-4">
          <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Cohort Size</span>
            <span className="text-lg font-bold text-white block mt-1">{filteredCustomers.length.toLocaleString()}</span>
            <span className="text-[9px] text-slate-500">Filtered Accounts</span>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Average Tenure</span>
            <span className="text-lg font-bold text-cyan-400 block mt-1">{Math.round(segmentStats.avgTenure)} mos</span>
            <span className="text-[9px] text-slate-500">Customer Lifespan</span>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Monthly Charges ARPU</span>
            <span className="text-lg font-bold text-purple-400 block mt-1">${segmentStats.avgMonthly.toFixed(1)}</span>
            <span className="text-[9px] text-slate-500">Monthly Avg per User</span>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Cohort Churn</span>
            <span className="text-lg font-bold text-rose-400 block mt-1">{segmentStats.churnPercent.toFixed(1)}%</span>
            <span className="text-[9px] text-slate-500">Active Leakage Ratio</span>
          </div>
        </div>

        {/* Customer Database Interactive Table */}
        <div className="glass p-5">
          <h4 className="text-sm font-semibold text-white mb-4">SaaS Customer Master Directory</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-[11px] font-mono uppercase tracking-wider">
                  <th className="py-2.5 px-3">CustomerID</th>
                  <th className="py-2.5 px-3">Plan</th>
                  <th className="py-2.5 px-3">Contract</th>
                  <th className="py-2.5 px-3">Charges</th>
                  <th className="py-2.5 px-3">Health</th>
                  <th className="py-2.5 px-3">Churn</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                {paginatedCustomers.map((cust) => {
                  const isSelected = selectedCustomerID === cust.customerID;
                  return (
                    <tr 
                      key={cust.customerID} 
                      className={`hover:bg-white/[0.02] transition-colors ${isSelected ? 'bg-white/[0.04] border-l-2 border-[#00C8FF]' : ''}`}
                    >
                      <td className="py-3 px-3 font-mono font-medium text-white">{cust.customerID}</td>
                      <td className="py-3 px-3">{cust.SubscriptionPlan}</td>
                      <td className="py-3 px-3 text-slate-400">{cust.Contract}</td>
                      <td className="py-3 px-3 font-mono text-slate-200">${cust.MonthlyCharges.toFixed(2)}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wide ${
                          cust.AccountHealth === 'Good' 
                            ? 'bg-emerald-500/10 text-emerald-400' 
                            : cust.AccountHealth === 'Fair' 
                            ? 'bg-amber-500/10 text-amber-400' 
                            : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {cust.AccountHealth}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-1.5 py-0.5 rounded font-mono ${cust.Churn === 'Yes' ? 'bg-rose-500/10 text-rose-400' : 'bg-white/5 text-white/40'}`}>
                          {cust.Churn === 'Yes' ? 'CHURN' : 'STABLE'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button 
                          onClick={() => setSelectedCustomerID(cust.customerID)}
                          className="text-[11px] text-cyan-400 hover:text-white cursor-pointer font-medium"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="flex justify-between items-center border-t border-white/5 mt-4 pt-4 text-xs text-slate-400 font-mono">
            <span>Showing {Math.min(filteredCustomers.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredCustomers.length, currentPage * itemsPerPage)} of {filteredCustomers.length} records</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Customer Profile Drawer / Detail View (1 col) */}
      <div className="space-y-6">
        {selectedCustomer ? (
          <div className="glass p-6 relative overflow-hidden group">
            {/* Ambient Background Gradient */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-cyan-500/10 to-purple-500/5 rounded-full blur-3xl" />
            
            {/* Header Actions */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-[#00C8FF]">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white font-mono">{selectedCustomer.customerID}</h4>
                  <span className="text-[10px] text-white/40 uppercase tracking-wider font-mono">Account File</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCustomerID(null)}
                className="text-slate-500 hover:text-white p-1 rounded-lg bg-white/5 border border-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Metrics Sections */}
            <div className="space-y-6">
              {/* Health Score & Churn Status Indicator Banner */}
              <div className="flex gap-2 p-3 bg-white/5 border border-white/5 rounded-xl items-center">
                <AlertOctagon className={`w-5 h-5 ${selectedCustomer.Churn === 'Yes' ? 'text-rose-400' : 'text-emerald-400'}`} />
                <div className="flex-1">
                  <span className="text-[9px] uppercase font-mono text-slate-500 tracking-wide block">Current Churn Risk Level</span>
                  <span className="text-xs font-semibold text-white block mt-0.5">
                    {selectedCustomer.Churn === 'Yes' ? 'Lost Customer (Churned)' : selectedCustomer.AccountHealth === 'Poor' ? 'CRITICAL RISK (Poor Health)' : 'Healthy Contract'}
                  </span>
                </div>
              </div>

              {/* Personal Demographics */}
              <div className="space-y-2.5">
                <h5 className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Demographic Metrics</h5>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 font-sans">
                  <div className="bg-white/5 p-2 rounded-lg border border-white/[0.03]">
                    <span className="text-slate-500 block text-[9px] uppercase font-mono">Gender</span>
                    <span className="font-semibold block mt-0.5 text-white">{selectedCustomer.gender}</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg border border-white/[0.03]">
                    <span className="text-slate-500 block text-[9px] uppercase font-mono">Senior Citizen</span>
                    <span className="font-semibold block mt-0.5 text-white">{selectedCustomer.SeniorCitizen === 1 ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg border border-white/[0.03]">
                    <span className="text-slate-500 block text-[9px] uppercase font-mono">Has Partner</span>
                    <span className="font-semibold block mt-0.5 text-white">{selectedCustomer.Partner}</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg border border-white/[0.03]">
                    <span className="text-slate-500 block text-[9px] uppercase font-mono">Has Dependents</span>
                    <span className="font-semibold block mt-0.5 text-white">{selectedCustomer.Dependents}</span>
                  </div>
                </div>
              </div>

              {/* Account Configuration */}
              <div className="space-y-2.5">
                <h5 className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">SaaS Subscription Details</h5>
                <div className="space-y-2 bg-[#090C1D] border border-white/5 p-3.5 rounded-xl text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5"><Compass className="w-3.5 h-3.5 text-purple-400" /> Plan Tier:</span>
                    <span className="font-semibold text-white">{selectedCustomer.SubscriptionPlan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-purple-400" /> Contract Term:</span>
                    <span className="font-semibold text-white">{selectedCustomer.Contract}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-purple-400" /> Paperless Billing:</span>
                    <span className="font-semibold text-white">{selectedCustomer.PaperlessBilling}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 text-purple-400" /> Payment:</span>
                    <span className="font-semibold text-white text-right truncate max-w-[150px]">{selectedCustomer.PaymentMethod.replace(' (automatic)', '')}</span>
                  </div>
                </div>
              </div>

              {/* Financial & Engagement Metrics */}
              <div className="space-y-2.5">
                <h5 className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Financial & Engagement telemetry</h5>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 font-sans">
                  <div className="bg-white/5 p-2.5 rounded-lg border border-white/[0.03]">
                    <span className="text-slate-500 block text-[9px] uppercase font-mono">Monthly Charge</span>
                    <span className="font-semibold block mt-0.5 text-white font-mono text-sm">${selectedCustomer.MonthlyCharges.toFixed(2)}</span>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-lg border border-white/[0.03]">
                    <span className="text-slate-500 block text-[9px] uppercase font-mono">LTV Total Charges</span>
                    <span className="font-semibold block mt-0.5 text-white font-mono text-sm">${selectedCustomer.TotalCharges.toFixed(2)}</span>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-lg border border-white/[0.03]">
                    <span className="text-slate-500 block text-[9px] uppercase font-mono">Tenure Months</span>
                    <span className="font-semibold block mt-0.5 text-white font-mono text-sm">{selectedCustomer.tenure} mos</span>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-lg border border-white/[0.03]">
                    <span className="text-slate-500 block text-[9px] uppercase font-mono">Support Tickets</span>
                    <span className="font-semibold block mt-0.5 text-rose-400 font-mono text-sm">{selectedCustomer.SupportTickets} cases</span>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-lg border border-white/[0.03]">
                    <span className="text-slate-500 block text-[9px] uppercase font-mono">Usage Hours</span>
                    <span className="font-semibold block mt-0.5 text-white font-mono text-sm">{selectedCustomer.MonthlyUsageHours} hrs/mo</span>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-lg border border-white/[0.03]">
                    <span className="text-slate-500 block text-[9px] uppercase font-mono">Last Active</span>
                    <span className="font-semibold block mt-0.5 text-white font-mono text-sm">{selectedCustomer.LastLoginDays} days ago</span>
                  </div>
                </div>
              </div>

              {/* NPS Score Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 uppercase font-mono text-[9px] tracking-wide flex items-center gap-1"><Smile className="w-3.5 h-3.5 text-cyan-400" /> Customer Satisfaction Index (NPS)</span>
                  <span className="font-bold text-white font-mono text-xs">{selectedCustomer.NPSScore}/10</span>
                </div>
                <div className="w-full h-1.5 bg-[#080C1D] rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${selectedCustomer.NPSScore > 6 ? 'bg-emerald-500' : selectedCustomer.NPSScore > 4 ? 'bg-amber-400' : 'bg-rose-500'}`}
                    style={{ width: `${selectedCustomer.NPSScore * 10}%` }}
                  />
                </div>
              </div>

              {/* Prescribed Retentional Protocol */}
              <div className="p-3 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-xl">
                <span className="text-[9px] uppercase font-mono text-slate-400 tracking-wide block">Prescribed Retention Strategy</span>
                <p className="text-[11px] text-slate-300 leading-relaxed mt-1 font-sans">
                  {selectedCustomer.Churn === 'Yes' 
                    ? 'Account has already churned. Deploy a "Winback Campaign" via billing credit triggers of up to 25% for a 12-month re-engagement commitment.' 
                    : selectedCustomer.AccountHealth === 'Poor'
                    ? 'CRITICAL RISK PROFILE. Reach out via a Customer Success Manager with an active support ticket resolution and suggest migrating from Month-to-month to a discounted One-year Contract.'
                    : 'Customer is healthy and stable. Target for up-selling of Streaming and Online Security value-add options to expand ARPU by 15%.'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white/[0.01] border border-dashed border-white/10 rounded-2xl min-h-[400px]">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-600 mb-4 animate-pulse">
              <User className="w-6 h-6 text-white/30" />
            </div>
            <h4 className="text-sm font-semibold text-slate-400">No Account Selected</h4>
            <p className="text-slate-500 text-xs mt-1 max-w-[200px]">
              Select a client record from the master database directory to inspect telemetry files.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
