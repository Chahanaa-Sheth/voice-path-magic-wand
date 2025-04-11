
import React, { useRef, useEffect, useState } from 'react';
import { useNavigation } from '@/contexts/NavigationContext';
import { Camera, CameraOff, AlertTriangle } from 'lucide-react';

interface CameraViewProps {
  className?: string;
}

const CameraView: React.FC<CameraViewProps> = ({ className = '' }) => {
  const { speak, mode } = useNavigation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const startCamera = async () => {
      try {
        if (mode === 'navigating' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { 
              facingMode: 'environment',
              width: { ideal: 1280 },
              height: { ideal: 720 } 
            }
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setCameraActive(true);
            setError(null);
          }
        }
      } catch (err) {
        console.error('Camera access error:', err);
        setError('Could not access camera');
        setCameraActive(false);
        speak('Camera access denied. Some features may not work properly.');
      }
    };
    
    if (mode === 'navigating') {
      startCamera();
    } else {
      // Stop camera if not in navigation mode
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setCameraActive(false);
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mode, speak]);
  
  if (mode !== 'navigating') {
    return null;
  }
  
  return (
    <div className={`relative w-full h-full ${className}`}>
      {error ? (
        <div className="flex flex-col items-center justify-center h-full bg-background text-destructive">
          <CameraOff size={48} className="mb-4" />
          <p className="text-xl">{error}</p>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            aria-label="Camera view for navigation assistance"
          />
          
          {!cameraActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="flex flex-col items-center">
                <Camera size={48} className="mb-4 animate-pulse" />
                <p className="text-xl">Activating camera...</p>
              </div>
            </div>
          )}
          
          {cameraActive && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Overlay for voice guidance */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/80 to-transparent">
                <div className="text-center">
                  <p className="text-xl mb-2">Guiding you</p>
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-primary animate-pulse" />
                  </div>
                </div>
              </div>
              
              {/* Example obstacle warning overlay - would be replaced with actual vision processing */}
              <div className="absolute top-1/4 inset-x-0 flex justify-center">
                <div className="bg-destructive/20 border-2 border-destructive rounded-lg p-4 flex items-center">
                  <AlertTriangle className="mr-2 text-destructive" />
                  <span>Obstacle detected</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CameraView;
