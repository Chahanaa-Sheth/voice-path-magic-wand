
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigation } from '@/contexts/NavigationContext';
import StatusBar from '@/components/StatusBar';
import VoiceTranscript from '@/components/VoiceTranscript';
import { ArrowLeft, Phone, HelpCircle, Info } from 'lucide-react';

const Help: React.FC = () => {
  const { speak } = useNavigation();
  
  // Speak help instructions when component mounts
  useEffect(() => {
    const helpInstructions = 'Help page. Here are the available voice commands: Start Navigation, Stop Navigation, Help, Record Route, Training Mode, and Emergency Call.';
    speak(helpInstructions);
  }, [speak]);
  
  const handleEmergencyCall = () => {
    speak('Initiating emergency call');
    setTimeout(() => {
      window.location.href = 'tel:911';
    }, 2000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <StatusBar />
      
      <header className="pt-16 pb-6 px-4">
        <div className="flex items-center mb-4">
          <Link to="/" className="p-2 mr-2" aria-label="Back to home">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold flex items-center">
            <HelpCircle className="mr-2" /> Help & Support
          </h1>
        </div>
      </header>
      
      <main className="flex-1 px-4 pb-24">
        <section className="mb-8" aria-labelledby="voice-commands">
          <h2 id="voice-commands" className="text-xl font-semibold mb-4 flex items-center">
            <Info className="mr-2 text-primary" /> Voice Commands
          </h2>
          <ul className="space-y-4">
            {[
              'Say "Hey PathSense" to activate voice recognition',
              'Say "Start Navigation" to begin guided navigation',
              'Say "Stop Navigation" to end navigation mode',
              'Say "Help" for assistance',
              'Say "Record Route" to mark a new path',
              'Say "Training Mode" to practice using the app',
              'Say "Emergency" to call for help'
            ].map((command, index) => (
              <li key={index} className="p-4 bg-secondary rounded-lg">
                {command}
              </li>
            ))}
          </ul>
        </section>
        
        <section className="mb-8" aria-labelledby="emergency">
          <h2 id="emergency" className="text-xl font-semibold mb-4 flex items-center">
            <Phone className="mr-2 text-destructive" /> Emergency Assistance
          </h2>
          <button 
            onClick={handleEmergencyCall}
            className="w-full p-4 bg-destructive text-white rounded-lg font-bold text-lg flex items-center justify-center"
            aria-label="Call emergency services"
          >
            <Phone className="mr-2" /> Emergency Call
          </button>
          <p className="mt-2 text-sm text-muted-foreground">
            Initiates a call to emergency services (911)
          </p>
        </section>
        
        <section aria-labelledby="about">
          <h2 id="about" className="text-xl font-semibold mb-4">About PathSense</h2>
          <div className="p-4 bg-secondary rounded-lg">
            <p className="mb-2">
              PathSense is a navigation assistant designed specifically for visually impaired users.
            </p>
            <p>
              Version 1.0.0 | Built for accessibility
            </p>
          </div>
        </section>
      </main>
      
      <VoiceTranscript />
    </div>
  );
};

export default Help;
