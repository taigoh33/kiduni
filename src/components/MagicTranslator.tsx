
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Type, 
  Mic, 
  Volume2, 
  Sparkles, 
  ChevronLeft, 
  Home, 
  Loader2, 
  Trash2,
  Languages,
  Keyboard,
  Send,
  CheckCircle2,
  Palette,
  Save,
  Calendar,
  Clock,
  FolderHeart,
  X,
  Square,
  Pause
} from 'lucide-react';
import { Language } from '../types';
import { LanguageSelector } from './LanguageSelector';
import { useUsageLimit } from '../hooks/useUsageLimit';

interface MagicTranslatorProps {
  onBack: () => void;
  onHome: () => void;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  isSubscribed?: boolean;
}

export const MagicTranslator: React.FC<MagicTranslatorProps> = ({ 
  onBack, 
  onHome,
  currentLang, 
  onLanguageChange,
  isSubscribed = false 
}) => {
  const [inputText, setInputText] = useState('');
  const [translation, setTranslation] = useState<string | null>(null);
  const [pinyin, setPinyin] = useState<string | null>(null);
  const [history, setHistory] = useState<{phrase: string, translation: string, pinyin: string, lang: 'en' | 'ms', timestamp: string}[]>(() => {
    const saved = localStorage.getItem('magic_translator_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [sourceLang, setSourceLang] = useState<'en' | 'ms'>('en');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState(0.7);
  const [isPaused, setIsPaused] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const currentSpeakingRef = useRef<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Keepalive interval to prevent SpeechSynthesis from timing out in Chrome
  useEffect(() => {
    let interval: any;
    if (isSpeaking && !isPaused) {
      interval = setInterval(() => {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          // Subtle pause/resume to keep the engine alive without audible gaps
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 2000); // Frequent heartbeat to prevent 4s cutoff
    }
    return () => clearInterval(interval);
  }, [isSpeaking, isPaused]);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [trilingualResults, setTrilingualResults] = useState<{zh: string, en: string, ms: string, pinyin?: string} | null>(null);
  
  const { isLimitReached, remaining, incrementUsage, limit } = useUsageLimit('magic_translator', isSubscribed);
  
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const speak = (text: string) => {
    // Chrome bug workaround: resume before cancel help clear stuck state
    window.speechSynthesis.resume();
    window.speechSynthesis.cancel();

    // Small delay for cancel to settle
    setTimeout(() => {
      currentSpeakingRef.current = text;
      const utterance = new SpeechSynthesisUtterance(text);
      
      // STRONG REFERENCE: Attach to window to prevent garbage collection in Chrome
      (window as any)._currentUtteranceMT = utterance;
      utteranceRef.current = utterance;
      
      // Find best Chinese voice
      const voices = window.speechSynthesis.getVoices();
      const zhVoice = voices.find(v => v.name.includes('Google') && v.lang.includes('zh-CN')) ||
                      voices.find(v => v.lang.includes('zh-CN')) || 
                      voices.find(v => v.lang.includes('zh'));
      
      if (zhVoice) utterance.voice = zhVoice;
      utterance.lang = 'zh-CN';
      utterance.rate = speechRate;
      utterance.pitch = 1.1;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        currentSpeakingRef.current = null;
        utteranceRef.current = null;
        (window as any)._currentUtteranceMT = null;
      };
      utterance.onerror = (event) => {
        console.error("Speech error", event);
        setIsSpeaking(false);
        setIsPaused(false);
        currentSpeakingRef.current = null;
        utteranceRef.current = null;
        (window as any)._currentUtteranceMT = null;
      };

      window.speechSynthesis.speak(utterance);
    }, 50);
  };

  const toggleSpeech = (text: string) => {
    if (currentSpeakingRef.current === text && isSpeaking) {
      // If already speaking this text, clicking the main button will STOP it
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      currentSpeakingRef.current = null;
      return;
    }
    
    // If speaking something else or nothing, start speaking this
    speak(text);
  };

  const togglePause = () => {
    if (!isSpeaking) return;
    
    if (isPaused) {
      setIsPaused(false);
      window.speechSynthesis.resume();
      
      // Robust resume check
      let attempts = 0;
      const checkResume = setInterval(() => {
        attempts++;
        if (!window.speechSynthesis.paused || attempts > 10) {
          clearInterval(checkResume);
        } else {
          window.speechSynthesis.resume();
        }
      }, 100);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  useEffect(() => {
    localStorage.setItem('magic_translator_history', JSON.stringify(history));
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [history]);

  const handleTranslate = async (textToTranslate: string = inputText) => {
    if (!textToTranslate.trim()) return;
    
    if (isLimitReached) {
      setErrorMessage(
        currentLang === 'zh' ? `您已达到今日翻译限制（${limit}次）。` : 
        currentLang === 'ms' ? `Anda telah mencapai had terjemahan harian (${limit} kali).` : 
        `You have reached your daily limit (${limit} times).`
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setTranslation(null);
    setTrilingualResults(null);

    // This mechanism allows us to "stop" by ignoring the promise result
    let isAborted = false;
    (window as any)._stopTrans = () => {
      isAborted = true;
      setIsLoading(false);
      setErrorMessage(currentLang === 'zh' ? '魔法已停止' : 'Magic stopped');
    };

    try {
      console.log("Starting translation for:", textToTranslate);

      // Timeout to prevent indefinite loading in UI
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);
      
      const response = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToTranslate, sourceLang }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      if (isAborted) return;
      
      if (!response.ok) {
        let errorMsg = "Translation failed";
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch (e) {
          // If not JSON, use default
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      
      if (!data.zh) {
        throw new Error("Translation content is empty");
      }

      setTranslation(data.zh);
      setPinyin(data.pinyin);
      setTrilingualResults({ zh: data.zh, en: data.en, ms: data.ms, pinyin: data.pinyin });
      
      incrementUsage();

      // Add to history (avoid duplicates at top)
      setHistory(prev => {
        const now = new Date();
        const timestamp = now.toLocaleString(currentLang === 'zh' ? 'zh-CN' : currentLang === 'ms' ? 'ms-MY' : 'en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
        const newItem = { phrase: textToTranslate, translation: data.zh, pinyin: data.pinyin, lang: sourceLang, timestamp };
        const filtered = prev.filter(item => item.phrase !== textToTranslate);
        return [newItem, ...filtered].slice(0, 100);
      });

      speak(data.zh);
    } catch (error: any) {
      if (isAborted) return;
      console.error("Translation failed:", error);
      if (error.name === 'AbortError') {
        setErrorMessage(currentLang === 'zh' ? '网络较慢或超时，请再试一次' : 'Network timeout. Please try again.');
      } else {
        setErrorMessage(currentLang === 'zh' ? (error.message.includes('API Key') ? 'AI 认证失败，请检查设置' : '翻译失败，请稍后再试') : `Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMessage(currentLang === 'zh' ? '您的浏览器不支持语音输入' : 'Voice input not supported in this browser.');
      return;
    }

    if (isRecording) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {
        setIsRecording(false);
      }
      return;
    }

    setErrorMessage(null);
    setIsRecording(true);

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = sourceLang === 'en' ? 'en-US' : 'ms-MY';

      recognition.onstart = () => {
        console.log('Recognition started');
        setIsRecording(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            const transcript = event.results[i][0].transcript;
            console.log('Final Result:', transcript);
            setInputText(transcript);
            setTimeout(() => {
              handleTranslate(transcript);
            }, 300);
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        if (interimTranscript) {
          setInputText(interimTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage(currentLang === 'zh' ? '请允许麦克风权限' : 'Microphone permission denied.');
        } else if (event.error !== 'no-speech') {
          setErrorMessage(currentLang === 'zh' ? '语音识别错误，请重试' : 'Voice error. Please try again.');
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        console.log('Recognition ended');
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start recognition:', err);
      setIsRecording(false);
      setErrorMessage(currentLang === 'zh' ? '无法启动语音识别' : 'Could not start voice recognition.');
    }
  };

  const clear = () => {
    setInputText('');
    setTranslation(null);
    setErrorMessage(null);
  };

  const deleteHistoryItem = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setHistory(prev => prev.filter((_, i) => i !== index));
  };

  const saveToHistory = () => {
    if (!translation || !inputText) return;
    
    setHistory(prev => {
      const now = new Date();
      const timestamp = now.toLocaleString(currentLang === 'zh' ? 'zh-CN' : currentLang === 'ms' ? 'ms-MY' : 'en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      const newItem = { phrase: inputText, translation, pinyin: pinyin || "", lang: sourceLang, timestamp };
      const filtered = prev.filter(item => item.phrase !== inputText);
      return [newItem, ...filtered].slice(0, 10);
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-4xl p-4 md:p-6 pb-32 relative">
      {/* Top Navigation Row */}
      <div className="w-full flex justify-between items-center px-2 z-[300] mb-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="bg-white/90 hover:bg-white text-emerald-600 px-3 md:px-5 py-2 md:py-3 rounded-2xl font-black flex items-center gap-2 border-2 border-emerald-500/30 transition-all shadow-lg group text-xs md:text-sm"
        >
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform w-4 h-4 md:w-5 md:h-5" /> 
          <span>{currentLang === 'zh' ? '返回' : currentLang === 'ms' ? 'Kembali' : 'Back'}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsHistoryOpen(true)}
          className="bg-white/90 hover:bg-white text-emerald-600 px-3 md:px-5 py-2 md:py-3 rounded-2xl font-black flex items-center gap-2 border-2 border-emerald-500/30 transition-all shadow-lg group text-xs md:text-sm"
        >
          <FolderHeart className="group-hover:scale-110 transition-transform w-4 h-4 md:w-5 md:h-5" /> 
          <span>{currentLang === 'zh' ? '记录夹' : currentLang === 'ms' ? 'Folder Simpan' : 'Save Folder'}</span>
          {history.length > 0 && (
            <span className="bg-emerald-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
              {history.length}
            </span>
          )}
        </motion.button>
      </div>

      {/* Top Header Section with Logo and Language Selector */}
      <div className="w-full flex flex-col items-center gap-4 mb-2 z-[260]">
        {/* Company Logo Link - KIDUNI */}
        <div className="flex justify-center pointer-events-auto">
          <div className="block transform hover:scale-110 transition-transform">
            <img src="https://i.ibb.co/TM3WwYjQ/1000046067-removebg-preview.png" alt="KIDUNI" border="0" className="h-24 md:h-40 w-auto object-contain" referrerPolicy="no-referrer" />
          </div>
        </div>
        {/* Trilingual Template (Language Selector) */}
        <div className="flex justify-center">
          <LanguageSelector currentLang={currentLang} onLanguageChange={onLanguageChange} />
        </div>
      </div>

      {/* Header */}
      <div className="w-full flex justify-between items-center bg-white/80 backdrop-blur-md p-6 rounded-[32px] border-8 border-brand-teal shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-teal rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Languages size={24} />
          </div>
          <div className="text-left font-sans">
            <h2 className="text-2xl md:text-3xl font-black text-brand-teal leading-tight">
              {currentLang === 'zh' ? 'AI 魔法三语翻译' : currentLang === 'ms' ? 'AI Terjemahan Sakti' : 'AI Magic Translator'}
            </h2>
            <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mt-1">Write & Listen in Chinese</p>
          </div>
        </div>
        <button 
          onClick={onHome}
          className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl flex items-center justify-center border-4 border-brand-teal/20 shadow-md hover:bg-teal-50 transition-all"
        >
          <Home className="text-brand-teal" />
        </button>
      </div>

      {/* Main Translation UI */}
      <div className="w-full grid md:grid-cols-2 gap-6 items-stretch">
        {/* Input Card */}
        <div className="bg-white rounded-[40px] p-8 border-8 border-brand-teal shadow-xl flex flex-col gap-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Keyboard className="text-brand-teal" size={20} />
              <span className="font-black text-brand-teal text-sm uppercase tracking-wider">
                {currentLang === 'zh' ? '输入内容' : currentLang === 'ms' ? 'Masukkan Teks' : 'Input Content'}
              </span>
            </div>
            
            {/* Lang Switcher */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setSourceLang('en')}
                className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${sourceLang === 'en' ? 'bg-brand-teal text-white shadow-sm' : 'text-gray-400'}`}
              >
                EN
              </button>
              <button
                onClick={() => setSourceLang('ms')}
                className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${sourceLang === 'ms' ? 'bg-brand-teal text-white shadow-sm' : 'text-gray-400'}`}
              >
                MS
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              onKeyUp={(e) => e.stopPropagation()}
              onKeyPress={(e) => e.stopPropagation()}
              placeholder={currentLang === 'zh' ? '输入英文或马来文...' : currentLang === 'ms' ? 'Masukkan teks Bahasa Inggeris atau Melayu...' : 'Type English or Malay...'}
              className="w-full h-40 bg-gray-50 rounded-2xl p-4 text-lg font-bold text-brand-ink outline-none border-2 border-transparent focus:border-brand-teal/30 resize-none transition-all"
            />
            
            <AnimatePresence>
              {inputText.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={clear}
                  className="absolute top-2 right-2 p-2 bg-gray-200 hover:bg-gray-300 text-gray-500 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-3">
            <button
              onClick={toggleRecording}
              className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-black transition-all border-b-4 ${
                isRecording 
                  ? 'bg-rose-500 text-white border-rose-700 animate-pulse' 
                  : 'bg-indigo-500 text-white border-indigo-700 hover:brightness-110 active:translate-y-1 active:border-b-0'
              }`}
            >
              {isRecording ? <Loader2 className="animate-spin" /> : <Mic size={20} />}
              <span>{isRecording ? (currentLang === 'zh' ? '正在听...' : 'Listening...') : (currentLang === 'zh' ? '语音输入' : 'Voice')}</span>
            </button>

            <button
              onClick={() => {
                if (isLoading) {
                  const stop = (window as any)._stopTrans;
                  if (stop) stop();
                } else {
                  handleTranslate();
                }
              }}
              disabled={(!inputText.trim() && !isLoading) || (isLimitReached && !isLoading)}
              className={`flex-1 py-4 rounded-2xl flex flex-col items-center justify-center gap-0 font-black transition-all border-b-4 ${
                (!inputText.trim() && !isLoading) || (isLimitReached && !isLoading)
                  ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                  : isLoading
                    ? 'bg-rose-500 text-white border-rose-700 hover:brightness-110 active:translate-y-1 active:border-b-0 shadow-lg'
                    : 'bg-brand-teal text-white border-teal-700 hover:brightness-110 active:translate-y-1 active:border-b-0'
              }`}
            >
              <div className="flex items-center gap-2">
                {isLoading ? <Square className="animate-pulse" size={20} fill="white" /> : <Send size={20} />}
                <span>{isLoading ? (currentLang === 'zh' ? '停止' : 'STOP') : (currentLang === 'zh' ? '点击翻译' : currentLang === 'ms' ? 'Terjemah' : 'Translate')}</span>
              </div>
              {!isLoading && (
                <span className="text-[10px] opacity-70 tracking-tighter">
                  {currentLang === 'zh' ? `剩余: ${remaining}/${limit}` : currentLang === 'ms' ? `Baki: ${remaining}/${limit}` : `Rem: ${remaining}/${limit}`}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Output Card */}
        <div className="bg-brand-teal rounded-[40px] p-8 border-8 border-white shadow-xl flex flex-col gap-6 relative min-h-[400px]">
          <div className="flex items-center gap-2">
            <Sparkles className="text-white" size={20} />
            <span className="font-black text-white text-sm uppercase tracking-wider">
              {currentLang === 'zh' ? '魔法中文翻译' : currentLang === 'ms' ? 'Terjemahan Mandarin' : 'Magic Chinese'}
            </span>
          </div>

          <div className="flex-1 bg-white/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative min-h-[200px]">
            {isLoading ? (
              <div className="flex flex-col items-center gap-4 text-white">
                <Loader2 className="w-12 h-12 animate-spin" />
                <p className="font-black animate-pulse uppercase text-xs tracking-widest">
                  {currentLang === 'zh' ? '魔法正在运作...' : 'Magic in progress...'}
                </p>
              </div>
            ) : trilingualResults ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6 w-full"
              >
                <div className="flex flex-col items-center gap-6 w-full">
                  {/* Chinese - Main focus */}
                  <div className="flex flex-col items-center">
                    {trilingualResults.pinyin && (
                      <span className="text-sm font-black text-white/70 uppercase tracking-widest mb-1">
                        {trilingualResults.pinyin}
                      </span>
                    )}
                    <h3 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg leading-tight">
                      {trilingualResults.zh}
                    </h3>
                  </div>

                  {/* Other two languages - smaller */}
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="bg-white/10 p-3 rounded-2xl border border-white/20">
                      <p className="text-[10px] font-black text-white/50 uppercase tracking-wider mb-1">English</p>
                      <p className="text-sm font-bold text-white">{trilingualResults.en}</p>
                    </div>
                    <div className="bg-white/10 p-3 rounded-2xl border border-white/20">
                      <p className="text-[10px] font-black text-white/50 uppercase tracking-wider mb-1">Malay</p>
                      <p className="text-sm font-bold text-white">{trilingualResults.ms}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSpeech(trilingualResults.zh)}
                      className={`w-16 h-16 ${currentSpeakingRef.current === trilingualResults.zh ? 'bg-rose-500' : 'bg-white'} text-brand-teal rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all border-4 border-white/20`}
                      title={currentLang === 'zh' ? (currentSpeakingRef.current === trilingualResults.zh ? '停止' : '朗读') : (currentSpeakingRef.current === trilingualResults.zh ? 'Stop' : 'Speak')}
                    >
                      {currentSpeakingRef.current === trilingualResults.zh ? <Square fill="white" size={24} /> : <Volume2 size={32} />}
                    </button>

                    {currentSpeakingRef.current === trilingualResults.zh && (
                      <button
                        onClick={togglePause}
                        className={`w-16 h-16 ${isPaused ? 'bg-emerald-500' : 'bg-amber-400'} text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all border-4 border-white/20`}
                        title={currentLang === 'zh' ? (isPaused ? '继续' : '暂停') : (isPaused ? 'Resume' : 'Pause')}
                      >
                        {isPaused ? <Volume2 size={32} /> : <Pause size={32} fill="currentColor" />}
                      </button>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={saveToHistory}
                      className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all border-b-4 border-emerald-700"
                      title={currentLang === 'zh' ? '记录' : 'Save'}
                    >
                      <Save size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-white/60 flex flex-col items-center gap-3">
                <Languages size={48} className="opacity-30" />
                <p className="text-sm font-bold italic">
                  {currentLang === 'zh' ? '等待输入魔法...' : 'Awaiting input magic...'}
                </p>
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-500 text-white rounded-xl text-xs font-black text-center">
              {errorMessage}
            </div>
          )}

          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="text-white/40" size={16} />
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">
              Trilingual Sync · Trilingual Magic
            </span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl mt-8 flex flex-col items-center gap-4">
        {/* Global Speed Controller */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md px-8 py-4 rounded-[32px] border-4 border-brand-teal shadow-xl flex flex-col items-center gap-2"
        >
          <div className="flex items-center gap-4">
            <Volume2 className="text-brand-teal" size={20} />
            <span className="text-xs font-black text-brand-teal uppercase tracking-widest">0.4x</span>
            <input 
              type="range" 
              min="0.4" 
              max="1.2" 
              step="0.1" 
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="w-32 md:w-64 h-2 bg-brand-teal/20 rounded-lg appearance-none cursor-pointer accent-brand-teal"
            />
            <span className="text-xs font-black text-brand-teal uppercase tracking-widest">1.2x</span>
          </div>
          <p className="text-[10px] font-black text-brand-teal uppercase tracking-[0.2em]">
            {currentLang === 'zh' ? `语音播放语速: ${speechRate}x` : currentLang === 'ms' ? `Kelajuan Suara: ${speechRate}x` : `Speech Rate: ${speechRate}x`}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mt-4"
        >
          <p className="text-brand-teal font-black italic">
            {currentLang === 'zh' ? '“让学习变得像说话一样自然。”' : ' "Making learning as natural as speaking." '}
          </p>
        </motion.div>
      </div>

      {/* History Modal (Save Folder) */}
      <AnimatePresence>
        {isHistoryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-brand-ink/40 backdrop-blur-md p-4 md:p-12 flex items-center justify-center"
            onClick={() => setIsHistoryOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl max-h-[80vh] rounded-[48px] border-8 border-brand-teal shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 md:p-8 bg-brand-teal text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <FolderHeart size={32} />
                  <div>
                    <h2 className="text-2xl font-black">{currentLang === 'zh' ? '记录夹' : currentLang === 'ms' ? 'Folder Simpan' : 'Save Folder'}</h2>
                    <p className="text-xs font-bold opacity-70 uppercase tracking-widest">
                      {history.length} {currentLang === 'zh' ? '个记录' : 'recordings'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsHistoryOpen(false)}
                  className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center transition-colors shadow-inner"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50">
                {history.length > 0 ? (
                  <div className="grid gap-4">
                    {history.map((item, idx) => (
                      <motion.div
                        key={`${item.phrase}-${idx}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white p-4 rounded-3xl border-2 border-brand-teal/10 flex items-center justify-between group hover:border-brand-teal transition-all shadow-sm"
                      >
                        <div 
                          className="flex-1 flex flex-col items-start gap-1 cursor-pointer"
                          onClick={() => {
                            setTranslation(item.translation);
                            setPinyin(item.pinyin);
                            setInputText(item.phrase);
                            speak(item.translation);
                            setIsHistoryOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-brand-teal/50 uppercase">{item.lang}</span>
                            <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400">
                              <Calendar size={10} />
                              <span>{item.timestamp}</span>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-brand-ink">{item.phrase}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-teal-600/60 leading-none mb-1">{item.pinyin}</p>
                            <p className="text-base font-black text-brand-teal">{item.translation}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                speak(item.translation);
                              }}
                              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                isSpeaking && currentSpeakingRef.current === item.translation
                                  ? 'bg-rose-500 text-white animate-pulse'
                                  : 'bg-brand-teal/10 text-brand-teal hover:bg-brand-teal hover:text-white'
                              }`}
                            >
                              {isSpeaking && currentSpeakingRef.current === item.translation && !isPaused ? (
                                <Square size={18} fill="currentColor" />
                              ) : (
                                <Volume2 size={20} />
                              )}
                            </button>
                            <button
                              onClick={(e) => deleteHistoryItem(e, idx)}
                              className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors border border-rose-100"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
                    <FolderHeart size={64} className="opacity-10" />
                    <p className="font-bold italic">
                      {currentLang === 'zh' ? '记录夹还是空的哦' : 'Save folder is empty'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
