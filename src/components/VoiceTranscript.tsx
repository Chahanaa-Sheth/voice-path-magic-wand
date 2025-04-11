
import React, { useEffect, useRef } from 'react';
import { useNavigation } from '@/contexts/NavigationContext';

const VoiceTranscript: React.FC = () => {
  const { transcript, isListening } = useNavigation();
  const transcriptRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when transcript updates
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);
  
  if (!isListening && !transcript) {
    return null;
  }
  
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 p-4 bg-secondary/80 backdrop-blur-sm z-40"
      aria-live="assertive"
    >
      <div ref={transcriptRef} className="max-h-20 overflow-y-auto text-lg">
        {isListening && !transcript && (
          <div className="text-center text-muted-foreground">
            <span className="inline-block w-2 h-2 bg-primary rounded-full mr-1 animate-pulse"></span>
            <span className="inline-block w-2 h-2 bg-primary rounded-full mr-1 animate-pulse" style={{ animationDelay: '300ms' }}></span>
            <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></span>
          </div>
        )}
        {transcript && (
          <div className="font-medium">
            <span className="text-primary">"</span>
            {transcript}
            <span className="text-primary">"</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceTranscript;
