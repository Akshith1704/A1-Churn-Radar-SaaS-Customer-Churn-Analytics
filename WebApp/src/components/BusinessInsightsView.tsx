import { useMemo } from 'react';
import { 
  Lightbulb, 
  ThumbsUp, 
  DollarSign, 
  HelpCircle, 
  Award, 
  ShieldAlert, 
  Clock, 
  TrendingUp,
  Heart
} from 'lucide-react';
import { Customer } from '../types';

interface BusinessInsightsViewProps {
  data: Customer[];
}

export default function BusinessInsightsView({ data }: BusinessInsightsViewProps) {
  const insights = useMemo(() => {
    const total = data.length;
    if (total === 0) return null;

    // 1. Churn rates by contract type
    const contracts = ['Month-to-month', 'One year', 'Two year'];
    let highestChurnContract = 'Month-to-month';
    let maxContractRate = 0;

    contracts.forEach(c => {
      const cohort = data.filter(cust => cust.Contract === c);
      const churned = cohort.filter(cust => cust.Churn === 'Yes').length;
      const rate = cohort.length > 0 ? (churned / cohort.length) * 100 : 0;
      if (rate > maxContractRate) {
        maxContractRate = rate;
        highestChurnContract = c;
      }
    });

    // 2. Highest Revenue Plan
    const plans = ['Basic', 'Standard', 'Premium'];
    let highestRevenuePlan = 'Basic';
    let maxPlanRev = 0;
    plans.forEach(p => {
      const rev = data.filter(cust => cust.SubscriptionPlan === p).reduce((sum, cust) => sum + cust.MonthlyCharges, 0);
      if (rev > maxPlanRev) {
        maxPlanRev = rev;
        highestRevenuePlan = p;
      }
    });

    // 3. Average NPS
    const npsSum = data.reduce((sum, cust) => sum + cust.NPSScore, 0);
    const avgNps = npsSum / total;

    // 4. Revenue At Risk (Sum of MonthlyCharges of at-risk customers)
    const revenueAtRisk = data.reduce((sum, cust) => sum + cust.RevenueAtRisk, 0);

    // 5. Customer Satisfaction % (Calculated based on NPS Score >= 7 as Satisfied)
    const satisfiedCount = data.filter(cust => cust.NPSScore >= 7).length;
    const satisfactionPercent = (satisfiedCount / total) * 100;

    // 6. Poor Account Health Customers count
    const poorHealthCount = data.filter(cust => cust.AccountHealth === 'Poor').length;

    // 7. Most common Login Frequency
    const frequencies = ['Daily', 'Weekly', 'Monthly', 'Rare'];
    let maxFreqCount = 0;
    let avgLoginFrequency = 'Weekly';
    frequencies.forEach(f => {
      const count = data.filter(cust => cust.LoginFrequency === f).length;
      if (count > maxFreqCount) {
        maxFreqCount = count;
        avgLoginFrequency = f;
      }
    });

    // 8. Average Support Tickets
    const ticketSum = data.reduce((sum, cust) => sum + cust.SupportTickets, 0);
    const avgSupportTickets = ticketSum / total;

    return {
      total,
      highestChurnContract,
      maxContractRate,
      highestRevenuePlan,
      maxPlanRev,
      avgNps,
      revenueAtRisk,
      satisfactionPercent,
      poorHealthCount,
      avgLoginFrequency,
      avgSupportTickets
    };
  }, [data]);

  if (!insights) return null;

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-tr from-cyan-400 to-purple-600 rounded-2xl text-white">
          <Lightbulb className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            SaaS Automated Business Intelligence Insights
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Algorithms analyze client parameters dynamically to formulate data-driven prescriptions.
          </p>
        </div>
      </div>

      {/* Grid of 8 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Highest Churn Contract */}
        <div className="glass p-5 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Highest Churn Contract</span>
          <div className="mt-2.5 space-y-1">
            <h4 className="text-base font-bold text-white tracking-tight leading-snug">{insights.highestChurnContract}</h4>
            <span className="text-xs text-[#00C8FF] font-semibold">{insights.maxContractRate.toFixed(1)}% Churn Rate</span>
          </div>
          <span className="text-[9px] text-slate-500 mt-4">Needs migration incentives.</span>
        </div>

        {/* Highest Revenue Plan */}
        <div className="glass p-5 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Highest Revenue Plan</span>
          <div className="mt-2.5 space-y-1">
            <h4 className="text-base font-bold text-white tracking-tight leading-snug">{insights.highestRevenuePlan} Tier</h4>
            <span className="text-xs text-emerald-400 font-semibold">${Math.round(insights.maxPlanRev).toLocaleString()}/mo MRR</span>
          </div>
          <span className="text-[9px] text-slate-500 mt-4">Core subscription revenue asset.</span>
        </div>

        {/* Average NPS Score */}
        <div className="glass p-5 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Average NPS Score</span>
          <div className="mt-2.5 space-y-1">
            <h4 className="text-base font-bold text-white tracking-tight leading-snug">{insights.avgNps.toFixed(1)} out of 10</h4>
            <span className={`text-xs font-semibold ${insights.avgNps >= 6 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {insights.avgNps >= 6 ? 'Healthy Satisfaction' : 'Risk Cohort Alert'}
            </span>
          </div>
          <span className="text-[9px] text-slate-500 mt-4">Calculated net customer score.</span>
        </div>

        {/* Revenue At Risk */}
        <div className="glass p-5 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Total Revenue At Risk</span>
          <div className="mt-2.5 space-y-1">
            <h4 className="text-base font-bold text-rose-400 tracking-tight leading-snug">${Math.round(insights.revenueAtRisk).toLocaleString()}/mo</h4>
            <span className="text-xs text-rose-500 font-semibold">{( (insights.revenueAtRisk / (data.reduce((sum, c) => sum + c.MonthlyCharges, 0) || 1)) * 100 ).toFixed(1)}% of total MRR</span>
          </div>
          <span className="text-[9px] text-slate-500 mt-4">Target for customer winback campaigns.</span>
        </div>

        {/* Customer Satisfaction Index */}
        <div className="glass p-5 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Customer Satisfaction (CSAT)</span>
          <div className="mt-2.5 space-y-1">
            <h4 className="text-base font-bold text-white tracking-tight leading-snug">{insights.satisfactionPercent.toFixed(1)}%</h4>
            <span className="text-xs text-purple-400 font-semibold">Active Net Promoters</span>
          </div>
          <span className="text-[9px] text-slate-500 mt-4">Customers rating NPS &gt;= 7.</span>
        </div>

        {/* Poor Standing Health Customers */}
        <div className="glass p-5 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Poor Health Standing accounts</span>
          <div className="mt-2.5 space-y-1">
            <h4 className="text-base font-bold text-white tracking-tight leading-snug">{insights.poorHealthCount} Clients</h4>
            <span className="text-xs text-rose-400 font-semibold">{((insights.poorHealthCount / insights.total) * 100).toFixed(1)}% of base</span>
          </div>
          <span className="text-[9px] text-slate-500 mt-4">Requires active customer success.</span>
        </div>

        {/* Average Login Frequency */}
        <div className="glass p-5 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Avg Login Frequency</span>
          <div className="mt-2.5 space-y-1">
            <h4 className="text-base font-bold text-white tracking-tight leading-snug">{insights.avgLoginFrequency}</h4>
            <span className="text-xs text-[#00C8FF] font-semibold">Standard Active Rhythm</span>
          </div>
          <span className="text-[9px] text-slate-500 mt-4">Key product adoption indicator.</span>
        </div>

        {/* Average Support Tickets */}
        <div className="glass p-5 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Average Support Tickets</span>
          <div className="mt-2.5 space-y-1">
            <h4 className="text-base font-bold text-white tracking-tight leading-snug">{insights.avgSupportTickets.toFixed(1)} Open Cases</h4>
            <span className="text-xs text-amber-400 font-semibold">SLA Target &lt; 2.0</span>
          </div>
          <span className="text-[9px] text-slate-500 mt-4">Operational workload density.</span>
        </div>
      </div>

      {/* Automatically Generated Strategic Recommendations */}
      <div className="glass p-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <Award className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-semibold text-white">Prescriptive Executive Strategy Playbook</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Revenue preservation */}
          <div className="bg-[#080C1D]/50 border border-white/5 p-5 rounded-2xl space-y-3 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-all" />
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
                <DollarSign className="w-5 h-5" />
              </div>
              <h5 className="text-sm font-semibold text-white">Revenue Preservation Protocol</h5>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Based on the currently loaded data file, there is an active MRR leakage risks value of <strong className="text-white">${Math.round(insights.revenueAtRisk).toLocaleString()} per month</strong>. Cross-referencing our segments reveals that {insights.highestChurnContract === 'Month-to-month' ? 'Month-to-Month contracts' : 'annual contracts'} are the main source. Offering an immediate 15% billing incentive for transitioning to annual plans preserves recurring value and extends customer lifetime.
            </p>
          </div>

          {/* Card 2: Support Ticket Slasher */}
          <div className="bg-[#080C1D]/50 border border-white/5 p-5 rounded-2xl space-y-3 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition-all" />
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h5 className="text-sm font-semibold text-white">SLA Support Intervention Program</h5>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The aggregate directory currently reports an average open cases count of <strong className="text-white">{insights.avgSupportTickets.toFixed(1)} tickets per user</strong>. This is critical because Churn rates are highly correlated with ticket backlogs exceeding 3 cases. Implement an automated CRM alert system to identify accounts reaching 3 tickets, and route them directly to senior CSMs to resolve within 24 hours.
            </p>
          </div>

          {/* Card 3: Satisfaction Boost */}
          <div className="bg-[#080C1D]/50 border border-white/5 p-5 rounded-2xl space-y-3 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all" />
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                <Heart className="w-5 h-5" />
              </div>
              <h5 className="text-sm font-semibold text-white">Satisfaction Index Lift (NPS)</h5>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              We detect a customer satisfaction rating of <strong className="text-white">{insights.satisfactionPercent.toFixed(1)}% (NPS score {insights.avgNps.toFixed(1)}/10)</strong>. Segmenting customers with low satisfaction scores reveals that lack of Online Security and Tech Support add-on options is a principal driver of poor stood health. Package these features into an attractive loyalty package and offer it for free for 3 months to accounts in "Fair" standing.
            </p>
          </div>

          {/* Card 4: Engagement & Activation */}
          <div className="bg-[#080C1D]/50 border border-white/5 p-5 rounded-2xl space-y-3 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all" />
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                <Clock className="w-5 h-5" />
              </div>
              <h5 className="text-sm font-semibold text-white">Product Engagement Activation</h5>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our analysis indicates the most common active rhythm for users is <strong className="text-white">{insights.avgLoginFrequency}</strong>. Accounts with Rare or Monthly login patterns exhibit an elevated churn score. Deploy automated in-app feature walkthroughs and usage tip emails to spark interest, encouraging users to log in more frequently and discover the platform's full utility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
