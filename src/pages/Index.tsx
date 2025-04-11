import React, { useEffect } from 'react';
import { useNavigation } from '@/contexts/NavigationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import VoiceButton from '@/components/VoiceButton';
import StatusBar from '@/components/StatusBar';
import VoiceTranscript from '@/components/VoiceTranscript';
import { Mic, Book, MapPin, HelpCircle, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index: React.FC = () => {
  const { startNavigation, startTraining, startRecording, speak } = useNavigation();
  const { t, language } = useLanguage();
  
  // Announce the app on initial load using the current language
  useEffect(() => {
    const timer = setTimeout(() => {
      speak(t('welcome') + ' ' + t('tapAnywhere'), language, true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [speak, t, language]);
  
  return (
    <main className="min-h-screen flex flex-col">
      <StatusBar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <h1 className="sr-only">PathSense Navigation Assistant</h1>
        
        <div className="mb-8 text-center" aria-live="polite">
          <h2 className="text-3xl font-bold mb-2">PathSense</h2>
          <p className="text-xl text-muted-foreground">{t('welcome')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl">
          <VoiceButton 
            label={t('startNavigation')} 
            action={startNavigation} 
            icon={<Mic size={48} className="text-primary" />}
            className="bg-secondary/50 hover:bg-secondary"
          />
          
          <VoiceButton 
            label={t('trainingMode')} 
            action={startTraining}
            icon={<Book size={48} className="text-primary" />}
            className="bg-secondary/50 hover:bg-secondary"
          />
          
          <VoiceButton 
            label={t('recordRoute')} 
            action={startRecording}
            icon={<MapPin size={48} className="text-primary" />}
            className="bg-secondary/50 hover:bg-secondary"
          />
          
          <Link to="/help" className="block">
            <VoiceButton 
              label={t('help')} 
              action={() => {}}
              icon={<HelpCircle size={48} className="text-primary" />}
              className="bg-secondary/50 hover:bg-secondary w-full h-full"
            />
          </Link>
        </div>
        
        <div className="mt-8 flex flex-col items-center">
          <p className="text-muted-foreground mb-4">{t('tapAnywhere')}</p>
          
          <Link to="/language" className="flex items-center text-primary hover:text-primary/80 transition-colors">
            <Globe className="mr-2" size={20} />
            <span>{t('chooseLanguage')}</span>
          </Link>
        </div>
      </div>
      
      <VoiceTranscript />
    </main>
  );
};

export default Index;
