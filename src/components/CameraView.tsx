
import React, { useRef, useEffect, useState } from 'react';
import { useNavigation } from '@/contexts/NavigationContext';
import { Camera, CameraOff, AlertTriangle } from 'lucide-react';

interface DetectedObject {
  id: number;
  label: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number;
}

interface CameraViewProps {
  className?: string;
}

const CameraView: React.FC<CameraViewProps> = ({ className = '' }) => {
  const { speak, mode } = useNavigation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  
  // Mock object detection results - would be replaced with actual ML model
  useEffect(() => {
    if (cameraActive) {
      const mockDetectionInterval = setInterval(() => {
        // Mock objects that might be detected in a real environment
        const possibleObjects = [
          { label: 'Staircase ahead', confidence: 0.85 },
          { label: 'Pole to the right', confidence: 0.78 },
          { label: 'Person nearby', confidence: 0.92 },
          { label: 'Door ahead', confidence: 0.88 },
          { label: 'Chair to the left', confidence: 0.75 }
        ];
        
        // Randomly select 0-2 objects to "detect"
        const objectCount = Math.floor(Math.random() * 3);
        const newObjects: DetectedObject[] = [];
        
        for (let i = 0; i < objectCount; i++) {
          const objIndex = Math.floor(Math.random() * possibleObjects.length);
          const selectedObj = possibleObjects[objIndex];
          
          newObjects.push({
            id: Date.now() + i,
            label: selectedObj.label,
            position: {
              x: 20 + Math.random() * 60, // percentage of screen width
              y: 20 + Math.random() * 40, // percentage of screen height
              width: 15 + Math.random() * 20,
              height: 10 + Math.random() * 15
            },
            confidence: selectedObj.confidence
          });
          
          // Announce the most confident object
          if (i === 0 && selectedObj.confidence > 0.8) {
            speak(selectedObj.label);
          }
        }
        
        setDetectedObjects(newObjects);
      }, 5000); // Update every 5 seconds
      
      return () => clearInterval(mockDetectionInterval);
    }
  }, [cameraActive, speak]);
  
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
  
  // Draw object detection bounding boxes
  useEffect(() => {
    if (canvasRef.current && videoRef.current && cameraActive && detectedObjects.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Set canvas dimensions to match video
        canvas.width = videoRef.current.clientWidth;
        canvas.height = videoRef.current.clientHeight;
        
        // Clear previous drawings
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw bounding boxes for each detected object
        detectedObjects.forEach(obj => {
          const x = (obj.position.x / 100) * canvas.width;
          const y = (obj.position.y / 100) * canvas.height;
          const width = (obj.position.width / 100) * canvas.width;
          const height = (obj.position.height / 100) * canvas.height;
          
          // Draw semi-transparent background for label
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.fillRect(x, y, width, height);
          
          // Draw border
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, width, height);
          
          // Draw label text
          ctx.font = 'bold 16px sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(`${obj.label} (${Math.round(obj.confidence * 100)}%)`, x + 5, y + 20);
        });
      }
    }
  }, [detectedObjects, cameraActive]);
  
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
          
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
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
              {/* Main object detection overlay */}
              {detectedObjects.map(obj => (
                <div 
                  key={obj.id}
                  className="absolute bg-black/40 border-2 border-white rounded-lg p-2"
                  style={{
                    left: `${obj.position.x}%`,
                    top: `${obj.position.y}%`,
                    width: `${obj.position.width}%`,
                    minWidth: '150px'
                  }}
                >
                  <div className="text-white font-bold text-lg">
                    {obj.label}
                  </div>
                  <div className="text-white/80 text-sm">
                    {Math.round(obj.confidence * 100)}% confidence
                  </div>
                </div>
              ))}
              
              {/* Voice guidance indicator */}
              <div className="absolute bottom-20 left-0 right-0 p-6 bg-gradient-to-t from-background/80 to-transparent">
                <div className="text-center">
                  <p className="text-xl mb-2">Guiding you</p>
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-primary animate-pulse" />
                  </div>
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
