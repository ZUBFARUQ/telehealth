import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, FileText, CheckCircle } from 'lucide-react';
import { Doctor } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface BookAppointmentModalProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: Date, notes: string) => void;
}

const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({ doctor, isOpen, onClose, onConfirm }) => {
  const { t } = useLanguage();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  // Handle Escape Key to Close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Reset form when opening
  useEffect(() => {
    if (isOpen) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow.toISOString().split('T')[0]);
      setTime('09:00');
      setNotes('');
    }
  }, [isOpen]);

  if (!isOpen || !doctor) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;
    
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    
    const appointmentDate = new Date(year, month - 1, day, hours, minutes);
    onConfirm(appointmentDate, notes);
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded-full p-1"
            aria-label="Close Modal"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 id="modal-title" className="text-xl font-bold mb-1">{t('booking.title')}</h2>
          <p className="text-blue-100 text-sm">{t('booking.subtitle')}</p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Doctor Info Summary */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
             <img src={doctor.imageUrl} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" aria-hidden="true" />
             <div>
               <h3 className="font-bold text-slate-900">{doctor.name}</h3>
               <p className="text-blue-600 text-sm font-medium">{doctor.specialty}</p>
               <p className="text-slate-500 text-xs mt-0.5">${doctor.price}/hr • Video Consultation</p>
             </div>
          </div>

          <form id="booking-form" onSubmit={handleSubmit} className="space-y-4">
             {/* Date Selection */}
             <div className="space-y-2">
                <label htmlFor="date-input" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                   <Calendar className="w-4 h-4 text-blue-600" aria-hidden="true" />
                   {t('booking.date')}
                </label>
                <input 
                  id="date-input"
                  type="date" 
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700"
                />
             </div>

             {/* Time Selection */}
             <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                   <Clock className="w-4 h-4 text-blue-600" aria-hidden="true" />
                   {t('booking.time')}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2" role="group" aria-label="Select a time slot">
                   {timeSlots.map(slot => (
                     <button
                       key={slot}
                       type="button"
                       onClick={() => setTime(slot)}
                       aria-pressed={time === slot}
                       className={`py-2 px-1 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                         time === slot 
                           ? 'bg-blue-600 text-white shadow-md' 
                           : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                       }`}
                     >
                       {slot}
                     </button>
                   ))}
                </div>
             </div>

             {/* Notes */}
             <div className="space-y-2">
                <label htmlFor="notes-input" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                   <FileText className="w-4 h-4 text-blue-600" aria-hidden="true" />
                   {t('booking.reason')}
                </label>
                <textarea 
                  id="notes-input"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('booking.reason_ph')}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 h-24 resize-none"
                />
             </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white">
          <div className="flex gap-4">
             <button 
               type="button"
               onClick={onClose}
               className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
             >
               {t('booking.cancel')}
             </button>
             <button 
               type="submit"
               form="booking-form"
               disabled={!date || !time}
               className="flex-[2] py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
             >
               {t('booking.confirm')}
               <CheckCircle className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentModal;