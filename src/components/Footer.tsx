import React from 'react';
import { Mail } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  lang: Language;
  onNavigate: (view: any) => void;
  isDark?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ lang, onNavigate, isDark = false }) => {
  const content = {
    zh: {
      about: '关于我们',
      contact: '联系支持',
      privacy: '隐私政策',
      terms: '条款与条件',
      refund: '退款政策',
      cancellation: '取消政策',
      slogan: 'KIDUNI - 让每个孩子都能自信地用三语探索世界',
      rights: '© 2026 KIDUNI. 保留所有权利。',
      links: '重要链接'
    },
    en: {
      about: 'About Us',
      contact: 'Contact Support',
      privacy: 'Privacy Policy',
      terms: 'Terms & Conditions',
      refund: 'Refund Policy',
      cancellation: 'Cancellation Policy',
      slogan: 'KIDUNI - Empowering every child to explore the world in three languages.',
      rights: '© 2026 KIDUNI. All rights reserved.',
      links: 'Important Links'
    },
    ms: {
      about: 'Tentang Kami',
      contact: 'Hubungi Sokongan',
      privacy: 'Dasar Privasi',
      terms: 'Terma & Syarat',
      refund: 'Dasar Bayaran Balik',
      cancellation: 'Dasar Pembatalan',
      slogan: 'KIDUNI - Memperkasakan setiap anak untuk meneroka dunia dalam tiga bahasa.',
      rights: '© 2026 KIDUNI. Hak cipta terpelihara.',
      links: 'Pautan Penting'
    }
  };

  const t = content[lang];

  return (
    <footer className={`w-full py-20 px-6 md:px-12 border-t-2 ${isDark ? 'bg-indigo-950 border-white/10' : 'bg-[#FDFCF7] border-black/5'} relative overflow-hidden`}>
      {/* Decorative patterns */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-brand-coral/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-teal/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 relative z-10">
        {/* Brand Info */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-6">
          <div className="flex flex-col items-start">
             <div className="text-3xl font-black text-orange-500 tracking-tighter">
                KIDUNI
             </div>
             <p className={`mt-4 font-medium leading-relaxed ${isDark ? 'text-white/60' : 'text-brand-ink/60'}`}>
               {t.slogan}
             </p>
          </div>
        </div>

        {/* Quick Links Column 1 */}
        <div className="flex flex-col gap-6">
          <h4 className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-brand-ink'}`}>
            {t.links}
          </h4>
          <div className="flex flex-col gap-3">
             <button onClick={() => onNavigate('about')} className={`text-left hover:translate-x-1 transition-all ${isDark ? 'text-white/60 hover:text-white' : 'text-brand-ink/60 hover:text-brand-ink'}`}>{t.about}</button>
             <button onClick={() => onNavigate('contact')} className={`text-left hover:translate-x-1 transition-all ${isDark ? 'text-white/60 hover:text-white' : 'text-brand-ink/60 hover:text-brand-ink'}`}>{t.contact}</button>
             <button onClick={() => onNavigate('terms')} className={`text-left hover:translate-x-1 transition-all ${isDark ? 'text-white/60 hover:text-white' : 'text-brand-ink/60 hover:text-brand-ink'}`}>{t.terms}</button>
          </div>
        </div>

        {/* Quick Links Column 2 */}
        <div className="flex flex-col gap-6">
          <h4 className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-brand-ink'}`}>
            {lang === 'zh' ? '政策' : lang === 'ms' ? 'Polisi' : 'Policies'}
          </h4>
          <div className="flex flex-col gap-3">
             <button onClick={() => onNavigate('privacy')} className={`text-left hover:translate-x-1 transition-all ${isDark ? 'text-white/60 hover:text-white' : 'text-brand-ink/60 hover:text-brand-ink'}`}>{t.privacy}</button>
             <button onClick={() => onNavigate('refund')} className={`text-left hover:translate-x-1 transition-all ${isDark ? 'text-white/60 hover:text-white' : 'text-brand-ink/60 hover:text-brand-ink'}`}>{t.refund}</button>
             <button onClick={() => onNavigate('cancellation')} className={`text-left hover:translate-x-1 transition-all ${isDark ? 'text-white/60 hover:text-white' : 'text-brand-ink/60 hover:text-brand-ink'}`}>{t.cancellation}</button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-6">
          <h4 className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-brand-ink'}`}>
            {lang === 'zh' ? '联系我们' : lang === 'ms' ? 'Hubungi Kami' : 'Contact Us'}
          </h4>
          <div className={`space-y-4 ${isDark ? 'text-white/60' : 'text-brand-ink/60'}`}>
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-brand-teal" />
              <span className="font-bold">kiduniapp@gmail.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`mt-16 pt-8 border-t ${isDark ? 'border-white/5' : 'border-black/5'} flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
        <p>{t.rights}</p>
      </div>
    </footer>
  );
};
