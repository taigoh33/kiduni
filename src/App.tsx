/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Home, Star, Award, PartyPopper, CheckCircle, CheckCircle2, Sparkles, BookOpen, Palette, Heart, LogOut, Headphones, Trash2, Share2, Download, X, Gamepad2, Volume2, Mic, Camera, Search, Settings, KeyRound } from 'lucide-react';
import confetti from 'canvas-confetti';
import * as htmlToImage from 'html-to-image';
import { Language, Category, LearningItem, AICertificate } from './types';
import { CATEGORIES, LEARNING_ITEMS } from './constants/content';
import { LanguageSelector } from './components/LanguageSelector';
import { WordCard } from './components/WordCard';
import { SentenceCard } from './components/SentenceCard';
import { AchievementShare } from './components/AchievementShare';
import { StoryHouse } from './components/StoryHouse';
import { Games } from './components/Games';
import { Login } from './components/Login';
import { Onboarding, OnboardingData } from './components/Onboarding';
import VoiceHelpModal from './components/VoiceHelpModal';
import { Subscription } from './components/Subscription';
import { Checkout } from './components/Checkout';
import { MagicTranslator } from './components/MagicTranslator';
import { LegalPages } from './components/LegalPages';
import { Footer } from './components/Footer';
import { SentencePuzzle } from './components/SentencePuzzle';
import { DrawingAnalyzer } from './components/DrawingAnalyzer';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { Info, Crown, Languages } from 'lucide-react';

