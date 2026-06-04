import React from 'react';
import { motion } from 'motion/react';
import { Check, Star, Crown, Zap, Shield, Sparkles, Heart, Award, Gem, ArrowLeft, Home, Puzzle, Volume2 } from 'lucide-react';
import { Language } from '../types';

import { LanguageSelector } from './LanguageSelector';

interface SubscriptionProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onHome: () => void;
  onClose: () => void;
  onNavigate: (view: any) => void;
  onSelectPlan: (plan: { id: string; name: string; price: string; period: string }) => void;
  initialHighlight?: 'trial' | 'plans';
}

export const Subscription: React.FC<SubscriptionProps> = ({ 
  lang, 
  onLanguageChange, 
  onHome, 
  onClose, 
  onNavigate,
  onSelectPlan,
  initialHighlight
}) => {
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [selectedPlanName, setSelectedPlanName] = React.useState('');
  const trialCardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (initialHighlight === 'trial' && trialCardRef.current) {
      setTimeout(() => {
        trialCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [initialHighlight]);

  const content = {
    zh: {
      title: '开启无限学习之旅',
      subtitle: '为孩子解锁全方位智能教育功能',
      freeTrial: '免费试用 3 天',
      freeTrialDesc: '在这 3 天内体验所有核心功能',
      aiLimitFree: 'AI 故事每日 3 次，绘图分析每日 1 次，魔法翻译每日 5 次',
      aiLimitPro: 'AI 故事每日 8 次，绘图分析每日 4 次（包含下载及专属证书收藏）',
      fullAccess: '解锁所有互动游戏与课程',
      noAds: '无广告，纯净学习环境',
      export: '支持作品保存与高清分享',
      satisfactionText: '体验满意后，再安心订阅',
      exclusiveContent: '解锁 1000+ / 3000+ 专属课程内容（三语同步进行）',
      aiCompanion: '全天候 AI 学习陪伴',
      magicTranslatorHighlight: '魔法三语翻译 (Write, Voice & Listen in Chinese) - 每日 20 次',
      sentencePuzzleHighlight: '拼出句子，汉字排列，三语朗读',
      trilingualReadAloudAll: '全部项目皆有三语朗读',
      choosePlan: '选择您的订阅计划',
      unlockAccess: '开启全功能权限',
      securePayments: '安全支付保障',
      backToPlans: '返回订阅',
      successTitle: '欢迎加入 PRO 会员！',
      successSubtitle: '您已成功解锁所有特权功能：',
      features: [
        { name: '趣味游戏天地 (Games)', icon: '🎮' },
        { name: 'AI 故事魔法屋 (AI Stories)', icon: '🪄' },
        { name: '绘画心理分析 (Drawing AI)', icon: '🎨' },
        { name: '三语同步学习 (Trilingual)', icon: '🗣️' },
        { name: 'AI 故事与绘图分析，可下载分享生成精美证书，证书收藏库 Certificates )', icon: '🏆' },
        { name: '魔法三语翻译 (Write, Voice & Listen in Chinese)', icon: '🔮' }
      ],
      startExploring: '开始探索',
      plans: [
        { id: 'monthly', name: '月度会员', price: '48', period: '月', popular: true },
        { id: 'six_months', name: '半年专享', price: '168', period: '6 个月' }
      ],
      cta: '立即订阅',
      bestValue: '超值推荐',
      terms: '订阅即表示您同意我们的服务协议'
    },
    en: {
      title: 'Unlock Unlimited Learning',
      subtitle: 'Premium educational tools for your child',
      freeTrial: '3-Day Free Trial',
      freeTrialDesc: 'Experience all core features for 3 days',
      aiLimitFree: 'AI Stories: 3/day, Drawing: 1/day, Translator: 5/day',
      aiLimitPro: 'AI Stories: 8/day, Drawing: 4/day (Inc. certificate downloads & sharing)',
      fullAccess: 'Unlock all interactive games & lessons',
      noAds: 'Ad-free learning environment',
      export: 'Full share & HD download support',
      satisfactionText: 'Subscribe with peace of mind after a great experience',
      exclusiveContent: 'Unlock 1000+ / 3000+ Exclusive Lessons (Trilingual Sync)',
      aiCompanion: '24/7 AI Learning Companion',
      magicTranslatorHighlight: 'AI Magic Translator (Write, Voice & Listen in Chinese) - 20/day',
      sentencePuzzleHighlight: 'Sentence Puzzle, Character Arranging & Trilingual Read-Aloud',
      trilingualReadAloudAll: 'Trilingual Read-Aloud for All Content',
      choosePlan: 'Choose your plan',
      unlockAccess: 'Unlock All Features',
      securePayments: 'Secure Payments',
      backToPlans: 'Back to Plans',
      successTitle: 'Welcome to PRO!',
      successSubtitle: 'You have unlocked all premium features:',
      features: [
        { name: 'Fun Games Kingdom', icon: '🎮' },
        { name: 'AI Story Magic House', icon: '🪄' },
        { name: 'AI Drawing Analysis', icon: '🎨' },
        { name: 'Sync Trilingual Learning', icon: '🗣️' },
        { name: 'AI Stories & Drawing Analysis, download/share for beautiful certificates, Certificate Vault (Certificates)', icon: '🏆' },
        { name: 'AI Magic Translator (Write, Voice & Listen in Chinese)', icon: '🔮' }
      ],
      startExploring: 'Start Exploring',
      plans: [
        { id: 'monthly', name: 'Monthly', price: '48', period: 'month', popular: true },
        { id: 'six_months', name: '6 Months', price: '168', period: '6 months' }
      ],
      cta: 'Subscribe Now',
      bestValue: 'Best Value',
      terms: 'By subscribing, you agree to our Terms of Service'
    },
    ms: {
      title: 'Buka Pembelajaran Tanpa Had',
      subtitle: 'Alatan pendidikan premium untuk anak anda',
      freeTrial: 'Percubaan Percuma 3 Hari',
      freeTrialDesc: 'Alami semua ciri utama selama 3 hari',
      aiLimitFree: 'Cerita AI: 3 sehari, Analisis Lukisan: 1 sehari, Penterjemah: 5 sehari',
      aiLimitPro: 'Cerita AI: 8 sehari, Analisis Lukisan: 4 sehari (Termasuk muat turun/kongsi sijil)',
      fullAccess: 'Buka semua permainan & pelajaran interaktif',
      noAds: 'Persekitaran pembelajaran tanpa iklan',
      export: 'Sokongan perkongsian & muat turun HD',
      satisfactionText: 'Langgan dengan tenang selepas pengalaman yang hebat',
      exclusiveContent: 'Buka 1000+ / 3000+ Pelajaran Eksklusif (Tiga Bahasa Serentak)',
      aiCompanion: 'Teman Pembelajaran AI 24/7',
      magicTranslatorHighlight: 'AI Terjemahan Sakti (Write, Voice & Listen in Chinese) - 20/day',
      sentencePuzzleHighlight: 'Bina Ayat, Susun Suku Kata & Sebutan Tiga Bahasa',
      trilingualReadAloudAll: 'Sebutan Tiga Bahasa untuk Semua Kandungan',
      choosePlan: 'Pilih pelan anda',
      unlockAccess: 'Buka Semua Ciri',
      securePayments: 'Pembayaran Selamat',
      backToPlans: 'Kembali ke Pelan',
      successTitle: 'Selamat Datang ke PRO!',
      successSubtitle: 'Anda telah membuka semua ciri premium:',
      features: [
        { name: 'Dunia Permainan Menarik', icon: '🎮' },
        { name: 'Rumah Sihir Cerita AI', icon: '🪄' },
        { name: 'Analisis Lukisan AI', icon: '🎨' },
        { name: 'Pembelajaran Tiga Bahasa', icon: '🗣️' },
        { name: 'Analisis Cerita & Lukisan AI, muat turun/kongsi untuk sijil cantik, Arkib Sijil (Certificates)', icon: '🏆' },
        { name: 'AI Terjemahan Sakti (Write, Voice & Listen in Chinese)', icon: '🔮' }
      ],
      startExploring: 'Mula Teroka',
      plans: [
        { id: 'monthly', name: 'Bulanan', price: '48', period: 'bulan', popular: true },
        { id: 'six_months', name: '6 Bulan', price: '168', period: '6 bulan' }
      ],
      cta: 'Langgan Sekarang',
      bestValue: 'Nilai Terbaik',
      terms: 'Dengan melanggan, anda bersetuju dengan Syarat Perkhidmatan'
    }
  };

  const t = content[lang];

  const onNavigateInternal = (view: any) => {
    onClose();
    onNavigate(view);
  };

  const handleSelect = (plan: { id: string; name: string; price: string; period: string }) => {
    setSelectedPlanName(plan.name);
    // Notify parent with full plan info
    onSelectPlan(plan);
  };

  const Header = (
    <div className="fixed top-0 left-0 right-0 z-[500] py-2 px-4 md:p-4 flex flex-row items-center justify-center gap-4 pointer-events-none">
      <div className="pointer-events-auto bg-white/10 backdrop-blur-md p-1.5 rounded-full border border-white/20 shadow-xl scale-75 md:scale-90 flex items-center gap-2 pr-4">
        <LanguageSelector currentLang={lang} onLanguageChange={onLanguageChange} />
      </div>
      
      <div className="absolute top-2 right-2 md:top-4 md:right-4 pointer-events-auto">
        <button 
          onClick={onHome}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all shadow-xl border border-white/20 backdrop-blur-md group"
          title="Home"
        >
          <Home className="text-white w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[300] flex items-start justify-center p-4 overflow-y-auto bg-brand-ink/90 backdrop-blur-xl">
        {Header}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="relative w-full max-w-xl bg-white rounded-[32px] md:rounded-[40px] shadow-2xl p-6 md:p-8 text-center overflow-visible border-4 md:border-8 border-indigo-100 my-8 sm:my-16"
        >
          {/* Back to plans button */}
          <button 
            onClick={() => setShowSuccess(false)}
            className="absolute top-16 right-4 p-2 hover:bg-gray-100 rounded-xl transition-all flex items-center gap-2 text-gray-400 hover:text-indigo-600 font-black text-xs group z-[450]"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>{t.backToPlans}</span>
          </button>

          {/* Confetti-like decor */}
          <div className="absolute -top-10 -left-10 text-4xl animate-bounce">✨</div>
          <div className="absolute -bottom-10 -right-10 text-4xl animate-bounce delay-300">🌟</div>
          
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10, delay: 0.2 }}
            className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-xl"
          >
            <Crown size={32} className="text-white drop-shadow-md md:w-10 md:h-10" />
          </motion.div>

          <h2 className="text-2xl md:text-3xl font-black text-brand-ink mb-2">{t.successTitle}</h2>
          <p className="text-indigo-600 font-bold text-base md:text-lg mb-6 md:mb-8">{t.successSubtitle}</p>

          <div className="grid gap-2 md:gap-3 mb-8 md:mb-10">
            {t.features.map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-3 bg-gray-50 p-3 md:p-4 rounded-xl md:rounded-2xl border-2 border-gray-100/50 group hover:border-indigo-200 transition-colors"
              >
                <span className="text-2xl group-hover:scale-125 transition-transform">{feature.icon}</span>
                <span className="font-black text-brand-ink text-left text-sm md:text-base">{feature.name}</span>
                <Check className="ml-auto text-emerald-500" size={20} />
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-full py-4 md:py-5 rounded-2xl md:rounded-3xl bg-indigo-600 text-white text-lg md:text-xl font-black shadow-xl hover:bg-indigo-700 active:shadow-inner transition-all flex items-center justify-center gap-3"
          >
            <span>{t.startExploring}</span>
            <Sparkles size={20} />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-start p-0 md:p-8 overflow-y-auto bg-brand-ink/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 pointer-events-none"
      />
      {Header}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-5xl bg-white rounded-none md:rounded-[50px] shadow-2xl overflow-visible flex flex-col md:flex-row border-0 md:border-8 border-white mt-0 md:mt-20 mb-0 md:mb-20 min-h-screen md:min-h-0"
      >

        {/* Floating Decor */}
        <div className="absolute top-10 left-10 text-white/10 text-6xl pointer-events-none rotate-12 z-0">🎓</div>
        <div className="absolute bottom-10 right-10 text-white/5 text-8xl pointer-events-none -rotate-12 z-0 text-brand-teal">🎨</div>

        {/* Left Side: Features Highlights */}
        <div className="w-full md:w-2/5 pt-24 pb-8 px-6 sm:px-8 md:p-14 bg-gradient-to-br from-indigo-900 via-violet-800 to-purple-900 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
          {/* Decorative patterns */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full translate-y-40 -translate-x-40 blur-3xl" />
          
          <div className="relative z-10">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mb-10"
            >
              <div className="bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 p-2.5 rounded-2xl shadow-xl border border-white/20">
                <Crown className="text-white w-7 h-7 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]" />
              </div>
              <span className="font-black tracking-[0.2em] text-xl drop-shadow-lg text-yellow-300">PRO UNLIMITED</span>
            </motion.div>
            
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-[1.1] drop-shadow-2xl tracking-tighter">
              {lang === 'zh' ? '欢迎加入 PRO 会员' : t.title}
            </h2>
            <p className="text-indigo-100/90 mb-8 font-bold text-lg leading-relaxed">
              {lang === 'zh' ? '开启 PRO UNLIMITED pages 无限功能体验' : t.subtitle}
            </p>

            <div className="space-y-6">
              {[
                { icon: <Gem className="text-cyan-300" />, text: t.exclusiveContent, color: 'bg-cyan-400/20' },
                { icon: <Zap className="text-amber-300" />, text: t.aiLimitPro, color: 'bg-amber-400/20' },
                { icon: <Sparkles className="text-brand-teal" />, text: t.magicTranslatorHighlight, color: 'bg-brand-teal/20' },
                { icon: <Puzzle className="text-emerald-300" />, text: t.sentencePuzzleHighlight, color: 'bg-emerald-400/20' },
                { icon: <Volume2 className="text-indigo-300" />, text: t.trilingualReadAloudAll, color: 'bg-indigo-400/20' },
                { icon: <Sparkles className="text-yellow-300" />, text: t.fullAccess, color: 'bg-yellow-400/20' },
                { icon: <Heart className="text-rose-300" />, text: t.aiCompanion, color: 'bg-rose-400/20' },
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-6 group"
                >
                  <div className={`p-3 ${feature.color} rounded-[20px] border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                    {React.cloneElement(feature.icon as React.ReactElement, { size: 24 })}
                  </div>
                  <span className="font-black text-xl tracking-tight drop-shadow-md group-hover:text-yellow-200 transition-colors">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div 
            ref={trialCardRef}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            onClick={() => handleSelect({ id: 'trial', name: t.freeTrial, price: '0', period: '3 days' })}
            className={`mt-16 bg-white/5 backdrop-blur-xl p-8 rounded-[40px] border-2 border-white/10 shadow-2xl relative group overflow-hidden cursor-pointer hover:bg-white/10 transition-all ${initialHighlight === 'trial' ? 'ring-4 ring-yellow-400 ring-offset-4 ring-offset-purple-900 border-white/40' : ''}`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent pointer-events-none" />
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-yellow-400/20 p-2 rounded-xl group-hover:bg-yellow-400/40 transition-colors">
                <Check className="text-yellow-400 w-5 h-5" />
              </div>
              <span className="font-black text-2xl tracking-tight">{t.freeTrial}</span>
            </div>
            <p className="text-sm font-bold opacity-70 pl-2 mb-3 leading-relaxed">{t.freeTrialDesc}</p>
            <div className="flex items-center gap-3 text-sm font-black text-yellow-300 bg-white/5 px-4 py-3 rounded-2xl border border-white/10 group-hover:border-white/30 transition-colors mb-4">
              <Star className="w-5 h-5 fill-current" />
              {t.aiLimitFree}
            </div>
            <div className="flex items-center gap-2 pl-2 opacity-80">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-sm font-black tracking-tight italic uppercase">{t.satisfactionText}</p>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Plans */}
        <div className="w-full md:w-3/5 p-6 md:p-12 flex flex-col gap-6 relative bg-[#F9FAFB]">
          <div className="text-center md:text-left mt-12 md:mt-2">
            <h3 className="text-xl md:text-2xl font-black text-brand-ink mb-1">
              {t.choosePlan}
            </h3>
            <p className="text-gray-500 font-medium text-xs md:text-sm mb-4">{t.terms}</p>
            

          </div>

          <div className="grid gap-3">
            {t.plans.map((plan, i) => (
              <motion.button
                key={plan.id}
                whileHover={{ scale: 1.01, x: 5 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelect(plan)}
                className={`flex items-center justify-between p-4 md:p-5 rounded-[24px] md:rounded-[32px] border-4 transition-all relative ${
                  plan.popular 
                    ? 'border-indigo-600 bg-indigo-50/30' 
                    : 'border-gray-100 bg-gray-50/50 hover:border-indigo-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-6 bg-indigo-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                    {t.bestValue}
                  </div>
                )}
                
                <div className="flex flex-col items-start">
                  <span className={`font-black text-lg md:text-xl ${plan.popular ? 'text-indigo-900' : 'text-brand-ink'}`}>
                    {plan.name}
                  </span>
                  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                    {t.unlockAccess}
                  </span>
                </div>

                <div className="flex flex-col items-end">
                  <div className="flex items-baseline gap-1">
                    <span className="text-gray-400 font-bold text-xs">RM</span>
                    <span className="text-3xl md:text-4xl font-black text-brand-ink">{plan.price}</span>
                  </div>
                  <span className="text-gray-400 text-[10px] font-medium uppercase">/ {plan.period}</span>
                </div>
              </motion.button>
            ))}
          </div>

          <button 
            onClick={() => {
              const monthlyPlan = t.plans.find(p => p.id === 'monthly');
              if (monthlyPlan) handleSelect(monthlyPlan);
            }}
            className="w-full py-5 rounded-3xl bg-indigo-600 text-white text-xl md:text-2xl font-black shadow-xl hover:bg-indigo-700 hover:shadow-2xl active:scale-95 transition-all mt-2"
          >
            {t.cta}
          </button>

          <div className="flex flex-col items-center justify-center gap-6 opacity-40">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-200 rounded-full mb-2">
              <Check size={14} className="text-gray-600" />
              <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'zh' ? '随时取消' : lang === 'ms' ? 'Batal bila-bila masa' : 'Cancel anytime'}</span>
            </div>
            <div className="flex items-center gap-6">
              <Shield className="w-6 h-6" />
              <span className="text-xs font-bold uppercase tracking-widest">{t.securePayments}</span>
              <div className="flex gap-2">
                <div className="w-8 h-5 bg-gray-300 rounded" />
                <div className="w-8 h-5 bg-gray-300 rounded" />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full bg-white mt-8 md:mt-0">
           {null}
        </div>
      </motion.div>
    </div>
  );
};
