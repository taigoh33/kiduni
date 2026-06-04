import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Mail, MapPin, Phone, ShieldCheck, FileText, RefreshCcw, XCircle, Info, Home } from 'lucide-react';
import { Language } from '../types';

interface LegalPageProps {
  type: 'about' | 'contact' | 'privacy' | 'terms' | 'refund' | 'cancellation';
  lang: Language;
  onBack: () => void;
  onHome: () => void;
}

export const LegalPages: React.FC<LegalPageProps> = ({ type, lang, onBack, onHome }) => {
  const content = {
    zh: {
      about: {
        title: '关于 KIDUNI',
        subtitle: '您的孩子值得拥有最好的 AI 启蒙教育',
        storyTitle: '我们的故事',
        storyText: 'KIDUNI 诞生于一个愿景：在马来西亚这片多元文化的土地上，让每一个孩子都能快乐、自信地掌握多种语言。作为家长，我们深知语言学习的挑战，因此我们结合了最先进的 AI 技术，打造了这款三语同步学习平台。',
        missionTitle: '我们的使命',
        missionText: '通过 AI 讲故事、绘画分析和趣味互动，激发孩子学习中文、英文和马来文的兴趣，培养他们的创造力与感知力。',
        vibeTitle: '为什么选择 KIDUNI？',
        vibeItems: [
          '家长研发：由了解本地教育需求的专业团队打造',
          '三语均衡：中文、英文、马来文无缝切换视角',
          '智慧陪伴：AI 解析孩子画作与故事，走进孩子内心'
        ]
      },
      contact: {
        title: '联系我们',
        subtitle: '我们随时为您提供帮助',
        email: 'kiduniapp@gmail.com',
        response: '我们通常会在 48 小时内回复您的邮件'
      },
      privacy: {
        title: '隐私政策',
        lastUpdated: '最后更新：2026年5月16日',
        sections: [
          {
            h: '1. 数据收集',
            p: '我们仅收集提供服务所必需的信息。这包括家长创建账户时的姓名、孩子的年龄（用于内容推荐）以及在使用 AI 绘画分析时上传的图像。'
          },
          {
            h: '2. 图像与 AI',
            p: '用户上传的绘图图片仅用于 AI 分析服务。我们不会在未获得您明确书面许可的情况下将这些图片用于营销。'
          },
          {
            h: '3. 儿童安全',
            p: '本应用符合国际儿童在线隐私保护法。我们不包含任何第三方广告，也不会向任何第三方出售用户数据。'
          }
        ]
      },
      terms: {
        title: '条款与条件',
        lastUpdated: '最后更新：2026年5月16日',
        sections: [
          {
            h: '1. 服务使用',
            p: 'KIDUNI 提供订阅制的 AI 学习服务。通过使用本应用，您同意仅将其用于合法的教育目的。'
          },
          {
            h: '2. 账户责任',
            p: '家长对账户的使用负责，并应监督孩子在平台上的活动。'
          },
          {
            h: '3. 订阅与支付',
            p: '所有订阅交易由受监管的支付渠道（如 Billplz、PayPal 等）处理。通过订阅，您授权我们在每个账单周期开始时按所选计划扣费。'
          }
        ]
      },
      refund: {
        title: '退款政策',
        p: '我们致力于提供卓越的学习体验，但如果您对服务不满意，我们将根据以下条款处理：',
        points: [
          '一旦使用了 AI 测试/生成功能超过每日限制，将无法申请退款。',
          '所有退款申请需发送至 kiduniapp@gmail.com，并说明理由。',
          '退款将在获批后的 7-14 个工作日内退还至原支付渠道。'
        ]
      },
      cancellation: {
        title: '订阅取消政策',
        p: '您可以随时取消订阅，没有任何隐藏费用：',
        points: [
          '您可以通过应用内的“订阅管理”或联系支持团队随时取消。',
          '取消后，您的会员权限将保留至当前计费周期结束。',
          '若您使用的是免费试用（3天），请在试用结束前 24 小时取消，以避免自动扣费。'
        ]
      }
    },
    en: {
      about: {
        title: 'About KIDUNI',
        subtitle: 'Your child deserves the best AI-powered early learning',
        storyTitle: 'Our Story',
        storyText: 'KIDUNI was born from a vision: in the multicultural land of Malaysia, every child should master multiple languages with joy and confidence. As parents ourselves, we created this platform using advanced AI to bridge the language gap.',
        missionTitle: 'Our Mission',
        missionText: 'To inspire interest in Mandarin, English, and Malay through AI storytelling, drawing analysis, and interactive play, nurturing creativity and perception.',
        vibeTitle: 'Why Choose KIDUNI?',
        vibeItems: [
          'Parent-Driven: Built by a professional team understanding local needs',
          'Trilingual Sync: Seamless context switching between languages',
          'AI Companion: Deep insights into your child\'s inner world through art.'
        ]
      },
      contact: {
        title: 'Contact Us',
        subtitle: 'We are here to support your journey',
        email: 'kiduniapp@gmail.com',
        response: 'We usually respond within 48 hours'
      },
      privacy: {
        title: 'Privacy Policy',
        lastUpdated: 'Last Updated: May 16, 2026',
        sections: [
          {
            h: '1. Data Collection',
            p: 'We collect only essential information: parent names, child\'s age for personalization, and drawings uploaded for AI analysis.'
          },
          {
            h: '2. Images & AI',
            p: 'Uploaded drawings are used strictly for AI processing. We never use these images for marketing without your explicit written consent.'
          },
          {
            h: '3. Child Safety',
            p: 'Our platform is COPPA compliant. We feature zero third-party ads and do not sell data to any outside parties.'
          }
        ]
      },
      terms: {
        title: 'Terms & Conditions',
        lastUpdated: 'Last Updated: May 16, 2026',
        sections: [
          {
            h: '1. Service Usage',
            p: 'KIDUNI provides subscription-based AI learning. By using our app, you agree to use it for lawful educational purposes only.'
          },
          {
            h: '2. Account Responsibility',
            p: 'Parents are responsible for the account usage and should supervise their child\'s activities on the platform.'
          },
          {
            h: '3. Subscription & Payments',
            p: 'Transactions are handled via regulated gateways (Billplz, PayPal, etc.). Subscribers authorize recurring billing based on chosen plans.'
          }
        ]
      },
      refund: {
        title: 'Refund Policy',
        p: 'We strive for excellence, but if you are unsatisfied, our policy is as follows:',
        points: [
          'No refunds once AI generation features have exceeded daily limits.',
          'Requests must be sent to kiduniapp@gmail.com with a valid reason.',
          'Refunds take 7-14 working days to process back to the original method.'
        ]
      },
      cancellation: {
        title: 'Cancellation Policy',
        p: 'You can cancel your subscription anytime with zero hidden fees:',
        points: [
          'Cancel via the Manage Subscription section or by contacting support.',
          'Premium access remains active until the end of your current billing cycle.',
          'Trial users (3-day) must cancel 24h before trial ends to avoid charges.'
        ]
      }
    },
    ms: {
      about: {
        title: 'Mengenai KIDUNI',
        subtitle: 'Anak anda berhak mendapat pendidikan AI yang terbaik',
        storyTitle: 'Kisah Kami',
        storyText: 'KIDUNI lahir daripada visi: di bumi Malaysia yang berbilang budaya, setiap kanak-kanak harus menguasai pelbagai bahasa dengan gembira dan yakin.',
        missionTitle: 'Misi Kami',
        missionText: 'Memberi inspirasi dalam pembelajaran Bahasa Mandarin, Inggeris, dan Melayu melalui penceritaan AI dan analisis lukisan.',
        vibeTitle: 'Mengapa Pilih KIDUNI?',
        vibeItems: [
          'Dibangunkan Ibu Bapa: Memahami keperluan pendidikan tempatan',
          'Segerak Tiga Bahasa: Peralihan konteks yang lancar',
          'Teman Pintar: Memahami dunia dalaman anak melalui seni AI.'
        ]
      },
      contact: {
        title: 'Hubungi Kami',
        subtitle: 'Kami sedia membantu anda',
        email: 'kiduniapp@gmail.com',
        response: 'Kami akan membalas dalam masa 48 jam'
      },
      privacy: {
        title: 'Dasar Privasi',
        lastUpdated: 'Dikemas kini: 16 Mei 2026',
        sections: [
          {
            h: '1. Pengumpulan Data',
            p: 'Kami hanya mengumpul maklumat penting untuk perkhidmatan, seperti nama ibu bapa dan umur anak.'
          },
          {
            h: '2. Imej & AI',
            p: 'Lukisan yang dimuat naik hanya digunakan untuk analisis AI dan tidak akan digunakan untuk pemasaran tanpa izin.'
          },
          {
            h: '3. Keselamatan Kanak-kanak',
            p: 'Kami mematuhi piawaian perlindungan privasi kanak-kanak antarabangsa tanpa iklan pihak ketiga.'
          }
        ]
      },
      terms: {
        title: 'Terma & Syarat',
        lastUpdated: 'Dikemas kini: 16 Mei 2026',
        sections: [
          {
            h: '1. Penggunaan Perkhidmatan',
            p: 'Dengan menggunakan KIDUNI, anda bersetuju untuk menggunakannya bagi tujuan pendidikan sahaja.'
          },
          {
            h: '2. Tanggungjawab Akaun',
            p: 'Ibu bapa bertanggungjawab atas penggunaan akaun anak-anak di platform ini.'
          },
          {
            h: '3. Langganan & Pembayaran',
            p: 'Semua transaksi dikendalikan oleh saluran pembayaran terkawal seperti Billplz dan PayPal.'
          }
        ]
      },
      refund: {
        title: 'Dasar Bayaran Balik',
        p: 'Sekiranya anda tidak berpuas hati, dasar kami adalah seperti berikut:',
        points: [
          'Tiada bayaran balik selepas penggunaan fungsi AI melebihi had harian.',
          'Hantar emel ke kiduniapp@gmail.com dengan alasan yang sah.',
          'Proses bayaran balik mengambil masa 7-14 hari bekerja.'
        ]
      },
      cancellation: {
        title: 'Dasar Pembatalan',
        p: 'Anda boleh membatalkan langganan pada bila-bila masa:',
        points: [
          'Batal melalui bahagian Urus Langganan atau hubungi sokongan kami.',
          'Akses premium dikekalkan sehingga akhir kitaran pengebilan semasa.',
          'Pengguna percubaan (3 hari) harus batal 24 jam sebelum tamat tempoh.'
        ]
      }
    }
  };

  const t = content[lang];
  const pageData = t[type as keyof typeof t];

  const renderIcon = () => {
    switch (type) {
      case 'about': return <Info size={40} className="text-brand-coral" />;
      case 'contact': return <Mail size={40} className="text-brand-teal" />;
      case 'privacy': return <ShieldCheck size={40} className="text-emerald-500" />;
      case 'terms': return <FileText size={40} className="text-indigo-500" />;
      case 'refund': return <RefreshCcw size={40} className="text-amber-500" />;
      case 'cancellation': return <XCircle size={40} className="text-rose-500" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-4xl mx-auto px-6 py-12 pb-32"
    >
      <div className="flex items-center justify-between mb-12">
        <button onClick={onBack} className="p-3 bg-white rounded-2xl shadow-lg border-2 border-gray-100 hover:bg-gray-50 transition-all text-brand-ink">
          <ChevronLeft />
        </button>
        <button onClick={onHome} className="p-3 bg-white rounded-2xl shadow-lg border-2 border-gray-100 hover:bg-gray-50 transition-all text-brand-ink">
          <Home />
        </button>
      </div>

      <div className="flex flex-col items-center text-center mb-16">
        <div className="mb-6 p-6 bg-white rounded-[32px] shadow-xl border-4 border-white/50">
          {renderIcon()}
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-brand-ink mb-4">{(pageData as any).title}</h1>
        {(pageData as any).subtitle && <p className="text-xl text-brand-muted font-medium">{(pageData as any).subtitle}</p>}
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-[40px] p-8 md:p-12 shadow-2xl border-4 border-white/50 space-y-12">
        {type === 'about' ? (
          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-brand-coral">{(pageData as any).storyTitle}</h2>
              <p className="text-lg text-brand- ink/80 leading-relaxed">{(pageData as any).storyText}</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-brand-teal">{(pageData as any).missionTitle}</h2>
              <p className="text-lg text-brand-ink/80 leading-relaxed">{(pageData as any).missionText}</p>
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-amber-500">{(pageData as any).vibeTitle}</h2>
              <div className="grid gap-4">
                {(pageData as any).vibeItems.map((item: string, i: number) => (
                  <div key={i} className="flex items-center gap-4 bg-white/50 p-4 rounded-2xl border-2 border-amber-100 shadow-sm">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center font-black text-amber-600 text-sm">
                      {i + 1}
                    </div>
                    <span className="font-bold text-brand-ink/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : type === 'contact' ? (
          <div className="flex flex-col items-center gap-10">
            <div className="w-full max-w-xl">
              <div className="p-12 md:p-16 bg-brand-teal/5 rounded-[40px] border-4 border-brand-teal/10 flex flex-col items-center text-center gap-6 shadow-sm">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-brand-teal shadow-lg mb-2">
                  <Mail size={40} />
                </div>
                <h3 className="font-black text-2xl text-brand-ink">Email Support</h3>
                <a href={`mailto:${(pageData as any).email}`} className="text-2xl md:text-3xl font-black text-brand-teal hover:scale-105 transition-transform">{(pageData as any).email}</a>
                <p className="text-base font-bold text-gray-400">{(pageData as any).response}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {(pageData as any).p && (
              <p className="text-lg text-brand-ink/80 leading-relaxed font-bold">{(pageData as any).p}</p>
            )}
            
            {(pageData as any).sections && (pageData as any).sections.map((sec: any, i: number) => (
              <div key={i} className="space-y-3">
                <h2 className="text-2xl font-black text-indigo-600">{sec.h}</h2>
                <p className="text-lg text-brand-ink/70 leading-relaxed">{sec.p}</p>
              </div>
            ))}

            {(pageData as any).points && (
              <div className="space-y-4">
                {(pageData as any).points.map((pt: string, i: number) => (
                  <div key={i} className="flex gap-4 p-5 bg-white rounded-2xl border-2 border-indigo-50 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center font-black text-indigo-600 text-xs mt-1">
                      {i + 1}
                    </div>
                    <p className="font-bold text-brand-ink/80 leading-relaxed">{pt}</p>
                  </div>
                ))}
              </div>
            )}
            
            <div className="pt-8 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-400 font-bold mb-4">
                {lang === 'zh' ? '有疑问？联系我们：' : 'Any questions? Contact us at:'}
              </p>
              <a href="mailto:kiduniapp@gmail.com" className="px-8 py-3 bg-indigo-600 text-white rounded-full font-black hover:bg-indigo-700 transition-all shadow-lg inline-block">
                kiduniapp@gmail.com
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="mt-20 text-center text-gray-400 font-bold">
        <p className="mb-2">© 2026 KIDUNI - Malaysia</p>
        <p className="text-[10px] uppercase tracking-widest">Premium Trilingual AI Education for Kids</p>
      </div>
    </motion.div>
  );
};
