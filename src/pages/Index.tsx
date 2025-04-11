
import React, { useEffect } from 'react';
import { useNavigation } from '@/contexts/NavigationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import StatusBar from '@/components/StatusBar';
import VoiceTranscript from '@/components/VoiceTranscript';
import Dashboard from '@/components/Dashboard';
import { Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index: React.FC = () => {
  const { speak } = useNavigation();
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
        
        <div className="flex flex-col items-center justify-center mt-8">
          <p className="text-2xl mb-8">
            {t('tapAnywhere')}
          </p>
          
          <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center mb-16">
            <div className="w-16 h-16 rounded-full bg-primary animate-pulse" />
          </div>
          
          <Link to="/language" className="flex items-center text-primary hover:text-primary/80 transition-colors mt-8">
            <Globe className="mr-2" size={20} />
            <span>{t('chooseLanguage')}</span>
          </Link>
        </div>
      </div>
      
      {/* Dashboard */}
      <Dashboard />
      
      <VoiceTranscript />
    </main>
  );
};

export default Index;