interface CategoryCardProps {
  cat: Category;
  lang: Language;
  isLarge: boolean;
  catPercent: number;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  cat, 
  lang, 
  isLarge, 
  catPercent, 
  onClick 
}) => {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        p-6 rounded-[40px] flex flex-col items-center justify-center gap-3 transition-all relative overflow-hidden group
        btn-3d ${cat.color === 'bg-brand-coral' ? 'btn-3d-coral' : cat.color === 'bg-brand-teal' ? 'btn-3d-teal' : cat.color === 'bg-brand-yellow' ? 'btn-3d-yellow' : 'bg-white shadow-xl'}
        ${isLarge ? 'md:col-span-2 md:row-span-2' : ''}
        border-4 border-white/50
      `}
    >
      {/* Background Image */}
      {cat.imageUrl && (
        <div className="absolute inset-0 z-0">
          <img 
            src={cat.imageUrl} 
            alt={cat.label[lang]} 
            className="w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-500 mix-blend-overlay"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
        </div>
      )}

      {/* Progress Badge Removed as requested */}
      
      <span className={`text-6xl mb-2 transition-transform group-hover:scale-110 z-10 drop-shadow-lg`}>{cat.icon}</span>
      <div className="text-center z-10">
        <span className={`font-black text-white block drop-shadow-sm uppercase tracking-wider ${lang === 'zh' ? 'text-sm' : 'text-xs'}`}>
          {cat.label[lang]}
        </span>
        {isLarge && (
          <span className={`font-bold text-white/90 uppercase tracking-widest mt-1 block ${lang === 'zh' ? 'text-[10px]' : 'text-[8px]'}`}>
            {lang === 'zh' ? '热门推荐' : lang === 'ms' ? 'Pilihan Popular' : 'Popular Choice'}
          </span>
        )}
      </div>
    </motion.button>
  );
};

const TESTIMONIALS = [
  { 
    name: "陈志诚 (Chen Zhi Cheng)", 
    originalLang: 'zh',
    text: {
      zh: "教师与家长工具箱太实用了，我能为班级快速生成精美的字卡，太棒了！",
      en: "The Teacher & Parent Toolkit is so practical! I can quickly generate beautiful flashcards for my class, it's awesome!",
      ms: "Toolkit Guru & Ibu Bapa sangat praktikal! Saya boleh menjana kad perkataan yang cantik untuk kelas saya dengan cepat, memang hebat!"
    }
  },
  { 
    name: "李美玲 (Lee Mei Ling)", 
    originalLang: 'zh',
    text: {
      zh: "透过工具箱的每周计划，我发现教学变得井井有条，教学小贴士也非常专业且有启发性。",
      en: "Through the weekly planner in the toolkit, I find teaching becomes well-organized. The teaching tips are very professional and inspiring.",
      ms: "Melalui pelan mingguan dalam toolkit, saya dapati pengajaran menjadi lebih teratur. Tip pengajaran juga sangat profesional dan memberi inspirasi."
    }
  },
  { 
    name: "黄佩芬 (Wong Pei Fern)", 
    originalLang: 'zh',
    text: {
      zh: "那个字卡生成器真的是神来之笔。它能根据不同主题编写，让我更轻松地准备教具。",
      en: "The flashcard creator is a stroke of genius. It can be prepared according to different themes, making it easier for me to prepare teaching aids.",
      ms: "Penjana kad perkataan memang hebat. Ia boleh disediakan mengikut tema yang berbeza, memudahkan saya menyediakan alat bantu mengajar."
    }
  },
  { 
    name: "Ahmad Syazwan", 
    originalLang: 'ms',
    text: {
      zh: "教师与家长工具箱非常准确！它帮助我带孩子制定学习目标并学习新词汇。",
      en: "This Parent & Teacher Toolkit is very helpful! It helps me set learning goals with my child and learn new vocabulary.",
      ms: "Toolkit Ibu Bapa & Guru ini memang membantu! Ia membantu saya menetapkan matlamat pembelajaran bersama anak dan belajar kosa kata baharu."
    }
  },
  { 
    name: "Fazura Md Ali", 
    originalLang: 'ms',
    text: {
      zh: "孩子们最喜欢的睡前故事。充满了教育价值，声音也非常抚慰人心。",
      en: "My children's favorite bedtime stories. Full of educational value and the voice is very soothing.",
      ms: "Kisah sebelum tidur kegemaran anak-anak saya. Penuh dengan nilai pengajaran dan suara yang sangat menenangkan."
    }
  },
  { 
    name: "Siti Aminah", 
    originalLang: 'ms',
    text: {
      zh: "同步翻译功能太棒了！我的孩子可以用马来文理解后，再大声说出中文词汇，非常有效。",
      en: "The simultaneous translation is great! My child can understand in Malay first, then speak out Chinese words loudly. Very effective.",
      ms: "Fungsi terjemahan serentak sangat hebat! Anak saya boleh faham dalam bahasa Melayu dahulu, kemudian menyebut perkataan Mandarin dengan kuat. Sangat berkesan."
    }
  },
  { 
    name: "Ahmad Rozali", 
    originalLang: 'ms',
    text: {
      zh: "图卡的设计非常有吸引力，色彩鲜艳，孩子每次学习都充满了好奇心。",
      en: "The flashcards are so engaging with vibrant colors. My child is always curious and excited to learn every time.",
      ms: "Reka bentuk kad imbas sangat menarik dengan warna-warna terang. Anak saya sentiasa ingin tahu dan teruja untuk belajar setiap kali."
    }
  },
  { 
    name: "Mohd Firdaus", 
    originalLang: 'ms',
    text: {
      zh: "三语同步学习非常适合我们在马来西亚的环境，孩子能同时掌握华语和国语的基础。",
      en: "Trilingual learning is perfect for our Malaysian environment. Kids can master basics of Mandarin and Malay simultaneously.",
      ms: "Pembelajaran tiga bahasa sangat sesuai untuk persekitaran Malaysia kami. Kanak-kanak boleh menguasai asas Mandarin dan Bahasa Melayu secara serentak."
    }
  },
  { 
    name: "Nurul Izzah", 
    originalLang: 'ms',
    text: {
      zh: "这个平台让中文学习变得不再枯燥。互动的过程让孩子在玩乐中进步，真的很推荐。",
      en: "This platform makes learning Chinese no longer boring. The interactive process lets children progress while playing. Highly recommended.",
      ms: "Platform ini menjadikan pembelajaran Mandarin tidak lagi membosankan. Proses interaktif membolehkan kanak-kanak maju sambil bermain. Sangat disyorkan."
    }
  },
  { 
    name: "Khairul Anuar", 
    originalLang: 'ms',
    text: {
      zh: "对每项探索描述的准确性感到非常惊讶。每位家长必备的应用程序！",
      en: "Very impressed by the accuracy of the exploration descriptions. A must-have app for every parent!",
      ms: "Sangat kagum dengan ketepatan huraian penerokaan dalam setiap foto. Aplikasi yang wajib ada untuk setiap ibu bapa!"
    }
  },
  { 
    name: "Nurul Huda", 
    originalLang: 'ms',
    text: {
      zh: "孩子每天都吵着要玩这个应用，不知不觉学会了很多单词。",
      en: "My child asks to play this app every day and has learned so many words unknowingly.",
      ms: "Anak saya asyik minta nak main aplikasi ini setiap hari, sedar tak sedar dah banyak perkataan dia belajar."
    }
  },
  { 
    name: "David Thompson", 
    originalLang: 'en',
    text: {
      zh: "作为一个在马来西亚工作的家庭，这个应用程序是我们教孩子中文的最佳助手。三语无缝衔接。",
      en: "As an expat family in Malaysia, this app is our best helper in teaching our kids Chinese. The trilingual transition is seamless.",
      ms: "Sebagai keluarga ekspatriat di Malaysia, aplikasi ini adalah pembantu terbaik kami dalam mengajar anak-anak bahasa Mandarin. Peralihan tiga bahasa adalah lancar."
    }
  },
  { 
    name: "Emily Wilson", 
    originalLang: 'en',
    text: {
      zh: "发音非常清晰标准。对于我们这种非华裔家庭来说，这是孩子接触中文的完美起点。",
      en: "The pronunciation is very clear and standard. For a non-Chinese family like ours, this is the perfect starting point for kids to learn Chinese.",
      ms: "Sebutan sangat jelas dan standard. Bagi keluarga bukan Cina seperti kami, ini adalah titik permulaan yang sempurna untuk kanak-kanak belajar bahasa Mandarin."
    }
  },
  { 
    name: "Sarah Jane", 
    originalLang: 'en',
    text: {
      zh: "我喜欢这个应用的简洁界面。三语对照让我的混血宝宝学习起来毫无压力。",
      en: "I love the clean interface. The trilingual comparison makes learning stress-free for my mixed-race child.",
      ms: "Saya suka antaramuka yang kemas. Perbandingan tiga bahasa menjadikan pembelajaran tanpa tekanan untuk anak kacukan saya."
    }
  }
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('fun_chinese_logged_in') === 'true');
  const [username, setUsername] = useState(() => localStorage.getItem('fun_chinese_username') || '');
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(() => localStorage.getItem('fun_chinese_is_subscribed') === 'true');
  const [planType, setPlanType] = useState<'trial' | 'paid' | null>(() => localStorage.getItem('fun_chinese_plan_type') as any);
  const [subscriptionStartDate, setSubscriptionStartDate] = useState(() => localStorage.getItem('fun_chinese_sub_start') || '');
  const [trialTimeLeft, setTrialTimeLeft] = useState<string | null>(null);
  const [subscriptionTarget, setSubscriptionTarget] = useState<'trial' | 'plans' | undefined>(undefined);
  
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(() => localStorage.getItem('fun_chinese_onboarding_complete') === 'true');
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(() => {
    try {
      const saved = localStorage.getItem('fun_chinese_onboarding_data');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Failed to parse onboarding data", e);
      return null;
    }
  });
  const [view, setView] = useState<'welcome' | 'app' | 'story-house' | 'certificate-viewer' | 'games' | 'subscription' | 'checkout' | 'magic-translator' | 'sentence-puzzle' | 'achievement-gallery' | 'drawing-analyzer' | 'about' | 'contact' | 'privacy' | 'terms' | 'refund' | 'cancellation'>(
    () => (sessionStorage.getItem('kiduni_current_view') as any) || 'welcome'
  );

  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    sessionStorage.setItem('kiduni_current_view', view);
    console.log(`[NAV] View changed to: ${view}`);
    
    // Protection against rapid double-navigation when returning home
    if (view === 'app') {
      setIsNavigating(true);
      setTimeout(() => setIsNavigating(false), 800);
    }
  }, [view]);

  const setViewProtected = (newView: typeof view) => {
    if (isNavigating && newView !== 'app') return;
    
    // Gate premium interactive features for unsubscribed users
    if (!isSubscribed) {
      const premiumViews: Array<typeof view> = [
        'games', 
        'story-house', 
        'magic-translator', 
        'sentence-puzzle', 
        'drawing-analyzer',
        'achievement-gallery',
        'certificate-viewer'
      ];
      if (premiumViews.includes(newView)) {
        setView('subscription');
        setSubscriptionTarget('plans');
        return;
      }
    }
    
    setView(newView);
  };
  const [lang, setLang] = useState<Language>('zh');
  const [selectedPlan, setSelectedPlan] = useState<{ id: string; name: string; price: string; period: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showShare, setShowShare] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isVoiceHelpOpen, setIsVoiceHelpOpen] = useState(false);

  const [learnedIds, setLearnedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('learned_ids');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse learned ids", e);
      return [];
    }
  });

  const [selectedCertificate, setSelectedCertificate] = useState<AICertificate | null>(null);

  const [certificates, setCertificates] = useState<AICertificate[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasMimicked, setHasMimicked] = useState(false);
  const recognitionRef = useRef<any>(null);
  const recognitionStateRef = useRef({
    zh: '',
    currentIndex: 0
  });

  const [globalSpeechRate, setGlobalSpeechRate] = useState(0.6);

  const [exportResult, setExportResult] = useState<string | null>(null);
  const certificatePaperRef = useRef<HTMLDivElement>(null);

  // Derive filtered items first
  const filteredItems = selectedCategory 
    ? LEARNING_ITEMS.filter(item => item.category === selectedCategory.id)
    : [];

  // Update state ref for stable access in recognition callbacks
  useEffect(() => {
    if (filteredItems[currentIndex]) {
      recognitionStateRef.current = {
        zh: filteredItems[currentIndex].translations.zh,
        currentIndex: currentIndex
      };
    }
  }, [currentIndex, filteredItems]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    
    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'zh-CN';

      recognition.onstart = () => {
        console.log("Speech recognition started");
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        setIsRecording(false);
        setHasMimicked(true);
        setTimeout(() => setHasMimicked(false), 2000);
        
        const transcript = event.results[0][0].transcript.toLowerCase().replace(/[.,，。！？!?]/g, '').trim();
        const target = recognitionStateRef.current.zh.toLowerCase().replace(/[.,，。！？!?]/g, '').trim();
        
        console.log("Recognition result cleaned:", transcript, "Target cleaned:", target);
        
        if (transcript.includes(target) || target.includes(transcript)) {
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 2000);
        } else {
          // Visual feedback for mismatched try
          setHasMimicked(true);
          setTimeout(() => setHasMimicked(false), 1500);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        console.log("Speech recognition ended");
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const globalSpeak = (text: string, voiceCode: string = 'zh-CN') => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    let voice;
    if (voiceCode === 'zh-CN') {
      voice = voices.find(v => v.name.includes('Google') && v.lang.includes('zh-CN')) ||
              voices.find(v => v.lang.includes('zh-CN')) || 
              voices.find(v => v.lang.includes('zh'));
    } else if (voiceCode === 'en-SG') {
      voice = voices.find(v => v.name.includes('Google') && v.lang.includes('en-SG')) ||
              voices.find(v => v.lang.includes('en-SG')) ||
              voices.find(v => v.lang.startsWith('en'));
    }

    if (voice) utterance.voice = voice;
    utterance.lang = voiceCode;
    utterance.rate = globalSpeechRate;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  const globalToggleRecording = (zh: string) => {
    if (isRecording) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {
        console.error("Error stopping recognition:", e);
      }
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.lang = 'zh-CN';
          recognitionRef.current.start();
        } catch (e) {
          console.error("Error starting recognition:", e);
          // If already started, just ignore or restart
          try {
            recognitionRef.current.stop();
            setTimeout(() => recognitionRef.current.start(), 100);
          } catch (err) {}
        }
      }
    }
  };

  useEffect(() => {
    const loadCertificates = () => {
      const storiesRaw = localStorage.getItem('bedtime_stories_vault');
      const explorerRaw = localStorage.getItem('magic_explorer_vault');
      const drawingsRaw = localStorage.getItem('drawing_analysis_vault');
      
      const stories = storiesRaw ? JSON.parse(storiesRaw) : [];
      const explorers = explorerRaw ? JSON.parse(explorerRaw) : [];
      const drawings = drawingsRaw ? JSON.parse(drawingsRaw) : [];
      
      const mappedStories: AICertificate[] = stories.map((s: any) => ({
        id: s.id,
        type: 'story',
        title: s.title,
        date: s.date,
        content: s.content,
        studentName: s.studentName
      }));
      
      const mappedExplorers: AICertificate[] = explorers.map((e: any) => ({
        id: e.id,
        type: 'explorer',
        title: lang === 'zh' ? '魔法探索发现' : lang === 'ms' ? 'Penemuan Lensa Ajaib' : 'Magic Exploration',
        date: e.date,
        previewImage: e.image,
        analysis: e.analysis,
        studentName: e.studentName
      }));

      const mappedDrawings: AICertificate[] = drawings.map((d: any) => ({
        id: d.id,
        type: 'drawing',
        title: lang === 'zh' ? '绘画心理分析' : lang === 'ms' ? 'Analisis Lukisan' : 'Drawing Analysis',
        date: d.date,
        previewImage: d.image,
        analysis: d.analysis,
        studentName: d.studentName
      }));
      
      setCertificates([...mappedStories, ...mappedExplorers, ...mappedDrawings].sort((a, b) => {
        return parseInt(b.id) - parseInt(a.id);
      }));
    };
    
    loadCertificates();
    // Add event listener for localstorage changes (to sync across components if needed)
    window.addEventListener('storage', loadCertificates);
    return () => window.removeEventListener('storage', loadCertificates);
  }, [lang, view]); // Reload when view changes (e.g., coming back from AI tools)

  useEffect(() => {
    const savedLoggedIn = localStorage.getItem('fun_chinese_logged_in') === 'true';
    const savedOnboarding = localStorage.getItem('fun_chinese_onboarding_complete') === 'true';
    const savedUsername = localStorage.getItem('fun_chinese_username');
    const savedOnboardingData = localStorage.getItem('fun_chinese_onboarding_data');

    if (savedLoggedIn && savedUsername) {
      setIsLoggedIn(true);
      setUsername(savedUsername);
    }
    if (savedOnboarding && savedOnboardingData) {
      setIsOnboardingComplete(true);
      setOnboardingData(JSON.parse(savedOnboardingData));
    }
  }, []);

  useEffect(() => {
    // Handle Billplz payment redirect
    const params = new URLSearchParams(window.location.search);
    const isPaid = params.get('billplz[paid]') === 'true';
    const billId = params.get('billplz[id]');
    
    if (isPaid && billId) {
      const verifyPayment = async () => {
        try {
          const res = await fetch('/api/auth/verify-and-activate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              billId,
              billplzApiKey: localStorage.getItem('fun_chinese_billplz_api_key') || undefined
            }),
          });

          const data = await res.json();
          if (res.ok && data.success && data.username) {
            console.log(`[Payment Redirect] Successfully verified paid user account: ${data.username}`);
            
            // Core logins
            setIsLoggedIn(true);
            setUsername(data.username);
            localStorage.setItem('fun_chinese_username', data.username);
            
            // Complete subscription activation
            setIsSubscribed(true);
            setPlanType('paid');
            const now = new Date().toISOString();
            setSubscriptionStartDate(now);
            
            localStorage.setItem('fun_chinese_is_subscribed', 'true');
            localStorage.setItem('fun_chinese_sub_start', now);
            localStorage.setItem('fun_chinese_plan_type', 'paid');
            
            // Clean up URL parameters representation
            window.history.replaceState({}, document.title, window.location.pathname);
            
            setView('app');
            setTimeout(() => {
              confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FFD700', '#FFA500', '#8A2BE2']
              });
            }, 500);
          } else {
            console.error(`[Payment Redirect] Verification failure:`, data.error);
          }
        } catch (e) {
          console.error(`[Payment Redirect] Connection verification fallback error:`, e);
        }
      };

      verifyPayment();
    }
  }, [lang]);

  const scrollToSection = (id: string) => {
    setSelectedCategory(null);

    const performScroll = (targetId: string) => {
      const element = document.getElementById(targetId);
      const scrollContainer = document.getElementById('main-content') || document.getElementById('welcome-root');
      
      if (element && scrollContainer) {
        const elementRect = element.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();
        
        const relativeTop = elementRect.top - containerRect.top + scrollContainer.scrollTop;
        
        // Offset logic: 
        // We need a significant offset for BOTH views because of fixed headers.
        let offset = 260; 
        
        if (scrollContainer.id === 'main-content') {
          // App header is slightly less tall than welcome header
          offset = 180;
        }

        scrollContainer.scrollTo({
          top: Math.max(0, relativeTop - offset),
          behavior: 'smooth'
        });
      }
    };

    if (view !== 'app' || selectedCategory) {
      setView('app');
      
      let attempts = 0;
      const checkAndScroll = () => {
        const element = document.getElementById(id);
        const scrollContainer = document.getElementById('main-content');
        
        if (element && scrollContainer) {
          performScroll(id);
        } else if (attempts < 30) { 
          attempts++;
          setTimeout(checkAndScroll, 50);
        }
      };
      
      setTimeout(checkAndScroll, 100);
    } else {
      performScroll(id);
    }
  };

  useEffect(() => {
    const checkSubscriptionExpiry = () => {
      if (isSubscribed && planType === 'trial' && subscriptionStartDate) {
        const start = new Date(subscriptionStartDate).getTime();
        const now = new Date().getTime();
        const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
        const diff = threeDaysInMs - (now - start);

        if (diff <= 0) {
          // Trial expired
          setIsSubscribed(false);
          setPlanType(null);
          localStorage.setItem('fun_chinese_is_subscribed', 'false');
          localStorage.removeItem('fun_chinese_plan_type');
          setTrialTimeLeft(null);
          
          // Redirect if in protected view
          if (['story-house', 'drawing-analysis', 'magic-translator', 'games'].includes(view)) {
            setView('subscription');
          }
        } else {
          // Calculate time left string
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTrialTimeLeft(`${hours}H${mins}M`);
        }
      } else {
        setTrialTimeLeft(null);
      }
    };

    checkSubscriptionExpiry();
    const interval = setInterval(checkSubscriptionExpiry, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [isSubscribed, planType, subscriptionStartDate]);

  const handleSelectPlan = (plan: { id: string; name: string; price: string; period: string }) => {
    setSelectedPlan(plan);
    setView('checkout');
  };

  const handlePaymentSuccess = (planId: string) => {
    // This is called when checkout is successful
    const type = planId === 'trial' ? 'trial' : 'paid';
    setIsSubscribed(true);
    setPlanType(type);
    const now = new Date().toISOString();
    setSubscriptionStartDate(now);
    
    localStorage.setItem('fun_chinese_is_subscribed', 'true');
    localStorage.setItem('fun_chinese_sub_start', now);
    localStorage.setItem('fun_chinese_plan_type', type);
    
    setView('app');
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#8A2BE2']
    });
  };

  const startNow = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setView('app');
    setSelectedCategory(null);
    setCurrentIndex(0);
    
    // Use requestAnimationFrame for smoother transition
    setTimeout(() => {
      scrollToSection('magic-cards');
    }, 150);
  };

  const goHome = (targetIdOrEvent?: string | React.MouseEvent) => {
    if (targetIdOrEvent && typeof targetIdOrEvent !== 'string') {
      targetIdOrEvent.preventDefault();
      targetIdOrEvent.stopPropagation();
    }

    const targetId = typeof targetIdOrEvent === 'string' ? targetIdOrEvent : undefined;
    
    setSelectedCategory(null);
    setCurrentIndex(0);

    if (targetId === 'achievement-gallery') {
      setView('achievement-gallery');
    } else if (targetId === 'magic-cards' || targetId === 'daily-sentences' || targetId === 'dialogue-practice' || targetId === 'latest-features') {
      setView('app');
      // Use longer delay for viewport to settle
      setTimeout(() => scrollToSection(targetId), 150);
    } else {
      setView('welcome');
      
      requestAnimationFrame(() => {
        const welcomeRoot = document.getElementById('welcome-root');
        if (welcomeRoot) {
          if (targetId) {
            const element = document.getElementById(targetId);
            if (element) {
              const elementRect = element.getBoundingClientRect();
              const containerRect = welcomeRoot.getBoundingClientRect();
              const relativeTop = elementRect.top - containerRect.top + welcomeRoot.scrollTop;
              welcomeRoot.scrollTo({ top: relativeTop - 100, behavior: 'smooth' });
            }
          } else {
            welcomeRoot.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
          }
        }
      });
    }
  };

  // Global view change scroll reset
  useEffect(() => {
    if (view === 'app' || view === 'welcome') {
      const rootId = view === 'app' ? 'main-content' : 'welcome-root';
      const root = document.getElementById(rootId);
      if (root) root.scrollTo(0, 0);
    }
  }, [view]);

  useEffect(() => {
    localStorage.setItem('learned_ids', JSON.stringify(learnedIds));
  }, [learnedIds]);

  const toggleLearned = (id: string) => {
    const isLearnedNow = !learnedIds.includes(id);
    setLearnedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );

    if (isLearnedNow) {
      // Trigger small confetti burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6B6B', '#FFD93D', '#4ECDC4', '#5B21B6']
      });

      // Check if this completes the category
      const remaining = filteredItems.filter(item => !learnedIds.includes(item.id) && item.id !== id);
      if (remaining.length === 0 && filteredItems.length > 0) {
        // Only trigger confetti, no certificate for these standard categories as requested
        setTimeout(() => {
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.3 },
            ticks: 200,
            gravity: 1.2,
            colors: ['#FF6B6B', '#FFD93D', '#4ECDC4', '#5B21B6']
          });
        }, 500);
      }
    }
  };

  const learnedCount = filteredItems.filter(item => learnedIds.includes(item.id)).length;
  const progressPercent = filteredItems.length > 0 ? (learnedCount / filteredItems.length) * 100 : 0;

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsOnboardingComplete(false);
    setIsSubscribed(false);
    setPlanType(null);
    setSubscriptionStartDate('');
    setTrialTimeLeft(null);
    setView('welcome');
    setSelectedCategory(null);
    setCurrentIndex(0);
    localStorage.removeItem('fun_chinese_logged_in');
    localStorage.removeItem('fun_chinese_onboarding_complete');
    localStorage.removeItem('fun_chinese_username');
    localStorage.removeItem('fun_chinese_onboarding_data');
    localStorage.setItem('fun_chinese_is_subscribed', 'false');
    localStorage.removeItem('fun_chinese_plan_type');
    localStorage.removeItem('fun_chinese_sub_start');
  };

  const handleLogin = (name: string, isSubscribedFromServer?: boolean) => {
    setUsername(name);
    setIsLoggedIn(true);
    const subStatus = !!isSubscribedFromServer;
    setIsSubscribed(subStatus);
    setPlanType(subStatus ? 'paid' : null);
    setView('welcome');
    setSelectedCategory(null);
    localStorage.setItem('fun_chinese_logged_in', 'true');
    localStorage.setItem('fun_chinese_username', name);
    localStorage.setItem('fun_chinese_is_subscribed', subStatus ? 'true' : 'false');
    if (subStatus) {
      localStorage.setItem('fun_chinese_plan_type', 'paid');
    } else {
      localStorage.removeItem('fun_chinese_plan_type');
    }
  };

  const handleOnboardingComplete = (data: OnboardingData) => {
    setOnboardingData(data);
    setIsOnboardingComplete(true);
    localStorage.setItem('fun_chinese_onboarding_complete', 'true');
    localStorage.setItem('fun_chinese_onboarding_data', JSON.stringify(data));
    localStorage.setItem('fun_chinese_onboarding_date_started', new Date().toISOString());
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} lang={lang} onLanguageChange={setLang} />;
  }

  if (!isOnboardingComplete) {
    return <Onboarding onComplete={handleOnboardingComplete} username={username} lang={lang} onLanguageChange={setLang} />;
  }
  if (view === 'story-house') {
    return (
      <div className="min-h-screen w-full bg-modern-gradient flex flex-col items-center">
        <StoryHouse isSubscribed={isSubscribed} currentLang={lang} onLanguageChange={setLang} onBack={() => goHome('latest-features')} onHome={() => goHome('latest-features')} />
        <div className="h-20" />
      </div>
    );
  }

  if (view === 'magic-translator') {
    return (
      <div className="min-h-screen w-full bg-modern-gradient flex flex-col items-center pt-8">
        <MagicTranslator 
          isSubscribed={isSubscribed} 
          currentLang={lang} 
          onLanguageChange={setLang} 
          onBack={() => goHome('latest-features')} 
          onHome={() => goHome('latest-features')}
        />
        <div className="h-20" />
      </div>
    );
  }

  if (view === 'certificate-viewer' && selectedCertificate) {
    const currentIndex = certificates.findIndex(c => c.id === selectedCertificate.id);
    const hasNext = currentIndex < certificates.length - 1;
    const hasPrev = currentIndex > 0;

    const handleNext = () => setSelectedCertificate(certificates[currentIndex + 1]);
    const handlePrev = () => setSelectedCertificate(certificates[currentIndex - 1]);

    const handleDownload = async () => {
      if (!certificatePaperRef.current || isExporting) return;
      setIsExporting(true);
      
      try {
        // Wait for next tick to ensure any animations are settled
        await new Promise(r => setTimeout(r, 300));

        const dataUrl = await htmlToImage.toPng(certificatePaperRef.current, {
          quality: 0.95,
          pixelRatio: 2,
          backgroundColor: '#ffffff',
          cacheBust: true,
          style: {
            transform: 'none',
            margin: '0',
          }
        });
        
        if (!dataUrl || dataUrl.length < 5000) throw new Error('Image generation failed - Result too small');

        setExportResult(dataUrl);

        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `FunChinese-${selectedCertificate.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error('Download failed:', err);
        alert(lang === 'zh' ? '保存失败，请尝试长按图片保存。' : 'Save failed. Please try long-pressing the image to save.');
      } finally {
        setIsExporting(false);
      }
    };

    const handleShare = async () => {
      if (!certificatePaperRef.current || isExporting) return;
      setIsExporting(true);

      try {
        await new Promise(r => setTimeout(r, 300));
        
        const dataUrl = await htmlToImage.toPng(certificatePaperRef.current, {
          quality: 0.95,
          pixelRatio: 2,
          backgroundColor: '#ffffff',
          cacheBust: true
        });

        if (!dataUrl || dataUrl.length < 5000) throw new Error('Image generation failed');
        setExportResult(dataUrl);

        try {
          const response = await fetch(dataUrl);
          const blob = await response.blob();
          const file = new File([blob], 'achievement.png', { type: 'image/png' });
          
          if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: selectedCertificate.title,
              text: lang === 'zh' ? '看看我的精彩作品！' : 'Check out my awesome work!',
              files: [file]
            });
          } else {
            console.log("Web Share API not fully supported for files, falling back to download");
            handleDownload();
          }
        } catch (shareErr) {
          console.error('Share execution failed:', shareErr);
          handleDownload();
        }
      } catch (err) {
        console.error('Core share preparation failed:', err);
        handleDownload();
      } finally {
        setIsExporting(false);
      }
    };

    return (
      <div className="min-h-screen w-full bg-[#FDFCF7] flex flex-col items-center p-2 md:p-8 pb-32">
        <div className="w-full max-w-5xl flex items-center justify-between mb-8">
          <button 
            onClick={() => {
              setView('achievement-gallery');
            }}
            className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl flex items-center justify-center border-2 border-emerald-100 shadow-md hover:bg-emerald-50 transition-all font-black text-emerald-500"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-black text-brand-ink uppercase tracking-tighter">
              {lang === 'zh' ? '荣誉证书' : lang === 'ms' ? 'Sijil Penghargaan' : 'Certificate of Achievement'}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                {currentIndex + 1} / {certificates.length}
              </span>
            </div>
          </div>
          <button 
            onClick={() => {
              setView('welcome');
              goHome();
            }}
            className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl flex items-center justify-center border-2 border-emerald-100 shadow-md hover:bg-emerald-50 transition-all text-emerald-500 font-black"
          >
            <Home size={20} />
          </button>
        </div>

        {/* Navigation Floating Buttons */}
        <div className="w-full max-w-6xl relative">
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-16 z-20 hidden md:block">
            <button
              disabled={!hasPrev}
              onClick={handlePrev}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl border-4 border-white transition-all ${hasPrev ? 'bg-emerald-500 text-white hover:scale-110 active:scale-95' : 'bg-gray-200 text-gray-400 opacity-50 cursor-not-allowed'}`}
            >
              <ChevronLeft size={32} strokeWidth={3} />
            </button>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-16 z-20 hidden md:block">
            <button
              disabled={!hasNext}
              onClick={handleNext}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl border-4 border-white transition-all ${hasNext ? 'bg-emerald-500 text-white hover:scale-110 active:scale-95' : 'bg-gray-200 text-gray-400 opacity-50 cursor-not-allowed'}`}
            >
              <ChevronRight size={32} strokeWidth={3} />
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCertificate.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              {/* The Certificate Paper */}
              <div ref={certificatePaperRef} className="w-full max-w-2xl bg-[#FDFCF7] rounded-[48px] p-6 pb-12 md:p-10 md:pb-16 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] border-[12px] border-[#D4A017] relative flex flex-col items-center text-center overflow-hidden mx-auto">
                {/* Outer white margin simulated by padding/border in parent, but here we add the inner white border */}
                <div className="absolute inset-0 border-[4px] border-white rounded-[36px] pointer-events-none" />
                
                {/* Yellow badge icon top right */}
                <div className="absolute top-8 right-8 text-[#D4A017]/30">
                  <Award size={48} className="rotate-12" />
                </div>

                <div className="relative z-10 flex flex-col items-center w-full">
                  {/* Header Logo - Styled Brand Name */}
                  <div className="mb-2">
                    <div className="text-[45px] font-black text-orange-500 tracking-tighter">
                      KIDUNI
                    </div>
                  </div>

                  <h2 className="text-3xl font-black text-brand-ink mb-1">学中文小达人</h2>
                  <div className="text-[10px] font-black text-gray-400 mb-6 uppercase tracking-[0.25em]">Certificate of Achievement</div>

                  <div className="mb-6 w-full">
                    <p className="text-[12px] font-black text-brand-teal uppercase tracking-[0.1em] mb-3">恭喜你完成了 / Congratulations!</p>
                    
                    <div className="flex flex-col items-center mb-6">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 opacity-60">Awarded To</div>
                      <div className="text-3xl font-black text-[#1A1A1A] min-h-[44px] px-8 pb-1 uppercase italic tracking-tighter decoration-[#D4A017]/30 underline underline-offset-8">
                        {selectedCertificate.studentName || username || 'LITTLE HERO'}
                      </div>
                    </div>

                    <div className="w-full h-px bg-gray-200 mb-6 max-w-[80%]" />

                    <h3 className="text-3xl font-black text-brand-coral mb-1 leading-tight tracking-tighter">
                      “{selectedCertificate.type === 'story' ? (selectedCertificate.title || '睡前故事') : (lang === 'zh' ? '绘画心理分析' : lang === 'ms' ? 'Analisis Lukisan' : 'Drawing Analysis')}”
                    </h3>
                    <p className="text-xs font-black text-brand-coral/60 mb-8 uppercase tracking-widest">
                      {selectedCertificate.type === 'story' ? 'Story Telling' : 'Drawing Analysis'} | {selectedCertificate.type === 'story' ? 'Bercerita' : 'Analisis Lukisan'}
                    </p>

                    {selectedCertificate.type === 'drawing' && selectedCertificate.previewImage && (
                      <div className="w-full mb-10 relative px-4">
                        <div className="relative bg-white p-2 rounded-2xl border-2 border-white shadow-xl overflow-hidden aspect-[4/3] mx-auto max-w-sm">
                          <img 
                            src={selectedCertificate.previewImage} 
                            alt="Child artwork" 
                            className="w-full h-full object-cover rounded-xl shadow-md"
                            referrerPolicy="no-referrer"
                            crossOrigin="anonymous"
                          />
                          <div className="absolute bottom-2 right-2 w-12 h-12 bg-[#D4A017] rounded-full shadow-lg flex items-center justify-center border-2 border-white">
                            <Palette size={20} className="text-brand-ink" />
                          </div>
                        </div>
                      </div>
                    )}

                     {selectedCertificate.content && (
                      <div className="w-full mb-6 relative px-4 text-left">
                        <div className="bg-white/60 p-4 rounded-3xl border-2 border-brand-teal/10 shadow-inner max-w-sm mx-auto backdrop-blur-sm max-h-40 overflow-y-auto">
                          <p className="text-xs font-semibold text-brand-teal italic leading-relaxed whitespace-pre-wrap">
                            {selectedCertificate.content}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedCertificate.type === 'drawing' && selectedCertificate.analysis && !selectedCertificate.content && (
                      <div className="w-full mb-6 relative px-4 text-left">
                        <div className="bg-white/60 p-4 rounded-3xl border-2 border-brand-teal/10 shadow-inner max-w-sm mx-auto backdrop-blur-sm max-h-40 overflow-y-auto">
                          <p className="text-xs font-semibold text-brand-teal italic leading-relaxed whitespace-pre-wrap">
                            {selectedCertificate.analysis}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 bg-brand-teal text-white px-6 py-3 rounded-2xl font-black text-[12px] shadow-lg border-2 border-brand-teal/20">
                    <CheckCircle2 size={18} />
                    <span>做得好！继续加油！ Excellent Progress!</span>
                  </div>
                </div>

                <div className="absolute bottom-6 w-full text-center">
                  <p className="text-[8px] font-bold text-gray-300 uppercase tracking-[0.4em]">
                    快乐学中文 · FUN CHINESE LEARNING
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Navigation & Actions */}
        <div className="mt-8 flex flex-col items-center gap-6 w-full max-w-xl">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              disabled={isExporting}
              className={`px-8 py-3 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 flex items-center gap-2 ${isExporting ? 'bg-gray-400 cursor-wait' : 'bg-indigo-500 hover:bg-indigo-600'}`}
            >
              <Share2 size={20} className={isExporting ? 'animate-pulse' : ''} />
              <span>{isExporting ? (lang === 'zh' ? '生成中...' : 'Processing...') : (lang === 'zh' ? '分享' : lang === 'ms' ? 'Kongsi' : 'SHARE')}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              disabled={isExporting}
              className={`px-8 py-3 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 flex items-center gap-2 ${isExporting ? 'bg-gray-400 cursor-wait' : 'bg-emerald-500 hover:bg-emerald-600'}`}
            >
              <Download size={20} className={isExporting ? 'animate-pulse' : ''} />
              <span>{isExporting ? (lang === 'zh' ? '正在下载...' : 'Downloading...') : (lang === 'zh' ? '下载' : lang === 'ms' ? 'Muat Turun' : 'DOWNLOAD')}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (confirm(lang === 'zh' ? '确定要删除这个证书吗？' : 'Are you sure you want to delete this certificate?')) {
                  const savedKey = selectedCertificate.type === 'story' ? 'bedtime_stories_vault' : 'drawing_analysis_vault';
                  const existing = JSON.parse(localStorage.getItem(savedKey) || '[]');
                  const filtered = existing.filter((item: any) => item.id !== selectedCertificate.id);
                  localStorage.setItem(savedKey, JSON.stringify(filtered));
                  
                  // Reload certificates list
                  const allCerts = [
                    ...JSON.parse(localStorage.getItem('bedtime_stories_vault') || '[]'),
                    ...JSON.parse(localStorage.getItem('drawing_analysis_vault') || '[]')
                  ].sort((a, b) => Number(b.id) - Number(a.id));
                  setCertificates(allCerts);
                  
                  if (filtered.length > 0) {
                    setSelectedCertificate(filtered[0]);
                  } else {
                    setView('achievement-gallery');
                  }
                }
              }}
              className="px-8 py-3 bg-gray-100 text-gray-400 font-black rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all flex items-center gap-2"
            >
              <Trash2 size={20} />
              <span>{lang === 'zh' ? '删除' : lang === 'ms' ? 'Padam' : 'DELETE'}</span>
            </motion.button>
          </div>

          <div className="flex items-center gap-6 md:hidden">
            <button
              disabled={!hasPrev}
              onClick={handlePrev}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center border-4 transition-all shadow-xl ${hasPrev ? 'bg-emerald-500 border-white text-white active:scale-95' : 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed'}`}
            >
              <ChevronLeft size={32} strokeWidth={3} />
            </button>
            <div className="bg-white px-4 py-2 rounded-2xl shadow-md border-2 border-emerald-100 flex flex-col items-center">
              <span className="font-black text-brand-ink text-lg leading-none">
                {currentIndex + 1}
              </span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">
                OF {certificates.length}
              </span>
            </div>
            <button
              disabled={!hasNext}
              onClick={handleNext}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center border-4 transition-all shadow-xl ${hasNext ? 'bg-emerald-500 border-white text-white active:scale-95' : 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed'}`}
            >
              <ChevronRight size={32} strokeWidth={3} />
            </button>
          </div>

          <button
            onClick={() => {
              const savedKey = selectedCertificate.type === 'story' ? 'bedtime_stories_vault' : 'drawing_analysis_vault';
              const existing = JSON.parse(localStorage.getItem(savedKey) || '[]');
              const filtered = existing.filter((item: any) => item.id !== selectedCertificate.id);
              localStorage.setItem(savedKey, JSON.stringify(filtered));
              
              const newCerts = certificates.filter(c => c.id !== selectedCertificate.id);
              setCertificates(newCerts);
              
              if (newCerts.length > 0) {
                const nextIdx = Math.min(currentIndex, newCerts.length - 1);
                setSelectedCertificate(newCerts[nextIdx]);
              } else {
                setView('achievement-gallery');
              }
            }}
            className="px-6 py-3 bg-rose-50 text-rose-500 rounded-2xl font-black text-sm border-2 border-rose-100 shadow-sm hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2 group"
          >
            <Trash2 size={18} className="group-hover:animate-bounce" />
            <span>{lang === 'zh' ? '从收藏库移除' : lang === 'ms' ? 'Keluarkan dari Galeri' : 'Remove from Gallery'}</span>
          </button>
        </div>

        {/* Generated Image Modal (Fallback for Long Press) */}
        <AnimatePresence>
          {exportResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[600] flex flex-col items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
              onClick={() => setExportResult(null)}
            >
              <div className="relative max-w-2xl w-full flex flex-col items-center gap-4 bg-white p-4 rounded-3xl" onClick={e => e.stopPropagation()}>
                <button 
                  onClick={() => setExportResult(null)}
                  className="absolute -top-12 right-0 text-white flex items-center gap-2 font-black"
                >
                  <X size={24} />
                  <span>{lang === 'zh' ? '关闭' : 'CLOSE'}</span>
                </button>
                <p className="text-brand-ink font-black text-center text-sm mb-2">
                  {lang === 'zh' ? '💡 请长按图片选择“保存到相册”或“分享”' : '💡 Long press the image to SAVE or SHARE'}
                </p>
                <img src={exportResult} alt="Export result" className="w-full h-auto rounded-xl shadow-2xl border-4 border-emerald-100" />
                <button 
                  onClick={() => setExportResult(null)}
                  className="w-full py-4 bg-emerald-500 text-white font-black rounded-2xl shadow-xl mt-4"
                >
                  {lang === 'zh' ? '我知道了' : 'I GOT IT'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }


  if (view === 'drawing-analyzer') {
    return (
      <div className="h-screen bg-modern-gradient overflow-y-auto flex flex-col items-center">
        <DrawingAnalyzer 
          currentLang={lang} 
          username={username}
          isSubscribed={isSubscribed}
          onBack={() => goHome('latest-features')} 
          onSaveCertificate={(cert) => {
            const existing = JSON.parse(localStorage.getItem('drawing_analysis_vault') || '[]');
            const newRecord = {
              id: cert.id,
              date: cert.date,
              image: cert.previewImage,
              analysis: `${cert.analysis}\n\n📖 Story:\n${cert.content}`,
              studentName: cert.studentName
            };
            localStorage.setItem('drawing_analysis_vault', JSON.stringify([newRecord, ...existing]));
            
            // Reload local certificate hook in state
            const storiesRaw = localStorage.getItem('bedtime_stories_vault');
            const explorerRaw = localStorage.getItem('magic_explorer_vault');
            const drawingsRaw = localStorage.getItem('drawing_analysis_vault');
            
            const stories = storiesRaw ? JSON.parse(storiesRaw) : [];
            const explorers = explorerRaw ? JSON.parse(explorerRaw) : [];
            const drawings = drawingsRaw ? JSON.parse(drawingsRaw) : [];
            
            const mappedStories = stories.map((s: any) => ({
              id: s.id,
              type: 'story',
              title: s.title,
              date: s.date,
              content: s.content,
              studentName: s.studentName
            }));
            
            const mappedExplorers = explorers.map((e: any) => ({
              id: e.id,
              type: 'explorer',
              title: lang === 'zh' ? '魔法探索发现' : lang === 'ms' ? 'Penemuan Lensa Ajaib' : 'Magic Exploration',
              date: e.date,
              previewImage: e.image,
              analysis: e.analysis,
              studentName: e.studentName
            }));

            const mappedDrawings = drawings.map((d: any) => ({
              id: d.id,
              type: 'drawing',
              title: lang === 'zh' ? '绘画心理分析' : lang === 'ms' ? 'Analisis Lukisan' : 'Drawing Analysis',
              date: d.date,
              previewImage: d.image,
              analysis: d.analysis,
              studentName: d.studentName
            }));
            
            setCertificates([...mappedStories, ...mappedExplorers, ...mappedDrawings].sort((a, b) => parseInt(b.id) - parseInt(a.id)));
          }}
        />
        <div className="h-20" />
      </div>
    );
  }

  if (view === 'sentence-puzzle') {
    return (
      <div className="h-screen bg-modern-gradient overflow-y-auto flex flex-col items-center">
        <SentencePuzzle currentLang={lang} onBack={() => goHome('latest-features')} />
        <div className="h-20" />
      </div>
    );
  }

  if (view === 'games') {
    return (
      <div className="h-screen bg-modern-gradient overflow-y-auto flex flex-col items-center">
        <Games currentLang={lang} onLanguageChange={setLang} onBack={() => goHome('latest-features')} onHome={() => goHome('latest-features')} />
        <div className="h-20" />
      </div>
    );
  }

  if (view === 'achievement-gallery') {
    return (
      <div className="h-screen bg-gradient-to-b from-[#FFFDF8] via-[#FDF5E2] to-[#FFFDF8] overflow-y-auto flex flex-col items-center p-4 md:p-8">
        {/* Back Button and Title */}
        <div className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between mb-8 pb-6 border-b-2 border-orange-200/60 gap-4 mt-6">
          <button 
            onClick={() => setView('welcome')}
            className="px-6 py-3 bg-white text-orange-500 rounded-2xl shadow-md hover:bg-orange-50 border-2 border-orange-100 transition-all flex items-center gap-2 font-black text-sm select-none"
          >
            <ChevronLeft size={20} strokeWidth={3} />
            <span>{lang === 'zh' ? '返回主页' : lang === 'ms' ? 'Kembali' : 'Back to Home'}</span>
          </button>
          
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-black text-indigo-950 flex items-center gap-3 justify-center select-none">
              🏆 {lang === 'zh' ? '成就证书收藏库' : lang === 'ms' ? 'Galeri Sijil' : 'Achievement Gallery'}
            </h2>
            <p className="text-sm md:text-base font-bold text-orange-600 mt-2 uppercase tracking-wider select-none">
              {lang === 'zh' ? `这里珍藏了你的 ${certificates.length} 份成长好礼 🌟` : `Preserving your ${certificates.length} growth milestones 🌟`}
            </p>
          </div>

          <div className="w-[120px] hidden md:block" />
        </div>
        
        <div className="flex flex-col items-center gap-4 mb-12 text-center w-full max-w-7xl">
          <div className="flex flex-col gap-1">
            <h2 className="text-4xl md:text-5xl font-black text-indigo-900 drop-shadow-sm select-none">
              🏆 {lang === 'zh' ? '我的证书收藏库' : lang === 'ms' ? '🏆 Galeri Sijil Saya' : '🏆 My Certificate Gallery'}
            </h2>
            <p className="text-lg md:text-xl text-pink-600 font-black uppercase tracking-[0.2em] select-none">
              {lang === 'zh' ? '记录每一次成长的瞬间🎖️' : lang === 'ms' ? 'Kenangan Setiap Pertumbuhan🎖️' : 'Recording Every Moment of Growth🎖️'}
            </p>
          </div>

          {/* Collection Limit Notice */}
          <div className="max-w-2xl px-6 py-4 bg-pink-50 rounded-[24px] border-2 border-pink-100 flex items-center gap-4 mt-2">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-pink-500 shadow-sm shrink-0">
              <Sparkles size={20} />
            </div>
            <p className="text-sm font-bold text-pink-700 text-left leading-relaxed">
              {lang === 'zh' ? (
                <>小提醒：建议保留 <span className="text-pink-900 font-black underline underline-offset-4">30 份</span> 你最心爱的作品。当收藏满了，可以先下载旧作品到手机，为新的创作留出空间哦！ ✨</>
              ) : lang === 'ms' ? (
                <>Tip Comel: Kami syorkan simpan <span className="text-pink-900 font-black underline underline-offset-4">30 karya</span> paling kegemaran. Jika penuh, muat turun karya lama ke peranti untuk memberi ruang kepada karya baru! ✨</>
              ) : (
                <>Sweet Tip: We recommend keeping your <span className="text-pink-900 font-black underline underline-offset-4">Top 30</span> favorite works. When full, download older ones to your device to make room for new gems! ✨</>
              )}
            </p>
          </div>
        </div>

        {certificates.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl px-4 pb-20">
            {certificates.map((cert) => (
              <motion.button
                key={cert.id}
                whileHover={{ scale: 1.05, rotate: cert.type === 'story' ? -1 : 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedCertificate(cert);
                  setView('certificate-viewer');
                }}
                className={`flex flex-col items-center gap-3 p-4 rounded-[32px] border-4 transition-all shadow-lg relative overflow-hidden group h-full ${
                  cert.type === 'story' 
                    ? 'bg-gradient-to-br from-indigo-50 to-white border-indigo-200' 
                    : 'bg-gradient-to-br from-pink-50 to-white border-pink-200'
                }`}
              >
                <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden bg-white mb-2 relative border-2 border-dashed border-gray-200 group-hover:border-indigo-400">
                  {cert.previewImage ? (
                    <img src={cert.previewImage} alt={cert.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-50 text-indigo-400 gap-2">
                      <BookOpen size={40} className="opacity-40" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg shadow-sm border border-gray-100">
                    <span className="text-xl">{cert.type === 'story' ? '📖' : '🎨'}</span>
                  </div>
                </div>
                
                <div className="text-center w-full font-sans">
                  <h4 className="text-sm font-black text-indigo-900 truncate px-2">{cert.title}</h4>
                  <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{cert.date}</p>
                </div>
                
                <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${cert.type === 'story' ? 'bg-indigo-400' : 'bg-pink-400'}`} />
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="bg-white/40 backdrop-blur-md rounded-[50px] p-16 border-8 border-dashed border-gray-200 text-center flex flex-col items-center gap-6 max-w-2xl w-full mx-4 mb-20">
            <div className="text-7xl opacity-40">🎖️</div>
            <div>
              <h4 className="text-2xl font-black text-gray-400">
                {lang === 'zh' ? '暂无收藏' : lang === 'ms' ? 'Tiada Sijil Lagi' : 'No Certificates Yet'}
              </h4>
              <p className="text-sm font-bold text-gray-400/60 mt-1">
                {lang === 'zh' ? '快去体验 AI 故事与绘画功能吧！' : lang === 'ms' ? 'Cubalah ciri AI Cerita dan Lukisan sekarang!' : 'Try out AI Story and Drawing features to earn certificates!'}
              </p>
            </div>
            <button 
              onClick={() => setView('welcome')}
              className="mt-4 px-8 py-3 bg-indigo-500 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-600 transition-all active:scale-95"
            >
              {lang === 'zh' ? '前往魔法屋' : lang === 'ms' ? 'Ke Zon Magik' : 'Go to Magic Zone'}
            </button>
          </div>
        )}
        <div className="h-20 shrink-0" />
      </div>
    );
  }

  const handleNext = () => {
    if (currentIndex < filteredItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(filteredItems.length - 1);
    }
  };

  if (['about', 'contact', 'privacy', 'terms', 'refund', 'cancellation'].includes(view)) {
    return (
      <div className="h-screen bg-modern-gradient overflow-y-auto">
        <LegalPages 
          type={view as any} 
          lang={lang} 
          onBack={() => setView('welcome')} 
          onHome={() => goHome()} 
        />
      </div>
    );
  }

  if (view === 'welcome') {
    return (
    <div id="welcome-root" className="h-screen bg-[#F5F2E8] font-sans overflow-y-auto overflow-x-hidden md:snap-y md:snap-proximity text-brand-ink">

        {/* Top Navigation Bar - Match App Header for Smart feel */}
        <div className="fixed top-0 left-0 w-full z-[150] bg-gradient-to-r from-sky-400 via-sky-300 to-sky-400 border-b-2 border-white shadow-lg px-4 md:px-12 py-1 md:py-2 transition-all duration-300">
          {/* Company Logo Link - KIDUNI */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 z-[210] flex justify-center pointer-events-auto">
            <button
              onClick={() => {
                const root = document.getElementById('welcome-root');
                if (root) root.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="block transform hover:scale-110 transition-transform"
            >
              <img src="https://i.ibb.co/TM3WwYjQ/1000046067-removebg-preview.png" alt="KIDUNI" border="0" className="h-16 md:h-20 w-auto object-contain" referrerPolicy="no-referrer" />
            </button>
          </div>
          {/* Trilingual Selector - Moved BELOW KIDUNI logo to avoid overlapping and blocking text */}
          <div className="absolute top-22 md:top-36 left-1/2 -translate-x-1/2 flex justify-center z-[200] scale-[0.7] md:scale-[0.8] gap-3 items-center origin-top">
            {!isSubscribed && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setView('subscription')}
                className="bg-indigo-600 text-white px-3 py-1.5 rounded-full text-[10px] font-black flex items-center gap-2 shadow-lg"
              >
                <Crown size={12} className="text-yellow-400" />
                <span>JOIN PRO</span>
              </motion.button>
            )}
            <LanguageSelector currentLang={lang} onLanguageChange={setLang} />
          </div>
          <div className="max-w-7xl mx-auto flex flex-col gap-1.5 pt-12 md:pt-16">
            <div className="flex items-center justify-between gap-4">
              {/* Left Side: Greeting & Subscription */}
              <div className="flex-none flex items-center justify-start gap-2 md:gap-4">
                <div className="hidden md:flex flex-col items-start ml-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-black text-[10px] md:text-sm drop-shadow-sm leading-none">Hi, {username}! ✨</span>
                    {trialTimeLeft && (
                      <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl border-2 border-yellow-400 flex flex-col items-center gap-0 shadow-lg animate-flash">
                        <span className="text-[10px] font-black text-brand-ink uppercase tracking-tighter leading-none">TRIAL</span>
                        <span className="text-sm md:text-lg font-black text-red-600 tracking-tighter leading-none">{trialTimeLeft}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setView('subscription')}
                      title="Subscription"
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 border-yellow-200 shadow-md transition-all group ${
                        view === 'subscription' ? 'bg-yellow-400' : 'bg-gradient-to-br from-yellow-300 to-amber-500'
                      }`}
                    >
                      <Crown size={20} className="drop-shadow-sm group-hover:rotate-12 transition-transform text-white" />
                    </motion.button>
                  </div>
                </div>

                {/* Mobile Greeting & Subscription */}
                <div className="md:hidden flex flex-col gap-1 items-start">
                  {trialTimeLeft && (
                    <div className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-xl border-2 border-yellow-400 flex flex-col items-center gap-0 shadow-md animate-flash mb-1">
                      <span className="text-[8px] font-black text-brand-ink uppercase tracking-tighter leading-none">TRIAL</span>
                      <span className="text-xs font-black text-red-600 tracking-tighter leading-none">{trialTimeLeft}</span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setView('subscription')}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 border-yellow-200 shadow-md ${
                        view === 'subscription' ? 'bg-yellow-400' : 'bg-gradient-to-br from-yellow-400 to-orange-500'
                      }`}
                    >
                      <Crown size={20} className="text-white" />
                    </motion.button>
                  </div>
                </div>
              </div>
              
              {/* Empty Space where Title/Logo was */}
              <div className="flex-1" />

              {/* Right Side: Logout Section */}
              <div className="flex-none flex items-center justify-end gap-2 md:gap-4">
                {/* Desktop Change Password and Logout */}
                <div className="hidden md:flex gap-2">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsChangePasswordOpen(true)}
                    title="Change Password"
                    className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg border-2 border-emerald-100 cursor-pointer transition-colors hover:bg-emerald-50"
                  >
                    <KeyRound className="w-5 h-5 text-emerald-500" />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLogout}
                    title="Logout"
                    className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg border-2 border-red-100 cursor-pointer transition-colors hover:bg-red-50"
                  >
                    <LogOut className="w-5 h-5 text-red-500" />
                  </motion.button>
                </div>
                {/* Mobile Change Password and Logout */}
                <div className="md:hidden flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setIsChangePasswordOpen(true)}
                    title="Change Password"
                    className="w-10 h-10 rounded-xl bg-white text-emerald-500 border-2 border-emerald-50 flex items-center justify-center shadow-md"
                  >
                    <KeyRound size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={handleLogout}
                    title="Logout"
                    className="w-10 h-10 rounded-xl bg-white text-red-400 border-2 border-red-50 flex items-center justify-center shadow-md"
                  >
                    <LogOut size={20} />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Smart Navigation Header Buttons - Two-Line Layout */}
            <div className="grid grid-cols-6 gap-1 md:gap-3 w-full max-w-2xl px-2 mt-4 pt-4 border-t border-white/20">
              {[
                { id: 'magic-cards', label: '神奇单词卡(255)', en: 'Cards 255', ms: 'Kad 255', icon: '🃏' },
                { id: 'daily-sentences', label: '生活说说话(320)', en: 'Sentences 320', ms: 'Ayat 320', icon: '🗣️' },
                { id: 'dialogue-practice', label: '对话练习(480)', en: 'Dialogue 480', ms: 'Perbualan 480', icon: '🤝' },
                { id: 'latest-features', label: '最新功能', en: 'Features', ms: 'Ciri', icon: '✨' },
                { id: 'achievement-gallery', label: '证书收藏库', en: 'Gallery', ms: 'Galeri', icon: '🏆' }
              ].map((theme, i) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => {
                    if (theme.id === 'achievement-gallery') {
                      setViewProtected('achievement-gallery');
                    } else {
                      scrollToSection(theme.id);
                    }
                  }}
                  className={`flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all border-2 border-orange-400 backdrop-blur-md ${i < 2 ? 'col-span-3' : 'col-span-2'}`}
                >
                  <span className="text-sm md:text-2xl">{theme.icon}</span>
                  <span className={`font-black whitespace-nowrap uppercase tracking-wider ${lang === 'zh' ? 'text-[10px] md:text-sm' : 'text-[8px] md:text-[10px]'}`}>
                    {lang === 'zh' ? theme.label : lang === 'ms' ? theme.ms : theme.en}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Header / Title Section (Part of static content, now with snap stop) */}
        <section className="snap-start pt-24 md:pt-32 w-full flex flex-col items-center py-4 md:py-6 pointer-events-none opacity-0 h-0 overflow-hidden">
          {/* Section Hidden intentionally as per user request */}
        </section>

        {/* Section 1: Premium Hero */}
        <section id="magic-cards" className="min-h-screen w-full flex flex-col items-center justify-center snap-start relative bg-modern-gradient pt-40 pb-20">
          {/* Animated Background Decor */}
          <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-brand-coral/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-brand-teal/5 rounded-full blur-3xl animate-float-delayed" />
          
          {/* Hero Section Content */}
          <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center z-10 px-6 md:px-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-6 md:gap-8 text-center lg:text-left"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={lang}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className={`font-black text-brand-ink leading-[1.1] tracking-tight ${lang === 'zh' ? 'text-4xl sm:text-5xl md:text-6xl' : 'text-3xl sm:text-4xl md:text-5xl'}`}>
                    {lang === 'zh' ? (
                      <>
                        <span className="block text-green-600 [text-shadow:2px_2px_0_#fff,-2px_2px_0_#fff,2px_-2px_0_#fff,-2px_-2px_0_#fff] text-[53px] sm:text-[66px] md:text-[106px] mb-8 tracking-tighter leading-none relative top-0">
                          三语同步
                        </span>
                        让我们一起<br />
                        <span className="text-red-700">勇敢开口</span><br />
                        <span className="text-red-700">说中文吧</span>
                      </>
                    ) : lang === 'ms' ? (
                      <>
                        <span className="block text-green-600 [text-shadow:2px_2px_0_#fff,-2px_2px_0_#fff,2px_-2px_0_#fff,-2px_-2px_0_#fff] text-[40px] sm:text-[53px] md:text-[66px] mb-8 tracking-tighter leading-none relative top-0">
                          TRILINGUAL SYNC
                        </span>
                        Mari belajar<br /><span className="text-brand-coral">Bahasa Cina</span><br /><span className="underline decoration-brand-yellow decoration-4 md:decoration-6 underline-offset-4 md:underline-offset-6">Bersama</span>!</>
                    ) : (
                      <>
                        <span className="block text-green-600 [text-shadow:2px_2px_0_#fff,-2px_2px_0_#fff,2px_-2px_0_#fff,-2px_-2px_0_#fff] text-[40px] sm:text-[53px] md:text-[66px] mb-8 tracking-tighter leading-none relative top-0">
                          TRILINGUAL SYNC
                        </span>
                        Let's explore<br /><span className="text-brand-coral">Chinese</span><br /><span className="underline decoration-brand-yellow decoration-4 md:decoration-6 underline-offset-4 md:underline-offset-6">Together</span>!</>
                    )}
                  </h1>
                </motion.div>
              </AnimatePresence>
              
              <p className={`text-brand-muted font-bold max-w-4xl leading-relaxed mx-auto lg:mx-0 whitespace-pre-line text-center lg:text-left ${lang === 'zh' ? 'text-base md:text-xl' : 'text-sm md:text-lg'}`}>
                {lang === 'zh' 
                  ? (
                    <>
                      <motion.span 
                        animate={{ color: ['#71717a', '#dc2626', '#71717a'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="font-bold underline decoration-2 underline-offset-4"
                      >
                        精选儿童必学的1000多样词汇集实用短语对话句子与有趣故事及更多，都能帮助孩子掌握语言基础。
                      </motion.span>
                    </>
                  )
                  : lang === 'ms'
                  ? (
                    <>
                      <motion.span 
                        animate={{ color: ['#71717a', '#dc2626', '#71717a'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="font-bold underline decoration-2 underline-offset-4"
                      >
                        Koleksi kosa kata mustahak kanak-kanak, membantu mereka menguasai asas bahasa dengan mudah.
                      </motion.span>
                    </>
                  )
                  : (
                    <>
                      <motion.span 
                        animate={{ color: ['#71717a', '#dc2626', '#71717a'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="font-bold underline decoration-2 underline-offset-4"
                      >
                        Essential vocabulary collection for kids, helping them master language basics with ease.
                      </motion.span>
                    </>
                  )
                }
              </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6">
                <div className="flex items-center gap-2 md:gap-3 px-6 md:px-8 py-4 rounded-3xl btn-3d-coral border-4 border-white/20 w-[180px] md:w-[280px] transition-all text-sharp">
                  <span className="text-2xl md:text-4xl drop-shadow-md">🧸</span>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-xl md:text-2xl font-black text-white">
                      {lang === 'zh' ? '基础' : lang === 'ms' ? 'Asas' : 'Basic'}
                    </span>
                    <span className="text-sm md:text-base font-black text-white/90">
                      {lang === 'zh' ? '2–6岁儿童' : lang === 'ms' ? 'Kanak-kanak 2–6 thn' : 'Ages 2–6'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3 px-6 md:px-8 py-4 rounded-3xl btn-3d-yellow border-4 border-white/20 w-[180px] md:w-[280px] transition-all text-sharp">
                  <span className="text-2xl md:text-4xl drop-shadow-md">🛡️</span>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-xl md:text-2xl font-black text-brand-ink">
                      {lang === 'zh' ? '进阶' : lang === 'ms' ? 'Pertengahan' : 'Advanced'}
                    </span>
                    <span className="text-sm md:text-base font-black text-brand-ink/80">
                      {lang === 'zh' ? '7–10岁儿童' : lang === 'ms' ? 'Kanak-kanak 7–10 thn' : 'Ages 7–10'}
                    </span>
                  </div>
                </div>
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center lg:items-start"
              >
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ 
                      boxShadow: [
                        "0 0 0 0px rgba(255,255,255,1)", 
                        "0 0 0 15px rgba(255,255,255,0)",
                        "0 0 0 0px rgba(255,255,255,0)"
                      ],
                      borderColor: ["rgba(255,255,255,1)", "rgba(255,255,255,0.5)", "rgba(255,255,255,1)"]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1.5,
                      ease: "easeInOut"
                    }}
                    onClick={() => {
                      setSubscriptionTarget('plans');
                      setView('subscription');
                    }}
                    className="bg-gradient-to-r from-indigo-600 to-violet-700 text-white px-8 py-5 rounded-3xl font-black text-xl flex items-center justify-center gap-3 shadow-2xl border-[6px] border-white group w-full sm:w-[320px] relative overflow-hidden"
                  >
                    <Crown className="text-yellow-400 group-hover:rotate-12 transition-transform" />
                    <span>{lang === 'zh' ? '开启 PRO 全功能' : lang === 'ms' ? 'Buka Semua PRO' : 'JOIN PRO UNLIMITED'}</span>
                  </motion.button>
                  
                  <button 
                    onClick={() => {
                      setSubscriptionTarget('trial');
                      setView('subscription');
                    }}
                    className="bg-white text-brand-ink px-8 py-5 rounded-3xl font-black text-xl border-4 border-brand-ink/10 hover:bg-gray-100 transition-all flex items-center justify-center gap-2 w-full sm:w-[320px] shadow-lg"
                  >
                    {lang === 'zh' ? '免费试用' : lang === 'ms' ? 'Cuba Percuma' : 'Free Trial'}
                  </button>
                </div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: 1, 
                    scale: [1, 1.03, 1],
                    boxShadow: [
                      "0 0 0 rgba(45,212,191,0)",
                      "0 0 20px rgba(45,212,191,0.4)",
                      "0 0 0 rgba(45,212,191,0)"
                    ]
                  }}
                  transition={{
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="inline-flex self-center lg:self-start items-center gap-2 bg-gradient-to-r from-brand-teal to-teal-400 px-4 py-2.5 rounded-2xl shadow-xl border-2 border-white/30 relative overflow-hidden group mb-4"
                >
                  {/* Shimmering Glare Effect */}
                  <motion.div 
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                  />
                  
                  <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm z-10">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex flex-col items-start leading-tight z-10">
                    <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">
                      {lang === 'zh' ? '特选之作' : lang === 'ms' ? 'Pilihan Premium' : 'Premium Choice'}
                    </span>
                    <span className="text-xs font-bold text-white drop-shadow-sm">
                      {lang === 'zh' ? '顶级早教评分' : lang === 'ms' ? 'Penarafan Tertinggi' : 'Top Rated Early Learning'}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 ml-2 z-10">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </motion.div>
              </motion.div>

            <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => startNow(e)}
                className="mt-4 px-8 md:px-12 py-4 md:py-6 text-white rounded-[30px] font-black text-xl md:text-2xl flex items-center justify-center gap-4 group transition-all btn-3d-sky shadow-2xl text-shadow-lg"
              >
                <span className="text-sharp drop-shadow-md text-emerald-100">{lang === 'zh' ? '开启探索之旅 · START ADVENTURE' : lang === 'ms' ? 'MULAKAN BELAJAR · START ADVENTURE' : 'START ADVENTURE'}</span>
                <ChevronRight className="group-hover:translate-x-2 transition-transform h-6 w-6 md:h-8 md:w-8 text-white" />
              </motion.button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1 relative w-screen -mx-6 md:-mx-12 lg:-mx-[calc(50vw-50%)] lg:w-[50vw] h-[400px] lg:h-full lg:min-h-[600px] overflow-hidden group"
            >
              <img 
                src="https://i.ibb.co/C3ZnDhgX/istockphoto-484794664-612x612.jpg" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                referrerPolicy="no-referrer"
                alt="Children learning together"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              
              {/* Floating Key Features */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-8 right-8 bg-[#F5F2E8]/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 flex items-center gap-3 z-20"
              >
                <div className="w-10 h-10 bg-brand-coral rounded-xl flex items-center justify-center text-white font-black">AI</div>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase text-gray-400">
                    {lang === 'zh' ? '由 ... 提供' : lang === 'ms' ? 'Dikuasakan oleh' : 'Powered by'}
                  </p>
                  <p className="text-xs font-bold">
                    {lang === 'zh' ? '自然语言技术' : lang === 'ms' ? 'Suara Semulajadi' : 'Natural Voice'}
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute bottom-8 left-8 bg-[#F5F2E8]/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 flex items-center gap-3 z-20"
              >
                <div className="w-10 h-10 bg-brand-teal rounded-xl flex items-center justify-center text-white text-xl">✨</div>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase text-gray-400">
                    {lang === 'zh' ? '探索体验' : lang === 'ms' ? 'Teroka Pengalaman' : 'Experience'}
                  </p>
                  <p className="text-xs font-bold">
                    {lang === 'zh' ? '直观交互' : lang === 'ms' ? 'Intuitif' : 'Intuitive UX'}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-40">
            <span className="text-[10px] font-black uppercase tracking-widest">
              {lang === 'zh' ? '向下滚动探索' : lang === 'ms' ? 'Skrol untuk teroka' : 'Scroll to explore'}
            </span>
            <div className="w-0.5 h-6 bg-brand-ink rounded-full" />
          </div>
        </section>

        {/* Section 2.5: Individual Feature Links */}
        <section id="daily-sentences" className="min-h-screen w-full flex flex-col items-center justify-center snap-start py-24 bg-white relative">
          <div id="dialogue-practice" className="absolute top-0 left-0 w-full h-1" />
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-brand-ink/5 to-transparent" />
          <div className="max-w-6xl w-full px-6 flex flex-col gap-16">
            <div className="flex flex-col items-center text-center gap-4">
              <span className="text-brand-coral font-black tracking-[0.3em] uppercase">
                {lang === 'zh' ? '各功能特色' : lang === 'ms' ? 'Ciri-ciri Individu' : 'Individual Features'}
              </span>
              <h2 className={`font-black text-brand-ink leading-tight ${lang === 'zh' ? 'text-4xl md:text-7xl' : 'text-3xl md:text-6xl px-4'}`}>
                {lang === 'zh' ? '从1000个生活情境词汇出发，在三语环境中自然延伸，让孩子一步步累积3000句真实可用的表达能力' : 
                 lang === 'ms' ? 'Bermula daripada 1000 kosa kata situasi harian, berkembang secara semula jadi dalam persekitaran tiga bahasa, membolehkan kanak-kanak mengumpul 3000 ayat ungkapan yang sebenar dan berguna langkah demi langkah.' :
                 'Unlock Your Child\'s Language Potential: From 1000 daily words to 3000 practical expressions in a trilingual environment.'}
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[
                { id: 'magic-cards', label: '神奇单词卡(255)', en: 'Magic Word Cards 255', ms: 'Kad Perkataan Sakti 255', icon: '🃏', color: 'bg-brand-coral', border: 'border-brand-coral', desc: { zh: '精选儿童必学词汇集', en: 'Essential Kids Vocabulary', ms: 'Koleksi Kosa Kata Kanak-kanak' } },
                { id: 'daily-sentences', label: '生活说说话(320)', en: 'Daily Sentences 320', ms: 'Ayat Harian 320', icon: '🗣️', color: 'bg-brand-teal', border: 'border-brand-teal', desc: { zh: '实用日常生活短语', en: 'Practical Daily Phrases', ms: 'Frasa Harian Praktikal' } },
                { id: 'dialogue-practice', label: '对话练习(480)', en: 'Dialogue Practice 480', ms: 'Latihan Perbualan 480', icon: '🤝', color: 'bg-violet-500', border: 'border-violet-500', desc: { zh: '互动式情境对话', en: 'Interactive Situations', ms: 'Perbualan Situasi Interaktif' } },
                { id: 'latest-features', label: '魔法创意与成长乐园', en: 'AI Stories & Games', ms: 'Zon Cerita & Main AI', icon: '✨', color: 'bg-indigo-500', border: 'border-indigo-500', desc: { zh: '探索 更多新功能', en: 'Personalized AI tales & trilingual games', ms: 'Cerita AI kustom & mainan 3 bahasa' } },
                { id: 'achievement-gallery', label: '证书收藏库', en: 'Gallery', ms: 'Galeri', icon: '🏆', color: 'bg-emerald-500', border: 'border-emerald-500', desc: { zh: '证书与奖励收藏', en: 'Achievements & Rewards', ms: 'Koleksi Sijil & Ganjaran' } }
              ].map((feature, i) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -12 }}
                    className={`group relative ${feature.id === 'achievement-gallery' ? 'col-span-2 lg:col-span-4' : ''}`}
                  >
                    <div className={`absolute inset-0 ${feature.color} rounded-[40px] opacity-10 blur-xl group-hover:opacity-20 transition-opacity`} />
                    <div className={`bg-white p-6 md:p-8 rounded-[40px] border-[6px] ${feature.border} shadow-xl group flex ${feature.id === 'achievement-gallery' ? 'flex-col md:flex-row' : 'flex-col'} items-center text-center ${feature.id === 'achievement-gallery' ? 'md:text-left' : 'text-center'} gap-6 relative z-10 h-full transition-all`}>
                      <div className={`w-20 h-20 md:w-24 md:h-24 ${feature.color} rounded-3xl flex items-center justify-center text-4xl md:text-5xl text-white shadow-xl group-hover:scale-110 transition-transform rotate-3 group-hover:rotate-0 flex-shrink-0`}>
                        {feature.icon}
                      </div>
                      <div className={`flex flex-col gap-2 ${feature.id === 'achievement-gallery' ? 'flex-grow' : ''}`}>
                        <h3 className={`font-black text-brand-ink ${lang === 'zh' ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
                          {lang === 'zh' ? feature.label : lang === 'ms' ? feature.ms : feature.en}
                        </h3>
                        <p className={`font-bold text-brand-muted/70 ${lang === 'zh' ? 'text-base' : 'text-sm'}`}>
                          {lang === 'zh' ? feature.desc.zh : lang === 'ms' ? feature.desc.ms : feature.desc.en}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (feature.id === 'achievement-gallery') {
                            setViewProtected('achievement-gallery');
                          } else {
                            scrollToSection(feature.id);
                          }
                        }}
                        className={`${feature.id === 'achievement-gallery' ? 'mt-auto md:mt-0 w-full md:w-auto md:min-w-[200px]' : 'mt-auto w-full'} px-8 py-5 border-b-[8px] ${feature.id === 'magic-cards' ? 'bg-brand-coral border-sky-700' : feature.id === 'daily-sentences' ? 'bg-brand-teal border-teal-700' : feature.id === 'dialogue-practice' ? 'bg-violet-500 border-violet-800' : feature.id === 'latest-features' ? 'bg-amber-500 border-amber-700' : 'bg-emerald-500 border-emerald-700'} text-white text-xl font-black rounded-3xl shadow-2xl hover:brightness-110 active:border-b-0 active:translate-y-2 transition-all text-sharp`}
                      >
                        {lang === 'zh' ? '即刻探索' : lang === 'ms' ? 'Teroka Sekarang' : 'Explore Now'}
                      </button>
                    </div>
                  </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Final Call */}
        <section id="latest-features" className="min-h-screen w-full flex flex-col items-center justify-between snap-start relative pt-20">
          <div className="absolute inset-0 bg-[#FEF9E7] opacity-60" />
          
          <div className="max-w-4xl w-full text-center z-10 flex flex-col gap-8 items-center px-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 md:w-48 flex justify-center cursor-pointer" />
            </div>
            <h2 className={`font-black text-brand-ink leading-[1.2] ${lang === 'zh' ? 'text-4xl md:text-6xl' : 'text-3xl md:text-5xl'}`}>
              {lang === 'zh' ? (
                <>准备好引领孩子迈入<br />更高层次的中文学习殿堂。</>
              ) : lang === 'ms' ? (
                <>Sedia untuk memimpin anak anda<br />ke arah pembelajaran Mandarin luar biasa.</>
              ) : (
                <>Ready to lead your child to a<br />higher level of Mandarin learning.</>
              )}
            </h2>
            <p className={`text-brand-muted font-semibold max-w-xl ${lang === 'zh' ? 'text-xl' : 'text-lg'}`}>
              {lang === 'zh' ? '加入成千上万个已经选择用现代方式帮助孩子掌握中文的家长行列。' : 
               lang === 'ms' ? 'Sertai beribu ibu bapa yang telah memilih cara moden untuk membantu anak mereka menguasai bahasa Mandarin.' :
               'Join thousands of parents who have already chosen the modern way to help their kids master Mandarin.'}
            </p>
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => startNow(e)}
              className="px-12 py-5 text-white rounded-[30px] font-black text-2xl shadow-2xl transition-all btn-3d-teal text-sharp mt-4 mb-4"
            >
              {lang === 'zh' ? '即刻开始 · START NOW' : lang === 'ms' ? 'MULAKAN SEKARANG · START NOW' : 'START NOW'}
            </motion.button>

            {/* Testimonials Section */}
            <div className="w-full mt-8 mb-16 overflow-hidden">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="flex text-amber-400 text-2xl">
                  {['★', '★', '★', '★', '★'].map((s, i) => (
                    <span key={i} className={i === 4 ? 'opacity-50' : ''}>{s}</span>
                  ))}
                </div>
                <span className="font-black text-xl text-brand-ink">4.8/5.0</span>
                <span className="text-brand-muted font-bold">(988+ Reviews)</span>
              </div>

              <div className="relative group overflow-hidden w-full">
                <div className="flex animate-marquee hover:pause w-max gap-6 py-4 will-change-transform">
                  {[...TESTIMONIALS, ...TESTIMONIALS].map((rev, i) => (
                    <div key={i} className="flex-shrink-0 bg-white/80 backdrop-blur shadow-md rounded-2xl p-6 border border-white min-w-[300px] max-w-[400px] whitespace-normal">
                      <p className={`text-brand-ink font-medium mb-3 ${lang === 'zh' ? 'text-sm' : 'text-xs'}`}>
                        "{rev.text[rev.originalLang as keyof typeof rev.text || lang]}"
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-brand-coral/20 flex items-center justify-center font-black text-xs text-brand-coral">
                          {rev.name.charAt(0)}
                        </div>
                        <span className="font-bold text-xs text-brand-muted">{rev.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Fade overlays */}
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#F5F2E8] to-transparent pointer-events-none z-10" />
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#F5F2E8] to-transparent pointer-events-none z-10" />
              </div>
            </div>
          </div>

          {/* Bottom Banner Image - Now in flow at the very bottom */}
          <div className="w-full overflow-hidden leading-[0] z-10 mt-12">
            <img 
              src="https://i.ibb.co/GN75SZP/istockphoto-589961490-612x612.jpg" 
              className="w-full h-auto object-cover min-h-[300px] md:min-h-[450px] border-t-8 border-white shadow-2xl scale-105"
              alt="Learning together banner"
            />
          </div>
        </section>

        {/* Footer Section */}
        <section id="achievement-gallery" className="w-full bg-white relative z-20 border-t-8 border-gray-100 pb-32">
          <Footer lang={lang} onNavigate={setView} />
        </section>

        <VoiceHelpModal 
          isOpen={isVoiceHelpOpen} 
          onClose={() => setIsVoiceHelpOpen(false)} 
          lang={lang} 
        />

        <ChangePasswordModal
          isOpen={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
          username={username}
          lang={lang}
        />
      </div>
    );
  }

  return (
    <div className="h-screen bg-modern-gradient relative flex flex-col font-sans overflow-hidden text-brand-ink">

      {/* Dynamic Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating Stars Decor */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-[15%] left-[5%] text-brand-yellow/30 text-4xl"
        >✨</motion.div>
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute top-[60%] right-[8%] text-brand-teal/30 text-5xl"
        >🌟</motion.div>
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[20%] left-[10%] text-brand-coral/30 text-3xl"
        >💫</motion.div>
      </div>

      {/* Section 1: Static Header (Does NOT move) */}
      <div className={`flex-none z-[100] w-full bg-gradient-to-r from-sky-400 via-sky-300 to-sky-400 border-b-4 border-white shadow-xl px-4 md:px-12 transition-all duration-300 ${
        selectedCategory ? 'py-1 md:py-1.5' : 'py-2 md:py-3'
      }`}>
            {/* Company Logo Link - KIDUNI */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 z-[210] flex justify-center pointer-events-auto">
              <button
                onClick={() => goHome('latest-features')}
                className="block transform hover:scale-110 transition-transform"
              >
                <img src="https://i.ibb.co/TM3WwYjQ/1000046067-removebg-preview.png" alt="KIDUNI" border="0" className="h-16 md:h-20 w-auto object-contain" referrerPolicy="no-referrer" />
              </button>
            </div>
            {/* Trilingual Selector - Moved BELOW KIDUNI logo to avoid overlapping and blocking text */}
            <div className="absolute top-20 md:top-24 left-1/2 -translate-x-1/2 flex justify-center z-[200] scale-[0.7] md:scale-[0.8] gap-3 items-center origin-top">
              {!isSubscribed && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setView('subscription')}
                  className="bg-indigo-600 text-white px-3 py-1.5 rounded-full text-[10px] font-black flex items-center gap-2 shadow-lg"
                >
                  <Crown size={12} className="text-yellow-400" />
                  <span>JOIN PRO</span>
                </motion.button>
              )}
              <LanguageSelector currentLang={lang} onLanguageChange={setLang} />
            </div>

            <div className="max-w-7xl mx-auto flex flex-col gap-1 md:gap-2 pt-16 md:pt-20">
          <header className="flex items-center w-full gap-2 md:gap-4 pb-4">
            {/* Home Logo - Moved to top left side */}
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => goHome(e)}
              className={`${selectedCategory ? 'w-7 h-7 md:w-10 md:h-10' : 'w-10 h-10 md:w-14 md:h-14'} bg-white rounded-lg md:rounded-xl flex items-center justify-center border-2 md:border-4 border-sky-400 shadow-lg cursor-pointer relative transition-all hover:bg-sky-50 flex-shrink-0`}
            >
              <Home className={`${selectedCategory ? 'w-4 h-4 md:w-6 md:h-6' : 'w-6 h-6 md:w-8 md:h-8'} text-sky-500`} />
              <div className={`absolute -bottom-1 -right-1 bg-brand-yellow rounded-full border-2 border-white shadow-sm transition-all ${
                selectedCategory ? 'w-2 h-2 md:w-3 md:h-3' : 'w-3 h-3 md:w-4 md:h-4'
              }`} />
            </motion.div>

            {/* Empty Space where Title/Logo was */}
            <div className="flex-1" />

            {/* Action Section - Right Side */}
            <div className={`flex-none flex items-center justify-end gap-2 md:gap-4 transition-all ${
              selectedCategory ? 'w-32 md:w-56' : 'w-32 md:w-72'
            }`}>
              <div className="hidden md:flex flex-col items-end">
                {!selectedCategory && <span className="text-white font-black text-[10px] md:text-sm drop-shadow-sm leading-none mb-1">Hi, {username}! ✨</span>}
                <div className="flex gap-2">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsChangePasswordOpen(true)}
                    title="Change Password"
                    className={`${selectedCategory ? 'w-6 h-6' : 'w-8 h-8'} bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-emerald-100 cursor-pointer transition-colors hover:bg-emerald-50`}
                  >
                    <KeyRound className={`${selectedCategory ? 'w-3 h-3' : 'w-4 h-4'} text-emerald-500`} />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLogout}
                    title="Logout"
                    className={`${selectedCategory ? 'w-6 h-6' : 'w-8 h-8'} bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-red-100 cursor-pointer transition-colors hover:bg-red-50`}
                  >
                    <LogOut className={`${selectedCategory ? 'w-3 h-3' : 'w-4 h-4'} text-red-500`} />
                  </motion.button>
                </div>
              </div>
              
              {/* Voice Help, Settings & Logout Mobile */}
              <div className="md:hidden flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(true)}
                  title="Change Password"
                  className={`${selectedCategory ? 'w-7 h-7' : 'w-9 h-9'} rounded-lg bg-white text-emerald-500 flex items-center justify-center border border-emerald-50 shadow-sm`}
                >
                  <KeyRound size={selectedCategory ? 14 : 18} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                  className={`${selectedCategory ? 'w-7 h-7' : 'w-9 h-9'} rounded-lg bg-white text-red-400 flex items-center justify-center border border-red-50 shadow-sm`}
                >
                  <LogOut size={selectedCategory ? 14 : 18} />
                </button>
              </div>
            </div>
          </header>

          {/* Theme Quick Navigation - Two-Line Layout */}
          {!selectedCategory && (
            <div className="grid grid-cols-6 gap-1 md:gap-3 w-full max-w-2xl px-2 mt-4 pt-4 border-t border-white/20">
              {[
                { id: 'magic-cards', label: '神奇单词卡(255)', en: 'Cards 255', ms: 'Kad 255', icon: '🃏' },
                { id: 'daily-sentences', label: '生活说说话(320)', en: 'Sentences 320', ms: 'Ayat 320', icon: '🗣️' },
                { id: 'dialogue-practice', label: '对话练习(480)', en: 'Dialogue 480', ms: 'Perbualan 480', icon: '🤝' },
                { id: 'latest-features', label: '最新功能', en: 'Features', ms: 'Ciri', icon: '✨' },
                { id: 'achievement-gallery', label: '证书收藏库', en: 'Gallery', ms: 'Galeri', icon: '🏆' }
              ].map((theme, i) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (theme.id === 'achievement-gallery') {
                      setViewProtected('achievement-gallery');
                    } else {
                      scrollToSection(theme.id);
                    }
                  }}
                  className={`flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all border-2 border-orange-400 backdrop-blur-md ${i < 2 ? 'col-span-3' : 'col-span-2'}`}
                >
                  <span className="text-sm md:text-2xl">{theme.icon}</span>
                  <span className={`font-black uppercase tracking-wider ${lang === 'zh' ? 'text-[10px] md:text-sm' : 'text-[8px] md:text-[10px]'}`}>
                    {lang === 'zh' ? theme.label : lang === 'ms' ? theme.ms : theme.en}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Independent Scrollable Content */}
      <div id="main-content" className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 w-full">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-full px-6 py-12">
        {/* Floating background elements */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-brand-coral/20 organic-1 animate-float hidden md:block" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-brand-teal/20 organic-2 animate-float-delayed hidden md:block" />

        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-7xl flex flex-col gap-12 pt-0"
            >
              {/* Section 2.1: The 5 Big Topics - Restored as per user request */}
              <div className="w-full flex flex-col gap-8 mb-4">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="inline-flex self-start items-center gap-4 bg-brand-yellow text-brand-ink px-8 py-4 rounded-2xl shadow-[0_10px_0_#D4A017] border-2 border-white relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-50" />
                  <Sparkles className="animate-pulse shrink-0" size={28} />
                  <h3 className="text-2xl md:text-3xl font-black tracking-tight drop-shadow-sm uppercase">
                    {lang === 'zh' ? '核心主题' : lang === 'ms' ? 'Topik Utama' : 'Core Topics'}
                  </h3>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                  {[
                    { id: 'magic-cards', label: { zh: '神奇单词卡', en: 'Word Cards', ms: 'Kad Perkataan' }, icon: '🃏', color: 'from-brand-coral to-rose-600', linkId: 'magic-cards' },
                    { id: 'daily-sentences', label: { zh: '生活说说话', en: 'Daily Sentences', ms: 'Ayat Harian' }, icon: '🗣️', color: 'from-brand-teal to-emerald-700', linkId: 'daily-sentences' },
                    { id: 'dialogue-practice', label: { zh: '对话练习', en: 'Dialogue', ms: 'Perbualan' }, icon: '🤝', color: 'from-violet-500 to-indigo-600', linkId: 'dialogue-practice' },
                    { id: 'story-house', label: { zh: 'AI 故事', en: 'AI Stories', ms: 'Cerita AI' }, icon: '📖', color: 'from-indigo-500 to-purple-700', type: 'view', viewId: 'story-house' },
                    { id: 'games', label: { zh: '三语游戏', en: 'Games', ms: 'Permainan' }, icon: '🎮', color: 'from-amber-400 to-orange-500', type: 'view', viewId: 'games' },
                    { id: 'more-features', label: { zh: '探索更多新功能', en: 'Explore More', ms: 'Teroka Lagi' }, icon: '✨', color: 'from-purple-500 to-pink-500', linkId: 'latest-features' }
                  ].map((topic) => (
                    <motion.button
                      key={topic.id}
                      whileHover={{ scale: 1.05, y: -8 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (topic.type === 'view') {
                          setViewProtected(topic.viewId as any);
                        } else {
                          scrollToSection(topic.linkId!);
                        }
                      }}
                      className={`relative aspect-square md:aspect-auto md:h-64 rounded-[40px] bg-gradient-to-br ${topic.color} p-6 flex flex-col items-center justify-center gap-4 shadow-2xl border-4 border-white/30 overflow-hidden group transition-all`}
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                        <Sparkles size={80} />
                      </div>
                      <span className="text-6xl md:text-7xl group-hover:scale-110 transition-transform drop-shadow-xl">{topic.icon}</span>
                      <div className="text-center z-10">
                        <span className="block font-black text-white text-sm md:text-xl uppercase tracking-tighter drop-shadow-md">
                          {topic.label[lang]}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div id="magic-cards" className="w-[calc(100%+3rem)] -mx-6 md:w-[calc(100%+4rem)] md:-mx-8 lg:w-[calc(100%+6rem)] lg:-mx-12">
                <img 
                  src="https://i.ibb.co/CKLJJkY6/istockphoto-2173093766-612x612.jpg" 
                  className="w-full h-auto object-cover border-b-4 border-white shadow-lg"
                  alt="Magic Word Cards Banner"
                />
              </div>

              <div className="flex flex-col gap-12 px-2 md:px-0">
                {/* Bento Grid Categories - Vocabulary */}
                <div className="flex flex-col gap-8">
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="inline-flex self-start items-center gap-4 bg-brand-coral text-white px-8 py-4 rounded-2xl shadow-[0_10px_0_#C53030] border-2 border-white/20 relative overflow-hidden group mb-4"
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50" />
                    <Star className="fill-current animate-pulse shrink-0" size={28} />
                    <h3 className="text-2xl md:text-3xl font-black tracking-tight drop-shadow-md">
                      {lang === 'zh' ? '神奇单词卡(255)' : lang === 'ms' ? 'Kad Perkataan Sakti (255)' : 'Magic Word Cards (255)'}
                    </h3>
                    <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                  </motion.div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 auto-rows-[160px]">
                    {CATEGORIES.filter(c => c.group === 'vocabulary').map((cat) => {
                      const isLarge = ['numbers', 'animals', 'colors', 'fruits', 'food'].includes(cat.id);
                      const catItems = LEARNING_ITEMS.filter(i => i.category === cat.id);
                      const catLearned = catItems.filter(i => learnedIds.includes(i.id)).length;
                      const catPercent = catItems.length > 0 ? Math.round((catLearned / catItems.length) * 100) : 0;

                      return (
                        <CategoryCard 
                          key={cat.id}
                          cat={cat}
                          lang={lang}
                          isLarge={isLarge}
                          catPercent={catPercent}
                          onClick={() => {
                            setSelectedCategory(cat);
                            setCurrentIndex(0);
                            setView('app');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bento Grid Categories - Sentences */}
              <div id="daily-sentences" className="flex flex-col gap-8 mt-4">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex self-start items-center gap-4 bg-brand-teal text-white px-8 py-4 rounded-2xl shadow-[0_10px_0_#234E52] border-2 border-white/20 relative overflow-hidden group mb-4"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50" />
                  <span className="text-3xl animate-bounce-slow shrink-0">🗣️</span>
                  <h3 className="text-2xl md:text-3xl font-black tracking-tight drop-shadow-md">
                    {lang === 'zh' ? '生活说说话(320)' : lang === 'ms' ? 'Mari Berbual (320)' : 'Daily Sentences (320)'}
                  </h3>
                  <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                </motion.div>

                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="text-xl md:text-3xl font-black text-brand-ink/90 -mt-4 leading-relaxed tracking-tight text-center w-full"
                >
                  {lang === 'zh' ? (
                    <>以中文为主，英语与马来语同步发展，<br /><span className="text-red-600">让孩子在多语环境中自然成长</span></>
                  ) : lang === 'ms' ? (
                    <>Berteraskan Bahasa Cina, perkembangan serentak Bahasa Inggeris dan Melayu, <br /><span className="text-red-600">membolehkan kanak-kanak membesar secara semula jadi di persekitaran pelbagai bahasa</span></>
                  ) : (
                    <>Focused on Chinese, with simultaneous development in English and Malay, <br /><span className="text-red-600">allowing children to grow naturally in a multilingual environment</span></>
                  )}
                </motion.p>

                {/* New Daily Conversations Top Banner - Successfully moved underneath the button */}
                <div className="w-[calc(100%+3rem)] -mx-6 md:w-[calc(100%+4rem)] md:-mx-8 lg:w-[calc(100%+6rem)] lg:-mx-12 my-6 overflow-hidden">
                  <img 
                    src="https://i.ibb.co/prLN40bL/istockphoto-1151510733-612x612-1.jpg" 
                    className="w-full h-auto object-cover min-h-[300px] md:min-h-[450px] border-y-8 border-white shadow-2xl scale-105"
                    referrerPolicy="no-referrer"
                    alt="Conversations Top Banner"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 auto-rows-[160px]">
                  {CATEGORIES.filter(c => c.group === 'sentences').map((cat) => {
                    const isLarge = cat.id === 'sen_morning' || cat.id === 'sen_meal';
                    const catItems = LEARNING_ITEMS.filter(i => i.category === cat.id);
                    const catLearned = catItems.filter(i => learnedIds.includes(i.id)).length;
                    const catPercent = catItems.length > 0 ? Math.round((catLearned / catItems.length) * 100) : 0;

                    return (
                      <CategoryCard 
                        key={cat.id}
                        cat={cat}
                        lang={lang}
                        isLarge={isLarge}
                        catPercent={catPercent}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setCurrentIndex(0);
                          setView('app');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Decorative Banner Image */}
              <div className="w-[calc(100%+3rem)] -mx-6 md:w-[calc(100%+4rem)] md:-mx-8 lg:w-[calc(100%+6rem)] lg:-mx-12 my-6">
                <img 
                  src="https://i.ibb.co/qMPPR7Wc/istockphoto-157720194-612x612.jpg" 
                  className="w-full h-auto object-cover min-h-[300px] md:min-h-[450px] border-y-8 border-white shadow-2xl scale-105"
                  alt="Daily Conversations Banner"
                />
              </div>

              {/* Bento Grid Categories - Dialogue */}
              <div id="dialogue-practice" className="flex flex-col gap-8 mt-4 mb-4">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex self-start items-center gap-4 bg-violet-500 text-white px-8 py-4 rounded-2xl shadow-[0_10px_0_#5B21B6] border-2 border-white/20 relative overflow-hidden group mb-4"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50" />
                  <span className="text-3xl animate-bounce-slow shrink-0">🤝</span>
                  <h3 className="text-2xl md:text-3xl font-black tracking-tight drop-shadow-md">
                    {lang === 'zh' ? '对话练习(480)' : lang === 'ms' ? 'Latihan Perbualan (480)' : 'Dialogue Practice (480)'}
                  </h3>
                  <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                </motion.div>
                
                <p className="text-sm font-bold text-brand-muted -mt-4 mb-4">
                  {lang === 'zh' ? '💡 请点击下方卡片，开始您的互动式情景对话练习！' : '💡 Click a card below to start interactive situational dialogue practice!'}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 auto-rows-[160px]">
                  {CATEGORIES.filter(c => c.group === 'dialogue').map((cat) => {
                    const isLarge = cat.id === 'dia_greetings';
                    const catItems = LEARNING_ITEMS.filter(i => i.category === cat.id);
                    const catLearned = catItems.filter(i => learnedIds.includes(i.id)).length;
                    const catPercent = catItems.length > 0 ? Math.round((catLearned / catItems.length) * 100) : 0;

                    return (
                      <CategoryCard 
                        key={cat.id}
                        cat={cat}
                        lang={lang}
                        isLarge={isLarge}
                        catPercent={catPercent}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setCurrentIndex(0);
                          setView('app');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* KIDS MAGIC LEARNING ZONE & TROPHY HALL */}
              <div id="latest-features" className="flex flex-col gap-10 mt-12 mb-32 px-4 md:px-0 relative">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="flex flex-col items-center md:items-start z-30"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <span className="bg-indigo-500 text-white text-xs font-black px-3 py-1 rounded-full animate-pulse">KIDS ZONE</span>
                    <div className="h-px w-20 bg-gradient-to-r from-indigo-500 to-transparent" />
                  </div>
                  
                  <span className="text-sm md:text-base font-black text-indigo-400 tracking-[0.5em] mb-2 uppercase opacity-80">
                    {lang === 'zh' ? '开启有趣的每日双语探险' : lang === 'ms' ? 'Mulakan Pengembaraan Bahasa Harian' : 'DAILY EXPLORATION ADVENTURES'}
                  </span>
                  <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 drop-shadow-[4px_4px_0_rgba(79,70,229,0.1)] select-none leading-none pb-4">
                    {lang === 'zh' ? '魔法创意与成长乐园' : lang === 'ms' ? 'Zon Kreatif & Perkembangan' : 'CREATIVE & GROWING ZONE'}
                  </h2>
                  <span className="text-sm md:text-base font-black text-pink-400 tracking-[0.5em] mt-2 uppercase opacity-80">
                    {lang === 'zh' ? '每日打卡，收获知识，解锁闪闪发光的勋章' : lang === 'ms' ? 'Belajar setiap hari, buka pingat berkilau!' : 'LEARN DAILY AND COLLECT GLOWING BADGES'}
                  </span>
                  
                  <motion.div 
                    animate={{ width: ['0%', '100%', '0%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="h-3 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full mt-2"
                  />
                </motion.div>

                <div className="flex flex-col gap-6 -mt-4">
                  <motion.div 
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="inline-flex self-start items-center gap-4 bg-indigo-500 text-white px-10 py-5 rounded-3xl shadow-[0_12px_0_#3730A3] border-4 border-white relative overflow-hidden group hover:translate-y-1 hover:shadow-[0_8px_0_#3730A3] transition-all cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50" />
                    <Sparkles className="animate-pulse shrink-0 text-yellow-300" size={32} />
                    <h3 className="text-2xl md:text-3xl font-black tracking-tight drop-shadow-md">
                      {lang === 'zh' ? '多元魔法乐园' : lang === 'ms' ? 'Taman Belajar 3 Bahasa' : 'Trilingual Learning Park'}
                    </h3>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {/* Children Games Card */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewProtected('games')}
                    className="p-8 rounded-[40px] bg-gradient-to-br from-yellow-400 to-orange-500 text-white flex flex-col items-center gap-6 shadow-xl border-4 border-white/30 relative overflow-hidden group min-h-[280px] justify-center"
                  >
                    <div className="absolute top-4 left-4 z-20">
                      <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'zh' ? '本月新品' : 'NEW'}</span>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform text-white">
                      <Gamepad2 size={120} />
                    </div>
                    <span className="text-7xl group-hover:animate-bounce">🎮</span>
                    <div className="text-center">
                      <h4 className="text-2xl font-black mb-1 leading-tight">
                        {lang === 'zh' ? 'Children Games 三语游戏' : lang === 'ms' ? 'Permainan 3-Bahasa' : 'Trilingual Children Games'}
                      </h4>
                      <p className="text-xs font-bold text-white/70 uppercase tracking-widest">
                        {lang === 'zh' ? '寓教于乐，三语闯关' : lang === 'ms' ? 'Belajar & Main 3 Bahasa' : 'Learning with 3 Languages'}
                      </p>
                    </div>
                  </motion.button>

                  {/* Story House Card */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setViewProtected('story-house')}
                    className="p-8 rounded-[40px] bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex flex-col items-center gap-6 shadow-xl border-4 border-white/30 relative overflow-hidden group min-h-[280px] justify-center"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform">
                      <BookOpen size={120} />
                    </div>
                    <span className="text-7xl group-hover:animate-bounce">📖</span>
                    <div className="text-center">
                      <h4 className="text-2xl font-black mb-1 leading-tight">
                        {lang === 'zh' ? 'AI 故事魔法屋' : lang === 'ms' ? 'Rumah Cerita AI' : 'AI Story House'}
                      </h4>
                      <p className="text-xs font-bold text-white/70 uppercase tracking-widest">
                        {lang === 'zh' ? '为孩子定制专属童话' : lang === 'ms' ? 'Cerita peribadi' : 'Personalized stories'}
                      </p>
                    </div>
                  </motion.button>

                  {/* Magic Translator's Card */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewProtected('magic-translator')}
                  className="p-8 rounded-[40px] bg-gradient-to-br from-brand-teal to-emerald-600 text-white flex flex-col items-center gap-6 shadow-xl border-4 border-white/30 relative overflow-hidden group min-h-[280px] justify-center"
                >
                  <div className="absolute top-4 left-4 z-20">
                    <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'zh' ? '本月新品' : 'NEW'}</span>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform text-white">
                    <Languages size={120} />
                  </div>
                  <span className="text-7xl group-hover:animate-bounce">🔮</span>
                  <div className="text-center">
                    <h4 className="text-2xl font-black mb-1 leading-tight">
                      {lang === 'zh' ? 'Writing & Translation 魔法翻译' : lang === 'ms' ? 'Kamar Terjemah Magic' : 'Writing & Translation'}
                    </h4>
                    <p className="text-xs font-bold text-white/70 uppercase tracking-widest">
                      {lang === 'zh' ? '拼写翻译并朗读' : lang === 'ms' ? 'Tulis, terjemah & sebut' : 'Type, translate & speak'}
                    </p>
                  </div>
                </motion.button>

                {/* Sentence Arrangement Puzzle Card */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewProtected('sentence-puzzle')}
                  className="p-8 rounded-[40px] bg-gradient-to-br from-sky-450 via-teal-400 to-indigo-500 text-white flex flex-col items-center gap-6 shadow-xl border-4 border-white/30 relative overflow-hidden group min-h-[280px] justify-center"
                >
                  <div className="absolute top-4 left-4 z-20">
                    <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-yellow-300 animate-bounce" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'zh' ? '拼图识字' : 'PUZZLE'}</span>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform text-white">
                    <Sparkles size={120} />
                  </div>
                  <span className="text-7xl group-hover:animate-bounce">🧩🔊</span>
                  <div className="text-center">
                    <h4 className="text-2xl font-black mb-1 leading-tight">
                      {lang === 'zh' ? '拼出句子 · 汉字排列' : lang === 'ms' ? 'Bina Ayat · Susun Aksara' : 'Sentence Builder'}
                    </h4>
                    <p className="text-xs font-bold text-white/70 uppercase tracking-widest">
                      {lang === 'zh' ? '50题生活句子与三句朗读' : lang === 'ms' ? '50 Ayat harian & sebutan' : '50 Trilingual life sentences'}
                    </p>
                  </div>
                </motion.button>

                {/* AI Drawing Analysis Card */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewProtected('drawing-analyzer')}
                  className="p-8 rounded-[40px] bg-gradient-to-br from-orange-400 via-pink-500 to-rose-500 text-white flex flex-col items-center gap-6 shadow-xl border-4 border-white/30 relative overflow-hidden group min-h-[280px] justify-center"
                >
                  <div className="absolute top-4 left-4 z-20">
                    <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-yellow-300 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'zh' ? '艺术心理' : 'ART'}</span>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform text-white">
                    <Palette size={120} />
                  </div>
                  <span className="text-7xl group-hover:animate-bounce">🎨🪄</span>
                  <div className="text-center">
                    <h4 className="text-2xl font-black mb-1 leading-tight">
                      {lang === 'zh' ? 'AI Drawing 智慧手绘分析' : lang === 'ms' ? 'Analisis Lukisan AI' : 'AI Drawing Analysis'}
                    </h4>
                    <p className="text-xs font-bold text-white/70 uppercase tracking-widest">
                      {lang === 'zh' ? '上传画作 · 三档年龄 · 三语释义故事' : lang === 'ms' ? '3 Had Umur & 3 bahasa' : 'Analyze drawing with age tiers & 3 languages'}
                    </p>
                  </div>
                </motion.button>

                {/* Achievement Gallery Card */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setViewProtected('achievement-gallery')}
                  className="p-8 rounded-[40px] bg-gradient-to-br from-pink-500 to-rose-600 text-white flex flex-col md:flex-row items-center gap-6 shadow-xl border-4 border-white/30 relative overflow-hidden group min-h-[180px] justify-center md:col-span-2 lg:col-span-4"
                >
                  <div className="absolute top-4 left-4 z-20">
                    <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                      <span className="text-[10px] font-black">{certificates.length} {lang === 'zh' ? '份作品' : 'ITEMS'}</span>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform">
                    <Award size={120} />
                  </div>
                  <span className="text-7xl group-hover:animate-bounce">🏆</span>
                  <div className="text-center">
                    <h4 className="text-2xl font-black mb-1 leading-tight">
                      {lang === 'zh' ? '成就证书收藏库' : lang === 'ms' ? 'Galeri Sijil' : 'Achievement Gallery'}
                    </h4>
                    <p className="text-xs font-bold text-white/70 uppercase tracking-widest">
                      {lang === 'zh' ? 'AI 故事证书都在这里🎖️' : lang === 'ms' ? 'Koleksi Sijil🎖️' : 'AI Certificates Here🎖️'}
                    </p>
                  </div>
                </motion.button>
              </div>

                {/* Aesthetic Closing Section - Copied from DrawingAnalysis and Enhanced */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="w-full mt-20 mb-12 text-center px-4"
                >
                  <div className="flex flex-col items-center gap-8 justify-center">
                    <div className="flex items-center gap-6 w-full max-w-md">
                      <div className="h-px bg-gradient-to-r from-transparent to-indigo-300 flex-1" />
                      <Heart className="text-pink-500 animate-pulse fill-pink-500/20" size={32} />
                      <div className="h-px bg-gradient-to-l from-transparent to-indigo-300 flex-1" />
                    </div>
                    
                    <div className="flex flex-col gap-6">
                      <h4 className="text-2xl md:text-4xl font-black text-indigo-950 drop-shadow-sm italic leading-tight">
                        {lang === 'zh' ? '守护心灵的小树苗' : lang === 'ms' ? 'Menjaga Tunas Kecil Jiwa' : 'Guarding the Little Sapling of the Soul'}
                      </h4>
                      <p className="text-lg md:text-2xl text-indigo-900/80 font-black leading-relaxed max-w-5xl mx-auto italic">
                        {lang === 'zh' ? (
                          <>每一幅画都是孩子心里的秘密花园。透过色彩与线条，我们不仅看到了作品，更读懂了那份纯真的爱。愿我们成为孩子心灵最温柔的港湾。</>
                        ) : lang === 'ms' ? (
                          <>Setiap lukisan adalah taman rahsia dalam hati anak. Melalui warna dan garisan, kita bukan sahaja melihat hasil kerja, tetapi merasai cinta yang suci. Semoga kita menjadi pelabuhan paling lembut buat jiwa mereka.</>
                        ) : (
                          <>Every drawing is a secret garden in a child's heart. Through colors and lines, we don't just see an artwork; we read a story of pure love. May we be the gentlest harbor for their growing souls.</>
                        )}
                      </p>
                    </div>

                    <motion.div 
                      animate={{ 
                        boxShadow: [
                          "0 0 10px rgba(6, 182, 212, 0.2)",
                          "0 0 20px rgba(6, 182, 212, 0.5)",
                          "0 0 10px rgba(6, 182, 212, 0.2)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="flex gap-6 items-center bg-cyan-50 px-8 py-3 rounded-full border-2 border-cyan-300 relative overflow-hidden group"
                    >
                      {/* Running Light Shimmer Effect */}
                      <motion.div
                        animate={{ x: ['-200%', '200%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12"
                      />

                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="text-cyan-500 relative z-10"
                      >
                        <Sparkles size={28} />
                      </motion.div>
                      <span className="text-xs md:text-sm font-black tracking-[0.3em] text-cyan-600 uppercase relative z-10">
                        {lang === 'zh' ? '—— 献给每一位用心的家长 ——' : lang === 'ms' ? '—— Untuk setiap ibu bapa ——' : '—— Dedicated to every loving parent ——'}
                      </span>
                      <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="text-cyan-500 relative z-10"
                      >
                        <Sparkles size={28} />
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Achievement Gallery Section - Moved to dedicated page */}
                <div id="achievement-gallery" className="scroll-mt-20 h-0 w-0 pointer-events-none" />
              </div>
            </motion.div>
          ) : (
          <motion.div
            key="learning"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-6xl flex flex-col items-center gap-2 md:gap-3 px-2"
            >
              {filteredItems.length > 0 ? (
                <>
                  {/* Progress Dashboard Removed as requested */}
      {progressPercent === 100 && (
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowShare(true)}
          className="w-full max-w-sm bg-brand-yellow px-4 py-3 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center gap-3 active:shadow-none active:translate-y-1 transition-all"
        >
          <Award className="text-brand-ink" />
          <span className="font-black text-brand-ink uppercase tracking-wider">
            {lang === 'zh' ? '获得毕业证书' : lang === 'ms' ? 'Dapatkan Sijil' : 'Get Certificate'}
          </span>
        </motion.button>
      )}

                  {/* Themes Special Category Banner: Animals */}
                  <div className="w-full flex flex-col items-center gap-4 mt-8">
                    <motion.h2 
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-4xl md:text-6xl font-black text-brand-ink drop-shadow-sm"
                    >
                      {selectedCategory.label[lang]}
                    </motion.h2>
                    
                    <div className="flex items-center gap-6 text-2xl md:text-4xl font-black text-brand-muted">
                      <span className="text-orange-500">{currentIndex + 1}</span>
                      <div className="h-2 w-32 md:w-48 bg-white/50 rounded-full border-2 border-white shadow-inner overflow-hidden flex items-center px-1">
                        <motion.div 
                          className="h-full bg-orange-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${((currentIndex + 1) / filteredItems.length) * 100}%` }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      </div>
                      <span>{filteredItems.length}</span>
                    </div>
                  </div>
                  
                  <div className="w-full relative flex items-center justify-center py-4 px-8 md:px-12 lg:px-24">
                    {/* Explicit Navigation Arrows - larger */}
                    <button 
                      onClick={handlePrev}
                      className="absolute left-0 md:left-2 w-12 h-12 md:w-16 md:h-16 bg-red-500 text-white rounded-full shadow-[0_4px_0_#C53030] active:shadow-none active:translate-y-1 flex items-center justify-center transition-all z-20"
                    >
                      <ChevronLeft size={32} strokeWidth={4} />
                    </button>

                    <div className="flex-1 flex justify-center w-full">
                      {selectedCategory.group === 'sentences' || selectedCategory.group === 'dialogue' ? (
                        <SentenceCard 
                          item={filteredItems[currentIndex]} 
                          categoryGroup={selectedCategory.group} 
                          speechRate={globalSpeechRate}
                        />
                      ) : (
                        <WordCard item={filteredItems[currentIndex]} lang={lang} />
                      )}
                    </div>

                    <div className="absolute right-0 md:right-2 flex flex-col gap-4 items-center z-20">
                      <button
                        type="button"
                        onClick={() => globalSpeak(filteredItems[currentIndex].translations.zh)}
                        className="w-12 h-12 md:w-16 md:h-16 bg-red-500 text-white rounded-full shadow-[0_4px_0_#C53030] active:shadow-none active:translate-y-1 flex items-center justify-center transition-all"
                        title="听发音"
                      >
                        <Volume2 size={24} className="md:w-8 md:h-8" />
                      </button>

                      <button 
                        onClick={handleNext}
                        className="w-14 h-14 md:w-20 md:h-20 bg-blue-500 text-white rounded-full shadow-[0_4px_0_#2B6CB0] active:shadow-none active:translate-y-1 flex items-center justify-center transition-all"
                      >
                        <ChevronRight size={36} strokeWidth={4} />
                      </button>

                      <button
                        type="button"
                        onClick={() => globalToggleRecording(filteredItems[currentIndex].translations.zh)}
                        className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all relative ${
                          isRecording 
                            ? 'bg-orange-500 shadow-[0_4px_0_#C05621]' 
                            : 'bg-green-500 shadow-[0_4px_0_#2F855A]'
                        } active:shadow-none active:translate-y-1`}
                        title="跟我读"
                      >
                        {isRecording && (
                          <motion.div 
                            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="absolute inset-0 bg-white rounded-full"
                          />
                        )}
                        {hasMimicked ? (
                          <CheckCircle2 size={24} className="text-white md:w-8 md:h-8 relative z-10" />
                        ) : (
                          <Mic size={24} className={`text-white md:w-8 md:h-8 relative z-10 ${isRecording ? 'animate-pulse' : ''}`} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Speech Rate Controller for Dialogue/Sentences */}
                  {(selectedCategory.group === 'sentences' || selectedCategory.group === 'dialogue') && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border-4 border-indigo-400 shadow-xl flex items-center gap-4 mt-6"
                    >
                      <Volume2 className="text-indigo-600" size={18} />
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">0.4x</span>
                        <input 
                          type="range" 
                          min="0.4" 
                          max="1.2" 
                          step="0.1" 
                          value={globalSpeechRate}
                          onChange={(e) => setGlobalSpeechRate(parseFloat(e.target.value))}
                          className="w-32 md:w-48 h-1.5 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">1.2x</span>
                      </div>
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.1em] border-l border-indigo-100 pl-4 whitespace-nowrap">
                        {lang === 'zh' ? `语速: ${globalSpeechRate}x` : `Rate: ${globalSpeechRate}x`}
                      </span>
                    </motion.div>
                  )}

                  <div className="flex flex-wrap justify-center gap-3 mb-2 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleLearned(filteredItems[currentIndex].id)}
                      className={`px-6 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all shadow-md active:translate-y-1 ${
                        learnedIds.includes(filteredItems[currentIndex].id)
                          ? 'bg-brand-yellow text-brand-ink shadow-[0_4px_0_#D4A017]'
                          : 'bg-white text-gray-400 border border-gray-100 shadow-[0_4px_0_#E2E8F0]'
                      }`}
                    >
                      <Star size={16} fill={learnedIds.includes(filteredItems[currentIndex].id) ? "currentColor" : "none"} />
                      <span>
                        {lang === 'zh' ? (
                          learnedIds.includes(filteredItems[currentIndex].id) ? '已学会 · LEARNED' : '标记为学会 · MARK LEARNED'
                        ) : lang === 'ms' ? (
                          learnedIds.includes(filteredItems[currentIndex].id) ? 'DAH BELAJAR · LEARNED' : 'TANDA DAH BELAJAR · MARK LEARNED'
                        ) : (
                          learnedIds.includes(filteredItems[currentIndex].id) ? 'LEARNED' : 'MARK LEARNED'
                        )}
                      </span>
                    </motion.button>
                  </div>

                  {/* Certificates are now restricted to AI features only */}

                  <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const targetId = 
                          selectedCategory?.group === 'sentences' ? 'daily-sentences' :
                          selectedCategory?.group === 'dialogue' ? 'dialogue-practice' :
                          'magic-cards';
                        goHome(targetId);
                      }}
                      className="px-8 py-3 bg-brand-teal text-white font-black rounded-[20px] shadow-[0_6px_0_#2C7A7B] flex items-center gap-2 active:shadow-none active:translate-y-1 transition-all mb-4"
                    >
                      <Home size={20} />
                      <span className="text-sm md:text-base">
                        {lang === 'zh' ? (
                          selectedCategory?.group === 'sentences' ? '回到 生活说说话(320)' :
                          selectedCategory?.group === 'dialogue' ? '回到对话练习(480)' :
                          '回到神奇单词卡(255)'
                        ) : lang === 'ms' ? (
                          selectedCategory?.group === 'sentences' ? 'KEMBALI KE MARI BERBUAL(320)' :
                          selectedCategory?.group === 'dialogue' ? 'KEMBALI KE LATIHAN PERBUALAN(480)' :
                          'KEMBALI KE KAD SAKTI(255)'
                        ) : (
                          selectedCategory?.group === 'sentences' ? 'BACK TO DAILY SENTENCES(320)' :
                          selectedCategory?.group === 'dialogue' ? 'BACK TO DIALOGUE PRACTICE(480)' :
                          'BACK TO MAGIC CARDS(255)'
                        )}
                      </span>
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="bg-[#F5F2E8] p-12 rounded-[40px] shadow-xl text-center border-4 border-dashed border-gray-200">
                  <span className="text-8xl mb-6 block">🧩</span>
                  <h2 className="text-3xl font-black text-brand-coral mb-2">Coming Soon!</h2>
                  <p className="text-brand-muted font-bold">We are still adding fun words to this category!</p>
                  <button 
                    onClick={() => {
                      const targetId = 
                        selectedCategory?.group === 'sentences' ? 'daily-sentences' :
                        selectedCategory?.group === 'dialogue' ? 'dialogue-practice' :
                        'magic-cards';
                      goHome(targetId);
                    }}
                    className="mt-8 px-8 py-3 bg-brand-yellow text-brand-ink font-black rounded-2xl shadow-lg border-b-4 border-[#D4A017] active:border-0 active:translate-y-1 transition-all"
                  >
                    Go Back
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>

      <AnimatePresence>
        {view === 'subscription' && (
          <Subscription 
            lang={lang} 
            onLanguageChange={setLang}
            onHome={() => {
              setSubscriptionTarget(undefined);
              goHome();
            }}
            onClose={() => {
              setSubscriptionTarget(undefined);
              goHome();
            }} 
            onNavigate={setView}
            onSelectPlan={handleSelectPlan}
            initialHighlight={subscriptionTarget}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {view === 'checkout' && selectedPlan && (
          <div className="fixed inset-0 z-[300] bg-brand-ink/90 backdrop-blur-xl overflow-y-auto">
             <Checkout 
               lang={lang}
               plan={selectedPlan}
               onBack={() => setView('subscription')}
               onSuccess={handlePaymentSuccess}
               onNavigate={setView}
             />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showShare && selectedCategory && (
          <AchievementShare
            categoryLabels={selectedCategory.label}
            learnedCount={learnedCount}
            totalCount={filteredItems.length}
            onClose={() => setShowShare(false)}
            onGoHome={() => {
              setShowShare(false);
              goHome();
            }}
            onContinue={() => setShowShare(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCelebration && selectedCategory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-brand-ink/80 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#F5F2E8] rounded-[50px] p-8 md:p-12 max-w-md w-full text-center border-8 border-brand-teal shadow-[0_20px_0_#234E52] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-32 bg-brand-teal/10 -translate-y-16 rotate-6" />
              <div className="relative z-10">
                <motion.div 
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                  className="text-8xl mb-6 inline-block"
                >
                  🏆
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-black text-brand-ink mb-2">
                  {lang === 'zh' ? '太棒了！你完成了！' : lang === 'ms' ? 'HEBAT! ANDA BERJAYA!' : 'AMAZING! YOU DID IT!'}
                </h2>
                <p className="text-brand-muted font-bold mb-8 uppercase tracking-widest text-xs">
                  {selectedCategory.label[lang]} Collection Complete
                </p>

                <div className="flex flex-col gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowCelebration(false);
                      setShowShare(true);
                    }}
                    className="w-full py-4 bg-brand-teal text-white font-black rounded-3xl shadow-[0_8px_0_#234E52] flex items-center justify-center gap-3 active:shadow-none active:translate-y-2 transition-all uppercase tracking-widest"
                  >
                    <Award />
                    <span>{lang === 'zh' ? '查看我的证书' : lang === 'ms' ? 'Lihat Sijil Saya' : 'View My Certificate'}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowCelebration(false);
                      goHome();
                    }}
                    className="w-full py-4 bg-brand-bg text-brand-teal font-black border-2 border-brand-teal/20 rounded-3xl flex items-center justify-center gap-2"
                  >
                    <span>Keep Learning</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <VoiceHelpModal 
        isOpen={isVoiceHelpOpen} 
        onClose={() => setIsVoiceHelpOpen(false)} 
        lang={lang} 
      />

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        username={username}
        lang={lang}
      />
    </div>
  );
}
