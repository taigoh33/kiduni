import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldAlert, CheckCircle2, KeyRound, Sparkles, RefreshCw, User } from 'lucide-react';
import { Language } from '../types';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  lang: Language;
  onUsernameChanged?: (newUsername: string) => void;
}

const translations = {
  zh: {
    title: '账户设置 ✦',
    subtitle: '更新您的登录凭证与账户信息',
    tabUsername: '修改用户名 👤',
    tabPassword: '修改密码 🔑',
    currentPass: '验证当前密码',
    currentPassPlaceholder: '输入您现有的密码以确认身份',
    newUsername: '新用户名',
    newUsernamePlaceholder: '输入新用户名 (至少 2 位)',
    newPass: '新密码',
    newPassPlaceholder: '输入至少 6 位的新密码',
    confirmPass: '确认新密码',
    confirmPassPlaceholder: '再次输入新密码',
    submitUsername: '更新用户名 ✨',
    submitPassword: '更新密码 ✨',
    cancel: '取消',
    errorRequired: '请完整填好所有栏目！',
    errorMinLengthPass: '新密码长度至少需要 6 个字符！',
    errorMinLengthUser: '新用户名至少需要 2 个字符！',
    errorMismatch: '两次输入的新密码不一致，请检查！',
    successMsgPass: '🎉 密码修改成功！下次登录请使用新密码。',
    successMsgUser: '🎉 用户名修改成功！下次登录请使用新用户名：',
    updating: '正在更新中...'
  },
  en: {
    title: 'Account Settings ✦',
    subtitle: 'Update your login credentials & account details',
    tabUsername: 'Change Username 👤',
    tabPassword: 'Change Password 🔑',
    currentPass: 'Verify Current Password',
    currentPassPlaceholder: 'Type your current password to confirm access',
    newUsername: 'New Username',
    newUsernamePlaceholder: 'Enter new username (min 2 chars)',
    newPass: 'New Password',
    newPassPlaceholder: 'Enter safe password (min 6 chars)',
    confirmPass: 'Confirm New Password',
    confirmPassPlaceholder: 'Type new password again',
    submitUsername: 'Update Username ✨',
    submitPassword: 'Update Password ✨',
    cancel: 'Cancel',
    errorRequired: 'Please fill in all fields!',
    errorMinLengthPass: 'New password must be at least 6 characters!',
    errorMinLengthUser: 'New username must be at least 2 characters!',
    errorMismatch: "Confirm password doesn't match new password!",
    successMsgPass: '🎉 Password changed successfully! Use your new password the next time you log in.',
    successMsgUser: '🎉 Username changed successfully! Log in next time with your new username: ',
    updating: 'Updating...'
  },
  ms: {
    title: 'Tetapan Akaun ✦',
    subtitle: 'Kemas kini maklumat log masuk & akaun anda',
    tabUsername: 'Tukar Nama Pengguna 👤',
    tabPassword: 'Tukar Kata Laluan 🔑',
    currentPass: 'Sahkan Kata Laluan Semasa',
    currentPassPlaceholder: 'Masukkan kata laluan semasa untuk pengesahan',
    newUsername: 'Nama Pengguna Baharu',
    newUsernamePlaceholder: 'Masukkan nama pengguna (min 2 aksara)',
    newPass: 'Kata Laluan Baharu',
    newPassPlaceholder: 'Masukkan kata laluan baharu (min 6 aksara)',
    confirmPass: 'Sahkan Kata Laluan Baharu',
    confirmPassPlaceholder: 'Masukkan kata laluan baharu sekali lagi',
    submitUsername: 'Kemas Kini Nama 👤',
    submitPassword: 'Kemas Kini Kata Laluan 🔑',
    cancel: 'Batal',
    errorRequired: 'Sila isi semua butiran yang diperlukan!',
    errorMinLengthPass: 'Kata laluan baharu sekurang-kurangnya 6 aksara!',
    errorMinLengthUser: 'Nama pengguna baharu sekurang-kurangnya 2 aksara!',
    errorMismatch: 'Sahan kata laluan tidak sepadan dengan kata laluan baharu!',
    successMsgPass: '🎉 Kata laluan berjaya ditukar! Sila gunakan kata laluan baharu untuk log masuk seterusnya.',
    successMsgUser: '🎉 Nama pengguna berjaya ditukar! Gunakan nama pengguna baharu untuk pendaftaran/log masuk seterusnya: ',
    updating: 'Mengemas kini...'
  }
};

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  username,
  lang,
  onUsernameChanged
}) => {
  const [activeTab, setActiveTab] = useState<'username' | 'password'>('username');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsernameInput, setNewUsernameInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const t = translations[lang] || translations.en;

  if (!isOpen) return null;

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newUsernameInput.trim()) {
      setError(t.errorRequired);
      return;
    }

    if (newUsernameInput.trim().length < 2) {
      setError(t.errorMinLengthUser);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/change-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          currentPassword: currentPassword.trim(),
          newUsername: newUsernameInput.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const resolvedName = data.username || newUsernameInput.trim();
        setSuccess(`${t.successMsgUser} "${resolvedName}"`);
        setCurrentPassword('');
        setNewUsernameInput('');
        
        // Notify parent about state change so headers, localStorage, etc. sync
        if (onUsernameChanged) {
          onUsernameChanged(resolvedName);
        }

        setTimeout(() => {
          onClose();
          setSuccess('');
        }, 3500);
      } else {
        setError(data.error || 'Failed to update username');
      }
    } catch (err) {
      console.error('Username change error:', err);
      setError('Connection failed. Please check internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError(t.errorRequired);
      return;
    }

    if (newPassword.trim().length < 6) {
      setError(t.errorMinLengthPass);
      return;
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      setError(t.errorMismatch);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          currentPassword: currentPassword.trim(),
          newPassword: newPassword.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(t.successMsgPass);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          onClose();
          setSuccess('');
        }, 3500);
      } else {
        setError(data.error || 'Failed to update password');
      }
    } catch (err) {
      console.error('Password change error:', err);
      setError('Connection failed. Please check internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-[#F5F2E8] border-4 border-white rounded-[40px] shadow-2xl overflow-hidden p-6 md:p-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white hover:bg-neutral-100 rounded-full flex items-center justify-center shadow-lg border-2 border-neutral-100 transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>

          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 border-2 border-sky-200 text-sky-500 mb-3 shadow-inner">
              {activeTab === 'username' ? (
                <User className="w-8 h-8" />
              ) : (
                <KeyRound className="w-8 h-8" />
              )}
            </div>
            <h3 className="text-2xl font-black text-sky-900 tracking-tight">{t.title}</h3>
            <p className="text-xs font-bold text-sky-600 mt-0.5">{t.subtitle}</p>
          </div>

          {/* Navigation Tabs */}
          {!success && (
            <div className="flex gap-2 p-1.5 bg-sky-900/10 rounded-2xl mb-5">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('username');
                  setError('');
                }}
                className={`flex-1 py-2 px-3 rounded-xl font-black text-xs transition-all ${
                  activeTab === 'username'
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'text-sky-800 hover:bg-sky-900/5'
                }`}
              >
                {t.tabUsername}
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('password');
                  setError('');
                }}
                className={`flex-1 py-2 px-3 rounded-xl font-black text-xs transition-all ${
                  activeTab === 'password'
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'text-sky-800 hover:bg-sky-900/5'
                }`}
              >
                {t.tabPassword}
              </button>
            </div>
          )}

          {success ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-50 border-2 border-emerald-200 text-emerald-800 p-6 rounded-3xl text-center space-y-3"
            >
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <p className="font-extrabold text-sm">{success}</p>
            </motion.div>
          ) : activeTab === 'username' ? (
            /* USERNAME CHANGE FORM */
            <form onSubmit={handleUsernameSubmit} className="space-y-4">
              <div>
                <label className="block text-sky-800 text-[10px] font-black uppercase mb-1 ml-4 text-left">
                  {t.newUsername}
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400 z-10" />
                  <input
                    type="text"
                    value={newUsernameInput}
                    onChange={(e) => setNewUsernameInput(e.target.value)}
                    placeholder={t.newUsernamePlaceholder}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-transparent focus:border-sky-400 rounded-2xl outline-none font-bold text-sky-950 transition-all placeholder:text-neutral-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sky-800 text-[10px] font-black uppercase mb-1 ml-4 text-left">
                  {t.currentPass}
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 z-10" />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder={t.currentPassPlaceholder}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-transparent focus:border-emerald-400 rounded-2xl outline-none font-bold text-sky-950 transition-all placeholder:text-neutral-300"
                    required
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-xl text-red-600 font-extrabold text-xs text-left"
                >
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 bg-white hover:bg-neutral-100 border-2 border-neutral-200 text-neutral-600 rounded-2xl font-black text-xs transition-transform active:scale-95"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-xs shadow-[0_4px_0_rgb(16,185,129)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:bg-neutral-400"
                >
                  {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                  {isLoading ? t.updating : t.submitUsername}
                </button>
              </div>
            </form>
          ) : (
            /* PASSWORD CHANGE FORM */
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sky-800 text-[10px] font-black uppercase mb-1 ml-4 text-left">
                  {t.currentPass}
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400 z-10" />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder={t.currentPassPlaceholder}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-transparent focus:border-sky-400 rounded-2xl outline-none font-bold text-sky-950 transition-all placeholder:text-neutral-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sky-800 text-[10px] font-black uppercase mb-1 ml-4 text-left">
                  {t.newPass}
                </label>
                <div className="relative">
                  <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 z-10" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={t.newPassPlaceholder}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-transparent focus:border-emerald-400 rounded-2xl outline-none font-bold text-sky-950 transition-all placeholder:text-neutral-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sky-800 text-[10px] font-black uppercase mb-1 ml-4 text-left">
                  {t.confirmPass}
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400 z-10" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t.confirmPassPlaceholder}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-transparent focus:border-sky-400 rounded-2xl outline-none font-bold text-sky-950 transition-all placeholder:text-neutral-300"
                    required
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-xl text-red-600 font-extrabold text-xs text-left"
                >
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 bg-white hover:bg-neutral-100 border-2 border-neutral-200 text-neutral-600 rounded-2xl font-black text-xs transition-transform active:scale-95"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-xs shadow-[0_4px_0_rgb(16,185,129)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:bg-neutral-400"
                >
                  {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                  {isLoading ? t.updating : t.submitPassword}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
