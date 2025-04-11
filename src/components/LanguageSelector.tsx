
import React, { useEffect } from 'react';
import { useLanguage, SupportedLanguage } from '@/contexts/LanguageContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe } from 'lucide-react';
import StatusBar from '@/components/StatusBar';
import VoiceTranscript from '@/components/VoiceTranscript';

const languages: { code: SupportedLanguage; name: string; nativeName: string }[] = [
  { code: 'en-US', name: 'English', nativeName: 'English' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
];

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { speak } = useNavigation();
  const navigate = useNavigate();
  
  // Announce language selection when component mounts
  useEffect(() => {
    speak(t('chooseLanguage'));
  }, [speak, t]);
  
  const handleLanguageChange = (lang: SupportedLanguage) => {
    setLanguage(lang);
    
    // Provide haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
    
    // Find the language info
    const langInfo = languages.find(l => l.code === lang);
    
    // Speak in the new language
    setTimeout(() => {
      speak(`Selected ${langInfo?.name}. ${langInfo?.nativeName}`, lang);
      setTimeout(() => navigate('/'), 2000);
    }, 500);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <StatusBar />
      
      <header className="pt-16 pb-6 px-4">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => navigate('/')} 
            className="p-2 mr-2" 
            aria-label="Back to home"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold flex items-center">
            <Globe className="mr-2 text-primary" /> {t('chooseLanguage')}
          </h1>
        </div>
      </header>
      
      <main className="flex-1 px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`p-6 rounded-lg text-left transition-colors ${
                language === lang.code 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
              aria-current={language === lang.code ? 'true' : 'false'}
            >
              <div className="flex flex-col">
                <span className="text-2xl font-bold mb-2">{lang.nativeName}</span>
                <span className="text-sm opacity-80">{lang.name}</span>
              </div>
            </button>
          ))}
        </div>
      </main>
      
      <VoiceTranscript />
    </div>
  );
};

export default LanguageSelector;
