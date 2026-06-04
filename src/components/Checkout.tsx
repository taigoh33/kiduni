import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  Wallet, 
  Smartphone, 
  ShieldCheck, 
  ArrowLeft, 
  ChevronRight, 
  Check, 
  Lock, 
  Zap,
  Info,
  Globe,
  Sliders
} from 'lucide-react';
import { Language } from '../types';

interface CheckoutProps {
  lang: Language;
  onBack: () => void;
  plan: {
    id: string;
    name: string;
    price: string;
    period: string;
  };
  onSuccess: (planId: string) => void;
  onNavigate: (view: any) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ lang, onBack, plan, onSuccess, onNavigate }) => {
  const [paymentMethod, setPaymentMethod] = useState<'fpx' | 'tng' | 'grab' | null>(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  // Dynamic credentials to let users key in variables directly to continue as requested
  const [billplzApiKey, setBillplzApiKey] = useState(() => localStorage.getItem('fun_chinese_billplz_api_key') || '');
  const [billplzCollectionId, setBillplzCollectionId] = useState(() => localStorage.getItem('fun_chinese_billplz_collection_id') || '');
  const [showDevSettings, setShowDevSettings] = useState(false);

  const updateApiKey = (val: string) => {
    setBillplzApiKey(val);
    localStorage.setItem('fun_chinese_billplz_api_key', val);
  };

  const updateCollectionId = (val: string) => {
    setBillplzCollectionId(val);
    localStorage.setItem('fun_chinese_billplz_collection_id', val);
  };

  const t = {
    zh: {
      orderSummary: '订单详情',
      paymentMethod: '选择支付方式',
      fpx: '马来西亚网银转账 (FPX)',
      tng: 'TNG 电子钱包',
      grab: 'GrabPay 快捷支付',
      secure: '安全加密支付',
      emailLabel: '电子邮箱 (用于接收收据)',
      emailPlaceholder: '您的常用邮箱',
      payNow: '立即支付',
      processing: '正在处理...',
      cancelAnytime: '随时取消 · 安全保障',
      back: '返回修改',
      total: '总计',
      maintenance: '系统提升中(目前不可用)',
      intlNotice: '海外用户？请咨询我们的客服以获取国际信用卡支付方式。',
      setupAccount: '设置登录账户 (付款成功后用于登录)',
      desiredUsername: '设置用户名 (登录账号名称)',
      usernamePlaceholder: '例如: yourname',
      desiredPassword: '设置密码 (至少 6 位密码)',
      passwordPlaceholder: '输入专属密码',
    },
    en: {
      orderSummary: 'Order Summary',
      paymentMethod: 'Select Payment Method',
      fpx: 'Malaysian Online Banking (FPX)',
      tng: 'TNG eWallet',
      grab: 'GrabPay',
      secure: 'Encrypted Secure Payment',
      emailLabel: 'Email Address (for receipt)',
      emailPlaceholder: 'your@email.com',
      payNow: 'Pay Now',
      processing: 'Processing...',
      cancelAnytime: 'Cancel anytime · Pure security',
      back: 'Go Back',
      total: 'Total Amount',
      maintenance: 'System Upgrading (Unavailable)',
      intlNotice: 'Overseas buyer? Contact us for international card payment options.',
      setupAccount: 'Create Your Login Account (Used to login after paying)',
      desiredUsername: 'Desired Username (Used to login)',
      usernamePlaceholder: 'e.g., yourname',
      desiredPassword: 'Desired Password (Min 6 characters)',
      passwordPlaceholder: 'Enter a strong password',
    },
    ms: {
      orderSummary: 'Ringkasan Pesanan',
      paymentMethod: 'Pilih Kaedah Pembayaran',
      fpx: 'Perbankan Internet M\'sia (FPX)',
      tng: 'TNG eWallet',
      grab: 'GrabPay',
      secure: 'Pembayaran Selamat & Sulit',
      emailLabel: 'Alamat Emel (untuk resit)',
      emailPlaceholder: 'emel@anda.com',
      payNow: 'Bayar Sekarang',
      processing: 'Sedang diproses...',
      cancelAnytime: 'Batal bila-bila masa · Dijamin selamat',
      back: 'Kembali',
      total: 'Jumlah Keseluruhan',
      maintenance: 'Penambahbaikan Sistem (Tidak Tersedia)',
      intlNotice: 'Pembeli luar negara? Hubungi kami untuk pilihan kad antarabangsa.',
      setupAccount: 'Daftar Akaun Log Masuk (Digunakan untuk log masuk selepas bayar)',
      desiredUsername: 'Nama Pengguna Pilihan (Untuk log masuk)',
      usernamePlaceholder: 'cth: namanada',
      desiredPassword: 'Kata Laluan Pilihan (Min 6 aksara)',
      passwordPlaceholder: 'Masukkan kata laluan bertaraf tinggi',
    }
  }[lang];

  const handlePayment = async () => {
    if ((!paymentMethod && plan.price !== '0') || !email) return;

    if (!username || username.trim().length < 2) {
      setError(lang === 'zh' ? '用户名必须至少为 2 个字符' : lang === 'ms' ? 'Nama pengguna sekurang-kurangnya 2 aksara' : 'Username must be at least 2 characters');
      return;
    }

    if (!password || password.trim().length < 6) {
      setError(lang === 'zh' ? '密码必须至少为 6 个字符' : lang === 'ms' ? 'Kata laluan sekurang-kurangnya 6 aksara' : 'Password must be at least 6 characters');
      return;
    }

    setIsProcessing(true);
    setError(null);

    // Skip backend call for free trial
    if (plan.id === 'trial' || plan.price === '0') {
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsProcessing(false);
      onSuccess(plan.id);
      return;
    }

    try {
      const response = await fetch('/api/checkout/create-bill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          planName: plan.name,
          amount: plan.price,
          email: email,
          phone: phone,
          paymentMethod: paymentMethod,
          username: username.trim(),
          password: password.trim(),
          billplzApiKey: billplzApiKey.trim() || undefined,
          billplzCollectionId: billplzCollectionId.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate checkout bill');
      }

      if (data.redirectUrl) {
        // Banks and payment gateways often block being loaded in iframes.
        // Opening in a new window/tab is the most reliable way.
        const win = window.open(data.redirectUrl, '_blank');
        
        // Check if popup was blocked
        if (!win || win.closed || typeof win.closed === 'undefined') {
          setPaymentUrl(data.redirectUrl);
          setError('Your browser blocked the payment window. Please click the button below to open it manually.');
        } else {
          // Success
          setIsProcessing(false);
          // Optional: You could show a "Waiting for payment..." message here
        }
      } else {
        const errorMsg = data.error || 'Failed to create bill';
        const detailMsg = data.message || 'Check your settings';
        setError(`${errorMsg}: ${detailMsg}. Please ensure your API Key and Collection ID are set correctly in the Settings menu.`);
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error('Payment failed:', err);
      setError(err.message || 'Connection to payment gateway failed. Please check your internet connection and try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex flex-col items-center justify-start p-0 md:p-8 overflow-y-auto bg-brand-ink/90 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-none md:rounded-[40px] shadow-2xl overflow-visible border-0 md:border-8 border-white flex flex-col relative mt-0 md:mt-12 mb-0 md:mb-12  min-h-screen md:min-h-0"
      >
        {/* Header Decor */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 z-0" />
        
        <div className="relative z-10 p-8">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={onBack}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all border border-white/20 backdrop-blur-md"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 backdrop-blur-md">
              <ShieldCheck className="text-emerald-300 w-5 h-5" />
              <span className="text-white text-xs font-black uppercase tracking-widest">{t.secure}</span>
            </div>
          </div>

            <div className="bg-white rounded-[32px] p-8 shadow-xl border-2 border-gray-50 mb-8 relative overflow-hidden">
              {/* Optional: Add a Sandbox badge if needed, but we don't know the state here easily without an API check */}
              <h3 className="text-xs font-black text-indigo-500 uppercase tracking-[0.2em] mb-4">{t.orderSummary}</h3>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-brand-ink mb-1">{plan.name}</h2>
                <div className="flex items-center gap-2 text-indigo-600">
                  <Zap size={16} fill="currentColor" />
                  <span className="font-bold text-sm tracking-tight">Unlimited KIDUNI Access</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 font-bold text-xs uppercase mb-1">{t.total}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-brand-ink font-black text-sm">RM</span>
                  <span className="text-4xl font-black text-brand-ink">{plan.price}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-100 rounded-2xl text-red-600 text-sm font-bold leading-relaxed">
                {error}
                {paymentUrl && (
                  <a 
                    href={paymentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-4 block w-full py-4 bg-red-600 text-white rounded-xl text-center hover:bg-red-700 transition-colors"
                  >
                    Open Payment Page (RM{plan.price})
                  </a>
                )}
              </div>
            )}
            <div className="p-6 bg-indigo-50/50 rounded-3xl border-2 border-indigo-100/50 space-y-4">
              <h4 className="text-sm font-black text-indigo-900 tracking-wide uppercase flex items-center gap-2">
                <Lock size={16} className="text-indigo-600" />
                {t.setupAccount}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-indigo-800 mb-2 ml-1">
                    {t.desiredUsername}
                  </label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    onKeyUp={(e) => e.stopPropagation()}
                    onKeyPress={(e) => e.stopPropagation()}
                    placeholder={t.usernamePlaceholder}
                    className="w-full px-5 py-3 rounded-2xl bg-white border-2 border-indigo-100 focus:border-indigo-400 focus:ring-0 transition-all font-bold text-brand-ink placeholder:text-gray-350 shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-indigo-800 mb-2 ml-1">
                    {t.desiredPassword}
                  </label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    onKeyUp={(e) => e.stopPropagation()}
                    onKeyPress={(e) => e.stopPropagation()}
                    placeholder={t.passwordPlaceholder}
                    className="w-full px-5 py-3 rounded-2xl bg-white border-2 border-indigo-100 focus:border-indigo-400 focus:ring-0 transition-all font-bold text-brand-ink placeholder:text-gray-350 shadow-sm"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-black text-brand-ink mb-3 ml-2 flex items-center gap-2">
                  <Info size={16} className="text-indigo-500" />
                  {t.emailLabel}
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  onKeyUp={(e) => e.stopPropagation()}
                  onKeyPress={(e) => e.stopPropagation()}
                  placeholder={t.emailPlaceholder}
                  className="w-full px-6 py-4 rounded-[24px] bg-gray-50 border-2 border-gray-100 focus:border-indigo-400 focus:ring-0 transition-all font-bold text-brand-ink placeholder:text-gray-350 shadow-inner"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-black text-brand-ink mb-3 ml-2 flex items-center gap-2">
                  <Smartphone size={16} className="text-indigo-500" />
                  {lang === 'zh' ? '电话号码' : lang === 'ms' ? 'No. Telefon' : 'Phone Number'}
                </label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  onKeyUp={(e) => e.stopPropagation()}
                  onKeyPress={(e) => e.stopPropagation()}
                  placeholder="0123456789"
                  className="w-full px-6 py-4 rounded-[24px] bg-gray-50 border-2 border-gray-100 focus:border-indigo-400 focus:ring-0 transition-all font-bold text-brand-ink placeholder:text-gray-300 shadow-inner"
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black text-brand-ink mb-4 ml-2">{t.paymentMethod}</h3>
              <div className="grid gap-3">
                {[
                  { id: 'fpx', name: t.fpx, icon: <div className="flex flex-col items-center gap-1"><p className="text-[10px] font-black text-gray-400 leading-none mb-1">VIA MALAYSIA</p><img src="https://i.ibb.co/kVx1L6sD/Screenshot-20260515-160152-Gallery.jpg" alt="Visa Mastercard" className="w-32 h-12 object-contain" referrerPolicy="no-referrer" /></div>, desc: lang === 'zh' ? '马来西亚本地银行' : lang === 'ms' ? 'Bank Tempatan Malaysia' : 'Malaysian Local Banks', disabled: false },
                  { id: 'tng', name: t.tng, icon: <img src="https://i.ibb.co/rKBXrYNN/tng-digital-sdn-bhd-largex5-logo.jpg" alt="TNG Logo" className="w-10 h-10 object-contain mx-auto" referrerPolicy="no-referrer" />, desc: 'TNG eWallet QR', disabled: true },
                  { id: 'grab', name: t.grab, icon: <img src="https://i.ibb.co/y3N06pv/payment-gateway-grabpay.png" alt="GrabPay Logo" className="w-12 h-12 object-contain mx-auto" referrerPolicy="no-referrer" />, desc: 'GrabPay QR Scan', disabled: true },
                ].map((method) => (
                  <React.Fragment key={method.id}>
                    <button
                      type="button"
                      disabled={method.disabled}
                      onClick={() => !method.disabled && setPaymentMethod(method.id as any)}
                      className={`flex items-center gap-4 p-4 md:p-6 rounded-[28px] border-4 transition-all text-left group relative ${
                        method.disabled 
                          ? 'opacity-60 grayscale cursor-not-allowed border-gray-100' 
                          : paymentMethod === method.id 
                            ? 'border-indigo-500 bg-indigo-50/50 shadow-lg' 
                            : 'border-gray-50 bg-gray-50/50 hover:border-gray-200'
                      }`}
                    >
                      <div className={`p-4 rounded-[20px] shadow-inner transition-all flex items-center justify-center ${
                        paymentMethod === method.id ? 'bg-white scale-110' : 'bg-gray-100'
                      }`}>
                        {method.id === 'fpx' || method.id === 'tng' || method.id === 'grab' ? (
                          method.id === 'fpx' ? method.icon : <div className="flex items-center justify-center">{method.icon}</div>
                        ) : React.cloneElement(method.icon as React.ReactElement, { size: 36 })}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`font-black text-lg ${paymentMethod === method.id ? 'text-indigo-900' : 'text-brand-ink'}`}>
                            {method.name}
                          </p>
                          {method.disabled && (
                            <span className="text-[9px] font-black bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                              {t.maintenance}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-xs font-bold">{method.desc}</p>
                      </div>
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        method.disabled
                          ? 'border-gray-100'
                          : paymentMethod === method.id 
                            ? 'bg-indigo-500 border-indigo-500 text-white scale-110' 
                            : 'border-gray-200'
                      }`}>
                        {paymentMethod === method.id && <Check size={16} />}
                      </div>
                    </button>
                  </React.Fragment>
                ))}
              </div>

              {/* International Notice - Temporarily disabled as per user request
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = 'mailto:socialmediaplus88@gmail.com?subject=International Payment Inquiry for Little Artist Heart App'}
                className="w-full mt-8 p-6 bg-blue-50/50 rounded-[32px] border-4 border-blue-100 flex items-start gap-4 shadow-sm hover:bg-blue-100/50 transition-all text-left group/intl"
              >
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-inner group-hover/intl:scale-110 transition-transform">
                  <Globe size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-blue-900/60 uppercase tracking-widest mb-1">International Buyers</p>
                    <div className="flex items-center gap-1 text-blue-400">
                      <span className="text-[10px] font-black uppercase">{lang === 'zh' ? '点击联系' : lang === 'ms' ? 'Klik Hubungi' : 'Click to Contact'}</span>
                      <Zap size={10} fill="currentColor" />
                    </div>
                  </div>
                  <p className="text-sm font-bold text-blue-700 leading-relaxed italic">
                    {t.intlNotice}
                  </p>
                </div>
              </motion.button>
              */}
            </div>

            {paymentMethod && (
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3">
                <Info className="text-amber-500 shrink-0" size={18} />
                <p className="text-amber-800 text-xs font-medium italic">
                  Note: You will be redirected to the secure Billplz payment gateway to complete your transaction via {paymentMethod === 'fpx' ? 'FPX Banking' : paymentMethod === 'tng' ? 'TNG eWallet' : 'GrabPay'}.
                </p>
              </div>
            )}

            {/* Custom environment variables setup requested by the user */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-[28px] space-y-3">
              <button 
                type="button"
                onClick={() => setShowDevSettings(!showDevSettings)}
                className="w-full flex items-center justify-between text-left text-xs font-black text-slate-500 tracking-wider hover:text-indigo-600 transition-colors uppercase"
              >
                <span className="flex items-center gap-2">
                  <Sliders size={14} />
                  {lang === 'zh' ? '🔑 键盘输入环境变量 / 设置' : lang === 'ms' ? '🔑 Masukkan Pembolehubah Persekitaran' : '🔑 Enter Environment Variables'}
                </span>
                <span className="text-[10px] font-bold bg-slate-200/50 text-slate-600 px-2.5 py-1 rounded-full">
                  {showDevSettings ? (lang === 'zh' ? '收起' : lang === 'ms' ? 'Sembunyi' : 'Hide') : (lang === 'zh' ? '展开输入' : lang === 'ms' ? 'Papar' : 'Expand')}
                </span>
              </button>

              {showDevSettings && (
                <div className="space-y-3 pt-2.5 border-t border-slate-200/50">
                  <p className="text-[11px] text-slate-500 font-bold leading-normal">
                    {lang === 'zh' 
                      ? '您可以直接在下方输入或修改您的 Billplz integration credentials。系统在发送支付请求时将自动应用这些账户对应的环境变量。' 
                      : lang === 'ms' 
                        ? 'Anda boleh memasukkan atau menukar kelayakan integrasi Billplz anda secara langsung di bawah. Sistem akan menggunakan parameter ini semasa transaksi.' 
                        : 'If you want to key in or change Billplz integration environment credentials, enter them below. The billing system will apply them at runtime.'}
                  </p>
                  <div>
                    <label className="block text-[10px] font-black text-slate-600 uppercase mb-1 ml-1">
                      BILLPLZ_API_KEY
                    </label>
                    <input 
                      type="text" 
                      value={billplzApiKey}
                      onChange={(e) => updateApiKey(e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()}
                      onKeyUp={(e) => e.stopPropagation()}
                      onKeyPress={(e) => e.stopPropagation()}
                      placeholder="e.g., d5404780-ecdf-4fc3-a75d-3522ba542475"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-250 focus:border-indigo-400 focus:ring-0 transition-all font-mono text-xs text-slate-800 placeholder:text-gray-300 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-600 uppercase mb-1 ml-1">
                      BILLPLZ_COLLECTION_ID
                    </label>
                    <input 
                      type="text" 
                      value={billplzCollectionId}
                      onChange={(e) => updateCollectionId(e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()}
                      onKeyUp={(e) => e.stopPropagation()}
                      onKeyPress={(e) => e.stopPropagation()}
                      placeholder="e.g., z8xpytca"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-250 focus:border-indigo-400 focus:ring-0 transition-all font-mono text-xs text-slate-800 placeholder:text-gray-300 shadow-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              disabled={(!paymentMethod && plan.price !== '0') || !email || isProcessing}
              onClick={handlePayment}
              className={`w-full py-6 rounded-[32px] font-black text-2xl shadow-xl transition-all relative overflow-hidden flex items-center justify-center gap-4 ${
                (!paymentMethod && plan.price !== '0') || !email || isProcessing
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:scale-[1.02] active:scale-[0.98] hover:shadow-2xl shadow-emerald-200'
              }`}
            >
              {isProcessing && (
                <div className="absolute inset-0 bg-emerald-600 z-10 flex items-center justify-center gap-4">
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.processing}</span>
                </div>
              )}
              {plan.price === '0' ? <Zap size={24} className="text-yellow-400" /> : <Lock size={24} />}
              <span>{plan.price === '0' ? (lang === 'zh' ? '开启免费试用' : lang === 'ms' ? 'Aktifkan Cubaan Percuma' : 'Activate Free Trial') : t.payNow}</span>
            </button>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-50 rounded-full border border-emerald-100 mb-4 animate-pulse">
              <Check className="text-emerald-500 w-5 h-5" />
              <span className="text-emerald-700 text-sm font-black tracking-tight">{t.cancelAnytime}</span>
            </div>
            
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] leading-loose max-w-[280px] mx-auto">
              Your security is our priority. Transactions are protected by bank-level encryption.
            </p>
          </div>
        </div>
        <div className="w-full bg-white mt-8 md:mt-0">
           {null}
        </div>
      </motion.div>
    </div>
  );
};
