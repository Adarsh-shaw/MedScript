
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  LayoutDashboard, 
  FileText, 
  History, 
  User as UserIcon,
  ShieldCheck,
  Stethoscope,
  Pill,
  Bell,
  Menu,
  X,
  Info,
  Zap,
  Globe,
  Settings,
  PieChart,
  Users,
  Search
} from 'lucide-react';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-indigo-900 text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Stethoscope size={24} />
          <span className="font-bold">MedScript AI</span>
        </div>
        <button onClick={toggleMobileMenu} className="p-2 hover:bg-indigo-800 rounded-lg">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-indigo-900 text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-10 hidden md:flex items-center gap-4">
            <div className="bg-white p-2.5 rounded-2xl shadow-xl">
              <Stethoscope className="text-indigo-900" size={28} />
            </div>
            <div>
               <h1 className="text-xl font-black tracking-tighter uppercase leading-none">MedScript</h1>
               <span className="text-[10px] font-black text-indigo-400 tracking-[0.3em] uppercase mt-1">AI Network</span>
            </div>
          </div>
          
          <nav className="flex-1 px-6 py-6 space-y-2">
            <NavItem 
              icon={<LayoutDashboard size={22} />} 
              label="Dashboard" 
              active={location.pathname === '/'} 
              onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }} 
            />
            
            {user.role === UserRole.ADMIN && (
              <>
                <NavItem icon={<Stethoscope size={22} />} label="Doctors" onClick={() => { setIsMobileMenuOpen(false); }} />
                <NavItem icon={<Users size={22} />} label="Patients" onClick={() => { setIsMobileMenuOpen(false); }} />
                <NavItem icon={<FileText size={22} />} label="Prescriptions" onClick={() => { setIsMobileMenuOpen(false); }} />
                <NavItem icon={<Pill size={22} />} label="Pharmacists" onClick={() => { setIsMobileMenuOpen(false); }} />
                <NavItem icon={<PieChart size={22} />} label="Analytics" onClick={() => { setIsMobileMenuOpen(false); }} />
                <NavItem icon={<Settings size={22} />} label="Settings" onClick={() => { setIsMobileMenuOpen(false); }} />
              </>
            )}

            {user.role === UserRole.DOCTOR && (
              <>
                <NavItem 
                  icon={<FileText size={22} />} 
                  label="Prescriptions" 
                  active={location.pathname === '/prescriptions'}
                  onClick={() => { navigate('/prescriptions'); setIsMobileMenuOpen(false); }} 
                />
                <NavItem 
                  icon={<History size={22} />} 
                  label="Patient History" 
                  active={location.pathname === '/history'}
                  onClick={() => { navigate('/history'); setIsMobileMenuOpen(false); }} 
                />
              </>
            )}
            
            {user.role === UserRole.PATIENT && (
              <>
                <NavItem 
                  icon={<FileText size={22} />} 
                  label="Medical Vault" 
                  active={location.pathname === '/vault'}
                  onClick={() => { navigate('/vault'); setIsMobileMenuOpen(false); }} 
                />
                <NavItem 
                  icon={<Bell size={22} />} 
                  label="Med Reminders" 
                  active={location.pathname === '/reminders'}
                  onClick={() => { navigate('/reminders'); setIsMobileMenuOpen(false); }} 
                />
              </>
            )}
            
            {user.role === UserRole.PHARMACIST && (
              <>
                <NavItem 
                  icon={<ShieldCheck size={22} />} 
                  label="Verification Hub" 
                  active={location.pathname === '/verify'}
                  onClick={() => { navigate('/verify'); setIsMobileMenuOpen(false); }} 
                />
                <NavItem 
                  icon={<Pill size={22} />} 
                  label="Stock Registry" 
                  active={location.pathname === '/stock'}
                  onClick={() => { navigate('/stock'); setIsMobileMenuOpen(false); }} 
                />
              </>
            )}

            <div className="pt-10 mt-10 border-t border-indigo-800 space-y-2 opacity-60">
               <NavItem 
                icon={<Info size={20} />} 
                label="Mission" 
                active={location.pathname === '/about'}
                onClick={() => { navigate('/about'); setIsMobileMenuOpen(false); }} 
              />
               <NavItem 
                icon={<Zap size={20} />} 
                label="Core Features" 
                active={location.pathname === '/features'}
                onClick={() => { navigate('/features'); setIsMobileMenuOpen(false); }} 
              />
            </div>
          </nav>

          <div className="p-8 border-t border-indigo-800 bg-indigo-950/30">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-sm font-black shadow-2xl border border-indigo-400">
                {user.email[0].toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black truncate text-white">{user.name || user.email}</p>
                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">{user.role} NODE</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-3 p-4 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all font-black text-xs uppercase tracking-widest"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        <header className="hidden md:flex bg-white/60 backdrop-blur-xl border-b border-slate-200 px-12 py-6 sticky top-0 z-30 justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="bg-slate-100 p-2 rounded-xl text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors">
              <Menu size={22} />
            </div>
            <div className="relative w-96">
               {/* Added Search icon import to fix 'Cannot find name' error */}
               <Search className="absolute left-4 top-3 text-slate-300" size={18} />
               <input 
                 type="text" 
                 placeholder="Search clinical archives..." 
                 className="w-full pl-12 pr-6 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-sm"
               />
            </div>
          </div>
          <div className="flex items-center gap-8">
             <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 shadow-sm">
               <ShieldCheck size={16} /> Encrypted Session
             </div>
             <div className="flex items-center gap-4">
                <button className="p-3 text-slate-400 hover:text-indigo-600 bg-slate-50 rounded-2xl transition-all relative">
                  <Bell size={22} />
                  <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full ring-4 ring-white"></span>
                </button>
                <div className="w-11 h-11 rounded-full border-4 border-white shadow-xl overflow-hidden cursor-pointer hover:scale-110 transition-transform">
                   <img src={`https://i.pravatar.cc/150?u=${user.id}`} alt="User" />
                </div>
             </div>
          </div>
        </header>
        <div className="p-8 md:p-12">
          {children}
        </div>
      </main>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`
      w-full flex items-center gap-4 p-4 rounded-2xl transition-all group
      ${active ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-950/40' : 'text-indigo-300 hover:text-white hover:bg-white/5'}
    `}
  >
    <span className={`${active ? 'text-white' : 'text-indigo-400 group-hover:text-white'} transition-colors`}>
      {icon}
    </span>
    <span className="font-black text-[11px] uppercase tracking-widest">{label}</span>
  </button>
);

export default Layout;
