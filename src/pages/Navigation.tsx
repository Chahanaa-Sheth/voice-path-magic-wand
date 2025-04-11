
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from '@/contexts/NavigationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import CameraView from '@/components/CameraView';
import StatusBar from '@/components/StatusBar';
import VoiceTranscript from '@/components/VoiceTranscript';
import { X, MapPin, Compass } from 'lucide-react';

const Navigation: React.FC = () => {
  const { mode, stopNavigation, speak, companion } = useNavigation();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Redirect to home if not in navigation mode
  useEffect(() => {
    if (mode !== 'navigating') {
      navigate('/');
    } else {
      // Initial guidance when navigation starts
      speak(t('obstacleAhead'));
      
      // Start companion mode if available
      if (companion) {
        setTimeout(() => {
          companion.startCompanionMode();
        }, 5000);
      }
    }
    
    return () => {
      // Clean up by stopping companion mode
      if (companion) {
        companion.stopCompanionMode();
      }
    };
  }, [mode, navigate, speak, companion, t]);
  
  const handleStopNavigation = () => {
    stopNavigation();
    navigate('/');
  };
  
  const triggerCompanionMessage = () => {
    if (companion) {
      companion.speakRandomMotivation();
    } else {
      speak(t('keepGoing'));
    }
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
          
          {/* Distance indicator and companion interaction */}
          <div className="text-center p-6 pointer-events-auto">
            <div 
              className="inline-flex items-center bg-secondary/80 backdrop-blur-sm px-4 py-3 rounded-full mb-8"
              onClick={triggerCompanionMessage}
            >
              <MapPin className="mr-2 text-primary" size={24} />
              <span className="text-xl font-semibold">5 meters ahead</span>
            </div>
            
            {/* Companion trigger */}
            <button
              onClick={triggerCompanionMessage}
              className="block w-full mb-8 p-3 bg-primary/20 border border-primary/30 rounded-lg text-center"
              aria-label="Get companion message"
            >
              {t('keepGoing')}
            </button>
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
