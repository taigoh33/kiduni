import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, RotateCcw, ChevronLeft, Gamepad2, Brain, Zap, Heart, CheckCircle2, XCircle, Home, Volume2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LearningItem, Language } from '../types';
import { LEARNING_ITEMS } from '../constants/content';
import { GAME_SENTENCES, GameSentence } from '../constants/sentences';

import { LanguageSelector } from './LanguageSelector';

interface GamesProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onBack: () => void;
  onHome: () => void;
}

type GameLevel = 'beginner' | 'intermediate' | 'advanced';
type AgeGroup = '2-6' | '7-10';
type GameType = 'picture-match' | 'sentence-builder' | 'math-challenge' | 'word-scramble';

interface MathQuestion {
  type: 'calc' | 'even-odd';
  question: string;
  answer: string | number;
  options: (string | number)[];
  valA?: number;
  valB?: number;
  op?: string;
  num?: number;
}

export const Games: React.FC<GamesProps> = ({ currentLang, onLanguageChange, onBack, onHome }) => {
  const [level, setLevel] = useState<GameLevel | null>(null);
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [gameType, setGameType] = useState<GameType | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover' | 'won'>('idle');
  const [ageSubLevel, setAgeSubLevel] = useState<'2-4' | '5-6' | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [shuffledItems, setShuffledItems] = useState<LearningItem[]>([]);
  const [shuffledSentences, setShuffledSentences] = useState<GameSentence[]>([]);
  
  // Game state for Word Scramble
  const [scrambleLetters, setScrambleLetters] = useState<{ id: string; char: string; used: boolean }[]>([]);
  const [scrambleInput, setScrambleInput] = useState<{ id: string; char: string; originalId: string }[]>([]);
  const [speechRate, setSpeechRate] = useState(0.6);
  const [sentenceDisplayLang, setSentenceDisplayLang] = useState<Language>('zh');
  const [showChineseHint, setShowChineseHint] = useState(false);
  const [hintTimeoutId, setHintTimeoutId] = useState<any>(null);

  // Game state for Level 1 (Matching)
  
  // Game state for Level 2 (Memory)
  const [memoryCards, setMemoryCards] = useState<{ id: string; item: LearningItem; flipped: boolean; matched: boolean; uniqueId: string }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  
  // Game state for Level 3 (Quiz)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // New Game States
  const [sentenceParts, setSentenceParts] = useState<{ id: string; text: string; originalIdx: number }[]>([]);
  const [constructedSentence, setConstructedSentence] = useState<{ id: string; text: string; originalIdx: number }[]>([]);
  const [mathQuestion, setMathQuestion] = useState<MathQuestion | null>(null);
  
   useEffect(() => {
    if (gameState === 'playing') {
      if (gameType === 'sentence-builder' && shuffledSentences.length > 0) {
        setupSentenceBuilder(currentQuestion, shuffledSentences);
      } else if (gameType === 'math-challenge') {
        setupMathChallenge(currentQuestion);
      }
    }
  }, [currentLang]);

  const TOTAL_QUESTIONS = 
    gameType === 'math-challenge' 
      ? (ageGroup === '2-6' ? 40 : 10)
      : (ageGroup === '7-10' && (gameType === 'sentence-builder' || gameType === 'word-scramble'))
        ? 30
        : 10;

  const handleBack = () => {
    if (ageSubLevel) {
      setAgeSubLevel(null);
      setGameState('idle');
      return;
    }
    if (ageGroup) {
      setAgeGroup(null);
      setGameType(null);
      setGameState('idle');
      return;
    }
    onBack();
  };

  const labels = {
    zh: {
      title: 'Children Games 游戏天地',
      selectAge: '请选择年龄组',
      selectGame: '请选择游戏',
      age26: 'Ages 2-6',
      age710: 'Ages 7-10',
      game_picture_match: '图像匹配 🍪',
      game_sentence_builder: '句子大王 ✍️',
      game_word_scramble: '拼词达人 🔠',
      game_math_challenge: '数学挑战 🧮',
      start: '开始',
      back: '返回',
      score: '得分',
      lives: '生命',
      gameover: '下次再来',
      won: '太棒了！',
      restart: '重试',
      correct: '真棒！',
      wrong: '加油！',
      find: '请找出：',
      spell: '拼出单词：',
      rule_word_scramble: '查看下方英语及马来语，点击下方单词按照顺序拼成中文句子。',
      stop: '停',
      next: '下一个',
      check: '检查答案',
      typePinyin: '拼音：',
      features: '返回最新功能',
      selectSubAge: '请选择宝贝的年龄',
      age24: '2-4岁 (基础寻宝)',
      age56: '5-6岁 (经典配对)',
    },
    en: {
      title: 'Children Games',
      selectAge: 'Select Age Group',
      selectGame: 'Select Game',
      age26: 'Ages 2-6',
      age710: 'Ages 7-10',
      game_picture_match: 'Picture Match 🍪',
      game_sentence_builder: 'Sentence Builder ✍️',
      game_word_scramble: 'Word Scrambler 🔠',
      game_math_challenge: 'Math Challenge 🧮',
      start: 'Start',
      back: 'Back',
      score: 'Score',
      lives: 'Lives',
      gameover: 'Game Over',
      won: 'Amazing!',
      restart: 'Try Again',
      correct: 'Well Done!',
      wrong: 'Keep Going!',
      find: 'Find the: ',
      spell: 'Spell the word: ',
      rule_word_scramble: 'Check the English and Malay below, and click the letters below to spell the Chinese in order.',
      stop: 'Stop',
      next: 'Next',
      check: 'Check Answer',
      typePinyin: 'Pinyin: ',
      selectSubAge: 'Select Age Level',
      age24: 'Ages 2-4 (Fun Quest)',
      age56: 'Ages 5-6 (Pro Match)',
    },
    ms: {
      title: 'Permainan Kanak-kanak',
      selectAge: 'Pilih Kumpulan Umur',
      selectGame: 'Pilih Permainan',
      age26: 'Umur 2-6',
      age710: 'Umur 7-10',
      game_picture_match: 'Padanan Gambar 🍪',
      game_sentence_builder: 'Bina Ayat ✍️',
      game_word_scramble: 'Susun Perkataan 🔠',
      game_math_challenge: 'Cabaran Matematik 🧮',
      start: 'Mula',
      back: 'Kembali',
      score: 'Skor',
      lives: 'Nyawa',
      gameover: 'Tamat Permainan',
      won: 'Syabas!',
      restart: 'Cuba Lagi',
      correct: 'Bagus!',
      wrong: 'Teruskan!',
      find: 'Cari: ',
      spell: 'Eja perkataan: ',
      rule_word_scramble: 'Rujuk bahasa Inggeris dan bahasa Melayu di bawah, dan klik huruf di bawah untuk mengeja bahasa Cina mengikut urutan.',
      stop: 'Henti',
      next: 'Seterusnya',
      check: 'Semak Jawapan',
      typePinyin: 'Pinyin: ',
      features: 'Kembali ke Ciri',
      selectSubAge: 'Pilih Tahap Umur',
      age24: 'Umur 2-4 (Cari Harta)',
      age56: 'Umur 5-6 (Padanan Pro)',
    }
  }[currentLang] || {
    title: 'Children Games',
    selectAge: 'Select Age Group',
    selectGame: 'Select Game',
    age26: 'Ages 2-6',
    age710: 'Ages 7-10',
    game_picture_match: 'Picture Match',
    game_runner_quiz: 'Runner Quiz',
    game_sentence_builder: 'Sentence Builder',
    game_boss_quiz: 'Boss Quiz',
    game_math_challenge: 'Math Challenge',
    start: 'Start',
    back: 'Back',
    score: 'Score',
    lives: 'Lives',
    gameover: 'Game Over',
    won: 'Amazing!',
    restart: 'Try Again',
    correct: 'Well Done!',
    wrong: 'Keep Going!',
    find: 'Find the: ',
    typePinyin: 'Pinyin: ',
    next: 'Next',
    features: 'Back to Features',
  };

  const initGame = (type: GameType, subLevel?: '2-4' | '5-6') => {
    let pool = [...LEARNING_ITEMS];
    pool = pool.sort(() => Math.random() - 0.5);
    let questionPool = pool;
    
    if (subLevel) {
      setAgeSubLevel(subLevel);
    }
    
    if (type === 'sentence-builder') {
      const sentencePool = [...GAME_SENTENCES].sort(() => Math.random() - 0.5);
      setShuffledSentences(sentencePool);
      setupSentenceBuilder(0, sentencePool);
    }

    if (type === 'word-scramble') {
      setupWordScramble(0, questionPool);
    }

    if (type === 'math-challenge') {
      setupMathChallenge(0);
    }

    setShuffledItems(questionPool);
    setGameType(type);
    setScore(0);
    setLives(3);
    setCurrentQuestion(0);
    setGameState('playing');
    setFeedback(null);
    setConstructedSentence([]);
    setScrambleInput([]);

    if (type === 'picture-match') {
      setupMemoryGame(questionPool, subLevel || ageSubLevel || '5-6');
    } else if (type === 'math-challenge') {
      setupMathChallenge(0);
    }
  };

  const speak = (text: string, langCode: string = 'zh-CN') => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = speechRate;
    window.speechSynthesis.speak(utterance);
  };

  const speakSequential = (items: { text: string; langCode: string }[]) => {
    window.speechSynthesis.cancel();
    items.forEach(item => {
      const utterance = new SpeechSynthesisUtterance(item.text);
      utterance.lang = item.langCode;
      utterance.rate = speechRate;
      window.speechSynthesis.speak(utterance);
    });
  };

  const setupMathChallenge = (idx: number) => {
    const isAgeSmall = ageGroup === '2-6';
    // All questions are calculations for age 2-6 (addition/subtraction within 20)
    // Age 7-10 maintains calc/even-odd split
    const qType = isAgeSmall ? 'calc' : (idx < 30 ? 'calc' : 'even-odd');
    
    if (qType === 'calc') {
      let op: string = '+';
      let valA: number = 1;
      let valB: number = 1;
      let answer: number = 2;

      if (isAgeSmall) {
        op = Math.random() > 0.5 ? '+' : '-';
        if (op === '+') {
          const pattern = Math.floor(Math.random() * 3);
          if (pattern === 0) {
            // Single + Single (Sum <= 20)
            valA = Math.floor(Math.random() * 9) + 1; // 1 to 9
            valB = Math.floor(Math.random() * 9) + 1; // 1 to 9
          } else if (pattern === 1) {
            // Double + Single (Sum <= 20)
            valA = Math.floor(Math.random() * 10) + 10; // 10 to 19 (Double digit)
            valB = Math.floor(Math.random() * (20 - valA)) + 1; // 1 to (20 - A)
          } else {
            // Single + Double (Sum <= 20)
            valB = Math.floor(Math.random() * 10) + 10; // 10 to 19 (Double digit)
            valA = Math.floor(Math.random() * (20 - valB)) + 1; // 1 to (20 - B)
          }
          answer = valA + valB;
        } else {
          // Subtraction
          const pattern = Math.floor(Math.random() * 3);
          if (pattern === 0) {
            // Double - Single (Double digit minus single digit)
            valA = Math.floor(Math.random() * 11) + 10; // 10 to 20
            valB = Math.floor(Math.random() * 9) + 1;  // 1 to 9
          } else if (pattern === 1) {
            // Double - Double (Double digit minus double digit)
            valA = Math.floor(Math.random() * 11) + 10; // 10 to 20
            valB = Math.floor(Math.random() * (valA - 9)) + 10; // 10 to A
            if (valB > valA) valB = valA;
          } else {
            // Single - Single
            valA = Math.floor(Math.random() * 9) + 2; // 2 to 9
            valB = Math.floor(Math.random() * (valA - 1)) + 1; // 1 to A-1
          }
          answer = valA - valB;
        }
      } else {
        // Age 7-10: More focus on Multiplication and Subtraction
        const rand = Math.random();
        if (rand < 0.2) op = '+';
        else if (rand < 0.6) op = '-';
        else op = '×'; // Balanced weight for Minus and Multiply

        if (op === '×') {
          valA = Math.floor(Math.random() * 9) + 2;
          valB = Math.floor(Math.random() * 9) + 2;
        } else {
          valA = Math.floor(Math.random() * 40) + 10;
          valB = Math.floor(Math.random() * 40) + 10;
        }
        
        let finalA = valA;
        let finalB = valB;
        if (op === '-' && valA < valB) {
          finalA = valB;
          finalB = valA;
        }
        valA = finalA;
        valB = finalB;
        
        if (op === '+') answer = valA + valB;
        else if (op === '-') answer = valA - valB;
        else answer = valA * valB;
      }
      
      const options = [answer, answer + 2, answer - 1, answer + 3, answer + 5].filter(n => n >= 0);
      const shuffledOptions = Array.from(new Set(options)).sort(() => Math.random() - 0.5).slice(0, 4);
      if (!shuffledOptions.includes(answer)) shuffledOptions[0] = answer;
      
      while (shuffledOptions.length < 4) {
        const randOpt = Math.floor(Math.random() * (isAgeSmall ? 21 : 100));
        if (!shuffledOptions.includes(randOpt)) {
          shuffledOptions.push(randOpt);
        }
      }
      
      setMathQuestion({
        type: 'calc',
        question: `${valA} ${op} ${valB} = ?`,
        valA,
        valB,
        op,
        answer,
        options: shuffledOptions.sort(() => Math.random() - 0.5)
      });
    } else {
      const num = Math.floor(Math.random() * (isAgeSmall ? 20 : 100)) + 1;
      const isEven = num % 2 === 0;
      setMathQuestion({
        type: 'even-odd',
        question: currentLang === 'zh' ? `数字 ${num} 是？` : currentLang === 'ms' ? `Adakah nombor ${num}?` : `Number ${num} is?`,
        num,
        answer: isEven 
          ? (currentLang === 'zh' ? '双数 (Even)' : currentLang === 'ms' ? 'Genap' : 'Even') 
          : (currentLang === 'zh' ? '单数 (Odd)' : currentLang === 'ms' ? 'Ganjil' : 'Odd'),
        options: currentLang === 'zh' 
          ? ['单数 (Odd)', '双数 (Even)'] 
          : currentLang === 'ms' 
            ? ['Ganjil', 'Genap'] 
            : ['Odd', 'Even']
      });
    }
  };

  const setupMemoryGame = (items: LearningItem[], level: '2-4' | '5-6') => {
    // Select items based on level
    // Age 2-4: 9 unique cards (3x3 grid) - 4 pairs + 1 joker/bonus
    // Age 5-6: 18 cards (3x6 or 4x5 grid) - 9 pairs
    const preferredCategories = ['animals', 'fruits', 'shapes', 'transport', 'nature', 'food', 'insects', 'school'];
    
    let pool = items.filter(i => preferredCategories.includes(i.category || '') && i.imageUrl && i.category !== 'colors');
    
    if (pool.length < 10) pool = items.filter(i => i.imageUrl);
    
    const count = level === '2-4' ? 6 : 9;
    const selected = pool.sort(() => Math.random() - 0.5).slice(0, count);
    
    let cards = [...selected, ...selected].map((item, idx) => ({
      id: item.id,
      item,
      flipped: false,
      matched: false,
      uniqueId: `${item.id}-${idx}`
    }));
    
    cards = cards.sort(() => Math.random() - 0.5);
    
    setMemoryCards(cards);
    setFlippedCards([]);
  };

  const handleMemoryClick = (index: number) => {
    if (flippedCards.length === 2 || memoryCards[index].flipped || memoryCards[index].matched) return;

    const newCards = [...memoryCards];
    newCards[index].flipped = true;
    setMemoryCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [idx1, idx2] = newFlipped;
      if (memoryCards[idx1].id === memoryCards[idx2].id) {
        // Match
        setTimeout(() => {
          setMemoryCards(prev => {
            const updated = [...prev];
            updated[idx1].matched = true;
            updated[idx2].matched = true;
            return updated;
          });
          setFlippedCards([]);
          setScore(s => s + 20);
          confetti({ 
            particleCount: 40, 
            spread: 50, 
            origin: { x: 0.5, y: 0.5 },
            colors: ['#14B8A6', '#F43F5E', '#FBBF24'] 
          });
          
          const totalToMatch = ageSubLevel === '2-4' ? 12 : 18;
          if (newCards.filter(c => c.matched).length + 2 === totalToMatch) {
            setTimeout(() => setGameState('won'), 1000);
          }
        }, 600);
      } else {
        // No match
        setTimeout(() => {
          setMemoryCards(prev => {
            const updated = [...prev];
            updated[idx1].flipped = false;
            updated[idx2].flipped = false;
            return updated;
          });
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const setupSentenceBuilder = (idx: number, sentences: GameSentence[]) => {
    const sentence = sentences[idx % sentences.length];
    // Always use Chinese for tokens (assembling) and English for clue 
    const langTokens = sentence.tokens.zh;
    
    const parts = langTokens.map((text, i) => ({
      id: `part-${i}-${Date.now()}`,
      text,
      originalIdx: i
    })).sort(() => Math.random() - 0.5);
    
    setSentenceParts(parts);
    setConstructedSentence([]);
    setSentenceDisplayLang('zh');
    setShowChineseHint(false);
    if (hintTimeoutId) {
      clearTimeout(hintTimeoutId);
    }
  };

  const setupWordScramble = (idx: number, items: LearningItem[]) => {
    const item = items[idx % items.length];
    // Use Chinese characters as "letters" and English as the clue
    const word = item.translations.zh;
    const characters = word.split('').map((char, i) => ({
      id: `char-${i}-${Date.now()}`,
      char,
      used: false
    })).sort(() => Math.random() - 0.5);
    
    setScrambleLetters(characters);
    setScrambleInput([]);
    setSentenceDisplayLang('zh');
    setShowChineseHint(false);
    if (hintTimeoutId) {
      clearTimeout(hintTimeoutId);
      setHintTimeoutId(null);
    }
  };

  const handleLetterClick = (letter: { id: string; char: string; used: boolean }) => {
    if (letter.used || feedback) return;

    const currentItem = shuffledItems[currentQuestion];
    const targetWord = currentItem.translations.zh;
    
    const newInput = [...scrambleInput, { id: `input-${Date.now()}-${Math.random()}`, char: letter.char, originalId: letter.id }];
    setScrambleInput(newInput);
    
    setScrambleLetters(prev => prev.map(l => l.id === letter.id ? { ...l, used: true } : l));

    if (newInput.length === targetWord.length) {
      const finalWord = newInput.map(l => l.char).join('');
      if (finalWord === targetWord) {
        setFeedback('correct');
        setScore(s => s + 20);
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
        
        // Auto-read in 3 languages
        speakSequential([
          { text: currentItem.translations.zh, langCode: 'zh-CN' },
          { text: currentItem.translations.en, langCode: 'en-US' },
          { text: currentItem.translations.ms, langCode: 'ms-MY' }
        ]);
      } else {
        setFeedback('wrong');
        setLives(l => l - 1);
        if (lives <= 1) {
          setGameState('gameover');
        } else {
          setTimeout(() => {
            setFeedback(null);
            setScrambleInput([]);
            setScrambleLetters(prev => prev.map(l => ({ ...l, used: false })));
          }, 1500);
        }
      }
    }
  };

  const handleRemoveLetter = (inputIndex: number) => {
    if (feedback) return;
    const letterToRemove = scrambleInput[inputIndex];
    if (!letterToRemove) return;

    setScrambleInput(prev => prev.filter((_, i) => i !== inputIndex));
    setScrambleLetters(prev => prev.map(l => l.id === letterToRemove.originalId ? { ...l, used: false } : l));
  };

  const getScreenBackground = () => {
    if (gameState === 'won') return 'bg-emerald-700';
    if (gameState === 'gameover') return 'bg-rose-900';
    if (!ageGroup) return 'bg-indigo-950';
    if (!gameType) return 'bg-slate-900';
    
    switch(gameType) {
      case 'picture-match': return ageSubLevel === '2-4' ? 'bg-orange-900' : 'bg-teal-950';
      case 'sentence-builder': return 'bg-violet-950';
      case 'math-challenge': return 'bg-blue-950';
      case 'word-scramble': return 'bg-emerald-950';
      default: return 'bg-slate-900';
    }
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 >= TOTAL_QUESTIONS) {
      setGameState('won');
      confetti({ particleCount: 200, spread: 100 });
      return;
    }
    const nextIdx = currentQuestion + 1;
    setCurrentQuestion(nextIdx);
    setFeedback(null);

    if (gameType === 'picture-match') {
      // Memory game handles its own win state differently
    } else if (gameType === 'sentence-builder') {
      setupSentenceBuilder(nextIdx, shuffledSentences);
    } else if (gameType === 'math-challenge') {
      setupMathChallenge(nextIdx);
    } else if (gameType === 'word-scramble') {
      setupWordScramble(nextIdx, shuffledItems);
    }
  };

  const renderAgeSelector = () => (
    <div className="flex flex-col items-center w-full max-w-5xl px-4">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-black text-white mb-12 text-center drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">
          {labels.selectAge}
        </span>
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full perspective-1000">
        {/* Age 2-6: Discovery Mode */}
        <motion.button
          initial={{ opacity: 0, x: -50, rotateY: 15 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          whileHover={{ scale: 1.05, rotateY: -5, y: -10 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setAgeGroup('2-6')}
          className="relative group h-[400px] rounded-[60px] p-1 overflow-hidden"
        >
          {/* Card Base with 3D Shadow */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-rose-500 to-pink-600 rounded-[58px] shadow-[0_25px_60px_-15px_rgba(244,63,94,0.5)]" />
          
          <div className="relative h-full w-full bg-white/10 backdrop-blur-sm rounded-[56px] border border-white/30 flex flex-col items-center justify-center p-8 overflow-hidden">
            {/* Animated Background Element */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-300/20 rounded-full blur-3xl animate-pulse" />
            
            <div className="relative z-10 mb-8 transform group-hover:translate-z-20 transition-transform">
               <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center shadow-inner-lg border-8 border-white/20">
                 <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                 >
                   <span className="text-8xl drop-shadow-2xl">🚀</span>
                 </motion.div>
               </div>
            </div>

            <div className="relative z-10 text-center space-y-2">
              <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase drop-shadow-lg">{labels.age26}</h3>
              <div className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/30 shadow-lg">
                <span className="text-emerald-300 font-black text-lg tracking-widest uppercase">Discovery / 探索</span>
              </div>
              <p className="text-white/80 font-bold max-w-[200px] text-sm mt-4 italic">Shapes, Colors & Simple Fun!</p>
            </div>
            
            {/* Gloss Overlay */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent opacity-50" />
          </div>
        </motion.button>

        {/* Age 7-10: Advanced Mode */}
        <motion.button
          initial={{ opacity: 0, x: 50, rotateY: -15 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          whileHover={{ scale: 1.05, rotateY: 5, y: -10 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setAgeGroup('7-10')}
          className="relative group h-[400px] rounded-[60px] p-1 overflow-hidden"
        >
          {/* Card Base with 3D Shadow */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-800 rounded-[58px] shadow-[0_25px_60px_-15px_rgba(79,70,229,0.5)]" />
          
          <div className="relative h-full w-full bg-white/10 backdrop-blur-sm rounded-[56px] border border-white/30 flex flex-col items-center justify-center p-8 overflow-hidden">
            {/* Animated Background Element */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-300/20 rounded-full blur-3xl animate-pulse" />
            
            <div className="relative z-10 mb-8 transform group-hover:translate-z-20 transition-transform">
               <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center shadow-inner-lg border-8 border-white/20">
                 <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                 >
                   <span className="text-8xl drop-shadow-2xl">🧠</span>
                 </motion.div>
               </div>
            </div>

            <div className="relative z-10 text-center space-y-2">
              <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase drop-shadow-lg">{labels.age710}</h3>
              <div className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/30 shadow-lg">
                <span className="text-cyan-300 font-black text-lg tracking-widest uppercase">Mastery / 挑战</span>
              </div>
              <p className="text-white/80 font-bold max-w-[200px] text-sm mt-4 italic">Maths, Sentences & Big Quiz!</p>
            </div>
            
            {/* Gloss Overlay */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent opacity-50" />
          </div>
        </motion.button>
      </div>
    </div>
  );

  const renderGameSelector = () => {
    const games = ageGroup === '2-6' ? [
      { 
        id: 'picture-match', 
        label: labels.game_picture_match, 
        color: 'from-emerald-400 to-teal-500', 
        quality: currentLang === 'zh' ? '认知/精选' : currentLang === 'ms' ? 'Kognitif / Premium' : 'Cognitive / Premium', 
        count: currentLang === 'zh' ? '100+ 素材 (共10题)' : currentLang === 'ms' ? '100+ Aset (10 Soalan)' : '100+ Assets (10 Qs)', 
        icon: <Brain size={32} /> 
      },
      { 
        id: 'math-challenge', 
        label: labels.game_math_challenge, 
        color: 'from-blue-400 to-indigo-600', 
        quality: currentLang === 'zh' ? '逻辑/基础' : currentLang === 'ms' ? 'Logik / Asas' : 'Logic / Basic', 
        count: currentLang === 'zh' ? '无限方块 (共40题)' : currentLang === 'ms' ? 'Bongkah Tanpa Had (40 Soalan)' : 'Infinite Blocks (40 Qs)', 
        icon: <Star size={32} /> 
      },
    ] : [
      { 
        id: 'sentence-builder', 
        label: labels.game_sentence_builder, 
        color: 'from-indigo-400 to-violet-600', 
        quality: currentLang === 'zh' ? '语言/特级' : currentLang === 'ms' ? 'Bahasa / Pro' : 'Language / Pro', 
        count: currentLang === 'zh' ? '90+ 核心句子 (共30题)' : currentLang === 'ms' ? '90+ Ayat Utama (30 Soalan)' : '90+ Core Sentences (30 Qs)', 
        icon: <Gamepad2 size={32} /> 
      },
      { 
        id: 'word-scramble', 
        label: labels.game_word_scramble, 
        color: 'from-emerald-400 to-sky-600', 
        quality: currentLang === 'zh' ? '拼写/全能' : currentLang === 'ms' ? 'Ejaan / Pro' : 'Spelling / Master', 
        count: currentLang === 'zh' ? '140+ 词汇拼写 (共30题)' : currentLang === 'ms' ? '140+ Abjad Ejaan (30 Soalan)' : '140+ Words Spelling (30 Qs)', 
        icon: <Brain size={32} /> 
      },
      { 
        id: 'math-challenge', 
        label: labels.game_math_challenge, 
        color: 'from-blue-400 to-indigo-600', 
        quality: currentLang === 'zh' ? '逻辑/基础' : currentLang === 'ms' ? 'Logik / Asas' : 'Logic / Basic', 
        count: currentLang === 'zh' ? '数学大师 (共40题)' : currentLang === 'ms' ? 'Pakar Matematik (40 Soalan)' : 'Math Master (40 Qs)', 
        icon: <Star size={32} /> 
      },
    ];

    return (
      <div className="flex flex-col items-center w-full max-w-6xl px-4">
        <div className="text-center mb-10">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-5xl font-black text-white mb-4 italic drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
          >
            {labels.selectGame}
          </motion.h2>
          <div className="flex items-center justify-center gap-6 text-white/70 font-black text-sm tracking-[0.2em] uppercase">
            <span className="flex items-center gap-2 bg-white/10 px-4 py-1 rounded-full"><Gamepad2 size={16} /> {games.length} Games</span>
            <span className="flex items-center gap-2 bg-white/10 px-4 py-1 rounded-full"><Star size={16} /> 200+ Challenges</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full perspective-1000">
          {games.map((g, i) => (
            <motion.button
              key={g.id}
              initial={{ opacity: 0, y: 30, rotateX: -10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, y: -10, rotateX: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => initGame(g.id as GameType)}
              className="relative group h-[260px] rounded-[40px] p-1 overflow-hidden"
            >
              {/* Card Base */}
              <div className={`absolute inset-0 bg-gradient-to-br ${g.color} rounded-[38px] shadow-2xl`} />
              
              <div className="relative h-full w-full bg-white/10 backdrop-blur-sm rounded-[36px] border border-white/20 flex flex-col items-center justify-between p-6 overflow-hidden">
                {/* Top Badge */}
                <div className="w-full flex justify-between items-start">
                   <div className="bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                     <span className="text-[10px] font-black text-white/90 uppercase tracking-tighter">{g.quality}</span>
                   </div>
                   <div className="text-white/40">{g.icon}</div>
                </div>

                {/* Center Label */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl font-black text-white text-center leading-tight drop-shadow-md group-hover:scale-110 transition-transform">
                    {g.label}
                  </span>
                  <div className="w-8 h-1 bg-white/40 rounded-full" />
                </div>

                {/* Bottom Meta */}
                <div className="w-full flex justify-center">
                   <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">{g.count}</span>
                </div>

                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.button>
          ))}
        </div>
        
        <motion.button
          whileHover={{ x: -10 }}
          onClick={() => setAgeGroup(null)}
          className="mt-12 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-[30px] font-black flex items-center gap-3 border border-white/20 transition-all backdrop-blur-md shadow-2xl"
        >
          <ChevronLeft /> {labels.back}
        </motion.button>
      </div>
    );
  };

  const renderGameHeader = () => (
    <div className="flex flex-col items-center w-full max-w-4xl mb-8 mt-16 md:mt-20">
      <div className="flex items-center justify-between w-full bg-white/20 backdrop-blur-md px-6 py-4 rounded-3xl border-2 border-white/30 shadow-lg mb-4">
        <div className="flex items-center gap-4">
          <div className="bg-yellow-400 p-2 rounded-xl text-white">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-white/70">{labels.score}</p>
            <p className="text-2xl font-black text-white">{score}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{ color: i < Math.ceil(lives) ? '#FF4D4D' : '#D1D5DB', scale: i < Math.ceil(lives) ? 1.1 : 1 }}
            >
              <Heart size={28} fill={i < Math.ceil(lives) ? 'currentColor' : 'none'} />
            </motion.div>
          ))}
        </div>

        <div className="text-right">
          <p className="text-[10px] font-black uppercase text-white/70">{currentLang === 'zh' ? '进度' : currentLang === 'ms' ? 'Kemajuan' : 'Progress'}</p>
          <p className="text-2xl font-black text-white">{currentQuestion + 1}/{TOTAL_QUESTIONS}</p>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setGameState('idle');
          setAgeGroup(null);
          setGameType(null);
          setAgeSubLevel(null);
        }}
        className="bg-yellow-400 hover:bg-yellow-500 text-brand-ink px-10 py-3 rounded-2xl font-black text-lg shadow-lg border-b-4 border-yellow-600 transition-all flex items-center gap-2"
      >
        <RotateCcw size={20} />
        {currentLang === 'zh' ? '重试' : currentLang === 'ms' ? 'Cuba Lagi' : 'Try Again'}
      </motion.button>
    </div>
  );

  const renderGameContent = () => {
    const item = shuffledItems[currentQuestion];
    
    if (gameType === 'picture-match') {
      if (!ageSubLevel) {
        return (
          <div className="flex flex-col items-center w-full max-w-4xl px-4 pt-24 pb-12">
            <motion.h3 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-black text-white mb-12 text-center"
            >
              {labels.selectSubAge}
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => initGame('picture-match', '2-4')}
                className="bg-gradient-to-br from-orange-400 to-rose-500 p-8 rounded-[40px] border-4 border-white/30 shadow-2xl flex flex-col items-center gap-4 group"
              >
                <div className="bg-white/20 p-6 rounded-full group-hover:bg-white/30 transition-colors">
                  <span className="text-6xl">🐣</span>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-black text-white block">{labels.age24}</span>
                  <span className="text-white/70 font-bold">
                    {currentLang === 'zh' ? '12 张卡片 • 简单有趣' : currentLang === 'ms' ? '12 Kad • Mudah & Menyeronokkan' : '12 Cards • Easy Fun'}
                  </span>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => initGame('picture-match', '5-6')}
                className="bg-gradient-to-br from-teal-500 to-emerald-600 p-8 rounded-[40px] border-4 border-white/30 shadow-2xl flex flex-col items-center gap-4 group"
              >
                <div className="bg-white/20 p-6 rounded-full group-hover:bg-white/30 transition-colors">
                  <span className="text-6xl">🦉</span>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-black text-white block">{labels.age56}</span>
                  <span className="text-white/70 font-bold">
                    {currentLang === 'zh' ? '18 张卡片 • 高手竞技' : currentLang === 'ms' ? '18 Kad • Padanan Pro' : '18 Cards • Pro Match'}
                  </span>
                </div>
              </motion.button>
            </div>
          </div>
        );
      }

      return (
        <div className="flex flex-col items-center w-full max-w-5xl px-4 pt-24 pb-12">
          <div className="mb-6 text-center">
            <h3 className="text-2xl md:text-3xl font-black text-white mb-2 flex items-center justify-center gap-3 text-sharp">
              <Star className="text-yellow-400" /> {currentLang === 'zh' ? '翻翻看，找出配对！' : currentLang === 'ms' ? 'Cari pasangan yang sama!' : 'Find the matching pairs!'}
            </h3>
            <p className="text-white/80 font-bold">
              {ageSubLevel === '2-4' 
                ? (currentLang === 'zh' ? '点击4x3网格中的卡片 ✨' : currentLang === 'ms' ? 'Klik kad dalam grid 4x3 ✨' : 'Explore the 4x3 grid ✨')
                : (currentLang === 'zh' ? '点击卡片，记住它们的位置 🧠' : currentLang === 'ms' ? 'Klik kad dan ingat kedudukannya 🧠' : 'Click the cards and remember their spots!')}
            </p>
          </div>

          <div className={`grid ${ageSubLevel === '2-4' ? 'grid-cols-3 md:grid-cols-4' : 'grid-cols-3 md:grid-cols-6'} gap-3 md:gap-4 w-full max-w-4xl mx-auto px-8 md:px-0`}>
            {memoryCards.map((card, i) => (
              <motion.button
                key={card.uniqueId}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: card.flipped || card.matched ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring' }}
                onClick={() => handleMemoryClick(i)}
                className="aspect-square relative preserve-3d cursor-pointer hover:scale-105 group"
              >
                {/* Back side (Pattern - Visible at 0deg) */}
                <div 
                  className={`absolute inset-0 backface-hidden flex items-center justify-center bg-gradient-to-br ${ageSubLevel === '2-4' ? 'from-orange-400 to-pink-500' : 'from-indigo-500 to-purple-600'} rounded-2xl md:rounded-[30px] shadow-xl border-4 md:border-6 border-white/80`}
                  style={{ transform: 'rotateY(0deg)' }}
                >
                  <div className="w-full h-full border-2 border-white/20 rounded-xl md:rounded-xl flex items-center justify-center">
                    <span className="text-3xl md:text-5xl text-white font-black drop-shadow-lg">?</span>
                  </div>
                </div>

                {/* Front side (Image - Visible at 180deg) */}
                <div 
                  className={`absolute inset-0 backface-hidden flex items-center justify-center bg-white rounded-2xl md:rounded-[30px] shadow-2xl border-4 md:border-6 border-white ${card.matched ? 'border-emerald-400 grayscale-[0.2]' : 'border-white'}`}
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  {card.id === 'bonus-star' ? (
                    <div className="w-full h-full flex items-center justify-center bg-yellow-100 rounded-xl md:rounded-2xl">
                      <span className="text-5xl md:text-7xl">⭐</span>
                    </div>
                  ) : (
                    <img 
                      src={card.item.imageUrl} 
                      alt="Memory Card" 
                      className="w-full h-full object-cover rounded-xl md:rounded-2xl"
                      crossOrigin="anonymous" 
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector('.fallback-icon')) {
                          const fallback = document.createElement('div');
                          fallback.className = 'fallback-icon flex items-center justify-center w-full h-full text-brand-teal/20';
                          fallback.innerHTML = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`;
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  )}
                  {card.matched && (
                    <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 md:w-10 md:h-10 text-emerald-500 bg-white rounded-full p-1 shadow-md" />
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
          
          <button
            onClick={() => setAgeSubLevel(null)}
            className="mt-12 text-white/60 hover:text-white font-black uppercase tracking-widest text-sm flex items-center gap-2"
          >
            <ChevronLeft size={16} /> Choose different level
          </button>
        </div>
      );
    }

    if (gameType === 'word-scramble') {
      if (!item) return null;
      return (
        <div className="flex flex-col items-center w-full max-w-4xl px-4 pt-24 pb-12">
          <div className="mb-12 text-center w-full">
            <h3 className="text-3xl font-black text-white mb-4 flex items-center justify-center gap-3 text-sharp">
              <Star className="text-yellow-400" /> {labels.spell}
            </h3>

            {/* Instruction Banner */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 inline-flex items-center gap-3 text-white/90"
            >
              <Brain size={20} className="text-emerald-400" />
              <p className="text-sm font-bold">{labels.rule_word_scramble}</p>
            </motion.div>
            
            {/* Clue Box (No Images) */}
            <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="bg-white p-8 rounded-[40px] shadow-2xl border-4 border-emerald-400 mb-8 w-full max-w-xl mx-auto flex flex-col items-center justify-center min-h-[14rem]"
            >
              <div className="flex flex-col items-center justify-center gap-5 text-center w-full">
                <div className="flex flex-col gap-4 w-full">
                  <p className="text-3xl font-black text-indigo-600 capitalize flex items-center justify-center gap-2">
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-xl uppercase font-black tracking-wider">EN</span>
                    {item.translations.en}
                  </p>
                  {item.translations.ms && (
                    <p className="text-3xl font-black text-emerald-600 flex items-center justify-center gap-2">
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-xl uppercase font-black tracking-wider">MS</span>
                      {item.translations.ms}
                    </p>
                  )}
                </div>

                {feedback !== 'correct' && (
                  <div className="mt-4 flex flex-col items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (hintTimeoutId) {
                          clearTimeout(hintTimeoutId);
                        }
                        setShowChineseHint(true);
                        const id = setTimeout(() => {
                          setShowChineseHint(false);
                        }, 3000);
                        setHintTimeoutId(id);
                      }}
                      className="flex items-center gap-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-5 py-2.5 rounded-full font-black text-sm border-b-2 border-yellow-300 transition-all shadow-sm"
                    >
                      <span>💡 {currentLang === 'zh' ? '中文提示 (3秒后消失)' : currentLang === 'ms' ? 'Petunjuk Cina (Hilang dlm 3s)' : 'Chinese Hint (Disappears after 3s)'}</span>
                    </motion.button>
                    
                    <AnimatePresence>
                      {showChineseHint && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: -5 }}
                          className="mt-3 bg-blue-50 border border-blue-200 px-6 py-2.5 rounded-2xl flex flex-col items-center shadow-inner"
                        >
                          <span className="text-3xl font-black text-blue-600">{item.translations.zh}</span>
                          {item.pinyin && <span className="text-sm text-blue-400 font-bold mt-0.5">{item.pinyin}</span>}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {feedback === 'correct' && (
                  <div className="flex flex-col items-center gap-2 mt-4 p-4 bg-emerald-50 rounded-3xl border-2 border-emerald-100 shadow-inner w-full min-w-[240px]">
                    <span className="text-3xl font-black text-blue-600 italic uppercase">
                      {item.translations.zh}
                    </span>
                    {item.pinyin && (
                      <span className="text-sm font-bold text-blue-400">
                        {item.pinyin}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Target Slots */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {item.translations.zh.split('').map((_, i) => {
              const char = scrambleInput[i];
              return (
                <motion.div 
                  key={i} 
                  whileHover={char && !feedback ? { scale: 1.1 } : {}}
                  whileTap={char && !feedback ? { scale: 0.9 } : {}}
                  onClick={() => char && handleRemoveLetter(i)}
                  className={`w-14 h-16 md:w-16 md:h-20 rounded-2xl border-4 flex items-center justify-center text-4xl font-black transition-all ${
                    char ? 'border-emerald-500 text-blue-600 bg-emerald-100 scale-105 cursor-pointer hover:bg-emerald-200' : 'border-white/20 text-transparent'
                  }`}
                >
                  {char?.char}
                </motion.div>
              );
            })}
          </div>

          {/* Available Letters */}
          <div className="flex flex-wrap justify-center gap-4">
            {scrambleLetters.map((letter) => (
              <motion.button
                key={letter.id}
                whileHover={!letter.used ? { scale: 1.1, y: -5 } : {}}
                whileTap={!letter.used ? { scale: 0.9 } : {}}
                onClick={() => handleLetterClick(letter)}
                disabled={letter.used || !!feedback}
                className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl font-black transition-all shadow-lg border-b-4 ${
                  letter.used 
                    ? 'bg-white/10 text-transparent border-transparent opacity-30 shadow-none translate-y-1' 
                    : 'bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                {letter.char}
              </motion.button>
            ))}
          </div>

          {feedback === 'correct' ? (
            <div className="flex flex-col items-center w-full gap-8">
              {/* Embedded Speaker Controls - Positioned above Next button */}
              <div className="flex items-center gap-8 bg-white/10 backdrop-blur-sm p-6 rounded-[40px] border border-white/20 shadow-inner">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-black text-white/90 uppercase tracking-widest">{currentLang === 'zh' ? '速度' : 'Speed'}</span>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="2" 
                    step="0.1" 
                    value={speechRate} 
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className="w-32 h-2 accent-yellow-400 cursor-pointer"
                  />
                  <div className="bg-yellow-400 px-3 py-1 rounded-xl text-white font-black text-xs">
                    {speechRate.toFixed(1)}x
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      speak(item.translations.zh, 'zh-CN');
                    }}
                    className="w-20 h-20 bg-blue-500 text-white rounded-full shadow-xl flex items-center justify-center border-b-8 border-blue-700 group px-2"
                  >
                    <div className="flex flex-col items-center">
                      <Volume2 size={32} className="group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-black uppercase mt-1">ZH ONLY</span>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      speakSequential([
                        { text: item.translations.zh, langCode: 'zh-CN' },
                        { text: item.translations.en, langCode: 'en-US' },
                        { text: item.translations.ms, langCode: 'ms-MY' }
                      ]);
                    }}
                    className="w-20 h-20 bg-yellow-400 text-white rounded-full shadow-xl flex items-center justify-center border-b-8 border-yellow-600 group px-2"
                  >
                    <div className="flex flex-col items-center">
                      <Volume2 size={32} className="group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-black uppercase mt-1">Trilingual</span>
                    </div>
                  </motion.button>
                </div>
              </div>

              <div className="flex justify-center mb-10 w-full">
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextQuestion}
                  className="px-12 py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-3xl shadow-xl border-b-8 border-emerald-700 text-xl flex items-center gap-3 active:scale-95 transition-all text-sharp"
                >
                  <span>Next 下一个</span> <CheckCircle2 size={24} />
                </motion.button>
              </div>
            </div>
          ) : feedback === 'wrong' ? (
            <div className="flex flex-col items-center gap-8">
              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="mt-12 px-16 py-5 rounded-full font-black text-4xl shadow-2xl text-white bg-rose-500 animate-shake animate-duration-[1000ms]"
              >
                {labels.wrong}
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextQuestion}
                className="mt-4 flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-5 rounded-[25px] font-black text-2xl shadow-xl border-b-4 border-emerald-700 active:scale-95 transition-all"
              >
                <span>Next 下一个</span>
                <ArrowRight size={28} className="text-white" />
              </motion.button>
            </div>
          ) : (
            <div className="w-full flex justify-center mt-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextQuestion}
                className="flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-5 rounded-[25px] font-black text-2xl shadow-xl border-b-4 border-emerald-700 active:scale-95 transition-all"
              >
                <span>Next 下一个</span>
                <ArrowRight size={28} className="text-white" />
              </motion.button>
            </div>
          )}

          <button
            onClick={() => setGameState('idle')}
            className="mt-12 text-white/60 hover:text-white font-black uppercase tracking-widest text-sm flex items-center gap-2"
          >
            <ChevronLeft size={16} /> {currentLang === 'zh' ? '选择其他游戏' : currentLang === 'ms' ? 'Pilih permainan lain' : 'Choose different game'}
          </button>
        </div>
      );
    }

    if (gameType === 'sentence-builder') {
      const sentence = shuffledSentences[currentQuestion % shuffledSentences.length];
      if (!sentence) return null;

      const promptText = sentence.tokens.en.join(' ');

      return (
        <div className="flex flex-col items-center w-full max-w-4xl px-4 pt-24 pb-12">
          <div className="bg-white/90 p-8 md:p-10 rounded-[50px] shadow-2xl w-full mb-8 border-4 border-indigo-100 flex flex-col items-center">
            <h3 className="text-3xl font-black text-indigo-600 mb-6 text-center italic">
              {currentLang === 'zh' ? '拼出正确的句子！' : currentLang === 'ms' ? 'Bina ayat yang betul!' : 'Build the correct sentence!'}
            </h3>

            {/* Instruction Banner */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-indigo-100/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-indigo-200 inline-flex items-center gap-3 text-indigo-600"
            >
              <Brain size={20} className="text-indigo-500" />
              <p className="text-sm font-bold">
                {currentLang === 'zh' ? '查看下方英语及马来语，点击下方词组按照顺序拼成中文句子。' : currentLang === 'ms' ? 'Lihat bahasa Inggeris dan bahasa Melayu di bawah, bina ayat dalam bahasa Cina.' : 'Look at the English and Malay below, build the Chinese sentence below.'}
              </p>
            </motion.div>

            {sentence.imageUrl && sentence.imageUrl.length > 0 && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-8 p-4 bg-white rounded-3xl shadow-lg border-2 border-indigo-50 flex items-center justify-center min-h-[8rem] md:min-h-[10rem]"
              >
                <img 
                  src={sentence.imageUrl} 
                  alt="Sentence visual" 
                  className="w-48 h-32 md:w-64 md:h-40 object-cover rounded-2xl"
                  crossOrigin="anonymous" 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const parent = target.parentElement;
                    if (parent) {
                      parent.style.display = 'none';
                    }
                  }}
                />
              </motion.div>
            )}
            
            <div className="flex justify-center mb-8 w-full">
              <div className="bg-indigo-50 px-6 py-4 rounded-[30px] border-4 border-indigo-100 min-w-[300px] text-center shadow-inner">
                {feedback === 'correct' ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col gap-4"
                  >
                    <div className="border-b-2 border-indigo-100 pb-2">
                       <p className="text-3xl font-black text-blue-600 mb-1">
                         {sentence.tokens.zh.join('')}
                       </p>
                       <p className="text-sm font-bold text-blue-400">
                         {sentence.id}
                       </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-xl font-bold text-indigo-600">
                        <span className="text-[10px] bg-indigo-100 text-indigo-500 px-2 py-0.5 rounded-lg mr-2 uppercase">EN</span>
                        {sentence.tokens.en.join(' ')}
                      </p>
                      <p className="text-xl font-bold text-emerald-600">
                        <span className="text-[10px] bg-emerald-100 text-emerald-500 px-2 py-0.5 rounded-lg mr-2 uppercase">MS</span>
                        {sentence.tokens.ms.join(' ')}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-2xl font-black text-indigo-600 capitalize">{promptText}</p>
                    {sentence.tokens.ms && (
                      <p className="text-lg font-bold text-emerald-600 italic">
                        {sentence.tokens.ms.join(' ')}
                      </p>
                    )}
                    <div className="flex justify-center gap-2 mt-1">
                      {sentence.tokens.zh.map((_, i) => (
                        <div key={i} className="w-8 h-2 bg-indigo-200 rounded-full animate-pulse" />
                      ))}
                    </div>

                    {/* Chinese Hint for Age 7-10 Sentence Builder */}
                    <div className="mt-2 flex flex-col items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (hintTimeoutId) {
                            clearTimeout(hintTimeoutId);
                          }
                          setShowChineseHint(true);
                          const id = setTimeout(() => {
                            setShowChineseHint(false);
                          }, 3000);
                          setHintTimeoutId(id);
                        }}
                        className="flex items-center gap-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-5 py-2.5 rounded-full font-black text-sm border-b-2 border-yellow-300 transition-all shadow-sm"
                      >
                        <span>💡 {currentLang === 'zh' ? '中文提示 (3秒后消失)' : currentLang === 'ms' ? 'Petunjuk Cina (Hilang dlm 3s)' : 'Chinese Hint (Disappears after 3s)'}</span>
                      </motion.button>
                      
                      <AnimatePresence>
                        {showChineseHint && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: -5 }}
                            className="mt-3 bg-blue-50 border border-blue-200 px-6 py-2.5 rounded-2xl flex flex-col items-center shadow-inner"
                          >
                            <span className="text-3xl font-black text-blue-600">
                              {sentence.tokens.zh.join('')}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 min-h-[100px] p-8 bg-indigo-50/30 rounded-[35px] border-4 border-dashed border-indigo-100 mb-10 transition-all w-full">
              {constructedSentence.map((part) => (
                <motion.div
                  key={`constructed-${part.id}`}
                  layoutId={part.id}
                  className="bg-indigo-500 text-white px-8 py-4 rounded-[25px] font-black text-3xl shadow-lg cursor-pointer hover:bg-indigo-600 active:scale-95 transition-colors"
                  onClick={() => {
                    setConstructedSentence(prev => prev.filter(p => p.id !== part.id));
                    setSentenceParts(prev => [...prev, part]);
                  }}
                >
                  {part.text}
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {sentenceParts.map((part) => (
                <motion.button
                  key={`part-${part.id}`}
                  layoutId={part.id}
                  disabled={!!feedback}
                  whileHover={feedback ? {} : { scale: 1.1, rotate: [0, 2, -2, 0] }}
                  whileTap={feedback ? {} : { scale: 0.9 }}
                  onClick={() => {
                    if (feedback) return;
                    setSentenceParts(prev => prev.filter(p => p.id !== part.id));
                    setConstructedSentence(prev => [...prev, part]);
                  }}
                  className={`bg-white border-4 border-indigo-100 text-brand-ink px-8 py-4 rounded-[25px] font-black text-3xl shadow-md transition-all ${feedback ? 'opacity-50 cursor-not-allowed' : 'hover:border-indigo-400 hover:text-indigo-600'}`}
                >
                  {part.text}
                </motion.button>
              ))}
            </div>

            {constructedSentence.length === sentence.tokens.zh.length && !feedback && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => {
                  const isCorrect = constructedSentence.every((p, i) => p.originalIdx === i);
                  if (isCorrect) {
                    setFeedback('correct');
                    setScore(s => s + 20);
                    confetti({ particleCount: 100, spread: 70 });
                    
                    // Auto-read in 3 languages
                    speakSequential([
                      { text: sentence.tokens.zh.join(''), langCode: 'zh-CN' },
                      { text: sentence.tokens.en.join(' '), langCode: 'en-US' },
                      { text: sentence.tokens.ms.join(' '), langCode: 'ms-MY' }
                    ]);
                  } else {
                    setFeedback('wrong');
                    setTimeout(() => {
                      setFeedback(null);
                      setSentenceParts([...constructedSentence, ...sentenceParts].sort(() => Math.random() - 0.5));
                      setConstructedSentence([]);
                    }, 1000);
                  }
                }}
                className="mt-10 mx-auto flex items-center gap-3 bg-indigo-600 text-white px-16 py-5 rounded-[30px] font-black text-3xl shadow-2xl hover:bg-indigo-700 active:scale-95 transition-all"
              >
                {labels.check} <Zap fill="currentColor" />
              </motion.button>
            )}

            {feedback === 'correct' && (
              <div className="mt-10 flex flex-col items-center w-full gap-8">
                {/* Embedded Speaker Controls - Positioned above Next button */}
                <div className="flex items-center gap-8 bg-indigo-50/50 backdrop-blur-sm p-6 rounded-[40px] border-2 border-indigo-100 shadow-inner">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{currentLang === 'zh' ? '速度' : 'Speed'}</span>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="2" 
                      step="0.1" 
                      value={speechRate} 
                      onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                      className="w-32 h-2 accent-indigo-400 cursor-pointer"
                    />
                    <div className="bg-yellow-400 px-3 py-1 rounded-xl text-white font-black text-xs">
                      {speechRate.toFixed(1)}x
                    </div>
                  </div>
                  
                  <div className="flex gap-6">
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        speak(sentence.tokens.zh.join(''), 'zh-CN');
                      }}
                      className="w-20 h-20 bg-blue-500 text-white rounded-full shadow-xl flex items-center justify-center border-b-8 border-blue-700 group px-2"
                    >
                      <div className="flex flex-col items-center">
                        <Volume2 size={32} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase mt-1">ZH ONLY</span>
                      </div>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        speakSequential([
                          { text: sentence.tokens.zh.join(''), langCode: 'zh-CN' },
                          { text: sentence.tokens.en.join(' '), langCode: 'en-US' },
                          { text: sentence.tokens.ms.join(' '), langCode: 'ms-MY' }
                        ]);
                      }}
                      className="w-20 h-20 bg-yellow-400 text-white rounded-full shadow-xl flex items-center justify-center border-b-8 border-yellow-600 group px-2"
                    >
                      <div className="flex flex-col items-center">
                        <Volume2 size={32} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase mt-1">Trilingual</span>
                      </div>
                    </motion.button>
                  </div>
                </div>

                <div className="flex justify-center mb-10 w-full">
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextQuestion}
                    className="px-16 py-6 bg-emerald-500 text-white font-black rounded-[35px] shadow-2xl border-b-8 border-emerald-700 text-3xl flex items-center gap-4 group"
                  >
                     <span>{labels.next}</span>
                     <CheckCircle2 size={32} className="group-hover:translate-x-1" />
                  </motion.button>
                </div>
              </div>
            )}

            {feedback === 'wrong' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-10 mx-auto w-fit bg-rose-500 text-white px-16 py-5 rounded-[30px] font-black text-3xl shadow-2xl animate-shake"
              >
                {labels.wrong}
              </motion.div>
            )}

            {feedback !== 'correct' && ageGroup === '7-10' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextQuestion}
                className="mt-10 mx-auto flex items-center gap-3 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-10 py-5 rounded-[25px] font-black text-2xl shadow-md border-b-4 border-indigo-300 active:scale-95 transition-all"
              >
                <span>{currentLang === 'zh' ? 'Next 下一个' : currentLang === 'ms' ? 'Langkau Seterusnya' : 'Next Question'}</span>
                <ArrowRight size={28} className="text-indigo-600" />
              </motion.button>
            )}
          </div>
        </div>
      );
    }

    if (gameType === 'math-challenge') {
      if (!mathQuestion) return null;
      
      const MathBlocks = ({ count, color, rows }: { count: number; color: string; rows?: number }) => (
        <div className={`flex flex-wrap justify-center gap-1 ${rows ? 'grid' : 'flex'}`} style={rows ? { gridTemplateColumns: `repeat(${Math.ceil(count/rows)}, 1fr)` } : { maxWidth: '240px' }}>
          {[...Array(count)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: Math.min(i * 0.02, 0.5) }}
              className={`w-4 h-4 md:w-6 md:h-6 rounded-md shadow-sm border border-white/30 ${color}`}
            />
          ))}
        </div>
      );

      return (
        <div className="flex flex-col items-center w-full max-w-4xl px-4 pt-28 pb-12">
          <div className="mb-8 flex flex-col items-center">
            <h3 className="text-3xl font-black text-white mb-6 flex items-center justify-center gap-3 text-sharp">
              <Star className="text-yellow-400" /> {currentLang === 'zh' ? '小小数学家' : currentLang === 'ms' ? 'Matematik Cilik' : 'Little Mathematician'}
            </h3>
            
            <div className="bg-white/95 p-6 md:p-10 rounded-[50px] shadow-2xl border-8 border-blue-400 mb-6 min-w-[320px] max-w-[95vw] flex flex-col items-center gap-6">
              {mathQuestion.type === 'calc' ? (
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                  {mathQuestion.op === '×' ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex flex-wrap justify-center gap-2 max-w-[400px]">
                        {[...Array(mathQuestion.valA)].map((_, r) => (
                          <div key={r} className="flex gap-1">
                            {[...Array(mathQuestion.valB)].map((_, c) => (
                              <motion.div
                                key={`${r}-${c}`}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-4 h-4 md:w-5 md:h-5 rounded-sm bg-violet-400 border border-white/30 shadow-sm"
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                      <span className="text-4xl font-black text-blue-600">
                        {mathQuestion.valA} × {mathQuestion.valB} = ?
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 md:gap-8">
                      <div className="flex flex-col items-center">
                        <MathBlocks count={mathQuestion.valA || 0} color="bg-rose-400" />
                        <span className="text-2xl md:text-3xl font-black text-rose-600 mt-3 opacity-95">({mathQuestion.valA})</span>
                      </div>
                      
                      <span className="text-5xl font-black text-blue-600">{mathQuestion.op}</span>
                      
                      <div className="flex flex-col items-center">
                        <MathBlocks count={mathQuestion.valB || 0} color="bg-emerald-400" />
                        <span className="text-2xl md:text-3xl font-black text-emerald-600 mt-3 opacity-95">({mathQuestion.valB})</span>
                      </div>
                      
                      <span className="text-5xl font-black text-blue-600">=</span>
                      
                      <div className="w-16 h-16 rounded-2xl border-4 border-dashed border-blue-200 flex items-center justify-center">
                        <span className="text-4xl text-blue-200 font-black">?</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <MathBlocks count={mathQuestion.num || 0} color="bg-amber-400" />
                  <span className="text-2xl font-black text-blue-600">{mathQuestion.question}</span>
                </div>
              )}
            </div>
            <p className="text-white/80 font-black text-xl mb-4 italic text-center">
              {mathQuestion.op === '×' 
                ? (currentLang === 'zh' ? '这组方块总共有多少个？' : currentLang === 'ms' ? 'Berapakah jumlah bongkah ini?' : 'How many blocks are here in total?')
                : (currentLang === 'zh' ? '算算看，结果是多少？' : currentLang === 'ms' ? 'Kira hasil ini!' : 'Calculate the result!')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 w-full max-w-2xl px-4">
            {mathQuestion.options.map((opt, i) => (
              <motion.button
                key={`${opt}-${i}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (feedback) return;
                  if (opt === mathQuestion.answer) {
                    setFeedback('correct');
                    setScore(s => s + 20);
                    confetti({ particleCount: 80, spread: 60 });
                  } else {
                    setFeedback('wrong');
                    setLives(l => l - 1);
                    if (lives <= 1) {
                      setGameState('gameover');
                    } else {
                      setTimeout(() => setFeedback(null), 1500);
                    }
                  }
                }}
                disabled={!!feedback}
                className={`bg-white p-8 rounded-[40px] border-8 transition-all shadow-xl font-black text-5xl flex items-center justify-center ${
                  feedback === 'correct' && opt === mathQuestion.answer ? 'border-emerald-400 bg-emerald-50 scale-105' : 
                  feedback === 'wrong' && opt !== mathQuestion.answer ? 'border-rose-400 bg-rose-50' : 'border-white hover:border-blue-200 text-blue-600'
                }`}
              >
                {opt}
              </motion.button>
            ))}
          </div>

          {feedback === 'correct' && (
            <div className="flex gap-4 mt-8">
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setGameState('idle')}
                className="px-10 py-4 bg-rose-500 text-white font-black rounded-2xl shadow-xl border-b-4 border-rose-700 text-xl flex items-center gap-2"
              >
                <XCircle size={20} /> {labels.stop}
              </motion.button>
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => nextQuestion()}
                className="px-10 py-4 bg-emerald-500 text-white font-black rounded-2xl shadow-xl border-b-4 border-emerald-700 text-xl flex items-center gap-2"
              >
                {labels.next} <CheckCircle2 size={20} />
              </motion.button>
            </div>
          )}

          {feedback && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mt-12 px-16 py-5 rounded-full font-black text-4xl shadow-2xl text-white ${feedback === 'correct' ? 'bg-emerald-500' : 'bg-rose-500'}`}
            >
              {feedback === 'correct' ? labels.correct : labels.wrong}
            </motion.div>
          )}
        </div>
      );
    }

    return null;
  };

  const renderOutcome = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center bg-white/20 backdrop-blur-xl p-12 rounded-[60px] border-4 border-white/30 shadow-2xl text-center"
    >
      <motion.div 
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className={`w-40 h-40 rounded-full flex items-center justify-center mb-8 shadow-2xl ${gameState === 'won' ? 'bg-gradient-to-br from-yellow-300 to-amber-500' : 'bg-gradient-to-br from-gray-400 to-gray-600'}`}
      >
        {gameState === 'won' ? <Trophy size={80} className="text-white drop-shadow-lg" /> : <XCircle size={80} className="text-white opacity-50" />}
      </motion.div>
      <h2 className="text-6xl font-black text-white mb-4 italic tracking-tighter drop-shadow-md">
        {gameState === 'won' ? labels.won : labels.gameover}
      </h2>
      <div className="bg-black/20 px-8 py-3 rounded-full mb-10">
        <p className="text-2xl font-black text-white">{labels.score}: <span className="text-yellow-400">{score}</span></p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-6">
        <button
          onClick={() => initGame(gameType!)}
          className="btn-3d-orange text-white px-12 py-6 rounded-3xl font-black text-3xl shadow-2xl flex items-center justify-center gap-4 transition-all text-sharp"
        >
          <RotateCcw size={32} /> {labels.restart}
        </button>
        <button
          onClick={() => {
            setGameState('idle');
            setAgeGroup(null);
            setGameType(null);
          }}
          className="btn-3d bg-white/20 text-white border-4 border-white px-12 py-6 rounded-3xl font-black text-3xl hover:bg-white/30 active:translate-y-2 transition-all shadow-2xl text-sharp"
        >
          <span className="text-emerald-400">{labels.back}</span>
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className={`w-full min-h-screen ${getScreenBackground()} flex flex-col items-center py-8 transition-colors duration-1000 overflow-x-hidden relative`}>
      {/* Navigation - Top Left Home & Top Right Language */}
      <div className="absolute top-4 left-4 z-[250]">
        <button
          onClick={onHome}
          className="bg-white/20 hover:bg-white/30 text-white p-4 rounded-3xl font-black flex items-center justify-center border-2 border-white/30 transition-all backdrop-blur-xl shadow-2xl group active:scale-95"
          title="Home"
        >
          <Home size={28} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>

      <div className="absolute top-4 right-4 z-[250]">
        <LanguageSelector currentLang={currentLang} onLanguageChange={onLanguageChange} />
      </div>

      {/* Games Header - only on landing selector */}
      {gameState === 'idle' && !gameType && (
        <>
          <div className="flex flex-col items-center mb-10 px-4 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              className="bg-white/90 p-5 rounded-full shadow-xl mb-5 border-4 border-sky-100"
            >
              <Gamepad2 size={48} className="text-brand-teal" />
            </motion.div>
            <h1 className="text-4xl font-black text-white drop-shadow-md mb-3 uppercase italic tracking-tight">
              {labels.title}
            </h1>
            <p className="text-white/90 font-medium text-lg flex items-center gap-2">
              <Heart className="text-rose-400 fill-rose-400" size={18} /> {currentLang === 'zh' ? '快乐学习，家长放心' : currentLang === 'ms' ? 'Belajar dengan Gembira, Ibu Bapa Tenang' : 'Happy Learning, Happy Parents'}
            </p>
          </div>
        </>
      )}

      {gameState === 'idle' ? (
        !ageGroup ? renderAgeSelector() : renderGameSelector()
      ) : (gameState === 'gameover' || gameState === 'won') ? (
        renderOutcome()
      ) : (
        <div className="w-full flex flex-col items-center">
          {renderGameHeader()}
          {renderGameContent()}
        </div>
      )}

      {/* Outcome Section handled in main return */}
    </div>
  );
};
