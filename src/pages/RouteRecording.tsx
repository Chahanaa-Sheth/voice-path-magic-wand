
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from '@/contexts/NavigationContext';
import StatusBar from '@/components/StatusBar';
import VoiceTranscript from '@/components/VoiceTranscript';
import { MapPin, Mic, Save, X, Clock } from 'lucide-react';

const RouteRecording: React.FC = () => {
  const { mode, speak, stopNavigation } = useNavigation();
  const navigate = useNavigate();
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voiceNotes, setVoiceNotes] = useState<string[]>([]);
  const [currentLocation, setCurrentLocation] = useState<GeolocationCoordinates | null>(null);
  
  // Redirect to home if not in recording mode
  useEffect(() => {
    if (mode !== 'recording') {
      navigate('/');
    } else {
      // Start recording instructions
      speak('Route recording started. Describe your surroundings and any landmarks as you walk. I will save these voice notes along with your location.');
      
      // Start tracking location if available
      if ('geolocation' in navigator) {
        navigator.geolocation.watchPosition(
          (position) => {
            setCurrentLocation(position.coords);
          },
          (error) => {
            console.error('Geolocation error:', error);
            speak('Could not access your location. Route recording will continue without location data.');
          }
        );
      } else {
        speak('Location services are not available on this device. Route recording will continue without location data.');
      }
    }
  }, [mode, navigate, speak]);
  
  // Timer for recording duration
  useEffect(() => {
    let interval: number | undefined;
    
    if (mode === 'recording') {
      interval = window.setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mode]);
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const addVoiceNote = () => {
    // In a real app, this would capture the actual voice note
    const newNote = `Voice note at ${formatTime(recordingSeconds)}`;
    setVoiceNotes([...voiceNotes, newNote]);
    speak('Voice note added');
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([100, 100, 100]);
    }
  };
  
  const stopRecording = () => {
    speak('Route recording complete. Returning to home screen.');
    stopNavigation();
    navigate('/');
  };
  
  if (mode !== 'recording') {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <StatusBar />
      
      <header className="pt-16 pb-6 px-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold flex items-center">
            <MapPin className="mr-2 text-primary" /> Recording Route
          </h1>
          <button 
            onClick={stopRecording}
            className="p-2 bg-destructive/20 rounded-full"
            aria-label="Stop recording"
          >
            <X size={24} className="text-destructive" />
          </button>
        </div>
        
        <div className="bg-secondary rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="mr-2 text-primary" />
            <span className="text-xl font-mono">{formatTime(recordingSeconds)}</span>
          </div>
          
          {currentLocation && (
            <div className="text-sm">
              <div className="flex items-center">
                <MapPin size={14} className="mr-1 text-primary" />
                <span>Location tracking active</span>
              </div>
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-1 px-4 pb-24 flex flex-col">
        <section className="mb-4 flex-1">
          <h2 className="text-lg font-semibold mb-2">Voice Notes</h2>
          {voiceNotes.length > 0 ? (
            <ul className="space-y-2">
              {voiceNotes.map((note, index) => (
                <li key={index} className="p-3 bg-secondary rounded-lg flex items-center">
                  <Mic size={18} className="mr-2 text-primary" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 bg-secondary/50 rounded-lg">
              <MapPin size={48} className="mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">
                No voice notes yet. Add voice notes as you navigate.
              </p>
            </div>
          )}
        </section>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={addVoiceNote}
            className="p-4 bg-secondary rounded-lg font-medium flex items-center justify-center"
            aria-label="Add voice note"
          >
            <Mic className="mr-2" size={18} /> Add Voice Note
          </button>
          
          <button
            onClick={stopRecording}
            className="p-4 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center"
            aria-label="Save and finish"
          >
            <Save className="mr-2" size={18} /> Save & Finish
          </button>
        </div>
      </main>
      
      <VoiceTranscript />
    </div>
  );
};

export default RouteRecording;
