import { 
  BarChart2, 
  Users, 
  BrainCircuit, 
  FileText, 
  Lightbulb, 
  Info, 
  Radar 
} from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as TabType, name: 'Dashboard', icon: BarChart2 },
    { id: 'analytics' as TabType, name: 'Customer Analytics', icon: Users },
    { id: 'prediction' as TabType, name: 'Churn Prediction', icon: BrainCircuit },
    { id: 'insights' as TabType, name: 'Business Insights', icon: Lightbulb },
    { id: 'reports' as TabType, name: 'Reports', icon: FileText },
    { id: 'about' as TabType, name: 'About Project', icon: Info }
  ];

  return (
    <aside className="w-64 bg-[#080C1D] border-r border-white/5 flex flex-col justify-between h-screen sticky top-0 shrink-0 z-20">
      <div className="flex flex-col flex-1 py-6">
        {/* Brand Logo Header */}
        <div className="flex items-center gap-3 px-6 mb-8">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00C8FF] via-indigo-500 to-purple-600 p-[1.5px]">
            <div className="flex items-center justify-center w-full h-full bg-[#0B1026] rounded-xl">
              <Radar className="w-5 h-5 text-[#00C8FF] animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white font-sans">
              Churn <span className="text-[#00C8FF]">Radar</span>
            </h1>
            <span className="text-[10px] text-purple-400 font-mono tracking-widest uppercase">Predictive Suite</span>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#00C8FF]/10 to-purple-500/10 border-l-2 border-[#00C8FF] text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#00C8FF]' : 'text-slate-400'}`} />
                <span>{item.name}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00C8FF] shadow-[0_0_8px_#00C8FF]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Meta */}
      <div className="p-4 border-t border-white/5 bg-white/[0.02]">
        <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mb-1.5 shadow-[0_0_6px_#10b981]" />
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Engine Status</span>
          <span className="text-xs font-semibold text-slate-300 mt-0.5">Active & Ready</span>
        </div>
      </div>
    </aside>
  );
}
