
import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useNavigation } from '@/contexts/NavigationContext';

interface VoiceButtonProps {
  label: string;
  action: () => void;
  className?: string;
  icon?: React.ReactNode;
}

const VoiceButton: React.FC<VoiceButtonProps> = ({ 
  label, 
  action, 
  className = '', 
  icon 
}) => {
  const { isListening } = useNavigation();
  const [ripple, setRipple] = useState(false);
  
  const handleClick = () => {
    action();
    setRipple(true);
    
    // Haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
    
    // Reset ripple effect
    setTimeout(() => setRipple(false), 1000);
  };
  
  return (
    <button
      onClick={handleClick}
      className={`relative flex flex-col items-center justify-center p-8 bg-secondary 
                 rounded-2xl text-center min-h-[180px] min-w-[180px] focus:outline-none
                 focus-visible active:scale-95 transition-transform
                 aria-pressed:bg-primary/20 ${className}`}
      aria-label={label}
    >
      <div className="relative flex items-center justify-center mb-4">
        {icon || (isListening ? 
          <Mic size={48} className="text-primary animate-pulse" /> : 
          <MicOff size={48} className="text-muted-foreground" />
        )}
        {ripple && (
          <span className="absolute inset-0 bg-primary rounded-full animate-ripple" />
        )}
      </div>
      <span className="text-xl font-bold">{label}</span>
    </button>
  );
};

export default VoiceButton;
