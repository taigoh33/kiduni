import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowLeft, Volume2, CheckCircle2, RotateCcw, HelpCircle, Trophy, Lightbulb, Star, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SentencePuzzleProps {
  currentLang: 'zh' | 'ms' | 'en';
  onBack: () => void;
}

interface SentenceItem {
  id: number;
  chinese: string; // The correct sentence
  pinyin: string; // Pinyin transcription
  pic: string;    // Emoji representing picture display
  english: string; // English translation
  malay: string;   // Malay translation
}

const SENTENCES: SentenceItem[] = [
  {
    id: 1,
    chinese: "我喜欢看书",
    pinyin: "wǒ xǐ huan kàn shū",
    pic: "📚",
    english: "I like reading books",
    malay: "Saya suka membaca buku"
  },
  {
    id: 2,
    chinese: "我们要多喝水",
    pinyin: "wǒ men yào duō hē shuǐ",
    pic: "🥛",
    english: "We should drink more water",
    malay: "Kita perlu minum lebih banyak air"
  },
  {
    id: 3,
    chinese: "小猫在睡觉",
    pinyin: "xiǎo māo zài shuì jiào",
    pic: "🐱💤",
    english: "The little cat is sleeping",
    malay: "Kucing kecil sedang tidur"
  },
  {
    id: 4,
    chinese: "谢谢妈妈做饭",
    pinyin: "xiè xie mā ma zuò fàn",
    pic: "🍳❤️",
    english: "Thank you mom for cooking",
    malay: "Terima kasih ibu kerana memasak"
  },
  {
    id: 5,
    chinese: "我和爸爸去公园",
    pinyin: "wǒ hé bà ba qù gōng yuán",
    pic: "🌳👨‍👦",
    english: "I go to the park with my dad",
    malay: "Saya pergi ke taman bersama ayah"
  },
  {
    id: 6,
    chinese: "太阳公公出来了",
    pinyin: "tài yáng gōng gong chū lái le",
    pic: "☀️😊",
    english: "Grandpa Sun has come out",
    malay: "Matahari sudah terbit"
  },
  {
    id: 7,
    chinese: "小狗喜欢吃骨头",
    pinyin: "xiǎo gǒu xǐ huan chī gǔ tou",
    pic: "🐶🦴",
    english: "The little dog likes to eat bones",
    malay: "Anak anjing suka makan tulang"
  },
  {
    id: 8,
    chinese: "我很喜欢学中文",
    pinyin: "wǒ hěn xǐ huan xué zhōng wén",
    pic: "🐼✍️",
    english: "I like to learn Chinese very much",
    malay: "Saya sangat suka belajar bahasa Cina"
  },
  {
    id: 9,
    chinese: "今天天气真好",
    pinyin: "jīn tiān tiān qì zhēn hǎo",
    pic: "🌈✨",
    english: "The weather is really good today",
    malay: "Cuaca hari ini sangat baik"
  },
  {
    id: 10,
    chinese: "洗手洗脸讲卫生",
    pinyin: "xǐ shǒu xǐ liǎn jiǎng wèi shēng",
    pic: "🧼💦",
    english: "Wash hands and face to keep clean",
    malay: "Cuci tangan dan muka untuk kesihatan"
  },
  {
    id: 11,
    chinese: "我们一起玩游戏",
    pinyin: "wǒ men yī qǐ wán yóu xì",
    pic: "🎮🎪",
    english: "Let's play a game together",
    malay: "Mari kita bermain permainan bersama-sama"
  },
  {
    id: 12,
    chinese: "早睡早起身体好",
    pinyin: "zǎo shuì zǎo qǐ shēn tǐ hǎo",
    pic: "⏰💪",
    english: "Sleep early and wake up early for health",
    malay: "Tidur awal bangun awal menyihatkan badan"
  },
  {
    id: 13,
    chinese: "苹果红红甜又甜",
    pinyin: "píng guǒ hóng hóng tián yòu tián",
    pic: "🍎😋",
    english: "The red apple is very sweet",
    malay: "Epal merah sangat manis"
  },
  {
    id: 14,
    chinese: "小鸟在树上唱歌",
    pinyin: "xiǎo niǎo zài shù shàng chàng gē",
    pic: "🐦🎵",
    english: "The little bird sings in the tree",
    malay: "Burung kecil menyanyi di atas pokok"
  },
  {
    id: 15,
    chinese: "我要天天刷牙",
    pinyin: "wǒ yào tiān tiān shuā yá",
    pic: "🪥🦷",
    english: "I want to brush my teeth every day",
    malay: "Saya ingin gosok gigi setiap hari"
  },
  {
    id: 16,
    chinese: "天上有很多星星",
    pinyin: "tiān shàng yǒu hěn duō xīng xing",
    pic: "🌃⭐",
    english: "There are many stars in the sky",
    malay: "Ada banyak bintang di langit"
  },
  {
    id: 17,
    chinese: "学校里有很多朋友",
    pinyin: "xué xiào lǐ yǒu hěn duō péng you",
    pic: "🏫👭",
    english: "There are many friends in school",
    malay: "Terdapat ramai kawan di sekolah"
  },
  {
    id: 18,
    chinese: "大象的鼻子很长",
    pinyin: "dà xiàng de bí zi hěn cháng",
    pic: "🐘👃",
    english: "The elephant's nose is very long",
    malay: "Gajah mempunyai hidung yang panjang"
  },
  {
    id: 19,
    chinese: "小鱼在水里游",
    pinyin: "xiǎo yú zài shuǐ lǐ yóu",
    pic: "🐟🌊",
    english: "Little fish are swimming in the water",
    malay: "Ikan kecil sedang berenang di air"
  },
  {
    id: 20,
    chinese: "弟弟喜欢喝牛奶",
    pinyin: "dì di xǐ huan hē niú nǎi",
    pic: "👶🥛",
    english: "Little brother likes to drink milk",
    malay: "Adik lelaki suka minum susu"
  },
  {
    id: 21,
    chinese: "妹妹喜欢跳舞",
    pinyin: "mèi mei xǐ huan tiào wǔ",
    pic: "👧💃",
    english: "Little sister likes to dance",
    malay: "Adik perempuan suka menari"
  },
  {
    id: 22,
    chinese: "老师教我们写字",
    pinyin: "lǎo shī jiāo wǒ men xiě zì",
    pic: "👩‍🏫📝",
    english: "The teacher teaches us to write",
    malay: "Cikgu mengajar kami menulis"
  },
  {
    id: 23,
    chinese: "我们要爱护花草",
    pinyin: "wǒ men yào ài hù huā cǎo",
    pic: "🌻🌷",
    english: "We should care for flowers and grass",
    malay: "Kita perlu memelihara bunga dan rumput"
  },
  {
    id: 24,
    chinese: "下雨了要打伞",
    pinyin: "xià yǔ le yào dǎ sǎn",
    pic: "🌧️☔",
    english: "Bring an umbrella when it rains",
    malay: "Bawa payung apabila hujan turun"
  },
  {
    id: 25,
    chinese: "我喜欢吃西瓜",
    pinyin: "wǒ xǐ huan chī xī guā",
    pic: "🍉🍉",
    english: "I like to eat watermelon",
    malay: "Saya suka makan tembikai"
  },
  {
    id: 26,
    chinese: "汽车在路上跑",
    pinyin: "qì chē zài lù shang pǎo",
    pic: "🚗💨",
    english: "The car drives on the road",
    malay: "Kereta sedang dipandu di atas jalan"
  },
  {
    id: 27,
    chinese: "我们爱唱歌跳舞",
    pinyin: "wǒ men ài chàng gē tiào wǔ",
    pic: "🎤🕺",
    english: "We love singing and dancing",
    malay: "Kami suka menyanyi dan menari"
  },
  {
    id: 28,
    chinese: "大熊猫爱吃竹子",
    pinyin: "dà xióng māo ài chī zhú zi",
    pic: "🐼🎋",
    english: "Giant pandas love to eat bamboo",
    malay: "Panda gergasi suka makan buluh"
  },
  {
    id: 29,
    chinese: "飞机在天上飞",
    pinyin: "fēi jī zài tiān shàng fēi",
    pic: "✈️☁️",
    english: "The airplane flies in the sky",
    malay: "Kapal terbang terbang di langit"
  },
  {
    id: 30,
    chinese: "大家一起拍拍手",
    pinyin: "dà jiā yī qǐ pāi pāi shǒu",
    pic: "👏👪",
    english: "Everyone claps hands together",
    malay: "Semua orang bertepuk tangan bersama"
  },
  {
    id: 31,
    chinese: "吃午饭了",
    pinyin: "chī wǔ fàn le",
    pic: "🍚",
    english: "Time for lunch",
    malay: "Masa untuk makan tengah hari"
  },
  {
    id: 32,
    chinese: "多吃水果",
    pinyin: "duō chī shuǐ guǒ",
    pic: "🍓",
    english: "Eat more fruit",
    malay: "Makan lebih banyak buah"
  },
  {
    id: 33,
    chinese: "早安你好",
    pinyin: "zǎo ān nǐ hǎo",
    pic: "🌅",
    english: "Good morning, hello",
    malay: "Selamat pagi, apa khabar"
  },
  {
    id: 34,
    chinese: "小鱼吐泡泡",
    pinyin: "xiǎo yú tǔ pào pao",
    pic: "🫧",
    english: "Little fish blows bubbles",
    malay: "Ikan kecil meniup buih"
  },
  {
    id: 35,
    chinese: "我要吃冰淇淋",
    pinyin: "wǒ yào chī bīng qí lín",
    pic: "🍦",
    english: "I want to eat ice cream",
    malay: "Saya mahu makan ais krim"
  },
  {
    id: 36,
    chinese: "这是我的玩具",
    pinyin: "zhè shì wǒ de wán jù",
    pic: "🧸",
    english: "This is my toy",
    malay: "Ini mainan saya"
  },
  {
    id: 37,
    chinese: "小蜗牛爬得慢",
    pinyin: "xiǎo wō niú pá de màn",
    pic: "🐌",
    english: "The little snail crawls slowly",
    malay: "Siput kecil merangkak perlahan"
  },
  {
    id: 38,
    chinese: "月亮圆圆挂天上",
    pinyin: "yuè liàng yuán yuán guà tiān shàng",
    pic: "🌕",
    english: "The round moon hangs in the sky",
    malay: "Bulan bulat tergantung di langit"
  },
  {
    id: 39,
    chinese: "小蜜蜂爱采花蜜",
    pinyin: "xiǎo mì fēng ài cǎi huā mì",
    pic: "🐝",
    english: "Little bee loves collecting nectar",
    malay: "Lebah kecil suka mengumpul nektar"
  },
  {
    id: 40,
    chinese: "我们一起堆雪人",
    pinyin: "wǒ men yī qǐ duī xuě rén",
    pic: "☃️",
    english: "Let's build a snowman together",
    malay: "Mari kita membina orang salji bersama"
  },
  {
    id: 41,
    chinese: "小青蛙唱歌呱呱呱",
    pinyin: "xiǎo qīng wā chàng gē guā guā guā",
    pic: "🐸",
    english: "The little frog sings ribbit ribbit",
    malay: "Katak kecil menyanyi ribbit ribbit"
  },
  {
    id: 42,
    chinese: "天上的彩虹真美丽",
    pinyin: "tiān shàng de cǎi hóng zhēn měi lì",
    pic: "🌈",
    english: "The rainbow in the sky is beautiful",
    malay: "Pelangi di langit sangat indah"
  },
  {
    id: 43,
    chinese: "我有一只黄色气球",
    pinyin: "wǒ yǒu yī zhī huáng sè qì qiú",
    pic: "🎈",
    english: "I have a yellow balloon",
    malay: "Saya ada sebiji belon kuning"
  },
  {
    id: 44,
    chinese: "我的手帕干净又整洁",
    pinyin: "wǒ de shǒu pà gān jìng yòu zhěng jié",
    pic: "🧼",
    english: "My handkerchief is clean and neat",
    malay: "Saputangan saya bersih dan kemas"
  },
  {
    id: 45,
    chinese: "放学回家先写功课",
    pinyin: "fàng xué huí jiā xiān xiě gōng kè",
    pic: "🎒",
    english: "Do homework first when back from school",
    malay: "Buat kerja sekolah dahulu selepas pulang"
  },
  {
    id: 46,
    chinese: "我们是听话的好孩子",
    pinyin: "wǒ men shì tīng huà de hǎo hái zi",
    pic: "😇",
    english: "We are obedient good children",
    malay: "Kami adalah budak baik yang patuh"
  },
  {
    id: 47,
    chinese: "老师和我们一起做游戏",
    pinyin: "lǎo shī hé wǒ men yī qǐ zuò yóu xì",
    pic: "🎪",
    english: "The teacher plays games with us",
    malay: "Cikgu bermain permainan bersama kami"
  },
  {
    id: 48,
    chinese: "我的小床又香又软",
    pinyin: "wǒ de xiǎo chuáng yòu xiāng yòu ruǎn",
    pic: "🛌",
    english: "My little bed is sweet and soft",
    malay: "Katil kecil saya wangi dan lembut"
  },
  {
    id: 49,
    chinese: "小兔子最爱吃胡萝卜",
    pinyin: "xiǎo tù zi zuì ài chī hú luó bo",
    pic: "🥕",
    english: "The little bunny loves carrots most",
    malay: "Arnab kecil paling suka makan lobak"
  },
  {
    id: 50,
    chinese: "我们要高高兴兴上学去",
    pinyin: "wǒ men yào gāo gāo xìng xìng shàng xué qù",
    pic: "🏫",
    english: "We go to school happily",
    malay: "Kami pergi ke school dengan gembira"
  }
];

