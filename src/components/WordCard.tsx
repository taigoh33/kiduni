
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star } from 'lucide-react';
import { LearningItem, Language } from '../types';
import { CATEGORIES } from '../constants/content';

interface WordCardProps {
  item: LearningItem;
  lang: Language;
}

export const WordCard: React.FC<WordCardProps> = ({ item, lang }) => {
  const [showStar, setShowStar] = useState(false);

  const categoryLabel = CATEGORIES.find(c => c.id === item.category)?.label.zh || '';

  const getActionHint = (zh: string) => {
    if (zh === '苹果' || zh === '香蕉' || zh === '西瓜' || zh === '葡萄' || zh === '草莓' || zh === '汉堡' || zh === '披萨') return { icon: '😋', text: '假装大口咬一下 / Pretend to take a big bite!' };
    if (zh === '狮子' || zh === '老虎' || zh === '猫' || zh === '狗') return { icon: '🦁', text: '学一下这个动物的声音 / Make the animal sound!' };
    if (zh === '红色' || zh === '蓝色' || zh === '黄色' || zh === '绿色') return { icon: '🔍', text: '找找房间里有什么是这个颜色 / Find this color in your room!' };
    if (zh === '眼睛' || zh === '鼻子' || zh === '嘴巴') return { icon: '👉', text: '指一指你的这个部位 / Point to it!' };
    if (item.category === 'numbers') {
      if (['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'].includes(zh)) {
        return { icon: '🖐️', text: '伸出手指比一下 / Show your fingers!' };
      }
      return { icon: '🔢', text: '大声数一数 / Count it out loud!' };
    }
    return null;
  };

  const actionHint = getActionHint(item.translations.zh);
  const isNumberCategory = item.category === 'numbers';

  if (!item) return null;

  const speakInLang = (code: Language) => {
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
                      voices.find(v => (v.lang.includes('en-IN') || v.lang.includes('en-PH')));
      
      if (enVoice) utterance.voice = enVoice;
      utterance.lang = 'en-SG'; 
    } else if (code === 'ms') {
      const msVoice = voices.find(v => (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('google')) && (v.lang.startsWith('ms') || v.name.toLowerCase().includes('malay')))
                    || voices.find(v => v.lang.startsWith('ms') || v.name.toLowerCase().includes('bahasa melayu'));
      
      if (msVoice) utterance.voice = msVoice;
      utterance.lang = 'ms-MY';
    }
    
    utterance.rate = 0.6; 
    utterance.pitch = 1.1; 
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full px-2 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        key={item.id}
        className="w-full max-w-[800px] bg-[#F5F2E8] rounded-[40px] md:rounded-[50px] shadow-2xl relative flex flex-col items-center order-1 pb-8 overflow-visible"
      >
        <AnimatePresence>
          {showStar && (
            <motion.div
              initial={{ scale: 0, y: 0, opacity: 0 }}
              animate={{ scale: [1, 1.2, 1], y: -20, opacity: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute top-20 left-1/2 -translate-x-1/2 text-4xl z-50 pointer-events-none flex flex-col items-center"
            >
              <Star className="text-yellow-400 fill-current" size={60} />
              <div className="text-xl font-black text-brand-coral mt-2 whitespace-nowrap drop-shadow-md">太棒了!</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Area (The Frame) */}
        <div className="w-full h-72 md:h-[450px] relative group overflow-hidden flex items-center justify-center rounded-t-[40px] md:rounded-t-[50px] shadow-inner mb-4"
          style={item.translations.zh === '红色' ? { 
            backgroundImage: 'url(https://i.ibb.co/7JHcxVs2/vector-red-blurred-background-wall-color-1080184-229.jpg)',
            backgroundSize: 'cover'
          } : item.translations.zh === '蓝色' ? {
            backgroundImage: 'url(https://i.ibb.co/FL2NbDsB/blue-square-background-perfect-backdrop-banners-posters-ad-events-various-design-works-7954-55703.jpg)',
            backgroundSize: 'cover'
          } : item.translations.zh === '黄色' ? {
            backgroundImage: 'url(https://i.ibb.co/YTP5xtDV/lemon-yellow-63669-1494606073.png)',
            backgroundSize: 'cover'
          } : item.translations.zh === '绿色' ? {
            backgroundImage: 'url(https://i.ibb.co/CRf2ch6/ss-288.jpg)',
            backgroundSize: 'cover'
          } : item.translations.zh === '橙色' ? {
            backgroundImage: 'url(https://i.ibb.co/tP1zdFQ7/6765.png)',
            backgroundSize: 'cover'
          } : item.translations.zh === '紫色' ? {
            backgroundImage: 'url(https://i.ibb.co/xSLGvvLQ/6e29ff.png)',
            backgroundSize: 'cover'
          } : (item.translations.zh === '粉色' || item.translations.zh === '粉红色') ? {
            backgroundImage: 'url(https://i.ibb.co/ZppTKNJn/pink-background-1377808499o-FK.jpg)',
            backgroundSize: 'cover'
          } : item.translations.zh === '棕色' ? {
            backgroundImage: 'url(https://i.ibb.co/HT2bfq9c/47086-rd.png)',
            backgroundSize: 'cover'
          } : item.translations.zh === '黑色' ? {
            backgroundImage: 'url(https://i.ibb.co/NgRfSLG1/Black.png)',
            backgroundSize: 'cover'
          } : item.translations.zh === '白色' ? {
            backgroundImage: 'url(https://i.ibb.co/6Rn3FLRP/old-white-mortar-wall-background-260nw-2477511245.jpg)',
            backgroundSize: 'cover'
          } : { backgroundColor: '#ffffff' }}
        >
          {/* Main Visual Logic */}
          <div className="w-full h-full bg-black/5 flex items-center justify-center">
            {isNumberCategory ? (
              <div className="flex flex-col items-center justify-center w-full h-full relative text-white">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  key={item.id + '-graphic'}
                  className="w-32 h-32 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 shadow-xl border-4 md:border-12 border-white flex items-center justify-center font-black text-6xl md:text-9xl drop-shadow-2xl"
                >
                  {item.id.replace('num-', '')}
                </motion.div>
              </div>
                        ) : item.translations.zh === '圆形' ? (
              <div className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform p-12">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                  <circle cx="50" cy="50" r="45" fill="#3B82F6" stroke="white" strokeWidth="2" />
                </svg>
              </div>
            ) : item.translations.zh === '正方形' ? (
              <div className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform p-12">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                  <rect x="10" y="10" width="80" height="80" fill="#EF4444" stroke="white" strokeWidth="2" />
                </svg>
              </div>
            ) : item.translations.zh === '三角形' ? (
              <div className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform p-12">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                  <path d="M50 10 L90 85 L10 85 Z" fill="#10B981" stroke="white" strokeWidth="2" />
                </svg>
              </div>
            ) : item.translations.zh === '星形' ? (
              <div className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform p-12">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                  <path d="M50 5 L61 38 L95 38 L67 58 L78 91 L50 71 L22 91 L33 58 L5 38 L39 38 Z" fill="#F59E0B" stroke="white" strokeWidth="2" />
                </svg>
              </div>
            ) : item.translations.zh === '心形' ? (
              <div className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform p-12">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                  <path d="M50 90 L15 55 A25 25 0 0 1 50 25 A25 25 0 0 1 85 55 Z" fill="#EC4899" stroke="white" strokeWidth="2" />
                </svg>
              </div>
            ) : item.translations.zh === '长方形' ? (
              <div className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform p-12">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                  <rect x="5" y="25" width="90" height="50" fill="#6366F1" stroke="white" strokeWidth="2" />
                </svg>
              </div>
            ) : item.translations.zh === '椭圆形' ? (
              <div className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform p-12">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                  <ellipse cx="50" cy="50" rx="45" ry="30" fill="#8B5CF6" stroke="white" strokeWidth="2" />
                </svg>
              </div>
            ) : item.translations.zh === '菱形' ? (
              <div className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform p-12">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                  <path d="M50 5 L90 50 L50 95 L10 50 Z" fill="#F97316" stroke="white" strokeWidth="2" />
                </svg>
              </div>
            ) : item.translations.zh === '六边形' ? (
              <div className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform p-12">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                  <path d="M50 5 L89 27.5 L89 72.5 L50 95 L11 72.5 L11 27.5 Z" fill="#14B8A6" stroke="white" strokeWidth="2" />
                </svg>
              </div>
            ) : item.translations.zh === '五边形' ? (
              <div className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform p-12">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                  <path d="M50 5 L92.5 36 L76 86 L24 86 L7.5 36 Z" fill="#D946EF" stroke="white" strokeWidth="2" />
                </svg>
              </div>
            ) : item.translations.zh === '铅笔' ? (
              <div className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform">
                <img 
                  src="https://i.ibb.co/jPyx17fs/3822-1200.jpg" 
                  alt="铅笔" 
                  className="w-full h-full object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : item.translations.zh === '书' ? (
              <div className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform">
                <img 
                  src="https://i.ibb.co/SwFxs553/1-DDFE633-2-B85-468-D-B28-D05-ADAE7-D1-AD8-source.jpg" 
                  alt="书" 
                  className="w-full h-full object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : item.translations.zh === '尺子' ? (
              <div className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform">
                <img 
                  src="https://i.ibb.co/HLZfx7Lj/61-Qa-Qvxl-M9-L.jpg" 
                  alt="尺子" 
                  className="w-full h-full object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : item.translations.zh === '彩色笔' ? (
              <div className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform">
                <img 
                  src="https://i.ibb.co/DfcgWWnx/81-Ahijf-V0f-L-AC-UF894-1000-QL80.jpg" 
                  alt="彩色笔" 
                  className="w-full h-full object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : item.translations.zh === '蜡笔' ? (
              <div className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform">
                <img 
                  src="https://i.ibb.co/4w7RcKcb/Crayons.jpg" 
                  alt="蜡笔" 
                  className="w-full h-full object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : item.translations.zh === '胶水' ? (
              <div className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform">
                <img 
                  src="https://i.ibb.co/HD6MBZVC/Hippo-Malaysia-Clear-Glue-No-106-G-grande.jpg" 
                  alt="胶水" 
                  className="w-full h-full object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : item.translations.zh === '作业本' ? (
              <div className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform">
                <img 
                  src="https://i.ibb.co/b5BrHsry/6-Pt-J1bv-Tr-N.jpg" 
                  alt="作业本" 
                  className="w-full h-full object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : item.translations.zh === '橡皮' ? (
              <div className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform">
                <img 
                  src="https://i.ibb.co/qF0XZSCR/createive-mark-art-stroke-artist-erasers-group.jpg" 
                  alt="橡皮" 
                  className="w-full h-full object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : item.translations.zh === '牙膏' ? (
              <div className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform">
                <img 
                  src="https://i.ibb.co/LhpKsxvM/32552-1.jpg" 
                  alt="牙膏" 
                  className="w-full h-full object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : item.translations.zh === '空调' ? (
              <div className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform">
                <img 
                  src="https://i.ibb.co/PGbsD7yS/20190729085604452.png" 
                  alt="空调" 
                  className="w-full h-full object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : item.translations.zh === '床' ? (
              <div className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform">
                <img 
                  src="https://i.ibb.co/0VVmKgm8/PJK-Bed.jpg" 
                  alt="床" 
                  className="w-full h-full object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : item.translations.zh === '枕头' ? (
              <div className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform">
                <img 
                  src="https://i.ibb.co/QjJs4mLj/261014071500-001.jpg" 
                  alt="枕头" 
                  className="w-full h-full object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : item.translations.zh === '镜子' ? (
              <div className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform">
                <img 
                  src="https://i.ibb.co/hJ7TtmfC/rl-Zg-Ee-ZUnk.jpg" 
                  alt="镜子" 
                  className="w-full h-full object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : item.translations.zh === '洗衣机' ? (
              <div className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform">
                <img 
                  src="https://i.ibb.co/xtPhNcFv/15561-LX5-0.jpg" 
                  alt="洗衣机" 
                  className="w-full h-full object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : item.translations.zh === '衣柜' ? (
              <div className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform">
                <img 
                  src="https://i.ibb.co/xV2xzQm/O1-CN01xp-Oh0v1ao-GA16-Fq-Bu-6000000003376-2-yinhe-png-q50-jpg.webp" 
                  alt="衣柜" 
                  className="w-full h-full object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : item.translations.zh === '台灯' ? (
              <div className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform">
                <img 
                  src="https://i.ibb.co/1fgWy25q/20416735.png" 
                  alt="台灯" 
                  className="w-full h-full object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : item.translations.zh === '电水壶' ? (
              <div className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform">
                <img 
                  src="https://i.ibb.co/35hWyZQD/O1-CN01qu-Cs-G11p0z-Qms-CH67-6000000005299-0-yinhe-jpg-540x540.jpg" 
                  alt="电水壶" 
                  className="w-full h-full object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : item.translations.zh === '烤面包机' ? (
              <div className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform">
                <img 
                  src="https://i.ibb.co/1fVKZqP7/bread-slice-9715714-1280.png" 
                  alt="烤面包机" 
                  className="w-full h-full object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : item.translations.zh === '熨斗' ? (
              <div className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform">
                <img 
                  src="https://i.ibb.co/qLsvGPFm/7df27bbc04d3b7ff88663a8049b9ce3c-1770352291.webp" 
                  alt="熨斗" 
                  className="w-full h-full object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : item.translations.zh === '吹风机' ? (
              <div className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform">
                <img 
                  src="https://i.ibb.co/8Lvhds85/143746-17961288.jpg" 
                  alt="吹风机" 
                  className="w-full h-full object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : !['红色', '蓝色', '黄色', '绿色', '橙色', '紫色', '粉色', '粉红色', '棕色', '黑色', '白色'].includes(item.translations.zh) && (
              <img
                src={item.imageUrl}
                alt={item.translations[lang]}
                className="w-full h-full object-contain drop-shadow-2xl"
                referrerPolicy="no-referrer"
              />
            )}
          </div>
        </div>

        {/* Word Display Area */}
        <div className="flex flex-col items-center my-4 px-4 w-full">
          <button 
            type="button"
            onClick={() => speakInLang('zh')}
            className={`${
              item.translations.zh.length > 3 
                ? 'text-4xl md:text-6xl' 
                : 'text-6xl md:text-8xl'
            } font-black text-blue-600 leading-tight hover:scale-105 active:scale-95 transition-transform cursor-pointer text-center drop-shadow-sm`}
          >
            {item.translations.zh}
          </button>
          
          <span className="text-lg md:text-2xl font-bold text-brand-coral/80 mt-1 uppercase tracking-wider">
            {item.pinyin}
          </span>
        </div>
        
        {actionHint && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-3 px-6 py-3 bg-violet-50 border-2 border-violet-100 rounded-2xl mb-6 mx-4 shadow-sm"
          >
            <span className="text-3xl animate-bounce-slow">{actionHint.icon}</span>
            <div className="flex flex-col">
              <span className="text-xs md:text-sm font-bold text-brand-ink leading-tight">{actionHint.text}</span>
            </div>
          </motion.div>
        )}

        {/* Multi-language Area */}
        <div className="flex gap-4 md:gap-10 text-center bg-white/60 p-5 rounded-[30px] border-2 border-green-300 w-[95%] justify-center shadow-inner">
          <button 
            type="button"
            onClick={() => speakInLang('zh')}
            className="flex flex-col group hover:scale-105 transition-transform items-center min-w-[60px]"
          >
            <span className="text-brand-muted text-[10px] font-bold uppercase tracking-wider mb-1">ZH</span>
            <span className="text-xl md:text-3xl font-black text-blue-600">中文</span>
          </button>
          <div className="w-[2px] bg-green-200"></div>
          <button 
            type="button"
            onClick={() => speakInLang('en')}
            className="flex flex-col group hover:scale-105 transition-transform items-center min-w-[60px]"
          >
            <span className="text-brand-muted text-[10px] font-bold uppercase tracking-wider mb-1">EN</span>
            <span className="text-lg md:text-2xl font-bold text-brand-teal truncate max-w-[150px]">{item.translations.en}</span>
          </button>
          <div className="w-[2px] bg-green-200"></div>
          <button 
            type="button"
            onClick={() => speakInLang('ms')}
            className="flex flex-col group hover:scale-105 transition-transform items-center min-w-[60px]"
          >
            <span className="text-brand-muted text-[10px] font-bold uppercase tracking-wider mb-1">MS</span>
            <span className="text-lg md:text-2xl font-bold text-brand-coral truncate max-w-[150px]">{item.translations.ms}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
