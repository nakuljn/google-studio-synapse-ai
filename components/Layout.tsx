import React, { useState } from 'react';
import { LayoutDashboard, Target, Users, Globe, Menu, X, Terminal, Settings, BookOpen, Code, Crosshair, Wrench, ChevronLeft, ChevronRight, Swords, Dumbbell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}

const NavItem = ({ 
  to, 
  icon: Icon, 
  label, 
  active, 
  isSpecial = false, 
  isCollapsed = false 
}: { 
  to: string, 
  icon: any, 
  label: string, 
  active: boolean, 
  isSpecial?: boolean, 
  isCollapsed?: boolean 
}) => (
  <Link
    to={to}
    className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 rounded-none border-l-2 transition-all duration-200 font-mono text-sm group ${
      active 
        ? 'bg-brand-900/20 text-brand-400 border-brand-500' 
        : 'text-slate-500 border-transparent hover:bg-dark-surface hover:text-slate-300'
    } ${isSpecial ? 'text-red-400 hover:text-red-300' : ''}`}
    title={isCollapsed ? label : undefined}
  >
    <Icon size={18} className={`${active ? (isSpecial ? 'text-red-400' : 'text-brand-400') : (isSpecial ? 'text-red-800' : 'text-slate-600')} transition-colors`} />
    {!isCollapsed && (
        <span className="uppercase tracking-wider truncate animate-in fade-in duration-200">{label}</span>
    )}
  </Link>
);

const GroupHeader = ({ label, isCollapsed }: { label: string, isCollapsed: boolean }) => {
    if (isCollapsed) return <div className="h-px w-8 mx-auto bg-dark-border my-4" />;
    return (
        <div className="px-6 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-6 animate-in fade-in duration-200">
            {label}
        </div>
    );
};

export const Layout: React.FC<LayoutProps> = ({ children, defaultCollapsed = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-dark-bg text-slate-200 overflow-hidden font-mono">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-dark-bg border-r border-dark-border transform transition-all duration-300 ease-in-out flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full'}
        md:relative md:translate-x-0 ${isCollapsed ? 'md:w-20' : 'md:w-64'}
      `}>
        <div className="h-full flex flex-col relative">
            
          {/* Desktop Collapse Toggle */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-8 bg-dark-surface border border-dark-border text-slate-400 hover:text-white rounded-full p-1 shadow-lg hidden md:flex z-50 hover:scale-110 transition-transform"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          <div className={`p-6 border-b border-dark-border/50 flex items-center ${isCollapsed ? 'justify-center px-2' : ''} transition-all`}>
            <div className="flex items-center space-x-2 overflow-hidden">
                <Terminal size={24} className="text-brand-500 flex-shrink-0" />
                {!isCollapsed && (
                    <div className="animate-in fade-in duration-200 whitespace-nowrap">
                        <span className="text-lg font-bold tracking-tight text-white block leading-none">SYNAPSE</span>
                        <span className="text-[10px] text-brand-500 uppercase tracking-[0.2em] font-semibold">PROTOCOL</span>
                    </div>
                )}
            </div>
          </div>

          <nav className="flex-1 py-4 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
            <GroupHeader label="Command" isCollapsed={isCollapsed} />
            <NavItem to="/" icon={LayoutDashboard} label="Base" active={location.pathname === '/'} isCollapsed={isCollapsed} />

            {/* BUILD Phase */}
            <GroupHeader label="Build" isCollapsed={isCollapsed} />
            <NavItem to="/squad" icon={Users} label="Agents" active={location.pathname.startsWith('/squad')} isCollapsed={isCollapsed} />
            <NavItem to="/weapons" icon={Wrench} label="Weapons" active={location.pathname.startsWith('/weapons')} isCollapsed={isCollapsed} />
            
            {/* DEPLOY Phase */}
            <GroupHeader label="Deploy" isCollapsed={isCollapsed} />
            <NavItem to="/training" icon={Dumbbell} label="Training" active={location.pathname === '/training'} isCollapsed={isCollapsed} />
            <NavItem to="/missions" icon={Target} label="Missions" active={location.pathname.startsWith('/missions') || location.pathname.startsWith('/ops')} isCollapsed={isCollapsed} />
            <NavItem to="/wargames" icon={Swords} label="Arena" active={location.pathname.startsWith('/wargames')} isSpecial={true} isCollapsed={isCollapsed} />
            
            {/* LEARN Phase */}
            <GroupHeader label="Learn" isCollapsed={isCollapsed} />
            <NavItem to="/manual" icon={BookOpen} label="Academy" active={location.pathname.startsWith('/manual')} isCollapsed={isCollapsed} />

          </nav>

          <div className="p-4 border-t border-dark-border space-y-2">
             <NavItem to="/settings" icon={Settings} label="Settings" active={location.pathname === '/settings'} isCollapsed={isCollapsed} />
             {!isCollapsed && (
                 <div className="px-4 py-3 text-xs text-slate-600 border border-dark-border border-dashed rounded mt-2 flex justify-between items-center animate-in fade-in duration-200">
                     <span>SERVER STATUS:</span>
                     <span className="text-green-500 animate-pulse">ONLINE</span>
                 </div>
             )}
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