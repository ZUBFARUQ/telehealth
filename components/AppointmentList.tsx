import React from 'react';
import { Appointment } from '../types';
import { Calendar, Clock, Video, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface AppointmentListProps {
  appointments: Appointment[];
  startCall: (appointment: Appointment) => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ appointments, startCall }) => {
  const { t } = useLanguage();
  const sorted = [...appointments].sort((a, b) => b.date.getTime() - a.date.getTime());

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'upcoming': return t('appointments.upcoming');
      case 'completed': return t('appointments.completed');
      case 'cancelled': return t('appointments.cancelled');
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">{t('appointments.title')}</h2>
      
      <div className="space-y-4">
        {sorted.map((apt) => {
          const isUpcoming = apt.status === 'upcoming';
          return (
            <div key={apt.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-start md:items-center">
               <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-blue-600 font-bold text-lg">
                    {apt.date.getDate()}
                  </span>
               </div>
               
               <div className="flex-1">
                  <div className="flex justify-between items-start">
                     <h3 className="font-bold text-lg text-slate-900">{apt.doctorName}</h3>
                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isUpcoming ? 'bg-blue-100 text-blue-700' : 
                        apt.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                     }`}>
                        {getStatusLabel(apt.status)}
                     </span>
                  </div>
                  <p className="text-slate-500">{apt.specialty}</p>
                  
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                     <div className="flex items-center gap-1">
                       <Clock className="w-4 h-4" />
                       {apt.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </div>
                     <div className="flex items-center gap-1">
                       <Calendar className="w-4 h-4" />
                       {apt.date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long' })}
                     </div>
                  </div>
                  {apt.notes && (
                    <div className="mt-3 bg-slate-50 p-3 rounded-lg text-sm text-slate-600 italic">
                       "{apt.notes}"
                    </div>
                  )}
               </div>

               {isUpcoming && (
                 <button 
                   onClick={() => startCall(apt)}
                   className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                 >
                   <Video className="w-4 h-4" />
                   {t('appointments.join')}
                 </button>
               )}
            </div>
          );
        })}
        
        {sorted.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-100 border-dashed">
            <p className="text-slate-400">{t('appointments.no_history')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentList;