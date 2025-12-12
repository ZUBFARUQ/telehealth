import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface VoiceInputProps {
  onResult: (text: string) => void;
  className?: string;
  placeholder?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onResult, className = '', placeholder }) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Check browser support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      
      // Set language based on context
      recog.lang = language === 'ha' ? 'ha-NG' : 'en-US';

      recog.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recog.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
        setIsListening(false);
      };

      recog.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setError('Error');
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      setRecognition(recog);
    } else {
      setError('Not Supported');
    }
  }, [language, onResult]);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  if (error === 'Not Supported') return null;

  return (
    <button
      onClick={toggleListening}
      type="button" // Prevent form submission
      title="Voice Input"
      className={`relative p-3 rounded-full transition-all ${
        isListening 
          ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200' 
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300'
      } ${className}`}
    >
      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      
      {/* Visual Indicator for Low Literacy */}
      {isListening && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      )}
    </button>
  );
};

export default VoiceInput;