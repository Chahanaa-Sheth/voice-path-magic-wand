import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SupportedLanguage = 'en-US' | 'hi-IN' | 'ta-IN' | 'te-IN' | 'bn-IN' | 'kn-IN';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  translations: Record<string, string>;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Initial translations - in a real app these would be loaded from separate files
const translationData: Record<SupportedLanguage, Record<string, string>> = {
  'en-US': {
    welcome: "Welcome to PathSense, your navigation assistant.",
    tapAnywhere: "Tap anywhere or say Hey PathSense to get started.",
    startNavigation: "Start Navigation",
    trainingMode: "Training Mode",
    recordRoute: "Record Route",
    help: "Help",
    obstacleAhead: "Obstacle ahead. Move left.",
    keepGoing: "You're doing great! Keep going.",
    motivational1: "You're doing great!",
    motivational2: "Just 100 meters more, champ.",
    motivational3: "Remember to breathe, you're safe.",
    motivational4: "I'm right here with you.",
    motivational5: "You've got this!",
    motivational6: "Keep going — you're stronger than you think.",
    joke1: "Why did the smartphone go to therapy? It lost its sense of touch!",
    joke2: "What do you call a computer that sings? A Dell!",
    joke3: "Why was the math book sad? It had too many problems.",
    chooseLanguage: "Choose your language",
  },
  'hi-IN': {
    welcome: "पथसेंस में आपका स्वागत है, आपका नेविगेशन सहायक।",
    tapAnywhere: "कहीं भी टैप करें या हे पथसेंस कहें शुरू करने के लिए।",
    startNavigation: "नेविगेशन शुरू करें",
    trainingMode: "प्रशिक्षण मोड",
    recordRoute: "मार्ग रिकॉर्ड करें",
    help: "मदद",
    obstacleAhead: "आगे बाधा है। बाईं ओर जाएं।",
    keepGoing: "आप बहुत अच्छा कर रहे हैं! जारी रखें।",
    motivational1: "आप बढ़िया कर रहे हैं!",
    motivational2: "बस 100 मीटर और, चैंप।",
    motivational3: "सांस लेना याद रखें, आप सुरक्षित हैं।",
    motivational4: "मैं यहां आपके साथ हूं।",
    motivational5: "आप कर सकते हैं!",
    motivational6: "चलते रहो — आप सोचते हैं उससे ज्यादा मजबूत हो।",
    joke1: "स्मार्टफोन थेरेपी क्यों गया? उसने अपनी टच सेंस खो दी थी!",
    joke2: "गाने वाले कंप्यूटर को क्या कहते हैं? एक डेल!",
    joke3: "गणित की किताब उदास क्यों थी? उसमें बहुत सारी समस्याएं थीं।",
    chooseLanguage: "अपनी भाषा चुनें",
  },
  'ta-IN': {
    welcome: "பாத்சென்ஸுக்கு வரவேற்கிறோம், உங்கள் வழிசெலுத்தல் உதவியாளர்.",
    tapAnywhere: "எங்காவது தட்டவும் அல்லது ஹே பாத்சென்ஸ் சொல்லி தொடங்கவும்.",
    startNavigation: "வழிசெலுத்தல் தொடங்கு",
    trainingMode: "பயிற்சி முறை",
    recordRoute: "பாதையை பதிவுசெய்",
    help: "உதவி",
    obstacleAhead: "முன்னே ஒரு தடுப்பு உள்ளது. இடப்புறமாக செல்லவும்.",
    keepGoing: "நீங்கள் நன்றாக செய்கிறீர்கள்! தொடர்ந்து செல்லுங்கள்.",
    chooseLanguage: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
    
    // Add more Tamil translations as needed
    motivational1: "நீங்கள் அருமையாக செய்கிறீர்கள்!",
    motivational2: "இன்னும் 100 மீட்டர் மட்டுமே, சாம்பியன்.",
    motivational3: "மூச்சு விடுவதை நினைவில் கொள்ளுங்கள், நீங்கள் பாதுகாப்பாக இருக்கிறீர்கள்.",
    motivational4: "நான் இங்கே உங்களுடன் இருக்கிறேன்.",
    motivational5: "நீங்கள் இதை செய்யலாம்!",
    motivational6: "தொடர்ந்து செல்லுங்கள் — நீங்கள் நினைப்பதை விட வலிமையானவர்.",
    joke1: "ஸ்மார்ட்போன் ஏன் சிகிச்சைக்கு சென்றது? அது தனது தொடு உணர்வை இழந்தது!",
    joke2: "பாடும் கணினியை என்ன அழைப்பீர்கள்? ஒரு டெல்!",
    joke3: "கணித புத்தகம் ஏன் சோகமாக இருந்தது? அதற்கு பல பிரச்சனைகள் இருந்தன."
  },
  'te-IN': {
    welcome: "పాత్‌సెన్స్‌కు స్వాగతం, మీ నావిగేషన్ సహాయకుడు.",
    tapAnywhere: "ఎక్కడైనా తాకండి లేదా హే పాత్‌సెన్స్ అని చెప్పి ప్రారంభించండి.",
    startNavigation: "నావిగేషన్ ప్రారంభించండి",
    trainingMode: "శిక్షణ మోడ్",
    recordRoute: "మార్గాన్ని రికార్డ్ చేయండి",
    help: "సహాయం",
    obstacleAhead: "ముందు ఒక అడ్డంకి ఉంది. ఎడమవైపుకి కదలండి.",
    keepGoing: "మీరు చాలా బాగా చేస్తున్నారు! కొనసాగించండి.",
    motivational1: "మీరు చాలా బాగా చేస్తున్నారు!",
    motivational2: "కేవలం 100 మీటర్లు మాత్రమే, ఛాంపియన్.",
    motivational3: "శ్వాస తీసుకోవడం గుర్తుంచుకోండి, మీరు సురక్షితంగా ఉన్నారు.",
    motivational4: "నేను ఇక్కడ మీతో ఉన్నాను.",
    motivational5: "మీరు దీన్ని చేయగలరు!",
    motivational6: "కొనసాగించండి — మీరు అనుకుంటున్నంత కంటే శక్తివంతమైనవారు.",
    joke1: "స్మార్ట్‌ఫోన్ థెరపీకి ఎందుకు వెళ్లింది? అది తన టచ్ సెన్స్‌ని కోల్పోయింది!",
    joke2: "పాడే కంప్యూటర్‌ని ఏమంటారు? ఒక డెల్!",
    joke3: "గణిత పుస్తకం విచారంగా ఎందుకు ఉంది? దానికి చాలా సమస్యలు ఉన్నాయి.",
    chooseLanguage: "మీ భాషను ఎంచుకోండి",
  },
  'bn-IN': {
    welcome: "পাথসেন্সে স্বাগতম, আপনার নেভিগেশন সহকারী।",
    tapAnywhere: "শুরু করতে যেখানে সেখানে ট্যাপ করুন বা হে পাথসেন্স বলুন।",
    startNavigation: "নেভিগেশন শুরু করুন",
    trainingMode: "প্রশিক্ষণ মোড",
    recordRoute: "রুট রেকর্ড করুন",
    help: "সাহায্য",
    obstacleAhead: "সামনে বাধা আছে। বাম দিকে যান।",
    keepGoing: "আপনি খুব ভাল করছেন! চালিয়ে যান।",
    motivational1: "আপনি দারুণ করছেন!",
    motivational2: "মাত্র 100 মিটার বাকি, চ্যাম্পিয়ন।",
    motivational3: "শ্বাস নিতে মনে রাখবেন, আপনি নিরাপদ।",
    motivational4: "আমি এখানে আপনার সাথে আছি।",
    motivational5: "আপনি এটা করতে পারেন!",
    motivational6: "চালিয়ে যান — আপনি ভাবেন তার চেয়ে শক্তিশালী।",
    joke1: "স্মার্টফোন কেন থেরাপিতে গিয়েছিল? এটি তার টাচ সেন্স হারিয়েছিল!",
    joke2: "গান গাওয়া কম্পিউটারকে কী বলে? একটি ডেল!",
    joke3: "গণিত বইটি কেন দুঃখিত ছিল? এর অনেক সমস্যা ছিল।",
    chooseLanguage: "আপনার ভাষা চয়ন করুন",
  },
  'kn-IN': {
    welcome: "ಪಾತ್‌ಸೆನ್ಸ್‌ಗೆ ಸುಸ್ವಾಗತ, ನಿಮ್ಮ ನ್ಯಾವಿಗೇಶನ್ ಸಹಾಯಕ.",
    tapAnywhere: "ಎಲ್ಲಿಯಾದರೂ ಟ್ಯಾಪ್ ಮಾಡಿ ಅಥವಾ ಹೇ ಪಾತ್‌ಸೆನ್ಸ್ ಎಂದು ಹೇಳಿ ಪ್ರಾರಂಭಿಸಿ.",
    startNavigation: "ನ್ಯಾವಿಗೇಶನ್ ಪ್ರಾರಂಭಿಸಿ",
    trainingMode: "ತರಬೇತಿ ಮೋಡ್",
    recordRoute: "ಮಾರ್ಗವನ್ನು ರೆಕಾರ್ಡ್ ಮಾಡಿ",
    help: "ಸಹಾಯ",
    obstacleAhead: "ಮುಂದೆ ಅಡ್ಡಿ ಇದೆ. ಎಡಕ್ಕೆ ಚಲಿಸಿ.",
    keepGoing: "ನೀವು ಅದ್ಭುತವಾಗಿ ಮಾಡುತ್ತಿದ್ದೀರಿ! ಮುಂದುವರಿಸಿ.",
    motivational1: "ನೀವು ಉತ್ತಮವಾಗಿ ಮಾಡುತ್ತಿದ್ದೀರಿ!",
    motivational2: "ಕೇವಲ 100 ಮೀಟರ್ ಹೆಚ್ಚು, ಚಾಂಪಿಯನ್.",
    motivational3: "ಉಸಿರಾಡಲು ನೆನಪಿಡಿ, ನೀವು ಸುರಕ್ಷಿತವಾಗಿದ್ದೀರಿ.",
    motivational4: "ನಾನು ಇಲ್ಲಿ ನಿಮ್ಮ ಜೊತೆಗಿದ್ದೇನೆ.",
    motivational5: "ನೀವು ಇದನ್ನು ಮಾಡಬಹುದು!",
    motivational6: "ಮುಂದುವರಿಸಿ — ನೀವು ಯೋಚಿಸುವುದಕ್ಕಿಂತ ನೀವು ಬಲಶಾಲಿ.",
    joke1: "ಸ್ಮಾರ್ಟ್‌ಫೋನ್ ಏಕೆ ಥೆರಪಿಗೆ ಹೋಯಿತು? ಅದು ತನ್ನ ಸ್ಪರ್ಶ ಪ್ರಜ್ಞೆಯನ್ನು ಕಳೆದುಕೊಂಡಿತು!",
    joke2: "ಹಾಡುವ ಕಂಪ್ಯೂಟರ್ ಅನ್ನು ಏನೆಂದು ಕರೆಯುತ್ತೀರಿ? ಡೆಲ್!",
    joke3: "ಗಣಿತ ಪುಸ್ತಕ ಏಕೆ ದುಃಖಿತವಾಗಿತ್ತು? ಅದಕ್ಕೆ ತುಂಬಾ ಸಮಸ್ಯೆಗಳಿದ್ದವು.",
    chooseLanguage: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
  },
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    // Try to load from localStorage, default to en-US
    const savedLang = localStorage.getItem('pathsense-language');
    return (savedLang as SupportedLanguage) || 'en-US';
  });
  
  const [translations, setTranslations] = useState(translationData[language]);
  
  // Update translations when language changes
  useEffect(() => {
    setTranslations(translationData[language]);
    // Save to localStorage
    localStorage.setItem('pathsense-language', language);
  }, [language]);
  
  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
  };
  
  // Translation function
  const t = (key: string): string => {
    return translations[key] || key;
  };
  
  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        translations,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
