import { SupportedLanguage } from "@/contexts/LanguageContext";

interface VirtualCompanionOptions {
  lang: SupportedLanguage;
  onMessage?: (message: string) => void;
}

class VirtualCompanion {
  private language: SupportedLanguage;
  private motivationalLines: Record<SupportedLanguage, string[]>;
  private jokes: Record<SupportedLanguage, string[]>;
  private lastMessageTime: number = 0;
  private isSpeaking: boolean = false;
  private onMessage?: (message: string) => void;
  private companionInterval: number | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  
  constructor(options: VirtualCompanionOptions) {
    this.language = options.lang;
    this.onMessage = options.onMessage;
    
    this.motivationalLines = {
      'en-US': [
        "You're doing great!",
        "Just 100 meters more, champ.",
        "Remember to breathe, you're safe.",
        "I'm right here with you.",
        "You've got this!",
        "Keep going — you're stronger than you think."
      ],
      'hi-IN': [
        "आप बढ़िया कर रहे हैं!",
        "बस 100 मीटर और, चैंप.",
        "सांस लेना याद रखें, आप सुरक्षित हैं।",
        "मैं यहां आपके साथ हूं.",
        "आप कर सकते हैं!",
        "चलते रहो — आप सोचते हैं उससे ज्यादा मजबूत हो।"
      ],
      'ta-IN': [
        "நீங்கள் அருமையாக செய்கிறீர்கள்!",
        "இன்னும் 100 மீட்டர் மட்டுமே, சாம்பியன்.",
        "மூச்சு விடுவதை நினைவில் கொள்ளுங்கள், நீங்கள் பாதுகாப்பாக இருக்கிறீர்கள்.",
        "நான் இங்கே உங்களுடன் இருக்கிறேன்.",
        "நீங்கள் இதை செய்யலாம்!",
        "தொடர்ந்து செல்லுங்கள் — நீங்கள் நினைப்பதை விட வலிமையானவர்."
      ],
      'te-IN': [
        "మీరు చాలా బాగా చేస్తున్నారు!",
        "కేవలం 100 మీటర్లు మాత్రమే, ఛాంపియన్.",
        "శ్వాస తీసుకోవడం గుర్తుంచుకోండి, మీరు సురక్షితంగా ఉన్నారు.",
        "నేను ఇక్కడ మీతో ఉన్నాను.",
        "మీరు దీన్ని చేయగలరు!",
        "కొనసాగించండి — మీరు అనుకుంటున్నంత కంటే శక్తివంతమైనవారు."
      ],
      'bn-IN': [
        "আপনি দারুণ করছেন!",
        "মাত্র 100 মিটার বাকি, চ্যাম্পিয়ন।",
        "শ্বাস নিতে মনে রাখবেন, আপনি নিরাপদ।",
        "আমি এখানে আপনার সাথে আছি.",
        "আপনি ইतটা চেয়ে করতে পারেন!",
        "চালিয়ে যান — আপনি ভাবেন তার চেয়ে শক্তিশালী।"
      ],
      'kn-IN': [
        "ನೀವು ಉತ್ತಮವಾಗಿ ಮಾಡುತ್ತಿದ್ದೀರಿ!",
        "ಕೇವಲ 100 ಮೀಟರ್ ಹೆಚ್ಚು, ಚಾಂಪಿಯನ್.",
        "ಉಸಿರ���ಡಲು ನೆನಪಿಡಿ, ನೀವು ಸುರಕ್ಷಿತವಾಗಿದ್ದೀರಿ.",
        "ನಾನು ಇಲ್ಲಿ ನಿಮ್ಮ ಜೊತೆಗಿದ್ದೇನೆ.",
        "ನೀವು ಇದನ್ನು ಮಾಡಬಹುದು!",
        "ಮುಂದುವರಿಸಿ — ನೀವು ಯೋಚಿಸುವುದಕ್ಕಿಂತ ನೀವು ಬಲಶಾಲಿ."
      ]
    };
    
    this.jokes = {
      'en-US': [
        "Why did the smartphone go to therapy? It lost its sense of touch!",
        "What do you call a computer that sings? A Dell!",
        "Why was the math book sad? It had too many problems."
      ],
      'hi-IN': [
        "स्मार्टफोन थेरेपी क्यों गया? उसने अपनी टच सेंस खो दी थी!",
        "गाने वाले कंप्यूटर को क्या कहते हैं? एक डेल!",
        "गणित की किताब उदास क्यों थी? उसमें बहुत सारी समस्याएं थीं।"
      ],
      'ta-IN': [
        "ஸ்மார்ட்போன் ஏன் சிகிச்சைக்கு சென்றது? அது தனது தொடு உணர்வை இழந்தது!",
        "பாடும் கணினியை என்ன அழைப்பீர்கள்? ஒரு டெல்!",
        "கணித புத்தகம் ஏன் சோகமாக இருந்தது? அதற்கு பல பிரச்சனைகள் இருந்தன."
      ],
      'te-IN': [
        "స్మార్ట్‌ఫోన్ థెరపీకి ఎందుకు వెళ్లింది? అది తన టచ్ సెన్స్‌ని కోల్పోయింది!",
        "పాడే కంప్యూటర్‌ని ఏమంటారు? ఒక డెల్!",
        "గణిత పుస్తకం విచారంగా ఎందుకు ఉంది? దానికి చాలా సమస్యలు ఉన్నాయి."
      ],
      'bn-IN': [
        "স্মার্টফোন কেন থেরাপিতে গিয়েছিল? এটি তার টাচ সেন্স হারিয়েছিল!",
        "গান গাওয়া কম্পিউটারকে কী বলে? একটি ডেল!",
        "গণিত বইটি কেন দুঃখিত ছিল? এর অনেক সমস্যা ছিল।"
      ],
      'kn-IN': [
        "ಸ್ಮಾರ್ಟ್‌ಫೋನ್ ಏಕೆ ಥೆರಪಿಗೆ ಹೋಯಿತು? ಅದು ತನ್ನ ಸ್ಪರ್ಶ ಪ್ರಜ್ಞೆಯನ್ನು ಕಳೆದುಕೊಂಡಿತು!",
        "ಹಾಡುವ ಕಂಪ್ಯೂಟರ್ ಅನ್ನು ಏನೆಂದು ಕರೆಯುತ್ತೀರಿ? ಡೆಲ್!",
        "ಗಣಿತ ಪುಸ್ತಕ ಏಕೆ ದುಃಖಿತವಾಗಿತ್ತು? ಅದಕ್ಕೆ ತುಂಬಾ ಸಮಸ್ಯೆಗಳಿದ್ದವು."
      ]
    };
    
    if (window.speechSynthesis) {
      setTimeout(() => {
        this.voices = window.speechSynthesis.getVoices();
      }, 200);
      
      window.speechSynthesis.onvoiceschanged = () => {
        this.voices = window.speechSynthesis.getVoices();
      };
    }
  }
  
