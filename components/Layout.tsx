
import React from 'react';
import { LayoutDashboard, BookOpen, GraduationCap, Settings, Menu, X, Zap, FlaskConical, Users, Swords, Crosshair } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const NavItem = ({ to, icon: Icon, label, active, isSpecial = false }: { to: string, icon: any, label: string, active: boolean, isSpecial?: boolean }) => (
  <Link
    to={to}
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-brand-600/20 text-brand-300 border-l-2 border-brand-400' 
        : 'text-slate-400 hover:bg-dark-surface hover:text-white'
    } ${isSpecial ? 'bg-red-900/10 text-red-400 hover:bg-red-900/20 hover:text-red-300' : ''}`}
  >
    <Icon size={20} className={isSpecial ? 'text-red-500' : ''} />
    <span className={`font-medium ${isSpecial ? 'font-bold' : ''}`}>{label}</span>
  </Link>
);

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-dark-bg text-slate-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-dark-bg border-r border-dark-border transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center space-x-2">
            <div className="bg-brand-500 p-2 rounded-lg shadow-lg shadow-brand-500/30">
                <Zap size={24} className="text-white fill-current" />
            </div>
            <div>
                 <span className="text-xl font-bold tracking-tight text-white block leading-none">Synapse</span>
                 <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">AI Ecosystem</span>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Learn</div>
            <NavItem to="/" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/'} />
            <NavItem to="/courses" icon={BookOpen} label="Courses" active={location.pathname.startsWith('/course')} />
            
            <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-6">Build</div>
            <NavItem to="/lab" icon={FlaskConical} label="My Lab" active={location.pathname.startsWith('/lab')} />
            <NavItem to="/community" icon={Users} label="Community" active={location.pathname === '/community'} />
            
            <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-6">Compete</div>
            <NavItem to="/arena" icon={Swords} label="Arena" active={location.pathname.startsWith('/arena')} isSpecial={true} />
            <NavItem to="/bounties" icon={Crosshair} label="Bounties" active={location.pathname.startsWith('/bounties')} />
            <NavItem to="/achievements" icon={GraduationCap} label="Leaderboard" active={location.pathname === '/achievements'} />
          </nav>

          <div className="p-4 border-t border-dark-border space-y-2">
             <NavItem to="/settings" icon={Settings} label="Settings" active={location.pathname === '/settings'} />
            <div className="flex items-center space-x-3 bg-dark-surface p-3 rounded-lg mt-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                    JD
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">John Doe</p>
                    <p className="text-xs text-brand-400 truncate">Lvl 3 Engineer</p>
                </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-dark-bg border-b border-dark-border">
            <div className="flex items-center space-x-2">
                 <div className="bg-brand-500 p-1.5 rounded">
                    <Zap size={18} className="text-white fill-current" />
                </div>
                <span className="font-bold text-white">Synapse</span>
            </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        <main className="flex-1 overflow-auto bg-dark-bg">
          {children}
        </main>
      </div>
    </div>
  );
};