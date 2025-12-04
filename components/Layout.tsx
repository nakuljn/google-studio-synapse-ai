import React from 'react';
import { LayoutDashboard, Target, Users, Globe, Menu, X, Terminal, Settings, BookOpen, Code, Crosshair, Wrench } from 'lucide-react';
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
                     <span className="text-[10px] text-brand-500 uppercase tracking-[0.2em] font-semibold">PROTOCOL</span>
                </div>
            </div>
          </div>

          <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
            <div className="px-6 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Command</div>
            <NavItem to="/" icon={LayoutDashboard} label="Home" active={location.pathname === '/'} />

            {/* BUILD Phase */}
            <div className="px-6 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-6">Build</div>
            <NavItem to="/squad" icon={Users} label="My Squad" active={location.pathname.startsWith('/squad')} />
            <NavItem to="/weapons" icon={Wrench} label="Weapons" active={location.pathname.startsWith('/weapons')} />
            <NavItem to="/playground" icon={Code} label="Playground" active={location.pathname === '/playground'} />
            
            {/* DEPLOY Phase */}
            <div className="px-6 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-6">Deploy</div>
            <NavItem to="/missions" icon={Target} label="Missions" active={location.pathname.startsWith('/missions') || location.pathname.startsWith('/ops')} />
            <NavItem to="/wargames" icon={Globe} label="Wargames" active={location.pathname.startsWith('/wargames')} />
            
            {/* LEARN Phase */}
            <div className="px-6 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-6">Learn</div>
            <NavItem to="/manual" icon={BookOpen} label="Academy" active={location.pathname.startsWith('/manual')} />

          </nav>

          <div className="p-4 border-t border-dark-border space-y-2">
             <NavItem to="/settings" icon={Settings} label="Settings" active={location.pathname === '/settings'} />
             <div className="px-4 py-3 text-xs text-slate-600 border border-dark-border border-dashed rounded mt-2 flex justify-between items-center">
                 <span>SERVER STATUS:</span>
                 <span className="text-green-500 animate-pulse">ONLINE</span>
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