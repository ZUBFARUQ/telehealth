import React from 'react';
import { Activity, Shield, Video, Sparkles, ArrowRight, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const { t, setLanguage, language } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2 text-blue-600">
          <Activity className="w-8 h-8" />
          <span className="text-xl font-bold text-slate-900">TeleHealth+</span>
        </div>
        <div className="flex items-center gap-4">
           {/* Simple Language Toggle */}
           <button 
             onClick={() => setLanguage(language === 'en' ? 'ha' : 'en')}
             className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
           >
             {language === 'en' ? 'Hausa' : 'English'}
           </button>

           <button 
             onClick={onGetStarted}
             className="text-slate-600 hover:text-blue-600 font-medium transition-colors hidden sm:block"
           >
             {t('landing.login')}
           </button>
           <button 
             onClick={onGetStarted}
             className="bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors font-medium shadow-md shadow-blue-200"
           >
             {t('landing.get_started')}
           </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-6 py-12 md:py-20 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-8 animate-fade-in-up">
           <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold border border-blue-100">
              <Sparkles className="w-4 h-4" />
              <span>{t('landing.new_feature')}</span>
           </div>
           <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight">
             {t('landing.hero_title')}
           </h1>
           <p className="text-xl text-slate-500 max-w-lg leading-relaxed">
             {t('landing.hero_subtitle')}
           </p>
           <div className="flex flex-col sm:flex-row gap-4 pt-4">
             <button 
               onClick={onGetStarted}
               className="bg-blue-600 text-white px-8 py-4 rounded-full hover:bg-blue-700 transition-all text-lg font-semibold shadow-xl shadow-blue-200 flex items-center justify-center gap-2 group"
             >
               {t('landing.get_started')}
               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </button>
           </div>
           
           <div className="flex items-center gap-6 pt-8 text-sm text-slate-500">
              <div className="flex -space-x-3">
                 <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80" alt="User" />
                 <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64&q=80" alt="User" />
                 <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64&q=80" alt="User" />
                 <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center font-bold text-slate-600">+2k</div>
              </div>
              <p>Trusted by patients worldwide</p>
           </div>
        </div>
        
        <div className="flex-1 relative animate-fade-in w-full">
           <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-teal-100 rounded-full blur-3xl opacity-50"></div>
           <img 
             src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
             alt="Doctor with tablet" 
             className="relative rounded-3xl shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500 w-full object-cover"
           />
           
           {/* Floating Cards */}
           <div className="absolute top-10 -left-6 bg-white p-4 rounded-xl shadow-lg border border-slate-100 animate-bounce delay-100 hidden md:block">
              <div className="flex items-center gap-3">
                 <div className="bg-red-100 p-2 rounded-lg">
                    <Heart className="w-5 h-5 text-red-600" />
                 </div>
                 <div>
                    <p className="text-xs text-slate-500">Heart Rate</p>
                    <p className="font-bold text-slate-800">72 bpm</p>
                 </div>
              </div>
           </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="bg-white py-20 px-6">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow group">
                  <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <Sparkles className="w-7 h-7 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{t('landing.features_ai_title')}</h3>
                  <p className="text-slate-500 leading-relaxed">{t('landing.features_ai_desc')}</p>
               </div>
               
               <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow group">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <Video className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{t('landing.features_video_title')}</h3>
                  <p className="text-slate-500 leading-relaxed">{t('landing.features_video_desc')}</p>
               </div>
               
               <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow group">
                  <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <Shield className="w-7 h-7 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{t('landing.features_network_title')}</h3>
                  <p className="text-slate-500 leading-relaxed">{t('landing.features_network_desc')}</p>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-2 text-white">
              <Activity className="w-6 h-6" />
              <span className="text-lg font-bold">TeleHealth+</span>
            </div>
            <p className="text-sm">{t('landing.footer_copyright')}</p>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;