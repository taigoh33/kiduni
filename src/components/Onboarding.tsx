import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Sparkles, Star, GraduationCap, Baby, Clock, Heart } from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
  username: string;
  lang: 'zh' | 'en' | 'ms';
  onLanguageChange: (lang: 'zh' | 'en' | 'ms') => void;
}

export interface OnboardingData {
  language: 'zh' | 'en' | 'ms';
  age: number;
  level: 'A' | 'B' | 'C' | 'D' | 'E';
  inPreschool: boolean;
  dailyGoal: number;
  interests: string[];
}

const UI_STRINGS = {
  zh: {
    back: '返回',
    next: '下一步',
    finish: '开启学习之旅',
    years: '岁 / Years / Tahun',
    level: '水平',
    ageRange: {
      low: "✨ 启蒙阶段：专注于听力与视觉联想",
      mid: "🚀 成长阶段：逐渐加入读写与逻辑训练",
      high: "🧠 进阶阶段：深度拓展词汇与自主表达"
    }
  },
  en: {
    back: 'Back',
    next: 'Next',
    finish: 'Start Learning',
    years: 'Years Old',
    level: 'Level',
    ageRange: {
      low: "✨ Early Stage: Focus on listening & visual",
      mid: "🚀 Growth Stage: Adding logic & literacy",
      high: "🧠 Advanced Stage: Deep vocabulary expansion"
    }
  },
  ms: {
    back: 'Kembali',
    next: 'Seterusnya',
    finish: 'Mula Belajar',
    years: 'Tahun',
    level: 'Tahap',
    ageRange: {
      low: "✨ Peringkat Awal: Fokus pendengaran & visual",
      mid: "🚀 Peringkat Pertumbuhan: Logik & literasi",
      high: "🧠 Peringkat Lanjutan: Perbendaharaan kata luas"
    }
  }
};

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, username, lang, onLanguageChange }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    language: lang,
    age: 4,
    level: 'A',
    inPreschool: true,
    dailyGoal: 15,
    interests: []
  });

  const t = UI_STRINGS[lang];

  useEffect(() => {
    setData(prev => ({ ...prev, language: lang }));
  }, [lang]);

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleFinish = () => {
    onComplete(data);
  };

  const toggleInterest = (interest: string) => {
    const newInterests = data.interests.includes(interest)
      ? data.interests.filter(i => i !== interest)
      : [...data.interests, interest];
    setData({ ...data, interests: newInterests });
  };

  const steps = [
    {
      title: lang === 'zh' ? "孩子几岁了？" : lang === 'ms' ? "Berapa umur anak anda?" : "How old is your child?",
      subtitle: lang === 'zh' ? "根据年龄定制专属的学习计划与词汇量" : lang === 'ms' ? "Pelan belajar mengikut umur" : "Customized plan based on age",
      icon: <Baby className="w-12 h-12 text-orange-500" />,
      content: (
        <div className="flex flex-wrap justify-center gap-3 py-6">
          {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((age) => (
            <motion.button
              key={age}
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setData({ ...data, age })}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl text-xl md:text-2xl font-black flex items-center justify-center transition-all ${
                data.age === age 
                ? 'btn-3d-coral text-white border-4 border-white/50 active:translate-y-2' 
                : 'bg-white text-sky-900 border-2 border-sky-100 hover:border-sky-300'
              }`}
            >
              {age}
            </motion.button>
          ))}
          <div className="w-full text-center space-y-1 mt-6">
            <p className="text-sky-400 font-black uppercase tracking-widest text-[10px]">{t.years}</p>
            <p className="text-sky-300 text-[10px] leading-relaxed">
              {data.age <= 4 ? t.ageRange.low : 
               data.age <= 7 ? t.ageRange.mid : 
               t.ageRange.high}
            </p>
          </div>
        </div>
      )
    },
    {
      title: lang === 'zh' ? "目前的中文程度？" : lang === 'ms' ? "Tahap penguasaan Mandarin?" : "Current Chinese Level?",
      subtitle: lang === 'zh' ? "精准匹配学习进度" : lang === 'ms' ? "Padankan kemajuan belajar" : "Match learning progress",
      icon: <Star className="w-12 h-12 text-yellow-500" />,
      content: (
        <div className="space-y-3 py-4 max-h-[400px] overflow-y-auto px-2">
          {[
            { id: 'A', zh: lang === 'zh' ? '零基础' : lang === 'ms' ? 'Asas Sifar' : 'Absolute Beginner', en: 'Level A', desc: lang === 'zh' ? '刚开始接触中文' : lang === 'ms' ? 'Baru berjinak dengan Mandarin' : 'Never learned before' },
            { id: 'B', zh: lang === 'zh' ? '识字启蒙' : lang === 'ms' ? 'Permulaan Tulisan' : 'Letter Discovery', en: 'Level B', desc: lang === 'zh' ? '能辨认简单汉字' : lang === 'ms' ? 'Mengenal perkataan mudah' : 'Recognize simple characters' },
            { id: 'C', zh: lang === 'zh' ? '简单交流' : lang === 'ms' ? 'Komunikasi Mudah' : 'Daily Conversation', en: 'Level C', desc: lang === 'zh' ? '能听懂日常短句' : lang === 'ms' ? 'Faham ayat pendek harian' : 'Understand basic phrases' },
            { id: 'D', zh: lang === 'zh' ? '独立识读' : lang === 'ms' ? 'Membaca Sendiri' : 'Independent Reading', en: 'Level D', desc: lang === 'zh' ? '可以阅读绘本' : lang === 'ms' ? 'Boleh baca buku cerita' : 'Can read simple books' },
            { id: 'E', zh: lang === 'zh' ? '非常流利' : lang === 'ms' ? 'Sangat Lancar' : 'Very Fluent', en: 'Level E', desc: lang === 'zh' ? '沟通非常流畅' : lang === 'ms' ? 'Pertuturan lancar' : 'Fluent communication' }
          ].map((lvl) => (
            <motion.button
              key={lvl.id}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setData({ ...data, level: lvl.id as any })}
              className={`w-full p-6 rounded-3xl text-left flex items-center gap-4 border-4 transition-all text-sharp ${
                data.level === lvl.id 
                ? 'btn-3d-teal text-white shadow-2xl active:translate-y-2' 
                : 'bg-white border-sky-50 text-sky-900 hover:border-sky-100'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shrink-0 ${data.level === lvl.id ? 'bg-white/20' : 'bg-sky-50'}`}>
                {lvl.id}
              </div>
              <div className="flex-1">
                <div className="font-black text-lg leading-tight">{lvl.zh}</div>
                <div className={`text-[10px] font-bold ${data.level === lvl.id ? 'text-white/80' : 'text-sky-300'}`}>{lvl.en} • {lvl.desc}</div>
              </div>
            </motion.button>
          ))}
        </div>
      )
    },
    {
      title: lang === 'zh' ? "上过幼儿园了吗？" : lang === 'ms' ? "Sudah masuk tadika?" : "In preschool already?",
      subtitle: lang === 'zh' ? "我们将根据环境优化学习场景" : lang === 'ms' ? "Optimum belajar ikut suasana" : "We'll optimize learning scene",
      icon: <GraduationCap className="w-12 h-12 text-blue-500" />,
      content: (
        <div className="grid grid-cols-2 gap-4 py-8">
          {[
            { val: true, zh: lang === 'zh' ? '已经在校' : lang === 'ms' ? 'Dah Masuk' : 'Yes', en: 'Enrolled' },
            { val: false, zh: lang === 'zh' ? '还没，在家' : lang === 'ms' ? 'Belum / Rumah' : 'No', en: 'Home / Not yet' }
          ].map((choice) => (
            <motion.button
              key={choice.val.toString()}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setData({ ...data, inPreschool: choice.val })}
              className={`aspect-square rounded-[40px] flex flex-col items-center justify-center p-4 text-center border-4 transition-all text-sharp ${
                data.inPreschool === choice.val 
                ? 'btn-3d-teal text-white shadow-2xl active:translate-y-2' 
                : 'bg-white border-sky-50 text-sky-900 hover:border-sky-100'
              }`}
            >
              <div className={`w-14 h-14 rounded-full mb-3 flex items-center justify-center text-3xl ${data.inPreschool === choice.val ? 'bg-white/20' : 'bg-sky-50'}`}>
                {choice.val ? '🏫' : '🏠'}
              </div>
              <div className="font-black text-lg">{choice.zh}</div>
              <div className={`text-[10px] font-bold mt-1 ${data.inPreschool === choice.val ? 'text-white/80' : 'text-sky-300'}`}>{choice.en}</div>
            </motion.button>
          ))}
        </div>
      )
    },
    {
      title: lang === 'zh' ? "每天学习多久？" : lang === 'ms' ? "Berapa lama setiap hari?" : "Daily learning goal?",
      subtitle: lang === 'zh' ? "建议每天坚持，进步更快哦" : lang === 'ms' ? "Konsisten setiap hari lebih laju" : "Daily consistency is key",
      icon: <Clock className="w-12 h-12 text-purple-500" />,
      content: (
        <div className="space-y-4 py-8">
          {[
            { val: 5, zh: lang === 'zh' ? '轻松模式' : lang === 'ms' ? 'Mod Santai' : 'Easy Mode', en: '5 Mins', desc: lang === 'zh' ? '每天 5 分钟' : lang === 'ms' ? '5 minit sehari' : '5 mins/day' },
            { val: 15, zh: lang === 'zh' ? '标准模式' : lang === 'ms' ? 'Mod Standard' : 'Standard', en: '15 Mins', desc: lang === 'zh' ? '每天 15 分钟' : lang === 'ms' ? '15 minit sehari' : '15 mins/day' },
            { val: 30, zh: lang === 'zh' ? '学霸模式' : lang === 'ms' ? 'Mod Intensif' : 'Intensive', en: '30 Mins', desc: lang === 'zh' ? '每天 30 分钟' : lang === 'ms' ? '30 minit sehari' : '30 mins/day' }
          ].map((goal) => (
            <motion.button
              key={goal.val}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setData({ ...data, dailyGoal: goal.val })}
              className={`w-full p-6 rounded-[28px] text-left flex items-center justify-between border-4 transition-all text-sharp ${
                data.dailyGoal === goal.val 
                ? 'btn-3d-coral text-white shadow-2xl active:translate-y-2' 
                : 'bg-white border-sky-50 text-sky-900 hover:border-sky-100'
              }`}
            >
              <div>
                <div className="font-black text-xl">{goal.zh}</div>
                <div className={`text-xs font-bold ${data.dailyGoal === goal.val ? 'text-white/80' : 'text-sky-300'}`}>{goal.en} • {goal.desc}</div>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${data.dailyGoal === goal.val ? 'bg-white text-purple-500' : 'bg-sky-50 text-sky-400'}`}>
                {goal.val}
              </div>
            </motion.button>
          ))}
        </div>
      )
    },
    {
      title: lang === 'zh' ? "他/她最喜欢什么？" : lang === 'ms' ? "Apa yang mereka minat?" : "What do they love?",
      subtitle: lang === 'zh' ? "定制个性化的魔法故事" : lang === 'ms' ? "Cerita magik peribadi" : "Personalized magic stories",
      icon: <Heart className="w-12 h-12 text-rose-500" />,
      content: (
        <div className="grid grid-cols-2 gap-3 py-4 max-h-[350px] overflow-y-auto px-1">
          {[
            { id: 'animals', zh: lang === 'zh' ? '可爱动物' : lang === 'ms' ? 'Haiwan Comel' : 'Animals', emoji: '🦊' },
            { id: 'space', zh: lang === 'zh' ? '浩瀚星空' : lang === 'ms' ? 'Angkasa Lepas' : 'Space', emoji: '🚀' },
            { id: 'stories', zh: lang === 'zh' ? '神奇童话' : lang === 'ms' ? 'Cerita Dongeng' : 'Fairytales', emoji: '🏰' },
            { id: 'nature', zh: lang === 'zh' ? '自然地理' : lang === 'ms' ? 'Alam Semula Jadi' : 'Nature', emoji: '🌿' },
            { id: 'food', zh: lang === 'zh' ? '美味佳肴' : lang === 'ms' ? 'Makanan Sedap' : 'Food', emoji: '🍰' },
            { id: 'robot', zh: lang === 'zh' ? '未来科技' : lang === 'ms' ? 'Robotik' : 'Robots', emoji: '🤖' },
            { id: 'vehicles', zh: lang === 'zh' ? '交通工具' : lang === 'ms' ? 'Kenderaan' : 'Vehicles', emoji: '🚗' },
            { id: 'music', zh: lang === 'zh' ? '音乐舞蹈' : lang === 'ms' ? 'Muzik & Tari' : 'Music', emoji: '🎵' },
            { id: 'sports', zh: lang === 'zh' ? '运动健康' : lang === 'ms' ? 'Sukan & Kesihatan' : 'Sports', emoji: '⚽' },
            { id: 'art', zh: lang === 'zh' ? '绘画艺术' : lang === 'ms' ? 'Seni Lukis' : 'Art', emoji: '🎨' },
            { id: 'math', zh: lang === 'zh' ? '数学逻辑' : lang === 'ms' ? 'Logik Matematik' : 'Math', emoji: '🔢' },
            { id: 'ocean', zh: lang === 'zh' ? '神秘海洋' : lang === 'ms' ? 'Lautan Misteri' : 'Ocean', emoji: '🐙' },
            { id: 'hero', zh: lang === 'zh' ? '超级英雄' : lang === 'ms' ? 'Super Hero' : 'Hero', emoji: '🦸' },
            { id: 'dino', zh: lang === 'zh' ? '恐龙世界' : lang === 'ms' ? 'Dunia Dino' : 'Dinosaurs', emoji: '🦖' }
          ].map((item) => (
            <motion.button
              key={item.id}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleInterest(item.id)}
              className={`p-5 rounded-3xl flex flex-col items-center justify-center border-4 transition-all text-sharp ${
                data.interests.includes(item.id) 
                ? 'btn-3d-yellow text-white shadow-2xl active:translate-y-2' 
                : 'bg-white border-sky-50 text-sky-900 hover:border-sky-100'
              }`}
            >
              <div className="text-3xl mb-1">{item.emoji}</div>
              <div className="font-black text-sm">{item.zh}</div>
            </motion.button>
          ))}
        </div>
      )
    }
  ];

  const currentStepData = steps[step - 1];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" 
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-[#F5F2E8]/95 backdrop-blur-2xl rounded-[50px] shadow-2xl border-8 border-white p-6 md:p-10 relative z-10"
      >
        {/* Language Switcher with Green Border */}
        <div className="flex justify-center gap-2 mb-8 p-1 bg-emerald-50 rounded-2xl border-2 border-emerald-100 shadow-inner max-w-[240px] mx-auto">
          {[
            { id: 'zh', label: '中文' },
            { id: 'en', label: 'EN' },
            { id: 'ms', label: 'BM' }
          ].map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => onLanguageChange(l.id as any)}
              className={`flex-1 py-1.5 px-3 rounded-xl font-black text-[10px] transition-all ${
                lang === l.id 
                ? 'bg-emerald-500 text-white shadow-md scale-105' 
                : 'text-emerald-400 hover:text-emerald-600'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex-1 h-2.5 bg-sky-100 rounded-full overflow-hidden">
              <motion.div
                initial={false}
                animate={{ width: step >= s ? '100%' : '0%' }}
                className="h-full bg-orange-400"
              />
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step + lang}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 bg-sky-50 rounded-[28px] flex items-center justify-center mb-4 shadow-inner">
              {currentStepData.icon}
            </div>
            
            <h2 className="text-2xl md:text-3xl font-black text-sky-900 mb-1 leading-tight">
              {currentStepData.title}
            </h2>
            <p className="text-sky-400 font-bold mb-2 text-sm leading-relaxed px-4">
              {currentStepData.subtitle}
            </p>

            <div className="w-full">
              {currentStepData.content}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Buttons */}
        <div className="flex items-center gap-4 mt-8">
          {step > 1 && (
            <motion.button
              type="button"
              whileHover={{ x: -2 }}
              onClick={prevStep}
              className="px-5 md:px-6 py-4 rounded-2xl font-black text-sky-900 bg-sky-50 hover:bg-sky-100 transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" /> {t.back}
            </motion.button>
          )}
          
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={step === 5 ? handleFinish : nextStep}
            className="flex-1 py-4 md:py-6 rounded-2xl text-white font-black text-xl md:text-2xl flex items-center justify-center gap-2 transition-all btn-3d-coral shadow-2xl text-sharp active:translate-y-2"
          >
            {step === 5 ? (
              <>{t.finish} <Sparkles className="w-5 h-5 md:w-6 md:h-6" /></>
            ) : (
              <>{t.next} <ChevronRight className="w-5 h-5 md:w-6 md:h-6" /></>
            )}
          </motion.button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[9px] font-black text-sky-200 uppercase tracking-widest flex items-center justify-center gap-2">
            <span className="w-6 md:w-8 h-px bg-sky-100"></span>
            Fun Chinese for {username}
            <span className="w-6 md:w-8 h-px bg-sky-100"></span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

