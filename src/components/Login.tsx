import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, User, Sparkles, ArrowRight, Eye, EyeOff, CheckCircle2, Globe } from 'lucide-react';
import { Language } from '../types';
import { Subscription } from './Subscription';
import { Checkout } from './Checkout';

interface LoginProps {
  onLogin: (username: string, isSubscribed?: boolean) => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

const translations = {
  zh: {
    title: '快乐学中文',
    subtitle: 'FUN CHINESE LEARNING',
    username: '用户名',
    password: '密码',
    rememberMe: '记住我',
    enterName: '输入您的用户名',
    startLearning: '开启学习之旅',
    error: '用户名或密码错误，请重试',
    langSync: '三语同步 ✨ 专属学习计划',
    passwordPlaceholder: '••••••',
    registerTitle: '购买订阅并创建账户',
    registerSubtitle: 'PURCHASE SUBSCRIPTION',
    registrationKey: '支付交易号',
    registerSuccess: '完成订购，激活成功！',
    backToLogin: '返回登录',
    noAccount: '还没有账号？点击购买订阅 ✦',
    hasAccount: '已有账号？返回登录 ✦',
    enterRegKey: '输入支付账单号',
    submitRegister: '立即购买',
    loginTab: '快速登录',
    registerTab: '学校注册',
    schoolRegKeyLabel: '学校/机构注册密匙',
    schoolRegKeyPlaceholder: '输入学校注册码 (例如: KIDUNI2026)',
    registrationSuccessText: '🎉 账号注册成功！请输入您注册的用户名和密码进行登录。',
    registerBtn: '立即注册并返回登录'
  },
  en: {
    title: 'Fun Chinese',
    subtitle: 'HAPPY LEARNING JOURNEY',
    username: 'Username',
    password: 'Password',
    rememberMe: 'Remember Me',
    enterName: 'Enter your username',
    startLearning: 'Start Learning',
    error: 'Invalid username or password, please try again',
    langSync: '3-Language Sync ✨ Personalized Plan',
    passwordPlaceholder: '••••••',
    registerTitle: 'Subscribe & Create Account',
    registerSubtitle: 'PURCHASE SUBSCRIPTION',
    registrationKey: 'Payment Invoice Reference',
    registerSuccess: 'Subscription activated successfully!',
    backToLogin: 'Back to Login',
    noAccount: "Don't have an account? Click to Subscribe ✦",
    hasAccount: 'Already have an account? Log In ✦',
    enterRegKey: 'Enter your payment ID',
    submitRegister: 'Subscribe Now',
    loginTab: 'Login',
    registerTab: 'School Access',
    schoolRegKeyLabel: 'School Registration Key',
    schoolRegKeyPlaceholder: 'Enter school key (e.g., KIDUNI2026)',
    registrationSuccessText: '🎉 Registration successful! Enter your username and password to log in.',
    registerBtn: 'Register Account'
  },
  ms: {
    title: 'Seronok Belajar',
    subtitle: 'BELAJAR MANDARIN MUDAH',
    username: 'Nama Pengguna',
    password: 'Kata Laluan',
    rememberMe: 'Ingat Saya',
    enterName: 'Masukkan nama pengguna anda',
    startLearning: 'Mula Belajar',
    error: 'Nama pengguna atau kata laluan salah, sila cuba lagi',
    langSync: 'Segerak 3-Bahasa ✨ Pelan Peribadi',
    passwordPlaceholder: '••••••',
    registerTitle: 'Beli Langganan & Daftar Akaun',
    registerSubtitle: 'PEMBELIAN LANGGANAN',
    registrationKey: 'Rujukan Transaksi Pembayaran',
    registerSuccess: 'Langganan berjaya diaktifkan!',
    backToLogin: 'Kembali ke Log Masuk',
    noAccount: 'Tiada akaun? Beli Pelan Langganan ✦',
    hasAccount: 'Sudah ada akaun? Log Masuk ✦',
    enterRegKey: 'Masukkan kunci pendaftaran sekolah',
    submitRegister: 'Beli Sekarang',
    loginTab: 'Log Masuk',
    registerTab: 'Kunci Sekolah',
    schoolRegKeyLabel: 'Kunci Pendaftaran Sekolah',
    schoolRegKeyPlaceholder: 'Masukkan kunci sekolah (cth: KIDUNI2026)',
    registrationSuccessText: '🎉 Pendaftaran berjaya! Sila log masuk dengan nama pengguna & kata laluan anda.',
    registerBtn: 'Daftar Akaun Sekarang'
  }
};

export const Login: React.FC<LoginProps> = ({ onLogin, lang, onLanguageChange }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Direct School Registration states
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [schoolRegKey, setSchoolRegKey] = useState('');

  // Secure Subscription Mode States
  const [loginStep, setLoginStep] = useState<'login' | 'subscription' | 'checkout'>('login');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const t = translations[lang];

  useEffect(() => {
    const savedUser = localStorage.getItem('fun_chinese_username');
    if (savedUser) {
      setUsername(savedUser);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    if (!username || !password) return;

    setIsLoading(true);
    
    try {
      // Submit login request
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (rememberMe) {
          localStorage.setItem('fun_chinese_username', username);
        } else {
          localStorage.removeItem('fun_chinese_username');
        }
        onLogin(username, !!data.isSubscribed);
      } else {
        setError(data.error || t.error);
      }
    } catch (err) {
      console.error('Auth operation connection error:', err);
      setError(lang === 'zh' ? '服务器连接失败，请稍后重试' : lang === 'ms' ? 'Ralat sambungan pelayan, sila cuba sebentar lagi' : 'Server connection failed, please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!username || !password || !schoolRegKey) {
      setError(lang === 'zh' ? '请填写所有栏目！' : lang === 'ms' ? 'Sila isi semua ruangan!' : 'Please fill in all fields!');
      return;
    }

    if (username.trim().length < 2) {
      setError(lang === 'zh' ? '用户名必须至少为 2 个字符' : lang === 'ms' ? 'Nama pengguna sekurang-kurangnya 2 aksara' : 'Username must be at least 2 characters');
      return;
    }

    if (password.trim().length < 6) {
      setError(lang === 'zh' ? '密码必须至少为 6 个字符' : lang === 'ms' ? 'Kata laluan sekurang-kurangnya 6 aksara' : 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
          registrationKey: schoolRegKey.trim()
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage(t.registrationSuccessText);
        setIsRegisterMode(false);
        setSchoolRegKey('');
      } else {
        setError(data.error || (lang === 'zh' ? '注册失败，请检查您的注册码。' : lang === 'ms' ? 'Pendaftaran gagal, sila periksa kunci sekolah.' : 'Registration failed, please check your school key.'));
      }
    } catch (err) {
      console.error('Registration connection error:', err);
      setError(lang === 'zh' ? '连接服务器失败' : lang === 'ms' ? 'Gagal menyambung ke pelayan' : 'Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  if (loginStep === 'subscription') {
    return (
      <Subscription 
        lang={lang}
        onLanguageChange={onLanguageChange}
        onHome={() => setLoginStep('login')}
        onClose={() => setLoginStep('login')}
        onNavigate={(view) => {
          if (view === 'login') setLoginStep('login');
        }}
        onSelectPlan={(plan) => {
          setSelectedPlan(plan);
          setLoginStep('checkout');
        }}
      />
    );
  }

  if (loginStep === 'checkout' && selectedPlan) {
    return (
      <Checkout 
        lang={lang}
        plan={selectedPlan}
        onBack={() => setLoginStep('subscription')}
        onSuccess={() => {
          setLoginStep('login');
          setSuccessMessage(lang === 'zh' ? '您的账单已成功创建！付款成功后，您即可立即登录。' : lang === 'ms' ? 'Bil anda sedia dimaklumkan! Anda boleh log masuk selepas pembayaran berjaya.' : 'Your invoice has been created! You can log in as soon as payment is successful.');
        }}
        onNavigate={(v) => {
          if (v === 'login') setLoginStep('login');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F5F2E8] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          x: [0, 50, 0],
          y: [0, -50, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-20 -left-20 w-64 h-64 bg-white/20 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1],
          rotate: [0, -90, 0],
          x: [0, -100, 0],
          y: [0, 100, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-20 -right-20 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-64 h-48 mb-0 flex items-center justify-center font-black text-sky-400"
          >
            <img 
              src="https://i.ibb.co/TM3WwYjQ/1000046067-removebg-preview.png" 
              alt="KIDUNI" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <motion.h1 
            key={lang + 'title'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-sky-400 drop-shadow-sm text-center -mt-8"
          >
            {t.title}
          </motion.h1>
          <motion.p 
            key={lang + 'sub'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sky-400 font-black tracking-widest text-2xl md:text-3xl uppercase mt-2 text-center"
          >
            {t.subtitle}
          </motion.p>
        </div>

        {/* Login Card */}
        <div className="bg-[#F5F2E8]/95 backdrop-blur-xl p-6 md:p-8 rounded-[40px] shadow-2xl border-4 border-white">
          {/* Language Switcher */}
          <div className="flex justify-center gap-2 mb-6 p-1 bg-emerald-50 rounded-2xl border-2 border-emerald-100 shadow-inner">
            {[
              { id: 'zh', label: '中文' },
              { id: 'en', label: 'EN' },
              { id: 'ms', label: 'BM' }
            ].map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => onLanguageChange(l.id as Language)}
                className={`flex-1 py-1.5 px-3 rounded-xl font-black text-xs transition-all ${
                  lang === l.id 
                  ? 'bg-emerald-500 text-white shadow-[0_4px_0_rgb(5,150,105)] scale-105 active:translate-y-1 active:shadow-none' 
                  : 'text-emerald-400 hover:text-emerald-600'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Mode Switcher Tabs for Login and Student/School Registration */}
          <div className="flex bg-sky-50 p-1 rounded-2xl border-2 border-sky-100 shadow-inner mb-6">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(false);
                setError('');
              }}
              className={`flex-1 py-2 rounded-xl font-black text-xs transition-all ${
                !isRegisterMode 
                ? 'bg-sky-500 text-white shadow-[0_4px_0_rgb(14,165,233)] scale-105 active:translate-y-1 active:shadow-none' 
                : 'text-sky-400 hover:text-sky-600'
              }`}
            >
              {t.loginTab}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(true);
                setError('');
              }}
              className={`flex-1 py-2 rounded-xl font-black text-xs transition-all ${
                isRegisterMode 
                ? 'bg-sky-500 text-white shadow-[0_4px_0_rgb(14,165,233)] scale-105 active:translate-y-1 active:shadow-none' 
                : 'text-sky-400 hover:text-sky-600'
              }`}
            >
              {t.registerTab}
            </button>
          </div>

          {/* Success Notification Alert */}
          {successMessage && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-emerald-100 border-2 border-emerald-200 text-emerald-800 p-4 rounded-2xl mb-5 text-sm font-black text-center flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{successMessage}</span>
            </motion.div>
          )}

          <form onSubmit={isRegisterMode ? handleRegisterSubmit : handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label className="block text-sky-800 text-[10px] font-black uppercase mb-1 ml-4 text-left">{t.username}</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    onKeyUp={(e) => e.stopPropagation()}
                    onKeyPress={(e) => e.stopPropagation()}
                    placeholder={t.enterName}
                    className="w-full pl-12 pr-6 py-4 bg-sky-50 border-2 border-transparent focus:border-sky-400 rounded-2xl outline-none font-bold text-sky-900 transition-all placeholder:text-sky-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sky-800 text-[10px] font-black uppercase mb-1 ml-4 text-left">{t.password}</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400 z-10" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    onKeyUp={(e) => e.stopPropagation()}
                    onKeyPress={(e) => e.stopPropagation()}
                    placeholder={t.passwordPlaceholder}
                    autoComplete="current-password"
                    className={`w-full pl-12 pr-12 py-4 bg-sky-50 border-2 rounded-2xl outline-none font-bold text-sky-900 transition-all placeholder:text-sky-300 ${error ? 'border-red-400 bg-red-50' : 'border-transparent focus:border-sky-400'}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword(!showPassword);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sky-400 hover:text-sky-600 transition-colors z-20 p-1"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {isRegisterMode && (
                <div>
                  <label className="block text-sky-800 text-[10px] font-black uppercase mb-1 ml-4 text-left">{t.schoolRegKeyLabel}</label>
                  <div className="relative">
                    <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500 z-10" />
                    <input
                      type="text"
                      value={schoolRegKey}
                      onChange={(e) => setSchoolRegKey(e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()}
                      onKeyUp={(e) => e.stopPropagation()}
                      onKeyPress={(e) => e.stopPropagation()}
                      placeholder={t.schoolRegKeyPlaceholder}
                      className="w-full pl-12 pr-6 py-4 bg-emerald-50 border-2 border-transparent focus:border-emerald-400 rounded-2xl outline-none font-bold text-emerald-900 transition-all placeholder:text-emerald-300"
                      required
                    />
                  </div>
                </div>
              )}

              {error && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-red-500 text-[10px] font-black mt-2 ml-4 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-red-500" /> {error}
                </motion.p>
              )}

              {!isRegisterMode && (
                <div className="flex items-center justify-between px-2">
                  <button
                    type="button"
                    onClick={() => setRememberMe(!rememberMe)}
                    className="flex items-center gap-2 text-sky-600 hover:text-sky-800 transition-colors group"
                  >
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${rememberMe ? 'bg-sky-500 border-sky-500 text-white' : 'border-sky-200 bg-sky-50 group-hover:border-sky-400'}`}>
                      {rememberMe && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <span className="text-sm font-black">{t.rememberMe}</span>
                  </button>
                </div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98, translateY: 0 }}
              disabled={isLoading}
              className="w-full text-white py-6 rounded-[30px] font-black text-2xl shadow-2xl transition-all btn-3d-coral active:translate-y-2 flex items-center justify-center gap-3 disabled:opacity-50 text-sharp"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6" />
                </motion.div>
              ) : (
                <>
                  {isRegisterMode ? t.registerBtn : t.startLearning} <ArrowRight className="w-6 h-6" />
                </>
              )}
            </motion.button>
          </form>

          {/* Registration Mode Switcher */}
          <div className="mt-6 text-center border-t border-sky-100 pt-4">
            <button
              type="button"
              onClick={() => {
                setLoginStep('subscription');
                setError('');
                setSuccessMessage('');
              }}
              className="text-emerald-500 hover:text-emerald-700 font-black text-xs cursor-pointer underline transition-colors"
            >
              {t.noAccount}
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sky-400 text-[10px] font-bold font-mono tracking-tight flex items-center justify-center gap-1">
              <Globe className="w-3 h-3" /> {t.langSync}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
