
import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Download, X, Award, CheckCircle2, Home, ArrowLeft, Palette } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

interface AchievementShareProps {
  categoryLabels: Record<string, string>;
  learnedCount: number;
  totalCount: number;
  onClose: () => void;
  onGoHome: () => void;
  onContinue: () => void;
  artworkImage?: string;
  defaultUserName?: string;
}

export const AchievementShare: React.FC<AchievementShareProps> = ({
  categoryLabels,
  learnedCount,
  totalCount,
  onClose,
  onGoHome,
  onContinue,
  artworkImage,
  defaultUserName
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [userName, setUserName] = useState(defaultUserName || '');

  const progressPercent = Math.round((learnedCount / totalCount) * 100);
  const LOGO_URL = 'https://i.ibb.co/TM3WwYjQ/1000046067-removebg-preview.png';
  
  const shareImage = async () => {
    if (!capturedImage) return;
    try {
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], 'achievement.png', { type: 'image/png' });
      
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: '我的荣誉证书',
          text: `我获得了学习证书！`,
        });
      } else {
        alert('由于系统限制，请长按上面的图片选择“分享”或“保存到相册”！');
      }
    } catch (error) {
      console.error('Sharing failed', error);
      alert('分享功能在当前浏览器可能受限，建议直接截图保存！');
    }
  };

  const downloadImage = () => {
    if (!capturedImage) return;
    const link = document.createElement('a');
    link.href = capturedImage;
    link.download = `Certificate_${categoryLabels.zh}_${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateImage = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isCapturing) return;
    
    setIsCapturing(true);
    try {
      if (!certificateRef.current) throw new Error('Certificate context missing');
      
      // Filter out elements that might cause issues if needed, but html-to-image handles most well
      const dataUrl = await htmlToImage.toPng(certificateRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#FDFCF7',
        cacheBust: true,
      });

      if (dataUrl && dataUrl.length > 5000) {
        setCapturedImage(dataUrl);
      } else {
        throw new Error('Image generation result too small or empty');
      }
    } catch (error) {
      console.error('Image capture failed:', error);
      alert('证书生成遇到了点小问题。别担心，您可以直接截图保存这份成就！');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[5000] flex flex-col items-center justify-center p-4 md:p-8 bg-brand-ink/95 backdrop-blur-xl"
    >
      <div className="relative max-w-xl w-full h-full flex flex-col items-center overflow-y-auto no-scrollbar pt-4 pb-20">
        {/* Header Navigation */}
        <div className="w-full flex items-center justify-between gap-4 px-2 mb-6 shrink-0 text-white">
          <button
            type="button"
            onClick={onContinue}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors py-2"
          >
            <ArrowLeft size={20} />
            <span className="font-bold text-sm">返回练习</span>
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all border border-white/20"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 w-full flex flex-col items-center">
          {/* Main Visual: Visible Medal or Captured Result */}
          <div className="relative w-full max-w-sm mb-10">
            {!capturedImage ? (
              <motion.div 
                ref={certificateRef}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full bg-[#FDFCF7] rounded-[48px] p-6 pb-12 md:p-10 md:pb-16 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] border-[12px] border-brand-yellow relative flex flex-col items-center text-center overflow-hidden"
              >
                {/* Yellow Rounded Corner Border */}
                <div className="absolute inset-0 border-[4px] border-white rounded-[36px] pointer-events-none" />

                <div className="absolute top-8 right-8 text-brand-yellow/30">
                  <Award size={48} className="rotate-12" />
                </div>

                {/* Logo Area - Styled Brand Name */}
                <div className="mb-4 relative z-10">
                   <div className="text-[68px] md:text-[75px] font-black text-orange-500 tracking-tighter leading-none">
                     KIDUNI
                   </div>
                </div>

                <div className="relative z-10 flex flex-col items-center w-full">
                  <h2 className="text-3xl font-black text-brand-ink mb-1">学中文小达人</h2>
                  <div className="text-[10px] font-black text-gray-400 mb-6 uppercase tracking-[0.25em]">Certificate of Achievement</div>

                  <div className="mb-6 w-full">
                    <p className="text-[12px] font-black text-brand-teal uppercase tracking-[0.1em] mb-3">恭喜你完成了 / Congratulations!</p>
                    
                    <div className="flex flex-col items-center mb-6">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 opacity-60">Awarded To</div>
                      <div className="text-3xl font-black text-[#1A1A1A] min-h-[44px] px-8 pb-1 uppercase italic tracking-tighter decoration-brand-yellow/30 underline underline-offset-8">
                        {userName || 'LITTLE HERO'}
                      </div>
                    </div>

                    <div className="w-full h-px bg-gray-200 mb-6 max-w-[80%]" />

                    <h3 className="text-3xl font-black text-brand-coral mb-1 leading-tight tracking-tighter">“{categoryLabels.zh}”</h3>
                    <p className="text-xs font-black text-brand-coral/60 mb-8 uppercase tracking-widest">
                      {categoryLabels.en} | {categoryLabels.ms}
                    </p>

                    {artworkImage && (
                      <div className="w-full mb-10 relative px-4">
                        <div className="relative bg-white p-2 rounded-2xl border-2 border-white shadow-xl overflow-hidden aspect-[4/3] transform hover:rotate-0 transition-transform">
                          <img 
                            src={artworkImage} 
                            alt="Child's Artwork" 
                            className="w-full h-full object-cover rounded-xl"
                            crossOrigin="anonymous" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute bottom-2 right-2 w-12 h-12 bg-brand-yellow rounded-full shadow-lg flex items-center justify-center border-2 border-white">
                            <Palette size={20} className="text-brand-ink" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 bg-brand-teal text-white px-6 py-3 rounded-2xl font-black text-[12px] shadow-lg border-2 border-brand-teal/20">
                    <CheckCircle2 size={18} />
                    <span>做得好！继续加油！ Excellent Progress!</span>
                  </div>
                </div>

                <div className="absolute bottom-4 w-full text-center">
                  <p className="text-[8px] font-bold text-gray-300 uppercase tracking-[0.4em] mb-1">
                    快乐学中文 · FUN CHINESE LEARNING
                  </p>
                  <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest opacity-60">
                    Issued: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative group rounded-[40px] overflow-hidden border-4 border-brand-yellow shadow-2xl"
              >
                <img src={capturedImage} alt="Reward Medal" className="w-full h-auto" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6 text-center backdrop-blur-sm pointer-events-none">
                  <p className="text-white font-black text-sm">💡 提示：您可以长按图片选择“保存到相册”或“分享”<br/><span className="text-xs opacity-80">(Long press to save or share certificate)</span></p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Core Action UI */}
          <div className="w-full max-w-sm px-4">
            {!capturedImage ? (
              <div className="flex flex-col gap-4">
                <div className="bg-white/10 p-4 rounded-3xl border border-white/20 backdrop-blur-sm">
                  <label className="block text-white/50 text-[10px] font-black uppercase tracking-wider mb-2 px-1">
                    请输入您的名字 / Enter Child's Name
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    onKeyUp={(e) => e.stopPropagation()}
                    onKeyPress={(e) => e.stopPropagation()}
                    placeholder="例如: 小超人 / Hero"
                    className="w-full bg-white text-brand-ink px-6 py-4 rounded-2xl font-bold text-lg placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-brand-yellow/50 transition-all shadow-inner"
                  />
                </div>

                <button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={generateImage}
                  disabled={isCapturing}
                  className="w-full text-brand-ink h-[90px] rounded-[36px] font-black flex items-center justify-center gap-4 shadow-2xl active:translate-y-2 transition-all disabled:opacity-70 text-3xl btn-3d-yellow border-4 border-white/50 text-sharp"
                >
                {isCapturing ? (
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-4 border-brand-ink/20 border-t-brand-ink rounded-full animate-spin" />
                    <span>正在生成...</span>
                  </div>
                ) : (
                  <>
                    <Award size={32} className="animate-pulse" /> 
                    <span>领取毕业证书</span>
                  </>
                )}
              </button>
            </div>
          ) : (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4">
                 <div className="flex gap-4">
                   <button 
                      type="button"
                      onClick={downloadImage}
                      className="flex-1 text-white h-[80px] rounded-[30px] font-black shadow-2xl active:translate-y-2 transition-all flex flex-col items-center justify-center text-xl btn-3d-teal text-sharp"
                    >
                      <Download size={20} />
                      <span>保存图片 / Save Image</span>
                      <span className="text-[10px] font-bold opacity-60">下载到手机/电脑</span>
                    </button>
                    <button 
                      type="button"
                      onClick={shareImage}
                      className="flex-1 text-brand-ink h-[80px] rounded-[30px] font-black shadow-2xl active:translate-y-2 transition-all flex items-center justify-center gap-3 text-2xl btn-3d-yellow text-sharp"
                    >
                      <Share2 size={24} />
                      <span>分享 / Share</span>
                    </button>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-auto pt-8 px-4 w-full flex justify-center pb-8 md:pb-0">
          <button
            type="button"
            onClick={onGoHome}
            className="flex items-center gap-3 text-white bg-white/20 px-8 py-4 rounded-2xl hover:bg-white/30 transition-all border-2 border-white/30 group shadow-xl btn-3d text-sharp"
          >
            <Home size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm">返回首页 · Back to Home</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
