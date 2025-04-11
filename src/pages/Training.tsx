
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from '@/contexts/NavigationContext';
import StatusBar from '@/components/StatusBar';
import VoiceTranscript from '@/components/VoiceTranscript';
import { CheckCircle, ArrowLeft, Book, ArrowRight } from 'lucide-react';

const Training: React.FC = () => {
  const { mode, speak, stopNavigation } = useNavigation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  
  const trainingSteps = [
    {
      title: 'Welcome to Training',
      content: 'This mode will help you learn how to use PathSense effectively.',
      instruction: 'Say "Next" or tap the Next button to continue.'
    },
    {
      title: 'Voice Activation',
      content: 'PathSense is primarily voice-controlled. You can activate listening mode by saying "Hey PathSense" or by tapping the screen once.',
      instruction: 'Try saying "Hey PathSense" now.'
    },
    {
      title: 'Navigation Commands',
      content: 'To start navigation, say "Start Navigation". To stop, say "Stop Navigation".',
      instruction: 'Practice these commands by saying them aloud.'
    },
    {
      title: 'Emergency Help',
      content: 'In case of emergency, say "Emergency" or navigate to the Help screen and use the Emergency Call button.',
      instruction: 'The app will confirm before making any emergency calls.'
    },
    {
      title: 'Phone Positioning',
      content: 'For best results, hold your phone in front of you at chest level, with the camera facing forward.',
      instruction: 'This helps the app detect obstacles in your path.'
    },
    {
      title: 'Training Complete',
      content: 'You\'ve completed the basic training! You can return to this training mode anytime from the home screen.',
      instruction: 'Say "Finish Training" or tap the Finish button to return to the home screen.'
    }
  ];
  
  // Redirect to home if not in training mode
  useEffect(() => {
    if (mode !== 'training') {
      navigate('/');
    }
  }, [mode, navigate]);
  
  // Speak instructions for current step
  useEffect(() => {
    if (mode === 'training' && trainingSteps[currentStep]) {
      const step = trainingSteps[currentStep];
      speak(`${step.title}. ${step.content} ${step.instruction}`);
    }
  }, [currentStep, mode, speak, trainingSteps]);
  
  const nextStep = () => {
    if (currentStep < trainingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishTraining();
    }
  };
  
  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const finishTraining = () => {
    speak('Training completed. Returning to home screen.');
    stopNavigation();
    navigate('/');
  };
  
  if (mode !== 'training') {
    return null;
  }
  
  const currentTrainingStep = trainingSteps[currentStep];
  
  return (
    <div className="min-h-screen flex flex-col">
      <StatusBar />
      
      <header className="pt-16 pb-4 px-4">
        <div className="flex items-center mb-4">
          <button 
            onClick={finishTraining}
            className="p-2 mr-2"
            aria-label="Exit training"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold flex items-center">
            <Book className="mr-2 text-primary" /> Training Mode
          </h1>
        </div>
        
        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
          <div 
            className="bg-primary h-full transition-all duration-300 ease-in-out"
            style={{ width: `${((currentStep + 1) / trainingSteps.length) * 100}%` }}
            aria-hidden="true"
          />
        </div>
        <div className="mt-1 text-sm text-muted-foreground">
          Step {currentStep + 1} of {trainingSteps.length}
        </div>
      </header>
      
      <main className="flex-1 px-4 pb-24 flex flex-col">
        <div className="bg-secondary rounded-lg p-6 mb-6 flex-1">
          <h2 className="text-xl font-bold mb-4">{currentTrainingStep.title}</h2>
          <p className="mb-6 text-lg">{currentTrainingStep.content}</p>
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="flex items-start">
              <span className="mr-2 mt-1 text-primary">
                <CheckCircle size={18} />
              </span>
              {currentTrainingStep.instruction}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={previousStep}
            disabled={currentStep === 0}
            className={`p-4 rounded-lg font-medium ${
              currentStep === 0 
                ? 'bg-secondary/50 text-muted-foreground cursor-not-allowed' 
                : 'bg-secondary'
            }`}
            aria-label="Previous step"
          >
            Previous
          </button>
          
          {currentStep < trainingSteps.length - 1 ? (
            <button
              onClick={nextStep}
              className="p-4 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center"
              aria-label="Next step"
            >
              Next <ArrowRight className="ml-2" size={18} />
            </button>
          ) : (
            <button
              onClick={finishTraining}
              className="p-4 bg-success text-success-foreground rounded-lg font-medium flex items-center justify-center"
              aria-label="Finish training"
            >
              Finish <CheckCircle className="ml-2" size={18} />
            </button>
          )}
        </div>
      </main>
      
      <VoiceTranscript />
    </div>
  );
};

export default Training;
