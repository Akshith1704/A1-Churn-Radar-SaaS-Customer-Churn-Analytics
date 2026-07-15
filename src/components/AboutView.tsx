import { 
  Award, 
  BookOpen, 
  Workflow, 
  Cpu, 
  Github, 
  User, 
  GraduationCap, 
  Database 
} from 'lucide-react';

export default function AboutView() {
  const objectives = [
    { title: 'Evaluate Subscriber Churn Dynamics', desc: 'Identify critical behavioral and billing variables that indicate churn likelihood, such as month-to-month contracts and open support tickets.' },
    { title: 'Formulate Automated Retention Protocols', desc: 'Prescribe customized retentional actions based on customer satisfaction scores and active ticket volumes.' },
    { title: 'Enable Strategic Financial Guardrails', desc: 'Provide executives and analysts with clear estimates of monthly recurring revenue (MRR) at risk.' }
  ];

  const workflowSteps = [
    { step: '1', title: 'Data Cleaning & Preprocessing', desc: 'Normalized charges, handled missing records, and filtered feature tensors.' },
    { step: '2', title: 'Exploratory Data Analysis (EDA)', desc: 'Derived contract type, account health standing, and NPS satisfaction distributions.' },
    { step: '3', title: 'Machine Learning Training', desc: 'Assembled a Random Forest & XGBoost classifier for churn probability prediction.' },
    { step: '4', title: 'SaaS Deployment Implementation', desc: 'Built this glassmorphic dashboard panel for real-time risk surveillance.' }
  ];

  const techStack = [
    { category: 'Modeling Core', items: ['Python', 'Pandas', 'NumPy', 'Scikit-learn'] },
    { category: 'BI Visualizers', items: ['Power BI', 'Streamlit', 'Vite & React 19'] },
    { category: 'Version Control', items: ['GitHub', 'Git LFS'] }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Brand/Problem Statement (1 col) */}
      <div className="space-y-6">
        {/* Project Brand Card */}
        <div className="glass bg-gradient-to-tr from-white/5 to-[#080C1D]/30 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-purple-500/10 to-cyan-500/5 rounded-full blur-2xl" />
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-[#080C1D] border border-white/10 rounded-2xl flex items-center justify-center text-[#00C8FF] shadow-inner shadow-cyan-500/5">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] bg-cyan-500/10 text-[#00C8FF] border border-cyan-500/20 px-3 py-1 rounded-full uppercase font-mono tracking-widest font-bold">
                Engineering Final Year Project
              </span>
              <h3 className="text-xl font-bold text-white mt-3 font-sans">
                Churn Radar
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 font-sans leading-relaxed">
                SaaS Customer Churn Analytics and Predictive Risk Surveillance Suite.
              </p>
            </div>
          </div>
        </div>

        {/* Problem Statement Card */}
        <div className="glass p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <BookOpen className="w-4 h-4 text-[#00C8FF]" />
            <h4 className="text-sm font-semibold text-white">Problem Statement</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            SaaS companies often lose customers due to low engagement, poor customer experience, pricing issues, and customer dissatisfaction. 
          </p>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            The objective of this project is to build an advanced, analytics-driven dashboard that helps businesses evaluate customer churn, isolate high-risk customer segments, estimate recurring revenue at risk, and deliver automated, personalized retention strategies to increase lifetime value (LTV).
          </p>
        </div>

        {/* Author/Academic Card */}
        <div className="glass p-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-purple-400 border border-white/10">
            <User className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-mono">Academic Author</span>
            <h5 className="text-sm font-bold text-white">Charugondla Akshith</h5>
            <p className="text-[11px] text-slate-400">Final-Year Engineering Internship Project</p>
          </div>
        </div>
      </div>

      {/* Right Column: Objectives, Workflow, Tech Stack (2 cols) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Objectives Section */}
        <div className="glass p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Award className="w-4 h-4 text-[#00C8FF]" />
            <h4 className="text-sm font-semibold text-white">Project Objectives</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {objectives.map((obj, i) => (
              <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-1.5">
                <span className="text-xs font-semibold text-white block">{obj.title}</span>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{obj.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Project Workflow Section */}
        <div className="glass p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Workflow className="w-4 h-4 text-purple-400" />
            <h4 className="text-sm font-semibold text-white">Project Workflow Methodology</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {workflowSteps.map((step, i) => (
              <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-1.5 relative">
                <span className="absolute top-2 right-3 text-lg font-mono font-black text-white/5">{step.step}</span>
                <span className="text-[11px] font-semibold text-[#00C8FF] block">{step.title}</span>
                <p className="text-[10px] text-slate-400 leading-relaxed font-sans">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Stack Grid */}
        <div className="glass p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-semibold text-white">Academic Technology Stack</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {techStack.map((tech, i) => (
              <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">{tech.category}</span>
                <div className="flex flex-wrap gap-1.5">
                  {tech.items.map((item) => (
                    <span key={item} className="text-xs bg-[#080C1D] border border-white/10 text-slate-300 px-2.5 py-1 rounded-lg font-mono font-medium">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