  public setLanguage(lang: SupportedLanguage): void {
    this.language = lang;
  }
  
  private findVoiceForLanguage(lang: SupportedLanguage): SpeechSynthesisVoice | null {
    if (!window.speechSynthesis || this.voices.length === 0) return null;
    
    const languageVoiceMap: Record<SupportedLanguage, string[]> = {
      'en-US': ['en-', 'Google US English'],
      'hi-IN': ['hi-', 'Google Hindi'],
      'ta-IN': ['ta-', 'Google Tamil'],
      'te-IN': ['te-', 'Google Telugu'],
      'bn-IN': ['bn-', 'Google Bengali'],
      'kn-IN': ['kn-', 'Google Kannada']
    };

    const langCodes = languageVoiceMap[lang] || [];
    
    let matchingVoice = this.voices.find(voice => 
      langCodes.some(code => 
        voice.lang.toLowerCase().startsWith(code.toLowerCase())
      )
    );
    
    if (!matchingVoice) {
      const langCode = lang.split('-')[0];
      matchingVoice = this.voices.find(voice => 
        voice.lang.toLowerCase().startsWith(langCode.toLowerCase())
      );
    }
    
    return matchingVoice || null;
  }
  
  public speak(message: string, lang?: SupportedLanguage, priority: boolean = false): void {
    if (!window.speechSynthesis) return;
    
    const speechLang = lang || this.language;
    
    if (priority && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    if (this.onMessage) {
      this.onMessage(message);
    }
    
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = speechLang;
    utterance.pitch = 1.1;
    utterance.rate = 0.95;
    utterance.volume = 1;
    
    const voice = this.findVoiceForLanguage(speechLang);
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.onstart = () => {
      this.isSpeaking = true;
      this.lastMessageTime = Date.now();
    };
    
    utterance.onend = () => {
      this.isSpeaking = false;
    };
    
    window.speechSynthesis.speak(utterance);
  }
  
  public speakRandomMotivation(): void {
    const lines = this.motivationalLines[this.language];
    const randomIndex = Math.floor(Math.random() * lines.length);
    this.speak(lines[randomIndex]);
  }
  
  public tellJoke(): void {
    const jokes = this.jokes[this.language];
    const randomIndex = Math.floor(Math.random() * jokes.length);
    this.speak(jokes[randomIndex]);
  }
  
  public processCommand(command: string): boolean {
    const normalizedCommand = command.toLowerCase();
    
    if (normalizedCommand.includes("joke")) {
      this.tellJoke();
      return true;
    }
    
    return false;
  }
  
  public startCompanionMode(intervalMs: number = 30000): void {
    this.stopCompanionMode();
    
    this.companionInterval = window.setInterval(() => {
      const timeSinceLastMessage = Date.now() - this.lastMessageTime;
      if (!this.isSpeaking && timeSinceLastMessage > 20000) {
        this.speakRandomMotivation();
      }
    }, intervalMs);
  }
  
  public stopCompanionMode(): void {
    if (this.companionInterval) {
      window.clearInterval(this.companionInterval);
      this.companionInterval = null;
    }
  }
}

export default VirtualCompanion;
