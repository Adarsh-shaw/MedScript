
import React, { useState, useEffect, useMemo } from 'react';
import { User, UserRole, PrescriptionStatus } from '../types';
import { db } from '../services/db';
import { 
  Users, 
  ShieldCheck, 
  Activity, 
  Settings, 
  Database, 
  Lock,
  Globe,
  Bell,
  UserPlus,
  Trash2,
  X,
  Mail,
  Stethoscope,
  Pill,
  User as UserIcon,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCcw,
  Languages,
  PhoneCall,
  LayoutDashboard,
  FileText,
  PieChart as PieChartIcon,
  TrendingUp,
  QrCode,
  Briefcase
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, AreaChart, Area, PieChart, Pie
} from 'recharts';

const weeklyData = [
  { name: 'Mon', count: 1200 },
  { name: 'Tue', count: 1420 },
  { name: 'Wed', count: 1100 },
  { name: 'Thu', count: 1350 },
  { name: 'Fri', count: 1600 },
  { name: 'Sat', count: 900 },
  { name: 'Sun', count: 850 },
];

const pieData = [
  { name: 'Verified', value: 400, fill: '#4f46e5' },
  { name: 'Pending', value: 300, fill: '#818cf8' },
  { name: 'Canceled', value: 100, fill: '#f43f5e' },
  { name: 'In Review', value: 200, fill: '#10b981' },
];

const AdminDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'settings'>('stats');
  const [usersList, setUsersList] = useState<User[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const prescriptions = useMemo(() => db.getPrescriptions(), []);
  
  const stats = useMemo(() => {
    const doctors = usersList.filter(u => u.role === UserRole.DOCTOR).length;
    const patients = usersList.filter(u => u.role === UserRole.PATIENT).length;
    const pharmacists = usersList.filter(u => u.role === UserRole.PHARMACIST).length;
    
    return {
      doctors,
      patients,
      pharmacists,
      totalRx: prescriptions.length,
      todayRx: prescriptions.filter(p => new Date(p.date).toDateString() === new Date().toDateString()).length + 256, // +seed
      qrScans: "324k"
    };
  }, [usersList, prescriptions]);

  useEffect(() => {
    setUsersList(db.getUsers());
  }, [showAddModal]);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Date.now().toString(),
      name: newName,
      email: newEmail,
      role: newRole,
      specialty: newRole === UserRole.DOCTOR ? newSpecialty : undefined
    };
    db.addUser(newUser);
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
    setNewSpecialty('');
    setUsersList(db.getUsers());
  };

  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>(UserRole.DOCTOR);
  const [newSpecialty, setNewSpecialty] = useState('');

  const handleDeleteUser = (id: string) => {
    if (window.confirm("Revoke access for this entity?")) {
      db.deleteUser(id);
      setUsersList(db.getUsers());
    }
  };

  const filteredUsers = usersList.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-500">
      
      {/* View Switcher Sidebar-style Tabs */}
      <div className="flex flex-wrap gap-3 p-1.5 bg-slate-100 rounded-[2rem] w-fit shadow-inner">
        <button 
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-3 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'stats' ? 'bg-indigo-600 shadow-xl text-white' : 'text-slate-500 hover:text-indigo-600'}`}
        >
          <LayoutDashboard size={16} /> Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-3 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-indigo-600 shadow-xl text-white' : 'text-slate-500 hover:text-indigo-600'}`}
        >
          <Users size={16} /> User Management
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-3 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-indigo-600 shadow-xl text-white' : 'text-slate-500 hover:text-indigo-600'}`}
        >
          <Settings size={16} /> Global Settings
        </button>
      </div>

      {activeTab === 'stats' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
          
          {/* Top Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col justify-between overflow-hidden relative group">
              <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Prescriptions Overview</p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter">1.42k</h3>
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">Prescription last week</p>
              </div>
              <div className="h-40 -mx-10 -mb-10 mt-6 group-hover:scale-105 transition-transform duration-700">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="colorRx" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRx)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-1 bg-indigo-50 p-10 rounded-[3rem] shadow-sm border border-indigo-100 flex items-center justify-between relative overflow-hidden group">
               <div className="relative z-10">
                  <h3 className="text-5xl font-black text-indigo-900 tracking-tighter mb-2">“{stats.todayRx}</h3>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Prescription today</p>
               </div>
               <div className="relative z-10 p-6 bg-white rounded-3xl shadow-xl shadow-indigo-100 group-hover:rotate-12 transition-transform duration-500">
                 <Pill size={48} className="text-indigo-600" />
               </div>
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-200/20 blur-[60px] rounded-full"></div>
            </div>

            <div className="lg:col-span-1 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex items-center justify-between group">
               <div>
                  <h3 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">{stats.qrScans}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">QR Scans Managed</p>
               </div>
               <div className="p-6 bg-slate-50 rounded-3xl group-hover:scale-110 transition-transform duration-500">
                 <QrCode size={48} className="text-indigo-600" />
               </div>
            </div>
          </div>

          {/* Icon Stat Grid (Match image exactly) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <SquareStat icon={<Stethoscope />} label="Doctors" value="320" color="bg-indigo-50 text-indigo-600" />
            <SquareStat icon={<Users />} label="Patients" value="2.1k" color="bg-emerald-50 text-emerald-600" />
            <SquareStat icon={<FileText />} label="Prescriptions" value="50.5k" color="bg-amber-50 text-amber-600" />
            <SquareStat icon={<Briefcase />} label="Pharmacists" value="1.8k" color="bg-slate-100 text-slate-900" />
          </div>

          {/* QR Management & Table */}
          <div className="bg-white rounded-[4rem] shadow-sm border border-slate-100 overflow-hidden">
             <div className="px-12 py-10 border-b border-slate-50 flex items-center justify-between">
                <div>
                   <h4 className="text-2xl font-black text-slate-900 tracking-tight">QR Management</h4>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Live Clinical Verification Stream</p>
                </div>
                <div className="flex gap-2">
                   <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                   <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                </div>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-4 p-12 border-r border-slate-50 flex flex-col items-center">
                   <div className="h-64 w-full mb-10">
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie 
                              data={pieData} 
                              innerRadius={60} 
                              outerRadius={80} 
                              paddingAngle={5} 
                              dataKey="value"
                            />
                            <Tooltip 
                              contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} 
                            />
                         </PieChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="space-y-3 w-full">
                      {pieData.map(d => (
                        <div key={d.name} className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                           <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full" style={{ background: d.fill }}></div>
                              <span className="text-slate-400">{d.name}</span>
                           </div>
                           <span className="text-slate-900">{d.value} Units</span>
                        </div>
                      ))}
                   </div>
                </div>
                
                <div className="lg:col-span-8 overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            <th className="px-12 py-6">Patient</th>
                            <th className="px-12 py-6">Doctor</th>
                            <th className="px-12 py-6">Date</th>
                            <th className="px-12 py-6 text-right">Prescription</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {prescriptions.slice(0, 5).map((rx, i) => (
                           <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-12 py-7 font-black text-slate-800 text-sm">{rx.patientEmail.split('@')[0].toUpperCase()}</td>
                              <td className="px-12 py-7 text-xs font-bold text-slate-500">DR. {rx.doctorName.toUpperCase()}</td>
                              <td className="px-12 py-7 text-[10px] font-mono font-black text-slate-400">{new Date(rx.date).toLocaleDateString()}</td>
                              <td className="px-12 py-7 text-right">
                                 <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                                    View QR
                                 </button>
                              </td>
                           </tr>
                         ))}
                         {/* Mock extra rows to match image depth */}
                         <MockRow name="Sarah Parker" doc="Dr. R. Patel" date="22/20/08/2024" />
                         <MockRow name="Michael Smith" doc="Dr. S. Nair" date="22/20/09/2024" />
                         <MockRow name="Emily Johnson" doc="Dr. M. Singh" date="22/20/10/2024" />
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
          <div className="p-10 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Access Control Ledger</h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Manage network entities and biometric keys</p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-3.5 text-slate-300" size={18} />
                <input 
                  type="text" 
                  placeholder="Search network..."
                  className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 text-sm font-bold"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="px-8 py-3.5 bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-3"
              >
                <UserPlus size={18} /> Register
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <th className="px-10 py-5">Verified Entity</th>
                  <th className="px-10 py-5">Digital Signature</th>
                  <th className="px-10 py-5">Communication</th>
                  <th className="px-10 py-5 text-right">Admin Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-indigo-50/20 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          {u.role === UserRole.DOCTOR ? <Stethoscope size={24} /> : 
                           u.role === UserRole.PHARMACIST ? <Pill size={24} /> :
                           u.role === UserRole.ADMIN ? <ShieldCheck size={24} /> : <UserIcon size={24} />}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 tracking-tight">{u.name}</p>
                          {u.specialty && <p className="text-[10px] text-indigo-500 font-bold uppercase">{u.specialty}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        u.role === UserRole.ADMIN ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                        u.role === UserRole.DOCTOR ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        u.role === UserRole.PHARMACIST ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {u.role} NODE
                      </span>
                    </td>
                    <td className="px-10 py-6 text-xs font-bold text-slate-500 uppercase tracking-tight">{u.email}</td>
                    <td className="px-10 py-6 text-right">
                      {u.id !== user.id && (
                        <button 
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-3 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Global Settings Block */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-10 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
             <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">System Infrastructure</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Configure global API and security parameters</p>
             </div>
             <button className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all">
                Update Kernel
             </button>
          </div>
          <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
             <div className="space-y-10">
                <SettingsToggle label="Global AI Check" desc="Enforce automated drug collision detection" active />
                <SettingsToggle label="Strict Biometrics" desc="Require fingerprint/face auth for pharmacists" />
                <SettingsToggle label="Public Ledger" desc="Allow public verification of clinical QR codes" active />
             </div>
             <div className="p-10 bg-indigo-600 rounded-[3rem] text-white space-y-6 relative overflow-hidden shadow-2xl shadow-indigo-200">
                <div className="relative z-10 flex items-center gap-4">
                   <div className="p-3 bg-white/10 rounded-2xl">
                      <ShieldCheck size={24} />
                   </div>
                   <h4 className="text-xl font-black tracking-tight">Security Protocol 4.2</h4>
                </div>
                <p className="relative z-10 text-indigo-100 text-sm leading-relaxed font-bold">Your system is running on an encrypted decentralized vault. All clinical data is fragmented and signed before storage.</p>
                <div className="relative z-10 flex items-center gap-6">
                   <div>
                      <p className="text-3xl font-black">256</p>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Bit Enc</p>
                   </div>
                   <div className="w-px h-10 bg-white/10"></div>
                   <div>
                      <p className="text-3xl font-black">HA</p>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Status</p>
                   </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] -mr-32 -mt-32"></div>
             </div>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowAddModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-12 animate-in zoom-in-95 duration-200">
            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-8 leading-none text-center">Entity Registration</h3>
            <form onSubmit={handleAddUser} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Identity Name</label>
                <input 
                  required
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-black text-sm uppercase tracking-tight"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="DR. AMIT VERMA"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Network Email</label>
                <input 
                  required
                  type="email"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="amit@medscript.ai"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Node Permission</label>
                <div className="grid grid-cols-2 gap-2">
                  {[UserRole.DOCTOR, UserRole.PHARMACIST, UserRole.PATIENT, UserRole.ADMIN].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setNewRole(r)}
                      className={`py-3 rounded-xl border-2 text-[9px] font-black uppercase tracking-widest transition-all ${newRole === r ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                type="submit"
                className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-indigo-100 mt-6 active:scale-95 transition-all"
              >
                Sign & Authorize
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const SquareStat: React.FC<{ icon: React.ReactNode; label: string; value: string; color: string }> = ({ icon, label, value, color }) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 flex flex-col items-center text-center group hover:shadow-xl transition-all">
    <div className={`p-5 rounded-2xl mb-6 shadow-sm group-hover:scale-110 transition-transform ${color}`}>
       {/* Fix: Added check for valid element and cast to any to fix type mismatch for 'size' prop */}
       {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 32 }) : icon}
    </div>
    <h4 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{value}</h4>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
  </div>
);

const SettingsToggle: React.FC<{ label: string; desc: string; active?: boolean }> = ({ label, desc, active: initial }) => {
   const [active, setActive] = useState(initial);
   return (
     <div className="flex items-center justify-between p-8 bg-slate-50/50 border border-slate-100 rounded-[2.5rem]">
        <div>
           <p className="text-base font-black text-slate-800 tracking-tight">{label}</p>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{desc}</p>
        </div>
        <button 
          onClick={() => setActive(!active)}
          className={`w-14 h-8 rounded-full transition-all relative ${active ? 'bg-indigo-600' : 'bg-slate-200'}`}
        >
           <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${active ? 'translate-x-6' : 'translate-x-0'} shadow-sm`}></div>
        </button>
     </div>
   );
}

const MockRow: React.FC<{ name: string; doc: string; date: string }> = ({ name, doc, date }) => (
   <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-12 py-7 font-black text-slate-800 text-sm">{name}</td>
      <td className="px-12 py-7 text-xs font-bold text-slate-500">{doc}</td>
      <td className="px-12 py-7 text-[10px] font-mono font-black text-slate-400">{date}</td>
      <td className="px-12 py-7 text-right">
         <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
            View QR
         </button>
      </td>
   </tr>
);

export default AdminDashboard;
