import React from 'react';
import { ViewState, Appointment, UserRole } from '../types';
import { Calendar, Clock, Video, Activity, Heart, Thermometer, MessageSquareText, Stethoscope, Users, FileText, Star, Server, ShieldCheck, Bed, Box } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface DashboardProps {
  appointments: Appointment[];
  setView: (view: ViewState) => void;
  startCall: (appointment: Appointment) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ appointments, setView, startCall }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  if (!user) return null;

  // Render content based on Role
  const renderPatientDashboard = () => {
    const upcomingAppointments = appointments
      .filter(a => a.status === 'upcoming')
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    const nextAppointment = upcomingAppointments[0];

    return (
      <>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg shadow-blue-200">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-400/30 p-2 rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{t('dashboard.today')}</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">72 bpm</h3>
            <p className="text-blue-100 text-sm">{t('dashboard.heart_rate')}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-teal-100 p-2 rounded-lg">
                <Activity className="w-6 h-6 text-teal-600" />
              </div>
              <span className="text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-500">{t('dashboard.normal')}</span>
            </div>
            <h3 className="text-3xl font-bold mb-1 text-slate-800">120/80</h3>
            <p className="text-slate-500 text-sm">{t('dashboard.blood_pressure')}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Thermometer className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-500">{t('dashboard.morning')}</span>
            </div>
            <h3 className="text-3xl font-bold mb-1 text-slate-800">98.6°F</h3>
            <p className="text-slate-500 text-sm">{t('dashboard.body_temp')}</p>
          </div>
        </div>

        {/* Next Appointment Hero */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">{t('dashboard.next_appointment')}</h3>
            {nextAppointment && (
               <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                  {t('dashboard.confirmed')}
               </span>
            )}
          </div>
          
          {nextAppointment ? (
            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                 <img 
                   src={nextAppointment.doctorImage} 
                   alt={nextAppointment.doctorName}
                   className="w-16 h-16 rounded-full object-cover ring-2 ring-slate-100"
                 />
                 <div>
                   <h4 className="font-bold text-lg text-slate-900">{nextAppointment.doctorName}</h4>
                   <p className="text-slate-500">{nextAppointment.specialty}</p>
                   <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                     <div className="flex items-center gap-1">
                       <Calendar className="w-4 h-4" />
                       {nextAppointment.date.toLocaleDateString()}
                     </div>
                     <div className="flex items-center gap-1">
                       <Clock className="w-4 h-4" />
                       {nextAppointment.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </div>
                   </div>
                 </div>
              </div>
              
              <button 
                onClick={() => startCall(nextAppointment)}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg w-full md:w-auto"
              >
                <Video className="w-5 h-5" />
                {t('dashboard.join_video')}
              </button>
            </div>
          ) : (
            <div className="p-12 text-center">
               <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-slate-400" />
               </div>
               <p className="text-slate-500 mb-4">{t('dashboard.no_appointments')}</p>
               <button 
                 onClick={() => setView('doctors')}
                 className="text-blue-600 font-medium hover:text-blue-700 hover:underline"
               >
                 {t('dashboard.find_doctor_link')}
               </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 text-white shadow-md relative overflow-hidden group cursor-pointer transition-transform hover:-translate-y-1" onClick={() => setView('ai-triage')}>
              <div className="relative z-10">
                <h3 className="font-bold text-xl mb-2">{t('dashboard.quick_triage_title')}</h3>
                <p className="text-teal-50 mb-4">{t('dashboard.quick_triage_desc')}</p>
                <span className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg font-medium text-sm inline-flex items-center gap-2">
                   {t('dashboard.quick_triage_btn')} <MessageSquareText className="w-4 h-4" />
                </span>
              </div>
              <MessageSquareText className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform" />
            </div>

            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-md relative overflow-hidden group cursor-pointer transition-transform hover:-translate-y-1" onClick={() => setView('doctors')}>
              <div className="relative z-10">
                <h3 className="font-bold text-xl mb-2">{t('dashboard.quick_doc_title')}</h3>
                <p className="text-indigo-50 mb-4">{t('dashboard.quick_doc_desc')}</p>
                <span className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg font-medium text-sm inline-flex items-center gap-2">
                   {t('dashboard.quick_doc_btn')} <Stethoscope className="w-4 h-4" />
                </span>
              </div>
               <Stethoscope className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform" />
            </div>
        </div>
      </>
    );
  };

  const renderDoctorDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-100 p-2 rounded-lg"><Users className="w-6 h-6 text-emerald-600" /></div>
              <span className="text-emerald-600 font-bold text-lg">12</span>
           </div>
           <p className="text-slate-500 text-sm">{t('dashboard.patients_seen')}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-2 rounded-lg"><FileText className="w-6 h-6 text-blue-600" /></div>
              <span className="text-blue-600 font-bold text-lg">5</span>
           </div>
           <p className="text-slate-500 text-sm">{t('dashboard.pending_reports')}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-2 rounded-lg"><Star className="w-6 h-6 text-yellow-600" /></div>
              <span className="text-yellow-600 font-bold text-lg">4.9</span>
           </div>
           <p className="text-slate-500 text-sm">{t('dashboard.rating')}</p>
        </div>
        {/* Placeholder for Schedule/Next Patient for Doctor */}
        <div className="col-span-full bg-white p-6 rounded-xl border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Upcoming Schedule</h3>
            <div className="text-center py-10 text-slate-500 italic">No pending appointments for the rest of the day.</div>
        </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <div className="flex items-center justify-between mb-4">
              <div className="bg-indigo-100 p-2 rounded-lg"><Users className="w-6 h-6 text-indigo-600" /></div>
              <span className="text-indigo-600 font-bold text-lg">1,204</span>
           </div>
           <p className="text-slate-500 text-sm">{t('dashboard.total_users')}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <div className="flex items-center justify-between mb-4">
              <div className="bg-violet-100 p-2 rounded-lg"><Stethoscope className="w-6 h-6 text-violet-600" /></div>
              <span className="text-violet-600 font-bold text-lg">48</span>
           </div>
           <p className="text-slate-500 text-sm">{t('dashboard.active_doctors')}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-2 rounded-lg"><Server className="w-6 h-6 text-green-600" /></div>
              <span className="text-green-600 font-bold text-lg">99.9%</span>
           </div>
           <p className="text-slate-500 text-sm">{t('dashboard.system_health')}</p>
        </div>
         <div className="col-span-full bg-slate-800 text-white p-6 rounded-xl border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <h3 className="font-bold">Security Audit Log</h3>
            </div>
            <div className="space-y-2 text-sm text-slate-300 font-mono">
                <p>10:42 AM - New user registration verified</p>
                <p>10:15 AM - Backup completed successfully</p>
                <p>09:30 AM - System update patch v2.4 installed</p>
            </div>
        </div>
    </div>
  );

  const renderFacilityDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <div className="flex items-center justify-between mb-4">
              <div className="bg-red-100 p-2 rounded-lg"><Bed className="w-6 h-6 text-red-600" /></div>
              <span className="text-red-600 font-bold text-lg">85%</span>
           </div>
           <p className="text-slate-500 text-sm">{t('dashboard.bed_occupancy')}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <div className="flex items-center justify-between mb-4">
              <div className="bg-cyan-100 p-2 rounded-lg"><Box className="w-6 h-6 text-cyan-600" /></div>
              <span className="text-cyan-600 font-bold text-lg">Good</span>
           </div>
           <p className="text-slate-500 text-sm">{t('dashboard.equipment_status')}</p>
        </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">{t('dashboard.greeting', { name: user.name })}</h2>
        <p className="text-slate-500">{t('dashboard.subtitle')}</p>
      </header>
      
      {user.role === UserRole.PATIENT && renderPatientDashboard()}
      {user.role === UserRole.DOCTOR && renderDoctorDashboard()}
      {user.role === UserRole.ADMIN && renderAdminDashboard()}
      {user.role === UserRole.FACILITY_MANAGER && renderFacilityDashboard()}
    </div>
  );
};

export default Dashboard;