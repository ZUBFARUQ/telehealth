import React, { useState } from 'react';
import { Eye, Type, ZoomIn, ZoomOut, Volume2, VolumeX, Accessibility, X } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';

const AccessibilityWidget: React.FC = () => {
  const { 
    fontSizeLevel, 
    setFontSizeLevel, 
    highContrast, 
    toggleHighContrast,
    isSpeaking,
    stopSpeaking
  } = useAccessibility();
  
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-2">
      {isOpen && (
        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-4 mb-2 animate-scale-in w-64 origin-bottom-right">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Accessibility className="w-5 h-5 text-blue-600" />
                    Accessibility
                </h3>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-4">
                {/* Font Size Control */}
                <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Text Size</label>
                    <div className="flex bg-slate-100 rounded-lg p-1">
                        <button 
                            onClick={() => setFontSizeLevel(0)}
                            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${fontSizeLevel === 0 ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
                        >
                            <span className="text-xs">A</span>
                        </button>
                        <button 
                            onClick={() => setFontSizeLevel(1)}
                            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${fontSizeLevel === 1 ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
                        >
                            <span className="text-base">A</span>
                        </button>
                        <button 
                            onClick={() => setFontSizeLevel(2)}
                            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${fontSizeLevel === 2 ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
                        >
                            <span className="text-xl">A</span>
                        </button>
                    </div>
                </div>

                {/* Contrast Toggle */}
                <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Display</label>
                    <button 
                        onClick={toggleHighContrast}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all font-medium ${
                            highContrast 
                            ? 'bg-black text-yellow-300 border-yellow-300' 
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <Eye className="w-5 h-5" />
                            High Contrast
                        </span>
                        <div className={`w-10 h-5 rounded-full relative transition-colors ${highContrast ? 'bg-yellow-300' : 'bg-slate-300'}`}>
                            <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${highContrast ? 'left-6 bg-black' : 'left-1 bg-white'}`} />
                        </div>
                    </button>
                </div>

                {/* TTS Control */}
                {isSpeaking && (
                    <div>
                         <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Audio</label>
                         <button 
                            onClick={stopSpeaking}
                            className="w-full bg-red-100 text-red-700 p-2 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-red-200 transition-colors"
                         >
                            <VolumeX className="w-5 h-5" />
                            Stop Reading
                         </button>
                    </div>
                )}
            </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-105"
        title="Accessibility Settings"
        aria-label="Open Accessibility Menu"
      >
        <Accessibility className="w-8 h-8" />
      </button>
    </div>
  );
};

export default AccessibilityWidget;