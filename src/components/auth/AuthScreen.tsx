import React, { useState } from 'react';
import { Mail, ArrowRight, ChevronLeft, Sparkles } from 'lucide-react';
import { UserProfile } from '../../types';
import { loginWithGoogle, loginWithEmail, createAccount, resetPassword } from '../../services/auth';

interface AuthScreenProps {
  onAuthenticated: (user: UserProfile) => void;
}

type AuthMode = 'initial' | 'email_login' | 'create_account' | 'forgot_password';

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<AuthMode>('initial');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleGoogleAuth = async () => {
    setError(null);
    setLoading(true);
    try {
      const user = await loginWithGoogle();
      onAuthenticated(user);
    } catch (err: any) {
      setError(err?.message || 'Unable to connect to Google account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await loginWithEmail(email, password);
      onAuthenticated(user);
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await createAccount(email, password, username);
      onAuthenticated(user);
    } catch (err: any) {
      setError(err?.message || 'Could not create account. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const msg = await resetPassword(email);
      setInfoMessage(msg);
    } catch (err: any) {
      setError(err?.message || 'Could not request reset. Please verify your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden bg-[#07090e] selection:bg-[#252f48] selection:text-[#f2f1ed]">
      {/* Soft background moon & ambient glow */}
      <div 
        className="absolute top-12 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full pointer-events-none opacity-40 blur-3xl -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(196, 181, 253, 0.16) 0%, rgba(147, 197, 253, 0.04) 60%, transparent 80%)',
        }}
        aria-hidden="true"
      />

      <div className="w-full max-w-sm mx-auto text-center space-y-6">
        {/* Brand Lockup */}
        <div className="space-y-2">
          <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center shadow-[0_0_24px_rgba(200,220,255,0.1)] mb-4"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #f4f3ee 0%, #d8deeb 35%, #8a9bbd 80%, #526385 100%)',
            }}
          >
            <div className="w-full h-full rounded-full opacity-20 mix-blend-multiply bg-[#313f59]" />
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#f2f1ed] tracking-tight font-normal">
            Moonroom
          </h1>
          <p className="font-serif text-sm sm:text-base text-[#9aa2b5] italic">
            “A quiet place for a restless mind.”
          </p>
        </div>

        {/* Auth Container Card */}
        <div className="p-6 rounded-2xl bg-[#0e131d]/90 border border-white/[0.08] shadow-2xl backdrop-blur-md text-left transition-all">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 leading-relaxed">
              {error}
            </div>
          )}

          {infoMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 leading-relaxed">
              {infoMessage}
            </div>
          )}

          {/* MODE: INITIAL CHOICE */}
          {mode === 'initial' && (
            <div className="space-y-3.5">
              <p className="text-xs text-[#9aa2b5] text-center mb-4">
                Enter your private night room
              </p>

              {/* Continue with Google */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-[#f2f1ed] text-xs sm:text-sm font-medium border border-white/[0.1] transition-all flex items-center justify-center gap-3 group"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.1 7.5 23 12 23z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Continue with Email */}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setMode('email_login');
                }}
                disabled={loading}
                className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#9aa2b5] hover:text-[#f2f1ed] text-xs sm:text-sm font-medium border border-white/[0.06] transition-all flex items-center justify-center gap-2.5"
              >
                <Mail className="w-4 h-4 text-[#c4b5fd]" />
                <span>Continue with Email</span>
              </button>

              <div className="pt-4 border-t border-white/[0.06] text-center">
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setMode('create_account');
                  }}
                  className="text-xs text-[#c4b5fd] hover:text-[#f2f1ed] transition-colors"
                >
                  New here? Create an account
                </button>
              </div>
            </div>
          )}

          {/* MODE: EMAIL LOGIN */}
          {mode === 'email_login' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setMode('initial');
                  }}
                  className="text-xs text-[#626b80] hover:text-[#9aa2b5] flex items-center gap-1 -ml-1 py-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <span className="text-xs font-medium text-[#f2f1ed]">Sign In</span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-[#9aa2b5] uppercase tracking-wider font-mono">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@night.com"
                  className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs sm:text-sm text-[#f2f1ed] placeholder-[#626b80] focus:outline-none focus:border-[#c4b5fd]/60 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] text-[#9aa2b5] uppercase tracking-wider font-mono">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setMode('forgot_password');
                    }}
                    className="text-[11px] text-[#c4b5fd] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs sm:text-sm text-[#f2f1ed] placeholder-[#626b80] focus:outline-none focus:border-[#c4b5fd]/60 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[44px] mt-2 px-4 py-2.5 rounded-xl bg-[#c4b5fd]/20 hover:bg-[#c4b5fd]/30 text-[#f2f1ed] text-xs sm:text-sm font-medium border border-[#c4b5fd]/30 transition-colors flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Entering...' : 'Enter Moonroom'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="pt-3 border-t border-white/[0.06] text-center">
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setMode('create_account');
                  }}
                  className="text-xs text-[#9aa2b5] hover:text-[#f2f1ed] transition-colors"
                >
                  Don't have an account? <span className="text-[#c4b5fd]">Create account</span>
                </button>
              </div>
            </form>
          )}

          {/* MODE: CREATE ACCOUNT */}
          {mode === 'create_account' && (
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setMode('initial');
                  }}
                  className="text-xs text-[#626b80] hover:text-[#9aa2b5] flex items-center gap-1 -ml-1 py-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <span className="text-xs font-medium text-[#f2f1ed]">Create Account</span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-[#9aa2b5] uppercase tracking-wider font-mono">
                  Choose your Moonroom name
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. Luna, Night Walker, Serene Traveler"
                  className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs sm:text-sm text-[#f2f1ed] placeholder-[#626b80] focus:outline-none focus:border-[#c4b5fd]/60 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-[#9aa2b5] uppercase tracking-wider font-mono">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@night.com"
                  className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs sm:text-sm text-[#f2f1ed] placeholder-[#626b80] focus:outline-none focus:border-[#c4b5fd]/60 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-[#9aa2b5] uppercase tracking-wider font-mono">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs sm:text-sm text-[#f2f1ed] placeholder-[#626b80] focus:outline-none focus:border-[#c4b5fd]/60 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[44px] mt-2 px-4 py-2.5 rounded-xl bg-[#c4b5fd]/20 hover:bg-[#c4b5fd]/30 text-[#f2f1ed] text-xs sm:text-sm font-medium border border-[#c4b5fd]/30 transition-colors flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Creating space...' : 'Create Account'}</span>
                <Sparkles className="w-3.5 h-3.5 text-[#c4b5fd]" />
              </button>

              <div className="pt-3 border-t border-white/[0.06] text-center">
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setMode('email_login');
                  }}
                  className="text-xs text-[#9aa2b5] hover:text-[#f2f1ed] transition-colors"
                >
                  Already have an account? <span className="text-[#c4b5fd]">Sign in</span>
                </button>
              </div>
            </form>
          )}

          {/* MODE: FORGOT PASSWORD */}
          {mode === 'forgot_password' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setMode('email_login');
                  }}
                  className="text-xs text-[#626b80] hover:text-[#9aa2b5] flex items-center gap-1 -ml-1 py-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <span className="text-xs font-medium text-[#f2f1ed]">Forgot Password</span>
              </div>

              <p className="text-xs text-[#9aa2b5] leading-relaxed">
                Enter your account email to receive peaceful recovery instructions.
              </p>

              <div className="space-y-1">
                <label className="text-[11px] text-[#9aa2b5] uppercase tracking-wider font-mono">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@night.com"
                  className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs sm:text-sm text-[#f2f1ed] placeholder-[#626b80] focus:outline-none focus:border-[#c4b5fd]/60 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-[#f2f1ed] text-xs sm:text-sm font-medium border border-white/[0.1] transition-colors"
              >
                {loading ? 'Sending...' : 'Send Recovery Instructions'}
              </button>
            </form>
          )}
        </div>

        <p className="text-[11px] text-[#626b80]">
          Private on your device. No social feeds or tracking.
        </p>
      </div>
    </div>
  );
};
