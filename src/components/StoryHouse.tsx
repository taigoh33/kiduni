import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Sparkles, Wand2, Trash2, Share2, Save, Award, RotateCcw, Home, Download, Loader2, ChevronLeft, Square, Volume2 } from 'lucide-react';
import { Language } from '../types';
import { useUsageLimit } from '../hooks/useUsageLimit';
import { AchievementShare } from './AchievementShare';

import { LanguageSelector } from './LanguageSelector';

interface StoryHouseProps {
  onBack: () => void;
  onHome: () => void;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  isSubscribed?: boolean;
}

const THEMES = [
  { id: 'courage', emoji: '🦁', color: 'from-orange-400 to-red-500', label: { zh: '勇敢冒险', en: 'Courage', ms: 'Keberanian' } },
  { id: 'kindness', emoji: '🤝', color: 'from-pink-400 to-rose-500', label: { zh: '善良互助', en: 'Kindness', ms: 'Kebaikan' } },
  { id: 'curiosity', emoji: '🚀', color: 'from-indigo-400 to-blue-600', label: { zh: '探索宇宙', en: 'Curiosity', ms: 'Sifat Ingin Tahu' } },
  { id: 'nature', emoji: '🌳', color: 'from-emerald-400 to-green-600', label: { zh: '爱护自然', en: 'Nature', ms: 'Alam Sekitar' } },
  { id: 'forest', emoji: '🍄', color: 'from-teal-400 to-cyan-600', label: { zh: '魔法森林', en: 'Magic Forest', ms: 'Hutan Ajaib' } },
  { id: 'dino', emoji: '🦖', color: 'from-lime-400 to-green-500', label: { zh: '恐龙世界', en: 'Dinosaurs', ms: 'Dunia Dinosaur' } },
  { id: 'ocean', emoji: '🧜‍♀️', color: 'from-blue-400 to-indigo-600', label: { zh: '深海历险', en: 'Deep Sea', ms: 'Kembara Lautan' } },
  { id: 'robot', emoji: '🤖', color: 'from-slate-400 to-gray-600', label: { zh: '机器人', en: 'Robot Pal', ms: 'Sahabat Robot' } },
  { id: 'food', emoji: '🍰', color: 'from-yellow-300 to-orange-500', label: { zh: '美味王国', en: 'Yummy Land', ms: 'Kerajaan Makanan' } },
  { id: 'garden', emoji: '🦊', color: 'from-purple-400 to-fuchsia-600', label: { zh: '动物秘密', en: 'Secret Garden', ms: 'Rahsia Haiwan' } },
  { id: 'space', emoji: '🌌', color: 'from-slate-800 to-indigo-900', label: { zh: '浩瀚星空', en: 'Infinite Space', ms: 'Angkasa Lepas' } },
  { id: 'fairytale', emoji: '🏰', color: 'from-pink-300 to-purple-500', label: { zh: '童话城堡', en: 'Fairy Castle', ms: 'Istana Kayangan' } },
  { id: 'dragon', emoji: '🐉', color: 'from-red-400 to-orange-600', label: { zh: '飞龙传说', en: 'Dragon Legend', ms: 'Lagenda Naga' } },
  { id: 'music', emoji: '🎸', color: 'from-blue-400 to-cyan-500', label: { zh: '音乐大餐', en: 'Music Feast', ms: 'Pesta Muzik' } },
  { id: 'sports', emoji: '⚽', color: 'from-green-400 to-emerald-600', label: { zh: '运动快乐', en: 'Sports Fun', ms: 'Keseronokan Sukan' } },
  { id: 'weather', emoji: '🌈', color: 'from-sky-300 to-blue-500', label: { zh: '彩虹故事', en: 'Rainbow Story', ms: 'Cerita Pelangi' } },
  { id: 'underwater', emoji: '🐙', color: 'from-indigo-500 to-purple-700', label: { zh: '章鱼伙伴', en: 'Octopus Friend', ms: 'Sahabat Sotong' } },
  { id: 'jungle', emoji: '🐅', color: 'from-amber-400 to-orange-700', label: { zh: '丛林冒险', en: 'Jungle Adventure', ms: 'Kembara Rimba' } },
  { id: 'circus', emoji: '🎪', color: 'from-rose-400 to-red-600', label: { zh: '马戏表演', en: 'Circus Show', ms: 'Persembahan Sarkas' } },
  { id: 'farm', emoji: '🚜', color: 'from-yellow-400 to-amber-600', label: { zh: '快乐农场', en: 'Happy Farm', ms: 'Ladang Ceria' } },
  { id: 'magic_brush', emoji: '🖌️', color: 'from-blue-300 to-indigo-500', label: { zh: '神奇画笔', en: 'Magic Brush', ms: 'Berus Ajaib' } },
  { id: 'cloud_king', emoji: '☁️', color: 'from-sky-200 to-blue-400', label: { zh: '云顶王国', en: 'Cloud Kingdom', ms: 'Kerajaan Awan' } },
  { id: 'detective_cat', emoji: '🐱', color: 'from-orange-300 to-amber-500', label: { zh: '小猫侦探', en: 'Detective Cat', ms: 'Kucing Detektif' } },
  { id: 'moon_library', emoji: '🌙', color: 'from-slate-700 to-indigo-800', label: { zh: '月亮图书馆', en: 'Moon Library', ms: 'Perpustakaan Bulan' } },
  { id: 'underground', emoji: '🕳️', color: 'from-stone-500 to-neutral-700', label: { zh: '地底大冒险', en: 'Underground', ms: 'Kembara Bawah' } },
  { id: 'season_wizard', emoji: '🧙‍♂️', color: 'from-emerald-300 to-teal-500', label: { zh: '四季魔法师', en: 'Season Wizard', ms: 'Ahli Sihir Musim' } },
  { id: 'paper_plane', emoji: '✈️', color: 'from-cyan-200 to-sky-400', label: { zh: '纸飞机旅行', en: 'Paper Plane', ms: 'Kapal Terbang Kertas' } },
  { id: 'shadow_magic', emoji: '👤', color: 'from-zinc-600 to-slate-800', label: { zh: '影子戏法', en: 'Shadow Magic', ms: 'Sihir Bayang' } },
  { id: 'firefly_light', emoji: '💡', color: 'from-yellow-200 to-lime-400', label: { zh: '萤火虫之光', en: 'Firefly Light', ms: 'Cahaya Kunang' } },
  { id: 'candy_courier', emoji: '🍬', color: 'from-pink-300 to-rose-400', label: { zh: '糖果快递员', en: 'Candy Courier', ms: 'Penghantar Gula' } },
  { id: 'time_camera', emoji: '📷', color: 'from-amber-500 to-yellow-600', label: { zh: '时光照相机', en: 'Time Camera', ms: 'Kamera Masa' } },
  { id: 'colored_rain', emoji: '🌈', color: 'from-cyan-300 to-blue-500', label: { zh: '彩色雨点', en: 'Colored Rain', ms: 'Hujan Berwarna' } },
  { id: 'sock_monster', emoji: '🧦', color: 'from-teal-300 to-emerald-500', label: { zh: '袜子怪兽', en: 'Sock Monster', ms: 'Raksasa Stoking' } },
  { id: 'talking_breakfast', emoji: '🍳', color: 'from-orange-200 to-yellow-400', label: { zh: '会说话的早餐', en: 'Talking Breakfast', ms: 'Sarapan Berkata' } },
  { id: 'aurora_slide', emoji: '🌌', color: 'from-indigo-400 to-purple-600', label: { zh: '极光滑梯', en: 'Aurora Slide', ms: 'Gelongsor Aurora' } },
  { id: 'repair_shop', emoji: '🛠️', color: 'from-slate-300 to-gray-500', label: { zh: '机器人修理铺', en: 'Robot Repair', ms: 'Kedai Baiki Robot' } },
  { id: 'submarine', emoji: '🌊', color: 'from-blue-600 to-blue-800', label: { zh: '深海潜水艇', en: 'Deep-Sea Sub', ms: 'Kapal Selam Laut' } },
  { id: 'shadow_party', emoji: '👥', color: 'from-violet-500 to-indigo-700', label: { zh: '影子王国的派对', en: 'Shadow Kingdom', ms: 'Kerajaan Bayang' } },
  { id: 'music_woods', emoji: '🎶', color: 'from-emerald-400 to-teal-600', label: { zh: '音乐森林', en: 'Musical Forest', ms: 'Hutan Muzik' } },
  { id: 'star_mail', emoji: '⭐', color: 'from-yellow-200 to-amber-400', label: { zh: '星星邮局', en: 'Star Post', ms: 'Pejabat Pos Bintang' } },
  { id: 'new_year', emoji: '🏮', color: 'from-red-500 to-orange-600', label: { zh: '欢度新年', en: 'New Year', ms: 'Tahun Baru' } },
  { id: 'mid_autumn', emoji: '🥮', color: 'from-amber-300 to-yellow-500', label: { zh: '中秋月圆', en: 'Mid-Autumn', ms: 'Pesta Tanglung' } },
  { id: 'birthday', emoji: '🎂', color: 'from-pink-400 to-purple-500', label: { zh: '生日惊喜', en: 'Birthday', ms: 'Hari Jadi' } },
  { id: 'grandma', emoji: '🏡', color: 'from-green-200 to-emerald-400', label: { zh: '外婆的小院', en: 'Grandma House', ms: 'Rumah Nenek' } },
  { id: 'childhood', emoji: '🧸', color: 'from-orange-200 to-yellow-400', label: { zh: '小时候的玩具', en: 'Childhood Toys', ms: 'Mainan Kecil' } },
  { id: 'magic_bakery', emoji: '🥐', color: 'from-amber-400 to-orange-500', label: { zh: '魔法面包店', en: 'Magic Bakery', ms: 'Kedai Roti Ajaib' } },
  { id: 'flying_bed', emoji: '🛌', color: 'from-blue-300 to-indigo-400', label: { zh: '会飞的小床', en: 'Flying Bed', ms: 'Katil Terbang' } },
  { id: 'animal_band', emoji: '🎻', color: 'from-purple-300 to-pink-500', label: { zh: '动物领唱者', en: 'Animal Band', ms: 'Kumpulan Haiwan' } },
  { id: 'treasure_map', emoji: '🗺️', color: 'from-yellow-600 to-amber-800', label: { zh: '神秘藏宝图', en: 'Treasure Map', ms: 'Peta Harta' } },
  { id: 'bubble_park', emoji: '🫧', color: 'from-sky-300 to-cyan-400', label: { zh: '泡泡乐园', en: 'Bubble Park', ms: 'Taman Buih' } },
];

