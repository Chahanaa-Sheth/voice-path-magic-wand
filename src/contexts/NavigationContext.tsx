import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { toast } from 'sonner';
import VirtualCompanion from '@/services/VirtualCompanion';
import { useLanguage, SupportedLanguage } from '@/contexts/LanguageContext';

export type NavigationMode = 'idle' | 'navigating' | 'training' | 'recording';

interface NavigationContextType {
  mode: NavigationMode;
  isListening: boolean;
  transcript: string;
  isSpeaking: boolean;
  startNavigation: () => void;
  stopNavigation: () => void;
  startTraining: () => void;
  startRecording: () => void;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string, lang?: SupportedLanguage, priority?: boolean) => void;
  processSpeech: (command: string) => void;
  companion: VirtualCompanion | null;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<NavigationMode>('idle');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const [recognition, setRecognition] = useState<any>(null);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [companion, setCompanion] = useState<VirtualCompanion | null>(null);
  
  const { language, t } = useLanguage();
  
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognitionAPI();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = language;
      
      recognitionInstance.onresult = (event: any) => {
        const last = event.results.length - 1;
        const result = event.results[last];
        const transcript = result[0].transcript.trim().toLowerCase();
        setTranscript(transcript);
        
        if (result.isFinal) {
          processSpeech(transcript);
        }
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Speech recognition error. Please try again.');
      };
      
      setRecognition(recognitionInstance);
    } else {
      toast.error('Speech recognition is not supported in this browser');
    }
    
    if ('speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
      
      const newCompanion = new VirtualCompanion({
        lang: language,
        onMessage: (message) => console.log('Companion says:', message)
      });
      setCompanion(newCompanion);
    } else {
      toast.error('Speech synthesis is not supported in this browser');
    }
    
    return () => {
      if (recognition) {
        recognition.abort();
      }
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
    };
  }, []);
  
  useEffect(() => {
    if (recognition) {
      recognition.lang = language;
    }
    if (companion) {
      companion.setLanguage(language);
    }
  }, [language, recognition, companion]);
  
  const startListening = useCallback(() => {
    if (recognition) {
      try {
        recognition.start();
        setIsListening(true);
        toast.success('Listening...');
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast.error('Failed to start listening. Please try again.');
      }
    }
  }, [recognition]);
  
  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
      toast.info('Stopped listening');
    }
  }, [recognition]);
  
  const speak = useCallback((text: string, lang?: SupportedLanguage, priority: boolean = false) => {
    const speechLang = lang || language;
    
    if (companion) {
      companion.speak(text, speechLang, priority);
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 10000);
    } else if (speechSynthesis) {
      if (priority) {
        speechSynthesis.cancel();
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = speechLang;
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
      };
      
      speechSynthesis.speak(utterance);
    }
  }, [speechSynthesis, companion, language]);
  
  const processSpeech = useCallback((command: string) => {
    console.info('Processing speech command:', command);
    
    if (companion && companion.processCommand(command)) {
      return;
    }
    
    if (command.includes('hey path sense') || command.includes('hey pathsense')) {
      if (!isListening) {
        startListening();
      }
      speak(t('welcome'));
      return;
    }
    
    if (command.includes('start navigation')) {
      startNavigation();
    } else if (command.includes('stop navigation') || command.includes('end navigation')) {
      stopNavigation();
    } else if (command.includes('start training')) {
      startTraining();
    } else if (command.includes('record route') || command.includes('start recording')) {
      startRecording();
    } else if (command.includes('help')) {
      speak('Available commands: Start Navigation, Stop Navigation, Help, Start Training, Record Route');
    } else if (command.includes('stop listening')) {
      stopListening();
    }
  }, [isListening, startListening, speak, t]);
  
  const startNavigation = useCallback(() => {
    setMode('navigating');
    speak(t('startNavigation'), true);
    
    if (companion) {
      companion.startCompanionMode();
    }
    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .catch(error => {
          console.error('Camera access error:', error);
          toast.error('Could not access camera for navigation assistance');
        });
    }
  }, [speak, companion, t]);
  
  const stopNavigation = useCallback(() => {
    if (mode !== 'idle') {
      setMode('idle');
      speak('Navigation stopped', true);
      
      if (companion) {
        companion.stopCompanionMode();
      }
    }
  }, [mode, speak, companion]);
  
  const startTraining = useCallback(() => {
    setMode('training');
    speak(t('trainingMode'), language, true);
  }, [speak, t, language]);
  
  const startRecording = useCallback(() => {
    setMode('recording');
    speak(t('recordRoute'), language, true);
  }, [speak, t, language]);
  
  useEffect(() => {
    const handleTap = () => {
      if (!isListening) {
        startListening();
        navigator.vibrate?.(100);
        speak(t('tapAnywhere'));
      }
    };
    
    document.addEventListener('click', handleTap);
    return () => document.removeEventListener('click', handleTap);
  }, [isListening, startListening, speak, t]);
  
  return (
    <NavigationContext.Provider
      value={{
        mode,
        isListening,
        transcript,
        isSpeaking,
        startNavigation,
        stopNavigation,
        startTraining,
        startRecording,
        startListening,
        stopListening,
        speak,
        processSpeech,
        companion,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
