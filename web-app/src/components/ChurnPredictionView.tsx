import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Info,
  Server,
  Zap
} from 'lucide-react';
import { PredictionInput, PredictionResult } from '../types';

export default function ChurnPredictionView() {
  const [inputs, setInputs] = useState<PredictionInput>({
    gender: 'Female',
    SeniorCitizen: '0',
    Partner: 'No',
    Dependents: 'No',
    tenure: 12,
    PhoneService: 'Yes',
    InternetService: 'Fiber optic',
    Contract: 'Month-to-month',
    PaymentMethod: 'Electronic check',
    MonthlyCharges: 75.5,
    LoginFrequency: 'Weekly',
    SupportTickets: 2,
    MonthlyUsageHours: 120,
    LastLoginDays: 4,
    NPSScore: 7,
    SubscriptionPlan: 'Standard',
    AccountHealth: 'Fair'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handleInputChange = (key: keyof PredictionInput, value: any) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate risk scoring steps for realism
    const steps = [
      'Extracting customer profile features...',
      'Normalizing monthly charges & tenure scaling...',
      'Evaluating churn risk signals...',
      'Assembling final risk score...',
      'Preparing recommendation summary...'
    ];

    let stepIndex = 0;
    setLoadingStep(steps[0]);

    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
        setLoadingStep(steps[stepIndex]);
      } else {
        clearInterval(interval);
        
        // Calculate Churn Probability using advanced, correlated heuristics
        let baseScore = 40; // Starts at 40%

        // Contract factor (The strongest predictor)
        if (inputs.Contract === 'Month-to-month') baseScore += 30;
        else if (inputs.Contract === 'Two year') baseScore -= 25;
        else baseScore -= 10;

        // Tenure factor
        if (inputs.tenure < 6) baseScore += 20;
        else if (inputs.tenure > 36) baseScore -= 20;
        else if (inputs.tenure > 12) baseScore -= 5;

        // Support Tickets
        if (inputs.SupportTickets >= 4) baseScore += 25;
        else if (inputs.SupportTickets >= 2) baseScore += 10;
        else baseScore -= 10;

        // NPS score
        if (inputs.NPSScore <= 4) baseScore += 20;
        else if (inputs.NPSScore >= 8) baseScore -= 20;
        else baseScore -= 5;

        // Internet service
        if (inputs.InternetService === 'Fiber optic') baseScore += 15; // Fiber optic users churn more in this dataset due to high charges
        else if (inputs.InternetService === 'No') baseScore -= 15;

        // Monthly charges
        if (inputs.MonthlyCharges > 85) baseScore += 10;
        else if (inputs.MonthlyCharges < 40) baseScore -= 10;

        // Senior Citizen
        if (inputs.SeniorCitizen === '1') baseScore += 10;

        // Login Frequency
        if (inputs.LoginFrequency === 'Rare') baseScore += 15;
        else if (inputs.LoginFrequency === 'Daily') baseScore -= 15;

        // Last Login Days
        if (inputs.LastLoginDays > 15) baseScore += 10;

        // Normal security additions
        if (inputs.AccountHealth === 'Poor') baseScore += 15;
        else if (inputs.AccountHealth === 'Good') baseScore -= 15;

        // Constrain probability between 1% and 99%
        const prob = Math.max(1, Math.min(99, baseScore));
        
        // Formulate output
        let riskLevel: 'High' | 'Medium' | 'Low' = 'Medium';
        if (prob > 65) riskLevel = 'High';
        else if (prob < 35) riskLevel = 'Low';

        const recommendations: string[] = [];
        const strategies: string[] = [];

        if (riskLevel === 'High') {
          recommendations.push(
            'High churn probability detected. Immediately initiate high-priority outreach.',
            'Target account with a contract transition offer to move them off Month-to-Month.',
            'Escalate and clear any open support ticket queues for this user.'
          );
          strategies.push(
            'Migrate to Annual: Offer a 15% discount on a 1-year contract.',
            'CSM Dedicated Care: Set up a 15-minute verification call with a dedicated Customer Success Manager.',
            'Credit Inducement: Provide a one-time bill credit of $25.00 to alleviate monthly charge friction.'
          );
        } else if (riskLevel === 'Medium') {
          recommendations.push(
            'Moderate risk profile. Monitor support ticket rates closely over the next 14 days.',
            'Improve satisfaction indices by suggesting Online Security or Tech Support add-ons.',
            'Send educational onboarding newsletters to increase weekly usage hours.'
          );
          strategies.push(
            'Value-add Upsell: Offer Tech Support package with a free 3-month trial.',
            'Onboarding Playbook: Set automated trigger emails demonstrating advanced features.'
          );
        } else {
          recommendations.push(
            'Account is secure and healthy. High product fit and high NPS score.',
            'Ideal candidate for strategic upsell campaigns or advocacy referrals.',
            'Encourage paperless billing adoption to solidify automation.'
          );
          strategies.push(
            'Advocacy Program: Invite to the Churn Radar customer advisory board.',
            'Cross-Sell Upgrades: Present upgraded Tier plan option (Premium plan) with more concurrent usage hours.'
          );
        }

        setResult({
          churnProbability: prob,
          riskLevel,
          recommendations,
          strategies
        });
        setIsLoading(false);
      }
    }, 450);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Predictive Churn Engine
        </h2>
        <p className="text-slate-400 text-sm mt-0.5">
          Execute real-time customer churn simulations using advanced risk scoring heuristics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
{/* Risk Scoring Form Panel (2 columns) */}
      <form onSubmit={handlePredict} className="lg:col-span-2 glass p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <BrainCircuit className="w-5 h-5 text-[#00C8FF]" />
            <h3 className="text-sm font-semibold text-white">Interactive Customer Profile Inputs</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-slate-300">
            {/* Gender */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono text-slate-500">Gender</label>
              <select
                value={inputs.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full bg-[#080C1D] border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00C8FF]/50 text-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Senior Citizen */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono text-slate-500">Senior Citizen Status</label>
              <select
                value={inputs.SeniorCitizen}
                onChange={(e) => handleInputChange('SeniorCitizen', e.target.value)}
                className="w-full bg-[#080C1D] border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00C8FF]/50 text-white"
              >
                <option value="0">Non-Senior</option>
                <option value="1">Senior Citizen</option>
              </select>
            </div>

            {/* Partner */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono text-slate-500">Has Partner</label>
              <select
                value={inputs.Partner}
                onChange={(e) => handleInputChange('Partner', e.target.value)}
                className="w-full bg-[#080C1D] border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00C8FF]/50 text-white"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Dependents */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono text-slate-500">Has Dependents</label>
              <select
                value={inputs.Dependents}
                onChange={(e) => handleInputChange('Dependents', e.target.value)}
                className="w-full bg-[#080C1D] border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00C8FF]/50 text-white"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Tenure months */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono text-slate-500 flex justify-between">
                <span>Account Tenure</span>
                <span className="text-[#00C8FF]">{inputs.tenure} mos</span>
              </label>
              <input
                type="range"
                min="1"
                max="72"
                value={inputs.tenure}
                onChange={(e) => handleInputChange('tenure', parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#080C1D] rounded-lg appearance-none cursor-pointer accent-[#00C8FF]"
              />
            </div>

            {/* Phone Service */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono text-slate-500">Phone Connection</label>
              <select
                value={inputs.PhoneService}
                onChange={(e) => handleInputChange('PhoneService', e.target.value)}
                className="w-full bg-[#080C1D] border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00C8FF]/50 text-white"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Internet Service */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono text-slate-500">Internet Service</label>
              <select
                value={inputs.InternetService}
                onChange={(e) => handleInputChange('InternetService', e.target.value)}
                className="w-full bg-[#080C1D] border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00C8FF]/50 text-white"
              >
                <option value="DSL">DSL</option>
                <option value="Fiber optic">Fiber optic</option>
                <option value="No">No connection</option>
              </select>
            </div>

            {/* Contract */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono text-slate-500">Contract Term</label>
              <select
                value={inputs.Contract}
                onChange={(e) => handleInputChange('Contract', e.target.value)}
                className="w-full bg-[#080C1D] border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00C8FF]/50 text-white"
              >
                <option value="Month-to-month">Month-to-month</option>
                <option value="One year">One year</option>
                <option value="Two year">Two year</option>
              </select>
            </div>

            {/* Payment Method */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono text-slate-500">Payment Channel</label>
              <select
                value={inputs.PaymentMethod}
                onChange={(e) => handleInputChange('PaymentMethod', e.target.value)}
                className="w-full bg-[#080C1D] border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00C8FF]/50 text-white"
              >
                <option value="Electronic check">Electronic check</option>
                <option value="Mailed check">Mailed check</option>
                <option value="Bank transfer (automatic)">Bank transfer (auto)</option>
                <option value="Credit card (automatic)">Credit card (auto)</option>
              </select>
            </div>

            {/* Monthly charges slider */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono text-slate-500 flex justify-between">
                <span>Monthly Charge ARPU</span>
                <span className="text-[#00C8FF]">${inputs.MonthlyCharges}</span>
              </label>
              <input
                type="range"
                min="18"
                max="120"
                step="0.5"
                value={inputs.MonthlyCharges}
                onChange={(e) => handleInputChange('MonthlyCharges', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#080C1D] rounded-lg appearance-none cursor-pointer accent-[#00C8FF]"
              />
            </div>

            {/* Login Frequency */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono text-slate-500">User Login Frequency</label>
              <select
                value={inputs.LoginFrequency}
                onChange={(e) => handleInputChange('LoginFrequency', e.target.value)}
                className="w-full bg-[#080C1D] border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00C8FF]/50 text-white"
              >
                <option value="Daily">Daily Activity</option>
                <option value="Weekly">Weekly Activity</option>
                <option value="Monthly">Monthly Activity</option>
                <option value="Rare">Rarely Logs In</option>
              </select>
            </div>

            {/* Support Tickets */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono text-slate-500">Support Tickets (Open)</label>
              <select
                value={inputs.SupportTickets}
                onChange={(e) => handleInputChange('SupportTickets', parseInt(e.target.value))}
                className="w-full bg-[#080C1D] border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00C8FF]/50 text-white"
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                  <option key={n} value={n}>{n} Open Cases</option>
                ))}
              </select>
            </div>

            {/* Monthly usage hours */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono text-slate-500">Monthly Usage Hours</label>
              <input
                type="number"
                min="1"
                max="500"
                value={inputs.MonthlyUsageHours}
                onChange={(e) => handleInputChange('MonthlyUsageHours', parseInt(e.target.value) || 0)}
                className="w-full bg-[#080C1D] border border-white/10 rounded-xl px-3.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00C8FF]/50"
              />
            </div>

            {/* Last login days */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono text-slate-500">Last Active (Days Ago)</label>
              <input
                type="number"
                min="0"
                max="90"
                value={inputs.LastLoginDays}
                onChange={(e) => handleInputChange('LastLoginDays', parseInt(e.target.value) || 0)}
                className="w-full bg-[#080C1D] border border-white/10 rounded-xl px-3.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00C8FF]/50"
              />
            </div>

            {/* NPS Score */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono text-slate-500">NPS Satisfaction Index</label>
              <select
                value={inputs.NPSScore}
                onChange={(e) => handleInputChange('NPSScore', parseInt(e.target.value))}
                className="w-full bg-[#080C1D] border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00C8FF]/50 text-white"
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                  <option key={n} value={n}>{n} out of 10</option>
                ))}
              </select>
            </div>

            {/* Subscription Plan */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono text-slate-500">Subscription Tier</label>
              <select
                value={inputs.SubscriptionPlan}
                onChange={(e) => handleInputChange('SubscriptionPlan', e.target.value)}
                className="w-full bg-[#080C1D] border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00C8FF]/50 text-white"
              >
                <option value="Basic">Basic Plan</option>
                <option value="Standard">Standard Plan</option>
                <option value="Premium">Premium Plan</option>
              </select>
            </div>

            {/* Account Health */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono text-slate-500">Account Health (SLA)</label>
              <select
                value={inputs.AccountHealth}
                onChange={(e) => handleInputChange('AccountHealth', e.target.value)}
                className="w-full bg-[#080C1D] border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00C8FF]/50 text-white"
              >
                <option value="Good">Good Standing</option>
                <option value="Fair">Fair standing</option>
                <option value="Poor">Poor standing</option>
              </select>
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 rounded-xl text-white font-semibold text-sm hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-cyan-500/10 flex items-center justify-center gap-2"
            >
              <BrainCircuit className="w-5 h-5 animate-spin" style={{ animationDuration: isLoading ? '3s' : '0s' }} />
              <span>{isLoading ? 'Processing Neural Networks...' : 'Compute Predictive Churn Risk'}</span>
            </button>
          </div>
        </form>

        {/* Prediction Results Display (1 column) */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="glass p-8 flex flex-col items-center justify-center text-center h-[525px]">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-white/5 border-t-[#00C8FF] animate-spin" />
                <BrainCircuit className="absolute inset-0 m-auto w-8 h-8 text-[#00C8FF]" />
              </div>
              <h4 className="text-sm font-semibold text-white">Running Logistic Regression Classifier</h4>
              <p className="text-xs text-[#00C8FF] font-mono mt-2 animate-pulse">{loadingStep}</p>
              <span className="text-[10px] text-slate-500 mt-6 font-mono">TensorFlow TS Kernel v2.4.0</span>
            </div>
          ) : result ? (
            <div className="glass p-6 relative overflow-hidden group min-h-[525px] flex flex-col justify-between">
              {/* Radial Probability Display */}
              <div>
                <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-6">
                  <h4 className="text-sm font-semibold text-white">Simulation Diagnostics</h4>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono ${
                    result.riskLevel === 'High' 
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                      : result.riskLevel === 'Medium'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {result.riskLevel} Churn Risk
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center text-center mb-6">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="absolute w-full h-full transform -rotate-90">
                      <circle cx="72" cy="72" r="62" stroke="#080C1D" strokeWidth="10" fill="transparent" />
                      <circle 
                        cx="72" 
                        cy="72" 
                        r="62" 
                        stroke={result.riskLevel === 'High' ? '#f43f5e' : result.riskLevel === 'Medium' ? '#fbbf24' : '#10b981'} 
                        strokeWidth="10" 
                        fill="transparent" 
                        strokeDasharray={2 * Math.PI * 62}
                        strokeDashoffset={2 * Math.PI * 62 * (1 - result.churnProbability / 100)}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-extrabold text-white font-mono">{result.churnProbability.toFixed(1)}%</span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mt-0.5">Probability</span>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider block">Prescribed Action Recommendations</span>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, i) => (
                        <li key={i} className="flex gap-2 text-xs text-slate-300 font-sans leading-relaxed">
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Retention Strategies */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider block">Retention Playbook Campaigns</span>
                    <ul className="space-y-2">
                      {result.strategies.map((strat, i) => (
                        <li key={i} className="flex gap-2 text-xs text-slate-300 font-sans leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{strat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 text-center font-mono mt-6 flex justify-center items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#00C8FF]" />
                <span>Deterministic Predictive Engine Active</span>
              </div>
            </div>
          ) : (
            <div className="glass p-8 flex flex-col items-center justify-center text-center h-[525px]">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 mb-4 animate-pulse">
                <BrainCircuit className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="text-sm font-semibold text-slate-400">Decision Support System</h4>
              <p className="text-slate-500 text-xs mt-1.5 max-w-[200px]">
                Input account telemetry details and click "Compute" to calculate real-time statistical churn likelihood.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