export const StoryHouse: React.FC<StoryHouseProps> = ({ onBack, onHome, currentLang, onLanguageChange, isSubscribed = false }) => {
  const lang = currentLang; // Use prop instead of local state for consistency across app
  const [theme, setTheme] = useState(THEMES[0]);
  const [story, setStory] = useState<{ title: string; content: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customDescription, setCustomDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [childName, setChildName] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);
  
  const { isLimitReached, remaining, incrementUsage, limit } = useUsageLimit('ai_tools', isSubscribed);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastText, setLastText] = useState('');
  const [speechRate, setSpeechRate] = useState(0.7);

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const speak = (text: string, l: Language) => {
    if (isSpeaking && lastText === text) {
      stopSpeaking();
      return;
    }

    stopSpeaking();
    setLastText(text);

    const utterance = new SpeechSynthesisUtterance(text);
    
    let voiceLang = 'en-US';
    if (l === 'zh') voiceLang = 'zh-CN';
    else if (l === 'ms') voiceLang = 'ms-MY';
    
    // Find voice
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(voiceLang)) || voices.find(v => v.lang.includes(voiceLang));
    
    if (voice) utterance.voice = voice;
    utterance.lang = voiceLang;
    utterance.rate = speechRate;
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };
  
  const handleShare = async () => {
    if (story && navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          text: story.content,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      const text = `${story?.title}\n\n${story?.content}`;
      await navigator.clipboard.writeText(text);
      alert(lang === 'zh' ? '已复制故事内容，您可以粘贴分享！' : lang === 'ms' ? 'Kandungan disalin!' : 'Story copied to clipboard!');
    }
  };

  useEffect(() => {
    if (customDescription.trim()) {
      const isTooLong = lang === 'zh' 
        ? customDescription.length > 20 
        : customDescription.split(/\s+/).filter(Boolean).length > 20;
      
      if (!isTooLong && (errorMessage?.includes('限制') || errorMessage?.includes('limit'))) {
        setErrorMessage(null);
      }
    }
  }, [customDescription, lang, errorMessage]);

  const handleSave = () => {
    if (story) {
      try {
        const savedKey = 'bedtime_stories_vault';
        const existingData = localStorage.getItem(savedKey);
        const savedStories = existingData ? JSON.parse(existingData) : [];
        
        const newStory = {
          ...story,
          id: Date.now().toString(),
          date: new Date().toLocaleDateString(),
          theme: theme.label[lang],
          lang: lang,
          studentName: childName || undefined
        };
        
        localStorage.setItem(savedKey, JSON.stringify([newStory, ...savedStories].slice(0, 200)));
        setShowSaveToast(true);
        setTimeout(() => setShowSaveToast(false), 3000);
      } catch (err) {
        console.error('Save failed:', err);
        setErrorMessage('Could not save story to local storage.');
      }
    }
  };

  const [loadingStep, setLoadingStep] = useState(0);
  const storyRef = useRef<HTMLDivElement>(null);

  const [hasScrolled, setHasScrolled] = useState(false);

  // Auto-scroll to result when story starts appearing
  useEffect(() => {
    if (story && story.content.length > 50 && !isLoading && !hasScrolled) {
      setTimeout(() => {
        storyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setHasScrolled(true);
      }, 100);
    }
    // Reset scroll flag if story is cleared (new story)
    if (!story || !story.content) {
      setHasScrolled(false);
    }
  }, [story?.content, isLoading, hasScrolled]);

  const loadingMessages = lang === 'zh' 
    ? ["正在构思奇妙世界...", "正在为主角挑选冒险...", "正在编织童话细节...", "正在准备最后的惊喜..."]
    : lang === 'ms'
    ? ["Membayangkan dunia ajaib...", "Memilih pengembaraan...", "Menyusun butiran cerita...", "Menyediakan kejutan..."]
    : ["Imagining a magical world...", "Picking an adventure...", "Weaving story details...", "Preparing surprises..."];

  const generateStory = async () => {
    // Check length strictly before anything else
    const isTooLong = lang === 'zh' 
      ? customDescription.length > 20 
      : customDescription.split(/\s+/).filter(Boolean).length > 20;

    if (isTooLong) {
      setErrorMessage(lang === 'zh' ? '描述字数超出限制（最多20字），无法生成。' : 'Description exceeds limit (max 20 words), generation blocked.');
      return;
    }

    if (isLimitReached) {
      setErrorMessage(lang === 'zh' ? `您已达到今日生成限制（${limit}次）。请明天再来！` : `You have reached your daily limit (${limit} times). Please come back tomorrow!`);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setStory({ title: lang === 'zh' ? '正在开启魔法...' : 'Opening Magic...', content: '' });
    setHasScrolled(false);

    // Abort mechanism
    let isAborted = false;
    (window as any)._stopStory = () => {
      isAborted = true;
      setIsLoading(false);
      setErrorMessage(lang === 'zh' ? '魔法已停止' : 'Magic stopped');
    };

    const msgInterval = setInterval(() => {
      setLoadingStep(prev => (prev + 1) % loadingMessages.length);
    }, 1500);

    try {
       const themeLabel = theme.label[lang];
       const response = await fetch("/api/ai/generate-story", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ 
           theme: themeLabel, 
           customDescription, 
           childName, 
           lang 
         })
       });

       if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.error || "Generation failed");
       }

       const { story: fullText } = await response.json();
       if (!fullText) throw new Error("AI returned no results. Please try again.");

       if (isAborted) return;

       const titleMatch = fullText.match(/TITLE:\s*(.*?)(?:\n|CONTENT:|$)/i);
       const contentMatch = fullText.match(/CONTENT:\s*([\s\S]*)$/i);
       
       if (titleMatch || contentMatch) {
         setStory({
           title: titleMatch ? titleMatch[1].trim() : (lang === 'zh' ? '魔法故事' : 'Magic Story'),
           content: contentMatch ? contentMatch[1].trim().replace(/^CONTENT:\s*/i, '') : fullText
         });
       } else {
         setStory({
           title: lang === 'zh' ? '魔法故事' : 'Magic Story',
           content: fullText
         });
       }
       
       if (!isAborted) {
         incrementUsage();
         setIsLoading(false);
         clearInterval(msgInterval);
       }
    } catch (error: any) {
      if (isAborted) return;
      console.error("Story generation failed:", error);
      if (error.message === 'TIMEOUT') {
        setErrorMessage(lang === 'zh' ? '魔法能量不稳定，请稍后再试' : 'Magic energy unstable. Please try again.');
      } else {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to generate story. Please try again.');
      }
      setIsLoading(false);
      clearInterval(msgInterval);
    } finally {
      if (!isAborted) {
        setIsLoading(false);
        clearInterval(msgInterval);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 md:gap-8 w-full max-w-4xl px-2 md:px-6 pb-32">
      <div className="w-full flex justify-start mb-2">
        <button
          onClick={onBack}
          className="bg-white/90 p-2 md:p-3 rounded-2xl border-2 md:border-4 border-orange-400 shadow-lg flex items-center gap-2 font-black text-orange-600 transition-transform active:scale-95"
        >
          <ChevronLeft /> 
          <span className="hidden sm:inline lowercase first-letter:uppercase">
            {lang === 'zh' ? '返回' : lang === 'ms' ? 'Kembali' : 'Back'}
          </span>
        </button>
      </div>

      {/* Top Header Section with Logo and Language Selector */}
      <div className="w-full flex flex-col items-center gap-1 mb-4 mt-4 z-[260]">
        {/* Company Logo Link - KIDUNI */}
        <div className="flex justify-center pointer-events-auto">
          <button
            onClick={onBack}
            className="block transform hover:scale-110 transition-transform"
          >
            <img src="https://i.ibb.co/TM3WwYjQ/1000046067-removebg-preview.png" alt="KIDUNI" border="0" className="h-20 md:h-32 w-auto object-contain" referrerPolicy="no-referrer" />
          </button>
        </div>
        {/* Trilingual Template (Language Selector) - Moved BELOW logo to avoid overlapping */}
        <div className="flex justify-center -mt-4 md:-mt-8">
          <LanguageSelector currentLang={currentLang} onLanguageChange={onLanguageChange} />
        </div>
      </div>

      <div className="w-[98%] md:w-full bg-[#F5F2E8]/80 backdrop-blur-md p-3 md:p-6 rounded-[24px] md:rounded-[32px] border-4 md:border-8 border-orange-400 shadow-xl flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <BookOpen size={24} />
          </div>
          <div className="text-left font-sans">
            <h2 className="text-3xl font-black text-orange-500 leading-tight">
              {lang === 'zh' ? 'AI 睡前故事魔法屋' : lang === 'ms' ? 'Rumah Cerita Ajaib AI' : 'AI Bedtime Story Magic'}
            </h2>
            <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mt-1">THE DREAM WEAVER</p>
          </div>
        </div>
        <button 
          type="button"
          onClick={onHome}
          className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border-4 border-indigo-200 shadow-md hover:bg-indigo-50 transition-all active:scale-95"
        >
          <Home className="text-indigo-500" />
        </button>
      </div>

      {!story && !isLoading ? (
        <motion.div 
          key="setup-screen"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6"
        >
          <div className="w-[98%] md:w-full bg-[#F5F2E8]/90 rounded-[24px] md:rounded-[40px] p-4 md:p-8 border-4 md:border-8 border-orange-400 shadow-2xl flex flex-col gap-6">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-xl font-black text-indigo-900 flex items-center gap-2">
                <Sparkles className="text-amber-400" />
                {lang === 'zh' ? '选择一个故事主题' : lang === 'ms' ? 'Pilih Tema Cerita' : 'Pick a Theme'}
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTheme(t);
                    setCustomDescription(''); // Clear custom if picking a theme
                  }}
                  className={`relative p-4 rounded-3xl flex flex-col items-center gap-2 transition-all btn-3d-yellow border-b-8 active:border-b-0 active:translate-y-1 ${
                    theme.id === t.id && !customDescription
                      ? `bg-gradient-to-br ${t.color} border-black/40 text-white shadow-xl scale-105` 
                      : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                  }`}
                >
                  <span className="text-3xl drop-shadow-md">{t.emoji}</span>
                  <span className="text-[10px] font-black uppercase tracking-tight line-clamp-1">{(t.label as any)[lang] || (t.label as any).zh || (t.label as any).en}</span>
                  {theme.id === t.id && !customDescription && (
                    <div className="absolute inset-0 rounded-3xl bg-white/20 animate-pulse pointer-events-none" />
                  )}
                </button>
              ))}
            </div>

            {/* Personalized Name Input */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-black text-indigo-900 flex items-center gap-2 px-2">
                <Sparkles size={16} className="text-amber-400" />
                {lang === 'zh' ? '宝贝的名字' : lang === 'ms' ? 'Nama Anak' : "Child's Name"}
              </label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                onKeyUp={(e) => e.stopPropagation()}
                onKeyPress={(e) => e.stopPropagation()}
                placeholder={lang === 'zh' ? '输入名字，让宝贝成为主角...' : lang === 'ms' ? 'Masukkan nama anak anda...' : "Enter name to make them the hero..."}
                className="w-full px-4 py-4 rounded-2xl bg-white border-4 border-orange-100 text-sm font-bold focus:border-orange-300 outline-none transition-all shadow-sm"
              />
            </div>

            {/* Manual Description Section */}
            <div className="mt-4 flex flex-col gap-3">
              <div className="flex items-center justify-between px-2">
                <label className="text-sm font-black text-indigo-900 flex items-center gap-2">
                  <Sparkles size={16} className="text-indigo-400" />
                  {lang === 'zh' ? '手动描述您的创意（简短几个字即可，不用写太長）' : lang === 'ms' ? 'Huraian Manual (Beberapa perkataan ringkas sahaja, tidak perlu terlalu panjang)' : 'Manual Description (Just a few words, no need to write too long)'}
                </label>
              </div>
              <textarea
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                onKeyUp={(e) => e.stopPropagation()}
                onKeyPress={(e) => e.stopPropagation()}
                placeholder={lang === 'zh' ? '输入您的创意...（简短几个字即可，不用写太長）' : lang === 'ms' ? 'Masukkan idea anda... (Beberapa patah kata sahaja, tidak perlu panjang)' : 'Enter your creative idea... (Just a few words is enough, no need to be too long!)'}
                className="w-full p-4 rounded-2xl bg-white border-4 border-indigo-100 text-sm font-medium focus:border-indigo-300 outline-none transition-all min-h-[80px] resize-none"
              />
              <div className="flex justify-end px-2">
                <span className={`text-[10px] font-bold ${
                  (lang === 'zh' ? customDescription.length : customDescription.split(/\s+/).filter(Boolean).length) > 100 
                    ? 'text-rose-500' 
                    : 'text-indigo-400'
                }`}>
                  {lang === 'zh' 
                    ? `${customDescription.length} 字` 
                    : `${customDescription.split(/\s+/).filter(Boolean).length} words`}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                if (isLoading) {
                  const stop = (window as any)._stopStory;
                  if (stop) stop();
                } else {
                  generateStory();
                }
              }}
              disabled={(!isLoading && isLimitReached) || ((lang === 'zh' ? customDescription.length : customDescription.split(/\s+/).filter(Boolean).length) > 20)}
              type="button"
              className={`mt-4 w-full text-white py-6 rounded-[30px] font-black text-2xl shadow-2xl transition-all flex flex-col items-center justify-center gap-1 text-sharp ${
                (isLoading)
                  ? 'bg-rose-500 border-b-4 border-rose-700 shadow-xl active:translate-y-1 active:border-b-0'
                  : (isLimitReached || (lang === 'zh' ? customDescription.length : customDescription.split(/\s+/).filter(Boolean).length) > 20)
                    ? 'bg-gray-400 border-b-0 cursor-not-allowed opacity-60' 
                    : 'btn-3d-teal shadow-2xl active:translate-y-2'
              }`}
            >
              <div className="flex items-center gap-3">
                {isLoading ? <Square className="animate-pulse" fill="white" size={24} /> : <Wand2 size={24} />}
                <span>{isLoading ? (lang === 'zh' ? '停止魔法' : 'STOP MAGIC') : (lang === 'zh' ? '开启魔法故事' : lang === 'ms' ? 'Mulakan Cerita Ajaib' : 'Start the Magic')}</span>
              </div>
              <span className="text-sm font-black uppercase tracking-wider">
                {isLoading ? (lang === 'zh' ? '点击停止' : 'Click to stop') : (lang === 'zh' ? `今日剩余次数: ${remaining}/${limit}` : lang === 'ms' ? `Baki hari ini: ${remaining}/${limit}` : `Remaining today: ${remaining}/${limit}`)}
              </span>
            </button>

            {errorMessage && (
              <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-600 text-sm font-bold flex flex-col gap-1">
                <span>Oops! {errorMessage}</span>
                <span className="text-[10px] opacity-70 uppercase tracking-widest leading-none">Please check your internet or API settings</span>
              </div>
            )}
          </div>

          {/* Decorative Image */}
          <div className="hidden md:flex bg-amber-50/90 rounded-[40px] overflow-hidden border-8 border-orange-400 shadow-2xl items-center justify-center p-8">
            <img 
              src="https://i.ibb.co/qMPPR7Wc/istockphoto-157720194-612x612.jpg" 
              className="w-full h-full object-contain mix-blend-multiply opacity-80" 
              alt="Magic Storytelling"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      ) : isLoading && (!story || !story.content || story.content.length < 5) ? (
        <motion.div 
          key="loading-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-amber-50/90 rounded-[40px] p-10 md:p-20 border-8 border-orange-400 shadow-2xl flex flex-col items-center justify-center gap-6 w-full relative"
        >
          <div className="relative">
            <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
            <Sparkles className="absolute -top-2 -right-2 text-amber-400 animate-pulse" size={24} />
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-black text-indigo-900">
              {loadingMessages[loadingStep]}
            </h3>
            <p className="text-orange-400/60 font-bold mt-2 tracking-widest animate-pulse uppercase text-xs">
              {lang === 'zh' ? '魔法能量注入中...' : lang === 'ms' ? 'Sihir sedang berfungsi...' : 'Magic Energy Infusing...'}
            </p>
          </div>
          
          <button
            onClick={() => {
              const stop = (window as any)._stopStory;
              if (stop) stop();
            }}
            className="mt-8 px-8 py-4 bg-rose-500 text-white rounded-2xl font-black shadow-lg hover:bg-rose-600 transition-all active:scale-95 flex items-center gap-3"
          >
            <Square fill="white" size={20} />
            <span>{lang === 'zh' ? '停止生成' : 'STOP GENERATING'}</span>
          </button>
        </motion.div>
      ) : (
        <motion.div 
          key="result-screen"
          ref={storyRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-amber-50/95 rounded-[24px] md:rounded-[40px] p-3 md:p-12 border-2 md:border-8 border-orange-400 shadow-2xl w-[98%] md:w-full flex flex-col gap-5 md:gap-8 relative"
        >
          {/* Magic background sparkles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-200/20 blur-3xl rounded-full" />

          <div className="text-center flex flex-col gap-4 z-10 px-4">
            <h3 className="text-4xl md:text-6xl lg:text-7xl font-black text-indigo-900 drop-shadow-sm leading-tight">{story?.title}</h3>
            <div className="h-2 bg-amber-400 w-32 mx-auto rounded-full shadow-sm" />
          </div>

          {/* Speech Speed Controller Moved Higher */}
          <div className="w-full bg-indigo-50/50 p-4 rounded-2xl border-2 border-indigo-100/50 z-10">
            <div className="flex items-center gap-4 mb-2">
              <Volume2 className="text-indigo-600" size={16} />
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">0.4x</span>
              <input 
                type="range" 
                min="0.4" 
                max="1.5" 
                step="0.1" 
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">1.5x</span>
            </div>
            <p className="text-[9px] font-black text-indigo-600 uppercase text-center tracking-[0.2em]">
              {lang === 'zh' ? `语音播放语速: ${speechRate.toFixed(1)}x` : lang === 'ms' ? `Kelajuan Suara: ${speechRate.toFixed(1)}x` : `Speech Rate: ${speechRate.toFixed(1)}x`}
            </p>
          </div>

          <div className={`text-indigo-800/80 font-medium leading-[1.8] text-justify font-sans z-10 px-4 whitespace-pre-wrap ${lang === 'zh' ? 'text-lg md:text-2xl' : 'text-base md:text-xl'}`}>
            {(() => {
              const parts = (story?.content || '').split(/(\[ZH\]|\[EN\]|\[MS\])/i);
              const sections: { type: string, content: string }[] = [];
              let currentType = '';
              let currentText = '';

              parts.forEach(part => {
                const upper = part.trim().toUpperCase();
                if (upper === '[ZH]' || upper === '[EN]' || upper === '[MS]') {
                  if (currentType && currentText) {
                    sections.push({ type: currentType, content: currentText.trim() });
                  }
                  currentType = upper.replace('[', '').replace(']', '').toLowerCase();
                  currentText = '';
                } else {
                  currentText += part;
                }
              });
              if (currentType && currentText) {
                sections.push({ type: currentType, content: currentText.trim() });
              }

              return sections.map((sec, idx) => (
                <div key={idx} className="mt-6 first:mt-2 bg-white/50 p-4 rounded-3xl border-2 border-white shadow-inner">
                  <div className="flex items-center justify-between mb-2">
                    {sec.type === 'zh' && <span className="text-emerald-600 font-black text-sm uppercase tracking-widest border-l-4 border-emerald-400 pl-3 bg-emerald-50/50 py-1 rounded-r-xl">Chinese / 中文</span>}
                    {sec.type === 'en' && <span className="text-blue-600 font-black text-sm uppercase tracking-widest border-l-4 border-blue-400 pl-3 bg-blue-50/50 py-1 rounded-r-xl">English / 英语</span>}
                    {sec.type === 'ms' && <span className="text-orange-600 font-black text-sm uppercase tracking-widest border-l-4 border-orange-400 pl-3 bg-orange-50/50 py-1 rounded-r-xl">Malay / 马来语</span>}
                    
                    <button
                      onClick={() => speak(sec.content, sec.type as Language)}
                      className={`p-2 rounded-xl transition-all active:scale-95 ${
                        isSpeaking && lastText === sec.content ? 'bg-red-500 text-white animate-pulse' : 'bg-white shadow-md text-indigo-500 hover:bg-indigo-50'
                      }`}
                    >
                      {isSpeaking && lastText === sec.content ? <Square size={16} fill="white" /> : <Volume2 size={16} />}
                    </button>
                  </div>
                  <div className="text-brand-ink text-lg leading-relaxed font-medium pl-1">{sec.content}</div>
                </div>
              ));
            })()}
          </div>

          <AnimatePresence>
            {showSaveToast && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-2 rounded-full font-black text-sm shadow-xl z-[100]"
              >
                ✨ {lang === 'zh' ? '故事已保存到多宝盒！' : lang === 'ms' ? 'Cerita disimpan!' : 'Saved to Treasure Box!'} ✨
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6 z-10">
            <div className="flex w-full gap-3">
              <button
                type="button"
                onClick={() => {
                  setStory(null);
                }}
                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-[25px] font-black text-lg shadow-xl bg-rose-500 text-white hover:bg-rose-600 active:scale-95 transition-all"
              >
                <Trash2 size={24} />
                <span>{lang === 'zh' ? '清空故事' : lang === 'ms' ? 'Padam' : 'Clear Story'}</span>
              </button>
            </div>

            <div className="flex w-full gap-3">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-4 border-indigo-200 text-indigo-500 rounded-[20px] font-bold hover:bg-indigo-50 transition-all"
              >
                <Save size={20} />
                <span>{lang === 'zh' ? '保存' : lang === 'ms' ? 'Simpan' : 'Save'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCertificate(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-brand-yellow text-brand-ink rounded-[20px] font-bold shadow-[0_4px_0_#D4A017] active:translate-y-1 active:shadow-none transition-all"
              >
                <Award size={20} />
                <span>{lang === 'zh' ? '证书' : lang === 'ms' ? 'Sijil' : 'Certificate'}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-4 border-emerald-200 text-emerald-500 rounded-[20px] font-bold hover:bg-emerald-50 transition-all"
              >
                <Share2 size={20} />
                <span>{lang === 'zh' ? '分享' : lang === 'ms' ? 'Kongsi' : 'Share'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setStory(null);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-4 border-amber-200 text-amber-500 rounded-[20px] font-bold hover:bg-amber-50 transition-all"
              >
                <RotateCcw size={20} />
                <span>{lang === 'zh' ? '换一个' : lang === 'ms' ? 'Lain' : 'New'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {showCertificate && (
          <AchievementShare
            categoryLabels={{
              zh: `故事：${story?.title || '睡前故事'}`,
              en: `Story: ${story?.title || 'Bedtime Story'}`,
              ms: `Cerita: ${story?.title || 'Cerita Tidur'}`
            }}
            learnedCount={1}
            totalCount={1}
            defaultUserName={childName}
            onClose={() => setShowCertificate(false)}
            onGoHome={() => {
              setShowCertificate(false);
              onHome();
            }}
            onContinue={() => setShowCertificate(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
