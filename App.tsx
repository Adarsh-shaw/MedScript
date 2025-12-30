import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserRole, User } from './types';
import Login from './views/Login';
import Register from './views/Register';
import LandingPage from './views/LandingPage';
import AboutPage from './views/AboutPage';
import FeaturesPage from './views/FeaturesPage';
import SocialImpactPage from './views/SocialImpactPage';
import DoctorDashboard from './views/DoctorDashboard';
import PatientDashboard from './views/PatientDashboard';
import PharmacistDashboard from './views/PharmacistDashboard';
import AdminDashboard from './views/AdminDashboard';
import Layout from './components/Layout';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'register' | 'about' | 'features' | 'impact'>('landing');

  useEffect(() => {
    const savedUser = localStorage.getItem('medscript_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('medscript_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('medscript_user');
    setCurrentView('landing');
  };

  if (user) {
    return (
      <Router>
        <Layout user={user} onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={
              user.role === UserRole.DOCTOR ? <DoctorDashboard user={user} /> :
              user.role === UserRole.PATIENT ? <PatientDashboard user={user} /> :
              user.role === UserRole.PHARMACIST ? <PharmacistDashboard user={user} /> :
              <AdminDashboard user={user} />
            } />
            <Route path="/about" element={<AboutPage onBack={() => {}} isDashboardView />} />
            <Route path="/features" element={<FeaturesPage onBack={() => {}} isDashboardView />} />
            <Route path="/impact" element={<SocialImpactPage onBack={() => {}} isDashboardView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {currentView === 'landing' && (
        <LandingPage 
          onGetStarted={() => setCurrentView('login')} 
          onShowAbout={() => setCurrentView('about')} 
          onShowFeatures={() => setCurrentView('features')}
          onShowImpact={() => setCurrentView('impact')}
        />
      )}
      {currentView === 'about' && (
        <AboutPage onBack={() => setCurrentView('landing')} />
      )}
      {currentView === 'features' && (
        <FeaturesPage onBack={() => setCurrentView('landing')} />
      )}
      {currentView === 'impact' && (
        <SocialImpactPage onBack={() => setCurrentView('landing')} />
      )}
      {currentView === 'login' && (
        <Login 
          onLogin={handleLogin} 
          onBack={() => setCurrentView('landing')} 
          onToggleRegister={() => setCurrentView('register')} 
        />
      )}
      {currentView === 'register' && (
        <Register 
          onBack={() => setCurrentView('landing')} 
          onToggleLogin={() => setCurrentView('login')} 
        />
      )}
    </div>
  );
};

export default App;