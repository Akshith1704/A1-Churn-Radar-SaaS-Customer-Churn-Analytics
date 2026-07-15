import { useState, useMemo } from 'react';
import { 
  Users, 
  UserMinus, 
  UserCheck, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  Heart, 
  Activity,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area 
} from 'recharts';
import { Customer } from '../types';

interface DashboardViewProps {
  data: Customer[];
  onSelectCustomer: (customerID: string) => void;
}

export default function DashboardView({ data, onSelectCustomer }: DashboardViewProps) {
  // Aggregate KPIs
  const kpis = useMemo(() => {
    const total = data.length;
    if (total === 0) return { total: 0, churned: 0, retained: 0, churnRate: 0, totalMRR: 0, revenueAtRisk: 0, avgNps: 0, avgMonthlyCharges: 0 };
    
    const churned = data.filter(c => c.Churn === 'Yes').length;
    const retained = total - churned;
    const churnRate = (churned / total) * 100;
    
    const totalMRR = data.reduce((sum, c) => sum + c.MonthlyCharges, 0);
    const revenueAtRisk = data.reduce((sum, c) => sum + c.RevenueAtRisk, 0);
    
    const npsSum = data.reduce((sum, c) => sum + c.NPSScore, 0);
    const avgNps = npsSum / total;
    
    const monthlySum = data.reduce((sum, c) => sum + c.MonthlyCharges, 0);
    const avgMonthlyCharges = monthlySum / total;

    return {
      total,
      churned,
      retained,
      churnRate,
      totalMRR,
      revenueAtRisk,
      avgNps,
      avgMonthlyCharges
    };
  }, [data]);

  // Aggregated Charts Data
  const chartsData = useMemo(() => {
    if (data.length === 0) return null;

    // 1. Customer Churn Distribution
    const churnDistribution = [
      { name: 'Retained', value: kpis.retained, color: '#7C3AED' }, // Purple
      { name: 'Churned', value: kpis.churned, color: '#00C8FF' }    // Cyan
    ];

    // 2. Contract Type vs Churn
    const contractTypes = ['Month-to-month', 'One year', 'Two year'];
    const contractVsChurn = contractTypes.map(type => {
      const filtered = data.filter(c => c.Contract === type);
      const churned = filtered.filter(c => c.Churn === 'Yes').length;
      const retained = filtered.length - churned;
      return {
        name: type,
        Retained: retained,
        Churned: churned
      };
    });

    // 3. Monthly Charges vs Churn (Bins)
    const bins = [
      { name: '$0-30', min: 0, max: 30 },
      { name: '$30-60', min: 30, max: 60 },
      { name: '$60-90', min: 60, max: 90 },
      { name: '$90+', min: 90, max: 1000 }
    ];
    const monthlyChargesVsChurn = bins.map(bin => {
      const filtered = data.filter(c => c.MonthlyCharges >= bin.min && c.MonthlyCharges < bin.max);
      const churned = filtered.filter(c => c.Churn === 'Yes').length;
      const retained = filtered.length - churned;
      return {
        name: bin.name,
        Retained: retained,
        Churned: churned
      };
    });

    // 4. Account Health vs Churn
    const healthLevels = ['Good', 'Fair', 'Poor'];
    const healthVsChurn = healthLevels.map(health => {
      const filtered = data.filter(c => c.AccountHealth === health);
      const churned = filtered.filter(c => c.Churn === 'Yes').length;
      const retained = filtered.length - churned;
      return {
        name: health,
        Retained: retained,
        Churned: churned
      };
    });

    // 5. Subscription Plan Distribution
    const plans = ['Basic', 'Standard', 'Premium'];
    const planDistribution = plans.map(plan => {
      const count = data.filter(c => c.SubscriptionPlan === plan).length;
      return {
        name: plan,
        value: count
      };
    });

    // 6. Login Frequency vs Churn
    const frequencies = ['Daily', 'Weekly', 'Monthly', 'Rare'];
    const loginVsChurn = frequencies.map(freq => {
      const filtered = data.filter(c => c.LoginFrequency === freq);
      const churned = filtered.filter(c => c.Churn === 'Yes').length;
      const retained = filtered.length - churned;
      return {
        name: freq,
        Retained: retained,
        Churned: churned
      };
    });

    // 7. Support Tickets vs Churn (Churn rate by tickets counts)
    const ticketCounts = Array.from({ length: 9 }, (_, i) => i); // 0 to 8
    const supportTicketsVsChurn = ticketCounts.map(tickets => {
      const filtered = data.filter(c => c.SupportTickets === tickets);
      const total = filtered.length;
      const churned = filtered.filter(c => c.Churn === 'Yes').length;
      const churnRate = total > 0 ? (churned / total) * 100 : 0;
      return {
        name: `${tickets} Tkt`,
        'Churn Rate %': parseFloat(churnRate.toFixed(1)),
        Volume: total
      };
    });

    // 8. Internet Service vs Churn
    const services = ['DSL', 'Fiber optic', 'No'];
    const internetVsChurn = services.map(service => {
      const filtered = data.filter(c => c.InternetService === service);
      const churned = filtered.filter(c => c.Churn === 'Yes').length;
      const retained = filtered.length - churned;
      return {
        name: service === 'No' ? 'None' : service,
        Retained: retained,
        Churned: churned
      };
    });

    return {
      churnDistribution,
      contractVsChurn,
      monthlyChargesVsChurn,
      healthVsChurn,
      planDistribution,
      loginVsChurn,
      supportTicketsVsChurn,
      internetVsChurn
    };
  }, [data, kpis]);

  // Top 10 High Risk Customers Table (Poor Health, High Support Tickets, Yes or No but low NPS)
  const topHighRiskCustomers = useMemo(() => {
    return [...data]
      .filter(c => c.Churn === 'Yes' || (c.AccountHealth === 'Poor' && c.NPSScore < 5))
      .sort((a, b) => {
        // Sort by Churn priority first, then support tickets, then lowest NPS score
        if (a.Churn !== b.Churn) return a.Churn === 'Yes' ? -1 : 1;
        if (b.SupportTickets !== a.SupportTickets) return b.SupportTickets - a.SupportTickets;
        return a.NPSScore - b.NPSScore;
      })
      .slice(0, 10);
  }, [data]);

  // Recent Customer Activity Log (Mocked but deterministic based on customer data)
  const recentActivity = useMemo(() => {
    return [...data]
      .slice(15, 23)
      .map((c, i) => {
        const activities = [
          { text: 'Created a support ticket regarding high bill latency.', time: `${i + 1} hours ago`, type: 'Support' },
          { text: 'Completed predicted high risk review.', time: `${i + 3} hours ago`, type: 'Prediction' },
          { text: 'Logged in from alternative subnet.', time: `${i + 4} hours ago`, type: 'Security' },
          { text: 'Downgraded online backup service tier.', time: 'Yesterday', type: 'Billing' },
          { text: 'Upgraded subscription service plan to Premium.', time: 'Yesterday', type: 'Upgrade' }
        ];
        const act = activities[i % activities.length];
        return {
          customerID: c.customerID,
          name: `${c.gender === 'Female' ? 'Ms.' : 'Mr.'} ${c.customerID.split('-')[0]}`,
          text: act.text,
          time: act.time,
          type: act.type,
          churn: c.Churn
        };
      });
  }, [data]);

  if (!chartsData) return null;

  return (
    <div className="space-y-6">
      {/* Upper Title Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
            Executive Analytics Dashboard
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Real-time churn risk surveillance and financial safety statistics.
          </p>
        </div>
        <div className="flex items-center gap-2 glass px-4 py-2 rounded-xl text-xs font-mono text-slate-300">
          <Activity className="w-3.5 h-3.5 text-[#00C8FF] animate-pulse" />
          <span>Active Dataset Count: <strong>{kpis.total}</strong> Accounts</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Customers */}
        <div className="glass rounded-2xl p-5 hover:bg-white/[0.05] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all" />
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <span className="text-xs text-white/50 font-medium">Total Accounts</span>
              <h3 className="text-2xl font-bold text-white tracking-tight">{kpis.total.toLocaleString()}</h3>
            </div>
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-[11px] text-white/50">
            <span className="text-purple-400 font-semibold">{kpis.retained.toLocaleString()}</span>
            <span>Active & Retained Accounts</span>
          </div>
        </div>

        {/* Churn Rate % */}
        <div className="glass rounded-2xl p-5 hover:bg-white/[0.05] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00C8FF]/5 rounded-full blur-2xl group-hover:bg-[#00C8FF]/10 transition-all" />
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <span className="text-xs text-white/50 font-medium">Churn Rate</span>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {kpis.churnRate.toFixed(1)}%
              </h3>
            </div>
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
              <TrendingUp className="w-5 h-5 text-[#00C8FF]" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-[11px] text-white/50">
            <span className="text-[#00C8FF] font-semibold">{kpis.churned.toLocaleString()}</span>
            <span>Accounts Lost to Churn</span>
          </div>
        </div>

        {/* Monthly Recurring Revenue */}
        <div className="glass rounded-2xl p-5 hover:bg-white/[0.05] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <span className="text-xs text-white/50 font-medium">Monthly MRR</span>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                ${Math.round(kpis.totalMRR).toLocaleString()}
              </h3>
            </div>
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-[11px] text-white/50">
            <span className="text-emerald-400 font-semibold">${kpis.avgMonthlyCharges.toFixed(1)}</span>
            <span>Average Monthly Ticket ARPU</span>
          </div>
        </div>

        {/* Revenue At Risk */}
        <div className="glass rounded-2xl p-5 hover:bg-white/[0.05] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-all" />
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <span className="text-xs text-white/50 font-medium">MRR At Risk</span>
              <h3 className="text-2xl font-bold text-rose-400 tracking-tight">
                ${Math.round(kpis.revenueAtRisk).toLocaleString()}
              </h3>
            </div>
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-[11px] text-white/50">
            <span className="text-rose-400 font-semibold">NPS: {kpis.avgNps.toFixed(1)}/10</span>
            <span>Average Customer Net Satisfaction</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Customer Churn Distribution */}
        <div className="glass rounded-2xl p-5">
          <h4 className="text-sm font-semibold text-white mb-4">Customer Churn Distribution</h4>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartsData.churnDistribution}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartsData.churnDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1026', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-xs text-slate-300 font-sans">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Contract Type vs Churn */}
        <div className="glass rounded-2xl p-5">
          <h4 className="text-sm font-semibold text-white mb-4">Contract Type vs Churn</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartsData.contractVsChurn} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0B1026', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px' }} />
                <Legend iconType="circle" formatter={(value) => <span className="text-xs text-slate-300">{value}</span>} />
                <Bar dataKey="Retained" stackId="a" fill="#7C3AED" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Churned" stackId="a" fill="#00C8FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Monthly Charges vs Churn */}
        <div className="glass rounded-2xl p-5">
          <h4 className="text-sm font-semibold text-white mb-4">Monthly Charges vs Churn Rate</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartsData.monthlyChargesVsChurn} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorChurn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C8FF" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00C8FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0B1026', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px' }} />
                <Legend iconType="circle" formatter={(value) => <span className="text-xs text-slate-300">{value}</span>} />
                <Area type="monotone" dataKey="Churned" name="Churned Accounts" stroke="#00C8FF" fillOpacity={1} fill="url(#colorChurn)" strokeWidth={2} />
                <Area type="monotone" dataKey="Retained" name="Retained Accounts" stroke="#7C3AED" fillOpacity={0} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Account Health vs Churn */}
        <div className="glass rounded-2xl p-5">
          <h4 className="text-sm font-semibold text-white mb-4">Account Health vs Churn Volume</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartsData.healthVsChurn} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0B1026', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px' }} />
                <Legend iconType="circle" formatter={(value) => <span className="text-xs text-slate-300">{value}</span>} />
                <Bar dataKey="Retained" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Churned" fill="#00C8FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Subscription Plan Distribution */}
        <div className="glass rounded-2xl p-5">
          <h4 className="text-sm font-semibold text-white mb-4">Subscription Plan Distribution</h4>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartsData.planDistribution}
                  cx="50%"
                  cy="45%"
                  innerRadius={0}
                  outerRadius={85}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  <Cell fill="#6366f1" />
                  <Cell fill="#a855f7" />
                  <Cell fill="#06b6d4" />
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0B1026', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6. Login Frequency vs Churn */}
        <div className="glass rounded-2xl p-5">
          <h4 className="text-sm font-semibold text-white mb-4">Login Frequency vs Churn Breakdowns</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartsData.loginVsChurn} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0B1026', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px' }} />
                <Legend iconType="circle" formatter={(value) => <span className="text-xs text-slate-300">{value}</span>} />
                <Bar dataKey="Retained" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Churned" fill="#00C8FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7. Support Tickets vs Churn */}
        <div className="glass rounded-2xl p-5">
          <h4 className="text-sm font-semibold text-white mb-4">Support Tickets Escalation vs Churn Rate %</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartsData.supportTicketsVsChurn} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0B1026', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px' }} />
                <Legend iconType="circle" formatter={(value) => <span className="text-xs text-slate-300">{value}</span>} />
                <Line type="monotone" dataKey="Churn Rate %" stroke="#ef4444" strokeWidth={3} activeDot={{ r: 8 }} dot={{ stroke: '#ef4444', strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 8. Internet Service vs Churn */}
        <div className="glass rounded-2xl p-5">
          <h4 className="text-sm font-semibold text-white mb-4">Internet Service Type vs Churn</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartsData.internetVsChurn} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0B1026', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px' }} />
                <Legend iconType="circle" formatter={(value) => <span className="text-xs text-slate-300">{value}</span>} />
                <Bar dataKey="Retained" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Churned" fill="#00C8FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Dynamic Business Summaries & Recent Activity Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Top 10 High Risk Customers Table (spanning 2 columns) */}
        <div className="xl:col-span-2 glass p-5">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold text-white">Top 10 High Risk Customers</h4>
            <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full font-mono">Immediate Action Needed</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-white/30 text-xs font-mono uppercase tracking-wider">
                  <th className="py-2.5 px-3">CustomerID</th>
                  <th className="py-2.5 px-3">Contract</th>
                  <th className="py-2.5 px-3">Monthly MRR</th>
                  <th className="py-2.5 px-3">NPS</th>
                  <th className="py-2.5 px-3 text-center">Tickets</th>
                  <th className="py-2.5 px-3">Health</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-slate-300 font-sans">
                {topHighRiskCustomers.map((cust) => (
                  <tr key={cust.customerID} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-white">{cust.customerID}</td>
                    <td className="py-3 px-3 text-xs">{cust.Contract}</td>
                    <td className="py-3 px-3 font-mono">${cust.MonthlyCharges.toFixed(2)}</td>
                    <td className="py-3 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${cust.NPSScore > 6 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {cust.NPSScore}/10
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-xs">{cust.SupportTickets}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide ${
                        cust.AccountHealth === 'Good' 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : cust.AccountHealth === 'Fair' 
                          ? 'bg-amber-500/10 text-amber-400' 
                          : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {cust.AccountHealth}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button 
                        onClick={() => onSelectCustomer(cust.customerID)}
                        className="text-xs text-[#00C8FF] hover:text-white flex items-center gap-1 ml-auto cursor-pointer font-medium"
                      >
                        <span>Profile</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Customer Activity */}
        <div className="glass p-5">
          <h4 className="text-sm font-semibold text-white mb-4">Recent Customer Activity</h4>
          <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex gap-3 text-xs border-b border-white/5 pb-3 last:border-0 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className={`w-2.5 h-2.5 rounded-full ${activity.churn === 'Yes' ? 'bg-[#00C8FF]' : 'bg-purple-500'} mt-1`} />
                  <div className="w-0.5 h-full bg-white/5 mt-1" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-semibold text-white">{activity.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{activity.time}</span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{activity.text}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-white/50 font-mono uppercase">{activity.type}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase ${activity.churn === 'Yes' ? 'bg-[#00C8FF]/10 text-[#00C8FF]' : 'bg-purple-500/10 text-purple-400'}`}>
                      {activity.customerID}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Business Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Revenue Impact Assessment Card */}
        <div className="glass p-5 flex gap-4 items-start relative overflow-hidden">
          <div className="p-3 bg-[#00C8FF]/10 rounded-2xl border border-[#00C8FF]/20 text-[#00C8FF]">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="space-y-1 flex-1 z-10">
            <h5 className="text-sm font-semibold text-white">Revenue Preservation Plan</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Month-to-month contracts constitute the overwhelming majority of at-risk revenue (${Math.round(kpis.revenueAtRisk * 0.75).toLocaleString()}/month). Implement automated campaign discounts targeting this cohort to migrate them onto annual agreements.
            </p>
          </div>
        </div>

        {/* Quality of Service Health Card */}
        <div className="glass p-5 flex gap-4 items-start relative overflow-hidden">
          <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20 text-rose-400">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div className="space-y-1 flex-1 z-10">
            <h5 className="text-sm font-semibold text-white">Critical Support Intervention</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our line charts reveal a clear churn pivot when support ticket backlogs exceed 3 tickets per user. Churn probability balloons to {((data.filter(c => c.SupportTickets >= 4 && c.Churn === 'Yes').length / (data.filter(c => c.SupportTickets >= 4).length || 1)) * 100).toFixed(0)}%. Establish VIP support queues for multi-ticket holders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