export const SentencePuzzle: React.FC<SentencePuzzleProps> = ({ currentLang, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    return parseInt(localStorage.getItem('kiduni_puzzle_index') || '0', 10);
  });
  const [starCandies, setStarCandies] = useState<number>(() => {
    return parseInt(localStorage.getItem('kiduni_star_candies') || '8', 10);
  });

  const activeItem = SENTENCES[currentIndex % SENTENCES.length];
  
  // Custom characters states
  const [selectedChars, setSelectedChars] = useState<{ id: string; char: string; originalIndex: number }[]>([]);
  const [shuffledPool, setShuffledPool] = useState<{ id: string; char: string; originalIndex: number; selected: boolean }[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hasChecked, setHasChecked] = useState<boolean>(false);

  // Initialize pool
  useEffect(() => {
    if (!activeItem) return;

    const chars = activeItem.chinese.split('');
    const pool = chars.map((char, index) => ({
      id: `char-${index}-${Math.random()}`,
      char,
      originalIndex: index,
      selected: false
    }));

    // Perform high-quality scrambling ensuring it's not already correct
    let scrambled = [...pool].sort(() => Math.random() - 0.5);
    while (scrambled.map(x => x.char).join('') === activeItem.chinese && chars.length > 1) {
      scrambled = [...pool].sort(() => Math.random() - 0.5);
    }

    setShuffledPool(scrambled);
    setSelectedChars([]);
    setIsCorrect(false);
    setShowHint(false);
    setHasChecked(false);
  }, [currentIndex]);

  // Save current progress to localStorage
  useEffect(() => {
    localStorage.setItem('kiduni_puzzle_index', String(currentIndex));
  }, [currentIndex]);

  const [speechRate, setSpeechRate] = useState<number>(() => {
    return parseFloat(localStorage.getItem('kiduni_speech_rate') || '0.85');
  });

  // Save current speech rate to localStorage
  useEffect(() => {
    localStorage.setItem('kiduni_speech_rate', String(speechRate));
  }, [speechRate]);

  const [activeVoice, setActiveVoice] = useState<'zh' | 'en' | 'ms' | null>(null);

  // Voice speaker engine
  const speakLanguage = (text: string, code: 'zh-CN' | 'en-US' | 'ms-MY') => {
    try {
      window.speechSynthesis.cancel();
      const sentenceUtterance = new SpeechSynthesisUtterance(text);
      sentenceUtterance.lang = code;
      sentenceUtterance.rate = speechRate; // flexible user speech rate
      
      const voiceKey = code === 'zh-CN' ? 'zh' : code === 'en-US' ? 'en' : 'ms';
      setActiveVoice(voiceKey);

      sentenceUtterance.onend = () => {
        setActiveVoice(null);
      };
      sentenceUtterance.onerror = () => {
        setActiveVoice(null);
      };

      window.speechSynthesis.speak(sentenceUtterance);
    } catch (e) {
      console.error(e);
      setActiveVoice(null);
    }
  };

  const speakMandarin = () => speakLanguage(activeItem.chinese, 'zh-CN');
  const speakEnglish = () => speakLanguage(activeItem.english, 'en-US');
  const speakMalay = () => speakLanguage(activeItem.malay, 'ms-MY');

  // Trigger trilingual complete text utterance
  const speakAll = () => {
    speakMandarin();
  };

  // Click handler to select character tile
  const handleSelectChar = (item: typeof shuffledPool[0]) => {
    if (isCorrect) return;

    // Toggle on
    setShuffledPool(prev => prev.map(p => p.id === item.id ? { ...p, selected: true } : p));
    setSelectedChars(prev => [...prev, { id: item.id, char: item.char, originalIndex: item.originalIndex }]);
    setHasChecked(false);
  };

  // Click handler to remove/unselect placed character
  const handleRemoveChar = (charObj: typeof selectedChars[0]) => {
    if (isCorrect) return;

    // Toggle off
    setShuffledPool(prev => prev.map(p => p.id === charObj.id ? { ...p, selected: false } : p));
    setSelectedChars(prev => prev.filter(c => c.id !== charObj.id));
    setHasChecked(false);
  };

  // Reset current selection
  const handleReset = () => {
    if (isCorrect) return;
    setShuffledPool(prev => prev.map(p => ({ ...p, selected: false })));
    setSelectedChars([]);
    setIsCorrect(false);
    setHasChecked(false);
  };

  // Check built sentence
  const handleCheck = () => {
    const builtText = selectedChars.map(c => c.char).join('');
    setHasChecked(true);

    if (builtText === activeItem.chinese) {
      setIsCorrect(true);
      // Play high-energy celebrations
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      // Reward candies
      const award = starCandies + 5;
      setStarCandies(award);
      localStorage.setItem('kiduni_star_candies', String(award));

      // Speak trilingual
      speakMandarin();
    } else {
      setIsCorrect(false);
      // Friendly wiggle audio feedback
      speakLanguage("Oh no, try again!", 'en-US');
    }
  };

  const handleNext = () => {
    if (currentIndex < SENTENCES.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Completed last question, loop back or celebrate
      confetti({
        particleCount: 150,
        spread: 120
      });
      alert(currentLang === 'zh' ? '🎉 太棒了！你已经完成了全部50道句子排列题！' : '🎉 Amazing! You completed all 50 sentence builder puzzles!');
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Auto trigger friendly audio hint when page loads or sentence changes
  useEffect(() => {
    // Disabled auto-reading of Mandarin on switching questions as per user request
    // if (activeItem) {
    //   setTimeout(() => {
    //     speakMandarin();
    //   }, 500);
    // }
  }, [currentIndex]);

  const progressPercentage = Math.round((currentIndex / SENTENCES.length) * 100);

  // Localization labels
  const T = {
    zh: {
      title: "🧩 拼出句子 · 汉字排列",
      subhead: "根据三语翻译与图片，点击汉字按顺序排列，拼成完整句子吧！",
      progress: "闯关进度",
      instruction: "用拼图拼出这句话吧：",
      score: "星星魔力糖",
      reset: "重新开始",
      check: "检查答案",
      correct: "非常正确！太棒了！🎉 +5 🍬",
      incorrect: "不太对哦，再想想！加油 🍀",
      next: "下一题 ➡️",
      prev: "⬅️ 上一题",
      hint: "魔法提示",
      questionLabel: "第 {num} / 50 题",
      trilingualLabel: "三语朗读示范：",
      charLeftLabel: "待选汉字池：",
      builtLabel: "你的句子排列：",
      meaningLabel: "句子意思：",
      speechRateLabel: "语音速度："
    },
    ms: {
      title: "🧩 Bina Ayat · Susun Aksara",
      subhead: "Ketik aksara mengikut susunan untuk membina ayat berdasarkan gambar dan terjemahan!",
      progress: "Kemajuan",
      score: "Gula-gula Bintang",
      instruction: "Susun perkataan ini:",
      reset: "Mula Semula",
      check: "Semak Jawapan",
      correct: "Syabas! Sangat tepat! 🎉 +5 🍬",
      incorrect: "Belum tepat lagi, cuba lagi! 🍀",
      next: "Seterusnya ➡️",
      prev: "⬅️ Sebelumnya",
      hint: "Petunjuk",
      questionLabel: "Soalan {num} / 50",
      trilingualLabel: "Sebut Tiga Bahasa:",
      charLeftLabel: "Peti Huruf:",
      builtLabel: "Susunan Ayat Anda:",
      meaningLabel: "Maksud Ayat:",
      speechRateLabel: "Kelajuan Suara:"
    },
    en: {
      title: "🧩 Sentence Builder · Chinese Character Arranger",
      subhead: "Match the translations and display pictures, click the character tiles in sequence to construct the sentence!",
      progress: "Syllabus Progress",
      score: "Star Candies",
      instruction: "Arrange the characters to build this:",
      reset: "Start Over",
      check: "Check Answer",
      correct: "Superb! Fully correct! 🎉 +5 🍬",
      incorrect: "Not quite right, try once more! 🍀",
      next: "Next Puzzle ➡️",
      prev: "⬅️ Previous",
      hint: "Magic Clue",
      questionLabel: "Puzzle {num} / 50",
      trilingualLabel: "Trilingual Voice Guides:",
      charLeftLabel: "Tile Selection Pool:",
      builtLabel: "Your Sentence Line:",
      meaningLabel: "Sentence Practice Meaning:",
      speechRateLabel: "Voice Speed:"
    }
  }[currentLang] || {
    title: "🧩 Sentence Builder · Chinese Puzzle",
    subhead: "Arrange Chinese character tiles in sequence!",
    progress: "Progress",
    score: "Candies",
    instruction: "Build this sentence:",
    reset: "Reset",
    check: "Check",
    correct: "Correct! 🎉 +5 🍬",
    incorrect: "Try again! 🍀",
    next: "Next ➡️",
    prev: "⬅️ Previous",
    hint: "Hint",
    questionLabel: "Item {num} / 50",
    trilingualLabel: "Trilingual Voice:",
    charLeftLabel: "Character Pool:",
    builtLabel: "Sentence Board:",
    meaningLabel: "Sentence Meaning:",
    speechRateLabel: "Voice Speed:"
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-8 scroll-mt-20">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-teal-100 via-sky-100 to-indigo-100 rounded-[40px] p-6 md:p-8 shadow-xl border-4 border-white relative overflow-hidden">
        <div className="absolute top-2 right-12 text-7xl opacity-10 select-none animate-spin-slow">🧩</div>
        <div className="absolute bottom-1 left-24 text-6xl opacity-10 select-none animate-bounce">🎈</div>
        
        <div className="flex items-center gap-5">
          <button
            onClick={onBack}
            className="w-12 h-12 bg-white/80 hover:bg-white text-gray-700 rounded-2xl shadow-md border hover:scale-105 transition-all flex items-center justify-center shrink-0 cursor-pointer"
          >
            <ArrowLeft size={22} />
          </button>
          
          <div className="flex flex-col text-left">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 flex items-center gap-2.5 tracking-tight">
              {T.title}
            </h1>
            <p className="text-sm font-bold text-slate-500 max-w-2xl mt-1 leading-relaxed">
              {T.subhead}
            </p>
          </div>
        </div>

        {/* Star candy balance status bag */}
        <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md border-[3px] border-yellow-300 px-6 py-3.5 rounded-3xl shadow-md self-center md:self-auto min-w-[180px] justify-center">
          <span className="text-3xl animate-bounce">🍬</span>
          <div className="flex flex-col items-start leading-none">
            <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider">{T.score}</span>
            <span className="text-2xl font-black text-amber-600 mt-1">{starCandies}</span>
          </div>
        </div>
      </div>

      {/* Main Core Layout: Left Info & Controls, Right Interactive character dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Card: Displays Picture illustration & translations */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-[44px] p-6 text-white shadow-xl flex flex-col justify-between min-h-[460px] border-4 border-white">
          
          {/* Question banner tag */}
          <div className="flex justify-between items-center bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
            <span className="text-xs font-black tracking-widest uppercase text-yellow-300">
              {T.questionLabel.replace('{num}', String(currentIndex + 1))}
            </span>
            <span className="text-xs font-sans font-black bg-white/20 px-2.5 py-1 rounded-full text-white">
              {currentIndex + 1} / 50
            </span>
          </div>

          {/* Interactive Bouncy illustration rendering frame */}
          <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
            
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 3, -3, 0] 
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="w-40 h-40 bg-white/15 rounded-full flex items-center justify-center text-[140px] filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)] relative mb-4 border border-white/20 overflow-hidden"
            >
              <div className="absolute top-1 right-2 text-2xl opacity-40 animate-pulse">🌟</div>
              <span className="select-none leading-none">{activeItem.pic}</span>
            </motion.div>

            {/* Trilingual dictionary card */}
            <div className="w-full flex flex-col gap-2 bg-black/15 backdrop-blur-md rounded-3xl p-5 border border-white/10 text-left">
              <span className="text-[10px] font-black text-yellow-200 uppercase tracking-widest">
                {T.meaningLabel}
              </span>
              
              <div className="flex flex-col gap-2 mt-0.5">
                <p className="text-base font-black tracking-wide leading-tight text-white">
                  🇺🇸 {activeItem.english}
                </p>
                <p className="text-base font-black tracking-wide text-white/95 leading-tight">
                  🇲🇾 {activeItem.malay}
                </p>
              </div>
            </div>

          </div>

          {/* Voice pronunciations helpers */}
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 flex flex-col gap-3">
            <div>
              <span className="text-[10px] font-black text-rose-200 uppercase tracking-widest text-left block mb-1.5">
                {T.trilingualLabel}
              </span>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={speakMandarin}
                  className={`py-2.5 px-1 rounded-2xl font-black text-xs hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer border ${
                    activeVoice === 'zh'
                      ? 'bg-white text-indigo-900 border-white shadow-md'
                      : 'bg-white/20 hover:bg-white/30 text-white border-white/10 active:bg-white active:text-indigo-900'
                  }`}
                >
                  <span>🇨🇳 中文</span>
                  <Volume2 size={13} />
                </button>
                <button
                  onClick={speakEnglish}
                  className={`py-2.5 px-1 rounded-2xl font-black text-xs hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer border border-white/10 ${
                    activeVoice === 'en'
                      ? 'bg-white/45 text-white shadow-sm'
                      : 'bg-white/20 hover:bg-white/30 text-white active:bg-white/35'
                  }`}
                >
                  <span>🇺🇸 EN</span>
                  <Volume2 size={13} />
                </button>
                <button
                  onClick={speakMalay}
                  className={`py-2.5 px-1 rounded-2xl font-black text-xs hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer border border-white/10 ${
                    activeVoice === 'ms'
                      ? 'bg-white/45 text-white shadow-sm'
                      : 'bg-white/20 hover:bg-white/30 text-white active:bg-white/35'
                  }`}
                >
                  <span>🇲🇾 MY</span>
                  <Volume2 size={13} />
                </button>
              </div>
            </div>

            {/* Speech speed adapter */}
            <div className="border-t border-white/15 pt-2.5 flex flex-col gap-2">
              <div className="flex justify-between items-center text-[10px] font-black text-rose-200 uppercase tracking-widest">
                <span>{T.speechRateLabel}</span>
                <span className="bg-white/20 text-white rounded-full px-2 py-0.5 font-bold text-[11px]">
                  {speechRate.toFixed(2)}x
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-base select-none leading-none">🐢</span>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="flex-1 accent-yellow-300 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-base select-none leading-none">⚡</span>
              </div>

              {/* Speedy Presets */}
              <div className="grid grid-cols-3 gap-1.5 mt-0.5">
                <button
                  onClick={() => setSpeechRate(0.6)}
                  className={`py-1 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                    Math.abs(speechRate - 0.6) < 0.05
                      ? 'bg-yellow-300 text-indigo-950 shadow-sm'
                      : 'bg-white/10 text-white border border-white/5 hover:bg-white/20'
                  }`}
                >
                  {currentLang === 'zh' ? '慢慢读' : currentLang === 'ms' ? 'Lambat' : 'Slow'}
                </button>
                <button
                  onClick={() => setSpeechRate(0.85)}
                  className={`py-1 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                    Math.abs(speechRate - 0.85) < 0.05
                      ? 'bg-yellow-300 text-indigo-950 shadow-sm'
                      : 'bg-white/10 text-white border border-white/5 hover:bg-white/20'
                  }`}
                >
                  {currentLang === 'zh' ? '适中' : currentLang === 'ms' ? 'Sederhana' : 'Medium'}
                </button>
                <button
                  onClick={() => setSpeechRate(1.15)}
                  className={`py-1 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                    Math.abs(speechRate - 1.15) < 0.05
                      ? 'bg-yellow-300 text-indigo-950 shadow-sm'
                      : 'bg-white/10 text-white border border-white/5 hover:bg-white/20'
                  }`}
                >
                  {currentLang === 'zh' ? '标准' : currentLang === 'ms' ? 'Biasa' : 'Standard'}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Card: Interactive Sentence arrangement panel */}
        <div className="lg:col-span-7 bg-white rounded-[44px] p-6 md:p-8 border-4 border-slate-100 shadow-xl flex flex-col justify-between min-h-[460px] text-left relative overflow-hidden">
          
          <div className="flex flex-col gap-5">
            {/* Display progress Bar */}
            <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider">{T.progress}</span>
                <span className="font-sans text-xs font-black text-indigo-600">{progressPercentage}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-100">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Placing Sandbox Board */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{T.builtLabel}</span>
              
              <div className="min-h-[96px] w-full bg-slate-50/50 rounded-3xl border-3 border-dashed border-slate-200 p-4 flex flex-wrap items-center justify-center gap-3 relative">
                
                {selectedChars.length === 0 && (
                  <span className="text-sm font-bold text-slate-400 select-none">
                    {currentLang === 'zh' ? '🎈 依次点击下方汉字块进行排列' : '🎈 Tap individual character blocks below'}
                  </span>
                )}

                <AnimatePresence>
                  {selectedChars.map((item, idx) => (
                    <motion.button
                      key={`placed-${item.id}`}
                      initial={{ opacity: 0, scale: 0.6, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.6, y: -15 }}
                      onClick={() => handleRemoveChar(item)}
                      className="px-4.5 py-3 bg-gradient-to-tr from-indigo-500 to-indigo-600 font-sans font-black text-3xl text-white rounded-2xl shadow-md border hover:from-rose-500 hover:to-rose-600 hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center cursor-pointer min-w-[54px]"
                    >
                      {item.char}
                    </motion.button>
                  ))}
                </AnimatePresence>

              </div>
            </div>

            {/* Character Pool */}
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{T.charLeftLabel}</span>
                
                {/* Magic Clue helper */}
                <button
                  onClick={() => {
                    setShowHint(true);
                    setTimeout(() => setShowHint(false), 2800);
                  }}
                  className="text-xs font-black text-amber-600 hover:text-amber-700 tracking-wider flex items-center gap-1 cursor-pointer bg-amber-50 px-3 py-1 rounded-full border border-amber-200"
                >
                  <Lightbulb size={13} className="animate-pulse" />
                  <span>{T.hint}</span>
                </button>
              </div>

              {/* Shuffled pool array buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3.5 p-5 bg-slate-50/50 rounded-3xl border border-slate-100 min-h-[96px]">
                {shuffledPool.map((item) => (
                  <button
                    key={item.id}
                    disabled={item.selected}
                    onClick={() => handleSelectChar(item)}
                    className={`px-4.5 py-4 font-sans font-black text-3xl rounded-2xl transition-all min-w-[54px] flex items-center justify-center ${
                      item.selected
                        ? 'bg-slate-100 border-none text-slate-300 pointer-events-none scale-90'
                        : 'bg-white hover:bg-yellow-50 text-slate-800 border-2 border-slate-200 hover:border-yellow-400 hover:scale-110 active:scale-90 shadow-sm cursor-pointer'
                    }`}
                  >
                    {item.char}
                  </button>
                ))}
              </div>
            </div>

            {/* Answer check alert notification row */}
            <AnimatePresence>
              {hasChecked && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full mt-1"
                >
                  {isCorrect ? (
                    <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 text-sm font-black">
                      <CheckCircle2 className="text-emerald-500 shrink-0" size={22} />
                      <div className="flex flex-col text-left">
                        <span>{T.correct}</span>
                        {/* Pinyin display assist */}
                        <span className="text-xs font-bold text-emerald-600 mt-1 uppercase font-sans">
                          {activeItem.pinyin}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-rose-50 border-2 border-rose-200 text-rose-800 p-4 rounded-2xl flex items-center gap-3 text-sm font-black text-left">
                      <span className="text-2xl shrink-0">⚠️</span>
                      <span>{T.incorrect}</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hint overlay pop */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="bg-purple-50 border border-purple-200 text-purple-800 p-3.5 rounded-2xl text-xs font-black text-left flex items-start gap-2"
                >
                  <span className="text-lg">🔮</span>
                  <div className="flex flex-col">
                    <span>{currentLang === 'zh' ? '拼写顺序参考：' : 'Standard Arrangement order:'}</span>
                    <span className="text-lg font-bold tracking-widest text-purple-900 mt-1 font-sans">
                      {activeItem.chinese}
                    </span>
                    <span className="text-[10px] text-purple-600 font-sans tracking-tight uppercase font-black mt-0.5">
                      {activeItem.pinyin}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Absolute Bottom Navigation Controls Row */}
          <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-5 mt-6">
            
            <div className="flex gap-2">
              <button
                disabled={currentIndex === 0}
                onClick={handlePrev}
                className="px-4 py-3 border-2 border-slate-200 text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none rounded-2xl font-black text-xs transition-all tracking-wider uppercase flex items-center gap-1 cursor-pointer"
              >
                {T.prev}
              </button>

              <button
                onClick={handleReset}
                className="w-11 h-11 border-2 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-2xl transition-all flex items-center justify-center shrink-0 cursor-pointer"
                title={T.reset}
              >
                <RotateCcw size={16} />
              </button>
            </div>

            {isCorrect ? (
              <button
                onClick={handleNext}
                className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md hover:scale-105 active:scale-95 transition-all rounded-2xl font-black text-xs tracking-wider uppercase flex items-center gap-1.5 cursor-pointer cursor-interactive"
              >
                <span>{T.next}</span>
              </button>
            ) : (
              <button
                disabled={selectedChars.length === 0}
                onClick={handleCheck}
                className="px-7 py-3.5 bg-indigo-600 text-white disabled:opacity-30 disabled:pointer-events-none shadow-md hover:scale-105 active:scale-95 transition-all rounded-2xl font-black text-xs tracking-wider uppercase flex items-center gap-1.5 cursor-pointer cursor-interactive"
              >
                <span>{T.check}</span>
              </button>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
