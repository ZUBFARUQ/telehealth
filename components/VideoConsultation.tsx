import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Settings, Users } from 'lucide-react';
import { Appointment } from '../types';

interface VideoConsultationProps {
  appointment: Appointment;
  onEndCall: () => void;
}

const VideoConsultation: React.FC<VideoConsultationProps> = ({ appointment, onEndCall }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startVideo = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };

    startVideo();

    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      clearInterval(timer);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen bg-slate-900 fixed inset-0 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center text-white">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
               <img src={appointment.doctorImage} className="w-full h-full rounded-full object-cover opacity-80" alt="Doctor" />
            </div>
            <div>
               <h3 className="font-semibold">{appointment.doctorName}</h3>
               <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  {formatTime(callDuration)}
               </div>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <Settings className="w-5 h-5 text-slate-400 cursor-pointer hover:text-white" />
         </div>
      </div>

      {/* Main Video Area (Remote Doctor - Simulated with Image/Placeholder) */}
      <div className="flex-1 relative bg-slate-800 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
            {/* Using a large image to simulate the doctor's video feed */}
            <img 
               src={appointment.doctorImage} 
               alt="Remote Doctor" 
               className="w-full h-full object-cover opacity-90 blur-[2px]"
            />
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute text-center z-10">
               <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 mx-auto mb-4 shadow-2xl">
                  <img src={appointment.doctorImage} className="w-full h-full object-cover" alt="Doctor" />
               </div>
               <h2 className="text-2xl font-bold text-white mb-2">{appointment.doctorName}</h2>
               <p className="text-slate-200">Waiting for connection...</p>
            </div>
        </div>

        {/* Local Video (Self View) */}
        <div className="absolute bottom-24 right-4 w-32 md:w-48 aspect-video bg-black rounded-lg overflow-hidden border border-slate-600 shadow-xl">
           {!isVideoOff ? (
              <video 
                ref={localVideoRef} 
                autoPlay 
                muted 
                playsInline 
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
           ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white">
                 <VideoOff className="w-6 h-6" />
              </div>
           )}
           <div className="absolute bottom-2 left-2 text-[10px] bg-black/50 px-2 py-0.5 rounded text-white">
              You
           </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-slate-900 p-6 flex justify-center items-center gap-6">
         <button 
           onClick={() => setIsMuted(!isMuted)}
           className={`p-4 rounded-full transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
         >
           {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
         </button>
         
         <button 
           onClick={() => setIsVideoOff(!isVideoOff)}
           className={`p-4 rounded-full transition-all ${isVideoOff ? 'bg-red-500 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
         >
           {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
         </button>

         <button 
           onClick={onEndCall}
           className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all scale-110 shadow-lg shadow-red-900/50"
         >
           <PhoneOff className="w-6 h-6" />
         </button>

         <button className="p-4 rounded-full bg-slate-700 text-white hover:bg-slate-600 transition-all hidden md:block">
           <MessageSquare className="w-6 h-6" />
         </button>

         <button className="p-4 rounded-full bg-slate-700 text-white hover:bg-slate-600 transition-all hidden md:block">
           <Users className="w-6 h-6" />
         </button>
      </div>
    </div>
  );
};

export default VideoConsultation;