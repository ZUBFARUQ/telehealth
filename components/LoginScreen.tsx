import React, { useState } from 'react';
import { UserRole } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { User, Stethoscope, ShieldCheck, Building2, Mail, Phone, Lock, ArrowLeft, Loader2, Chrome } from 'lucide-react';

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const roles = [
    { 
      id: UserRole.PATIENT, 
      label: t('login.patient'), 
      desc: t('login.patient_desc'),
      icon: User,
      color: 'bg-blue-600',
      lightColor: 'bg-blue-50 text-blue-600'
    },
    { 
      id: UserRole.DOCTOR, 
      label: t('login.doctor'), 
      desc: t('login.doctor_desc'),
      icon: Stethoscope,
      color: 'bg-emerald-600',
      lightColor: 'bg-emerald-50 text-emerald-600'
    },
    { 
      id: UserRole.ADMIN, 
      label: t('login.admin'), 
      desc: t('login.admin_desc'),
      icon: ShieldCheck,
      color: 'bg-slate-800',
      lightColor: 'bg-slate-50 text-slate-800'
    },
    { 
      id: UserRole.FACILITY_MANAGER, 
      label: t('login.facility'), 
      desc: t('login.facility_desc'),
      icon: Building2,
      color: 'bg-orange-600',
      lightColor: 'bg-orange-50 text-orange-600'
    }
  ];

  if (selectedRole) {
    return (
      <LoginForm 
        role={selectedRole} 
        onBack={() => setSelectedRole(null)} 
        onLogin={() => login(selectedRole)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t('login.title')}</h1>
          <p className="text-slate-500 max-w-lg mx-auto">{t('login.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left group flex flex-col h-full animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-xl ${role.lightColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{role.label}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{role.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface LoginFormProps {
  role: UserRole;
  onBack: () => void;
  onLogin: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ role, onBack, onLogin }) => {
  const { t } = useLanguage();
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [isLoading, setIsLoading] = useState(false);

  // Mock Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  const getRoleLabel = () => {
     switch(role) {
        case UserRole.PATIENT: return t('login.patient');
        case UserRole.DOCTOR: return t('login.doctor');
        case UserRole.ADMIN: return t('login.admin');
        case UserRole.FACILITY_MANAGER: return t('login.facility');
        default: return role;
     }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
       <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in border border-slate-100">
          <div className="p-8">
             <button 
               onClick={onBack}
               className="flex items-center text-slate-400 hover:text-slate-600 transition-colors mb-6 text-sm font-medium"
             >
                <ArrowLeft className="w-4 h-4 mr-1" />
                {t('login.back')}
             </button>

             <h2 className="text-2xl font-bold text-slate-900 mb-2">
               {t('login.welcome_role', { role: getRoleLabel() })}
             </h2>
             <p className="text-slate-500 mb-8">{t('login.login_subtitle')}</p>

             {/* OAuth Buttons */}
             <div className="space-y-3 mb-6">
                <button 
                  onClick={handleSubmit} 
                  className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm"
                >
                   <Chrome className="w-5 h-5 text-red-500" /> 
                   {t('login.sign_in_google')}
                </button>
                <button 
                  onClick={handleSubmit}
                  className="w-full flex items-center justify-center gap-3 bg-black text-white py-2.5 rounded-lg hover:bg-gray-900 transition-colors font-medium text-sm"
                >
                   {/* Using SVG for Apple icon simulation */}
                   <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.64 4.07-1.48 1.4.15 2.53.95 3.22 1.94-.03.04-1.95 1.13-2.01 4.35-.06 3.09 2.58 4.35 2.66 4.41-2.18 3.86-3.86 4.96-5.02 6.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.16 2.29-2.03 4.34-3.74 4.25z"/></svg>
                   {t('login.sign_in_apple')}
                </button>
             </div>

             <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                   <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                   <span className="bg-white px-2 text-slate-400 font-medium tracking-wider">{t('login.or_continue')}</span>
                </div>
             </div>

             {/* Toggle Auth Method */}
             <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
                <button 
                  onClick={() => setAuthMethod('email')}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${authMethod === 'email' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                   {t('login.email_tab')}
                </button>
                <button 
                  onClick={() => setAuthMethod('phone')}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${authMethod === 'phone' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                   {t('login.phone_tab')}
                </button>
             </div>

             <form onSubmit={handleSubmit} className="space-y-4">
                {authMethod === 'email' ? (
                   <>
                     <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">{t('login.email_label')}</label>
                        <div className="relative">
                           <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                           <input 
                             type="email" 
                             required
                             placeholder={t('login.email_placeholder')}
                             className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                             value={email}
                             onChange={(e) => setEmail(e.target.value)}
                           />
                        </div>
                     </div>
                     <div>
                        <div className="flex justify-between items-center mb-1">
                           <label className="block text-xs font-semibold text-slate-700">{t('login.password_label')}</label>
                           <button type="button" className="text-xs text-blue-600 hover:underline">{t('login.forgot_password')}</button>
                        </div>
                        <div className="relative">
                           <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                           <input 
                             type="password" 
                             required
                             placeholder={t('login.password_placeholder')}
                             className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                             value={password}
                             onChange={(e) => setPassword(e.target.value)}
                           />
                        </div>
                     </div>
                   </>
                ) : (
                   <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{t('login.phone_label')}</label>
                      <div className="relative">
                         <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                         <input 
                           type="tel" 
                           required
                           placeholder={t('login.phone_placeholder')}
                           className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                           value={phone}
                           onChange={(e) => setPhone(e.target.value)}
                         />
                      </div>
                      <p className="text-xs text-slate-400 mt-2">We will send a code to your phone to verify your account.</p>
                   </div>
                )}

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                >
                  {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {isLoading ? t('login.processing') : t('login.login_btn')}
                </button>
             </form>
          </div>
       </div>
    </div>
  );
};

export default LoginScreen;