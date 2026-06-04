import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Smartphone, Globe, Headphones, Info } from 'lucide-react';

interface VoiceHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'zh' | 'ms' | 'en';
}

const VoiceHelpModal: React.FC<VoiceHelpModalProps> = ({ isOpen, onClose, lang }) => {
  const content = {
    zh: {
      title: '如何提升马来语(或其他)语音品质？',
      subtitle: '如果觉得声音不自然或是有“机器感”，请根据您的手机型号尝试以下步骤：',
      samsung: {
        brand: '三星 (Samsung) 手机',
        steps: [
          '打开【设置】 > 【常规管理】',
          '选择【文字转语音】接口',
          '在【首选引擎】中点击齿轮按钮',
          '点击【安装语音数据】，选择【马来语 (Malay)】并下载“高品质”版本'
        ]
      },
      android: {
        brand: '其他安卓 (Android) 手机',
        steps: [
          '打开【设置】 > 【Google】 > 【Google 应用的设置】',
          '选择【搜索、助理和语音】 > 【语音】',
          '点击【文字转语音输出】 > 【安装语音数据】',
          '寻找并下载【马来语】的高级语音包'
        ]
      },
      ios: {
        brand: '苹果 (iPhone/iOS) 手机',
        steps: [
          '打开【设置】 > 【辅助功能】',
          '选择【朗读内容】 > 【声音】',
          '点击【马来语】，选择下载【增强型 (Enhanced)】版本'
        ]
      },
      close: '我知道了'
    },
    ms: {
      title: 'Bagaimana untuk meningkatkan kualiti suara?',
      subtitle: 'Jika suara kedengaran aneh atau seperti robot, sila ikuti langkah di bawah mengikut jenis telefon anda:',
      samsung: {
        brand: 'Telefon Samsung',
        steps: [
          'Buka [Settings] > [General Management]',
          'Pilih [Text-to-speech]',
          'Klik ikon gear di sebelah [Preferred engine]',
          'Klik [Install voice data], pilih [Malay] dan muat turun versi "High Quality"'
        ]
      },
      android: {
        brand: 'Telefon Android Lain',
        steps: [
          'Buka [Settings] > [Google] > [Settings for Google apps]',
          'Pilih [Search, Assistant & Voice] > [Voice]',
          'Klik [Text-to-speech output] > [Install voice data]',
          'Cari dan muat turun pek suara [Malay]'
        ]
      },
      ios: {
        brand: 'iPhone / iOS',
        steps: [
          'Buka [Settings] > [Accessibility]',
          'Pilih [Spoken Content] > [Voices]',
          'Klik [Malay] dan pilih untuk muat turun versi [Enhanced]'
        ]
      },
      close: 'Faham'
    },
    en: {
      title: 'How to improve voice quality?',
      subtitle: 'If the voice sounds unnatural or robotic, please try these steps based on your device:',
      samsung: {
        brand: 'Samsung Devices',
        steps: [
          'Go to [Settings] > [General Management]',
          'Select [Text-to-speech]',
          'Tap the gear icon next to [Preferred engine]',
          'Tap [Install voice data], find [Malay] and download the "High Quality" version'
        ]
      },
      android: {
        brand: 'Other Android Devices',
        steps: [
          'Go to [Settings] > [Google] > [Settings for Google apps]',
          'Select [Search, Assistant & Voice] > [Voice]',
          'Tap [Text-to-speech output] > [Install voice data]',
          'Find and download the [Malay] high-quality data'
        ]
      },
      ios: {
        brand: 'iPhone / iOS',
        steps: [
          'Go to [Settings] > [Accessibility]',
          'Select [Spoken Content] > [Voices]',
          'Tap [Malay] and choose to download the [Enhanced] version'
        ]
      },
      close: 'Got it'
    }
  };

  const t = content[lang];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-indigo-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg max-h-[90vh] bg-[#F5F2E8] rounded-3xl shadow-2xl overflow-hidden border-4 border-white flex flex-col"
          >
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white rounded-full text-indigo-900/40 hover:text-orange-500 transition-colors shadow-sm z-10"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-6 pr-8">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500 shadow-inner shrink-0">
                  <Headphones size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-indigo-900 leading-tight">{t.title}</h2>
                  <p className="text-sm font-bold text-indigo-900/40">{t.subtitle}</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Samsung Section */}
                <div className="bg-[#F5F2E8] p-4 rounded-2xl border-2 border-indigo-100 shadow-sm hover:border-orange-200 transition-colors">
                  <div className="flex items-center gap-2 mb-3 text-indigo-900 font-black">
                    <Smartphone className="text-orange-500" size={18} />
                    {t.samsung.brand}
                  </div>
                  <ul className="space-y-3">
                    {t.samsung.steps.map((step, i) => (
                      <li key={i} className="text-sm font-bold text-indigo-900/70 flex gap-3 items-start leading-snug">
                        <span className="w-5 h-5 bg-orange-100 text-orange-500 rounded flex items-center justify-center text-[10px] shrink-0 mt-0.5">{i+1}</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Android Section */}
                <div className="bg-[#F5F2E8] p-4 rounded-2xl border-2 border-indigo-100 shadow-sm hover:border-orange-200 transition-colors">
                  <div className="flex items-center gap-2 mb-3 text-indigo-900 font-black">
                    <Globe className="text-orange-500" size={18} />
                    {t.android.brand}
                  </div>
                  <ul className="space-y-3">
                    {t.android.steps.map((step, i) => (
                      <li key={i} className="text-sm font-bold text-indigo-900/70 flex gap-3 items-start leading-snug">
                        <span className="w-5 h-5 bg-orange-100 text-orange-500 rounded flex items-center justify-center text-[10px] shrink-0 mt-0.5">{i+1}</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* iOS Section */}
                <div className="bg-[#F5F2E8] p-4 rounded-2xl border-2 border-indigo-100 shadow-sm hover:border-orange-200 transition-colors">
                  <div className="flex items-center gap-2 mb-3 text-indigo-900 font-black">
                    <Smartphone className="text-orange-500" size={18} />
                    {t.ios.brand}
                  </div>
                  <ul className="space-y-3">
                    {t.ios.steps.map((step, i) => (
                      <li key={i} className="text-sm font-bold text-indigo-900/70 flex gap-3 items-start leading-snug">
                        <span className="w-5 h-5 bg-orange-100 text-orange-500 rounded flex items-center justify-center text-[10px] shrink-0 mt-0.5">{i+1}</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full mt-8 py-4 text-white font-black rounded-2xl shadow-xl transition-all btn-3d-coral active:translate-y-2 text-lg text-sharp"
              >
                {t.close}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VoiceHelpModal;
