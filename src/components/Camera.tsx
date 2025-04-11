import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@/contexts/NavigationContext';
import { useLanguage } from '@/contexts/LanguageContext';

const Camera: React.FC = () => {
  const { mode, speak } = useNavigation();
  const { t, language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        // Request camera access with rear camera preferred
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false
        });

        // Set the stream to the video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          speak(t('cameraActive'), language);
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('cameraPermissionError');
        speak(t('cameraPermissionError'), language);
      }
    };

    // Only start camera when in navigation mode
    if (mode === 'navigating') {
      startCamera();
    }

    // Clean up function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mode, speak, t, language]);

  if (mode !== 'navigating') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-20">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      {error ? (
        <div className="flex h-full items-center justify-center bg-background/90 p-4">
          <p className="text-lg text-red-500">{t(error)}</p>
        </div>
      ) : (
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline
          className="h-full w-full object-cover" 
          aria-label={t('cameraFeed')}
        />
      )}
      <div className="absolute bottom-20 sm:bottom-24 left-0 right-0 flex justify-center">
        <button 
          className="rounded-full bg-primary p-3 sm:p-4 text-primary-foreground shadow-lg"
          onClick={() => document.dispatchEvent(new CustomEvent('stopNavigation'))}
          aria-label={t('stopNavigation')}
        >
          {t('stop')}
        </button>
      </div>
    </div>
  );
};

export default Camera;