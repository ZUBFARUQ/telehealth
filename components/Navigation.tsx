import React from 'react';
import { LayoutDashboard, Stethoscope, Calendar, MessageSquareText, LogOut, Activity, Globe, Users, BarChart3, Building2, ClipboardList } from 'lucide-react';
import { ViewState, UserRole } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const { t, language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();

  const getNavItems = () => {
    const baseItems = [
      { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    ];

    if (!user) return baseItems;

    switch (user.role) {
      case UserRole.PATIENT:
        return [
          ...baseItems,
          { id: 'doctors', label: t('nav.doctors'), icon: Stethoscope },
          { id: 'appointments', label: t('nav.appointments'), icon: Calendar },
          { id: 'ai-triage', label: t('nav.ai_triage'), icon: MessageSquareText },
        ];
      case UserRole.DOCTOR:
        return [
          ...baseItems,
          { id: 'schedule', label: t('nav.schedule'), icon: Calendar },
          { id: 'appointments', label: t('nav.patients'), icon: Users }, // Reusing appointments view for now
        ];
      case UserRole.ADMIN:
        return [
          ...baseItems,
          { id: 'users', label: t('nav.users'), icon: Users },
          { id: 'analytics', label: t('nav.analytics'), icon: BarChart3 },
        ];
      case UserRole.FACILITY_MANAGER:
        return [
          ...baseItems,
          { id: 'resources', label: t('nav.resources'), icon: Building2 },
          { id: 'schedule', label: t('nav.schedule'), icon: ClipboardList },
        ];
      default:
        return baseItems;
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0">
      <div className="p-6 flex items-center space-x-2">
        <div className="bg-blue-600 p-2 rounded-lg" aria-hidden="true">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-slate-800">TeleHealth+</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4" aria-label="Main Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Language Toggle */}
      <div className="px-6 py-2">
        <div className="flex bg-slate-100 p-1 rounded-lg" role="group" aria-label="Language Selection">
          <button 
            onClick={() => setLanguage('en')}
            aria-pressed={language === 'en'}
            className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${language === 'en' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            English
          </button>
          <button 
            onClick={() => setLanguage('ha')}
            aria-pressed={language === 'ha'}
            className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${language === 'ha' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Hausa
          </button>
        </div>
      </div>

      {user && (
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50">
            <img
              src={user.avatar}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.details}</p>
            </div>
            <button 
              onClick={logout}
              className="text-slate-400 hover:text-slate-600 focus:outline-none focus:text-blue-600" 
              title={t('nav.logout')}
              aria-label={t('nav.logout')}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Navigation;