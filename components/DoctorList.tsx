import React, { useState, useEffect } from 'react';
import { Doctor, Specialty } from '../types';
import { MOCK_DOCTORS } from '../services/mockData';
import { Search, Star, Filter, CalendarCheck, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import VoiceInput from './VoiceInput';

interface DoctorListProps {
  onBook: (doctor: Doctor) => void;
  initialSpecialty?: string | null;
}

const DoctorList: React.FC<DoctorListProps> = ({ onBook, initialSpecialty }) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | 'All'>('All');

  useEffect(() => {
    if (initialSpecialty) {
      // Check if the string matches one of our enum values
      const matchingSpecialty = Object.values(Specialty).find(
        s => s.toLowerCase() === initialSpecialty.toLowerCase()
      );
      if (matchingSpecialty) {
        setSelectedSpecialty(matchingSpecialty);
      }
    }
  }, [initialSpecialty]);

  const filteredDoctors = MOCK_DOCTORS.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
         <div className="relative flex-1 flex gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                type="text"
                placeholder={t('doctors.search_placeholder')}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <VoiceInput onResult={setSearchTerm} />
         </div>
         
         <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <Filter className="w-5 h-5 text-slate-500" />
            <select 
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none min-w-[140px]"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value as Specialty | 'All')}
            >
               <option value="All">{t('doctors.all_specialties')}</option>
               {Object.values(Specialty).map(s => (
                 <option key={s} value={s}>{s}</option>
               ))}
            </select>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6">
             <img 
               src={doctor.imageUrl} 
               alt={doctor.name} 
               className="w-24 h-24 rounded-xl object-cover"
             />
             <div className="flex-1">
               <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{doctor.name}</h3>
                    <p className="text-blue-600 font-medium text-sm mb-1">{doctor.specialty}</p>
                  </div>
                  <div className="flex items-center bg-yellow-50 px-2 py-1 rounded text-yellow-700 text-sm font-medium">
                     <Star className="w-3 h-3 fill-current mr-1" />
                     {doctor.rating}
                  </div>
               </div>
               
               <p className="text-slate-500 text-sm mb-4 line-clamp-2">{doctor.bio}</p>
               
               <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {t('doctors.tele_health')}
                  </span>
                  <span>•</span>
                  <span>{doctor.reviews} {t('doctors.reviews')}</span>
                  <span>•</span>
                  <span className="font-semibold text-slate-900">${doctor.price}/hr</span>
               </div>

               <button 
                 onClick={() => onBook(doctor)}
                 disabled={!doctor.available}
                 className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors focus:ring-4 focus:ring-blue-200 ${
                    doctor.available 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                 }`}
               >
                 <CalendarCheck className="w-4 h-4" />
                 {doctor.available ? t('doctors.book') : t('doctors.unavailable')}
               </button>
             </div>
          </div>
        ))}

        {filteredDoctors.length === 0 && (
          <div className="col-span-full text-center py-12">
             <p className="text-slate-500">{t('doctors.no_results')}</p>
             <button 
               onClick={() => {setSearchTerm(''); setSelectedSpecialty('All');}}
               className="mt-2 text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
             >
               {t('doctors.clear')}
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorList;