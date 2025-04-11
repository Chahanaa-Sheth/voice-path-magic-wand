import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from '@/contexts/NavigationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { 
  Navigation, 
  Volume2, // Replace VolumeUp with Volume2 
  Mic, 
  Users, 
  Settings 
} from 'lucide-react';

interface DashboardProps {
  className?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const { startNavigation, speak, startListening, companion } = useNavigation();
  const { t } = useLanguage();

  const handleNavigationStart = () => {
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
    startNavigation();
  };

  const handleRepeatPrompt = () => {
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
    // Repeat the last spoken prompt
    if (companion) {
      companion.repeatLastMessage();
    } else {
      speak(t('tapAnywhere'));
    }
  };

  const handleVoiceCommand = () => {
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
    startListening();
  };

  const handleVolunteerMode = () => {
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
    speak(t('volunteerMode'));
    // Navigate to volunteer mode (to be implemented)
    // navigate('/volunteer');
  };

  const handleSettings = () => {
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
    navigate('/language');
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 w-full grid grid-cols-3 sm:grid-cols-5 p-2 bg-secondary/90 backdrop-blur-md rounded-t-2xl shadow-lg ${className}`}>
      {/* On small screens, we'll show 3 columns instead of 5 */}
      <Button 
        variant="ghost" 
        className="flex flex-col items-center justify-center h-14 sm:h-16 w-full gap-1 rounded-xl"
        onClick={handleNavigationStart}
        aria-label={t('startNavigation')}
      >
        <Navigation size={20} className="text-primary sm:size-24" />
        <span className="text-xs whitespace-nowrap">{t('startNavigation')}</span>
      </Button>

      <Button 
        variant="ghost" 
        className="flex flex-col items-center justify-center h-14 sm:h-16 w-full gap-1 rounded-xl"
        onClick={handleRepeatPrompt}
        aria-label={t('repeatPrompt')}
      >
        <Volume2 size={20} className="text-primary sm:size-24" />
        <span className="text-xs whitespace-nowrap">{t('repeatPrompt')}</span>
      </Button>

      <Button 
        variant="ghost" 
        className="flex flex-col items-center justify-center h-14 sm:h-16 w-full gap-1 rounded-xl"
        onClick={handleVoiceCommand}
        aria-label={t('voiceCommand')}
      >
        <Mic size={20} className="text-primary sm:size-24" />
        <span className="text-xs whitespace-nowrap">{t('voiceCommand')}</span>
      </Button>

      {/* Hide these buttons on small screens */}
      <Button 
        variant="ghost" 
        className="hidden sm:flex flex-col items-center justify-center h-14 sm:h-16 w-full gap-1 rounded-xl"
        onClick={handleVolunteerMode}
        aria-label={t('volunteerMode')}
      >
        <Users size={20} className="text-primary sm:size-24" />
        <span className="text-xs whitespace-nowrap">{t('volunteerMode')}</span>
      </Button>

      <Button 
        variant="ghost" 
        className="hidden sm:flex flex-col items-center justify-center h-14 sm:h-16 w-full gap-1 rounded-xl"
        onClick={handleSettings}
        aria-label={t('settings')}
      >
        <Settings size={20} className="text-primary sm:size-24" />
        <span className="text-xs whitespace-nowrap">{t('settings')}</span>
      </Button>
    </div>
  );
};

export default Dashboard;
