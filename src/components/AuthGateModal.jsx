import React, { useState } from 'react';
import { Lock, Unlock, Key, Eye, EyeOff, ShieldCheck, AlertCircle, X, Check } from 'lucide-react';
import { isEditorAuthenticated, loginWithPasscode, logoutEditor, updatePasscode } from '../utils/auth';

export default function AuthGateModal({ isOpen, onClose, onAuthSuccess }) {
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [changeSuccess, setChangeSuccess] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const res = await loginWithPasscode(passcode);
    if (res.success) {
      setPasscode('');
      onAuthSuccess?.();
      onClose();
    } else {
      setError(res.error || 'Invalid passcode.');
    }
  };

  const handleChangePin = async (e) => {
    e.preventDefault();
    setError('');
    setChangeSuccess('');

    if (newPin !== confirmPin) {
      setError('New passcodes do not match.');
      return;
    }

    const res = await updatePasscode(oldPin, newPin);
    if (res.success) {
      setChangeSuccess('Passcode updated successfully!');
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
      setTimeout(() => {
        setIsChangingPin(false);
        setChangeSuccess('');
      }, 1500);
    } else {
      setError(res.error || 'Failed to update passcode.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#121212] border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              {isChangingPin ? 'Update Editor Passcode' : 'Ayush Sachan • Editor Access'}
            </h3>
            <p className="text-xs text-neutral-400">
              {isChangingPin
                ? 'Choose a new private passcode to protect your checklist.'
                : 'Enter your passcode to unlock editing mode.'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {changeSuccess && (
          <div className="mb-4 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{changeSuccess}</span>
          </div>
        )}

        {!isChangingPin ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-medium text-neutral-300 mb-1.5">
                Passcode
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode..."
                  autoFocus
                  required
                  className="w-full pl-3.5 pr-10 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1.5">
                Default passcode is set to <span className="text-neutral-300 font-mono">ayush2026</span> (you can change it anytime once unlocked).
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setIsChangingPin(true);
                }}
                className="text-xs text-neutral-400 hover:text-white underline underline-offset-4"
              >
                Change Passcode
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold font-mono bg-emerald-500 hover:bg-emerald-400 text-black transition-colors"
              >
                Unlock Editor
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleChangePin} className="space-y-3">
            <div>
              <label className="block text-xs font-mono text-neutral-300 mb-1">
                Current Passcode
              </label>
              <input
                type="password"
                value={oldPin}
                onChange={(e) => setOldPin(e.target.value)}
                required
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white focus:outline-none focus:border-neutral-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-300 mb-1">
                New Passcode (Min 4 chars)
              </label>
              <input
                type="password"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                required
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white focus:outline-none focus:border-neutral-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-300 mb-1">
                Confirm New Passcode
              </label>
              <input
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                required
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white focus:outline-none focus:border-neutral-600 font-mono"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setIsChangingPin(false);
                }}
                className="text-xs text-neutral-400 hover:text-white"
              >
                Back to Login
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold font-mono bg-emerald-500 hover:bg-emerald-400 text-black transition-colors"
              >
                Save New Passcode
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// Reusable Top Bar Badge component showing Lock Status
export function AuthStatusBadge({ isEditor, onOpenLogin, onLogout, onChangePinClick }) {
  if (isEditor) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Editor Mode</span>
        <span className="text-neutral-600">|</span>
        <button
          onClick={onLogout}
          className="text-neutral-400 hover:text-rose-400 transition-colors ml-0.5"
          title="Lock / Return to Read-Only mode"
        >
          Lock
        </button>
        <button
          onClick={onChangePinClick}
          className="text-neutral-400 hover:text-white transition-colors"
          title="Change Editor Passcode"
        >
          <Key className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onOpenLogin}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 transition-colors group"
      title="Unlock Editor (Only Ayush Sachan)"
    >
      <Lock className="w-3.5 h-3.5 text-neutral-500 group-hover:text-emerald-400 transition-colors" />
      <span>Read-Only</span>
      <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
        Unlock
      </span>
    </button>
  );
}
