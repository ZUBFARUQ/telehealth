import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import DoctorList from './components/DoctorList';
import AppointmentList from './components/AppointmentList';
import AIChat from './components/AIChat';
import VideoConsultation from './components/VideoConsultation';
import BookAppointmentModal from './components/BookAppointmentModal';
import AccessibilityWidget from './components/AccessibilityWidget';
import LoginScreen from './components/LoginScreen';
import LandingPage from './components/LandingPage';
import { ViewState, Appointment, Doctor } from './types';
import { INITIAL_APPOINTMENTS } from './services/mockData';
import { Menu, X, ArrowLeft } from 'lucide-react';
import { LanguageProvider } from './contexts/LanguageContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [currentView, setView] = useState<ViewState>('dashboard');
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [activeCall, setActiveCall] = useState<Appointment | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  
  // Booking State
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);
  
  // AI Navigation State
  const [preselectedSpecialty, setPreselectedSpecialty] = useState<string | null>(null);

  if (!user) {
    if (showLogin) {
      return (
        <>
          <button 
             onClick={() => setShowLogin(false)}
             className="fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-md text-slate-600 hover:text-blue-600 transition-colors border border-slate-200"
             title="Back to Home"
          >
             <ArrowLeft className="w-6 h-6" />
          </button>
          <LoginScreen />
          <AccessibilityWidget />
        </>
      );
    }
    return (
      <>
        <LandingPage onGetStarted={() => setShowLogin(true)} />
        <AccessibilityWidget />
      </>
    );
  }

  const handleInitiateBooking = (doctor: Doctor) => {
    setSelectedDoctorForBooking(doctor);
  };

  const handleConfirmBooking = (date: Date, notes: string) => {
    if (!selectedDoctorForBooking) return;

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      doctorId: selectedDoctorForBooking.id,
      doctorName: selectedDoctorForBooking.name,
      doctorImage: selectedDoctorForBooking.imageUrl,
      specialty: selectedDoctorForBooking.specialty,
      date: date,
      status: 'upcoming',
      notes: notes
    };
    
    setAppointments([...appointments, newAppointment]);
    setNotification(`Appointment booked with ${selectedDoctorForBooking.name}!`);
    setTimeout(() => setNotification(null), 3000);
    
    setSelectedDoctorForBooking(null);
    setView('appointments');
  };

  const startCall = (appointment: Appointment) => {
    setActiveCall(appointment);
  };

  const endCall = () => {
    setActiveCall(null);
  };

  const handleAiSpecialtyNavigation = (specialty?: string) => {
    if (specialty) {
      setPreselectedSpecialty(specialty);
    } else {
      setPreselectedSpecialty(null);
    }
    setView('doctors');
  };

  if (activeCall) {
    return <VideoConsultation appointment={activeCall} onEndCall={endCall} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full z-40 bg-white border-b border-slate-200 p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold text-blue-600">TeleHealth+</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Navigation (Desktop) */}
      <Navigation currentView={currentView} setView={setView} />

      {/* Navigation (Mobile Drawer) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="bg-white w-3/4 h-full pt-16" onClick={e => e.stopPropagation()}>
             <div className="flex flex-col p-4 space-y-4">
                <button onClick={() => { setView('dashboard'); setIsMobileMenuOpen(false); }} className={`p-3 rounded-lg text-left ${currentView === 'dashboard' ? 'bg-blue-50 text-blue-600' : ''}`}>Dashboard</button>
                {/* Simplified Mobile Nav for Demo - Ideally should mirror Navigation.tsx logic */}
             </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 w-full relative">
        <div className="max-w-6xl mx-auto h-full pb-24 md:pb-0">
          {currentView === 'dashboard' && (
            <Dashboard 
              appointments={appointments} 
              setView={setView} 
              startCall={startCall}
            />
          )}
          
          {currentView === 'doctors' && (
            <DoctorList 
              onBook={handleInitiateBooking} 
              initialSpecialty={preselectedSpecialty}
            />
          )}

          {(currentView === 'appointments' || currentView === 'schedule') && (
            <AppointmentList 
              appointments={appointments} 
              startCall={startCall}
            />
          )}

          {currentView === 'ai-triage' && (
            <AIChat onFindDoctor={handleAiSpecialtyNavigation} />
          )}
          
          {/* Placeholder views for new roles */}
          {(currentView === 'users' || currentView === 'analytics' || currentView === 'resources') && (
             <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Menu className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Feature Under Development</h3>
                <p className="text-slate-500 mt-2">This module is part of the premium enterprise package.</p>
             </div>
          )}
        </div>
        
        {/* Floating Accessibility Widget */}
        <AccessibilityWidget />
      </main>

      {/* Booking Modal */}
      <BookAppointmentModal 
        doctor={selectedDoctorForBooking}
        isOpen={!!selectedDoctorForBooking}
        onClose={() => setSelectedDoctorForBooking(null)}
        onConfirm={handleConfirmBooking}
      />

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-4 right-24 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce flex items-center gap-2 z-50">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          {notification}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AccessibilityProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </AccessibilityProvider>
    </LanguageProvider>
  );
}

export default App;