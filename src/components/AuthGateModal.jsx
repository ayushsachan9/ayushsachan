import React, { useState } from 'react';
import { Mail, Lock, CheckCircle2, AlertCircle, X, Check, ShieldCheck, LogOut, UserCheck } from 'lucide-react';
import { AUTHORIZED_EMAILS, getAuthorizedEmail, loginWithEmail, logoutEditor } from '../utils/auth';

export default function AuthGateModal({ isOpen, onClose, onAuthSuccess }) {
  const [emailInput, setEmailInput] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSelectEmail = (email) => {
    setError('');
    const res = loginWithEmail(email);
    if (res.success) {
      setSuccessMsg(`Authenticated as ${res.email}`);
      setTimeout(() => {
        setSuccessMsg('');
        onAuthSuccess?.(res.email);
        onClose();
      }, 700);
    } else {
      setError(res.error);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    handleSelectEmail(emailInput);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#121212] border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-44 h-44 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

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
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Ayush Sachan • Editor Access
            </h3>
            <p className="text-xs text-neutral-400">
              Only authorized emails can edit this page.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {/* 1-Click Authorized Email Selector */}
        <div className="mb-5">
          <label className="block text-xs font-mono font-medium text-neutral-400 uppercase tracking-wider mb-2">
            Select Your Account:
          </label>
          <div className="space-y-2">
            {AUTHORIZED_EMAILS.map((email) => (
              <button
                key={email}
                onClick={() => handleSelectEmail(email)}
                className="w-full text-left p-3 rounded-xl border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 hover:border-neutral-700 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-colors">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-white group-hover:text-emerald-300 transition-colors">
                      {email}
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono">
                      Authorized Owner
                    </div>
                  </div>
                </div>

                <span className="text-[11px] font-mono font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                  Authorize
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Manual Email Input */}
        <div className="pt-3 border-t border-neutral-850">
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                Or enter email manually:
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono bg-emerald-500 hover:bg-emerald-400 text-black transition-colors"
              >
                Verify & Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Top Bar Badge showing logged in Email / Read-Only status
export function AuthStatusBadge({ userEmail, onOpenLogin, onLogout }) {
  if (userEmail) {
    return (
      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="hidden md:inline truncate max-w-[170px]" title={userEmail}>
          {userEmail}
        </span>
        <span className="md:hidden">Editor</span>
        <span className="text-neutral-700">|</span>
        <button
          onClick={onLogout}
          className="text-neutral-400 hover:text-rose-400 transition-colors flex items-center gap-1 text-[11px]"
          title="Sign out of editor mode"
        >
          <LogOut className="w-3 h-3" />
          <span>Exit</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onOpenLogin}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 transition-colors group"
      title="Sign in with authorized email to edit"
    >
      <Lock className="w-3.5 h-3.5 text-neutral-500 group-hover:text-emerald-400 transition-colors" />
      <span>Read-Only</span>
      <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
        Sign In
      </span>
    </button>
  );
}
