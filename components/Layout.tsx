
import React from 'react';
import { LayoutDashboard, Database, Shield, Globe, Menu, X, Terminal, Cpu, Settings, Target } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const NavItem = ({ to, icon: Icon, label, active, isSpecial = false }: { to: string, icon: any, label: string, active: boolean, isSpecial?: boolean }) => (
  <Link
    to={to}
    className={`flex items-center space-x-3 px-4 py-3 rounded-none border-l-2 transition-all duration-200 font-mono text-sm ${
      active 
        ? 'bg-brand-900/20 text-brand-400 border-brand-500' 
        : 'text-slate-500 border-transparent hover:bg-dark-surface hover:text-slate-300'
    } ${isSpecial ? 'text-red-400 hover:text-red-300' : ''}`}
  >
    <Icon size={18} className={active ? 'text-brand-400' : 'text-slate-600'} />
    <span className="uppercase tracking-wider">{label}</span>
  </Link>
);

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-dark-bg text-slate-200 overflow-hidden font-mono">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-dark-bg border-r border-dark-border transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-dark-border/50">
            <div className="flex items-center space-x-2">
                <Terminal size={24} className="text-brand-500" />
                <div>
                     <span className="text-lg font-bold tracking-tight text-white block leading-none">SYNAPSE</span>
                     <span className="text-[10px] text-brand-500 uppercase tracking-[0.2em] font-semibold">PROTOCOL_V2</span>
                </div>
            </div>
          </div>

          <nav className="flex-1 py-4 space-y-1">
            <div className="px-6 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Operations</div>
            <NavItem to="/" icon={LayoutDashboard} label="Command" active={location.pathname === '/'} />
            <NavItem to="/intel" icon={Database} label="Intel" active={location.pathname.startsWith('/intel')} />
            
            <div className="px-6 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-6">Engineering</div>
            <NavItem to="/workshop" icon={Cpu} label="Workshop" active={location.pathname.startsWith('/workshop')} />
            
            <div className="px-6 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-6">Field Ops</div>
            <NavItem to="/network" icon={Globe} label="The Network" active={location.pathname.startsWith('/network')} />
            <NavItem to="/bounties" icon={Target} label="HVT Bounties" active={location.pathname.startsWith('/bounties')} isSpecial={true} />
          </nav>

          <div className="p-4 border-t border-dark-border space-y-2">
             <NavItem to="/settings" icon={Settings} label="Config" active={location.pathname === '/settings'} />
             <div className="px-4 py-3 text-xs text-slate-600 border border-dark-border border-dashed rounded mt-2">
                 STATUS: <span className="text-green-500 animate-pulse">CONNECTED</span>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-dark-bg to-black">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-dark-bg border-b border-dark-border">
            <span className="font-bold text-white font-mono">SYNAPSE PROTOCOL</span>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
