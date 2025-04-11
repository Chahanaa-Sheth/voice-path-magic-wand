
import React, { useState, useEffect } from 'react';
import { Battery, Wifi, AlertCircle } from 'lucide-react';
import { useNavigation } from '@/contexts/NavigationContext';

const StatusBar: React.FC = () => {
  const { mode, isListening, isSpeaking } = useNavigation();
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [batteryCharging, setBatteryCharging] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Battery status monitoring
  useEffect(() => {
    const updateBatteryStatus = (battery: any) => {
      setBatteryLevel(battery.level * 100);
      setBatteryCharging(battery.charging);
      
      battery.addEventListener('levelchange', () => {
        setBatteryLevel(battery.level * 100);
      });
      
      battery.addEventListener('chargingchange', () => {
        setBatteryCharging(battery.charging);
      });
    };
    
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then(updateBatteryStatus);
    }
  }, []);
  
  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center space-x-2">
        {/* Mode indicator */}
        <div className="px-2 py-1 rounded-full bg-secondary text-xs font-medium" aria-live="polite">
          {mode === 'idle' ? 'Ready' : mode.charAt(0).toUpperCase() + mode.slice(1)}
        </div>
        
        {/* Listening/Speaking indicator */}
        {isListening && (
          <div className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-primary mr-1 animate-pulse"></span>
            <span className="text-xs">Listening</span>
          </div>
        )}
        
        {isSpeaking && (
          <div className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-success mr-1 animate-pulse"></span>
            <span className="text-xs">Speaking</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        {/* Network status */}
        {!isOnline && (
          <div className="flex items-center text-destructive" aria-live="polite">
            <AlertCircle size={16} className="mr-1" />
            <span className="text-xs">Offline</span>
          </div>
        )}
        
        {isOnline && (
          <Wifi size={16} className="text-muted-foreground" aria-hidden="true" />
        )}
        
        {/* Battery indicator */}
        {batteryLevel !== null && (
          <div className="flex items-center" aria-label={`Battery ${batteryLevel.toFixed(0)}% ${batteryCharging ? 'charging' : ''}`}>
            <Battery size={16} className={`${batteryLevel < 20 ? 'text-destructive' : 'text-muted-foreground'}`} />
            <span className="ml-1 text-xs">{batteryLevel.toFixed(0)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusBar;
