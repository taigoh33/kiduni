
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Mic, CheckCircle2, Languages } from 'lucide-react';
import { LearningItem, Language } from '../types';

interface SentenceCardProps {
  item: LearningItem;
  categoryGroup?: string;
  speechRate?: number;
}

export const SentenceCard: React.FC<SentenceCardProps> = ({ item, categoryGroup, speechRate = 0.6 }) => {
  const [activeRecording, setActiveRecording] = useState<Language | null>(null);
  const [mastered, setMastered] = useState<Record<string, boolean>>({});
  const recognitionRef = useRef<any>(null);

  const getFeatureLabel = () => {
    if (categoryGroup === 'sentences') return { zh: '生活说说话', en: 'Daily Sentences' };
    return { zh: '对话练习', en: 'Dialogue Practice' };
  };

  const featureLabel = getFeatureLabel();

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
    }

    const recognition = recognitionRef.current;

    recognition.onstart = () => {
      // setActiveRecording is already set by startRecording
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log('Sentence Recognition Result:', transcript);
      
      // Use the functional setter to ensure we have the correct currentCode
      setActiveRecording(currentCode => {
        if (currentCode) {
          console.log(`Matched! Labeling ${currentCode} as mastered`);
          setMastered(prev => ({ ...prev, [currentCode]: true }));
          setTimeout(() => {
            setMastered(prev => ({ ...prev, [currentCode]: false }));
          }, 2000);
        }
        return null; // Stop recording state
      });
    };

    recognition.onerror = (event: any) => {
      console.error("Sentence Speech recognition error:", event.error);
      setActiveRecording(null);
    };

    recognition.onend = () => {
      setActiveRecording(null);
    };

    return () => {
      // Don't abort here to avoid killing it on every state change
    };
  }, []);

  const speak = (code: Language) => {
    window.speechSynthesis.cancel();
    const text = item.translations[code];
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    if (code === 'zh') {
      const zhVoice = voices.find(v => v.name.includes('Google') && v.lang.includes('zh-CN')) ||
                      voices.find(v => v.lang.includes('zh-CN')) || 
                      voices.find(v => v.lang.includes('zh'));
      if (zhVoice) utterance.voice = zhVoice;
      utterance.lang = 'zh-CN';
    } else if (code === 'en') {
      const enVoice = voices.find(v => v.name.includes('Google') && v.lang.includes('en-SG')) ||
                      voices.find(v => v.lang.includes('en-SG') || v.name.includes('Singapore')) ||
                      voices.find(v => v.lang.includes('en-MY') || v.name.includes('Malaysia')) ||
                      voices.find(v => v.lang.startsWith('en-GB')) || 
                      voices.find(v => (v.lang.includes('en-IN') || v.lang.includes('en-PH'))) ||
                      voices.find(v => v.lang.includes('en-US')) ||
                      voices.find(v => v.lang.includes('en'));
      if (enVoice) utterance.voice = enVoice;
      utterance.lang = 'en-SG';
    } else if (code === 'ms') {
      const msVoice = voices.find(v => (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('google')) && (v.lang.startsWith('ms') || v.name.toLowerCase().includes('malay')))
                    || voices.find(v => v.lang.startsWith('ms') || v.name.toLowerCase().includes('bahasa melayu'));
      
      if (msVoice) {
        utterance.voice = msVoice;
      }
      utterance.lang = 'ms-MY';
    }
    
    utterance.rate = speechRate; 
    utterance.pitch = 1.1; 
    window.speechSynthesis.speak(utterance);
  };

  const startRecording = (code: Language) => {
    if (activeRecording) return;
    setActiveRecording(code);
    if (recognitionRef.current) {
      recognitionRef.current.lang = code === 'zh' ? 'zh-CN' : code === 'en' ? 'en-US' : 'ms-MY';
      recognitionRef.current.start();
    }
  };
  
  const getActionHint = (zh: string) => {
    if (zh.includes('你好') || zh.includes('再见') || zh.includes('叫什么')) return { icon: '👋', text: '挥挥手说你好 / Wave your hand!' };
    if (zh.includes('几岁') || zh.includes('数数')) return { icon: '🖐️', text: '伸出手指比一下 / Show your fingers!' };
    if (zh.includes('画画') || zh.includes('写字')) return { icon: '✏️', text: '做个写字的动作 / Pretend to write!' };
    if (zh.includes('开心') || zh.includes('笑')) return { icon: '😊', text: '给一个大大的微笑 / Give a big smile!' };
    if (zh.includes('吃') || zh.includes('苹果') || zh.includes('大餐')) return { icon: '😋', text: '摸摸小肚子吧 / Pat your tummy!' };
    if (zh.includes('看') || zh.includes('漂亮') || zh.includes('彩虹')) return { icon: '👁️', text: '睁大眼睛看一看 / Open your eyes wide!' };
    if (zh.includes('谢谢') || zh.includes('请')) return { icon: '🙏', text: '很有礼貌地点点头 / Give a polite nod!' };
    if (zh.includes('玩') || zh.includes('分享') || zh.includes('积木')) return { icon: '🧸', text: '抱抱你的小玩具 / Hug your toy!' };
    return null;
  };

  const actionHint = getActionHint(item.translations.zh);

  const LangRow = ({ code, label, color, bg }: { code: Language, label: string, color: string, bg: string }) => (
    <div className={`w-full p-6 md:p-8 ${bg} backdrop-blur-md rounded-[32px] md:rounded-[48px] shadow-lg border-4 md:border-6 border-green-400 flex flex-col md:flex-row items-center gap-6 transition-all hover:shadow-2xl group ${
      activeRecording === code ? 'ring-12 ring-brand-teal/30 scale-[1.02]' : ''
    }`}>
      <div className="flex flex-row items-center gap-6 flex-1 w-full">
        <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center font-black ${color} bg-white shadow-xl text-xl md:text-2xl`}>
          {code.toUpperCase()}
        </div>
        
        <div className="flex-1">
          <div className={`font-bold text-brand-ink leading-tight ${code === 'zh' ? 'text-xl md:text-5xl font-black' : 'text-lg md:text-3xl'}`}>
            {item.translations[code]}
          </div>
          {code === 'zh' && item.pinyin && (
            <div className="text-sm md:text-xl font-bold text-brand-coral/60 mt-2 uppercase tracking-widest">{item.pinyin}</div>
          )}
        </div>
      </div>

      <div className="flex gap-4 w-full md:w-auto justify-end border-t md:border-t-0 md:border-l border-gray-200/30 pt-4 md:pt-0 md:pl-6">
        <button
          type="button"
          onClick={() => speak(code)}
          className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-[0_6px_0_rgba(0,0,0,0.15)] active:shadow-none active:translate-y-1 transition-all ${color.replace('text-', 'bg-')} text-white hover:brightness-110`}
          title={`听${label}`}
        >
          <Volume2 size={32} />
        </button>
        <button
          type="button"
          onClick={() => startRecording(code)}
          className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-[0_6px_0_rgba(0,0,0,0.15)] active:shadow-none active:translate-y-1 transition-all relative ${
            activeRecording === code 
              ? 'bg-orange-500 animate-pulse' 
              : mastered[code] 
                ? 'bg-green-500 shadow-[0_6px_0_#2F855A]' 
                : 'bg-white text-gray-400 border-2 border-gray-100'
          } hover:brightness-105`}
          title={`跟我读${label}`}
        >
          {mastered[code] ? (
            <CheckCircle2 size={32} className="text-white" />
          ) : (
            <Mic size={32} className={activeRecording === code ? 'text-white' : ''} />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl flex flex-col gap-3 p-4 md:p-6 mb-6 bg-[#F5F2E8] rounded-[40px] shadow-2xl"
    >
      {/* Visual Context Header - Larger */}
        <div className="relative w-full h-48 md:h-72 bg-white/20 backdrop-blur-md rounded-[30px] md:rounded-[40px] shadow-lg border-[4px] border-white/40 overflow-hidden mb-2 group flex items-center justify-center">
          <div className="w-full h-full bg-black/10 backdrop-blur-[2px] flex items-center justify-center">
            <img 
              src={item.imageUrl} 
              alt="Context" 
              className="h-[95%] w-auto object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-2xl"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className = 'flex items-center justify-center w-full h-full text-white/50';
                  fallback.innerHTML = `<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`;
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-3 left-6 flex items-center gap-3 text-white">
          <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center shadow-lg">
            <Languages size={24} className="text-brand-ink" />
          </div>
          <div className="font-black text-xl md:text-2xl uppercase tracking-wider text-white drop-shadow-md">{featureLabel.zh}</div>
        </div>
      </div>

      {actionHint && (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-violet-50 border border-violet-100 p-3 rounded-2xl flex items-center gap-3"
        >
          <span className="text-2xl animate-bounce-slow">{actionHint.icon}</span>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-violet-600 uppercase tracking-widest leading-none mb-1">Action Prompt</span>
            <span className="text-xs md:text-sm font-bold text-brand-ink leading-tight">{actionHint.text}</span>
          </div>
        </motion.div>
      )}
      
      <div className="flex flex-col gap-2.5 mt-2">
        <LangRow code="zh" label="Chinese / 中文" color="text-brand-coral" bg="bg-white/60" />
        <LangRow code="en" label="English / 英语" color="text-brand-teal" bg="bg-white/40" />
        <LangRow code="ms" label="Malay / 马来语" color="text-brand-yellow" bg="bg-white/20" />
      </div>

      <div className="flex items-center justify-center gap-2 text-[10px] font-black text-brand-muted opacity-40 uppercase tracking-[0.4em] mt-4">
        <Languages size={14} />
        <span>Try repeating all languages!</span>
      </div>
    </motion.div>
  );
};
