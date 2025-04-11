
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from '@/contexts/NavigationContext';
import CameraView from '@/components/CameraView';
import StatusBar from '@/components/StatusBar';
import VoiceTranscript from '@/components/VoiceTranscript';
import { X, MapPin, Compass } from 'lucide-react';

const Navigation: React.FC = () => {
  const { mode, stopNavigation, speak } = useNavigation();
  const navigate = useNavigate();
  
  // Redirect to home if not in navigation mode
  useEffect(() => {
    if (mode !== 'navigating') {
      navigate('/');
    } else {
      // Initial guidance when navigation starts
      speak('Navigation started. I will guide you through your surroundings. Hold your phone up in front of you.');
    }
  }, [mode, navigate, speak]);
  
  const handleStopNavigation = () => {
    stopNavigation();
    navigate('/');
  };
  
  if (mode !== 'navigating') {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col relative">
      <StatusBar />
      
      {/* Camera View */}
      <div className="flex-1 relative">
        <CameraView className="absolute inset-0" />
        
        {/* Navigation Overlay */}
        <div className="absolute inset-0 pointer-events-none flex flex-col">
          {/* Directional guidance indicator */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative">
              <Compass size={120} className="text-primary opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-20 bg-primary rounded animate-pulse transform -rotate-45" />
              </div>
            </div>
          </div>
          
          {/* Distance indicator */}
          <div className="text-center p-6 pointer-events-auto">
            <div className="inline-flex items-center bg-secondary/80 backdrop-blur-sm px-4 py-3 rounded-full mb-16">
              <MapPin className="mr-2 text-primary" size={24} />
              <span className="text-xl font-semibold">5 meters ahead</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stop Navigation Button */}
      <div className="absolute top-20 right-4 z-50">
        <button 
          onClick={handleStopNavigation}
          className="bg-destructive/90 text-white p-3 rounded-full"
          aria-label="Stop navigation"
        >
          <X size={24} />
        </button>
      </div>
      
      <VoiceTranscript />
    </div>
  );
};

export default Navigation;
