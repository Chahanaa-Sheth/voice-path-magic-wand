import React from 'react';
import StatusBar from '@/components/StatusBar';
import Dashboard from '@/components/Dashboard';
import VoiceTranscript from '@/components/VoiceTranscript';

interface LayoutProps {
  children: React.ReactNode;
  showDashboard?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showDashboard = true 
}) => {
  return (
    <main className="min-h-screen flex flex-col">
      <StatusBar />
      
      <div className="flex-1 overflow-auto">
        {children}
      </div>
      
      {showDashboard && <Dashboard />}
      <VoiceTranscript />
    </main>
  );
};

export default Layout;