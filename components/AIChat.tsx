import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, ArrowRight, Volume2 } from 'lucide-react';
import { ChatMessage, Specialty } from '../types';
import { getTriageResponseStream } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import VoiceInput from './VoiceInput';

interface AIChatProps {
  onFindDoctor: (specialty?: string) => void;
}

const AIChat: React.FC<AIChatProps> = ({ onFindDoctor }) => {
  const { t, language } = useLanguage();
  const { speak } = useAccessibility();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize greeting on language change or first load if empty
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'model',
          text: t('ai.initial'),
          timestamp: new Date()
        }
      ]);
    }
  }, [t, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Create a placeholder for the model response
      const modelMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: modelMsgId,
        role: 'model',
        text: '',
        timestamp: new Date()
      }]);

      const stream = getTriageResponseStream(messages, userMsg.text, language);
      let fullText = '';

      for await (const chunk of stream) {
        fullText += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === modelMsgId ? { ...msg, text: fullText } : msg
        ));
      }
      
      // Optional: Automatically read out the response for accessibility
      // speak(fullText);

    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceResult = (text: string) => {
    setInput(text);
    // Optional: auto send?
    // handleSend(); 
  };

  const findSpecialtyInText = (text: string): string | undefined => {
    const specialties = Object.values(Specialty);
    return specialties.find(s => text.toLowerCase().includes(s.toLowerCase()));
  };

  const lastMessage = messages[messages.length - 1];
  const detectedSpecialty = lastMessage?.role === 'model' && !isLoading 
    ? findSpecialtyInText(lastMessage.text) 
    : null;

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-teal-100 p-2 rounded-full">
             <Bot className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">{t('ai.title')}</h3>
            <p className="text-xs text-slate-500">{t('ai.subtitle')}</p>
          </div>
        </div>
        <button 
          onClick={() => onFindDoctor()}
          className="text-xs font-medium bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors"
        >
          {t('ai.browse')}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[90%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-blue-600' : 'bg-teal-600'}`}>
                  {isUser ? <User className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4 text-white" />}
                </div>
                
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm relative group ${
                  isUser 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-[10px] opacity-70 ${isUser ? 'text-blue-100' : 'text-slate-400'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    
                    {/* Speak Button for Accessibility */}
                    <button 
                      onClick={() => speak(msg.text)}
                      className={`p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 ${isUser ? 'hover:bg-blue-500' : 'hover:bg-slate-100'}`}
                      title="Read Aloud"
                      aria-label="Read message aloud"
                    >
                      <Volume2 className={`w-3 h-3 ${isUser ? 'text-white' : 'text-slate-500'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex justify-start">
             <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center shrink-0">
                   <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                   <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                   <span className="text-sm text-slate-500">{t('ai.thinking')}</span>
                </div>
             </div>
          </div>
        )}
        
        {/* Suggestion Action Button */}
        {detectedSpecialty && !isLoading && (
           <div className="flex justify-center animate-fade-in mt-2">
              <button 
                onClick={() => onFindDoctor(detectedSpecialty)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm font-medium focus:ring-4 focus:ring-blue-200"
              >
                {t('ai.find_btn', { specialty: detectedSpecialty })}
                <ArrowRight className="w-4 h-4" />
              </button>
           </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex items-end gap-2 relative">
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('ai.placeholder')}
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none max-h-32 min-h-[50px] scrollbar-hide"
              rows={1}
            />
          </div>
          
          <VoiceInput onResult={handleVoiceResult} className="mb-1" />

          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="mb-1 p-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            aria-label="Send Message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-2">
          {t('ai.disclaimer')}
        </p>
      </div>
    </div>
  );
};

export default AIChat;