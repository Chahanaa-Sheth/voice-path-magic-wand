
import React, { useEffect } from 'react';
import { useNavigation } from '@/contexts/NavigationContext';
import VoiceButton from '@/components/VoiceButton';
import StatusBar from '@/components/StatusBar';
import VoiceTranscript from '@/components/VoiceTranscript';
import { Mic, Book, MapPin, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index: React.FC = () => {
  const { startNavigation, startTraining, startRecording, speak } = useNavigation();
  
  // Announce the app on initial load
  useEffect(() => {
    const welcomeMessage = 'Welcome to PathSense, your navigation assistant. Tap anywhere or say Hey PathSense to get started.';
    const timer = setTimeout(() => {
      speak(welcomeMessage);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [speak]);
  
  return (
    <main className="min-h-screen flex flex-col">
      <StatusBar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <h1 className="sr-only">PathSense Navigation Assistant</h1>
        
        <div className="mb-8 text-center" aria-live="polite">
          <h2 className="text-3xl font-bold mb-2">PathSense</h2>
          <p className="text-xl text-muted-foreground">Navigation Assistant</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl">
          <VoiceButton 
            label="Start Navigation" 
            action={startNavigation} 
            icon={<Mic size={48} className="text-primary" />}
            className="bg-secondary/50 hover:bg-secondary"
          />
          
          <VoiceButton 
            label="Training Mode" 
            action={startTraining}
            icon={<Book size={48} className="text-primary" />}
            className="bg-secondary/50 hover:bg-secondary"
          />
          
          <VoiceButton 
            label="Record Route" 
            action={startRecording}
            icon={<MapPin size={48} className="text-primary" />}
            className="bg-secondary/50 hover:bg-secondary"
          />
          
          <Link to="/help" className="block">
            <VoiceButton 
              label="Help" 
              action={() => {}}
              icon={<HelpCircle size={48} className="text-primary" />}
              className="bg-secondary/50 hover:bg-secondary w-full h-full"
            />
          </Link>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">Tap anywhere or say "Hey PathSense" to activate voice commands</p>
        </div>
      </div>
      
      <VoiceTranscript />
    </main>
  );
};

export default Index;
