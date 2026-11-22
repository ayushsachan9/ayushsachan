import React, { useState } from 'react';
import { Lock, Unlock, AlertCircle, X, KeyRound, Check } from 'lucide-react';
import { isEditorAuthenticated, loginWithPassword, logoutEditor } from '../utils/auth';

export default function AuthGateModal({ isOpen, onClose, onAuthSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const res = loginWithPassword(password);
    if (res.success) {
      setPassword('');
      onAuthSuccess?.();
      onClose();
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#121212] border border-neutral-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

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
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Enter Password to Edit
            </h3>
            <p className="text-xs text-neutral-400">
              Enter password to unlock editing.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              autoFocus
              required
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono tracking-wider"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold font-mono bg-emerald-500 hover:bg-emerald-400 text-black transition-colors"
            >
              Unlock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Top Bar Badge showing Lock / Edit mode status
export function AuthStatusBadge({ isEditor, onOpenLogin, onLogout }) {
  if (isEditor) {
    return (
      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Edit Mode</span>
        <span className="text-neutral-700">|</span>
        <button
          onClick={onLogout}
          className="text-neutral-400 hover:text-rose-400 transition-colors text-[11px]"
          title="Lock / Return to Read-Only mode"
        >
          Lock
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onOpenLogin}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 transition-colors group"
      title="Enter password to edit"
    >
      <Lock className="w-3.5 h-3.5 text-neutral-500 group-hover:text-emerald-400 transition-colors" />
      <span>Read-Only</span>
      <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
        Unlock
      </span>
    </button>
  );
}
